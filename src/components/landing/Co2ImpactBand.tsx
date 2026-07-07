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
import { Button } from "@/components/ui/button";

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
        <div className="container mx-auto px-4 py-3 sm:py-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
              <Leaf className="h-5 w-5 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base sm:text-lg font-bold text-foreground leading-tight break-words">
                <span className="tabular-nums">{formatted}</span>{" "}
                {T("kg di CO₂ evitati", "kg CO₂ avoided")}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-snug break-words">
                {hasData
                  ? T(
                      "Libri riutilizzati tramite DISbook invece di comprarli nuovi.",
                      "Books reused through DISbook instead of buying new ones.",
                    )
                  : T(
                      "Il contatore crescerà quando i libri inizieranno a essere riutilizzati tramite DISbook.",
                      "The counter will grow as books start being reused through DISbook.",
                    )}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
            className="w-full sm:w-auto border-success/40 text-success hover:bg-success/10 hover:text-success"
          >
            {T("Vedi calcolo", "See calculation")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto rounded-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 pr-8 text-base sm:text-lg">
              <Leaf className="h-5 w-5 text-success flex-shrink-0" />
              <span className="break-words">
                {T("Come calcoliamo la CO₂ evitata", "How we calculate CO₂ avoided")}
              </span>
            </DialogTitle>
            <DialogDescription className="text-sm break-words">
              {T(
                "Questa è una stima basata sul numero di libri usati scambiati tramite DISbook. Riutilizzare un libro invece di comprarne uno nuovo aiuta a evitare una parte delle emissioni collegate alla produzione e distribuzione di un nuovo libro.",
                "This is an estimate based on the number of used books exchanged through DISbook. Instead of buying a new copy, each reused book helps avoid part of the emissions connected with producing and distributing a new book.",
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 rounded-md border bg-muted/30 p-3 text-sm">
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">
                {T("Libri riutilizzati", "Books reused")}
              </span>
              <span className="font-semibold">{impact?.books_reused ?? 0}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground break-words">
                {T("CO₂ evitata per libro", "CO₂ avoided per book")}
              </span>
              <span className="font-semibold whitespace-nowrap">
                {(impact?.co2_kg_per_book ?? 0)} kg
              </span>
            </div>
            <div className="border-t pt-2 flex justify-between gap-2">
              <span className="font-medium break-words">
                {T("Totale CO₂ evitata", "Total CO₂ avoided")}
              </span>
              <span className="font-bold text-success whitespace-nowrap">{formatted} kg</span>
            </div>
            <p className="text-xs text-muted-foreground pt-2 border-t break-words">
              {impact?.books_reused ?? 0} × {impact?.co2_kg_per_book ?? 0} kg
              {" = "}
              {formatted} kg {T("CO₂ evitata", "CO₂ avoided")}
            </p>
          </div>

          {impact?.source_note ? (
            <p className="text-xs text-muted-foreground italic break-words">
              {T("Fonte / nota", "Source / note")}: {impact.source_note}
            </p>
          ) : null}

          <p className="text-xs text-muted-foreground break-words">
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
