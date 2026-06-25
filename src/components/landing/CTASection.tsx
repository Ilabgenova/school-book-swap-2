import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Recycle, Coins, Trees, BookOpen } from "lucide-react";

const stats = [
  { icon: BookOpen, value: "1,284", label: "Books reused", suffix: "" },
  { icon: Coins, value: "18,420", label: "Money saved", suffix: "€" },
  { icon: Trees, value: "3.2", label: "Tons CO₂ avoided", suffix: "t" },
  { icon: Recycle, value: "412", label: "Families joined", suffix: "" },
];

export const CTASection = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden gradient-dark">
      {/* Mesh accents */}
      <div className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage: `radial-gradient(at 15% 20%, hsl(217 91% 55% / 0.25) 0px, transparent 50%),
                            radial-gradient(at 85% 80%, hsl(168 76% 42% / 0.20) 0px, transparent 50%)`,
        }}
      />
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(hsl(0 0% 100% / 1) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(0 0% 100% / 1) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
        }}
      />

      <div className="container relative">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px mb-16 rounded-xl overflow-hidden border border-primary-foreground/10 bg-primary-foreground/5">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-primary p-6 md:p-8 flex flex-col gap-3 hover:bg-primary/80 transition-colors"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--teal))]/15 text-[hsl(var(--teal-glow))]">
                <s.icon className="h-4.5 w-4.5" strokeWidth={2} />
              </div>
              <div>
                <p className="font-display text-3xl md:text-4xl font-bold text-primary-foreground tracking-tighter leading-none">
                  {s.suffix && s.suffix !== "t" ? s.suffix : ""}
                  {s.value}
                  {s.suffix === "t" ? s.suffix : ""}
                </p>
                <p className="text-xs text-primary-foreground/60 uppercase tracking-wider mt-2 font-medium">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[hsl(var(--teal-glow))] mb-4">
            Join DISbook
          </p>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-5 tracking-tighter leading-[1.05]">
            Give books a <span className="gradient-text">second life</span>.
          </h2>
          <p className="text-base md:text-lg text-primary-foreground/70 mb-8 leading-relaxed">
            Free to join. Verified DIS community. Parent-to-parent exchange,
            no in-app payments.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register">
              <Button variant="hero" size="lg" className="w-full sm:w-auto group">
                Create your account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/browse">
              <Button variant="heroOutline" size="lg" className="w-full sm:w-auto">
                Explore the marketplace
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
