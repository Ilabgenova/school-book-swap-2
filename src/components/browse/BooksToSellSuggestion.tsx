import { useLanguage } from "@/i18n/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Tag, Lock, ArrowRight } from "lucide-react";
import { getSellableBooks, getBooksToKeep, getReuseTarget, OfficialBook, NEW_SCHOOL_YEAR } from "@/data/officialBooks";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface BooksToSellSuggestionProps {
  previousGrade: string;
  previousProgram: string;
  newGrade?: string;
}

export const BooksToSellSuggestion = ({
  previousGrade,
  previousProgram,
  newGrade,
}: BooksToSellSuggestionProps) => {
  const { t } = useLanguage();

  const sellableBooks = getSellableBooks(previousGrade, previousProgram, newGrade);
  const booksToKeep = getBooksToKeep(previousGrade, previousProgram, newGrade);

  if (sellableBooks.length === 0 && booksToKeep.length === 0) {
    return (
      <Card className="mt-6 border-primary/20">
        <CardContent className="py-4 text-sm text-muted-foreground">
          DISbook did not find reusable books from your previous class/year in the {NEW_SCHOOL_YEAR} list.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Tag className="h-5 w-5 text-primary" />
          Books you may be able to list
        </CardTitle>
        <CardDescription>
          Based on the new {NEW_SCHOOL_YEAR} book reference list (column M — “Purchasable from former families”),
          these titles from your previous class may be useful to families next year. If you still have them,
          you can list them for sale, donation or exchange.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sellableBooks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Reusable in {NEW_SCHOOL_YEAR} ({sellableBooks.length})
            </h4>
            <div className="space-y-2">
              {sellableBooks.slice(0, 8).map((book) => (
                <SellableBookItem key={book.id} book={book} />
              ))}
              {sellableBooks.length > 8 && (
                <p className="text-sm text-muted-foreground">
                  + {sellableBooks.length - 8} more books…
                </p>
              )}
            </div>
          </div>
        )}

        {booksToKeep.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-amber-600 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Keep for your new class ({booksToKeep.length})
            </h4>
            <div className="space-y-2">
              {booksToKeep.slice(0, 5).map((book) => (
                <KeepBookItem key={book.id} book={book} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const SellableBookItem = ({ book }: { book: OfficialBook }) => {
  const target = getReuseTarget(book);
  const params = new URLSearchParams({
    grade: book.grade,
    bookId: book.id,
  });
  return (
    <div className="p-3 rounded-lg border border-border bg-card/50 flex items-center justify-between gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate">{book.title}</p>
        <p className="text-xs text-muted-foreground">
          {book.subject}
          {target && target.grade !== book.grade && (
            <> · reused in <span className="font-medium">{target.grade}</span></>
          )}
        </p>
      </div>
      <Button asChild size="sm" variant="outline" className="shrink-0">
        <Link to={`/sell?${params.toString()}`}>
          List <ArrowRight className="h-3 w-3 ml-1" />
        </Link>
      </Button>
    </div>
  );
};

const KeepBookItem = ({ book }: { book: OfficialBook }) => (
  <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/50 flex items-center justify-between gap-3">
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-foreground truncate">{book.title}</p>
      <p className="text-xs text-muted-foreground">{book.subject}</p>
    </div>
    <Badge variant="outline" className="shrink-0 border-amber-300 text-amber-700 bg-amber-100">
      <Lock className="h-3 w-3 mr-1" />
      Keep
    </Badge>
  </div>
);
