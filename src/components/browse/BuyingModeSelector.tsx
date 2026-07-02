import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Recycle, ArrowLeft } from "lucide-react";

interface BuyingModeSelectorProps {
  selectedGrade: string;
  selectedProgram: string;
  onSelectMode: (mode: "new" | "used") => void;
  onBack: () => void;
}

export const BuyingModeSelector = ({
  selectedGrade,
  selectedProgram,
  onSelectMode,
  onBack,
}: BuyingModeSelectorProps) => {
  const { t } = useLanguage();


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <Badge
              variant={selectedProgram.toLowerCase() as "pyp" | "myp" | "dp"}
            >
              {selectedProgram}
            </Badge>
            <h2 className="font-display text-xl font-bold text-foreground">
              {selectedGrade}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {t.browse.chooseHowToBuy}
          </p>
        </div>
      </div>

      {/* Mode Selection Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Buy New on Amazon (affiliate links) */}
        <button
          onClick={() => onSelectMode("new")}
          className="group relative p-6 rounded-2xl border-2 border-border bg-card hover:border-primary hover:shadow-lg transition-all text-left"
        >
          <div className="space-y-4">
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {t.browse.buyAllNew}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t.browse.buyAllNewDescription}
              </p>
            </div>
            <p className="text-xs text-muted-foreground italic">
              {t.browse.affiliateLink}
            </p>
          </div>
        </button>


        {/* See Used Options */}
        <button
          onClick={() => onSelectMode("used")}
          className="group relative p-6 rounded-2xl border-2 border-border bg-card hover:border-accent hover:shadow-lg transition-all text-left"
        >
          <div className="space-y-4">
            <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center">
              <Recycle className="h-7 w-7 text-accent" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                {t.browse.seeUsedOptions}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t.browse.seeUsedOptionsDescription}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-primary/10 text-primary rounded-md font-medium">
                {t.browse.saveMoney}
              </span>
              <span className="px-2 py-1 bg-accent/10 text-accent rounded-md font-medium">
                {t.browse.ecoFriendly}
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
