import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpenCheck, BookOpen, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { summerReadingBooks, mockListings, OfficialBook } from "@/data/officialBooks";
import { ListingsModal } from "./ListingsModal";

interface SummerReadingSectionProps {
  selectedGrade: string;
  selectedProgram: string;
}

export const SummerReadingSection = ({
  selectedGrade,
  selectedProgram,
}: SummerReadingSectionProps) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedBook, setSelectedBook] = useState<OfficialBook | null>(null);

  // Filter summer reading books for the current program level
  const relevantBooks = summerReadingBooks.filter((book) => {
    if (selectedProgram === "MYP") {
      const gradeNum = parseInt(selectedGrade.replace("MYP ", ""));
      if (gradeNum <= 2) return book.grade === "MYP 1-2";
      return book.grade === "MYP 3-5";
    }
    return book.grade === "DP 1-2";
  });

  if (relevantBooks.length === 0) return null;

  return (
    <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 dark:bg-primary/10 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-primary/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <BookOpenCheck className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-display font-bold text-foreground">
              {t.browse.additionalRecommendedBooks}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t.browse.additionalRecommendedBooksDesc}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      {/* Book List */}
      {isExpanded && (
        <div className="p-4 pt-0 space-y-3">
          {relevantBooks.map((book) => {
            const listings = mockListings[book.id] || [];
            const hasListings = listings.length > 0;
            const hasDonation = listings.some((l) => l.type === "donation");
            const lowestPrice = listings
              .filter((l) => l.type === "sale" && l.price)
              .reduce((min, l) => Math.min(min, l.price!), Infinity);

            return (
              <div
                key={book.id}
                className="flex items-center justify-between p-3 rounded-xl bg-background border border-border"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                    <h4 className="font-medium text-foreground truncate">
                      {book.title}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {book.publisher}
                  </p>
                  {hasListings && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-primary font-medium">
                        {listings.length} {t.browse.availableOnApp}
                      </span>
                      {hasDonation && (
                        <Badge variant="donation" className="text-xs py-0">
                          {t.common.donation}
                        </Badge>
                      )}
                      {lowestPrice < Infinity && (
                        <span className="text-xs text-muted-foreground">
                          {t.browse.from} €{lowestPrice}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {hasListings && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedBook(book)}
                    >
                      {t.browse.viewListings}
                    </Button>
                  )}
                  {/* External purchase link disabled — Buy New is a future feature */}

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Listings modal */}
      {selectedBook && (
        <ListingsModal
          book={selectedBook}
          listings={mockListings[selectedBook.id] || []}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
};
