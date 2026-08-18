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
  { name: "La Spezia", x: 53, y: 99, minKm: 1 },
  { name: "Firenze", x: 77, y: 106, minKm: 101 },
  { name: "Roma", x: 98, y: 149, minKm: 251 },
  { name: "Napoli", x: 128, y: 173, minKm: 401 },
  { name: "Bari", x: 173, y: 167, minKm: 601 },
  { name: "Reggio Calabria", x: 152, y: 236, minKm: 801 },
  { name: "Palermo", x: 113, y: 240, minKm: 1001 },
];

const GENOVA = { name: "Genova", x: 38, y: 92 };

const ITALY_MAINLAND =
  "M 95.9 37.6 L 120.3 43.5 L 118.5 54.8 L 122.5 64.6 L 109.0 61.2 L 95.1 69.4 L 96.1 80.8 L 94.0 87.3 L 99.6 99.0 L 115.5 110.5 L 124.1 129.5 L 143.1 148.0 L 156.5 147.9 L 160.6 152.9 L 155.8 157.5 L 183.6 172.7 L 198.2 184.7 L 200.0 189.0 L 196.8 197.2 L 187.4 186.5 L 172.5 182.7 L 165.4 197.5 L 177.7 206.0 L 175.7 218.0 L 168.5 219.4 L 159.4 239.1 L 152.3 240.8 L 152.4 233.8 L 155.9 221.5 L 159.6 216.6 L 147.7 191.7 L 140.6 188.9 L 135.6 179.0 L 124.6 174.8 L 117.3 165.6 L 104.7 164.1 L 75.7 138.8 L 64.1 125.6 L 58.8 102.9 L 50.3 100.2 L 36.5 92.7 L 28.6 95.8 L 18.8 106.4 L 11.7 108.1 L 13.6 98.1 L 4.4 95.2 L 0.0 77.5 L 5.9 70.5 L 0.9 61.9 L 1.6 55.4 L 8.9 60.3 L 17.2 59.2 L 26.7 51.4 L 29.7 55.1 L 37.8 54.3 L 41.5 45.1 L 54.1 48.0 L 61.6 44.1 L 63.0 34.7 L 73.3 38.0 L 75.3 33.6 L 92.1 29.6 L 95.9 37.6 Z";
const SICILY = "M 149.5 233.4 L 143.4 251.5 L 145.9 258.6 L 142.4 270.4 L 129.3 261.8 L 120.7 259.3 L 96.9 247.6 L 99.2 235.8 L 119.2 237.9 L 149.5 233.4 Z";
const SARDINIA = "M 41.9 165.1 L 52.2 181.4 L 49.8 211.7 L 42.0 210.3 L 35.1 217.9 L 28.6 211.9 L 27.9 184.2 L 24.0 171.1 L 33.4 172.2 L 41.9 165.1 Z";

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
          viewBox="-26 18 250 282"
          role="img"
          aria-label={T(
            `Mappa dell'Italia: percorso equivalente da Genova${arrival ? ` a ${arrival.name}` : ""}`,
            `Map of Italy: equivalent route from Genova${arrival ? ` to ${arrival.name}` : ""}`,
          )}
          className={`mx-auto w-auto ${compact ? "h-52" : "h-52 sm:h-64"} sm:mx-0`}
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
