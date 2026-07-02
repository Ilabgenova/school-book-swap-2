import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Upload, Sparkles, Save, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { parseFile, enrichRowByISBN, type ParsedRow } from "@/lib/bookImport";

const STATUS_COLORS: Record<string, string> = {
  ready: "default", duplicate_db: "destructive", duplicate_file: "destructive",
  missing_isbn: "secondary", invalid_isbn: "destructive", missing_class: "secondary",
  unsupported_class: "secondary", needs_review: "secondary", imported: "default",
  skipped: "outline", failed: "destructive",
};

type ImportHistory = {
  id: string; file_name: string; created_at: string; total_rows: number;
  imported_rows: number; skipped_rows: number; failed_rows: number; status: string;
  school_year: string | null;
};

export const BookImportPanel = () => {
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [schoolYear, setSchoolYear] = useState("2026-2027");
  const [busy, setBusy] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [history, setHistory] = useState<ImportHistory[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadHistory = async () => {
    const { data } = await supabase.from("book_imports" as any).select("*").order("created_at", { ascending: false }).limit(20);
    setHistory((data as any) || []);
  };
  useEffect(() => { loadHistory(); }, []);

  const handleFile = async (f: File) => {
    if (f.size > 5 * 1024 * 1024) return toast.error("File too large (max 5MB)");
    setBusy(true);
    try {
      const { rows: parsed } = await parseFile(f);
      // Check duplicates against DB (book_catalog by ISBN + school_year)
      const isbns = parsed.map((r) => r.isbn).filter(Boolean) as string[];
      let existing = new Set<string>();
      if (isbns.length) {
        const { data } = await supabase.from("book_catalog").select("isbn").eq("school_year", schoolYear).in("isbn", isbns);
        existing = new Set(((data || []) as any[]).map((r) => r.isbn));
      }
      const withDupes = parsed.map((r) =>
        r.import_status === "ready" && r.isbn && existing.has(r.isbn)
          ? { ...r, import_status: "duplicate_db" as const, warning_message: "Already in DISbook catalog for this school year" }
          : r
      );
      setRows(withDupes);
      setFileName(f.name);
      toast.success(`Parsed ${withDupes.length} rows`);
    } catch (e: any) {
      toast.error(e.message || "Failed to parse file");
    } finally {
      setBusy(false);
    }
  };

  const enrichAll = async () => {
    setEnriching(true);
    const out: ParsedRow[] = [];
    for (const r of rows) {
      // Only enrich ready or needs_review with valid ISBN
      if (r.isbn && (r.import_status === "ready" || r.import_status === "needs_review" || r.import_status === "duplicate_db")) {
        out.push(await enrichRowByISBN(r));
      } else out.push(r);
    }
    setRows(out);
    setEnriching(false);
    toast.success("Enrichment complete");
  };

  const updateRow = (i: number, patch: Partial<ParsedRow>) => {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  };
  const skipRow = (i: number) => updateRow(i, { import_status: "skipped" });

  const importReady = async () => {
    const toImport = rows.filter((r) => r.import_status === "ready");
    if (!toImport.length) return toast.error("No rows ready to import");
    setBusy(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const uid = userRes.user?.id;
      if (!uid) throw new Error("Not authenticated");
      // Create import record
      const { data: imp, error: impErr } = await supabase.from("book_imports" as any).insert({
        uploaded_by: uid, file_name: fileName, school_year: schoolYear, academic_year: schoolYear,
        total_rows: rows.length, status: "processed",
      }).select().single();
      if (impErr) throw impErr;
      const importId = (imp as any).id;
      // Insert into book_catalog
      const catalogRows = toImport.map((r) => ({
        school_year: schoolYear,
        academic_year: schoolYear,
        program: r.programme || (r.class_year?.startsWith("MYP") ? "MYP" : "DP"),
        grade: r.class_year!,
        subject: r.subject,
        title: r.title || "(untitled)",
        author: r.author,
        publisher: r.publisher,
        isbn: r.isbn,
        is_sellable: true,
      }));
      const { error: catErr } = await supabase.from("book_catalog").upsert(catalogRows, { onConflict: "school_year,external_book_id" as any, ignoreDuplicates: false });
      // Fallback: try plain insert for ones without external_book_id
      if (catErr) {
        const { error: catErr2 } = await supabase.from("book_catalog").insert(catalogRows);
        if (catErr2) throw catErr2;
      }
      // Log rows
      const importedRowsPayload = rows.map((r) => ({
        import_id: importId, row_number: r.row_number, raw_data: r.raw_data as any,
        isbn: r.isbn, title: r.title, author: r.author, publisher: r.publisher, edition: r.edition,
        publication_year: r.publication_year, class_year: r.class_year, programme: r.programme,
        subject: r.subject, required_optional: r.required_optional, notes: r.notes,
        lookup_status: r.lookup_status || null, validation_status: null,
        warning_message: r.warning_message,
        import_status: r.import_status === "ready" ? "imported" : r.import_status,
      }));
      await supabase.from("book_import_rows" as any).insert(importedRowsPayload);
      await supabase.from("book_imports" as any).update({
        imported_rows: toImport.length,
        skipped_rows: rows.filter(r => r.import_status === "skipped").length,
        failed_rows: rows.filter(r => ["failed", "invalid_isbn"].includes(r.import_status)).length,
        status: toImport.length === rows.length ? "imported" : "partially_imported",
      }).eq("id", importId);
      toast.success(`Imported ${toImport.length} books`);
      setRows([]); setFileName("");
      loadHistory();
    } catch (e: any) {
      toast.error(e.message || "Import failed");
    } finally {
      setBusy(false);
    }
  };

  const counts = {
    ready: rows.filter(r => r.import_status === "ready").length,
    warn: rows.filter(r => ["missing_isbn", "invalid_isbn", "missing_class", "unsupported_class", "duplicate_db", "duplicate_file", "needs_review"].includes(r.import_status)).length,
    skipped: rows.filter(r => r.import_status === "skipped").length,
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          <p className="font-medium">Upload book list</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Upload the book list using the same format as the previous DISbook book list (CSV or Excel). Columns are detected automatically (ISBN, Title, Author, Publisher, Class/Year, Programme, Subject, Notes).
        </p>
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-muted-foreground">School year</label>
            <Input value={schoolYear} onChange={e => setSchoolYear(e.target.value)} placeholder="2025-2026" />
          </div>
          <div className="md:col-span-2 flex items-end gap-2">
            <input
              ref={inputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden"
              onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <Button onClick={() => inputRef.current?.click()} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
              Choose file
            </Button>
            {fileName && <span className="text-sm text-muted-foreground truncate">{fileName}</span>}
          </div>
        </div>
      </Card>

      {rows.length > 0 && (
        <Card className="p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2 justify-between">
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Ready: {counts.ready}</Badge>
              <Badge variant="secondary">Warnings: {counts.warn}</Badge>
              <Badge variant="outline">Skipped: {counts.skipped}</Badge>
              <Badge variant="outline">Total: {rows.length}</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={enrichAll} disabled={enriching}>
                {enriching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                Enrich by ISBN
              </Button>
              <Button size="sm" onClick={importReady} disabled={busy || counts.ready === 0}>
                <Save className="h-4 w-4 mr-2" />Import {counts.ready} ready
              </Button>
            </div>
          </div>
          <div className="max-h-[500px] overflow-auto border rounded">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Warning</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs">{r.row_number}</TableCell>
                    <TableCell>
                      <Badge variant={(STATUS_COLORS[r.import_status] as any) || "outline"} className="text-[10px]">
                        {r.import_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono">{r.isbn || "—"}</TableCell>
                    <TableCell>
                      <Input value={r.title || ""} onChange={e => updateRow(i, { title: e.target.value })} className="h-7 text-xs min-w-[200px]" />
                    </TableCell>
                    <TableCell>
                      <Input value={r.class_year || ""} onChange={e => updateRow(i, { class_year: e.target.value })} className="h-7 text-xs w-20" />
                    </TableCell>
                    <TableCell>
                      <Input value={r.subject || ""} onChange={e => updateRow(i, { subject: e.target.value })} className="h-7 text-xs min-w-[140px]" />
                    </TableCell>
                    <TableCell className="text-[11px] text-muted-foreground max-w-[200px]">{r.warning_message}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {r.import_status !== "ready" && r.isbn && r.class_year && (
                          <Button size="sm" variant="ghost" onClick={() => updateRow(i, { import_status: "ready", warning_message: null })}>Force</Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => skipRow(i)}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      <Card className="p-4">
        <p className="font-medium mb-3">Import history</p>
        {history.length === 0 && <p className="text-sm text-muted-foreground">No imports yet.</p>}
        <div className="space-y-2">
          {history.map(h => (
            <div key={h.id} className="flex items-center justify-between text-sm border-b pb-2">
              <div>
                <p className="font-medium">{h.file_name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(h.created_at).toLocaleString()} · {h.school_year || "—"}
                </p>
              </div>
              <div className="flex gap-2 text-xs">
                <Badge variant="default">Imported {h.imported_rows}</Badge>
                <Badge variant="outline">Skipped {h.skipped_rows}</Badge>
                <Badge variant="destructive">Failed {h.failed_rows}</Badge>
                <Badge variant="secondary">{h.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
