import { ShoppingBag } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

/**
 * Notice rendered on browse / buy pages with the Amazon affiliate + verification
 * disclaimer required for the 2026-2027 book list.
 */
export const BuyNewNotice = () => {
  const { language } = useLanguage();
  const it = language === "it";
  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900 flex gap-2">
      <ShoppingBag className="h-4 w-4 mt-0.5 shrink-0" />
      <div className="space-y-1.5">
        <p>
          <strong>
            {it ? "Compra nuovo su Amazon (link affiliati)" : "Buy new on Amazon (affiliate links)"}
          </strong>
        </p>
        <p className="text-xs leading-relaxed">
          {it
            ? "Alcuni link Amazon presenti su DISbook sono link affiliati. Se acquisti tramite questi link, DISbook può ricevere un piccolo contributo da Amazon, senza costi aggiuntivi per te. Questo ci aiuta a mantenere e migliorare l'app per la comunità DIS."
            : "Some Amazon links on DISbook are affiliate links. If you purchase through these links, DISbook may receive a small contribution from Amazon, at no extra cost to you. This helps us maintain and improve the app for the DIS community."}
        </p>
        <p className="text-xs leading-relaxed">
          {it
            ? "Prima di acquistare, controlla attentamente titolo, ISBN, edizione, autore, editore e requisiti della classe. DISbook fornisce link per aiutare le famiglie, ma gli utenti sono responsabili di verificare che il libro selezionato corrisponda alla lista ufficiale."
            : "Before purchasing, please carefully check the book title, ISBN, edition, author, publisher, and class requirements. DISbook provides links to help families, but users are responsible for verifying that the selected book matches the official school book list."}
        </p>
      </div>
    </div>
  );
};
