import { useEffect, useState } from "react";
import { Leaf, BookOpen, Car, Globe2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { TreeComparison } from "@/components/impact/TreeComparison";
import { impactFromBooks } from "@/lib/impact";

type ImpactRpc = {
  books_reused: number;
  co2_kg_per_book: number;
  total_co2_avoided_kg: number;
  source_note: string;
};

export const SustainabilitySection = () => {
  const { language } = useLanguage();
  const T = (it: string, en: string) => (language === "it" ? it : en);
  const [booksReused, setBooksReused] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.rpc("public_get_co2_impact");
      if (cancelled || error || !data) return;
      const impact = data as unknown as ImpactRpc;
      setBooksReused(Number(impact.books_reused || 0));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const { co2, carKm } = impactFromBooks(booksReused);

  const fmt = (n: number) =>
    n.toLocaleString(language === "it" ? "it-IT" : "en-GB", { maximumFractionDigits: 0 });

  return (
    <section
      aria-label={T("Impatto ambientale", "Environmental impact")}
      className="relative overflow-hidden bg-gradient-to-b from-success/5 via-background to-background py-14 sm:py-20"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-success/15 text-success mb-4">
            <Globe2 className="h-7 w-7" aria-hidden />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            <span className="tabular-nums">{fmt(co2)}</span>{" "}
            <span className="text-success">{T("kg di CO₂ evitati", "kg CO₂ avoided")}</span>
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            {booksReused > 0
              ? T(
                  "Grazie a chi dà una seconda vita ai libri nella comunità DISbook.",
                  "By giving books a second life through the DISbook community.",
                )
              : T(
                  "Inizia a riutilizzare libri per far crescere l'impatto DISbook.",
                  "Start reusing books to grow the DISbook impact.",
                )}
          </p>
        </div>

        <div className="mt-8 sm:mt-12 max-w-3xl mx-auto rounded-2xl border border-success/20 bg-card shadow-soft p-5 sm:p-7 space-y-3">
          <StatRow
            icon={<BookOpen className="h-5 w-5" />}
            label={T("Libri riutilizzati", "Books reused")}
            value={fmt(booksReused)}
          />
          <StatRow
            icon={<Leaf className="h-5 w-5" />}
            label={T("CO₂ evitata", "CO₂ avoided")}
            value={`${fmt(co2)} kg`}
            accent
          />
          <StatRow
            icon={<Car className="h-5 w-5" />}
            label={T("Equivalente a", "Equivalent to")}
            value={`${fmt(carKm)} km`}
          />
          <p className="text-sm text-muted-foreground">
            {T(
              `Equivale a evitare le emissioni di circa ${fmt(carKm)} km percorsi in auto.`,
              `Equivalent to avoiding emissions from driving approximately ${fmt(carKm)} km by car.`,
            )}
          </p>

          <TreeComparison co2Kg={co2} />

          <p className="text-[11px] leading-snug text-muted-foreground">
            {T(
              "Stima di calcolo: 1 libro riutilizzato = 3 kg di CO₂ evitati. Equivalente auto basato su 0,12 kg CO₂/km. Confronto alberi basato su 22 kg di CO₂, simile a un albero maturo che assorbe CO₂ in un anno.",
              "Calculation estimate: 1 reused book = 3 kg CO₂ avoided. Car equivalent based on 0.12 kg CO₂/km. Tree comparison based on 22 kg CO₂, similar to one mature tree absorbing CO₂ in one year.",
            )}
          </p>
        </div>
      </div>
    </section>
  );
};

const StatRow = ({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) => (
  <div
    className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 ${
      accent ? "bg-success/10 border-success/30" : "bg-background"
    }`}
  >
    <div className="flex items-center gap-3 min-w-0">
      <span
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
          accent ? "bg-success/20 text-success" : "bg-muted text-foreground"
        }`}
      >
        {icon}
      </span>
      <span className="text-sm text-muted-foreground truncate">{label}</span>
    </div>
    <span
      className={`text-lg sm:text-xl font-bold tabular-nums whitespace-nowrap ${
        accent ? "text-success" : "text-foreground"
      }`}
    >
      {value}
    </span>
  </div>
);

export default SustainabilitySection;
