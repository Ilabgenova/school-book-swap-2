import { useEffect, useMemo, useRef, useState } from "react";
import { Leaf, BookOpen, Car, Minus, Plus, Globe2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";

// --- Sustainability constants (single source of truth) --------------------
export const CO2_KG_PER_BOOK = 3; // 3 kg CO₂ avoided per reused book
export const KM_PER_KG_CO2 = 1 / 0.2; // 1 km avg car = 0.2 kg CO₂ → 5 km per kg

type ImpactRpc = {
  books_reused: number;
  co2_kg_per_book: number;
  total_co2_avoided_kg: number;
  source_note: string;
};

/** Smoothly animate a number from previous to next value. */
const useAnimatedNumber = (value: number, duration = 700) => {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    fromRef.current = display;
    startRef.current = null;
    const tick = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const p = Math.min(1, (t - startRef.current) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(fromRef.current + (value - fromRef.current) * eased);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return display;
};

/** Tree/plant illustration that grows with book count. Pure emoji + CSS
 * so it stays lightweight, crisp on every device, and easy to extend. */
const GrowingTree = ({ books }: { books: number }) => {
  const stage = useMemo(() => {
    if (books <= 0) return { emoji: "🌰", scale: 0.7, label: "seed" };
    if (books <= 2) return { emoji: "🌱", scale: 0.85, label: "sprout" };
    if (books <= 5) return { emoji: "🌿", scale: 1.0, label: "young-plant" };
    if (books <= 10) return { emoji: "🌳", scale: 1.15, label: "young-tree" };
    if (books <= 20) return { emoji: "🌳", scale: 1.35, label: "mature-tree" };
    return { emoji: "🌳", scale: 1.55, label: "flourishing-tree" };
  }, [books]);

  // Floating leaves — regenerate key so the CSS animation replays on add
  const leafKey = books;

  return (
    <div className="relative mx-auto h-40 w-40 sm:h-48 sm:w-48 flex items-end justify-center">
      {/* soft ground shadow */}
      <div className="absolute bottom-2 h-3 w-24 sm:w-28 rounded-full bg-success/20 blur-md" />

      {/* Tree */}
      <div
        key={stage.label}
        className="relative select-none transition-transform duration-700 ease-out animate-scale-in"
        style={{ transform: `scale(${stage.scale})`, fontSize: "5rem", lineHeight: 1 }}
        aria-hidden
      >
        {stage.emoji}
        {books >= 20 && (
          <span
            className="absolute -top-2 -right-3 text-xl"
            style={{ animation: "fade-in 0.6s ease-out" }}
            aria-hidden
          >
            🐦
          </span>
        )}
      </div>

      {/* Floating leaves on change */}
      {books > 0 && (
        <>
          <span
            key={`l1-${leafKey}`}
            className="absolute text-lg opacity-0"
            style={{
              left: "20%",
              bottom: "35%",
              animation: "leaf-float 1.6s ease-out forwards",
            }}
            aria-hidden
          >
            🍃
          </span>
          <span
            key={`l2-${leafKey}`}
            className="absolute text-base opacity-0"
            style={{
              right: "18%",
              bottom: "45%",
              animation: "leaf-float 1.9s ease-out 0.15s forwards",
            }}
            aria-hidden
          >
            🍃
          </span>
        </>
      )}
    </div>
  );
};

export const SustainabilitySection = () => {
  const { language } = useLanguage();
  const T = (it: string, en: string) => (language === "it" ? it : en);

  const [totalBooksReused, setTotalBooksReused] = useState(0);
  const [cartBooks, setCartBooks] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.rpc("public_get_co2_impact");
      if (cancelled || error || !data) return;
      const impact = data as unknown as ImpactRpc;
      setTotalBooksReused(Number(impact.books_reused || 0));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalKg = totalBooksReused * CO2_KG_PER_BOOK;
  const animatedTotalKg = useAnimatedNumber(totalKg);

  const cartCo2 = cartBooks * CO2_KG_PER_BOOK;
  const cartKm = cartCo2 * KM_PER_KG_CO2;
  const animatedCartBooks = useAnimatedNumber(cartBooks, 450);
  const animatedCartCo2 = useAnimatedNumber(cartCo2, 500);
  const animatedCartKm = useAnimatedNumber(cartKm, 550);

  const fmt = (n: number, digits = 0) =>
    n.toLocaleString(language === "it" ? "it-IT" : "en-GB", {
      maximumFractionDigits: digits,
    });

  const inc = () => setCartBooks((n) => Math.min(50, n + 1));
  const dec = () => setCartBooks((n) => Math.max(0, n - 1));

  return (
    <section
      aria-label={T("Impatto ambientale", "Environmental impact")}
      className="relative overflow-hidden bg-gradient-to-b from-success/5 via-background to-background py-14 sm:py-20"
    >
      {/* Local keyframes for floating leaves */}
      <style>{`
        @keyframes leaf-float {
          0% { opacity: 0; transform: translate(0, 0) rotate(0deg); }
          20% { opacity: 1; }
          100% { opacity: 0; transform: translate(-8px, -60px) rotate(-25deg); }
        }
      `}</style>

      <div className="container mx-auto px-4">
        {/* Big CO₂ counter */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-success/15 text-success mb-4">
            <Globe2 className="h-7 w-7" aria-hidden />
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
            <span className="tabular-nums">{fmt(animatedTotalKg, 0)}</span>{" "}
            <span className="text-success">
              {T("kg di CO₂ evitati", "kg CO₂ avoided")}
            </span>
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground">
            {T(
              "Grazie a chi dà una seconda vita ai libri nella comunità DISbook.",
              "By giving books a second life through the DISbook community.",
            )}
          </p>
        </div>

        {/* Dynamic widget */}
        <div className="mt-10 sm:mt-14 max-w-4xl mx-auto rounded-2xl border border-success/20 bg-card shadow-soft p-5 sm:p-8">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            {/* Left: tree + cart controls */}
            <div className="text-center">
              <GrowingTree books={cartBooks} />

              <div className="mt-4 inline-flex items-center gap-3 rounded-full border bg-background px-2 py-1.5 shadow-sm">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={dec}
                  aria-label={T("Rimuovi un libro", "Remove a book")}
                  className="h-9 w-9 rounded-full"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="min-w-[3.5rem] text-center">
                  <div className="text-2xl font-bold tabular-nums leading-none">
                    {fmt(animatedCartBooks, 0)}
                  </div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {cartBooks === 1 ? T("libro", "book") : T("libri", "books")}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={inc}
                  aria-label={T("Aggiungi un libro", "Add a book")}
                  className="h-9 w-9 rounded-full bg-success/10 text-success hover:bg-success/20"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {T(
                  "Prova: aggiungi libri e guarda l'impatto crescere.",
                  "Try it: add books and watch your impact grow.",
                )}
              </p>
            </div>

            {/* Right: live stats + message */}
            <div className="space-y-3">
              <StatRow
                icon={<BookOpen className="h-5 w-5" />}
                label={T("Libri riutilizzati", "Books reused")}
                value={fmt(animatedCartBooks, 0)}
              />
              <StatRow
                icon={<Leaf className="h-5 w-5" />}
                label={T("CO₂ evitata", "CO₂ avoided")}
                value={`${fmt(animatedCartCo2, 0)} kg`}
                accent
              />
              <StatRow
                icon={<Car className="h-5 w-5" />}
                label={T(
                  "Km in auto non percorsi",
                  "Car kilometres avoided",
                )}
                value={`≈ ${fmt(animatedCartKm, 0)} km`}
              />

              <div className="mt-2 rounded-lg bg-success/10 border border-success/20 p-4 text-sm leading-relaxed text-foreground">
                {cartBooks === 0 ? (
                  T(
                    "Aggiungi un libro per vedere quanta CO₂ puoi evitare 🌍",
                    "Add a book to see how much CO₂ you can avoid 🌍",
                  )
                ) : language === "it" ? (
                  <>
                    Con questo carrello hai evitato emissioni pari a circa{" "}
                    <strong>{fmt(cartKm, 0)} km percorsi in auto.</strong>
                    <br />
                    Grazie per aver scelto un libro usato! 🌍
                  </>
                ) : (
                  <>
                    With this cart you have avoided emissions equivalent to
                    driving <strong>{fmt(cartKm, 0)} km by car.</strong>
                    <br />
                    Thank you for choosing a pre-loved book! 🌍
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground max-w-xl mx-auto">
          {T(
            "Stima educativa basata su ~3 kg di CO₂ evitati per libro riutilizzato e 0,2 kg di CO₂ per km percorso in auto.",
            "Educational estimate based on ~3 kg CO₂ avoided per reused book and 0.2 kg CO₂ per km driven by car.",
          )}
        </p>
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
