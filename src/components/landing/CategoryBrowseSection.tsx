import { Link } from "react-router-dom";
import { BookOpen, Keyboard, Bot, ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const categories = [
  {
    key: "books",
    icon: BookOpen,
    href: "/browse",
    title: { it: "Libri", en: "Books" },
    desc: { it: "Scegli MYP o DP e trova i libri usati.", en: "Choose MYP or DP and find used books." },
  },
  {
    key: "keyboard",
    icon: Keyboard,
    href: "/browse?category=keyboard",
    title: { it: "Tastiera", en: "Keyboard" },
    desc: { it: "Materiale generico, non legato a una classe.", en: "Generic item, not tied to one class." },
  },
  {
    key: "sphero",
    icon: Bot,
    href: "/browse?category=sphero",
    title: { it: "Robot Sphero", en: "Sphero Robot" },
    desc: { it: "Robot Sphero Mini per Design.", en: "Sphero Mini Robot for Design." },
  },
] as const;

export const CategoryBrowseSection = () => {
  const { language } = useLanguage();

  return (
    <section className="border-y border-border bg-secondary/30 py-10 md:py-14">
      <div className="container">
        <div className="mb-5 flex flex-col gap-1">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
            {language === "it" ? "Categorie" : "Categories"}
          </p>
          <h2 className="font-display text-2xl font-bold text-foreground">
            {language === "it" ? "Sfoglia per categoria" : "Browse by category"}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.key}
              to={category.href}
              className="group flex min-h-32 items-start gap-3 rounded-lg border border-border bg-card p-4 transition hover:border-accent/50 hover:shadow-soft"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <category.icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg font-semibold text-foreground">
                  {category.title[language]}
                </span>
                <span className="mt-1 block text-sm leading-snug text-muted-foreground">
                  {category.desc[language]}
                </span>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                  {language === "it" ? "Apri" : "Open"}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};