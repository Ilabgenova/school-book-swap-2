import { ShieldCheck, Repeat2, Leaf, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const icons = [ShieldCheck, Repeat2, Leaf];

export const FeaturesSection = () => {
  const { t } = useLanguage();
  const f = t.landing.features;

  return (
    <section className="py-20 md:py-28 bg-background relative">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent mb-3">
              {f.eyebrow}
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tighter leading-[1.05]">
              {f.title}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md leading-relaxed">
            {f.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {f.items.map((feature, i) => {
            const Icon = icons[i] ?? ShieldCheck;
            return (
              <div
                key={i}
                className="group relative p-7 rounded-xl bg-card border border-border hover:border-accent/40 hover:shadow-elevated transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-px gradient-accent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start justify-between mb-6">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent border border-accent/15 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                </div>

                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-2">
                  {feature.eyebrow}
                </p>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
