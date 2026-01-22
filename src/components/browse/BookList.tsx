import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ShoppingCart,
  ListChecks,
} from "lucide-react";
import { BookListItem, OfficialBook, BookListing } from "./BookListItem";
import { ListingsModal } from "./ListingsModal";

// Mock data for official books
const mockOfficialBooks: OfficialBook[] = [
  {
    id: "1",
    title: "Mathematics - Student Book Grade 3",
    subject: "Mathematics",
    publisher: "Cambridge",
    isbn: "978-1-234-56789-0",
    availableFromPreviousYear: true,
    externalPurchaseUrl: "https://amazon.com/book1",
  },
  {
    id: "2",
    title: "English Language Arts - Reading & Writing",
    subject: "English",
    publisher: "Oxford",
    isbn: "978-1-234-56789-1",
    availableFromPreviousYear: true,
    externalPurchaseUrl: "https://amazon.com/book2",
  },
  {
    id: "3",
    title: "Science - Exploring Our World",
    subject: "Science",
    publisher: "Pearson",
    isbn: "978-1-234-56789-2",
    availableFromPreviousYear: true,
    externalPurchaseUrl: "https://amazon.com/book3",
  },
  {
    id: "4",
    title: "Italian Language - Nuovo Progetto",
    subject: "Italian",
    publisher: "Loescher",
    isbn: "978-1-234-56789-3",
    availableFromPreviousYear: false,
    externalPurchaseUrl: "https://amazon.com/book4",
  },
  {
    id: "5",
    title: "Art & Design - Creative Expression",
    subject: "Art",
    publisher: "McGraw Hill",
    isbn: "978-1-234-56789-4",
    availableFromPreviousYear: true,
    externalPurchaseUrl: "https://amazon.com/book5",
  },
  {
    id: "6",
    title: "Physical Education Handbook",
    subject: "PE",
    publisher: "School Edition",
    availableFromPreviousYear: false,
    externalPurchaseUrl: "https://amazon.com/book6",
  },
  {
    id: "7",
    title: "Music Theory & Practice",
    subject: "Music",
    publisher: "ABRSM",
    isbn: "978-1-234-56789-5",
    availableFromPreviousYear: true,
  },
];

// Mock listings for books
const mockListings: Record<string, BookListing[]> = {
  "1": [
    {
      id: "l1",
      type: "sale",
      price: 15,
      condition: "asNew",
      sellerRating: 4.8,
      sellerName: "Maria R.",
      sellerCompletedExchanges: 12,
    },
    {
      id: "l2",
      type: "sale",
      price: 12,
      condition: "used",
      sellerRating: 4.5,
      sellerName: "Giovanni P.",
      sellerCompletedExchanges: 8,
    },
  ],
  "2": [
    {
      id: "l3",
      type: "donation",
      condition: "used",
      sellerRating: 5.0,
      sellerName: "Laura B.",
      sellerCompletedExchanges: 15,
    },
  ],
  "3": [
    {
      id: "l4",
      type: "exchange",
      condition: "asNew",
      sellerRating: 4.2,
      sellerName: "Marco T.",
      sellerCompletedExchanges: 5,
    },
  ],
  "5": [
    {
      id: "l5",
      type: "sale",
      price: 20,
      condition: "new",
      sellerRating: 4.9,
      sellerName: "Sofia L.",
      sellerCompletedExchanges: 20,
    },
    {
      id: "l6",
      type: "donation",
      condition: "used",
      sellerRating: 4.0,
      sellerName: "Andrea M.",
      sellerCompletedExchanges: 3,
    },
  ],
};

interface BookListProps {
  selectedGrade: string;
  selectedProgram: string;
  onBack: () => void;
}

export const BookList = ({
  selectedGrade,
  selectedProgram,
  onBack,
}: BookListProps) => {
  const { t } = useLanguage();
  const [foundBooks, setFoundBooks] = useState<Set<string>>(new Set());
  const [toBuyBooks, setToBuyBooks] = useState<Set<string>>(new Set());
  const [selectedBook, setSelectedBook] = useState<OfficialBook | null>(null);

  const books = mockOfficialBooks; // Would be filtered by grade in real app

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
          <p className="text-sm text-muted-foreground mt-1">
            {t.browse.officialBookList}
          </p>
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
