import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type Report = {
  id: string;
  user_id: string;
  category: string;
  title: string;
  description: string;
  related_listing_id: string | null;
  status: "open" | "in_progress" | "resolved" | "closed";
  admin_notes: string | null;
  created_at: string;
};

const STATUS: Report["status"][] = ["open", "in_progress", "resolved", "closed"];

const STATUS_LABEL: Record<string, string> = {
  open: "Open",
  in_progress: "In progress",
  resolved: "Resolved",
  closed: "Closed",
};

const CATEGORY_LABEL: Record<string, string> = {
  technical: "Technical",
  listing: "Listing",
  messages: "Messages",
  translation: "Translation",
  transaction: "Transaction",
  suspicious: "Suspicious listing",
  suggestion: "Suggestion",
  other: "Other",
};

export const FeedbackPanel = () => {
  const [items, setItems] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("open");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [profiles, setProfiles] = useState<
    Record<string, { first_name: string | null; last_name: string | null }>
  >({});

  const load = async () => {
    setLoading(true);
    let q = supabase
      .from("feedback_reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (filter !== "all") q = q.eq("status", filter as Report["status"]);
    const { data, error } = await q;
    if (error) toast.error(error.message);
    const rows = (data as Report[]) || [];
    setItems(rows);

    const ids = Array.from(new Set(rows.map((r) => r.user_id)));
    if (ids.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("user_id, first_name, last_name")
        .in("user_id", ids);
      const map: typeof profiles = {};
      (profs || []).forEach((p: any) => {
        map[p.user_id] = { first_name: p.first_name, last_name: p.last_name };
      });
      setProfiles(map);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("admin-feedback-reports")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "feedback_reports" },
        () => load()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const updateStatus = async (r: Report, status: Report["status"]) => {
    const { error } = await supabase
      .from("feedback_reports")
      .update({
        status,
        admin_notes: notes[r.id] ?? r.admin_notes,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", r.id);
    if (error) toast.error(error.message);
    else toast.success("Report updated");
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm text-muted-foreground">Status</label>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {STATUS.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={load}>
          Refresh
        </Button>
      </div>

      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reports.</p>
      ) : (
        <div className="space-y-3">
          {items.map((r) => {
            const p = profiles[r.user_id];
            const name = p
              ? `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || "DISbook user"
              : "DISbook user";
            return (
              <Card key={r.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium break-words">{r.title}</p>
                      <Badge variant="outline">
                        {CATEGORY_LABEL[r.category] ?? r.category}
                      </Badge>
                      <Badge
                        variant={
                          r.status === "open"
                            ? "destructive"
                            : r.status === "resolved"
                              ? "sale"
                              : "secondary"
                        }
                      >
                        {STATUS_LABEL[r.status]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      From {name} · {new Date(r.created_at).toLocaleString()}
                      {r.related_listing_id && ` · Listing ${r.related_listing_id}`}
                    </p>
                  </div>
                </div>
                <p className="text-sm whitespace-pre-wrap">{r.description}</p>

                <Textarea
                  rows={2}
                  placeholder="Internal admin note (optional)"
                  defaultValue={r.admin_notes ?? ""}
                  onChange={(e) =>
                    setNotes((prev) => ({ ...prev, [r.id]: e.target.value }))
                  }
                />

                <div className="flex gap-2 flex-wrap">
                  {STATUS.filter((s) => s !== r.status).map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={s === "resolved" ? "default" : "outline"}
                      onClick={() => updateStatus(r, s)}
                    >
                      Mark as {STATUS_LABEL[s]}
                    </Button>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
