import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Loader2, BookPlus, Users } from "lucide-react";
import { BookCover } from "@/components/book/BookCover";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface AggregatedWanted {
  book_id: string;
  title: string;
  isbn: string | null;
  subject: string | null;
  program: string | null;
  class_year: string | null;
  requesters: number;
}

const WantedContent = () => {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<AggregatedWanted[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("wanted_books")
        .select("book_id,title,isbn,subject,program,class_year")
        .order("created_at", { ascending: false });
      if (!error && data) {
        const map = new Map<string, AggregatedWanted>();
        for (const row of data) {
          const existing = map.get(row.book_id);
          if (existing) existing.requesters += 1;
          else map.set(row.book_id, { ...row, requesters: 1 });
        }
        setItems(Array.from(map.values()));
      }
      setLoading(false);
    };
    load();
  }, [authLoading]);

  return (
    <MainLayout>
      <div className="container py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Wanted books</h1>
            <p className="text-sm text-muted-foreground">
              Books other DIS families are looking for. If you have one, list it for sale, exchange or donation.
            </p>
          </div>
        </div>

        {!user && (
          <div className="mb-4 rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
            <Link to="/login" className="text-primary underline">Sign in</Link> to add books to your wanted list.
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
            <Heart className="mx-auto mb-3 h-8 w-8 opacity-50" />
            <p>No wanted books yet.</p>
            <p className="mt-1 text-xs">When buyers mark a book as wanted, it shows up here for sellers.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.book_id}
                className="flex gap-4 rounded-xl border border-border bg-card p-4"
              >
                <BookCover
                  isbn={item.isbn ?? undefined}
                  title={item.title}
                  className="h-20 w-14"
                  iconClassName="h-5 w-5"
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    {item.program && (
                      <Badge variant={item.program.toLowerCase() as "myp" | "dp"}>{item.program}</Badge>
                    )}
                    {item.class_year && (
                      <span className="text-xs font-medium text-muted-foreground">{item.class_year}</span>
                    )}
                  </div>
                  <h3 className="font-medium text-foreground line-clamp-2">{item.title}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {item.subject}{item.isbn ? ` • ISBN: ${item.isbn}` : ""}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {item.requesters} {item.requesters === 1 ? "person wants this" : "people want this"}
                  </div>
                </div>
                <div className="flex items-start">
                  <Link to={`/sell?intent=sell&mode=sell&bookId=${encodeURIComponent(item.book_id)}${item.class_year ? `&grade=${encodeURIComponent(item.class_year)}` : ""}`}>
                    <Button size="sm" className="gap-1">
                      <BookPlus className="h-3 w-3" />
                      List this book
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

const Wanted = () => <WantedContent />;

export default Wanted;
