import { useLanguage } from "@/i18n/LanguageContext";
import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, Heart, Repeat2 } from "lucide-react";

const mockListings = [
  {
    id: "1",
    title: "Mathematics MYP 3 — Concept-Based",
    isbn: "978-0-19-835617-2",
    grade: "MYP 3",
    program: "myp",
    condition: "As new",
    type: "sale",
    price: "€18",
    seller: "Marco F.",
    rating: "4.9",
  },
  {
    id: "2",
    title: "Spanish Ab Initio — Course Book",
    isbn: "978-1-4479-7821-4",
    grade: "DP 1",
    program: "dp",
    condition: "Used",
    type: "exchange",
    price: "Exchange",
    seller: "Giulia R.",
    rating: "5.0",
  },
  {
    id: "3",
    title: "Biology Higher Level — Oxford IB",
    isbn: "978-0-19-839262-0",
    grade: "DP 2",
    program: "dp",
    condition: "New",
    type: "donation",
    price: "Free",
    seller: "Anna B.",
    rating: "4.8",
  },
];

const typeIcon = {
  sale: BookOpen,
  exchange: Repeat2,
  donation: Heart,
} as const;

export const PreviewSection = () => {
  const { t } = useLanguage();
  const p = t.landing.preview;

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent mb-3">
              {p.eyebrow}
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tighter">
              {p.title}
            </h2>
          </div>
          <Link
            to="/browse"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:gap-2 transition-all"
          >
            {p.viewAll}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>


        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockListings.map((listing) => {
            const TypeIcon = typeIcon[listing.type as keyof typeof typeIcon];
            const isFree = listing.type === "donation";
            const isExchange = listing.type === "exchange";

            return (
              <div
                key={listing.id}
                className="group relative bg-card rounded-xl border border-border hover:border-accent/40 hover:shadow-elevated transition-all duration-300 overflow-hidden"
              >
                {/* Header strip */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-${listing.program}/10 text-${listing.program} border border-${listing.program}/20`}>
                    {listing.grade}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {listing.isbn}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex gap-4 mb-5">
                    {/* Book spine */}
                    <div className="h-20 w-14 shrink-0 rounded gradient-primary shadow-soft relative overflow-hidden">
                      <div className="absolute inset-y-0 left-1.5 w-px bg-primary-foreground/15" />
                      <div className="absolute inset-y-0 left-2.5 w-px bg-primary-foreground/10" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-foreground line-clamp-2 leading-snug mb-2">
                        {listing.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--teal))]" />
                        {listing.condition === "As new" ? p.conditionAsNew : listing.condition === "New" ? p.conditionNew : p.conditionUsed}
                      </div>
                    </div>
                  </div>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className={`font-display font-bold text-xl leading-none flex items-center gap-1.5 ${isFree ? "text-[hsl(var(--teal))]" : isExchange ? "text-accent" : "text-foreground"}`}>
                        <TypeIcon className="h-4 w-4" />
                        {isFree ? p.free : isExchange ? p.exchange : listing.price}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        {listing.seller} · ★ {listing.rating}
                      </p>
                    </div>
                    <button className="text-xs font-semibold text-accent hover:text-accent/80 inline-flex items-center gap-1 group/btn">
                      {p.contact}
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </button>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
