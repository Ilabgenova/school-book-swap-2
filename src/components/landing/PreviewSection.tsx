import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, Heart, Repeat2, Loader2, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { BookCover } from "@/components/book/BookCover";
import { Button } from "@/components/ui/button";

type Row = {
  listing_id: string;
  group_key: string;
  book_id: string | null;
  title: string | null;
  subject: string | null;
  class_year: string | null;
  isbn: string | null;
  listing_type: string;
  price: number | null;
  condition: string;
  images: string[] | null;
  created_at: string;
  seller_display_name: string;
  copies_available: number;
  offers: unknown;
};

type ListingOffer = {
  price?: number | string | null;
  listingType?: string | null;
};

const typeIcon = {
  sale: BookOpen,
  exchange: Repeat2,
  donation: Heart,
} as const;

const LIMIT = 8;

const formatDate = (iso: string, locale: string) =>
  new Date(iso).toLocaleDateString(locale === "it" ? "it-IT" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const PreviewSection = () => {
  const { t, language } = useLanguage();
  const p = t.landing.preview;
  const [rows, setRows] = useState<Row[] | null>(null);

  const fetchRows = useCallback(async () => {
    const { data, error } = await supabase.rpc("public_get_recent_listings", { _limit: LIMIT });
    if (error) {
      console.error("public_get_recent_listings", error);
      setRows([]);
      return;
    }
    setRows((data ?? []) as Row[]);
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  // Live updates when listings change
  useEffect(() => {
    const channel = supabase
      .channel("landing-listings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "listings" },
        () => fetchRows()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRows]);

  const conditionLabel = (c: string) => {
    if (c === "new") return p.conditionNew;
    if (c === "like_new") return p.conditionAsNew;
    if (c === "good") return p.conditionGood;
    if (c === "fair") return p.conditionFair;
    if (c === "poor") return p.conditionPoor;
    return p.conditionUsed;
  };

  const offersFor = (offers: unknown): ListingOffer[] =>
    Array.isArray(offers) ? (offers as ListingOffer[]) : [];

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

        {rows === null ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">{p.loading}</span>
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 md:p-14 text-center">
            <h3 className="font-display font-semibold text-lg text-foreground mb-2">
              {p.emptyTitle}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">{p.emptyBody}</p>
            <Button asChild size="lg">
              <Link to="/sell">{p.emptyCta}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {rows.map((r) => {
              const TypeIcon = typeIcon[(r.listing_type as keyof typeof typeIcon)] ?? BookOpen;
              const offers = offersFor(r.offers);
              const salePrices = offers
                .filter((offer) => offer.listingType === "sale" && offer.price != null)
                .map((offer) => Number(offer.price))
                .filter((price) => Number.isFinite(price));
              const lowestPrice = salePrices.length > 0 ? Math.min(...salePrices) : null;
              const isFree = r.listing_type === "donation";
              const isExchange = r.listing_type === "exchange";
              const priceLabel = lowestPrice != null
                ? `${p.fromPrice} €${lowestPrice.toFixed(0)}`
                : isFree
                  ? p.free
                  : isExchange
                    ? p.exchange
                    : r.price != null
                      ? `€${Number(r.price).toFixed(0)}`
                      : "—";
              const sellerImage = Array.isArray(r.images) ? r.images[0] : null;

              return (
                <Link
                  key={r.listing_id}
                  to={`/listings/${r.listing_id}`}
                  className="group relative flex flex-col bg-card rounded-xl border border-border hover:border-accent/40 hover:shadow-elevated transition-all duration-300 overflow-hidden"
                >
                  {/* Header strip */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-secondary/30">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 truncate max-w-[60%]">
                      {r.class_year || r.subject || "DISbook"}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {formatDate(r.created_at, language)}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex gap-3 mb-4">
                      {sellerImage ? (
                        <img
                          src={sellerImage}
                          alt={r.title ?? "listing"}
                          loading="lazy"
                          className="h-24 w-16 shrink-0 rounded-md object-cover bg-muted"
                        />
                      ) : (
                        <BookCover
                          isbn={r.isbn}
                          title={r.title ?? "Book"}
                          className="h-24 w-16"
                          iconClassName="h-6 w-6"
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-semibold text-foreground line-clamp-2 leading-snug mb-1.5 break-words">
                          {r.title ?? "—"}
                        </h3>
                        {r.subject && (
                          <p className="text-[11px] text-muted-foreground line-clamp-1 mb-1">
                            {r.subject}
                          </p>
                        )}
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--teal))]" />
                          {conditionLabel(r.condition)}
                        </div>
                        <p className="mt-1.5 text-[11px] font-semibold text-accent inline-flex items-center gap-1">
                          <ShoppingBag className="h-3 w-3" />
                          {r.copies_available === 1
                            ? p.copiesOne
                            : p.copiesMany.replace("{{count}}", String(r.copies_available))}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
                      <div>
                        <p
                          className={`font-display font-bold text-xl leading-none flex items-center gap-1.5 ${
                            isFree
                              ? "text-[hsl(var(--teal))]"
                              : isExchange
                                ? "text-accent"
                                : "text-foreground"
                          }`}
                        >
                          <TypeIcon className="h-4 w-4" />
                          {priceLabel}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-1 truncate max-w-[140px]">
                          {r.seller_display_name}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-accent inline-flex items-center gap-1">
                        {p.viewListing}
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
