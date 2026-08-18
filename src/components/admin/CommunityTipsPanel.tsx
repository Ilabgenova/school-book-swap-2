import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import { toast } from "sonner";
import { Check, X, Archive, Loader2, Lightbulb, Trash2, Paperclip, ThumbsUp, Heart, Languages } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { FlyerButton } from "@/components/tips/FlyerButton";

type Tip = {
  id: string;
  submitted_by_user_id: string;
  entity_provider_name: string;
  activity_opportunity_name: string;
  brief_description: string;
  personal_feedback: string;
  contact_information: string | null;
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
  photo_logo_url: string | null;
  tried_activity: string | null;
  flyer_file_path: string | null;
  flyer_file_name: string | null;
  flyer_file_type: string | null;
  flyer_file_size: number | null;
  status: string;
  reactions_enabled: boolean | null;
  original_language: string | null;
  activity_name_it: string | null;
  activity_name_en: string | null;
  brief_description_it: string | null;
  brief_description_en: string | null;
  personal_feedback_it: string | null;
  personal_feedback_en: string | null;
  translation_status: string | null;
  admin_notes: string | null;
  rejection_reason: string | null;
  created_at: string;
};

type Submitter = {
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  recommended_by_name: string | null;
};

const STATUSES = ["pending_review", "approved", "rejected", "archived"] as const;

const REJECTION_REASONS = [
  "Missing contact information",
  "Missing personal feedback",
  "Personal feedback too generic",
  "Missing age range / suitable school level",
  "Inappropriate or unrelated flyer",
  "Flyer contains personal/private information",
  "Flyer file is unreadable or unsafe",
  "Misleading feedback",
  "Not relevant for students/families",
  "Inappropriate content",
  "Commercial/spam content",
  "Duplicate tip",
  "Other",
];

const formatSize = (bytes?: number | null) =>
  bytes ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : "—";

