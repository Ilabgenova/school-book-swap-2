import { useLanguage } from "@/i18n/LanguageContext";
import { Shield, Leaf, MapPin, Heart } from "lucide-react";

export const FeaturesSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Shield,
      title: t.landing.features.trust.title,
      description: t.landing.features.trust.description,
      color: "primary",
    },
    {
      icon: Leaf,
      title: t.landing.features.sustainable.title,
      description: t.landing.features.sustainable.description,
      color: "success",
    },
    {
      icon: MapPin,
      title: t.landing.features.simple.title,
      description: t.landing.features.simple.description,
      color: "accent",
    },
    {
      icon: Heart,
      title: t.landing.features.free.title,
      description: t.landing.features.free.description,
      color: "donation",
    },
  ];

  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    primary: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
    success: { bg: "bg-success/10", text: "text-success", border: "border-success/20" },
    accent: { bg: "bg-accent/10", text: "text-accent", border: "border-accent/20" },
    donation: { bg: "bg-donation/10", text: "text-donation", border: "border-donation/20" },
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.landing.features.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t.landing.hero.description}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color];
            return (
              <div
                key={index}
                className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg} ${colors.text} mb-4 transition-transform group-hover:scale-110`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
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
