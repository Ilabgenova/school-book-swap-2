import { useEffect, useState } from "react";
import { Leaf, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Impact = {
  books_reused: number;
  co2_kg_per_book: number;
  total_co2_avoided_kg: number;
  source_note: string;
};

export const Co2ImpactBand = () => {
  const { language } = useLanguage();
  const T = (it: string, en: string) => (language === "it" ? it : en);
  const [impact, setImpact] = useState<Impact | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.rpc("public_get_co2_impact");
      if (!cancelled && !error && data) setImpact(data as unknown as Impact);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasData = impact && impact.books_reused > 0;
  const totalKg = impact ? Number(impact.total_co2_avoided_kg || 0) : 0;
  const formatted = totalKg.toFixed(totalKg >= 10 ? 0 : 1);

  return (
    <>
      <section
        aria-label={T("Impatto CO₂", "CO₂ impact")}
        className="w-full bg-success/10 border-y border-success/30"
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full text-left"
        >
          <div className="container mx-auto px-4 py-3 flex items-center gap-3 sm:gap-4">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
              <Leaf className="h-5 w-5 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              {hasData ? (
                <>
                  <p className="text-base sm:text-lg font-bold text-foreground leading-tight">
                    {formatted} {T("kg di CO₂ evitati", "kg CO₂ avoided")}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-snug">
                    {T(
                      "Libri riutilizzati tramite DISbook invece di comprarli nuovi.",
                      "Books reused through DISbook instead of buying new ones.",
                    )}
                  </p>
                </>
              ) : (
                <p className="text-xs sm:text-sm text-muted-foreground leading-snug">
                  {T(
                    "La CO₂ evitata apparirà qui quando i libri inizieranno a essere riutilizzati tramite DISbook.",
                    "CO₂ avoided will appear here once books start being reused through DISbook.",
                  )}
                </p>
              )}
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-success whitespace-nowrap">
              {T("Vedi calcolo", "See calculation")}
              <ArrowRight className="h-4 w-4" />
            </span>
            <ArrowRight className="sm:hidden h-4 w-4 text-success flex-shrink-0" />
          </div>
        </button>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-success" />
              {T("Come calcoliamo la CO₂ evitata", "How we calculate CO₂ avoided")}
            </DialogTitle>
            <DialogDescription>
              {T(
                "Questa è una stima basata sul numero di libri usati scambiati tramite DISbook. Riutilizzare un libro invece di comprarne uno nuovo aiuta a evitare una parte delle emissioni collegate alla produzione e distribuzione di un nuovo libro.",
                "This is an estimate based on the number of used books exchanged through DISbook. Instead of buying a new copy, each reused book helps avoid part of the emissions connected with producing and distributing a new book.",
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 rounded-md border bg-muted/30 p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {T("Libri riutilizzati", "Books reused")}
              </span>
              <span className="font-semibold">{impact?.books_reused ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {T("CO₂ stimata evitata per libro", "Estimated CO₂ avoided per book")}
              </span>
              <span className="font-semibold">
                {(impact?.co2_kg_per_book ?? 0)} kg
              </span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="font-medium">
                {T("Totale stimato di CO₂ evitata", "Total estimated CO₂ avoided")}
              </span>
              <span className="font-bold text-success">{formatted} kg</span>
            </div>
            <p className="text-xs text-muted-foreground pt-2 border-t">
              {impact?.books_reused ?? 0} × {impact?.co2_kg_per_book ?? 0} kg
              {" = "}
              {formatted} kg {T("CO₂ evitata", "CO₂ avoided")}
            </p>
          </div>

          {impact?.source_note ? (
            <p className="text-xs text-muted-foreground italic">
              {T("Fonte / nota", "Source / note")}: {impact.source_note}
            </p>
          ) : null}

          <p className="text-xs text-muted-foreground">
            {T(
              "Questa è una stima educativa. Il coefficiente potrà essere aggiornato quando miglioreremo il calcolo o useremo fonti più precise.",
              "This is an educational estimate. The coefficient may be updated as we improve the calculation or use more precise sources.",
            )}
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};
