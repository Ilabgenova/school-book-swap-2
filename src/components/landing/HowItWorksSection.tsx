import { UserPlus, Search, Handshake } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const icons = [UserPlus, Search, Handshake];

export const HowItWorksSection = () => {
  const { t } = useLanguage();
  const h = t.landing.howItWorks;

  return (
    <section className="py-20 md:py-28 bg-secondary/40 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

      <div className="container relative">
        <div className="text-center mb-14">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent mb-3">
            {h.eyebrow}
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tighter">
            {h.title}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5 relative">
          {h.steps.map((step, index) => {
            const Icon = icons[index] ?? UserPlus;
            return (
              <div
                key={index}
                className="relative p-7 rounded-xl bg-card border border-border hover:border-accent/40 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg gradient-primary text-primary-foreground shadow-soft group-hover:shadow-glow transition-shadow">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <span className="font-mono text-3xl font-bold text-accent/20 group-hover:text-accent/40 transition-colors">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-display text-xl font-semibold text-foreground mb-2 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
