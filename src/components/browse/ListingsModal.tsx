import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Star,
  Euro,
  Heart,
  Tag,
  MessageCircle,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  BookOpen,
  Info,
} from "lucide-react";
import { OfficialBook, BookListing } from "@/data/officialBooks";
import { useAuth } from "@/hooks/useAuth";

interface ListingsModalProps {
  book: OfficialBook;
  listings: BookListing[];
  onClose: () => void;
}

export const ListingsModal = ({
  book,
  listings,
  onClose,
}: ListingsModalProps) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [detailListing, setDetailListing] = useState<BookListing | null>(null);

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case "new":
        return t.common.new;
      case "asNew":
        return t.common.asNew;
      case "used":
        return t.common.used;
      default:
        return condition;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "sale":
        return t.common.sale;
      case "exchange":
        return t.common.exchange;
      case "donation":
        return t.common.donation;
      default:
        return type;
    }
  };

  const contactSeller = (listing: BookListing) => {
    if (!user) {
      navigate(
        `/login?next=${encodeURIComponent(`/messages?listing=${listing.id}`)}`
      );
      return;
    }
    if (user.id === listing.sellerId) {
      navigate("/messages");
      onClose();
      return;
    }
    navigate(`/messages?listing=${listing.id}`);
    onClose();
  };

  const renderPriceTag = (listing: BookListing) => {
    if (listing.type === "sale" && listing.price) {
      return (
        <span className="font-display font-bold text-xl text-primary flex items-center">
          <Euro className="h-5 w-5" />
          {listing.price}
        </span>
      );
    }
    if (listing.type === "donation") {
      return <span className="font-medium text-donation">{t.common.free}</span>;
    }
    return (
      <span className="font-medium text-accent text-sm">
        {t.common.exchange}
      </span>
    );
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg flex items-center gap-2">
            {detailListing && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 -ml-1"
                onClick={() => setDetailListing(null)}
                aria-label={language === "it" ? "Torna agli annunci" : "Back to listings"}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <span className="break-words">{book.title}</span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {book.subject} • {book.publisher}
          </p>
        </DialogHeader>

        {detailListing ? (
          <ListingDetailView
            book={book}
            listing={detailListing}
            language={language}
            getConditionLabel={getConditionLabel}
            getTypeLabel={getTypeLabel}
            renderPriceTag={renderPriceTag}
            onContact={() => contactSeller(detailListing)}
            onBack={() => setDetailListing(null)}
          />
        ) : (
          <div className="space-y-4 mt-4">
            {listings.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {t.browse.noListingsYet}
              </p>
            ) : (
              listings.map((listing) => (
                <button
                  key={listing.id}
                  type="button"
                  onClick={() => setDetailListing(listing)}
                  className="w-full text-left p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                          {listing.sellerName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">
                            {listing.sellerName}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="font-medium text-foreground">
                              {listing.sellerRating.toFixed(1)}
                            </span>
                            <span>•</span>
                            <CheckCircle2 className="h-3 w-3 text-primary" />
                            <span>
                              {listing.sellerCompletedExchanges} {t.browse.exchanges}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant={listing.type as "sale" | "exchange" | "donation"}>
                          {listing.type === "donation" && <Heart className="h-3 w-3 mr-1" />}
                          {listing.type === "exchange" && <Tag className="h-3 w-3 mr-1" />}
                          {getTypeLabel(listing.type)}
                        </Badge>
                        <Badge variant={listing.condition as "new" | "asNew" | "used"}>
                          {getConditionLabel(listing.condition)}
                        </Badge>
                        {listing.images && listing.images.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {listing.images.length}{" "}
                            {language === "it" ? "foto" : "photos"}
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-primary">
                        {language === "it"
                          ? "Tocca per vedere i dettagli"
                          : "Tap to see details"}
                      </p>
                    </div>

                    <div className="text-right shrink-0">{renderPriceTag(listing)}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

interface DetailProps {
  book: OfficialBook;
  listing: BookListing;
  language: string;
  getConditionLabel: (c: string) => string;
  getTypeLabel: (t: string) => string;
  renderPriceTag: (l: BookListing) => JSX.Element;
  onContact: () => void;
  onBack: () => void;
}

const ListingDetailView = ({
  book,
  listing,
  language,
  getConditionLabel,
  getTypeLabel,
  renderPriceTag,
  onContact,
  onBack,
}: DetailProps) => {
  const isSold = listing.status && listing.status !== "active";
  const listedDate = listing.createdAt
    ? new Date(listing.createdAt).toLocaleDateString(
        language === "it" ? "it-IT" : "en-GB",
        { year: "numeric", month: "long", day: "numeric" }
      )
    : null;

  return (
    <div className="space-y-5 mt-3">
      {/* Photos */}
      {listing.images && listing.images.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {listing.images.map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block aspect-square overflow-hidden rounded-lg border border-border bg-muted"
            >
              <img
                src={url}
                alt={`${book.title} – ${language === "it" ? "foto" : "photo"} ${i + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
          {language === "it" ? "Nessuna foto disponibile" : "No photos available"}
        </div>
      )}

      {/* Price + type + condition + status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant={listing.type as "sale" | "exchange" | "donation"}>
            {getTypeLabel(listing.type)}
          </Badge>
          <Badge variant={listing.condition as "new" | "asNew" | "used"}>
            {getConditionLabel(listing.condition)}
          </Badge>
          <Badge variant={isSold ? "outline" : "sale"}>
            {isSold
              ? language === "it"
                ? "Venduto"
                : "Sold"
              : language === "it"
                ? "Disponibile"
                : "Available"}
          </Badge>
        </div>
        <div>{renderPriceTag(listing)}</div>
      </div>

      {/* Book details */}
      <div className="rounded-xl border border-border p-4 space-y-2 text-sm">
        <div className="flex items-center gap-2 font-medium text-foreground">
          <BookOpen className="h-4 w-4 text-primary" />
          {language === "it" ? "Dettagli libro" : "Book details"}
        </div>
        <dl className="grid grid-cols-3 gap-y-1 text-sm">
          <dt className="text-muted-foreground">{language === "it" ? "Titolo" : "Title"}</dt>
          <dd className="col-span-2 text-foreground">{book.title}</dd>
          {book.author && (
            <>
              <dt className="text-muted-foreground">{language === "it" ? "Autore" : "Author"}</dt>
              <dd className="col-span-2 text-foreground">{book.author}</dd>
            </>
          )}
          {book.isbn && (
            <>
              <dt className="text-muted-foreground">ISBN</dt>
              <dd className="col-span-2 text-foreground">{book.isbn}</dd>
            </>
          )}
          <dt className="text-muted-foreground">{language === "it" ? "Classe" : "Class"}</dt>
          <dd className="col-span-2 text-foreground">
            {listing.classYear || book.grade}
          </dd>
          {(listing.subject || book.subject) && (
            <>
              <dt className="text-muted-foreground">{language === "it" ? "Materia" : "Subject"}</dt>
              <dd className="col-span-2 text-foreground">{listing.subject || book.subject}</dd>
            </>
          )}
        </dl>
      </div>

      {/* Seller info */}
      <div className="rounded-xl border border-border p-4 space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
            {listing.sellerName.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-foreground">{listing.sellerName}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="font-medium text-foreground">
                {listing.sellerRating.toFixed(1)}
              </span>
              <span>•</span>
              <CheckCircle2 className="h-3 w-3 text-primary" />
              <span>
                {listing.sellerCompletedExchanges}{" "}
                {language === "it" ? "scambi" : "exchanges"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {listing.notes && (
        <div className="rounded-xl border border-border p-4 space-y-2">
          <div className="flex items-center gap-2 font-medium text-foreground text-sm">
            <Info className="h-4 w-4 text-primary" />
            {language === "it" ? "Note del venditore" : "Seller notes"}
          </div>
          <p className="text-sm text-foreground whitespace-pre-wrap">{listing.notes}</p>
        </div>
      )}

      {/* Listed date */}
      {listedDate && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {language === "it" ? "Pubblicato il" : "Listed on"} {listedDate}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-2">
        <Button className="w-full gap-2" onClick={onContact} disabled={!!isSold}>
          <MessageCircle className="h-4 w-4" />
          {language === "it" ? "Contatta il venditore" : "Contact seller"}
        </Button>
        <Button variant="outline" className="w-full gap-2" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          {language === "it" ? "Torna agli annunci" : "Back to listings"}
        </Button>
      </div>
    </div>
  );
};
