import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ShoppingCart,
  ListChecks,
  Calendar,
} from "lucide-react";
import { BookListItem } from "./BookListItem";
import { ListingsModal } from "./ListingsModal";
import { SummerReadingSection } from "./SummerReadingSection";
import { officialBooks, mockListings, OfficialBook, getPriceRange } from "@/data/officialBooks";

interface BookListProps {
  selectedGrade: string;
  selectedProgram: string;
  selectedSubjects?: string[] | null;
  onBack: () => void;
}

export const BookList = ({
  selectedGrade,
  selectedProgram,
  selectedSubjects,
  onBack,
}: BookListProps) => {
  const { t } = useLanguage();
  const [foundBooks, setFoundBooks] = useState<Set<string>>(new Set());
  const [toBuyBooks, setToBuyBooks] = useState<Set<string>>(new Set());
  const [selectedBook, setSelectedBook] = useState<OfficialBook | null>(null);

  // Filter books by selected grade and subjects (for DP)
  const books = officialBooks.filter((book) => {
    if (book.grade !== selectedGrade || book.isSummerReading) return false;
    // For DP program with selected subjects, filter by subject
    if (selectedProgram === "DP" && selectedSubjects && selectedSubjects.length > 0) {
      return selectedSubjects.includes(book.subject);
    }
    return true;
  });

  const toggleFound = (bookId: string) => {
    setFoundBooks((prev) => {
      const next = new Set(prev);
      if (next.has(bookId)) {
        next.delete(bookId);
      } else {
        next.add(bookId);
        // Remove from "to buy" if marking as found
        setToBuyBooks((toBuy) => {
          const newToBuy = new Set(toBuy);
          newToBuy.delete(bookId);
          return newToBuy;
        });
      }
      return next;
    });
  };

  const toggleToBuy = (bookId: string) => {
    if (foundBooks.has(bookId)) return;
    setToBuyBooks((prev) => {
      const next = new Set(prev);
      if (next.has(bookId)) {
        next.delete(bookId);
      } else {
        next.add(bookId);
      }
      return next;
    });
  };

  const selectAll = (type: "found" | "toBuy") => {
    const availableBooks = books.filter((b) => b.availableFromPreviousYear);
    if (type === "found") {
      setFoundBooks(new Set(availableBooks.map((b) => b.id)));
      setToBuyBooks(new Set());
    } else {
      const notFoundBooks = availableBooks.filter(
        (b) => !foundBooks.has(b.id)
      );
      setToBuyBooks(new Set(notFoundBooks.map((b) => b.id)));
    }
  };

  const clearAll = () => {
    setFoundBooks(new Set());
    setToBuyBooks(new Set());
  };

  const stats = {
    total: books.length,
    found: foundBooks.size,
    toBuy: toBuyBooks.size,
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
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <span className="text-sm">
            <strong>{stats.found}</strong> {t.browse.markedFound}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-accent" />
          <span className="text-sm">
            <strong>{stats.toBuy}</strong> {t.browse.markedToBuy}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-primary" />
          <span className="text-sm">
            <strong>{stats.available}</strong> {t.browse.withListings}
          </span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => selectAll("found")}>
          <CheckCircle2 className="h-4 w-4 mr-1" />
          {t.browse.markAllFound}
        </Button>
        <Button variant="outline" size="sm" onClick={() => selectAll("toBuy")}>
          <ShoppingCart className="h-4 w-4 mr-1" />
          {t.browse.markAllToBuy}
        </Button>
        <Button variant="ghost" size="sm" onClick={clearAll}>
          {t.browse.clearAll}
        </Button>
      </div>

      {/* Book list */}
      <div className="space-y-3">
        {books.map((book) => (
          <BookListItem
            key={book.id}
            book={book}
            listings={mockListings[book.id] || []}
            isFound={foundBooks.has(book.id)}
            isToBuy={toBuyBooks.has(book.id)}
            onToggleFound={toggleFound}
            onToggleToBuy={toggleToBuy}
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
