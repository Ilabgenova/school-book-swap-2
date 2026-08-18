import { useMemo } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

/**
 * Clean, simplified map of Italy with a dynamic route from Genova to an
 * approximate arrival city based on the equivalent car km avoided.
 * Visual comparison only — not a real journey.
 */

type City = { name: string; x: number; y: number; minKm: number };

// Milestone cities ordered from north to south (viewBox 0 0 200 300 coords)
const CITIES: City[] = [
  { name: "La Spezia", x: 62, y: 104, minKm: 1 },
  { name: "Firenze", x: 86, y: 126, minKm: 101 },
  { name: "Roma", x: 100, y: 160, minKm: 251 },
  { name: "Napoli", x: 112, y: 188, minKm: 401 },
  { name: "Bari", x: 178, y: 184, minKm: 601 },
  { name: "Reggio Calabria", x: 150, y: 238, minKm: 801 },
  { name: "Palermo", x: 100, y: 266, minKm: 1001 },
];

const GENOVA = { name: "Genova", x: 48, y: 88 };

const ITALY_MAINLAND =
  "M 28 58 L 44 40 L 70 32 L 92 38 L 112 28 L 130 34 L 148 52 L 144 68 L 152 86 " +
  "L 160 104 L 170 126 L 176 146 L 182 164 L 188 160 L 192 168 L 180 176 L 186 186 " +
  "L 192 196 L 186 206 L 176 206 L 166 196 L 152 196 L 146 206 L 152 220 L 158 234 " +
  "L 152 246 L 142 244 L 134 228 L 126 212 L 118 198 L 108 186 L 100 172 L 96 158 " +
  "L 88 142 L 78 124 L 68 110 L 58 96 L 46 86 L 34 78 Z";
const SICILY = "M 78 262 L 118 254 L 130 274 L 92 282 Z";
const SARDINIA = "M 46 152 L 60 148 L 64 186 L 48 190 Z";

const cityForKm = (km: number): City | null => {
  if (km < 1) return null;
  let match: City = CITIES[0];
  for (const c of CITIES) if (km >= c.minKm) match = c;
  return match;
};

/** Smooth-ish polyline through the milestone chain up to the arrival city. */
const routePoints = (arrival: City | null) => {
  if (!arrival) return [] as { x: number; y: number }[];
  const idx = CITIES.findIndex((c) => c.name === arrival.name);
  return [GENOVA, ...CITIES.slice(0, idx + 1)].map((c) => ({ x: c.x, y: c.y }));
};

const toPathD = (pts: { x: number; y: number }[]) =>
  pts.length < 2
    ? ""
    : pts.reduce((d, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${d} L ${p.x} ${p.y}`), "");

export const ItalyRouteMap = ({ carKm, compact }: { carKm: number; compact?: boolean }) => {
  const { language } = useLanguage();
  const T = (it: string, en: string) => (language === "it" ? it : en);

  const arrival = useMemo(() => cityForKm(carKm), [carKm]);
  const pts = useMemo(() => routePoints(arrival), [arrival]);
  const d = useMemo(() => toPathD(pts), [pts]);

  const fmt = (n: number) =>
    n.toLocaleString(language === "it" ? "it-IT" : "en-GB", { maximumFractionDigits: 0 });

  return (
    <div className="w-full rounded-xl border border-success/30 bg-background p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <svg
          viewBox="0 0 210 300"
          role="img"
          aria-label={T(
            `Mappa dell'Italia: percorso equivalente da Genova${arrival ? ` a ${arrival.name}` : ""}`,
            `Map of Italy: equivalent route from Genova${arrival ? ` to ${arrival.name}` : ""}`,
          )}
          className={`mx-auto w-auto ${compact ? "h-44" : "h-52 sm:h-64"} sm:mx-0`}
        >
          <path d={ITALY_MAINLAND} className="fill-success/15 stroke-success/50" strokeWidth="1.5" strokeLinejoin="round" />
          <path d={SICILY} className="fill-success/15 stroke-success/50" strokeWidth="1.5" strokeLinejoin="round" />
          <path d={SARDINIA} className="fill-success/10 stroke-success/40" strokeWidth="1.5" strokeLinejoin="round" />

          {d && (
            <>
              <path
                d={d}
                fill="none"
                className="stroke-accent/25"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={d}
                fill="none"
                className="stroke-accent"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}

          {/* Genova (departure) */}
          <circle cx={GENOVA.x} cy={GENOVA.y} r="8" className="fill-accent/20" />
          <circle cx={GENOVA.x} cy={GENOVA.y} r="4" className="fill-accent stroke-background" strokeWidth="1.5" />
          <text
            x={GENOVA.x - 10}
            y={GENOVA.y - 8}
            textAnchor="end"
            className="fill-foreground"
            fontSize="11"
            fontWeight="600"
          >
            Genova
          </text>

          {/* Arrival */}
          {arrival && (
            <>
              <circle cx={arrival.x} cy={arrival.y} r="9" className="fill-success/25" />
              <circle cx={arrival.x} cy={arrival.y} r="4.5" className="fill-success stroke-background" strokeWidth="1.5" />
              <text
                x={arrival.x + 9}
                y={arrival.y + 4}
                className="fill-foreground"
                fontSize="11"
                fontWeight="600"
              >
                {arrival.name}
              </text>
            </>
          )}
        </svg>

        <div className="space-y-1.5 sm:flex-1">
          <p className="text-sm font-semibold text-foreground">
            {T("Partenza: Genova", "Departure: Genova")}
          </p>
          <p className="text-sm font-semibold text-foreground">
            {T("Confronto visivo:", "Visual comparison:")}{" "}
            <span className="text-success">Genova → {arrival ? arrival.name : "—"}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            {arrival
              ? T(
                  `Con questo impatto, le emissioni evitate sono paragonabili a percorrere circa ${fmt(carKm)} km in auto — più o meno la distanza da Genova a ${arrival.name}.`,
                  `With this impact, the avoided emissions are comparable to driving approximately ${fmt(carKm)} km by car — around the distance from Genova to ${arrival.name}.`,
                )
              : T(
                  "Nessun percorso ancora: appena i libri iniziano a essere riutilizzati, il percorso parte da Genova.",
                  "No route yet: as soon as books start being reused, the route sets off from Genova.",
                )}
          </p>
          <p className="text-[11px] leading-snug text-muted-foreground">
            {T(
              "Questa mappa è un confronto visivo dei km in auto equivalenti evitati grazie al riuso dei libri. Non rappresenta un viaggio reale.",
              "This map is a visual comparison of the equivalent km by car avoided through book reuse. It does not show a real journey.",
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ItalyRouteMap;
