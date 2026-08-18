import { useState, FormEvent } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { z } from "zod";
import { ArrowLeft, Loader2, Lightbulb } from "lucide-react";
import { LEVELS } from "./Tips";

const schema = z.object({
  entity_provider_name: z.string().trim().min(2).max(120),
  activity_opportunity_name: z.string().trim().min(2).max(120),
  brief_description: z.string().trim().min(10).max(600),
  personal_feedback: z.string().trim().min(10).max(800),
  website_url: z.string().trim().max(300).url().optional().or(z.literal("")),
  email: z.string().trim().max(255).email().optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional(),
  social_page: z.string().trim().max(300).optional(),
  location: z.string().trim().max(160).optional(),
  language: z.string().trim().max(60).optional(),
  approximate_cost: z.string().trim().max(80).optional(),
  period: z.string().trim().max(80).optional(),
  contact_information: z.string().trim().max(300).optional(),
  photo_logo_url: z.string().trim().max(500).url().optional().or(z.literal("")),
});

const empty = {
  entity_provider_name: "",
  activity_opportunity_name: "",
  brief_description: "",
  personal_feedback: "",
  website_url: "",
  email: "",
  phone: "",
  social_page: "",
  location: "",
  language: "",
  approximate_cost: "",
  period: "",
  contact_information: "",
  photo_logo_url: "",
};

const ShareTip = () => {
  const { language } = useLanguage();
  const it = language === "it";
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [levels, setLevels] = useState<string[]>([]);
  const [recommend, setRecommend] = useState(true);
  const [saving, setSaving] = useState(false);

  if (authLoading) {
    return (
      <MainLayout>
        <div className="container py-20 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </MainLayout>
    );
  }
  if (!user) return <Navigate to="/login?next=/tips/share" replace />;

  const set = (k: keyof typeof empty) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggleLevel = (l: string) =>
    setLevels((prev) => (prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(
        it
          ? "Controlla i campi obbligatori e i formati (email / link)."
          : "Please check required fields and formats (email / links)."
      );
      return;
    }
    if (levels.length === 0) {
      toast.error(it ? "Seleziona almeno un livello scolastico." : "Select at least one school level.");
      return;
    }
    setSaving(true);
    const v = parsed.data;
    const { error } = await supabase.from("parent_community_tips").insert({
      submitted_by_user_id: user.id,
      entity_provider_name: v.entity_provider_name,
      activity_opportunity_name: v.activity_opportunity_name,
      brief_description: v.brief_description,
      personal_feedback: v.personal_feedback,
      contact_information: v.contact_information || null,
      website_url: v.website_url || null,
      email: v.email || null,
      phone: v.phone || null,
      social_page: v.social_page || null,
      location: v.location || null,
      language: v.language || null,
      approximate_cost: v.approximate_cost || null,
      period: v.period || null,
      photo_logo_url: v.photo_logo_url || null,
      approximate_age_range_suitable_level: levels,
      would_recommend_again: recommend,
      status: "pending_review",
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(
      it
        ? "Grazie! Il tuo consiglio è stato inviato ed è in attesa di revisione."
        : "Thank you! Your tip has been submitted and is awaiting review."
    );
    navigate("/tips");
  };

  const field = (
    key: keyof typeof empty,
    labelIt: string,
    labelEn: string,
    opts: { required?: boolean; textarea?: boolean; type?: string; placeholder?: string } = {}
  ) => (
    <div className="space-y-2">
      <Label htmlFor={key}>
        {it ? labelIt : labelEn}
        {opts.required && <span className="text-destructive"> *</span>}
      </Label>
      {opts.textarea ? (
        <Textarea id={key} value={form[key]} onChange={set(key)} rows={4} maxLength={800} placeholder={opts.placeholder} />
      ) : (
        <Input id={key} type={opts.type ?? "text"} value={form[key]} onChange={set(key)} maxLength={300} placeholder={opts.placeholder} />
      )}
    </div>
  );

  return (
    <MainLayout>
      <div className="container py-8 md:py-12 max-w-2xl">
        <Link to="/tips" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> {it ? "Torna ai consigli" : "Back to tips"}
        </Link>

        <div className="mb-6">
          <div className="h-11 w-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-3">
            <Lightbulb className="h-5 w-5" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            {it ? "Condividi un consiglio" : "Share a tip"}
          </h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {it
              ? "Racconta alla community DIS un'attività, un corso, un campo estivo o un servizio che consiglieresti. Un amministratore lo revisionerà prima della pubblicazione."
              : "Tell the DIS community about an activity, course, summer camp or service you would recommend. An admin will review it before it is published."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-5 md:p-6">
          {field("entity_provider_name", "Ente / organizzatore", "Entity / provider name", { required: true })}
          {field("activity_opportunity_name", "Attività / opportunità", "Activity / opportunity name", { required: true })}
          {field("brief_description", "Breve descrizione", "Brief description", { required: true, textarea: true })}

          <div className="space-y-2">
            <Label>
              {it ? "Livello scolastico adatto" : "Suitable school level"}
              <span className="text-destructive"> *</span>
            </Label>
            <div className="flex flex-wrap gap-3">
              {LEVELS.map((l) => (
                <label key={l} className="inline-flex items-center gap-2 text-sm">
                  <Checkbox checked={levels.includes(l)} onCheckedChange={() => toggleLevel(l)} />
                  {l}
                </label>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {field("location", "Luogo", "Location", { placeholder: "Genova…" })}
            {field("language", "Lingua", "Language", { placeholder: it ? "Italiano / Inglese" : "Italian / English" })}
            {field("approximate_cost", "Costo indicativo", "Approximate cost")}
            {field("period", "Periodo", "Period", { placeholder: it ? "Estate, tutto l'anno…" : "Summer, all year…" })}
            {field("website_url", "Sito web", "Website", { placeholder: "https://" })}
            {field("email", "Email di contatto", "Contact email", { type: "email" })}
            {field("phone", "Telefono", "Phone")}
            {field("social_page", "Pagina social", "Social page")}
          </div>

          {field("contact_information", "Altre informazioni di contatto", "Other contact information")}
          {field("photo_logo_url", "Link a foto / logo", "Photo / logo link", { placeholder: "https://" })}
          {field("personal_feedback", "La tua esperienza personale", "Your personal feedback", { required: true, textarea: true })}

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <Label htmlFor="recommend" className="text-sm font-normal">
              {it ? "Lo consiglieresti di nuovo?" : "Would you recommend it again?"}
            </Label>
            <Switch id="recommend" checked={recommend} onCheckedChange={setRecommend} />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {it ? "Invia per la revisione" : "Submit for review"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            {it
              ? "Condividi solo informazioni che puoi rendere pubbliche. Il tuo nome non viene mostrato."
              : "Only share information you are happy to make public. Your name is not shown."}
          </p>
        </form>
      </div>
    </MainLayout>
  );
};

export default ShareTip;
