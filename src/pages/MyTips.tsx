import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Lightbulb, Loader2, Pencil, Archive, Plus, ThumbsUp, Heart, ArrowLeft } from "lucide-react";

type MyTip = {
  id: string;
  entity_provider_name: string;
  activity_opportunity_name: string;
  brief_description: string;
  personal_feedback: string;
  status: string;
  rejection_reason: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  reactions_enabled: boolean;
  thumbs_up_count: number;
  heart_count: number;
};

const statusLabel = (status: string, it: boolean) => {
  const map: Record<string, [string, string]> = {
    draft: ["Bozza", "Draft"],
    pending_review: ["In attesa di revisione", "Pending review"],
    approved: ["Pubblicato", "Published"],
    rejected: ["Rifiutato", "Rejected"],
    archived: ["Archiviato", "Archived"],
  };
  const pair = map[status] ?? [status, status];
  return it ? pair[0] : pair[1];
};

const MyTips = () => {
  const { language } = useLanguage();
  const it = language === "it";
  const { user, loading: authLoading } = useAuth();
  const [tips, setTips] = useState<MyTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("my_community_tips");
    if (error) toast.error(error.message);
    setTips((data as MyTip[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  if (authLoading) {
    return (
      <MainLayout>
        <div className="container py-20 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </MainLayout>
    );
  }
  if (!user) return <Navigate to="/login?next=/tips/mine" replace />;

  const archive = async (tip: MyTip) => {
    setBusy(tip.id);
    const { error } = await supabase
      .from("parent_community_tips")
      .update({ status: "archived" as never })
      .eq("id", tip.id);
    setBusy(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(it ? "Consiglio archiviato." : "Tip archived.");
    load();
  };

  return (
    <MainLayout>
      <div className="container py-8 md:py-12 max-w-4xl">
        <Link
          to="/tips"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> {it ? "Torna ai consigli" : "Back to tips"}
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              {it ? "I miei consigli" : "My Tips"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              {it
                ? "Gestisci e modifica i consigli che hai inviato alla community."
                : "Manage and edit the tips you submitted to the community."}
            </p>
          </div>
          <Button asChild className="shrink-0">
            <Link to="/tips/share">
              <Plus className="h-4 w-4" /> {it ? "Condividi un consiglio" : "Share a Tip"}
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : tips.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <Lightbulb className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              {it
                ? "Non hai ancora inviato nessun consiglio alla community."
                : "You have not submitted any community tips yet."}
            </p>
            <Button asChild>
              <Link to="/tips/share">
                <Plus className="h-4 w-4" /> {it ? "Condividi un consiglio" : "Share a Tip"}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {tips.map((tip) => (
              <article key={tip.id} className="rounded-2xl border border-border bg-card p-4 md:p-5 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="font-display text-lg font-semibold text-foreground leading-tight">
                      {tip.activity_opportunity_name}
                    </h2>
                    <p className="text-sm text-muted-foreground">{tip.entity_provider_name}</p>
                  </div>
                  <Badge
                    variant={
                      tip.status === "approved"
                        ? "default"
                        : tip.status === "rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {statusLabel(tip.status, it)}
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground space-y-0.5">
                  <p>
                    {it ? "Inviato il" : "Submitted"}{" "}
                    {new Date(tip.created_at).toLocaleDateString(it ? "it-IT" : "en-GB")}
                  </p>
                  {tip.published_at && (
                    <p>
                      {it ? "Pubblicato il" : "Published"}{" "}
                      {new Date(tip.published_at).toLocaleDateString(it ? "it-IT" : "en-GB")}
                    </p>
                  )}
                </div>

                {tip.status === "rejected" && tip.rejection_reason && (
                  <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                    {it ? "Motivo del rifiuto: " : "Rejection reason: "}
                    {tip.rejection_reason}
                  </p>
                )}

                {tip.status === "approved" && (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <ThumbsUp className="h-4 w-4" /> {tip.thumbs_up_count}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Heart className="h-4 w-4" /> {tip.heart_count}
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {tip.status !== "archived" ? (
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/tips/${tip.id}/edit`}>
                        <Pencil className="h-3.5 w-3.5" /> {it ? "Modifica" : "Edit"}
                      </Link>
                    </Button>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      {it
                        ? "I consigli archiviati possono essere riattivati solo da un amministratore."
                        : "Archived tips can only be reactivated by an admin."}
                    </p>
                  )}
                  {tip.status !== "archived" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={busy === tip.id}
                      onClick={() => archive(tip)}
                    >
                      <Archive className="h-3.5 w-3.5" /> {it ? "Archivia" : "Archive"}
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MyTips;
