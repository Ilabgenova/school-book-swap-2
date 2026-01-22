import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Ticket } from "lucide-react";

export const CTASection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-24 bg-primary relative overflow-hidden">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container relative text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-6">
          <Ticket className="h-4 w-4 text-primary-foreground" />
          <span className="text-sm font-medium text-primary-foreground">€5 {t.common.perYear}</span>
        </div>

        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
          {t.landing.cta.title}
        </h2>
        <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
          {t.landing.cta.description}
        </p>

        <Link to="/register">
          <Button variant="hero" size="xl" className="group">
            {t.landing.cta.button}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </section>
  );
};
