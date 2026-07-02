import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  ListChecks,
  Calendar,
  Languages,
} from "lucide-react";
import { BookListItem } from "./BookListItem";
import { ListingsModal } from "./ListingsModal";
import { SummerReadingSection } from "./SummerReadingSection";
import { officialBooks, OfficialBook, BookListing, isSellableItem, LAST_SCHOOL_YEAR, NEW_SCHOOL_YEAR_AVAILABLE } from "@/data/officialBooks";
import { BuyNewNotice } from "@/components/buy-new/BuyNewNotice";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";


const FOREIGN_LANGUAGE_SUBJECTS = ["Spanish", "German", "Chinese", "French", "Spanish B", "German B", "Chinese B", "French B"];

const mapListingCondition = (condition: string): BookListing["condition"] => {
  if (condition === "new") return "new";
  if (condition === "like_new") return "asNew";
  return "used";
};

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
  const { user } = useAuth();
  const [selectedBook, setSelectedBook] = useState<OfficialBook | null>(null);
  const [liveListings, setLiveListings] = useState<Record<string, BookListing[]>>({});

  // Filter books by selected grade, subjects (for DP), and language levels (for MYP)
  const allBooks = useMemo(() => officialBooks.filter((book) => {
    if (book.grade !== selectedGrade || book.isSummerReading) return false;
    if (!isSellableItem(book)) return false;
    if (selectedProgram === "DP" && selectedSubjects && selectedSubjects.length > 0) {
      return selectedSubjects.includes(book.subject);
    }
    if (selectedProgram === "MYP" && selectedLanguages?.foreignLanguage) {
      const foreignLang = selectedLanguages.foreignLanguage;
      const isForeignLangBook = book.subject === foreignLang || book.subject === `${foreignLang} B`;
      const isCoreForeignLang = FOREIGN_LANGUAGE_SUBJECTS.includes(book.subject);
      if (isCoreForeignLang) return isForeignLangBook;
    }
    return true;
  }), [selectedGrade, selectedProgram, selectedSubjects, selectedLanguages]);

  // Fetch approved live listings from the database (status = 'active').
  // Only signed-in users can query listings; anonymous visitors see an empty state.
  useEffect(() => {
    let cancelled = false;
    if (!user) { setLiveListings({}); return; }
    (async () => {
      const bookIds = allBooks.map((b) => b.id);
      if (bookIds.length === 0) { setLiveListings({}); return; }
      const { data: rows, error } = await supabase.rpc("get_active_listing_cards", {
        _book_ids: bookIds,
      });
      if (error || !rows || cancelled) { if (!cancelled) setLiveListings({}); return; }

      const grouped: Record<string, BookListing[]> = {};
      for (const r of rows as any[]) {
        const listing: BookListing = {
          id: r.id,
          type: r.listing_type,
          price: r.price != null ? Number(r.price) : undefined,
          condition: mapListingCondition(r.condition),
          sellerId: r.seller_id,
          sellerName: r.seller_display_name || "DISbook user",
          sellerRating: Number(r.seller_rating ?? 0),
          sellerCompletedExchanges: Number(r.seller_completed_exchanges ?? 0),
          notes: r.notes ?? null,
          images: Array.isArray(r.images) ? r.images : [],
          subject: r.subject ?? null,
          classYear: r.class_year ?? null,
          isbn: r.isbn ?? null,
          title: r.title ?? null,
          createdAt: r.created_at ?? null,
          status: r.status ?? null,
        };
        (grouped[r.book_id] ||= []).push(listing);
      }
      if (!cancelled) setLiveListings(grouped);
    })();
    return () => { cancelled = true; };
  }, [allBooks, user]);

  // For MYP, split into core and foreign language sections
  const isMYP = selectedProgram === "MYP";
  const coreBooks = isMYP
    ? allBooks.filter((b) => !FOREIGN_LANGUAGE_SUBJECTS.includes(b.subject))
    : allBooks;
  const foreignLangBooks = isMYP
    ? allBooks.filter((b) => FOREIGN_LANGUAGE_SUBJECTS.includes(b.subject))
    : [];

  const stats = {
    total: allBooks.length,
    available: allBooks.filter(
      (b) =>
        b.availableFromPreviousYear && (liveListings[b.id]?.length ?? 0) > 0
    ).length,
  };

  const renderBookList = (books: OfficialBook[]) => (
    <div className="space-y-3">
      {books.map((book) => (
        <BookListItem
          key={book.id}
          book={book}
          listings={liveListings[book.id] || []}
          onViewListings={setSelectedBook}
        />
      ))}
    </div>
  );


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

      {/* Last-year list notice */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        <strong>Used books available from last year's list ({LAST_SCHOOL_YEAR}).</strong>{" "}
        {NEW_SCHOOL_YEAR_AVAILABLE
          ? null
          : "The new school year book list is coming soon — until then, please verify required titles against the school's official list before purchasing."}
      </div>

      {/* Buy-new (Amazon) coming-soon notice */}
      <BuyNewNotice />

      {/* Book list - split into sections for MYP */}
      {isMYP ? (
        <>
          {/* Core books section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-semibold text-foreground">
                {t.browse.coreBooks}
              </h3>
              <Badge variant="outline" className="text-xs">{coreBooks.length}</Badge>
            </div>
            {renderBookList(coreBooks)}
          </div>

          {/* Foreign language section */}
          {foreignLangBooks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Languages className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {t.browse.foreignLanguageBooks}
                  {selectedLanguages?.foreignLanguage && (
                    <span className="ml-2 text-muted-foreground font-normal">
                      — {selectedLanguages.foreignLanguage}
                    </span>
                  )}
                </h3>
                <Badge variant="outline" className="text-xs">{foreignLangBooks.length}</Badge>
              </div>
              {renderBookList(foreignLangBooks)}
            </div>
          )}
        </>
      ) : (
        renderBookList(allBooks)
      )}

      {/* Summer Reading Section */}
      <SummerReadingSection
        selectedGrade={selectedGrade}
        selectedProgram={selectedProgram}
      />

      {/* Listings modal */}
      {selectedBook && (
        <ListingsModal
          book={selectedBook}
          listings={liveListings[selectedBook.id] || []}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
};
