import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookCover } from "@/components/book/BookCover";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { officialBooks } from "@/data/officialBooks";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen,
  Heart,
  ShoppingBag,
  Loader2,
  Plus,
  Archive,
  Trash2,
  ExternalLink,
} from "lucide-react";

type ListingRow = {
  id: string;
  title: string;
  isbn: string | null;
  subject: string | null;
  program: string | null;
  class_year: string | null;
  price: number;
  status: string;
  listing_type: string;
  condition: string;
  created_at: string;
};

type WantedRow = {
  id: string;
  book_id: string;
  title: string;
  isbn: string | null;
  subject: string | null;
  program: string | null;
  class_year: string | null;
  created_at: string;
};

type BoughtRow = {
  id: string;
  book_id: string | null;
  listing_id: string | null;
  seller_name: string | null;
  title: string;
  isbn: string | null;
  subject: string | null;
  program: string | null;
  class_year: string | null;
  acquisition_type: string;
  price_paid: number | null;
  date_bought: string;
  notes: string | null;
  status: string;
  source: string;
};

const statusVariant = (s: string): "default" | "secondary" | "outline" => {
  if (s === "completed") return "default";
  if (s === "archived") return "outline";
  return "secondary";
};

const MyBooksContent = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") ?? "listed";

  const [tab, setTab] = useState(initialTab);
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [wanted, setWanted] = useState<WantedRow[]>([]);
  const [bought, setBought] = useState<BoughtRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);

  // Manual add form state
  const [formBookId, setFormBookId] = useState<string>("");
  const [formSeller, setFormSeller] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10));
  const [formNotes, setFormNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login?next=/my-books");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    setSearchParams({ tab }, { replace: true });
  }, [tab, setSearchParams]);

  const loadAll = async () => {
    if (!user) return;
    setLoading(true);
    const [listingsRes, wantedRes, boughtRes] = await Promise.all([
      supabase
        .from("listings")
        .select("id,title,isbn,subject,program,class_year,price,status,listing_type,condition,created_at")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("wanted_books")
        .select("id,book_id,title,isbn,subject,program,class_year,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("bought_books")
        .select(
          "id,book_id,listing_id,seller_name,title,isbn,subject,program,class_year,acquisition_type,price_paid,date_bought,notes,status,source",
        )
        .eq("user_id", user.id)
        .order("date_bought", { ascending: false }),
    ]);

    if (listingsRes.data) setListings(listingsRes.data as ListingRow[]);
    if (wantedRes.data) setWanted(wantedRes.data as WantedRow[]);
    if (boughtRes.data) setBought(boughtRes.data as BoughtRow[]);
    setLoading(false);
  };

  useEffect(() => {
    if (user) loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const selectableBooks = useMemo(
    () =>
      officialBooks
        .slice()
        .sort((a, b) => a.title.localeCompare(b.title)),
    [],
  );

  const handleAddBought = async () => {
    if (!user || !formBookId) return;
    const book = officialBooks.find((b) => b.id === formBookId);
    if (!book) return;
    setSubmitting(true);
    const { error } = await supabase.from("bought_books").insert({
      user_id: user.id,
      book_id: book.id,
      title: book.title,
      isbn: book.isbn ?? null,
      subject: book.subject ?? null,
      program: book.program ?? null,
      class_year: book.grade ?? null,
      seller_name: formSeller || null,
      price_paid: formPrice ? Number(formPrice) : null,
      date_bought: formDate,
      notes: formNotes || null,
      acquisition_type: "bought",
      status: "completed",
      source: "manual",
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Could not save", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Added to Books Bought" });
    setAddOpen(false);
    setFormBookId("");
    setFormSeller("");
    setFormPrice("");
    setFormNotes("");
    setFormDate(new Date().toISOString().slice(0, 10));
    loadAll();
  };

  const archiveBought = async (id: string) => {
    await supabase.from("bought_books").update({ status: "archived" }).eq("id", id);
    loadAll();
  };

  const removeBought = async (id: string) => {
    await supabase.from("bought_books").delete().eq("id", id);
    loadAll();
  };

  const removeWanted = async (id: string) => {
    await supabase.from("wanted_books").delete().eq("id", id);
    loadAll();
  };

  const archiveListing = async (id: string) => {
    await supabase.from("listings").update({ status: "archived" }).eq("id", id);
    loadAll();
  };

  const deleteListing = async (id: string) => {
    if (!confirm("Delete this listing permanently? This cannot be undone.")) return;
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (error) {
      toast({ title: "Could not delete", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Listing deleted" });
    loadAll();
  };


  if (authLoading || !user) {
    return (
      <MainLayout>
        <div className="container py-20 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-4xl py-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold">My Books</h1>
          <p className="text-sm text-muted-foreground">
            Manage the books you listed, the books you are looking for, and the books you bought
            through DISbook.
          </p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="listed" className="gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Listed</span>
              <span className="sm:hidden">Listed</span>
              <Badge variant="secondary" className="ml-1">{listings.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="wanted" className="gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Looking For</span>
              <span className="sm:hidden">Wanted</span>
              <Badge variant="secondary" className="ml-1">{wanted.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="bought" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span>Bought</span>
              <Badge variant="secondary" className="ml-1">{bought.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* LISTED */}
          <TabsContent value="listed" className="mt-6">
            {loading ? (
              <Loader2 className="mx-auto my-12 h-6 w-6 animate-spin text-primary" />
            ) : listings.length === 0 ? (
              <EmptyState
                icon={<BookOpen className="h-8 w-8 opacity-50" />}
                text="You have not listed any books yet."
                cta={{ label: "List a book", href: "/sell?intent=sell&mode=sell" }}
              />
            ) : (
              <div className="space-y-3">
                {listings.map((l) => (
                  <Card
                    key={l.id}
                    isbn={l.isbn}
                    title={l.title}
                    subject={l.subject}
                    program={l.program}
                    classYear={l.class_year}
                    badges={[
                      <Badge key="t" variant="outline">{l.listing_type}</Badge>,
                      <Badge key="s" variant={statusVariant(l.status)}>{statusLabel(l.status)}</Badge>,

                    ]}
                    meta={
                      <>
                        {l.condition} · €{Number(l.price).toFixed(2)}
                      </>
                    }
                    actions={
                      <>
                        {l.status !== "archived" && (
                          <Button variant="ghost" size="sm" onClick={() => archiveListing(l.id)}>
                            <Archive className="h-3.5 w-3.5" />
                            Archive
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteListing(l.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </Button>
                      </>
                    }

                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* WANTED */}
          <TabsContent value="wanted" className="mt-6">
            {loading ? (
              <Loader2 className="mx-auto my-12 h-6 w-6 animate-spin text-primary" />
            ) : wanted.length === 0 ? (
              <EmptyState
                icon={<Heart className="h-8 w-8 opacity-50" />}
                text="You have not added any books to your wanted list yet."
                cta={{ label: "Browse books", href: "/browse" }}
              />
            ) : (
              <div className="space-y-3">
                {wanted.map((w) => (
                  <Card
                    key={w.id}
                    isbn={w.isbn}
                    title={w.title}
                    subject={w.subject}
                    program={w.program}
                    classYear={w.class_year}
                    badges={[<Badge key="w" variant="secondary">Looking for</Badge>]}
                    actions={
                      <Button variant="ghost" size="sm" onClick={() => removeWanted(w.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </Button>
                    }
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* BOUGHT */}
          <TabsContent value="bought" className="mt-6">
            <div className="mb-4 flex justify-end">
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1">
                    <Plus className="h-4 w-4" /> Add Bought Book Manually
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add a bought book</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div>
                      <Label>Book</Label>
                      <Select value={formBookId} onValueChange={setFormBookId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a book" />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                          {selectableBooks.map((b) => (
                            <SelectItem key={b.id} value={b.id}>
                              {b.grade} · {b.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Seller name (optional)</Label>
                      <Input value={formSeller} onChange={(e) => setFormSeller(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Price paid (€)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formPrice}
                          onChange={(e) => setFormPrice(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Date bought</Label>
                        <Input
                          type="date"
                          value={formDate}
                          onChange={(e) => setFormDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Notes (optional)</Label>
                      <Textarea
                        rows={2}
                        value={formNotes}
                        onChange={(e) => setFormNotes(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddBought} disabled={!formBookId || submitting}>
                      {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <Loader2 className="mx-auto my-12 h-6 w-6 animate-spin text-primary" />
            ) : bought.length === 0 ? (
              <EmptyState
                icon={<ShoppingBag className="h-8 w-8 opacity-50" />}
                text="You have not marked any books as bought yet."
                cta={{ label: "Browse Books", href: "/browse" }}
              />
            ) : (
              <div className="space-y-3">
                {bought.map((b) => (
                  <Card
                    key={b.id}
                    isbn={b.isbn}
                    title={b.title}
                    subject={b.subject}
                    program={b.program}
                    classYear={b.class_year}
                    badges={[
                      <Badge key="a" variant="outline" className="capitalize">{b.acquisition_type}</Badge>,
                      <Badge key="s" variant={statusVariant(b.status)} className="capitalize">{b.status}</Badge>,
                    ]}
                    meta={
                      <>
                        {b.seller_name ? `From ${b.seller_name} · ` : ""}
                        {b.price_paid != null ? `€${Number(b.price_paid).toFixed(2)} · ` : ""}
                        {new Date(b.date_bought).toLocaleDateString()}
                        {b.notes ? ` · ${b.notes}` : ""}
                      </>
                    }
                    actions={
                      <>
                        {b.listing_id && (
                          <Link to={`/browse?listing=${b.listing_id}`}>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-3.5 w-3.5" /> Listing
                            </Button>
                          </Link>
                        )}
                        {b.status !== "archived" && (
                          <Button variant="ghost" size="sm" onClick={() => archiveBought(b.id)}>
                            <Archive className="h-3.5 w-3.5" /> Archive
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => removeBought(b.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    }
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

const EmptyState = ({
  icon,
  text,
  cta,
}: {
  icon: React.ReactNode;
  text: string;
  cta?: { label: string; href: string };
}) => (
  <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
    <div className="mx-auto mb-3 flex justify-center">{icon}</div>
    <p>{text}</p>
    {cta && (
      <Link to={cta.href} className="inline-block mt-4">
        <Button size="sm">{cta.label}</Button>
      </Link>
    )}
  </div>
);

const Card = ({
  isbn,
  title,
  subject,
  program,
  classYear,
  badges,
  meta,
  actions,
}: {
  isbn: string | null;
  title: string;
  subject: string | null;
  program: string | null;
  classYear: string | null;
  badges?: React.ReactNode[];
  meta?: React.ReactNode;
  actions?: React.ReactNode;
}) => (
  <div className="flex gap-4 rounded-xl border border-border bg-card p-4">
    <BookCover isbn={isbn ?? undefined} title={title} className="h-20 w-14" iconClassName="h-5 w-5" />
    <div className="min-w-0 flex-1">
      <div className="mb-1 flex flex-wrap items-center gap-2">
        {program && <Badge variant="outline">{program}</Badge>}
        {classYear && (
          <span className="text-xs font-medium text-muted-foreground">{classYear}</span>
        )}
        {badges}
      </div>
      <h3 className="font-medium text-foreground line-clamp-2">{title}</h3>
      <p className="mt-0.5 text-sm text-muted-foreground">
        {subject}
        {isbn ? ` • ISBN: ${isbn}` : ""}
      </p>
      {meta && <p className="mt-1 text-xs text-muted-foreground">{meta}</p>}
    </div>
    <div className="flex flex-col items-end gap-1">{actions}</div>
  </div>
);

const MyBooks = () => <MyBooksContent />;
export default MyBooks;
