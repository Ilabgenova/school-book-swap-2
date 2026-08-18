import { MainLayout } from "@/components/layout/MainLayout";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Link, Navigate } from "react-router-dom";
import { BookOpen, Lightbulb, ArrowRight, Tag, MessageCircle, BookMarked, Loader2 } from "lucide-react";

const Dashboard = () => {
  const { language } = useLanguage();
  const { user, loading } = useAuth();
  const it = language === "it";

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-20 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </MainLayout>
    );
  }

  if (!user) return <Navigate to="/login?next=/dashboard" replace />;

  const cards = [
    {
      to: "/browse",
      icon: BookOpen,
      title: it ? "Mercatino dei libri" : "Book Marketplace",
      desc: it
        ? "Compra, vendi, scambia o dona i libri scolastici della lista ufficiale DIS."
        : "Buy, sell, exchange or donate school books from the official DIS list.",
      cta: it ? "Vai al mercatino" : "Go to marketplace",
    },
    {
      to: "/tips",
      icon: Lightbulb,
      title: it ? "Consigli della community" : "Parent Community Tips",
      desc: it
        ? "Consigli reali di famiglie DIS su attività, corsi, campi estivi e servizi a Genova."
        : "Real recommendations from DIS families about activities, courses, camps and services in Genova.",
      cta: it ? "Scopri i consigli" : "Explore tips",
    },
  ];

  const quick = [
    { to: "/sell?intent=sell&mode=sell", icon: Tag, label: it ? "Metti in vendita" : "List a book" },
    { to: "/my-books", icon: BookMarked, label: it ? "I miei libri" : "My books" },
    { to: "/messages", icon: MessageCircle, label: it ? "Messaggi" : "Messages" },
  ];

  return (
    <MainLayout>
      <div className="container py-10 md:py-16 max-w-5xl">
        <div className="mb-8 md:mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {it ? "Cosa vuoi fare oggi?" : "What would you like to do today?"}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            {it
              ? "Scegli una sezione per iniziare."
              : "Pick a section to get started."}
          </p>
        </div>

        <div className="grid gap-4 md:gap-6 sm:grid-cols-2">
          {cards.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="group rounded-2xl border border-border bg-card p-6 md:p-8 hover:border-accent/50 hover:shadow-elevated transition-all flex flex-col gap-4 min-h-[220px]"
            >
              <div className="h-12 w-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <c.icon className="h-6 w-6" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground">
                  {c.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{c.desc}</p>
              </div>
              <span className="text-sm font-medium text-accent inline-flex items-center gap-1.5">
                {c.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {quick.map((q) => (
            <Link
              key={q.to}
              to={q.to}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground hover:border-accent/50 hover:text-accent transition-colors"
            >
              <q.icon className="h-4 w-4" />
              {q.label}
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
