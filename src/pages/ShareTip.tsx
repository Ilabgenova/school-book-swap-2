import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Navigate, useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { z } from "zod";
import { ArrowLeft, Loader2, Lightbulb, Upload, X, ShieldAlert } from "lucide-react";
import { LEVELS } from "./Tips";

const MAX_FLYER_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp"];

const urlish = z
  .string()
  .trim()
  .max(300)
  .refine((v) => v === "" || /^https?:\/\/[^\s.]+\.[^\s]{2,}$/i.test(v), {
    message: "url",
  });

const schema = z.object({
  entity_provider_name: z.string().trim().min(2).max(120),
  activity_opportunity_name: z.string().trim().min(2).max(120),
  brief_description: z.string().trim().min(10).max(600),
  personal_feedback: z.string().trim().min(10).max(800),
  website_url: urlish,
  email: z.string().trim().max(255).email().optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional(),
  social_page: z.string().trim().max(300).optional(),
  location: z.string().trim().max(160).optional(),
  language: z.string().trim().max(60).optional(),
  approximate_cost: z.string().trim().max(80).optional(),
  period: z.string().trim().max(80).optional(),
  contact_information: z.string().trim().max(300).optional(),
  photo_logo_url: urlish,
});

// Accept "www.site.it" / "site.it" by prefixing the scheme automatically.
const normalizeUrl = (v: string) => {
  const t = v.trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
};

