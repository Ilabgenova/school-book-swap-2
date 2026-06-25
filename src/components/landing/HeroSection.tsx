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

export const HeroSection = () => {
  const { t } = useLanguage();

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
                Smart Used Books Platform
              </span>
            </div>

            <div className="space-y-4 animate-slide-up">
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.02] tracking-tighter">
                RiLibro<span className="text-accent">.</span>
              </h1>
              <p className="font-display text-xl md:text-2xl text-foreground/80 leading-snug max-w-xl">
                Smart used books platform for{" "}
                <span className="text-foreground font-semibold">
                  Deledda International School
                </span>{" "}
                — Genova.
              </p>
              <p className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
                Buy, sell, donate and exchange school books inside the DIS
                community. Search by ISBN, school year or subject and give
                books a second life.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <Link to="/browse">
                <Button variant="hero" size="lg" className="w-full sm:w-auto group">
                  <Search className="h-4 w-4" />
                  Find books
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/sell">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <BookOpen className="h-4 w-4" />
                  List a book
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                  Register
                </Button>
              </Link>
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border/60 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {[
                { icon: ShieldCheck, label: "Verified book list" },
                { icon: Search, label: "ISBN search" },
                { icon: Recycle, label: "Circular economy" },
                { icon: Users, label: "DIS community" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <item.icon className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — dashboard preview card */}
          <div className="relative animate-fade-in" style={{ animationDelay: "0.15s" }}>
            {/* Glow */}
            <div className="absolute -inset-6 bg-accent/20 blur-3xl rounded-full pointer-events-none" />

            <div className="relative rounded-2xl border border-border bg-card shadow-elevated overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/40">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
                </div>
                <div className="font-mono text-[11px] text-muted-foreground">
                  rilibro.app / browse
                </div>
                <div className="w-12" />
              </div>

              {/* Search bar */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-md bg-secondary/60 border border-border">
                  <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-muted-foreground flex-1">
                    978-88-08…
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-background border border-border text-muted-foreground">
                    ISBN
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {["MYP 3", "DP 1", "Math", "Spanish", "As new"].map((f) => (
                    <span
                      key={f}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Listing rows */}
              <div className="divide-y divide-border">
                {[
                  { title: "Mathematics MYP 3", isbn: "978-0-19-835617-2", grade: "MYP 3", cond: "As new", price: "€18", color: "myp" },
                  { title: "Spanish Ab Initio", isbn: "978-1-4479-7821-4", grade: "DP 1", cond: "Used", price: "€12", color: "dp" },
                  { title: "Biology HL", isbn: "978-0-19-839262-0", grade: "DP 2", cond: "New", price: "Free", color: "dp" },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors">
                    <div className="h-10 w-8 rounded-sm gradient-primary shrink-0 shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {row.title}
                        </p>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-${row.color}/10 text-${row.color} border border-${row.color}/20`}>
                          {row.grade}
                        </span>
                      </div>
                      <p className="font-mono text-[10px] text-muted-foreground truncate">
                        {row.isbn}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-bold ${row.price === "Free" ? "text-[hsl(var(--teal))]" : "text-foreground"}`}>
                        {row.price}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{row.cond}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sustainability footer strip */}
              <div className="grid grid-cols-3 divide-x divide-border border-t border-border bg-secondary/30">
                {[
                  { label: "Reused", value: "1,284", icon: Recycle },
                  { label: "Saved", value: "€18k", icon: TrendingUp },
                  { label: "Verified", value: "100%", icon: CheckCircle2 },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2 px-3 py-3">
                    <s.icon className="h-3.5 w-3.5 text-[hsl(var(--teal))] shrink-0" />
                    <div className="leading-tight">
                      <p className="text-sm font-bold text-foreground">{s.value}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating verified pill */}
            <div className="absolute -top-3 -right-3 glass rounded-full px-3 py-1.5 shadow-md flex items-center gap-1.5 animate-float">
              <Sparkles className="h-3 w-3 text-accent" />
              <span className="text-[11px] font-semibold text-foreground">
                ISBN verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
