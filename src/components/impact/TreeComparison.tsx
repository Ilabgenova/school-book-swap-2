import { TreePine, Sprout } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { KG_CO2_PER_TREE_ICON, treeCountFromCo2 } from "@/lib/impact";

type Props = {
  co2Kg: number;
  /** Compact variant for dashboard cards */
  compact?: boolean;
};

export const TreeComparison = ({ co2Kg, compact }: Props) => {
  const { language } = useLanguage();
  const T = (it: string, en: string) => (language === "it" ? it : en);

  const trees = treeCountFromCo2(co2Kg);
  const shown = Math.min(trees, 10);
  const progress = Math.min(100, Math.round((co2Kg / KG_CO2_PER_TREE_ICON) * 100));

  return (
    <div className="rounded-xl border border-success/25 bg-success/5 p-4">
      {trees > 0 ? (
        <>
          <div className="flex flex-wrap items-center gap-1.5">
            {Array.from({ length: shown }).map((_, i) => (
              <TreePine key={i} className="h-6 w-6 text-success" aria-hidden />
            ))}
            {trees > 10 && (
              <span className="ml-1 text-xs font-medium text-success">
                {T("+ altro impatto", "+ more impact")}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm font-medium text-foreground">
            {T("Confronto alberi", "Tree comparison")}: {trees}{" "}
            {T(trees === 1 ? "icona albero" : "icone albero", trees === 1 ? "tree icon" : "tree icons")}
          </p>
        </>
      ) : co2Kg > 0 ? (
        <>
          <div className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-success" aria-hidden />
            <span className="text-sm font-medium text-foreground">
              {T("In crescita verso 1 icona albero", "Growing towards 1 tree icon")}
            </span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-success/15 overflow-hidden">
            <div className="h-full rounded-full bg-success transition-all" style={{ width: `${progress}%` }} />
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2">
          <Sprout className="h-6 w-6 text-muted-foreground" aria-hidden />
          <span className="text-sm text-muted-foreground">
            {T(
              "Inizia a riutilizzare libri per far crescere l'impatto DISbook.",
              "Start reusing books to grow the DISbook impact.",
            )}
          </span>
        </div>
      )}

      {trees > 0 && (
        <p className="mt-2 text-sm text-muted-foreground">
          {T("La tua foresta dell'economia circolare sta crescendo.", "Your circular economy forest is growing.")}
        </p>
      )}

      <p className="mt-3 text-[11px] leading-snug text-muted-foreground">
        {compact
          ? T(
              "1 albero ≈ 22 kg CO₂/anno assorbiti da un albero maturo. Solo confronto visivo.",
              "1 tree ≈ 22 kg CO₂/year absorbed by one mature tree. Visual comparison only.",
            )
          : T(
              "Le icone albero sono un confronto visivo. Un albero rappresenta circa 22 kg di CO₂, simile alla CO₂ assorbita da un albero maturo in un anno. DISbook non dichiara di piantare alberi.",
              "Tree icons are a visual comparison. One tree represents approximately 22 kg CO₂, similar to the CO₂ absorbed by one mature tree in one year. DISbook does not claim that trees are planted.",
            )}
      </p>
    </div>
  );
};

export default TreeComparison;
