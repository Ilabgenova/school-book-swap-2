import { useLanguage } from "@/i18n/LanguageContext";
import { UserPlus, Search, Handshake } from "lucide-react";

export const HowItWorksSection = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: UserPlus,
      number: "01",
      title: t.landing.howItWorks.step1.title,
      description: t.landing.howItWorks.step1.description,
    },
    {
      icon: Search,
      number: "02",
      title: t.landing.howItWorks.step2.title,
      description: t.landing.howItWorks.step2.description,
    },
    {
      icon: Handshake,
      number: "03",
      title: t.landing.howItWorks.step3.title,
      description: t.landing.howItWorks.step3.description,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.landing.howItWorks.title}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection line (desktop) */}
          <div className="hidden md:block absolute top-20 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              {/* Step number */}
              <div className="relative inline-flex mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <step.icon className="h-8 w-8" />
                </div>
                <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm font-bold shadow-md">
                  {step.number}
                </span>
              </div>

              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
