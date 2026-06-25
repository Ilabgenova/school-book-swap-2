import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Users, BookOpen, Recycle, Heart, Leaf, HandHeart, CheckCircle2 } from "lucide-react";
import heroImage from "@/assets/genova-skyline.jpg";

export const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23166534' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container relative py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 animate-fade-in">
              <Recycle className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t.landing.hero.subtitle}</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-slide-up">
              {t.landing.hero.title}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              {t.landing.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Link to="/register">
                <Button variant="hero" size="xl" className="w-full sm:w-auto group">
                  {t.landing.hero.cta}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/browse">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  <BookOpen className="h-5 w-5" />
                  {t.landing.hero.browse}
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Leaf className="h-4 w-4 text-primary" />
                <span>Eco-friendly</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <HandHeart className="h-4 w-4 text-donation" />
                <span>{t.common.free} donations</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative lg:order-last animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="Skyline di Genova — DISbook" 
                width={1920}
                height={1024}
                className="w-full h-auto object-cover aspect-[4/3]"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            
            {/* Floating cards */}
            <div className="absolute -bottom-4 -left-4 bg-card p-4 rounded-xl shadow-lg border border-border animate-float">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">250+</p>
                  <p className="text-xs text-muted-foreground">{t.landing.stats.families}</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-card p-4 rounded-xl shadow-lg border border-border animate-float" style={{ animationDelay: "0.5s" }}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-donation/10">
                  <Heart className="h-5 w-5 text-donation" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">100+</p>
                  <p className="text-xs text-muted-foreground">{t.landing.stats.exchanges}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
