import { ShoppingBag, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAmazonLink } from "@/hooks/useAmazonLink";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AmazonBuyButtonProps {
  isbn?: string;
  title?: string;
  /** When true, render the compact card variant without the disclaimer text. */
  compact?: boolean;
}

/**
 * Displays either:
 *  - "Buy new on Amazon / Compra nuovo su Amazon" affiliate button (with combined disclaimer)
 *  - "Not available on Amazon / Non disponibile su Amazon" note when no link exists.
 */
export const AmazonBuyButton = ({ isbn, title, compact = false }: AmazonBuyButtonProps) => {
  const { url, loading, resolved } = useAmazonLink(isbn, title);
  const { language } = useLanguage();
  const it = language === "it";

  if (loading || !resolved) {
    return null; // avoid flashing "not available" while lookup is pending
  }

  if (url) {
    const buyLabel = it ? "Compra nuovo su Amazon" : "Buy new on Amazon";
    const combined = it
      ? "Alcuni link Amazon su DISbook sono affiliati: se acquisti tramite questi link, DISbook può ricevere un piccolo contributo da Amazon, senza costi aggiuntivi per te. Questo ci aiuta a mantenere e migliorare l'app per la comunità DIS. Prima di acquistare, controlla attentamente titolo, ISBN, edizione, autore, editore e requisiti della classe."
      : "Some Amazon links on DISbook are affiliate links. If you purchase through these links, DISbook may receive a small contribution from Amazon, at no extra cost to you. This helps us maintain and improve the app for the DIS community. Before purchasing, please carefully check the book title, ISBN, edition, author, publisher, and class requirements.";

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <Button asChild size="sm" variant="default" className="gap-1">
            <a href={url} target="_blank" rel="noopener nofollow sponsored">
              <ShoppingBag className="h-3 w-3" />
              {buyLabel}
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={it ? "Informazioni Amazon" : "Amazon info"}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs leading-relaxed">
                {combined}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {!compact && (
          <p className="text-[10px] text-muted-foreground italic leading-snug max-w-xs">
            {it
              ? "Link affiliato — DISbook può ricevere un piccolo contributo, senza costi extra per te. Verifica sempre titolo, ISBN ed edizione."
              : "Affiliate link — DISbook may earn a small contribution at no extra cost. Always verify title, ISBN and edition."}
          </p>
        )}
      </div>
    );
  }

  // No link known → transparent "not available" note (never a clickable button)
  return (
    <span
      className="inline-flex items-center gap-1 text-xs text-muted-foreground italic"
      title={it ? "Non disponibile su Amazon" : "Not available on Amazon"}
    >
      <ShoppingBag className="h-3 w-3 opacity-60" />
      {it ? "Non disponibile su Amazon" : "Not available on Amazon"}
    </span>
  );
};
