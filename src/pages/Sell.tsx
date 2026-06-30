import { useState, FormEvent, useMemo, ChangeEvent, useEffect } from "react";
import { Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Loader2, BookPlus, ArrowLeft, Camera, X, AlertTriangle, ShieldAlert, GraduationCap, ChevronRight, BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";
import { officialBooks, isSellableItem, LAST_SCHOOL_YEAR } from "@/data/officialBooks";
import { BookCover } from "@/components/book/BookCover";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const grades = {
  MYP: ["MYP 1", "MYP 2", "MYP 3", "MYP 4", "MYP 5"],
  DP: ["DP 1", "DP 2"],
};


type ListingType = "sale" | "exchange" | "donation";
type Condition = "new" | "like_new" | "good" | "fair" | "poor";
type PhotoSlot = "front" | "inside" | "back" | "extra1" | "extra2";
type SellStep = "grade" | "book" | "details";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

type PhotoState = { file: File; preview: string } | null;

const getProgramFromGrade = (grade: string) => {
  if (grade.startsWith("MYP")) return "MYP";
  if (grade.startsWith("DP")) return "DP";
  return "";
};

const getListingTypeFromParam = (type: string | null): ListingType => {
  if (type === "donation" || type === "donate") return "donation";
  if (type === "exchange") return "exchange";
  return "sale";
};

const stepItems = [
  "Choose class",
  "Select book",
  "Add condition and photos",
  "Publish listing",
];

const SellProgress = ({ step, submitting }: { step: SellStep; submitting: boolean }) => {
  const activeIndex = submitting ? 3 : step === "grade" ? 0 : step === "book" ? 1 : 2;

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {stepItems.map((item, index) => {
        const isComplete = index < activeIndex;
        const isActive = index === activeIndex;

        return (
          <div
            key={item}
            className={cn(
              "flex min-h-16 items-center gap-2 rounded-lg border p-3 text-xs transition",
              isActive
                ? "border-primary bg-primary/10 text-foreground"
                : isComplete
                ? "border-accent/40 bg-accent/10 text-foreground"
                : "border-border bg-muted/30 text-muted-foreground"
            )}
          >
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                isComplete || isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {isComplete ? <CheckCircle2 className="h-3.5 w-3.5" /> : index + 1}
            </span>
            <span className="font-medium leading-tight">{item}</span>
          </div>
        );
      })}
    </div>
  );
};

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
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialGrade = searchParams.get("grade") ?? "";
  const initialBookId = searchParams.get("bookId") ?? "";
  const [step, setStep] = useState<SellStep>(() =>
    initialBookId ? "details" : initialGrade ? "book" : "grade"
  );
  const [grade, setGrade] = useState(initialGrade);
  const [bookId, setBookId] = useState(initialBookId);
  const [listingType, setListingType] = useState<ListingType>(() =>
    getListingTypeFromParam(searchParams.get("type"))
  );
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
  const selectedProgram = useMemo(() => getProgramFromGrade(grade), [grade]);

  const photosValid = !!front && !!inside;
  const canSubmit = !!selectedBook && photosValid && !submitting;

  useEffect(() => {
    if (bookId && !selectedBook) {
      setBookId("");
      setStep(grade ? "book" : "grade");
    }
  }, [bookId, grade, selectedBook]);

  if (authLoading) {
    return (
      <MainLayout>
        <div className="container py-16 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }
  if (!user) {
    const nextPath = `${location.pathname}${location.search || "?intent=sell&mode=sell"}`;
    return <Navigate to={`/login?next=${encodeURIComponent(nextPath)}`} replace />;
  }

  const updateSellParams = (next: { grade?: string; bookId?: string; type?: ListingType }) => {
    const params = new URLSearchParams(searchParams);
    params.set("intent", "sell");
    params.set("mode", "sell");
    if (next.grade !== undefined) {
      if (next.grade) params.set("grade", next.grade);
      else params.delete("grade");
    }
    if (next.bookId !== undefined) {
      if (next.bookId) params.set("bookId", next.bookId);
      else params.delete("bookId");
    }
    if (next.type !== undefined) params.set("type", next.type);
    setSearchParams(params, { replace: true });
  };

  const handleSelectGrade = (nextGrade: string) => {
    setGrade(nextGrade);
    setBookId("");
    setStep("book");
    updateSellParams({ grade: nextGrade, bookId: "" });
  };

  const handleSelectBook = (nextBookId: string) => {
    setBookId(nextBookId);
    setStep("details");
    updateSellParams({ bookId: nextBookId });
  };

  const handleListingTypeChange = (value: ListingType) => {
    setListingType(value);
    updateSellParams({ type: value });
  };

  const handleBack = () => {
    if (step === "details") {
      setStep("book");
      return;
    }
    if (step === "book") {
      setStep("grade");
      setBookId("");
      updateSellParams({ grade: "", bookId: "" });
      return;
    }
    navigate(-1);
  };

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
        <Button variant="ghost" size="sm" onClick={handleBack} className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <BookPlus className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Create your listing</h1>
            <p className="text-sm text-muted-foreground">
              Choose the class, select the book, then add condition details and photos.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <SellProgress step={step} submitting={submitting} />
        </div>

        {step === "grade" && (
          <section className="space-y-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="text-center">
              <GraduationCap className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h2 className="font-display text-2xl font-bold text-foreground">
                Choose the class/year of the book you want to list
              </h2>
              <p className="mt-2 text-muted-foreground">
                This starts the selling flow and will not show available listings to buy.
              </p>
            </div>

            <div className="space-y-6">
              {Object.entries(grades).map(([program, programGrades]) => (
                <div key={program} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={program.toLowerCase() as "myp" | "dp"}>{program}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {program === "MYP" ? "Middle Years Programme" : "Diploma Programme"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                    {programGrades.map((item) => (
                      <Button
                        key={item}
                        type="button"
                        variant="outline"
                        className="h-auto justify-between py-3 group hover:border-primary hover:bg-primary/5"
                        onClick={() => handleSelectGrade(item)}
                      >
                        <span className="font-medium">{item}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {step === "book" && grade && (
          <section className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  {selectedProgram && (
                    <Badge variant={selectedProgram.toLowerCase() as "myp" | "dp"}>{selectedProgram}</Badge>
                  )}
                  <span className="font-display text-xl font-bold text-foreground">{grade}</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Select the book you want to sell, donate or exchange
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Choose one book from the reference list for this class/year to create a listing.
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => setStep("grade")}>
                Change class
              </Button>
            </div>

            <div className="space-y-3">
              {booksForGrade.length > 0 ? (
                booksForGrade.map((book) => (
                  <button
                    key={book.id}
                    type="button"
                    onClick={() => handleSelectBook(book.id)}
                    className="flex w-full items-start gap-3 rounded-xl border border-border bg-background p-4 text-left transition hover:border-primary hover:bg-primary/5"
                  >
                    <BookCover
                      isbn={book.isbn}
                      title={book.title}
                      className="h-16 w-12"
                      iconClassName="h-5 w-5"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-foreground">{book.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {book.subject}{book.publisher ? ` • ${book.publisher}` : ""}
                      </p>
                      {book.isbn && <p className="mt-0.5 text-xs text-muted-foreground">ISBN: {book.isbn}</p>}
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                  </button>
                ))
              ) : (
                <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                  No books found for this class/year.
                </div>
              )}
            </div>
          </section>
        )}

        {step === "details" && selectedBook && (
          <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex gap-4 rounded-xl border border-border bg-muted/30 p-4">
              <BookCover
                isbn={selectedBook.isbn}
                title={selectedBook.title}
                className="h-24 w-16"
                iconClassName="h-6 w-6"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Create your listing</p>
                <h2 className="mt-1 font-display text-xl font-bold text-foreground">{selectedBook.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedBook.grade} • {selectedBook.subject}{selectedBook.isbn ? ` • ISBN: ${selectedBook.isbn}` : ""}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Listing type</Label>
                <Select value={listingType} onValueChange={(v) => handleListingTypeChange(v as ListingType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">Sell</SelectItem>
                    <SelectItem value="exchange">Exchange</SelectItem>
                    <SelectItem value="donation">Donate</SelectItem>
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
            <div className="space-y-3 border-t border-border pt-2">
              <div>
                <Label className="font-display text-base">Book photos</Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  To help other DIS families understand the real condition of the book, please upload clear photos of the front cover and inside pages.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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

              <div className="flex gap-2 rounded-lg border border-border bg-muted/50 p-3 text-xs text-muted-foreground">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <p>
                  Please do not upload photos containing children, personal information or private documents.
                  Accepted formats: JPG, PNG, WEBP · Max 5 MB per image.
                </p>
              </div>

              {!photosValid && (
                <div className="flex gap-2 rounded-lg border border-amber-300/60 bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
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
              DISbook is an independent student-created project and is not the official DIS app. Always check the official DIS book list before finalising your purchase.
            </p>
          </form>
        )}
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
