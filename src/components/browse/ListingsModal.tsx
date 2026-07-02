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
} from "lucide-react";
import { OfficialBook, BookListing } from "@/data/officialBooks";
import { TransactionConfirmation } from "./TransactionConfirmation";
import { useTransactions, Transaction } from "@/hooks/useTransactions";
import { useAuth } from "@/hooks/useAuth";

interface ListingsModalProps {
  book: OfficialBook;
  listings: BookListing[];
  onClose: () => void;
}

type ModalView = "listings" | "confirmation";

export const ListingsModal = ({
  book,
  listings,
  onClose,
}: ListingsModalProps) => {
  const { t, language } = useLanguage();
  const { createTransaction, confirmByBuyer, confirmBySeller } = useTransactions();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [view, setView] = useState<ModalView>("listings");

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

  const handleReserve = (listing: BookListing) => {
    // Create transaction - all free for now
    const transaction = createTransaction({
      listingId: listing.id,
      bookTitle: book.title,
      buyerId: "current_user", // In real app, get from auth
      buyerName: "Current User", // In real app, get from auth
      sellerId: listing.sellerId,
      sellerName: listing.sellerName,
      bookPrice: listing.price || 0,
    });

    setCurrentTransaction(transaction);
    setView("confirmation");
  };

  const handleConfirmByBuyer = () => {
    if (currentTransaction) {
      confirmByBuyer(currentTransaction.id);
      setCurrentTransaction({
        ...currentTransaction,
        status: currentTransaction.sellerConfirmedAt ? "completed" : "buyer_confirmed",
        buyerConfirmedAt: new Date(),
        completedAt: currentTransaction.sellerConfirmedAt ? new Date() : undefined,
      });
    }
  };

  const handleConfirmBySeller = () => {
    if (currentTransaction) {
      confirmBySeller(currentTransaction.id);
      setCurrentTransaction({
        ...currentTransaction,
        status: currentTransaction.buyerConfirmedAt ? "completed" : "seller_confirmed",
        sellerConfirmedAt: new Date(),
        completedAt: currentTransaction.buyerConfirmedAt ? new Date() : undefined,
      });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            {view === "confirmation" ? t.browse.reservation.bookReserved : book.title}
          </DialogTitle>
          {view !== "confirmation" && (
            <p className="text-sm text-muted-foreground">
              {book.subject} • {book.publisher}
            </p>
          )}
        </DialogHeader>

        {view === "confirmation" && currentTransaction ? (
          <div className="mt-4">
            <TransactionConfirmation
              transaction={currentTransaction}
              onConfirmByBuyer={handleConfirmByBuyer}
              onConfirmBySeller={handleConfirmBySeller}
              onClose={onClose}
              userRole="buyer"
            />
          </div>
        ) : (
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

                    {/* Price - now showing "Free" for test release */}
                    <div className="text-right">
                      {listing.type === "sale" && listing.price ? (
                        <div>
                          <span className="font-display font-bold text-xl text-primary flex items-center">
                            <Euro className="h-5 w-5" />
                            {listing.price}
                          </span>
                          <span className="text-xs text-muted-foreground block">
                            {t.browse.reservation.freeForNow}
                          </span>
                        </div>
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
                  <Button 
                    className="w-full mt-3 gap-2" 
                    size="sm"
                    onClick={() => handleReserve(listing)}
                  >
                    <BookOpen className="h-4 w-4" />
                    {t.browse.reservation.reserveNow}
                  </Button>
                </div>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
