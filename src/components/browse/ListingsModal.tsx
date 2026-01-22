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
} from "lucide-react";
import { OfficialBook, BookListing } from "./BookListItem";

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
  const { t } = useLanguage();

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

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            {book.title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {book.subject} • {book.publisher}
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {listings.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {t.browse.noListingsYet}
            </p>
          ) : (
            listings.map((listing) => (
              <div
                key={listing.id}
                className="p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    {/* Seller info with rating */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                        {listing.sellerName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">
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
                            {listing.sellerCompletedExchanges}{" "}
                            {t.browse.exchanges}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge
                        variant={listing.type as "sale" | "exchange" | "donation"}
                      >
                        {listing.type === "donation" && (
                          <Heart className="h-3 w-3 mr-1" />
                        )}
                        {listing.type === "exchange" && (
                          <Tag className="h-3 w-3 mr-1" />
                        )}
                        {getTypeLabel(listing.type)}
                      </Badge>
                      <Badge
                        variant={listing.condition as "new" | "asNew" | "used"}
                      >
                        {getConditionLabel(listing.condition)}
                      </Badge>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    {listing.type === "sale" && listing.price ? (
                      <span className="font-display font-bold text-xl text-primary flex items-center">
                        <Euro className="h-5 w-5" />
                        {listing.price}
                      </span>
                    ) : listing.type === "donation" ? (
                      <span className="font-medium text-donation">
                        {t.common.free}
                      </span>
                    ) : (
                      <span className="font-medium text-accent text-sm">
                        {t.common.exchange}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action */}
                <Button className="w-full mt-3 gap-2" size="sm">
                  <MessageCircle className="h-4 w-4" />
                  {t.browse.contactSeller}
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
