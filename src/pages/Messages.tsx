import { useEffect, useMemo, useRef, useState, FormEvent } from "react";
import { useNavigate, useSearchParams, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, MessageCircle, ArrowLeft, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";
import { formatSellerName } from "@/lib/sellerName";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type ConversationRow = {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  updated_at: string;
};

type ListingLite = {
  id: string;
  title: string;
  status: string;
  seller_id: string;
};

type ProfileLite = { user_id: string; first_name: string | null; last_name: string | null };

type MessageRow = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
};

type ThreadInfo = {
  conv: ConversationRow;
  listing?: ListingLite;
  otherName: string;
  otherId: string;
  lastMessage?: MessageRow;
  unread: number;
};

const MessagesContent = () => {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [threads, setThreads] = useState<ThreadInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get("thread"));
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const listingParam = searchParams.get("listing");

  // Ensure a conversation exists for ?listing=xxx (buyer opens contact)
  useEffect(() => {
    if (!user || !listingParam) return;
    (async () => {
      const { data: listing, error: listErr } = await supabase
        .from("listings")
        .select("id, seller_id, status")
        .eq("id", listingParam)
        .maybeSingle();
      if (listErr || !listing) {
        toast.error(language === "it" ? "Annuncio non trovato" : "Listing not found");
        setSearchParams({}, { replace: true });
        return;
      }
      if (listing.seller_id === user.id) {
        // Seller can't open buyer-side flow. Just clear param.
        setSearchParams({}, { replace: true });
        return;
      }
      if (listing.status !== "active") {
        toast.error(
          language === "it"
            ? "Questo annuncio non è più disponibile."
            : "This listing is no longer available."
        );
        setSearchParams({}, { replace: true });
        return;
      }

      // Try find existing
      const { data: existing } = await supabase
        .from("conversations")
        .select("id")
        .eq("listing_id", listing.id)
        .eq("buyer_id", user.id)
        .maybeSingle();

      let convId = existing?.id as string | undefined;
      if (!convId) {
        const { data: created, error: cErr } = await supabase
          .from("conversations")
          .insert({
            listing_id: listing.id,
            buyer_id: user.id,
            seller_id: listing.seller_id,
          })
          .select("id")
          .single();
        if (cErr) {
          toast.error(cErr.message);
          return;
        }
        convId = created.id;
      }

      setSearchParams({ thread: convId! }, { replace: true });
      setSelectedId(convId!);
      await loadThreads();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, listingParam]);

  const loadThreads = async () => {
    if (!user) return;
    setLoading(true);
    const { data: convs, error } = await supabase
      .from("conversations")
      .select("id, listing_id, buyer_id, seller_id, updated_at")
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order("updated_at", { ascending: false });
    if (error || !convs) {
      setThreads([]);
      setLoading(false);
      return;
    }

    const listingIds = Array.from(new Set(convs.map((c) => c.listing_id)));
    const otherIds = Array.from(
      new Set(convs.map((c) => (c.buyer_id === user.id ? c.seller_id : c.buyer_id)))
    );
    const convIds = convs.map((c) => c.id);

    const [listingsRes, profilesRes, msgsRes] = await Promise.all([
      listingIds.length
        ? supabase
            .from("listings")
            .select("id, title, status, seller_id")
            .in("id", listingIds)
        : Promise.resolve({ data: [] as ListingLite[] }),
      otherIds.length
        ? supabase
            .from("profiles")
            .select("user_id, first_name, last_name")
            .in("user_id", otherIds)
        : Promise.resolve({ data: [] as ProfileLite[] }),
      convIds.length
        ? supabase
            .from("messages")
            .select("id, conversation_id, sender_id, body, created_at, read_at")
            .in("conversation_id", convIds)
            .order("created_at", { ascending: false })
        : Promise.resolve({ data: [] as MessageRow[] }),
    ]);

    const listingMap = new Map<string, ListingLite>(
      (listingsRes.data || []).map((l: any) => [l.id, l])
    );
    const profMap = new Map<string, ProfileLite>(
      (profilesRes.data || []).map((p: any) => [p.user_id, p])
    );
    const allMsgs = (msgsRes.data || []) as MessageRow[];
    const lastByConv = new Map<string, MessageRow>();
    const unreadByConv = new Map<string, number>();
    for (const m of allMsgs) {
      if (!lastByConv.has(m.conversation_id)) lastByConv.set(m.conversation_id, m);
      if (m.sender_id !== user.id && !m.read_at) {
        unreadByConv.set(m.conversation_id, (unreadByConv.get(m.conversation_id) || 0) + 1);
      }
    }

    const built: ThreadInfo[] = convs.map((c) => {
      const otherId = c.buyer_id === user.id ? c.seller_id : c.buyer_id;
      const p = profMap.get(otherId);
      return {
        conv: c,
        listing: listingMap.get(c.listing_id),
        otherName: formatSellerName(p?.first_name ?? null, p?.last_name ?? null),
        otherId,
        lastMessage: lastByConv.get(c.id),
        unread: unreadByConv.get(c.id) || 0,
      };
    });
    setThreads(built);
    setLoading(false);
  };

  useEffect(() => {
    if (user) loadThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Load messages for selected thread
  useEffect(() => {
    if (!selectedId || !user) {
      setMessages([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setMsgLoading(true);
      const { data } = await supabase
        .from("messages")
        .select("id, conversation_id, sender_id, body, created_at, read_at")
        .eq("conversation_id", selectedId)
        .order("created_at", { ascending: true });
      if (cancelled) return;
      const rows = (data || []) as MessageRow[];
      setMessages(rows);
      setMsgLoading(false);

      // Mark incoming unread as read
      const unreadIds = rows
        .filter((m) => m.sender_id !== user.id && !m.read_at)
        .map((m) => m.id);
      if (unreadIds.length) {
        await supabase
          .from("messages")
          .update({ read_at: new Date().toISOString() })
          .in("id", unreadIds);
        // Refresh thread list unread counts
        loadThreads();
      }

      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
      }, 50);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, user]);

  // Realtime subscription for new messages in selected thread
  useEffect(() => {
    if (!selectedId) return;
    const ch = supabase
      .channel(`messages-${selectedId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedId}`,
        },
        (payload) => {
          setMessages((prev) =>
            prev.some((m) => m.id === (payload.new as any).id)
              ? prev
              : [...prev, payload.new as MessageRow]
          );
          setTimeout(() => {
            scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
          }, 30);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [selectedId]);

  const selected = useMemo(
    () => threads.find((th) => th.conv.id === selectedId) || null,
    [threads, selectedId]
  );

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setSearchParams({ thread: id }, { replace: true });
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !selectedId || !body.trim()) return;
    if (selected?.listing && selected.listing.status !== "active") {
      toast.error(
        language === "it"
          ? "Questo annuncio non è più attivo."
          : "This listing is no longer active."
      );
      return;
    }
    setSending(true);
    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: selectedId,
        sender_id: user.id,
        body: body.trim(),
      })
      .select("id, conversation_id, sender_id, body, created_at, read_at")
      .single();
    setSending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setMessages((prev) =>
      prev.some((m) => m.id === (data as any).id) ? prev : [...prev, data as MessageRow]
    );
    setBody("");
    loadThreads();
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    }, 30);
  };

  if (authLoading) {
    return (
      <MainLayout>
        <div className="container py-20 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }
  if (!user) {
    const next = `/messages${listingParam ? `?listing=${listingParam}` : ""}`;
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />;
  }

  const soldNote =
    language === "it" ? "Questo libro è stato venduto" : "This book has been sold";
  const noThreads =
    language === "it" ? "Nessun messaggio" : "No messages yet";
  const writePlaceholder =
    language === "it" ? "Scrivi un messaggio" : "Write a message";
  const sendLabel = language === "it" ? "Invia messaggio" : "Send message";
  const title = language === "it" ? "Messaggi" : "Messages";
  const roleBadge = (thread: ThreadInfo) =>
    thread.conv.buyer_id === user.id
      ? language === "it" ? "Acquirente" : "Buyer"
      : language === "it" ? "Venditore" : "Seller";

  return (
    <MainLayout>
      <div className="container max-w-5xl py-8">
        <div className="mb-6 flex items-center gap-3">
          <MessageCircle className="h-6 w-6 text-primary" />
          <h1 className="font-display text-2xl font-bold">{title}</h1>
        </div>

        <div className="grid md:grid-cols-[320px_1fr] gap-4 rounded-2xl border border-border bg-card min-h-[520px] overflow-hidden">
          {/* Threads list */}
          <aside
            className={cn(
              "border-r border-border bg-muted/20",
              selectedId && "hidden md:block"
            )}
          >
            {loading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : threads.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground text-center">{noThreads}</p>
            ) : (
              <ul className="divide-y divide-border">
                {threads.map((th) => {
                  const isActive = th.conv.id === selectedId;
                  const isSold = th.listing?.status === "sold";
                  return (
                    <li key={th.conv.id}>
                      <button
                        onClick={() => handleSelect(th.conv.id)}
                        className={cn(
                          "w-full text-left px-4 py-3 hover:bg-muted transition-colors",
                          isActive && "bg-primary/5"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-semibold text-primary">
                            {roleBadge(th)}
                          </span>
                          {th.unread > 0 && (
                            <Badge className="h-5 min-w-5 px-1.5 rounded-full text-[10px]">
                              {th.unread}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium text-foreground line-clamp-1">
                          {th.listing?.title || "—"}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {th.otherName}
                          {isSold && (
                            <span className="ml-1 text-destructive">· {soldNote}</span>
                          )}
                        </p>
                        {th.lastMessage && (
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                            {th.lastMessage.sender_id === user.id ? "→ " : ""}
                            {th.lastMessage.body}
                          </p>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>

          {/* Thread view */}
          <section
            className={cn(
              "flex flex-col min-h-[520px]",
              !selectedId && "hidden md:flex"
            )}
          >
            {!selected ? (
              <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground p-8 text-center">
                {threads.length === 0
                  ? noThreads
                  : language === "it"
                  ? "Seleziona una conversazione"
                  : "Select a conversation"}
              </div>
            ) : (
              <>
                <div className="border-b border-border px-4 py-3 flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => {
                      setSelectedId(null);
                      setSearchParams({}, { replace: true });
                    }}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground line-clamp-1">
                      {selected.listing?.title || "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selected.otherName} · {roleBadge(selected)}
                      {selected.listing?.status === "sold" && (
                        <span className="ml-1 text-destructive">· {soldNote}</span>
                      )}
                    </p>
                  </div>
                </div>

                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 bg-muted/10">
                  {msgLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  ) : messages.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-8">{noThreads}</p>
                  ) : (
                    messages.map((m) => {
                      const mine = m.sender_id === user.id;
                      return (
                        <div
                          key={m.id}
                          className={cn("flex", mine ? "justify-end" : "justify-start")}
                        >
                          <div
                            className={cn(
                              "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm shadow-sm",
                              mine
                                ? "bg-primary text-primary-foreground rounded-br-sm"
                                : "bg-card border border-border rounded-bl-sm"
                            )}
                          >
                            <p className="whitespace-pre-wrap break-words">{m.body}</p>
                            <p
                              className={cn(
                                "mt-1 text-[10px] opacity-70",
                                mine ? "text-primary-foreground" : "text-muted-foreground"
                              )}
                            >
                              {new Date(m.created_at).toLocaleString(language === "it" ? "it-IT" : "en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                                day: "2-digit",
                                month: "short",
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <form onSubmit={handleSend} className="border-t border-border p-3 flex items-center gap-2">
                  <Input
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder={writePlaceholder}
                    disabled={sending || selected.listing?.status === "sold"}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={sending || !body.trim() || selected.listing?.status === "sold"}
                    className="gap-1.5"
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">{sendLabel}</span>
                  </Button>
                </form>
              </>
            )}
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

const Messages = () => <MessagesContent />;
export default Messages;
