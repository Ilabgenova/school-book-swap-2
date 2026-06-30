import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  ShieldCheck,
  Recycle,
  Users,
  BookOpen,
  Sparkles,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import lanternaAsset from "@/assets/lanterna.webp.asset.json";

export const HeroSection = () => {
  const { t } = useLanguage();
  const h = t.landing.hero;

  return (
    <section className="relative overflow-hidden gradient-hero">
      {/* Mesh gradient + grid pattern */}
      <div className="absolute inset-0 gradient-mesh pointer-events-none" />
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <div className="container relative py-16 md:py-24 lg:py-28">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Left — copy */}
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-sm animate-fade-in">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
              </span>
              <span className="text-xs font-medium text-accent tracking-wide uppercase">
                {h.studentBadge}
              </span>
            </div>

            <div className="space-y-4 animate-slide-up">
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.02] tracking-tighter">
                DISbook<span className="text-accent">.</span>
              </h1>
              <p className="font-display text-xl md:text-2xl text-foreground/80 leading-snug max-w-xl">
                {h.platformIntro1}
                <span className="text-foreground font-semibold">
                  {h.schoolName}
                </span>
                {h.platformIntro2}
              </p>
              <p className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
                {h.longDescription}
              </p>
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-foreground">
                <BookOpen className="h-3.5 w-3.5 text-accent" />
                {h.mypDpBadge}
              </div>
              <p className="text-xs text-muted-foreground/80 max-w-xl leading-relaxed italic border-l-2 border-accent/40 pl-3">
                {h.disclaimer}
              </p>
            </div>

            {/* Two clear paths */}
            <div className="grid sm:grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <Link to="/sell?intent=sell&mode=sell" className="group">
                <div className="h-full rounded-xl border border-border bg-card hover:border-accent/50 hover:shadow-elevated transition-all p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{h.step1Label}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {h.sellTitle}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {h.sellDesc}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-accent inline-flex items-center gap-1 mt-auto">
                    {h.sellCta} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>

              <Link to="/browse" className="group">
                <div className="h-full rounded-xl border border-accent/40 bg-accent/5 hover:bg-accent/10 hover:shadow-elevated transition-all p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Search className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-accent">{h.step2Label}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {h.buyTitle}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {h.buyDesc}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-accent inline-flex items-center gap-1 mt-auto">
                    {h.buyCta} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-3 text-sm animate-fade-in" style={{ animationDelay: "0.15s" }}>
              <Link to="/register">
                <Button variant="ghost" size="sm">
                  {h.registerCta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <span className="text-xs text-muted-foreground">
                {h.registerNote}
              </span>
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border/60 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {[
                { icon: ShieldCheck, label: h.trustBookList },
                { icon: Search, label: h.trustIsbn },
                { icon: Recycle, label: h.trustCircular },
                { icon: Users, label: h.trustCommunity },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <item.icon className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>


          {/* Right — Lanterna of Genova with floating dashboard cards */}
          <div className="relative animate-fade-in" style={{ animationDelay: "0.15s" }}>
            {/* Glow */}
            <div className="absolute -inset-6 bg-accent/20 blur-3xl rounded-full pointer-events-none" />

            <div className="relative rounded-2xl border border-border bg-primary shadow-elevated overflow-hidden aspect-[4/5]">
              {/* Lanterna photo */}
              <img
                src={lanternaAsset.url}
                alt="La Lanterna — historic lighthouse of Genova, symbol of the city"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Navy overlay for modern, technological feel */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, hsl(222 47% 14% / 0.35) 0%, hsl(222 47% 14% / 0.55) 55%, hsl(224 71% 8% / 0.85) 100%)",
                }}
              />
              {/* Electric blue accent wash */}
              <div
                className="absolute inset-0 mix-blend-overlay"
                style={{
                  background:
                    "radial-gradient(ellipse at 70% 20%, hsl(217 91% 55% / 0.35) 0%, transparent 60%)",
                }}
              />
              {/* Subtle grid overlay */}
              <div
                className="absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage:
                    "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Top-left location chip */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-dark text-primary-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--teal-glow))] animate-pulse-glow" />
                <span className="font-mono text-[10px] uppercase tracking-wider">
                  Genova · 44.4056°N
                </span>
              </div>

              {/* Bottom — ISBN search + stat cards */}
              <div className="absolute inset-x-4 bottom-4 space-y-3">
                {/* ISBN search bar */}
                <div className="glass-dark rounded-lg p-3 backdrop-blur-xl">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary-foreground/5 border border-primary-foreground/10">
                    <Search className="h-4 w-4 text-primary-foreground/60 shrink-0" />
                    <span className="text-sm text-primary-foreground/70 flex-1 font-mono">
                      978-88-08…
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-[hsl(var(--electric-glow))] border border-accent/30">
                      ISBN
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {["MYP 3", "DP 1", "Math", "Spanish", "As new"].map((f) => (
                      <span
                        key={f}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary-foreground/10 text-primary-foreground/90 border border-primary-foreground/15"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sustainability stat strip */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: h.statReused, value: "1,284", icon: Recycle },
                    { label: h.statSaved, value: "€18k", icon: TrendingUp },
                    { label: h.statVerified, value: "100%", icon: CheckCircle2 },
                  ].map((s) => (
                    <div key={s.label} className="glass-dark rounded-md px-2.5 py-2 backdrop-blur-xl">
                      <s.icon className="h-3 w-3 text-[hsl(var(--teal-glow))] mb-1" />
                      <p className="text-sm font-bold text-primary-foreground leading-none">
                        {s.value}
                      </p>
                      <p className="text-[9px] text-primary-foreground/60 uppercase tracking-wider mt-1">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating verified pill */}
            <div className="absolute -top-3 -right-3 glass rounded-full px-3 py-1.5 shadow-md flex items-center gap-1.5 animate-float">
              <Sparkles className="h-3 w-3 text-accent" />
              <span className="text-[11px] font-semibold text-foreground">
                {h.isbnVerified}
              </span>
            </div>

            {/* Floating community pill */}
            <div
              className="absolute -bottom-3 -left-3 bg-card border border-border rounded-full px-3 py-1.5 shadow-elevated flex items-center gap-1.5 animate-float"
              style={{ animationDelay: "1s" }}
            >
              <Users className="h-3 w-3 text-[hsl(var(--teal))]" />
              <span className="text-[11px] font-semibold text-foreground">
                {h.communityPill}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
