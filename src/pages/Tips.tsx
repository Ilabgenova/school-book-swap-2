import { useEffect, useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Lightbulb,
  Search,
  Loader2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  Euro,
  ThumbsUp,
  Plus,
  ShieldCheck,
  Users,
  Info,
  UserRound,
} from "lucide-react";
import { FlyerButton } from "@/components/tips/FlyerButton";
import { TipReactions } from "@/components/tips/TipReactions";

export const LEVELS = ["PYP", "MYP", "DP", "All ages"] as const;

type Tip = {
  id: string;
  entity_provider_name: string;
  activity_opportunity_name: string;
  brief_description: string;
  contact_information: string | null;
  website_url: string | null;
  email: string | null;
  phone: string | null;
  social_page: string | null;
  location: string | null;
  approximate_age_range_suitable_level: string[] | null;
  language: string | null;
  approximate_cost: string | null;
  period: string | null;
  personal_feedback: string;
  would_recommend_again: boolean | null;
  photo_logo_url: string | null;
  tried_activity: string | null;
  flyer_file_path: string | null;
  flyer_file_name: string | null;
  flyer_file_type: string | null;
  flyer_file_size: number | null;
  published_at: string | null;
  recommended_by_name: string | null;
  reactions_enabled: boolean | null;
  thumbs_up_count: number | null;
  heart_count: number | null;
  my_reactions: string[] | null;
  original_language: string | null;
  activity_name_it: string | null;
  activity_name_en: string | null;
  brief_description_it: string | null;
  brief_description_en: string | null;
  personal_feedback_it: string | null;
  personal_feedback_en: string | null;
  translation_status: string | null;
};

// Pick the version matching the reader's language, falling back to the original.
export const localizedTip = (tip: Tip, it: boolean) => {
  const name = (it ? tip.activity_name_it : tip.activity_name_en) || tip.activity_opportunity_name;
  const description = (it ? tip.brief_description_it : tip.brief_description_en) || tip.brief_description;
  const feedback = (it ? tip.personal_feedback_it : tip.personal_feedback_en) || tip.personal_feedback;
  const wanted = it ? "it" : "en";
  const missing =
    (tip.original_language ?? "it") !== wanted &&
    !(it ? tip.activity_name_it : tip.activity_name_en);
  return { name, description, feedback, missing };
};

