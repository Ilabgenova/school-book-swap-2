import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  Package,
  Shield,
  Euro,
  ArrowRight,
} from "lucide-react";
import { Transaction, TransactionStatus } from "@/hooks/useTransactions";

interface TransactionConfirmationProps {
  transaction: Transaction;
  onConfirmDelivery?: () => void;
  onClose: () => void;
  userRole: "buyer" | "seller";
}

export const TransactionConfirmation = ({
  transaction,
  onConfirmDelivery,
  onClose,
  userRole,
}: TransactionConfirmationProps) => {
  const { t } = useLanguage();

  const getStatusInfo = (status: TransactionStatus) => {
    switch (status) {
      case "payment_held":
        return {
          icon: Shield,
          label: t.browse.escrow.paymentHeld,
          color: "text-amber-500",
          bgColor: "bg-amber-500/10",
          description: userRole === "buyer" 
            ? t.browse.escrow.paymentHeldBuyerDesc 
            : t.browse.escrow.paymentHeldSellerDesc,
        };
      case "delivery_confirmed":
        return {
          icon: Package,
          label: t.browse.escrow.deliveryConfirmed,
          color: "text-primary",
          bgColor: "bg-primary/10",
          description: t.browse.escrow.deliveryConfirmedDesc,
        };
      case "payment_released":
        return {
          icon: CheckCircle2,
          label: t.browse.escrow.paymentReleased,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
          description: t.browse.escrow.paymentReleasedDesc,
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
          {t.browse.escrow.transactionDetails}
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t.browse.escrow.book}</span>
            <span className="font-medium text-foreground">{transaction.bookTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t.browse.escrow.seller}</span>
            <span className="font-medium text-foreground">{transaction.sellerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t.browse.bookPrice}</span>
            <span className="font-medium text-foreground">€{transaction.bookPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t.browse.serviceFee}</span>
            <span className="font-medium text-foreground">€{transaction.appFee.toFixed(2)}</span>
          </div>
          <div className="h-px bg-border my-2" />
          <div className="flex justify-between text-base">
            <span className="font-medium text-foreground">{t.browse.total}</span>
            <span className="font-bold text-primary">€{transaction.totalPaid.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Escrow Flow Visualization */}
      <div className="p-4 bg-card rounded-xl border border-border">
        <h4 className="font-medium text-foreground mb-4 text-center">
          {t.browse.escrow.howItWorks}
        </h4>
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col items-center text-center flex-1">
            <div className={`p-2 rounded-full ${transaction.status !== "cancelled" ? "bg-primary/10" : "bg-muted"}`}>
              <Euro className={`h-4 w-4 ${transaction.status !== "cancelled" ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <span className="text-xs mt-1 text-muted-foreground">{t.browse.escrow.step1}</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div className="flex flex-col items-center text-center flex-1">
            <div className={`p-2 rounded-full ${["delivery_confirmed", "payment_released"].includes(transaction.status) ? "bg-primary/10" : "bg-muted"}`}>
              <Package className={`h-4 w-4 ${["delivery_confirmed", "payment_released"].includes(transaction.status) ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <span className="text-xs mt-1 text-muted-foreground">{t.browse.escrow.step2}</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div className="flex flex-col items-center text-center flex-1">
            <div className={`p-2 rounded-full ${transaction.status === "payment_released" ? "bg-green-500/10" : "bg-muted"}`}>
              <CheckCircle2 className={`h-4 w-4 ${transaction.status === "payment_released" ? "text-green-500" : "text-muted-foreground"}`} />
            </div>
            <span className="text-xs mt-1 text-muted-foreground">{t.browse.escrow.step3}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {transaction.status === "payment_held" && userRole === "buyer" && onConfirmDelivery && (
          <Button className="flex-1" onClick={onConfirmDelivery}>
            <Package className="h-4 w-4 mr-2" />
            {t.browse.escrow.confirmDelivery}
          </Button>
        )}
        <Button variant="outline" className="flex-1" onClick={onClose}>
          {t.common.cancel}
        </Button>
      </div>

      {/* Security Note */}
      <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
        <p className="text-xs text-muted-foreground flex items-start gap-2">
          <Shield className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
          {t.browse.escrow.securityNote}
        </p>
      </div>
    </div>
  );
};
