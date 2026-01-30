import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Wallet,
  Apple,
  Smartphone,
  Euro,
  Info,
} from "lucide-react";

interface PaymentOptionsProps {
  bookPrice: number;
  onConfirmPayment: (method: string) => void;
  onCancel: () => void;
}

const APP_FEE = 0.50; // €0.50 fee to the app

export const PaymentOptions = ({
  bookPrice,
  onConfirmPayment,
  onCancel,
}: PaymentOptionsProps) => {
  const { t } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState<string>("paypal");

  const paymentMethods = [
    {
      id: "paypal",
      name: "PayPal",
      icon: Wallet,
      color: "text-[#003087]",
    },
    {
      id: "satispay",
      name: "Satispay",
      icon: Smartphone,
      color: "text-[#E42313]",
    },
    {
      id: "apple-pay",
      name: "Apple Pay",
      icon: Apple,
      color: "text-foreground",
    },
    {
      id: "google-pay",
      name: "Google Pay",
      icon: CreditCard,
      color: "text-[#4285F4]",
    },
  ];

  const totalAmount = bookPrice + APP_FEE;

  return (
    <div className="space-y-4">
      <div className="p-4 bg-secondary/30 rounded-xl border border-border">
        <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
          <Euro className="h-4 w-4 text-primary" />
          {t.browse.paymentBreakdown}
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t.browse.bookPrice}</span>
            <span className="font-medium text-foreground">€{bookPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1">
              {t.browse.serviceFee}
              <Info className="h-3 w-3" />
            </span>
            <span className="font-medium text-foreground">€{APP_FEE.toFixed(2)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between text-base">
            <span className="font-medium text-foreground">{t.browse.total}</span>
            <span className="font-bold text-primary">€{totalAmount.toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-3 p-2 bg-primary/5 rounded-lg border border-primary/10">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Info className="h-3 w-3 text-primary" />
            {t.browse.paymentNote}
          </p>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-foreground mb-3">{t.browse.selectPaymentMethod}</h4>
        <RadioGroup
          value={selectedMethod}
          onValueChange={setSelectedMethod}
          className="grid grid-cols-2 gap-3"
        >
          {paymentMethods.map((method) => (
            <div key={method.id}>
              <RadioGroupItem
                value={method.id}
                id={method.id}
                className="peer sr-only"
              />
              <Label
                htmlFor={method.id}
                className="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:border-primary/50"
              >
                <method.icon className={`h-5 w-5 ${method.color}`} />
                <span className="font-medium text-sm">{method.name}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          {t.common.cancel}
        </Button>
        <Button
          className="flex-1"
          onClick={() => onConfirmPayment(selectedMethod)}
        >
          {t.browse.payNow} €{totalAmount.toFixed(2)}
        </Button>
      </div>
    </div>
  );
};
