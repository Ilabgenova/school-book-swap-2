import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  ListChecks,
  Calendar,
} from "lucide-react";
import { BookListItem } from "./BookListItem";
import { ListingsModal } from "./ListingsModal";
import { SummerReadingSection } from "./SummerReadingSection";
import { officialBooks, mockListings, OfficialBook } from "@/data/officialBooks";

interface BookListProps {
  selectedGrade: string;
  selectedProgram: string;
  selectedSubjects?: string[] | null;
  selectedLanguages?: Record<string, string> | null;
  onBack: () => void;
}

export const BookList = ({
  selectedGrade,
  selectedProgram,
  selectedSubjects,
  selectedLanguages,
  onBack,
}: BookListProps) => {
  const { t } = useLanguage();
  const [selectedBook, setSelectedBook] = useState<OfficialBook | null>(null);

  // Filter books by selected grade, subjects (for DP), and language levels (for MYP)
  const books = officialBooks.filter((book) => {
    if (book.grade !== selectedGrade || book.isSummerReading) return false;
    // For DP program with selected subjects, filter by subject
    if (selectedProgram === "DP" && selectedSubjects && selectedSubjects.length > 0) {
      return selectedSubjects.includes(book.subject);
    }
    // For MYP, filter by foreign language: show core books + selected foreign language books
    if (selectedProgram === "MYP" && selectedLanguages?.foreignLanguage) {
      const foreignLang = selectedLanguages.foreignLanguage;
      const isForeignLangBook = book.subject === foreignLang || book.subject === `${foreignLang} B`;
      const isCoreForeignLang = ["Spanish", "German", "Chinese", "French", "Spanish B", "German B", "Chinese B", "French B"].includes(book.subject);
      // If it's a foreign language book, only show if it matches selection
      if (isCoreForeignLang) return isForeignLangBook;
    }
    return true;
  });

  const stats = {
    total: books.length,
    available: books.filter(
      (b) =>
        b.availableFromPreviousYear && (mockListings[b.id]?.length ?? 0) > 0
    ).length,
  };

  return (
    <div className="space-y-6">
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
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {t.browse.schoolYear} 2025-2026 • {t.browse.officialBookList}
            </p>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex flex-wrap gap-4 p-4 bg-secondary/30 rounded-xl border border-border">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            <strong>{stats.total}</strong> {t.browse.totalBooks}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-primary" />
          <span className="text-sm">
            <strong>{stats.available}</strong> {t.browse.withListings}
          </span>
        </div>
      </div>

      {/* Book list */}
      <div className="space-y-3">
        {books.map((book) => (
          <BookListItem
            key={book.id}
            book={book}
            listings={mockListings[book.id] || []}
            onViewListings={setSelectedBook}
          />
        ))}
      </div>

      {/* Summer Reading Section */}
      <SummerReadingSection
        selectedGrade={selectedGrade}
        selectedProgram={selectedProgram}
      />

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
