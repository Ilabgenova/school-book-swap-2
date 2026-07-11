import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, CheckCircle2, Heart, Loader2, MessageCircle, Star, Tag } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

type ListingRow = {
  id: string;
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
  seller_rating: number;
  seller_completed_exchanges: number;
  notes: string | null;
  status: string;
  copies_available: number;
};

const formatDate = (iso: string, locale: string) =>
  new Date(iso).toLocaleDateString(locale === "it" ? "it-IT" : "en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const ListingDetail = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [rows, setRows] = useState<ListingRow[] | null>(null);

  const isIT = language === "it";
  const selected = rows?.find((row) => row.id === listingId) ?? rows?.[0] ?? null;

  const conditionLabel = (condition: string) => {
    if (condition === "new") return t.common.new;
    if (condition === "like_new") return t.common.asNew;
    if (condition === "good") return isIT ? "Buono" : "Good";
    if (condition === "fair") return isIT ? "Discreto" : "Fair";
    if (condition === "poor") return isIT ? "Molto usato" : "Well used";
    return t.common.used;
  };

  const typeLabel = (type: string) => {
    if (type === "sale") return t.common.sale;
    if (type === "exchange") return t.common.exchange;
    if (type === "donation") return t.common.donation;
    return type;
  };

  const priceLabel = (row: ListingRow) => {
    if (row.listing_type === "donation") return t.common.free;
    if (row.listing_type === "exchange") return t.common.exchange;
    return row.price != null ? `€${Number(row.price).toFixed(0)}` : "—";
  };

  const fetchRows = useCallback(async () => {
    if (!listingId) {
      setRows([]);
      return;
    }
    const { data, error } = await supabase.rpc("public_get_listing_group", {
      _listing_id: listingId,
    });
    if (error) {
      console.error("public_get_listing_group", error);
      setRows([]);
      return;
    }
    setRows((data ?? []) as ListingRow[]);
  }, [listingId]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  useEffect(() => {
    const channel = supabase
      .channel(`listing-detail-${listingId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "listings" }, () => fetchRows())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRows, listingId]);

  const contactSeller = (row: ListingRow) => {
    const target = `/messages?listing=${row.id}`;
    if (!user) {
      navigate(`/login?next=${encodeURIComponent(target)}`);
      return;
    }
    navigate(target);
  };

  return (
    <MainLayout>
      <section className="container py-8 md:py-12">
        <Button asChild variant="ghost" className="mb-6 gap-2">
          <Link to="/browse">
            <ArrowLeft className="h-4 w-4" />
            {isIT ? "Torna al marketplace" : "Back to marketplace"}
          </Link>
        </Button>

        {rows === null ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>{isIT ? "Caricamento annuncio..." : "Loading listing..."}</span>
          </div>
        ) : !selected ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              {isIT ? "Annuncio non disponibile" : "Listing unavailable"}
            </h1>
            <p className="text-muted-foreground mb-6">
              {isIT
                ? "Questo annuncio non è più attivo o disponibile."
                : "This listing is no longer active or available."}
            </p>
            <Button asChild>
              <Link to="/browse">{isIT ? "Vedi libri disponibili" : "View available books"}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                {selected.images?.[0] ? (
                  <img
                    src={selected.images[0]}
                    alt={selected.title ?? "Listing photo"}
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : null}
              </div>
              {selected.images && selected.images.length > 1 && (
                <div className="grid grid-cols-3 gap-3">
                  {selected.images.slice(1, 4).map((src, index) => (
                    <a key={src} href={src} target="_blank" rel="noopener noreferrer" className="overflow-hidden rounded-xl border border-border bg-card">
                      <img src={src} alt={`${selected.title ?? "Listing"} ${index + 2}`} className="aspect-square w-full object-cover" loading="lazy" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6 min-w-0">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge variant="sale" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {t.common.available}
                  </Badge>
                  <Badge variant="outline">
                    {selected.copies_available === 1
                      ? isIT ? "1 offerta disponibile" : "1 available offer"
                      : isIT
                        ? `${selected.copies_available} offerte disponibili`
                        : `${selected.copies_available} available offers`}
                  </Badge>
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground break-words">
                  {selected.title}
                </h1>
                <p className="mt-2 text-muted-foreground break-words">
                  {[selected.class_year, selected.subject, selected.isbn ? `ISBN ${selected.isbn}` : null].filter(Boolean).join(" • ")}
                </p>
              </div>

              <div className="space-y-3">
                {rows.map((row) => (
                  <article key={row.id} className="rounded-2xl border border-border bg-card p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant={row.listing_type as "sale" | "exchange" | "donation"}>
                            {row.listing_type === "donation" && <Heart className="h-3 w-3 mr-1" />}
                            {row.listing_type === "exchange" && <Tag className="h-3 w-3 mr-1" />}
                            {typeLabel(row.listing_type)}
                          </Badge>
                          <Badge variant="outline">{conditionLabel(row.condition)}</Badge>
                        </div>
                        <p className="font-medium text-foreground">{row.seller_display_name}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {Number(row.seller_rating ?? 0).toFixed(1)}
                          </span>
                          <span>•</span>
                          <span>{row.seller_completed_exchanges} {isIT ? "scambi" : "exchanges"}</span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(row.created_at, language)}
                          </span>
                        </div>
                      </div>
                      <p className="font-display text-2xl font-bold text-foreground shrink-0">{priceLabel(row)}</p>
                    </div>
                    {row.notes && <p className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap break-words">{row.notes}</p>}
                    <Button className="mt-4 w-full gap-2" onClick={() => contactSeller(row)}>
                      <MessageCircle className="h-4 w-4" />
                      {isIT ? "Contatta il venditore" : "Contact seller"}
                    </Button>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default ListingDetail;