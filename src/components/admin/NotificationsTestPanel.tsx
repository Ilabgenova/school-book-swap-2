import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail, RefreshCw, Send } from "lucide-react";

type NotificationLog = {
  id: string;
  message_id: string | null;
  sender_user_id: string | null;
  recipient_user_id: string | null;
  recipient_email: string | null;
  status: "pending" | "sent" | "failed" | "skipped";
  provider_response: string | null;
  error_message: string | null;
  created_at: string;
  sent_at: string | null;
};

type EmailLog = {
  message_id: string | null;
  status: string;
  error_message: string | null;
  created_at: string;
};

const statusVariant = (status: string) => {
  if (status === "sent") return "default" as const;
  if (status === "failed") return "destructive" as const;
  if (status === "skipped") return "outline" as const;
  return "secondary" as const;
};

export const NotificationsTestPanel = () => {
  const [recipient, setRecipient] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messageLogs, setMessageLogs] = useState<NotificationLog[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);

  const latestByMessageId = useMemo(() => {
    const map = new Map<string, EmailLog>();
    for (const row of emailLogs) {
      if (!row.message_id) continue;
      const prev = map.get(row.message_id);
      if (!prev || new Date(row.created_at) > new Date(prev.created_at)) map.set(row.message_id, row);
    }
    return map;
  }, [emailLogs]);

  const load = async () => {
    setLoading(true);
    const [messageRes, emailRes] = await Promise.all([
      supabase
        .from("message_notification_log" as any)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("email_send_log" as any)
        .select("message_id, status, error_message, created_at")
        .in("template_name", ["new-message", "email-test"])
        .order("created_at", { ascending: false })
        .limit(100),
    ]);

    if (messageRes.error) toast.error(messageRes.error.message);
    else setMessageLogs((messageRes.data as unknown as NotificationLog[]) || []);

    if (emailRes.error) toast.error(emailRes.error.message);
    else setEmailLogs((emailRes.data as unknown as EmailLog[]) || []);

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const sendTest = async () => {
    const target = recipient.trim();
    if (!target || !target.includes("@")) return toast.error("Enter a valid email address");
    setSending(true);
    const { data, error } = await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "email-test",
        recipientEmail: target,
        idempotencyKey: `admin-email-test-${Date.now()}`,
      },
    });
    setSending(false);
    if (error) {
      toast.error(error.message || "Email test failed");
    } else if ((data as any)?.success) {
      toast.success("Test email queued. Refresh logs to see delivery status.");
      setRecipient("");
    } else {
      toast.error((data as any)?.error || "Email test did not queue");
    }
    load();
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="mb-4 flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <div>
            <p className="font-display text-lg font-semibold">Notifications Test</p>
            <p className="text-sm text-muted-foreground">
              Send a direct admin-only test email and inspect message notification results.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            type="email"
            placeholder="recipient@example.com"
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
          />
          <Button onClick={sendTest} disabled={sending} className="gap-2 sm:w-auto">
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send test
          </Button>
          <Button variant="outline" onClick={load} disabled={loading} className="gap-2 sm:w-auto">
            <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            Refresh
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="font-medium">Message notification log</p>
          <Badge variant="outline">{messageLogs.length}</Badge>
        </div>
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : messageLogs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No message notification attempts logged yet.</p>
        ) : (
          <div className="space-y-2">
            {messageLogs.map((row) => {
              const latest = row.message_id ? latestByMessageId.get(row.message_id) : null;
              const effectiveStatus = latest?.status === "sent"
                ? "sent"
                : row.status === "pending" && latest?.status === "dlq"
                  ? "failed"
                  : row.status;
              const error = row.error_message || latest?.error_message;
              return (
                <div key={row.id} className="rounded-lg border border-border p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={statusVariant(effectiveStatus)}>{effectiveStatus}</Badge>
                    {latest?.status && latest.status !== effectiveStatus && <Badge variant="outline">queue: {latest.status}</Badge>}
                    <span className="text-sm font-medium break-all">{row.recipient_email || "No recipient"}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Message {row.message_id ? `${row.message_id.slice(0, 8)}…` : "—"} · {new Date(row.created_at).toLocaleString()}
                    {row.sent_at ? ` · sent ${new Date(row.sent_at).toLocaleString()}` : ""}
                  </p>
                  {row.provider_response && <p className="mt-1 text-xs text-muted-foreground break-words">{row.provider_response}</p>}
                  {error && <p className="mt-2 rounded-md bg-destructive/10 p-2 text-xs text-destructive break-words">{error}</p>}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};