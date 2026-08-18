import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { TreeComparison } from "@/components/impact/TreeComparison";
import { ItalyRouteMap } from "@/components/impact/ItalyRouteMap";
import { impactFromBooks } from "@/lib/impact";
import { Leaf, Loader2, ShoppingBag, Tag } from "lucide-react";

type Impact = { books_sold: number; books_bought: number };

export const PersonalImpactCard = () => {
  const { language } = useLanguage();
  const T = (it: string, en: string) => (language === "it" ? it : en);
  const [data, setData] = useState<Impact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: res, error } = await supabase.rpc("my_circular_impact");
      if (cancelled) return;
      if (!error && res) setData(res as unknown as Impact);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const sold = data?.books_sold ?? 0;
  const bought = data?.books_bought ?? 0;
  const soldImpact = impactFromBooks(sold);
  const boughtImpact = impactFromBooks(bought);
  const total = impactFromBooks(sold + bought);

  const fmt = (n: number) =>
    n.toLocaleString(language === "it" ? "it-IT" : "en-GB", { maximumFractionDigits: 0 });

  return (
    <section className="rounded-2xl border border-success/25 bg-card p-5 md:p-7">
      <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground flex items-center gap-2">
        <Leaf className="h-5 w-5 text-success" />
        {T("Il tuo impatto circolare", "Your circular impact")}
      </h2>

      {loading ? (
        <div className="py-8 flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Block
              icon={<ShoppingBag className="h-4 w-4" />}
              title={T("Libri comprati", "Books bought")}
              lines={[
                `${fmt(bought)} ${T("libri riutilizzati", "books reused")}`,
                `${fmt(boughtImpact.co2)} kg ${T("CO₂ evitata", "CO₂ avoided")}`,
                `${T("Equivalente a", "Equivalent to")} ${fmt(boughtImpact.carKm)} km ${T("in auto", "by car")}`,
              ]}
            />
            <Block
              icon={<Tag className="h-4 w-4" />}
              title={T("Libri venduti", "Books sold")}
              lines={[
                `${fmt(sold)} ${T("libri riutilizzati da altre famiglie", "books reused by other families")}`,
                `${fmt(soldImpact.co2)} kg ${T("CO₂ evitata", "CO₂ avoided")}`,
                `${T("Equivalente a", "Equivalent to")} ${fmt(soldImpact.carKm)} km ${T("in auto", "by car")}`,
              ]}
            />
          </div>

          <div className="rounded-xl border border-success/30 bg-success/10 p-4">
            <p className="text-sm font-semibold text-foreground">
              {T("Totale", "Total")}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {fmt(total.books)} {T("libri riutilizzati", "books reused")} · {fmt(total.co2)} kg{" "}
              {T("CO₂ evitata", "CO₂ avoided")} · {T("Equivalente a", "Equivalent to")} {fmt(total.carKm)} km{" "}
              {T("in auto", "by car")}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground">
              {total.books > 0
                ? T(
                    `Con questo carrello hai evitato emissioni pari a circa ${fmt(total.carKm)} km percorsi in auto. Grazie per aver scelto un libro usato!`,
                    `With this cart you have avoided emissions equivalent to driving ${fmt(total.carKm)} km by car. Thank you for choosing a pre-loved book!`,
                  )
                : T(
                    "Inizia a riutilizzare libri per far crescere l'impatto DISbook.",
                    "Start reusing books to grow the DISbook impact.",
                  )}
            </p>
          </div>

          <TreeComparison co2Kg={total.co2} compact />

          <ItalyRouteMap carKm={total.carKm} compact />

          <p className="text-[11px] leading-snug text-muted-foreground">
            {T(
              "Stima di calcolo: 1 libro riutilizzato = 3 kg di CO₂ evitati. Equivalente auto basato su 0,12 kg CO₂/km. Confronto alberi basato su 22 kg di CO₂, simile a un albero maturo che assorbe CO₂ in un anno. Tastiere e Sphero non sono inclusi.",
              "Calculation estimate: 1 reused book = 3 kg CO₂ avoided. Car equivalent based on 0.12 kg CO₂/km. Tree comparison based on 22 kg CO₂, similar to one mature tree absorbing CO₂ in one year. Keyboards and Sphero are not included.",
            )}
          </p>
        </div>
      )}
    </section>
  );
};

const Block = ({ icon, title, lines }: { icon: React.ReactNode; title: string; lines: string[] }) => (
  <div className="rounded-xl border border-border bg-background p-4">
    <p className="text-sm font-semibold text-foreground flex items-center gap-2">
      <span className="text-accent">{icon}</span>
      {title}
    </p>
    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
      {lines.map((l) => (
        <li key={l}>{l}</li>
      ))}
    </ul>
  </div>
);

export default PersonalImpactCard;
