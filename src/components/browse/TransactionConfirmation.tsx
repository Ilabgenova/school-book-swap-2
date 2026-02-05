import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  Package,
  UserCheck,
  Heart,
  ArrowRight,
  HandshakeIcon,
} from "lucide-react";
import { Transaction, TransactionStatus } from "@/hooks/useTransactions";

interface TransactionConfirmationProps {
  transaction: Transaction;
  onConfirmByBuyer?: () => void;
  onConfirmBySeller?: () => void;
  onClose: () => void;
  userRole: "buyer" | "seller";
}

export const TransactionConfirmation = ({
  transaction,
  onConfirmByBuyer,
  onConfirmBySeller,
  onClose,
  userRole,
}: TransactionConfirmationProps) => {
  const { t } = useLanguage();

  const isCompleted = transaction.status === "completed";
  const buyerHasConfirmed = !!transaction.buyerConfirmedAt;
  const sellerHasConfirmed = !!transaction.sellerConfirmedAt;

  const getStatusInfo = (status: TransactionStatus) => {
    switch (status) {
      case "reserved":
        return {
          icon: Clock,
          label: t.browse.reservation.reserved,
          color: "text-amber-500",
          bgColor: "bg-amber-500/10",
          description: userRole === "buyer" 
            ? t.browse.reservation.reservedBuyerDesc 
            : t.browse.reservation.reservedSellerDesc,
        };
      case "buyer_confirmed":
        return {
          icon: UserCheck,
          label: t.browse.reservation.buyerConfirmed,
          color: "text-primary",
          bgColor: "bg-primary/10",
          description: t.browse.reservation.waitingSellerConfirm,
        };
      case "seller_confirmed":
        return {
          icon: Package,
          label: t.browse.reservation.sellerConfirmed,
          color: "text-primary",
          bgColor: "bg-primary/10",
          description: t.browse.reservation.waitingBuyerConfirm,
        };
      case "completed":
        return {
          icon: CheckCircle2,
          label: t.browse.reservation.completed,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
          description: t.browse.reservation.completedDesc,
        };
      case "cancelled":
      default:
        return {
          icon: Clock,
          label: t.common.cancel,
          color: "text-muted-foreground",
          bgColor: "bg-muted",
          description: "",
        };
    }
  };

  const statusInfo = getStatusInfo(transaction.status);
  const StatusIcon = statusInfo.icon;

  const canBuyerConfirm = userRole === "buyer" && !buyerHasConfirmed && transaction.status !== "completed";
  const canSellerConfirm = userRole === "seller" && !sellerHasConfirmed && transaction.status !== "completed";

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div className={`p-4 rounded-xl ${statusInfo.bgColor} border border-border`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${statusInfo.bgColor}`}>
            <StatusIcon className={`h-6 w-6 ${statusInfo.color}`} />
          </div>
          <div>
            <h3 className={`font-semibold ${statusInfo.color}`}>
              {statusInfo.label}
            </h3>
            <p className="text-sm text-muted-foreground">
              {statusInfo.description}
            </p>
          </div>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="p-4 bg-secondary/30 rounded-xl border border-border">
        <h4 className="font-medium text-foreground mb-3">
          {t.browse.reservation.transactionDetails}
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t.browse.reservation.book}</span>
            <span className="font-medium text-foreground">{transaction.bookTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t.browse.reservation.seller}</span>
            <span className="font-medium text-foreground">{transaction.sellerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t.browse.reservation.buyer}</span>
            <span className="font-medium text-foreground">{transaction.buyerName}</span>
          </div>
          {transaction.bookPrice > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.browse.reservation.agreedPrice}</span>
              <span className="font-medium text-foreground">€{transaction.bookPrice.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Flow Visualization */}
      <div className="p-4 bg-card rounded-xl border border-border">
        <h4 className="font-medium text-foreground mb-4 text-center">
          {t.browse.reservation.howItWorks}
        </h4>
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col items-center text-center flex-1">
            <div className={`p-2 rounded-full ${transaction.status !== "cancelled" ? "bg-primary/10" : "bg-muted"}`}>
              <HandshakeIcon className={`h-4 w-4 ${transaction.status !== "cancelled" ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <span className="text-xs mt-1 text-muted-foreground">{t.browse.reservation.step1}</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div className="flex flex-col items-center text-center flex-1">
            <div className={`p-2 rounded-full ${buyerHasConfirmed ? "bg-primary/10" : "bg-muted"}`}>
              <UserCheck className={`h-4 w-4 ${buyerHasConfirmed ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <span className="text-xs mt-1 text-muted-foreground">{t.browse.reservation.step2}</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div className="flex flex-col items-center text-center flex-1">
            <div className={`p-2 rounded-full ${sellerHasConfirmed ? "bg-primary/10" : "bg-muted"}`}>
              <Package className={`h-4 w-4 ${sellerHasConfirmed ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <span className="text-xs mt-1 text-muted-foreground">{t.browse.reservation.step3}</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div className="flex flex-col items-center text-center flex-1">
            <div className={`p-2 rounded-full ${isCompleted ? "bg-green-500/10" : "bg-muted"}`}>
              <CheckCircle2 className={`h-4 w-4 ${isCompleted ? "text-green-500" : "text-muted-foreground"}`} />
            </div>
            <span className="text-xs mt-1 text-muted-foreground">{t.browse.reservation.step4}</span>
          </div>
        </div>
      </div>

      {/* Donate Button - Only show when completed */}
      {isCompleted && (
        <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
          <div className="text-center space-y-3">
            <Heart className="h-8 w-8 text-primary mx-auto" />
            <h4 className="font-semibold text-foreground">
              {t.browse.reservation.thankYou}
            </h4>
            <p className="text-sm text-muted-foreground">
              {t.browse.reservation.donateMessage}
            </p>
            <Button 
              className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
              onClick={() => window.open("https://donate.example.com", "_blank")}
            >
              <Heart className="h-4 w-4" />
              {t.browse.reservation.donateButton}
            </Button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {canBuyerConfirm && onConfirmByBuyer && (
          <Button className="flex-1" onClick={onConfirmByBuyer}>
            <UserCheck className="h-4 w-4 mr-2" />
            {t.browse.reservation.confirmReceived}
          </Button>
        )}
        {canSellerConfirm && onConfirmBySeller && (
          <Button className="flex-1" onClick={onConfirmBySeller}>
            <Package className="h-4 w-4 mr-2" />
            {t.browse.reservation.confirmHandover}
          </Button>
        )}
        <Button variant="outline" className={!canBuyerConfirm && !canSellerConfirm ? "w-full" : "flex-1"} onClick={onClose}>
          {isCompleted ? t.common.cancel : t.browse.reservation.close}
        </Button>
      </div>

      {/* Info Note */}
      {!isCompleted && (
        <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
          <p className="text-xs text-muted-foreground flex items-start gap-2">
            <HandshakeIcon className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            {t.browse.reservation.infoNote}
          </p>
        </div>
      )}
    </div>
  );
};
