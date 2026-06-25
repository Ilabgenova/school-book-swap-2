import { useState, FormEvent, useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { LanguageProvider, useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
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
import { Loader2, BookPlus, ArrowLeft } from "lucide-react";
import { officialBooks } from "@/data/officialBooks";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const grades = [
  "PYP 1","PYP 2","PYP 3","PYP 4","PYP 5",
  "MYP 1","MYP 2","MYP 3","MYP 4","MYP 5",
  "DP 1","DP 2",
];

type ListingType = "sale" | "exchange" | "donation";
type Condition = "new" | "like_new" | "good" | "fair" | "poor";

const SellContent = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [grade, setGrade] = useState("");
  const [bookId, setBookId] = useState("");
  const [listingType, setListingType] = useState<ListingType>("sale");
  const [condition, setCondition] = useState<Condition>("used");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const booksForGrade = useMemo(
    () => officialBooks.filter((b) => b.grade === grade),
    [grade]
  );

  const selectedBook = useMemo(
    () => officialBooks.find((b) => b.id === bookId) || null,
    [bookId]
  );

  if (authLoading) {
    return (
      <MainLayout>
        <div className="container py-16 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedBook) {
      toast.error("Please select a book");
      return;
    }
    const priceValue = listingType === "sale" ? parseFloat(price) : 0;
    if (listingType === "sale" && (isNaN(priceValue) || priceValue < 0)) {
      toast.error("Please enter a valid price");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("listings").insert([{
      seller_id: user.id,
      title: selectedBook.title,
      book_id: selectedBook.id,
      isbn: selectedBook.isbn ?? null,
      subject: selectedBook.subject,
      program: selectedBook.program,
      class_year: selectedBook.grade,
      condition,
      listing_type: listingType,
      price: priceValue,
      notes: notes || null,
      status: "active",
    }]);
    setSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Listing published!");
    navigate("/browse");
  };

  return (
    <MainLayout>
      <div className="container py-8 max-w-2xl">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <BookPlus className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Sell or Donate a Book</h1>
            <p className="text-sm text-muted-foreground">
              Pick a book from the official school list to publish your listing.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-card rounded-2xl border border-border p-6 shadow-sm"
        >
          <div className="space-y-2">
            <Label>Grade</Label>
            <Select value={grade} onValueChange={(v) => { setGrade(v); setBookId(""); }}>
              <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
              <SelectContent>
                {grades.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Book</Label>
            <Select value={bookId} onValueChange={setBookId} disabled={!grade}>
              <SelectTrigger>
                <SelectValue placeholder={grade ? "Select a book" : "Choose grade first"} />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {booksForGrade.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.title} — {b.subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedBook?.isbn && (
              <p className="text-xs text-muted-foreground">ISBN: {selectedBook.isbn}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Listing type</Label>
              <Select value={listingType} onValueChange={(v) => setListingType(v as ListingType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="exchange">Exchange</SelectItem>
                  <SelectItem value="donation">Donation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Condition</Label>
              <Select value={condition} onValueChange={(v) => setCondition(v as Condition)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="like_new">Like new</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {listingType === "sale" && (
            <div className="space-y-2">
              <Label htmlFor="price">Price (€)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.50"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Anything the buyer should know (highlighting, missing pages, etc.)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={submitting || !selectedBook}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publish listing"}
          </Button>
        </form>
      </div>
    </MainLayout>
  );
};

const Sell = () => (
  <LanguageProvider>
    <SellContent />
  </LanguageProvider>
);

export default Sell;