const TipCard = ({ tip, it }: { tip: Tip; it: boolean }) => {
  const loc = localizedTip(tip, it);
  return (
  <article className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3">
    <div className="flex items-start gap-3">
      {tip.photo_logo_url ? (
        <img
          src={tip.photo_logo_url}
          alt={`${tip.entity_provider_name} logo`}
          loading="lazy"
          className="h-12 w-12 rounded-lg object-cover border border-border shrink-0"
        />
      ) : (
        <div className="h-12 w-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
          <Lightbulb className="h-5 w-5" />
        </div>
      )}
      <div className="min-w-0">
        <h3 className="font-display text-lg font-semibold text-foreground leading-tight">
          {loc.name}
        </h3>
        <p className="text-sm text-muted-foreground">{tip.entity_provider_name}</p>
      </div>
    </div>

    {loc.missing && (
      <p className="text-[11px] text-muted-foreground italic">
        {it ? "Traduzione non ancora disponibile" : "Translation not yet available"}
      </p>
    )}

    <p className="text-sm text-foreground/90 leading-relaxed">{loc.description}</p>

    <div className="flex flex-wrap gap-1.5">
      {(tip.approximate_age_range_suitable_level ?? []).map((l) => (
        <Badge key={l} variant="secondary" className="text-[11px]">
          {l}
        </Badge>
      ))}
      {tip.language && (
        <Badge variant="outline" className="text-[11px]">
          {tip.language}
        </Badge>
      )}
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="outline" className="text-[11px] gap-1 font-normal">
        {tip.tried_activity === "tried_by_family" ? (
          <>
            <Users className="h-3 w-3" /> {it ? "Provato dalla famiglia" : "Tried by family"}
          </>
        ) : tip.tried_activity === "information_shared" ? (
          <>
            <Info className="h-3 w-3" /> {it ? "Informazione condivisa" : "Information shared"}
          </>
        ) : (
          <>
            <Info className="h-3 w-3" /> {it ? "Informazione non specificata" : "Information not specified"}
          </>
        )}
      </Badge>
      <Badge variant="outline" className="text-[11px] gap-1 font-normal text-accent border-accent/30">
        <ShieldCheck className="h-3 w-3" /> {it ? "Verificato dagli admin DISbook" : "Reviewed by DISbook admins"}
      </Badge>
      {tip.published_at && (
        <span className="text-[11px] text-muted-foreground">
          {new Date(tip.published_at).toLocaleDateString(it ? "it-IT" : "en-GB")}
        </span>
      )}
    </div>

    <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <UserRound className="h-3.5 w-3.5" />
      {it ? "Consigliato da:" : "Recommended by:"}{" "}
      <span className="font-medium text-foreground">
        {tip.recommended_by_name?.trim() ||
          (it ? "Membro della community DISbook" : "DISbook community member")}
      </span>
    </p>

    <div className="grid gap-1.5 text-xs text-muted-foreground">
      {tip.location && (
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" /> {tip.location}
        </span>
      )}
      {tip.period && (
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" /> {tip.period}
        </span>
      )}
      {tip.approximate_cost && (
        <span className="inline-flex items-center gap-1.5">
          <Euro className="h-3.5 w-3.5" /> {tip.approximate_cost}
        </span>
      )}
    </div>

    <blockquote className="rounded-lg border-l-2 border-accent/50 bg-muted/50 px-3 py-2 text-sm text-foreground/90 italic">
      {loc.feedback}
      {tip.would_recommend_again && (
        <span className="mt-1.5 flex items-center gap-1.5 not-italic text-xs font-medium text-accent">
          <ThumbsUp className="h-3.5 w-3.5" />
          {it ? "Lo consiglierei di nuovo" : "Would recommend again"}
        </span>
      )}
    </blockquote>

    <div className="flex flex-wrap gap-3 text-xs">
      {tip.website_url && (
        <a
          href={tip.website_url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-1.5 text-accent hover:underline"
        >
          <Globe className="h-3.5 w-3.5" /> {it ? "Sito web" : "Website"}
        </a>
      )}
      {tip.email && (
        <a href={`mailto:${tip.email}`} className="inline-flex items-center gap-1.5 text-accent hover:underline">
          <Mail className="h-3.5 w-3.5" /> {tip.email}
        </a>
      )}
      {tip.phone && (
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <Phone className="h-3.5 w-3.5" /> {tip.phone}
        </span>
      )}
      {tip.social_page && (
        <a
          href={tip.social_page}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-1.5 text-accent hover:underline"
        >
          {it ? "Pagina social" : "Social page"}
        </a>
      )}
      {tip.contact_information && (
        <span className="text-muted-foreground">{tip.contact_information}</span>
      )}
    </div>

    <TipReactions
      tipId={tip.id}
      it={it}
      enabled={tip.reactions_enabled !== false}
      initialThumbs={tip.thumbs_up_count ?? 0}
      initialHearts={tip.heart_count ?? 0}
      initialMine={tip.my_reactions ?? []}
    />

    {tip.flyer_file_path && (
      <div>
        <FlyerButton
          path={tip.flyer_file_path}
          label={it ? "Scarica il volantino" : "Download flyer"}
        />
      </div>
    )}
  </article>
  );
};


const Tips = () => {
  const { language } = useLanguage();
  const it = language === "it";
  const { user, loading: authLoading } = useAuth();
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<string>("all");

  useEffect(() => {
    if (!user) {
      setTips([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc("public_get_community_tips", {
        _search: search.trim() || null,
        _limit: 60,
      });
      if (!cancelled) {
        setTips(error ? [] : ((data as Tip[]) ?? []));
        setLoading(false);
      }
    };
    const timer = setTimeout(load, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search, user]);

  const filtered = useMemo(
    () =>
      level === "all"
        ? tips
        : tips.filter((t) => (t.approximate_age_range_suitable_level ?? []).includes(level)),
    [tips, level]
  );

  if (authLoading) {
    return (
      <MainLayout>
        <div className="py-24 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="container py-12 md:py-20 max-w-lg">
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <Lightbulb className="h-6 w-6" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              {it ? "Consigli della community" : "Parent Community Tips"}
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              {it
                ? "Attività extrascolastiche utili consigliate dalle famiglie DISbook. Accedi per vedere e condividere i consigli."
                : "Useful extracurricular activities recommended by DISbook families. Please log in to view and share Parent Community Tips."}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button asChild>
                <Link to="/login?next=/tips">{it ? "Accedi" : "Log in"}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/register">{it ? "Crea un account" : "Create account"}</Link>
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8 md:py-12 max-w-5xl">
        <header className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/20 px-3 py-1.5 mb-3">
            <Lightbulb className="h-3.5 w-3.5 text-accent" />
            <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-accent font-semibold">
              {it ? "Community DIS" : "DIS community"}
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {it ? "Consigli della community" : "Parent Community Tips"}
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm md:text-base leading-relaxed">
            {it
              ? "Attività, corsi, campi estivi, tutor e servizi consigliati direttamente dalle famiglie DIS. Ogni consiglio è verificato da un amministratore prima della pubblicazione."
              : "Activities, courses, summer camps, tutors and services recommended directly by DIS families. Every tip is reviewed by an admin before publication."}
          </p>
        </header>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={it ? "Cerca attività, ente, parola chiave…" : "Search activity, provider, keyword…"}
              className="pl-9"
              maxLength={100}
            />
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Button asChild className="flex-1 sm:flex-none">
              <Link to="/tips/share">
                <Plus className="h-4 w-4" /> {it ? "Condividi un consiglio" : "Share a Tip"}
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 sm:flex-none">
              <Link to="/tips/mine">
                <UserRound className="h-4 w-4" /> {it ? "I miei consigli" : "My Tips"}
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {["all", ...LEVELS].map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                level === l
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {l === "all" ? (it ? "Tutti" : "All") : l}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <Lightbulb className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              {it
                ? "Ancora nessun consiglio pubblicato. Sii il primo a condividerne uno!"
                : "No tips published yet. Be the first to share one!"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((tip) => (
              <TipCard key={tip.id} tip={tip} it={it} />
            ))}
          </div>
        )}

        <p className="mt-10 text-xs text-muted-foreground/80 leading-relaxed italic">
          {it
            ? "I consigli sono opinioni personali condivise dalle famiglie. DISbook non è affiliato con gli enti citati, non riceve compensi e non garantisce la qualità dei servizi: verifica sempre in autonomia."
            : "Tips are personal opinions shared by families. DISbook is not affiliated with the listed providers, receives no compensation and does not guarantee service quality: always verify independently."}
        </p>
      </div>
    </MainLayout>
  );
};

export default Tips;
