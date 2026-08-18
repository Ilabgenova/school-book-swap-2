import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Check, X, Archive, Loader2, Lightbulb } from "lucide-react";

type Tip = {
  id: string;
  entity_provider_name: string;
  activity_opportunity_name: string;
  brief_description: string;
  personal_feedback: string;
  location: string | null;
  website_url: string | null;
  email: string | null;
  phone: string | null;
  social_page: string | null;
  language: string | null;
  approximate_cost: string | null;
  period: string | null;
  approximate_age_range_suitable_level: string[] | null;
  would_recommend_again: boolean | null;
  status: string;
  admin_notes: string | null;
  rejection_reason: string | null;
  created_at: string;
};

const STATUSES = ["pending_review", "approved", "rejected", "archived"] as const;

export const CommunityTipsPanel = () => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("pending_review");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("admin_list_community_tips");
    if (error) toast.error(error.message);
    setTips((data as Tip[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (tip: Tip, status: string) => {
    setBusy(tip.id);
    const note = notes[tip.id]?.trim() || null;
    const { data: auth } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("parent_community_tips")
      .update({
        status: status as never,
        admin_notes: note,
        rejection_reason: status === "rejected" ? note : null,
        admin_reviewed_by: auth.user?.id ?? null,
        admin_reviewed_at: new Date().toISOString(),
        published_at: status === "approved" ? new Date().toISOString() : null,
      })
      .eq("id", tip.id);
    setBusy(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Tip ${status}`);
    load();
  };

  const visible = tips.filter((t) => t.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Button
            key={s}
            size="sm"
            variant={filter === s ? "default" : "outline"}
            onClick={() => setFilter(s)}
          >
            {s.replace("_", " ")} ({tips.filter((t) => t.status === s).length})
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          <Lightbulb className="h-6 w-6 mx-auto mb-2" />
          No tips with this status.
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((tip) => (
            <div key={tip.id} className="rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-foreground">{tip.activity_opportunity_name}</h3>
                  <p className="text-sm text-muted-foreground">{tip.entity_provider_name}</p>
                </div>
                <Badge variant="secondary">{tip.status.replace("_", " ")}</Badge>
              </div>

              <p className="text-sm text-foreground/90">{tip.brief_description}</p>
              <p className="text-sm italic text-muted-foreground border-l-2 border-accent/40 pl-3">
                {tip.personal_feedback}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {(tip.approximate_age_range_suitable_level ?? []).map((l) => (
                  <Badge key={l} variant="outline" className="text-[11px]">{l}</Badge>
                ))}
              </div>

              <div className="text-xs text-muted-foreground space-x-3">
                {tip.location && <span>{tip.location}</span>}
                {tip.period && <span>{tip.period}</span>}
                {tip.approximate_cost && <span>{tip.approximate_cost}</span>}
                {tip.language && <span>{tip.language}</span>}
                {tip.website_url && (
                  <a href={tip.website_url} target="_blank" rel="noopener noreferrer" className="text-accent underline">
                    website
                  </a>
                )}
                {tip.email && <span>{tip.email}</span>}
                {tip.phone && <span>{tip.phone}</span>}
              </div>

              <Textarea
                placeholder="Admin note / rejection reason"
                value={notes[tip.id] ?? tip.admin_notes ?? ""}
                onChange={(e) => setNotes((n) => ({ ...n, [tip.id]: e.target.value }))}
                rows={2}
              />

              <div className="flex flex-wrap gap-2">
                <Button size="sm" disabled={busy === tip.id} onClick={() => update(tip, "approved")}>
                  <Check className="h-4 w-4" /> Approve & publish
                </Button>
                <Button size="sm" variant="destructive" disabled={busy === tip.id} onClick={() => update(tip, "rejected")}>
                  <X className="h-4 w-4" /> Reject
                </Button>
                <Button size="sm" variant="outline" disabled={busy === tip.id} onClick={() => update(tip, "archived")}>
                  <Archive className="h-4 w-4" /> Archive
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
