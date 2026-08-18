import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

/**
 * Stylised Italy-in-Europe map with a dynamic southbound route from Genova.
 * The traced line length is driven purely by the calculated car-km equivalent.
 * Visual comparison only — not a real trip.
 */
const FULL_ROUTE_KM = 900;

// Stylised path: Genova → La Spezia/Tuscany → Rome → Naples → Calabria/Sicily
const ROUTE_D = "M 96 74 C 106 88, 116 100, 124 116 C 134 136, 142 152, 152 168 C 162 184, 172 196, 182 208";
const GENOVA = { x: 96, y: 74 };

export const ItalyRouteMap = ({ carKm, compact }: { carKm: number; compact?: boolean }) => {
  const { language } = useLanguage();
  const T = (it: string, en: string) => (language === "it" ? it : en);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [length, setLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) setLength(pathRef.current.getTotalLength());
  }, []);

  const progress = useMemo(
    () => Math.max(0, Math.min(carKm / FULL_ROUTE_KM, 1)),
    [carKm],
  );

  const drawn = length * progress;
  const head = useMemo(() => {
    if (!pathRef.current || drawn <= 0) return null;
    const p = pathRef.current.getPointAtLength(drawn);
    return { x: p.x, y: p.y };
  }, [drawn]);

  const fmt = (n: number) =>
    n.toLocaleString(language === "it" ? "it-IT" : "en-GB", { maximumFractionDigits: 0 });

  return (
    <div className="w-full rounded-xl border border-success/30 bg-background p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <svg
          viewBox="0 0 260 240"
          role="img"
          aria-label={T(
            "Mappa stilizzata: percorso equivalente da Genova verso sud",
            "Stylised map: equivalent route from Genova heading south",
          )}
          className={`w-full max-w-full ${compact ? "h-40" : "h-48 sm:h-56"} sm:w-1/2`}
        >
          {/* Europe context */}
          <path
            d="M10 40 L70 20 L120 28 L170 14 L230 34 L248 84 L220 120 L232 168 L196 208 L150 232 L96 220 L54 186 L20 140 Z"
            className="fill-muted stroke-border"
            strokeWidth="1"
          />
          {/* Italy (stylised boot) */}
          <path
            d="M84 60 L112 56 L132 70 L150 96 L166 130 L186 164 L198 194 L184 206 L166 186 L150 158 L134 132 L112 104 L92 88 Z"
            className="fill-success/20 stroke-success/60"
            strokeWidth="1.5"
          />
          <path
            d="M196 210 L222 202 L226 220 L204 226 Z"
            className="fill-success/20 stroke-success/60"
            strokeWidth="1.5"
          />

          {/* Route base */}
          <path
            ref={pathRef}
            d={ROUTE_D}
            fill="none"
            className="stroke-border"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="4 5"
          />
          {/* Route progress */}
          {length > 0 && drawn > 0 && (
            <path
              d={ROUTE_D}
              fill="none"
              className="stroke-accent"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${drawn} ${length}`}
              style={{ transition: "stroke-dasharray 700ms ease-out" }}
            />
          )}

          {/* Genova marker */}
          <circle cx={GENOVA.x} cy={GENOVA.y} r="5" className="fill-accent" />
          <circle cx={GENOVA.x} cy={GENOVA.y} r="9" className="fill-accent/25" />
          <text x={GENOVA.x + 12} y={GENOVA.y - 4} className="fill-foreground" fontSize="11" fontWeight="600">
            Genova
          </text>

          {head && (
            <circle cx={head.x} cy={head.y} r="4.5" className="fill-success stroke-background" strokeWidth="1.5" />
          )}

          <text x="150" y="132" className="fill-muted-foreground" fontSize="9">
            {T("Centro Italia", "Central Italy")}
          </text>
          <text x="176" y="222" className="fill-muted-foreground" fontSize="9">
            {T("Sud Italia", "South Italy")}
          </text>
        </svg>

        <div className="sm:w-1/2 space-y-1.5">
          <p className="text-sm font-semibold text-foreground">
            {T("Partenza da Genova", "Starting from Genova")}
          </p>
          <p className="text-sm text-muted-foreground">
            {T("Distanza equivalente evitata:", "Equivalent distance avoided:")}{" "}
            <span className="font-bold text-foreground tabular-nums">{fmt(carKm)} km</span>{" "}
            {T("in auto", "by car")}
          </p>
          <p className="text-[11px] leading-snug text-muted-foreground">
            {T(
              "Questa mappa è un confronto visivo dei km in auto equivalenti evitati grazie al riuso dei libri.",
              "This map is a visual comparison of the equivalent km by car avoided through book reuse.",
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ItalyRouteMap;
