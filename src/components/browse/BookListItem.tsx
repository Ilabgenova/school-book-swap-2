import { useLanguage } from "@/i18n/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  ShoppingBag,
  Heart,
  Tag,
  Globe,
  Construction,
} from "lucide-react";
import { OfficialBook, BookListing, getPriceRange } from "@/data/officialBooks";
import { BookCover } from "@/components/book/BookCover";
import { WantedButton } from "@/components/wanted/WantedButton";
import { AmazonBuyButton } from "@/components/buy-new/AmazonBuyButton";

interface BookListItemProps {
  book: OfficialBook;
  listings: BookListing[];
  onViewListings: (book: OfficialBook) => void;
}

export const BookListItem = ({
  book,
  listings,
  onViewListings,
}: BookListItemProps) => {
  const { t } = useLanguage();
  const availableCount = listings.length;
  const hasDonations = listings.some((l) => l.type === "donation");
  const priceRange = getPriceRange(book.id);

  return (
    <div className="p-4 rounded-xl border transition-all bg-card border-border hover:border-primary/20">
      <div className="flex gap-4">
        {/* Book cover (edition-specific via ISBN) */}
        <BookCover
          isbn={book.isbn}
          title={book.title}
          className="w-16 h-20"
          iconClassName="h-6 w-6"
        />


        {/* Book info */}
        <div className="flex-1 min-w-0">
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
                {priceRange && (
                  <span className="text-sm text-primary font-medium">
                    {t.browse.usedPriceRange}: €{priceRange.min}{priceRange.min !== priceRange.max && ` - €${priceRange.max}`}
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
            <WantedButton book={book} />
            {book.availableFromPreviousYear && availableCount > 0 ? (
              <>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => onViewListings(book)}
                  className="gap-1"
                >
                  <Tag className="h-3 w-3" />
                  {t.browse.viewListings} ({availableCount})
                </Button>
                {/* Amazon "Buy New" - rendered only if admin added a link */}
                <AmazonBuyButton isbn={book.isbn} title={book.title} />
              </>
            ) : (
              <>
                <AmazonBuyButton isbn={book.isbn} title={book.title} />
                {/* Check other schools - IN PROGRESS */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1 text-muted-foreground cursor-not-allowed opacity-60"
                  disabled
                >
                  <Globe className="h-3 w-3" />
                  {t.browse.checkOtherSchools}
                  <Badge variant="outline" className="ml-1 text-[10px] px-1.5 py-0 h-4 border-amber-300 text-amber-600 bg-amber-50">
                    <Construction className="h-2.5 w-2.5 mr-0.5" />
                    {t.browse.inProgress}
                  </Badge>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
