import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";


export const CTASection = () => {
  const { t } = useLanguage();
  const c = t.landing.cta;

  return (
    <section className="py-20 md:py-28 relative overflow-hidden gradient-dark">
      <div className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage: `radial-gradient(at 15% 20%, hsl(217 91% 55% / 0.25) 0px, transparent 50%),
                            radial-gradient(at 85% 80%, hsl(168 76% 42% / 0.20) 0px, transparent 50%)`,
        }}
      />
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
        

        <div className="text-center max-w-2xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[hsl(var(--teal-glow))] mb-4">
            {c.eyebrow}
          </p>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-5 tracking-tighter leading-[1.05]">
            {c.titlePart1}<span className="gradient-text">{c.titleHighlight}</span>{c.titlePart2}
          </h2>
          <p className="text-base md:text-lg text-primary-foreground/70 mb-8 leading-relaxed">
            {c.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register">
              <Button variant="hero" size="lg" className="w-full sm:w-auto group">
                {c.ctaCreate}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/browse">
              <Button variant="heroOutline" size="lg" className="w-full sm:w-auto">
                {c.ctaExplore}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
