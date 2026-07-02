import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LifeBuoy, Loader2, Send } from "lucide-react";

type Report = {
  id: string;
  category: string;
  title: string;
  description: string;
  related_listing_id: string | null;
  status: "open" | "in_progress" | "resolved" | "closed";
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

const CATEGORY_KEYS = [
  "technical",
  "listing",
  "messages",
  "translation",
  "transaction",
  "suspicious",
  "suggestion",
  "other",
] as const;

const CATEGORY_LABELS: Record<string, { en: string; it: string }> = {
  technical: { en: "Technical problem", it: "Problema tecnico" },
  listing: { en: "Listing problem", it: "Problema con annuncio" },
  messages: { en: "Messages problem", it: "Problema con messaggi" },
  translation: { en: "Translation problem", it: "Problema di traduzione" },
  transaction: { en: "Transaction problem", it: "Problema con transazione" },
  suspicious: { en: "Suspicious listing", it: "Annuncio sospetto" },
  suggestion: { en: "Suggestion / feedback", it: "Suggerimento / feedback" },
  other: { en: "Other", it: "Altro" },
};

const STATUS_LABELS: Record<string, { en: string; it: string; variant: string }> = {
  open: { en: "Open", it: "Aperto", variant: "destructive" },
  in_progress: { en: "In progress", it: "In lavorazione", variant: "default" },
  resolved: { en: "Resolved", it: "Risolto", variant: "sale" },
  closed: { en: "Closed", it: "Chiuso", variant: "outline" },
};

const formSchema = z.object({
  category: z.enum(CATEGORY_KEYS),
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(5).max(4000),
  related_listing_id: z
    .string()
    .trim()
    .uuid()
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

const HelpFeedback = () => {
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isIT = language === "it";

  const [category, setCategory] = useState<string>("technical");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [relatedListingId, setRelatedListingId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [myReports, setMyReports] = useState<Report[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login?next=/help-feedback");
  }, [authLoading, user, navigate]);

  const loadMine = async () => {
    if (!user) return;
    setLoadingReports(true);
    const { data } = await supabase
      .from("feedback_reports")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setMyReports((data as Report[]) || []);
    setLoadingReports(false);
  };

  useEffect(() => {
    if (user) loadMine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const submit = async () => {
    if (!user) return;
    const parsed = formSchema.safeParse({
      category,
      title,
      description,
      related_listing_id: relatedListingId || undefined,
    });
    if (!parsed.success) {
      toast.error(
        isIT
          ? "Controlla i campi: titolo (min 3) e descrizione (min 5) sono obbligatori."
          : "Please check the form: title (min 3) and description (min 5) are required."
      );
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("feedback_reports").insert({
      user_id: user.id,
      category: parsed.data.category,
      title: parsed.data.title,
      description: parsed.data.description,
      related_listing_id: parsed.data.related_listing_id ?? null,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(
      isIT
        ? "Grazie. La tua segnalazione è stata inviata e sarà verificata."
        : "Thank you. Your message has been sent and will be reviewed."
    );
    setTitle("");
    setDescription("");
    setRelatedListingId("");
    setCategory("technical");
    loadMine();
  };

  if (authLoading) {
    return (
      <MainLayout>
        <div className="container py-16 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8 max-w-3xl">
        <div className="flex items-start gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
            <LifeBuoy className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-display">
              {isIT
                ? "Segnala un problema o inviaci un suggerimento"
                : "Report a problem or send us feedback"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isIT
                ? "Aiutaci a migliorare DISbook. Rispondiamo alle segnalazioni il prima possibile."
                : "Help us improve DISbook. We review all reports as soon as possible."}
            </p>
          </div>
        </div>

        <Card className="p-5 space-y-4">
          <div className="grid gap-2">
            <Label>{isIT ? "Categoria" : "Category"}</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_KEYS.map((k) => (
                  <SelectItem key={k} value={k}>
                    {isIT ? CATEGORY_LABELS[k].it : CATEGORY_LABELS[k].en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>{isIT ? "Titolo breve" : "Short title"}</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              placeholder={
                isIT
                  ? "Es. La foto del libro non si carica"
                  : "e.g. Book photo won't upload"
              }
            />
          </div>

          <div className="grid gap-2">
            <Label>{isIT ? "Descrizione" : "Description"}</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={4000}
              rows={6}
              placeholder={
                isIT
                  ? "Descrivi il problema o il suggerimento. Includi passi per riprodurlo se possibile."
                  : "Describe the issue or suggestion. Include steps to reproduce if possible."
              }
            />
          </div>

          <div className="grid gap-2">
            <Label>
              {isIT
                ? "Libro/annuncio collegato, se applicabile"
                : "Related book/listing, if applicable"}
            </Label>
            <Input
              value={relatedListingId}
              onChange={(e) => setRelatedListingId(e.target.value)}
              placeholder={
                isIT
                  ? "ID annuncio (opzionale)"
                  : "Listing ID (optional)"
              }
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={submit} disabled={submitting} className="gap-2">
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isIT ? "Invia segnalazione" : "Send report"}
            </Button>
          </div>
        </Card>

        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-3">
            {isIT ? "Le mie segnalazioni" : "My reports"}
          </h2>
          {loadingReports ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : myReports.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {isIT
                ? "Non hai ancora inviato segnalazioni."
                : "You haven't sent any reports yet."}
            </p>
          ) : (
            <div className="space-y-3">
              {myReports.map((r) => {
                const s = STATUS_LABELS[r.status];
                return (
                  <Card key={r.id} className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <p className="font-medium break-words">{r.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {isIT
                            ? CATEGORY_LABELS[r.category].it
                            : CATEGORY_LABELS[r.category].en}{" "}
                          · {new Date(r.created_at).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={s.variant as never}>
                        {isIT ? s.it : s.en}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {r.description}
                    </p>
                    {r.admin_notes && (
                      <div className="text-xs rounded-md bg-muted p-2">
                        <span className="font-medium">
                          {isIT ? "Nota admin: " : "Admin note: "}
                        </span>
                        {r.admin_notes}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default HelpFeedback;