const FIELD_LABELS: Record<string, { it: string; en: string }> = {
  entity_provider_name: { it: "Ente / organizzatore", en: "Entity / provider name" },
  activity_opportunity_name: { it: "Attività / opportunità", en: "Activity / opportunity name" },
  brief_description: { it: "Breve descrizione", en: "Brief description" },
  personal_feedback: { it: "La tua esperienza personale", en: "Personal feedback" },
  website_url: { it: "Sito web", en: "Website" },
  email: { it: "Email di contatto", en: "Contact email" },
  photo_logo_url: { it: "Link a foto / logo", en: "Photo / logo link" },
};


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
  const [tried, setTried] = useState<string>("");
  const [origLang, setOrigLang] = useState<"it" | "en">("it");
  const [flyer, setFlyer] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const { tipId } = useParams();
  const isEdit = Boolean(tipId);
  const [loadingTip, setLoadingTip] = useState(Boolean(tipId));
  const [editStatus, setEditStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!tipId || !user) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("parent_community_tips")
        .select("*")
        .eq("id", tipId)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        toast.error(it ? "Consiglio non trovato." : "Tip not found.");
        navigate("/tips/mine");
        return;
      }
      if (data.submitted_by_user_id !== user.id) {
        toast.error(it ? "Puoi modificare solo i tuoi consigli." : "You can only edit your own tips.");
        navigate("/tips/mine");
        return;
      }
      if (data.status === "archived") {
        toast.error(
          it
            ? "I consigli archiviati possono essere riattivati solo da un amministratore."
            : "Archived tips can only be reactivated by an admin."
        );
        navigate("/tips/mine");
        return;
      }
      setEditStatus(data.status);
      setForm({
        entity_provider_name: data.entity_provider_name ?? "",
        activity_opportunity_name: data.activity_opportunity_name ?? "",
        brief_description: data.brief_description ?? "",
        personal_feedback: data.personal_feedback ?? "",
        website_url: data.website_url ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        social_page: data.social_page ?? "",
        location: data.location ?? "",
        language: data.language ?? "",
        approximate_cost: data.approximate_cost ?? "",
        period: data.period ?? "",
        contact_information: data.contact_information ?? "",
        photo_logo_url: data.photo_logo_url ?? "",
      });
      setLevels(data.approximate_age_range_suitable_level ?? []);
      setRecommend(data.would_recommend_again ?? true);
      setTried(data.tried_activity ?? "");
      setOrigLang((data.original_language as "it" | "en") === "en" ? "en" : "it");
      setLoadingTip(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [tipId, user, it, navigate]);

  if (authLoading || loadingTip) {
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

  const onFlyerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      toast.error(it ? "Formato non supportato. Usa PDF, JPG, PNG o WEBP." : "Unsupported file type. Use PDF, JPG, PNG or WEBP.");
      return;
    }
    if (file.size > MAX_FLYER_BYTES) {
      toast.error(it ? "Il file supera i 10 MB." : "File exceeds 10 MB.");
      return;
    }
    setFlyer(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const normalized = {
      ...form,
      website_url: normalizeUrl(form.website_url),
      photo_logo_url: normalizeUrl(form.photo_logo_url),
    };
    setForm(normalized);
    const parsed = schema.safeParse(normalized);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const key = String(issue.path[0] ?? "");
      const label = FIELD_LABELS[key];
      const name = label ? (it ? label.it : label.en) : key;
      const isFormat = issue.message === "url" || issue.code === "invalid_string";
      toast.error(
        isFormat
          ? it
            ? `Formato non valido nel campo "${name}". Controlla che sia un indirizzo valido (es. https://www.esempio.it).`
            : `Invalid format in "${name}". Please check it is a valid address (e.g. https://www.example.com).`
          : it
          ? `Controlla il campo "${name}".`
          : `Please check the "${name}" field.`
      );
      return;
    }

    const v = parsed.data;
    const hasContact = Boolean(
      v.website_url || v.email || v.phone || v.social_page || v.location || v.contact_information
    );
    if (!hasContact) {
      toast.error(
        it
          ? "Inserisci almeno un contatto (sito, email, telefono, social o luogo)."
          : "Please provide at least one contact method (website, email, phone, social or location)."
      );
      return;
    }
    if (levels.length === 0) {
      toast.error(it ? "Seleziona almeno un livello scolastico." : "Select at least one school level.");
      return;
    }
    if (!tried) {
      toast.error(it ? "Indica se hai provato questa attività." : "Please answer whether you tried this activity.");
      return;
    }

    setSaving(true);

    let flyerMeta: {
      flyer_file_path: string;
      flyer_file_name: string;
      flyer_file_type: string;
      flyer_file_size: number;
      flyer_uploaded_at: string;
    } | null = null;

    if (flyer) {
      const ext = flyer.name.split(".").pop()?.toLowerCase() ?? "bin";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("tip-flyers").upload(path, flyer, {
        contentType: flyer.type,
        upsert: false,
      });
      if (upErr) {
        setSaving(false);
        toast.error(upErr.message);
        return;
      }
      flyerMeta = {
        flyer_file_path: path,
        flyer_file_name: flyer.name.slice(0, 200),
        flyer_file_type: flyer.type,
        flyer_file_size: flyer.size,
        flyer_uploaded_at: new Date().toISOString(),
      };
    }

    if (isEdit && tipId) {
      if (flyerMeta) {
        await supabase.from("parent_community_tips").update(flyerMeta).eq("id", tipId);
      }
      const { error: rpcError } = await supabase.rpc("author_update_tip", {
        _tip_id: tipId,
        _payload: {
          entity_provider_name: v.entity_provider_name,
          activity_opportunity_name: v.activity_opportunity_name,
          brief_description: v.brief_description,
          personal_feedback: v.personal_feedback,
          contact_information: v.contact_information || "",
          website_url: v.website_url || "",
          email: v.email || "",
          phone: v.phone || "",
          social_page: v.social_page || "",
          location: v.location || "",
          language: v.language || "",
          approximate_cost: v.approximate_cost || "",
          period: v.period || "",
          photo_logo_url: v.photo_logo_url || "",
          approximate_age_range_suitable_level: levels,
          would_recommend_again: recommend,
          tried_activity: tried,
          original_language: origLang,
        },
      });
      setSaving(false);
      if (rpcError) {
        toast.error(rpcError.message);
        return;
      }
      toast.success(
        editStatus === "approved"
          ? it
            ? "La tua modifica è stata inviata per la revisione. La versione pubblicata resterà visibile finché l'aggiornamento non sarà approvato."
            : "Your update has been submitted for review. The current published version will remain visible until the update is approved."
          : it
          ? "Il tuo consiglio è stato aggiornato ed è in attesa della revisione degli amministratori DISbook."
          : "Your tip has been updated and is waiting for DISbook admin review."
      );
      navigate("/tips/mine");
      return;
    }

    const { data: inserted, error } = await supabase.from("parent_community_tips").insert({
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
      tried_activity: tried,
      original_language: origLang,
      activity_name_it: origLang === "it" ? v.activity_opportunity_name : null,
      brief_description_it: origLang === "it" ? v.brief_description : null,
      personal_feedback_it: origLang === "it" ? v.personal_feedback : null,
      activity_name_en: origLang === "en" ? v.activity_opportunity_name : null,
      brief_description_en: origLang === "en" ? v.brief_description : null,
      personal_feedback_en: origLang === "en" ? v.personal_feedback : null,
      ...(flyerMeta ?? {}),
      status: "pending_review",
    }).select("id").maybeSingle();
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (inserted?.id) {
      // Generate the other-language version in the background; failures never block submission.
      supabase.functions.invoke("translate-tip", { body: { tip_id: inserted.id } }).catch(() => undefined);
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
        <Textarea id={key} value={form[key]} onChange={set(key)} rows={4} maxLength={key === "brief_description" ? 600 : 800} placeholder={opts.placeholder} />
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
            {isEdit
              ? it
                ? "Modifica il consiglio"
                : "Edit tip"
              : it
              ? "Condividi un consiglio"
              : "Share a tip"}
          </h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {it
              ? "Racconta alla community DIS un'attività, un corso, un campo estivo o un servizio che consiglieresti. Un amministratore lo revisionerà prima della pubblicazione."
              : "Tell the DIS community about an activity, course, summer camp or service you would recommend. An admin will review it before it is published."}
          </p>
        </div>

        <div className="mb-5 flex gap-2.5 rounded-xl border border-border bg-muted/40 p-3.5 text-xs text-muted-foreground leading-relaxed">
          <ShieldAlert className="h-4 w-4 shrink-0 text-accent mt-0.5" />
          <p>
            {it
              ? "Non includere nomi o foto di bambini, numeri di telefono personali, indirizzi privati o informazioni sensibili. I consigli devono descrivere l'attività, non i singoli bambini."
              : "Please do not include children's names, photos, personal phone numbers, private addresses or sensitive information. Recommendations should describe the activity, not individual children."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-5 md:p-6">
          {field("entity_provider_name", "Ente / organizzatore", "Entity / provider name", { required: true })}
          {field("activity_opportunity_name", "Attività / opportunità", "Activity / opportunity name", { required: true })}

          <div className="space-y-2">
            <Label>
              {it ? "Lingua originale del testo" : "Original language of your text"}
              <span className="text-destructive"> *</span>
            </Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {(["it", "en"] as const).map((l) => (
                <label
                  key={l}
                  className="flex items-center gap-2.5 rounded-lg border border-border p-3 text-sm cursor-pointer"
                >
                  <input
                    type="radio"
                    name="original_language"
                    checked={origLang === l}
                    onChange={() => setOrigLang(l)}
                  />
                  {l === "it" ? (it ? "Italiano" : "Italian") : it ? "Inglese" : "English"}
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {it
                ? "Nome attività, descrizione e feedback saranno tradotti automaticamente nell'altra lingua."
                : "Activity name, description and feedback will be translated automatically into the other language."}
            </p>
          </div>
          {field("brief_description", "Breve descrizione", "Brief description", { required: true, textarea: true })}

          <div className="space-y-2">
            <Label>
              {it ? "Livello scolastico adatto" : "Approximate age range / suitable school level"}
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

          <div className="space-y-1.5">
            <Label>
              {it ? "Informazioni di contatto" : "Contact information"}
              <span className="text-destructive"> *</span>
            </Label>
            <p className="text-xs text-muted-foreground">
              {it
                ? "Inserisci almeno un contatto: sito web, email, telefono, pagina social o luogo."
                : "Provide at least one: website, email, phone, social page or location."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {field("website_url", "Sito web", "Website", { placeholder: "https://" })}
            {field("email", "Email di contatto", "Contact email", { type: "email" })}
            {field("phone", "Telefono", "Phone")}
            {field("social_page", "Pagina social", "Social page")}
            {field("location", "Luogo", "Location", { placeholder: "Genova…" })}
            {field("language", "Lingua", "Language", { placeholder: it ? "Italiano / Inglese" : "Italian / English" })}
            {field("approximate_cost", "Costo indicativo", "Approximate cost")}
            {field("period", "Periodo", "Period", { placeholder: it ? "Estate, tutto l'anno…" : "Summer, weekend, school year…" })}
          </div>

          {field("contact_information", "Altre informazioni di contatto", "Other contact information")}
          {field("photo_logo_url", "Link a foto / logo", "Photo / logo link", { placeholder: "https://" })}

          {/* Flyer upload */}
          <div className="space-y-2">
            <Label htmlFor="flyer">{it ? "Volantino / brochure (facoltativo)" : "Flyer / Brochure (optional)"}</Label>
            <p className="text-xs text-muted-foreground">
              {it
                ? "Carica un volantino, una brochure o una scheda informativa dell'attività, se disponibile. PDF, JPG, PNG o WEBP — massimo 10 MB."
                : "Upload a flyer, brochure or information sheet for this activity, if available. PDF, JPG, PNG or WEBP — max 10 MB."}
            </p>
            {flyer ? (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2">
                <span className="text-sm truncate">{flyer.name}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">{(flyer.size / 1024 / 1024).toFixed(1)} MB</span>
                  <Button type="button" size="icon" variant="ghost" onClick={() => setFlyer(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="flyer"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 py-5 text-sm text-muted-foreground hover:border-accent hover:text-foreground transition-colors"
              >
                <Upload className="h-4 w-4" />
                {it ? "Scegli un file" : "Choose a file"}
              </label>
            )}
            <input
              id="flyer"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={onFlyerChange}
            />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {it
                ? "Carica solo volantini o brochure relativi all'attività consigliata. Non caricare file con dati personali dei bambini, documenti privati, pagelle, indirizzi o contenuti non pertinenti."
                : "Please upload only flyers or brochures related to the recommended activity. Do not upload files containing children's personal information, private documents, school records, addresses or unrelated content."}
            </p>
          </div>

          {/* Tried activity */}
          <div className="space-y-2">
            <Label>
              {it ? "Hai provato questa attività?" : "Have you tried this activity?"}
              <span className="text-destructive"> *</span>
            </Label>
            <RadioGroup value={tried} onValueChange={setTried} className="gap-2">
              <label className="flex items-center gap-2.5 rounded-lg border border-border p-3 text-sm cursor-pointer">
                <RadioGroupItem value="tried_by_family" id="tried_yes" />
                {it ? "Sì, la mia famiglia l'ha provata" : "Yes, my family tried it"}
              </label>
              <label className="flex items-center gap-2.5 rounded-lg border border-border p-3 text-sm cursor-pointer">
                <RadioGroupItem value="information_shared" id="tried_no" />
                {it ? "No, ho solo visto le informazioni" : "No, I only saw the information"}
              </label>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="personal_feedback">
              {it ? "La tua esperienza personale" : "Personal feedback"}
              <span className="text-destructive"> *</span>
            </Label>
            <Textarea
              id="personal_feedback"
              value={form.personal_feedback}
              onChange={set("personal_feedback")}
              rows={4}
              maxLength={800}
              placeholder={
                it
                  ? "Spiega brevemente perché condividi questa attività. Se la tua famiglia l'ha provata, racconta la tua esperienza. Se hai solo visto le informazioni, indica dove le hai viste."
                  : "Please briefly explain why you are sharing this activity. If your family tried it, share your experience. If you only saw the information, please say where you saw it."
              }
            />
            <p className="text-xs text-muted-foreground">
              {it
                ? "Se hai solo visto le informazioni e non hai provato personalmente l'attività, indicalo chiaramente nel tuo commento."
                : "If you only saw the information and did not personally try the activity, please make this clear in your feedback."}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <Label htmlFor="recommend" className="text-sm font-normal">
              {it ? "Lo consiglieresti di nuovo?" : "Would you recommend it again?"}
            </Label>
            <Switch id="recommend" checked={recommend} onCheckedChange={setRecommend} />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit
              ? it
                ? "Salva e invia per la revisione"
                : "Save and submit for review"
              : it
              ? "Invia per la revisione"
              : "Submit for review"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            {it
              ? "Il tuo consiglio mostrerà il tuo nome visualizzato o il tuo nome. La tua email e i tuoi contatti privati non saranno mostrati."
              : "Your recommendation will show your display name or first name. Your email and private contact details will not be shown."}
          </p>
        </form>
      </div>
    </MainLayout>
  );
};

export default ShareTip;
