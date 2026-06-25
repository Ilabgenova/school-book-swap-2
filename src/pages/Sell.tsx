import { useState, FormEvent, useMemo, ChangeEvent, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { LanguageProvider } from "@/i18n/LanguageContext";
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
import { Loader2, BookPlus, ArrowLeft, Camera, X, AlertTriangle, ShieldAlert } from "lucide-react";
import { officialBooks } from "@/data/officialBooks";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const grades = [
  "PYP 1","PYP 2","PYP 3","PYP 4","PYP 5",
  "MYP 1","MYP 2","MYP 3","MYP 4","MYP 5",
  "DP 1","DP 2",
];

type ListingType = "sale" | "exchange" | "donation";
type Condition = "new" | "like_new" | "good" | "fair" | "poor";
type PhotoSlot = "front" | "inside" | "back" | "extra1" | "extra2";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

type PhotoState = { file: File; preview: string } | null;

interface PhotoUploadProps {
  label: string;
  hint?: string;
  required?: boolean;
  value: PhotoState;
  onChange: (next: PhotoState) => void;
}

const PhotoUpload = ({ label, hint, required, value, onChange }: PhotoUploadProps) => {
  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!ACCEPTED.includes(f.type)) {
      toast.error("Only JPG, PNG or WEBP images are allowed");
      return;
    }
    if (f.size > MAX_BYTES) {
      toast.error("Image must be 5 MB or smaller");
      return;
    }
    onChange({ file: f, preview: URL.createObjectURL(f) });
  };

  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <label
        className={cn(
          "relative flex aspect-[3/4] cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-muted/30 transition hover:bg-muted/50",
          value ? "border-primary/40" : required ? "border-border" : "border-border/60"
        )}
      >
        {value ? (
          <>
            <img src={value.preview} alt={label} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); URL.revokeObjectURL(value.preview); onChange(null); }}
              className="absolute right-1.5 top-1.5 rounded-full bg-background/90 p-1 shadow-md hover:bg-background"
              aria-label="Remove photo"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1.5 p-2 text-center">
            <Camera className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Tap to add</span>
          </div>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          className="hidden"
          onChange={handleFile}
        />
      </label>
    </div>
  );
};

const SellContent = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [grade, setGrade] = useState("");
  const [bookId, setBookId] = useState("");
  const [listingType, setListingType] = useState<ListingType>("sale");
  const [condition, setCondition] = useState<Condition>("good");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [front, setFront] = useState<PhotoState>(null);
  const [inside, setInside] = useState<PhotoState>(null);
  const [back, setBack] = useState<PhotoState>(null);
  const [extra1, setExtra1] = useState<PhotoState>(null);
  const [extra2, setExtra2] = useState<PhotoState>(null);

  const booksForGrade = useMemo(
    () => officialBooks.filter((b) => b.grade === grade),
    [grade]
  );
  const selectedBook = useMemo(
    () => officialBooks.find((b) => b.id === bookId) || null,
    [bookId]
  );

  const photosValid = !!front && !!inside;
  const canSubmit = !!selectedBook && photosValid && !submitting;

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

  const uploadPhoto = async (slot: PhotoSlot, file: File, listingId: string) => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/${listingId}/${slot}.${ext}`;
    const { error } = await supabase.storage
      .from("listing-photos")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (error) throw error;
    // 1-year signed URL so it can be rendered without an extra fetch per view
    const { data, error: signErr } = await supabase.storage
      .from("listing-photos")
      .createSignedUrl(path, 60 * 60 * 24 * 365);
    if (signErr) throw signErr;
    return data.signedUrl;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedBook) { toast.error("Please select a book"); return; }
    if (!photosValid) {
      toast.error("Please upload at least a front cover photo and one inside photo before publishing your listing.");
      return;
    }
    const priceValue = listingType === "sale" ? parseFloat(price) : 0;
    if (listingType === "sale" && (isNaN(priceValue) || priceValue < 0)) {
      toast.error("Please enter a valid price");
      return;
    }

    setSubmitting(true);
    try {
      const listingId = crypto.randomUUID();
      const slots: [PhotoSlot, PhotoState][] = [
        ["front", front], ["inside", inside], ["back", back],
        ["extra1", extra1], ["extra2", extra2],
      ];
      const urls: string[] = [];
      for (const [slot, ps] of slots) {
        if (ps) urls.push(await uploadPhoto(slot, ps.file, listingId));
      }

      const { error } = await supabase.from("listings").insert([{
        id: listingId,
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
        images: urls,
        status: "pending_review",
      }]);
      if (error) throw error;
      toast.success("Listing submitted for review!");
      navigate("/browse");
    } catch (err: any) {
      toast.error(err.message || "Could not publish listing");
    } finally {
      setSubmitting(false);
    }
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
              Pick a book from the DIS book list reference to publish your listing.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="space-y-2">
            <Label>Grade</Label>
            <Select value={grade} onValueChange={(v) => { setGrade(v); setBookId(""); }}>
              <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
              <SelectContent>
                {grades.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
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
                  <SelectItem key={b.id} value={b.id}>{b.title} — {b.subject}</SelectItem>
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
              <Input id="price" type="number" min="0" step="0.50" placeholder="0.00"
                value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
          )}

          {/* Photos */}
          <div className="space-y-3 pt-2 border-t border-border">
            <div>
              <Label className="text-base font-display">Book photos</Label>
              <p className="text-sm text-muted-foreground mt-1">
                To help other DIS families understand the real condition of the book, please upload clear photos of the front cover and inside pages.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <PhotoUpload label="Front cover" required value={front} onChange={setFront} />
              <PhotoUpload
                label="Inside pages"
                required
                hint="Show writing, marks, page condition"
                value={inside}
                onChange={setInside}
              />
              <PhotoUpload label="Back cover" value={back} onChange={setBack} />
              <PhotoUpload label="Extra photo" value={extra1} onChange={setExtra1} />
              <PhotoUpload label="Extra photo" value={extra2} onChange={setExtra2} />
            </div>

            <div className="flex gap-2 rounded-lg bg-muted/50 border border-border p-3 text-xs text-muted-foreground">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
              <p>
                Please do not upload photos containing children, personal information or private documents.
                Accepted formats: JPG, PNG, WEBP · Max 5 MB per image.
              </p>
            </div>

            {!photosValid && (
              <div className="flex gap-2 rounded-lg border border-amber-300/60 bg-amber-50 dark:bg-amber-950/30 p-3 text-xs text-amber-900 dark:text-amber-200">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>Front cover and inside photo are required before you can publish.</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" placeholder="Anything the buyer should know (highlighting, missing pages, etc.)"
              value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={!canSubmit}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publish listing"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            New listings are reviewed by the DIS team before going live.
          </p>
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
