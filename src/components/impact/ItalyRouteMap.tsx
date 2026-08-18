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
  { name: "La Spezia", x: 70, y: 96, minKm: 1 },
  { name: "Firenze", x: 88, y: 118, minKm: 101 },
  { name: "Roma", x: 104, y: 152, minKm: 251 },
  { name: "Napoli", x: 116, y: 180, minKm: 401 },
  { name: "Bari", x: 166, y: 182, minKm: 601 },
  { name: "Reggio Calabria", x: 152, y: 236, minKm: 801 },
  { name: "Palermo", x: 104, y: 262, minKm: 1001 },
];

const GENOVA = { name: "Genova", x: 56, y: 82 };

const ITALY_MAINLAND =
  "M 30 62 L 52 44 L 78 40 L 96 30 L 118 38 L 136 30 L 150 44 L 140 62 L 122 72 " +
  "L 132 118 L 150 140 L 168 160 L 178 178 L 190 184 L 176 196 L 158 194 L 146 200 " +
  "L 152 218 L 163 238 L 157 252 L 145 244 L 137 224 L 127 210 L 118 194 L 106 176 " +
  "L 96 156 L 84 132 L 72 108 L 58 92 L 44 84 Z";
const SICILY = "M 86 258 L 122 250 L 130 270 L 94 278 Z";
const SARDINIA = "M 50 150 L 64 147 L 67 180 L 51 183 Z";

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
          viewBox="0 0 200 300"
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
