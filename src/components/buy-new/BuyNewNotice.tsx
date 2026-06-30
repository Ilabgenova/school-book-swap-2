import { ShoppingBag } from "lucide-react";
import { NEW_SCHOOL_YEAR_AVAILABLE } from "@/data/officialBooks";

/**
 * Notice rendered on browse / buy pages explaining that the Amazon
 * "Buy New" flow is prepared but waiting for the official new-year list.
 */
export const BuyNewNotice = () => {
  if (NEW_SCHOOL_YEAR_AVAILABLE) return null;
  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900 flex gap-2">
      <ShoppingBag className="h-4 w-4 mt-0.5 shrink-0" />
      <div>
        <strong>New books list and Amazon purchase links coming soon.</strong>{" "}
        The "Buy New on Amazon" option will be enabled once the official
        school book list for the new year is confirmed and links are added
        by the DISbook team.
        <div className="mt-1 text-xs text-sky-800/80 italic">
          As an Amazon Associate, DISbook may earn from qualifying purchases,
          at no extra cost to you.
        </div>
      </div>
    </div>
  );
};
