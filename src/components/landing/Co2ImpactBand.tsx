import { useEffect, useState } from "react";
import { Leaf, ArrowDown, BookOpen, Car } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { TreeComparison } from "@/components/impact/TreeComparison";
import { impactFromBooks } from "@/lib/impact";

type Impact = {
  books_reused: number;
  co2_kg_per_book: number;
  total_co2_avoided_kg: number;
  source_note: string;
};

export const Co2ImpactBand = () => {
  const { language } = useLanguage();
  const T = (it: string, en: string) => (language === "it" ? it : en);
  const [booksReused, setBooksReused] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.rpc("public_get_co2_impact");
      if (cancelled || error || !data) return;
      const impact = data as unknown as Impact;
      setBooksReused(Number(impact.books_reused || 0));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const { co2, carKm } = impactFromBooks(booksReused);

  const fmt = (n: number) =>
    n.toLocaleString(language === "it" ? "it-IT" : "en-GB", { maximumFractionDigits: 0 });

  const scrollToDetails = () => {
    document.getElementById("impact-details")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      aria-label={T("Impatto economia circolare", "Circular economy impact")}
      className="w-full bg-success/10 border-y border-success/30"
    >
      <div className="container mx-auto px-4 py-4 sm:py-5">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-success/20">
            <Leaf className="h-4 w-4 text-success" />
          </span>
          <h2 className="font-display text-base sm:text-lg font-bold text-foreground">
            {T("Impatto economia circolare", "Circular Economy Impact")}
          </h2>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <Stat
            icon={<BookOpen className="h-4 w-4" />}
            label={T("Libri riutilizzati", "Books reused")}
            value={fmt(booksReused)}
          />
          <Stat
            icon={<Leaf className="h-4 w-4" />}
            label={T("CO₂ evitata", "CO₂ avoided")}
            value={`${fmt(co2)} kg`}
            accent
          />
          <Stat
            icon={<Car className="h-4 w-4" />}
            label={T("Equivalente a", "Equivalent to")}
            value={`${fmt(carKm)} km`}
          />
        </div>

        <div className="mt-3">
          <TreeComparison co2Kg={co2} compact />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={scrollToDetails}
          className="mt-3 w-full sm:w-auto min-h-11 border-success/40 text-success hover:bg-success/10 hover:text-success"
        >
          {T("Vedi i dettagli dell'impatto", "See impact details")}
          <ArrowDown className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
};

const Stat = ({
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
    className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 ${
      accent ? "bg-success/15 border-success/30" : "bg-background border-border"
    }`}
  >
    <span className="flex items-center gap-2 min-w-0 text-sm text-muted-foreground">
      <span className={accent ? "text-success" : "text-foreground"}>{icon}</span>
      <span className="truncate">{label}</span>
    </span>
    <span
      className={`text-sm sm:text-base font-bold tabular-nums whitespace-nowrap ${
        accent ? "text-success" : "text-foreground"
      }`}
    >
      {value}
    </span>
  </div>
);