export const CommunityTipsPanel = () => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("pending_review");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [submitters, setSubmitters] = useState<Record<string, Submitter>>({});
  const [counts, setCounts] = useState<Record<string, { thumbs_up_count: number; heart_count: number }>>({});
  const [translating, setTranslating] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Record<string, string>>>({});

  const draftValue = (tip: Tip, key: string) =>
    drafts[tip.id]?.[key] ?? ((tip[key as keyof Tip] as string | null) ?? "");

  const setDraft = (tipId: string, key: string, value: string) =>
    setDrafts((prev) => ({ ...prev, [tipId]: { ...prev[tipId], [key]: value } }));

  const saveTranslation = async (tip: Tip) => {
    const patch = drafts[tip.id];
    if (!patch) return;
    setBusy(tip.id);
    const { error } = await supabase
      .from("parent_community_tips")
      .update({ ...patch, translation_status: "ready", translated_at: new Date().toISOString() } as never)
      .eq("id", tip.id);
    setBusy(null);
    if (error) return toast.error(error.message);
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[tip.id];
      return next;
    });
    toast.success("Translation saved");
    load();
  };

  const generateTranslation = async (tipId?: string) => {
    setTranslating(tipId ?? "backfill");
    const { data, error } = await supabase.functions.invoke("translate-tip", {
      body: tipId ? { tip_id: tipId } : { backfill: true },
    });
    setTranslating(null);
    if (error) return toast.error(error.message);
    toast.success(`Translation generated (${(data as { processed?: number })?.processed ?? 0} tip(s))`);
    load();
  };

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("admin_list_community_tips");
    if (error) toast.error(error.message);
    const rows = (data as unknown as Tip[]) ?? [];
    setTips(rows);
    const ids = Array.from(new Set(rows.map((t) => t.submitted_by_user_id).filter(Boolean)));
    if (ids.length) {
      const { data: subs } = await supabase.rpc("admin_get_tip_submitters", { _user_ids: ids });
      const map: Record<string, Submitter> = {};
      ((subs as Submitter[]) ?? []).forEach((s) => {
        map[s.user_id] = s;
      });
      setSubmitters(map);
    }
    const tipIds = rows.map((t) => t.id);
    if (tipIds.length) {
      const { data: rc } = await supabase.rpc("admin_get_tip_reaction_counts", { _tip_ids: tipIds });
      const cmap: Record<string, { thumbs_up_count: number; heart_count: number }> = {};
      ((rc as { tip_id: string; thumbs_up_count: number; heart_count: number }[]) ?? []).forEach((r) => {
        cmap[r.tip_id] = { thumbs_up_count: r.thumbs_up_count, heart_count: r.heart_count };
      });
      setCounts(cmap);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (tip: Tip, status: string) => {
    setBusy(tip.id);
    const note = notes[tip.id]?.trim() || null;
    const reason = reasons[tip.id] || null;
    const { data: auth } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("parent_community_tips")
      .update({
        status: status as never,
        admin_notes: note,
        rejection_reason: status === "rejected" ? reason ?? note : null,
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

  const setTried = async (tip: Tip, value: string) => {
    const { error } = await supabase
      .from("parent_community_tips")
      .update({ tried_activity: value })
      .eq("id", tip.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setTips((prev) => prev.map((t) => (t.id === tip.id ? { ...t, tried_activity: value } : t)));
  };

  const setReactionsEnabled = async (tip: Tip, value: boolean) => {
    const { error } = await supabase
      .from("parent_community_tips")
      .update({ reactions_enabled: value })
      .eq("id", tip.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setTips((prev) => prev.map((t) => (t.id === tip.id ? { ...t, reactions_enabled: value } : t)));
  };

  const removeFlyer = async (tip: Tip) => {
    if (!tip.flyer_file_path) return;
    setBusy(tip.id);
    const { error: storageError } = await supabase.storage.from("tip-flyers").remove([tip.flyer_file_path]);
    if (storageError) {
      setBusy(null);
      toast.error(storageError.message);
      return;
    }
    const { error } = await supabase
      .from("parent_community_tips")
      .update({
        flyer_file_path: null,
        flyer_file_name: null,
        flyer_file_type: null,
        flyer_file_size: null,
        flyer_uploaded_at: null,
      })
      .eq("id", tip.id);
    setBusy(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Flyer removed");
    load();
  };

  const visible = tips.filter((t) => t.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => generateTranslation()}
          disabled={translating !== null}
        >
          {translating === "backfill" ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Languages className="h-4 w-4 mr-1" />
          )}
          Backfill missing translations
        </Button>
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
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Submitted by{" "}
                    {[submitters[tip.submitted_by_user_id]?.first_name, submitters[tip.submitted_by_user_id]?.last_name]
                      .filter(Boolean)
                      .join(" ") || tip.submitted_by_user_id?.slice(0, 8) + "…"}
                    {submitters[tip.submitted_by_user_id]?.email
                      ? ` (${submitters[tip.submitted_by_user_id]?.email})`
                      : ""}{" "}
                    on {new Date(tip.created_at).toLocaleString()}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Public label: “Recommended by:{" "}
                    {submitters[tip.submitted_by_user_id]?.recommended_by_name ?? "DISbook community member"}”
                  </p>
                </div>
                <Badge variant="secondary">{tip.status.replace("_", " ")}</Badge>
              </div>

              <p className="text-sm text-foreground/90">{tip.brief_description}</p>
              <p className="text-sm italic text-muted-foreground border-l-2 border-accent/40 pl-3">
                {tip.personal_feedback}
              </p>

              <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-foreground">
                    Bilingual content · original: {(tip.original_language ?? "it") === "en" ? "English" : "Italian"} ·{" "}
                    <span className={tip.translation_status === "ready" ? "text-accent" : "text-destructive"}>
                      {tip.translation_status === "ready" ? "translation ready" : "translation missing"}
                    </span>
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => generateTranslation(tip.id)}
                    disabled={translating !== null}
                  >
                    {translating === tip.id ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Languages className="h-4 w-4 mr-1" />
                    )}
                    Generate translation
                  </Button>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {(["it", "en"] as const).map((lang) => (
                    <div key={lang} className="space-y-1.5">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        {lang === "it" ? "Italiano" : "English"}
                        {(tip.original_language ?? "it") === lang ? " (original)" : " (translated)"}
                      </p>
                      <Textarea
                        rows={1}
                        placeholder="Activity name"
                        value={draftValue(tip, `activity_name_${lang}`}
                        onChange={(e) => setDraft(tip.id, `activity_name_${lang}` as keyof Tip, e.target.value)}
                      />
                      <Textarea
                        rows={3}
                        placeholder="Brief description"
                        value={draftValue(tip, `brief_description_${lang}`}
                        onChange={(e) => setDraft(tip.id, `brief_description_${lang}` as keyof Tip, e.target.value)}
                      />
                      <Textarea
                        rows={3}
                        placeholder="Personal feedback"
                        value={draftValue(tip, `personal_feedback_${lang}`}
                        onChange={(e) => setDraft(tip.id, `personal_feedback_${lang}` as keyof Tip, e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                <Button
                  size="sm"
                  onClick={() => saveTranslation(tip)}
                  disabled={!drafts[tip.id] || busy === tip.id}
                >
                  Save translations
                </Button>
              </div>

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
                {tip.social_page && <span>{tip.social_page}</span>}
                {tip.contact_information && <span>{tip.contact_information}</span>}
              </div>

              {tip.photo_logo_url && (
                <img
                  src={tip.photo_logo_url}
                  alt="Provider logo"
                  className="h-16 w-16 rounded-lg object-cover border border-border"
                />
              )}

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">Have you tried this activity?</p>
                  <Select value={tip.tried_activity ?? ""} onValueChange={(v) => setTried(tip, v)}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Information not specified" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tried_by_family">Tried by family</SelectItem>
                      <SelectItem value="information_shared">Information shared</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">Rejection reason</p>
                  <Select
                    value={reasons[tip.id] ?? ""}
                    onValueChange={(v) => setReasons((r) => ({ ...r, [tip.id]: v }))}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {REJECTION_REASONS.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {tip.flyer_file_path ? (
                <div className="rounded-lg border border-border bg-muted/40 p-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{tip.flyer_file_name ?? tip.flyer_file_path}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {tip.flyer_file_type ?? "unknown type"} · {formatSize(tip.flyer_file_size)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <FlyerButton path={tip.flyer_file_path} label="View / download flyer" />
                    <Button size="sm" variant="destructive" disabled={busy === tip.id} onClick={() => removeFlyer(tip)}>
                      <Trash2 className="h-3.5 w-3.5" /> Remove flyer
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No flyer uploaded.</p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <ThumbsUp className="h-4 w-4" /> {counts[tip.id]?.thumbs_up_count ?? 0}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Heart className="h-4 w-4" /> {counts[tip.id]?.heart_count ?? 0}
                  </span>
                  <span className="text-xs">
                    total {(counts[tip.id]?.thumbs_up_count ?? 0) + (counts[tip.id]?.heart_count ?? 0)}
                  </span>
                </div>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  Reactions enabled
                  <Switch
                    checked={tip.reactions_enabled !== false}
                    onCheckedChange={(v) => setReactionsEnabled(tip, v)}
                  />
                </label>
              </div>

              <Textarea
                placeholder="Internal admin note"
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
