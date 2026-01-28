import { useLanguage } from "@/i18n/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Tag, Lock, ExternalLink } from "lucide-react";
import { getSellableBooks, getBooksToKeep, OfficialBook } from "@/data/officialBooks";
import { Button } from "@/components/ui/button";

interface BooksToSellSuggestionProps {
  previousGrade: string;
  previousProgram: string;
}

export const BooksToSellSuggestion = ({
  previousGrade,
  previousProgram,
}: BooksToSellSuggestionProps) => {
  const { t } = useLanguage();
  
  const sellableBooks = getSellableBooks(previousGrade, previousProgram);
  const booksToKeep = getBooksToKeep(previousGrade, previousProgram);

  if (sellableBooks.length === 0 && booksToKeep.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Tag className="h-5 w-5 text-primary" />
          {t.browse.booksToSell}
        </CardTitle>
        <CardDescription>
          {t.browse.booksToSellDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sellable Books */}
        {sellableBooks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              You can sell ({sellableBooks.length})
            </h4>
            <div className="space-y-2">
              {sellableBooks.slice(0, 5).map((book) => (
                <SellableBookItem key={book.id} book={book} />
              ))}
              {sellableBooks.length > 5 && (
                <p className="text-sm text-muted-foreground">
                  + {sellableBooks.length - 5} more books...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Books to Keep */}
        {booksToKeep.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-amber-600 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              {t.browse.keepForNextYear} ({booksToKeep.length})
            </h4>
            <div className="space-y-2">
              {booksToKeep.slice(0, 3).map((book) => (
                <KeepBookItem key={book.id} book={book} />
              ))}
              {booksToKeep.length > 3 && (
                <p className="text-sm text-muted-foreground">
                  + {booksToKeep.length - 3} more books to keep...
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const SellableBookItem = ({ book }: { book: OfficialBook }) => {
  const { t } = useLanguage();
  
  return (
    <div className="p-3 rounded-lg border border-border bg-card/50 flex items-center justify-between gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate">{book.title}</p>
        <p className="text-xs text-muted-foreground">{book.subject}</p>
      </div>
      <Badge variant="sale" className="shrink-0">
        <Tag className="h-3 w-3 mr-1" />
        Sell
      </Badge>
    </div>
  );
};

const KeepBookItem = ({ book }: { book: OfficialBook }) => {
  const { t } = useLanguage();
  
  return (
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
};
