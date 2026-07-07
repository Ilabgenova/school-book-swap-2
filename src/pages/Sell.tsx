import { useState, FormEvent, useMemo, ChangeEvent, useEffect } from "react";
import { Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
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
import { Loader2, BookPlus, ArrowLeft, Camera, X, AlertTriangle, ShieldAlert, GraduationCap, ChevronRight, BookOpen, ArrowRight, CheckCircle2, Upload, Info, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { officialBooks, isSellableItem, LAST_SCHOOL_YEAR, GENERIC_MYP_GRADE } from "@/data/officialBooks";
import { BookCover } from "@/components/book/BookCover";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";

const grades = {
  MYP: ["MYP 1", "MYP 2", "MYP 3", "MYP 4", "MYP 5"],
  DP: ["DP 1", "DP 2"],
};


type ListingType = "sale" | "exchange" | "donation";
type Condition = "new" | "like_new" | "good" | "fair" | "poor";
type PhotoSlot = "front" | "inside" | "back" | "extra1" | "extra2";
type SellStep = "grade" | "book" | "details";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/heic", "image/heif"];
const ACCEPT_ATTR = "image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif";

type PhotoState = { file: File; preview: string } | null;

const getProgramFromGrade = (grade: string) => {
  if (grade === GENERIC_MYP_GRADE) return "MYP";
  if (grade.startsWith("MYP")) return "MYP";
  if (grade.startsWith("DP")) return "DP";
  return "";
};

const getListingTypeFromParam = (type: string | null): ListingType => {
  if (type === "donation" || type === "donate") return "donation";
  if (type === "exchange") return "exchange";
  return "sale";
};

const STEP_LABELS = {
  en: ["Choose class", "Select book", "Add condition and photos", "Publish listing"],
  it: ["Scegli la classe", "Seleziona il libro", "Aggiungi condizione e foto", "Pubblica annuncio"],
};

const SellProgress = ({ step, submitting, language }: { step: SellStep; submitting: boolean; language: "it" | "en" }) => {
  const activeIndex = submitting ? 3 : step === "grade" ? 0 : step === "book" ? 1 : 2;
  const stepItems = STEP_LABELS[language];

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
  warning?: string;
  required?: boolean;
  value: PhotoState;
  onChange: (next: PhotoState) => void;
  language: "it" | "en";
}

const isHeicLike = (f: File) => {
  const t = (f.type || "").toLowerCase();
  const n = f.name.toLowerCase();
  return t.includes("heic") || t.includes("heif") || n.endsWith(".heic") || n.endsWith(".heif");
};

const PhotoUpload = ({ label, hint, warning, required, value, onChange, language }: PhotoUploadProps) => {
  const isIT = language === "it";
  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (f.size > MAX_BYTES) {
      toast.error(isIT ? "L'immagine deve essere di 5 MB o meno" : "Image must be 5 MB or smaller");
      return;
    }
    const typeOk = ACCEPTED.includes((f.type || "").toLowerCase()) || isHeicLike(f);
    if (!typeOk) {
      toast.error(isIT ? "Carica immagini JPG, PNG o WEBP." : "Please upload JPG, PNG or WEBP images.");
      return;
    }
    if (isHeicLike(f)) {
      const img = new Image();
      img.onerror = () =>
        toast.message(
          isIT
            ? "Foto HEIC caricata. Potrebbe non vedersi in anteprima qui, ma gli admin la vedranno."
            : "HEIC photo uploaded. It may not preview here, but admins will see it."
        );
      try { img.src = URL.createObjectURL(f); } catch {}
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
      <div
        className={cn(
          "relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-muted/30",
          value ? "border-primary/40" : required ? "border-border" : "border-border/60"
        )}
      >
        {value ? (
          <>
            <img src={value.preview} alt={label} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => { URL.revokeObjectURL(value.preview); onChange(null); }}
              className="absolute right-1.5 top-1.5 rounded-full bg-background/90 p-1 shadow-md hover:bg-background"
              aria-label={isIT ? "Rimuovi foto" : "Remove photo"}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 p-3 text-center">
            <Camera className="h-6 w-6 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground">
              {isIT ? "Scatta una foto o caricane una" : "Take a new photo or upload one"}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-md border border-border bg-background px-2 py-1.5 text-xs font-medium hover:bg-muted">
          <Camera className="h-3.5 w-3.5" />
          {value ? (isIT ? "Rifai" : "Retake") : (isIT ? "Scatta foto" : "Take Photo")}
          <input
            type="file"
            accept={ACCEPT_ATTR}
            capture="environment"
            className="hidden"
            onChange={handleFile}
          />
        </label>
        <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-md border border-border bg-background px-2 py-1.5 text-xs font-medium hover:bg-muted">
          <Upload className="h-3.5 w-3.5" />
          {value ? (isIT ? "Sostituisci" : "Replace") : (isIT ? "Carica" : "Upload")}
          <input
            type="file"
            accept={ACCEPT_ATTR}
            className="hidden"
            onChange={handleFile}
          />
        </label>
      </div>

      {warning && <p className="text-[11px] text-muted-foreground">{warning}</p>}
    </div>
  );
};

const SellContent = () => {
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const isIT = language === "it";
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
    () => officialBooks.filter((b) => b.grade === grade).filter(isSellableItem),
    [grade]
  );
  const selectedBook = useMemo(
    () => officialBooks.find((b) => b.id === bookId) || null,
    [bookId]
  );
  const selectedProgram = useMemo(() => getProgramFromGrade(grade), [grade]);
  const isGenericMyp = grade === GENERIC_MYP_GRADE;

  // Generic MYP items (Keyboard, Sphero) only need one photo — inside pages
  // don't make sense for a physical device.
  const photosValid = isGenericMyp ? !!front : (!!front && !!inside);
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
    if (!selectedBook) { toast.error(isIT ? "Seleziona un libro" : "Please select a book"); return; }
    if (!photosValid) {
      toast.error(isIT
        ? (isGenericMyp
            ? "Carica almeno una foto dell'oggetto prima di pubblicare."
            : "Carica almeno una foto della copertina e una delle pagine interne prima di pubblicare.")
        : (isGenericMyp
            ? "Please upload at least one photo of the item before publishing."
            : "Please upload at least a front cover photo and one inside photo before publishing your listing."));
      return;
    }
    const priceValue = listingType === "sale" ? parseFloat(price) : 0;
    if (listingType === "sale" && (isNaN(priceValue) || priceValue < 0)) {
      toast.error(isIT ? "Inserisci un prezzo valido" : "Please enter a valid price");
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
        item_type: selectedBook.itemType ?? "book",
        condition,
        listing_type: listingType,
        price: priceValue,
        notes: notes || null,
        images: urls,
        status: "pending_review",
      }]);
      if (error) throw error;
      toast.success(isIT ? "Annuncio inviato per la revisione!" : "Listing submitted for review!");
      navigate("/browse");
    } catch (err: any) {
      toast.error(err.message || (isIT ? "Impossibile pubblicare l'annuncio" : "Could not publish listing"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container py-8 max-w-2xl">
        <Button variant="ghost" size="sm" onClick={handleBack} className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" /> {isIT ? "Indietro" : "Back"}
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <BookPlus className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">
              {isIT ? "Crea il tuo annuncio" : "Create your listing"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isIT
                ? "Scegli la classe, seleziona il libro, poi aggiungi condizione e foto."
                : "Choose the class, select the book, then add condition details and photos."}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <SellProgress step={step} submitting={submitting} language={language} />
        </div>

        {step === "grade" && (
          <section className="space-y-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="text-center">
              <GraduationCap className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h2 className="font-display text-2xl font-bold text-foreground">
                {isIT
                  ? "Scegli la classe del libro che vuoi pubblicare"
                  : "Choose the class/year of the book you want to list"}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {isIT
                  ? "Questo avvia il flusso di vendita e non mostrerà annunci disponibili per l'acquisto."
                  : "This starts the selling flow and will not show available listings to buy."}
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

              {/* Generic MYP category — Keyboard / Sphero Mini Robot (no class year) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="myp">MYP</Badge>
                  <span className="text-sm text-muted-foreground">
                    {isIT ? "Materiali generici (tutte le classi MYP)" : "Generic materials (all MYP years)"}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-auto justify-between py-4 group hover:border-primary hover:bg-primary/5"
                  onClick={() => handleSelectGrade(GENERIC_MYP_GRADE)}
                >
                  <span className="flex flex-col text-left">
                    <span className="font-medium">
                      {isIT ? "Tastiera / Robot Sphero Mini" : "Keyboard / Sphero Mini Robot"}
                    </span>
                    <span className="text-xs text-muted-foreground font-normal">
                      {isIT
                        ? "Nessun anno o ISBN richiesto"
                        : "No class year or ISBN required"}
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                </Button>
              </div>
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
                  {isIT
                    ? "Seleziona il libro che vuoi vendere, donare o scambiare"
                    : "Select the book you want to sell, donate or exchange"}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {isIT
                    ? "Scegli un libro dall'elenco di riferimento per questa classe per creare un annuncio."
                    : "Choose one book from the reference list for this class/year to create a listing."}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {isIT
                    ? `Elenco di riferimento ${LAST_SCHOOL_YEAR}. L'elenco del nuovo anno scolastico è in arrivo. Sono mostrati solo libri reali (più Keyboard e Sphero) — PDF, fotocopie e materiali digitali sono esclusi.`
                    : `Showing the ${LAST_SCHOOL_YEAR} reference list. The new school year book list is coming soon. Only real books (plus Keyboard and Sphero) are shown — PDFs, photocopies and downloadable materials are excluded.`}
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => setStep("grade")}>
                {isIT ? "Cambia classe" : "Change class"}
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
                  {isIT ? "Nessun libro trovato per questa classe." : "No books found for this class/year."}
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
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {isIT ? "Crea il tuo annuncio" : "Create your listing"}
                </p>
                <h2 className="mt-1 font-display text-xl font-bold text-foreground">{selectedBook.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isGenericMyp
                    ? (isIT ? "Materiale generico per MYP" : "Generic MYP item")
                    : `${selectedBook.grade} • ${selectedBook.subject}${selectedBook.isbn ? ` • ISBN: ${selectedBook.isbn}` : ""}`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{isIT ? "Tipo di annuncio" : "Listing type"}</Label>
                <Select value={listingType} onValueChange={(v) => handleListingTypeChange(v as ListingType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">{isIT ? "Vendita" : "Sell"}</SelectItem>
                    <SelectItem value="exchange">{isIT ? "Scambio" : "Exchange"}</SelectItem>
                    <SelectItem value="donation">{isIT ? "Donazione" : "Donate"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{isIT ? "Condizione" : "Condition"}</Label>
                <Select value={condition} onValueChange={(v) => setCondition(v as Condition)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">{isIT ? "Nuovo" : "New"}</SelectItem>
                    <SelectItem value="like_new">{isIT ? "Come nuovo" : "Like new"}</SelectItem>
                    <SelectItem value="good">{isIT ? "Buono" : "Good"}</SelectItem>
                    <SelectItem value="fair">{isIT ? "Discreto" : "Fair"}</SelectItem>
                    <SelectItem value="poor">{isIT ? "Scarso" : "Poor"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {listingType === "sale" && (
              <div className="space-y-2">
                <Label htmlFor="price">{isIT ? "Prezzo (€)" : "Price (€)"}</Label>
                <Input id="price" type="number" min="0" step="0.50" placeholder="0.00"
                  value={price} onChange={(e) => setPrice(e.target.value)} required />
              </div>
            )}

            {/* Photos */}
            <div className="space-y-3 border-t border-border pt-2">
              <div>
                <Label className="font-display text-base">{isIT ? "Foto del libro" : "Book photos"}</Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isIT
                    ? "Puoi scattare una foto ora oppure caricarne una dalla tua galleria."
                    : "You can take a new photo now or upload an existing image from your gallery."}
                </p>
              </div>

              <div className="flex gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs text-foreground">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p>
                  {isIT
                    ? "Carica foto reali del libro esatto che stai vendendo. Le foto devono mostrare chiaramente la copertina e le pagine interne. Non caricare immagini non pertinenti, screenshot, meme, foto stock o di un libro diverso."
                    : "Please upload real photos of the exact book you are listing. Photos must clearly show the book cover and inside pages. Do not upload unrelated images, screenshots, memes, stock photos or photos of a different book."}
                </p>
              </div>

              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm font-medium hover:bg-muted/50">
                  <span className="flex items-center gap-2"><Info className="h-4 w-4" /> {isIT ? "Linee guida foto" : "Photo Guidelines"}</span>
                  <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="rounded-b-lg border border-t-0 border-border bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
                  <ul className="list-disc space-y-1 pl-4">
                    {(isIT
                      ? [
                          "Usa foto reali del libro esatto che stai vendendo",
                          "Mostra tutta la copertina anteriore",
                          "Mostra almeno una pagina interna per far vedere la condizione",
                          "Assicurati che titolo e condizione del libro siano visibili",
                          "Evita foto sfocate, scure o tagliate",
                          "Non caricare foto stock, screenshot, meme o immagini non pertinenti",
                          "Non caricare foto di un libro diverso",
                          "Non includere bambini, volti, indirizzi, numeri di telefono, documenti scolastici o informazioni private",
                        ]
                      : [
                          "Use real photos of the exact book you are listing",
                          "Show the full front cover",
                          "Show at least one inside page to demonstrate condition",
                          "Make sure the title and book condition are visible",
                          "Avoid blurry, dark or cropped photos",
                          "Do not upload stock photos, screenshots, memes or unrelated images",
                          "Do not upload photos of a different book",
                          "Do not include children, faces, addresses, phone numbers, school documents or private information",
                        ]).map((g) => <li key={g}>{g}</li>)}
                  </ul>
                </CollapsibleContent>
              </Collapsible>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <PhotoUpload
                  language={language}
                  label={isGenericMyp
                    ? (isIT ? "Foto principale" : "Main photo")
                    : (isIT ? "Copertina" : "Front cover")}
                  required
                  warning={isGenericMyp
                    ? (isIT ? "Carica una foto reale di questo oggetto." : "Upload an actual photo of this item.")
                    : (isIT ? "Carica la copertina reale di questo libro." : "Upload the actual front cover of this book.")}
                  value={front}
                  onChange={setFront}
                />
                <PhotoUpload
                  language={language}
                  label={isGenericMyp
                    ? (isIT ? "Foto extra" : "Extra photo")
                    : (isIT ? "Pagine interne" : "Inside pages")}
                  required={!isGenericMyp}
                  hint={isGenericMyp ? undefined : (isIT ? "Mostra scritte, segni, condizione delle pagine" : "Show writing, marks, page condition")}
                  warning={isGenericMyp ? undefined : (isIT ? "Carica una foto reale delle pagine interne che mostri la condizione." : "Upload a real inside-page photo showing the condition of this book.")}
                  value={inside}
                  onChange={setInside}
                />
                <PhotoUpload language={language} label={isGenericMyp ? (isIT ? "Foto extra" : "Extra photo") : (isIT ? "Retro copertina" : "Back cover")} value={back} onChange={setBack} />
                <PhotoUpload language={language} label={isIT ? "Foto extra" : "Extra photo"} value={extra1} onChange={setExtra1} />
                <PhotoUpload language={language} label={isIT ? "Foto extra" : "Extra photo"} value={extra2} onChange={setExtra2} />
              </div>

              <div className="flex gap-2 rounded-lg border border-border bg-muted/50 p-3 text-xs text-muted-foreground">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <div className="space-y-1">
                  <p>
                    {isIT
                      ? "Assicurati che le foto non contengano bambini, volti, indirizzi, numeri di telefono, documenti scolastici o altre informazioni private."
                      : "Please make sure photos do not contain children, faces, addresses, phone numbers, school documents or other private information."}
                  </p>
                  <p>
                    {isIT
                      ? "Le foto devono essere chiare, ben illuminate e leggibili. Foto sfocate o non pertinenti possono causare il rifiuto dell'annuncio da parte degli admin DISbook."
                      : "Photos should be clear, well-lit and readable. Blurry or unrelated photos may cause the listing to be rejected by DISbook admins."}
                  </p>
                  <p>
                    {isIT
                      ? "Formati accettati: JPG, PNG, WEBP, HEIC/HEIF · Max 5 MB per immagine."
                      : "Accepted formats: JPG, PNG, WEBP, HEIC/HEIF · Max 5 MB per image."}
                  </p>
                </div>
              </div>

              {!photosValid && (
                <div className="flex gap-2 rounded-lg border border-amber-300/60 bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    {isIT
                      ? (isGenericMyp
                          ? "Carica almeno una foto dell'oggetto prima di pubblicare."
                          : "Carica almeno una foto della copertina e una delle pagine interne prima di pubblicare.")
                      : (isGenericMyp
                          ? "Please upload at least one photo of the item before publishing."
                          : "Please upload at least a front cover photo and one inside photo before publishing your listing.")}
                  </p>
                </div>
              )}
            </div>


            <div className="space-y-2">
              <Label htmlFor="notes">{isIT ? "Note (facoltativo)" : "Notes (optional)"}</Label>
              <Textarea id="notes" placeholder={isIT ? "Cosa dovrebbe sapere l'acquirente (sottolineature, pagine mancanti, ecc.)" : "Anything the buyer should know (highlighting, missing pages, etc.)"}
                value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={!canSubmit}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (isIT ? "Pubblica annuncio" : "Publish listing")}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              {isIT
                ? "DISbook è un progetto indipendente creato dagli studenti e non è l'app ufficiale DIS. Controlla sempre l'elenco libri ufficiale DIS prima di finalizzare l'acquisto."
                : "DISbook is an independent student-created project and is not the official DIS app. Always check the official DIS book list before finalising your purchase."}
            </p>
          </form>
        )}
      </div>
    </MainLayout>
  );
};

const Sell = () => <SellContent />;

export default Sell;
