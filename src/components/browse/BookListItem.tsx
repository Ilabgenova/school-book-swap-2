import { useLanguage } from "@/i18n/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BookOpen,
  ExternalLink,
  ShoppingBag,
  Heart,
  Tag,
  Star,
  Check,
} from "lucide-react";

export interface OfficialBook {
  id: string;
  title: string;
  subject: string;
  publisher: string;
  isbn?: string;
  availableFromPreviousYear: boolean;
  externalPurchaseUrl?: string;
}

export interface BookListing {
  id: string;
  type: "sale" | "exchange" | "donation";
  price?: number;
  condition: "new" | "asNew" | "used";
  sellerRating: number;
  sellerName: string;
  sellerCompletedExchanges: number;
}

interface BookListItemProps {
  book: OfficialBook;
  listings: BookListing[];
  isFound: boolean;
  isToBuy: boolean;
  onToggleFound: (bookId: string) => void;
  onToggleToBuy: (bookId: string) => void;
  onViewListings: (book: OfficialBook) => void;
}

export const BookListItem = ({
  book,
  listings,
  isFound,
  isToBuy,
  onToggleFound,
  onToggleToBuy,
  onViewListings,
}: BookListItemProps) => {
  const { t } = useLanguage();
  const availableCount = listings.length;
  const hasDonations = listings.some((l) => l.type === "donation");
  const lowestPrice = listings
    .filter((l) => l.type === "sale" && l.price)
    .reduce((min, l) => (l.price && l.price < min ? l.price : min), Infinity);

  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        isFound
          ? "bg-primary/5 border-primary/30"
          : isToBuy
          ? "bg-accent/5 border-accent/30"
          : "bg-card border-border hover:border-primary/20"
      }`}
    >
      <div className="flex gap-4">
        {/* Checkboxes */}
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-center gap-2">
            <Checkbox
              id={`found-${book.id}`}
              checked={isFound}
              onCheckedChange={() => onToggleFound(book.id)}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label
              htmlFor={`found-${book.id}`}
              className="text-xs text-muted-foreground cursor-pointer"
            >
              {t.browse.found}
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id={`tobuy-${book.id}`}
              checked={isToBuy}
              onCheckedChange={() => onToggleToBuy(book.id)}
              disabled={isFound}
              className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
            />
            <label
              htmlFor={`tobuy-${book.id}`}
              className={`text-xs cursor-pointer ${
                isFound ? "text-muted-foreground/50" : "text-muted-foreground"
              }`}
            >
              {t.browse.toBuy}
            </label>
          </div>
        </div>

        {/* Book info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-medium text-foreground line-clamp-2">
                {book.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {book.subject} • {book.publisher}
              </p>
              {book.isbn && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  ISBN: {book.isbn}
                </p>
              )}
            </div>

            {isFound && (
              <Badge variant="outline" className="shrink-0 bg-primary/10 text-primary border-primary/20">
                <Check className="h-3 w-3 mr-1" />
                {t.browse.found}
              </Badge>
            )}
          </div>

          {/* Availability status */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {book.availableFromPreviousYear ? (
              <>
                {availableCount > 0 ? (
                  <Badge variant="sale" className="gap-1">
                    <ShoppingBag className="h-3 w-3" />
                    {availableCount} {t.browse.availableOnApp}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {t.browse.noListingsYet}
                  </Badge>
                )}
                {hasDonations && (
                  <Badge variant="donation" className="gap-1">
                    <Heart className="h-3 w-3" />
                    {t.browse.donationAvailable}
                  </Badge>
                )}
                {lowestPrice !== Infinity && (
                  <span className="text-sm text-primary font-medium">
                    {t.browse.from} €{lowestPrice}
                  </span>
                )}
              </>
            ) : (
              <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
                {t.browse.newBookRequired}
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="mt-3 flex flex-wrap gap-2">
            {book.availableFromPreviousYear && availableCount > 0 ? (
              <Button
                size="sm"
                variant="default"
                onClick={() => onViewListings(book)}
                className="gap-1"
              >
                <Tag className="h-3 w-3" />
                {t.browse.viewListings} ({availableCount})
              </Button>
            ) : book.externalPurchaseUrl ? (
              <Button
                size="sm"
                variant="outline"
                asChild
                className="gap-1"
              >
                <a
                  href={book.externalPurchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3 w-3" />
                  {t.browse.buyNew}
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
