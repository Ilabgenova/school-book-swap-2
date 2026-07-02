import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Upload, Sparkles, Save, Trash2, GitCompare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  parseFile, enrichRowByISBN, compareRowsWithPreviousYear,
  type ParsedRow, type PreviousCatalogEntry, type ReuseCheckStatus,
} from "@/lib/bookImport";

const STATUS_COLORS: Record<string, string> = {
  ready: "default", duplicate_db: "destructive", duplicate_file: "destructive",
  missing_isbn: "secondary", invalid_isbn: "destructive", missing_class: "secondary",
  unsupported_class: "secondary", needs_review: "secondary", imported: "default",
  skipped: "outline", failed: "destructive",
};

const REUSE_COLORS: Record<ReuseCheckStatus, string> = {
  reusable: "default",
  not_reusable: "outline",
  needs_manual_review: "secondary",
  no_previous_match: "destructive",
  pending: "outline",
};

type ImportHistory = {
  id: string; file_name: string; created_at: string; total_rows: number;
  imported_rows: number; skipped_rows: number; failed_rows: number; status: string;
  school_year: string | null;
};

function prevYear(year: string): string {
  const m = year.match(/^(\d{4})-(\d{4})$/);
  if (!m) return year;
  return `${parseInt(m[1], 10) - 1}-${parseInt(m[2], 10) - 1}`;
}

export const BookImportPanel = () => {
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [schoolYear, setSchoolYear] = useState("2026-2027");
  const [busy, setBusy] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [comparing, setComparing] = useState(false);
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
      // Duplicates against DB (book_catalog by ISBN + academic_year)
      const isbns = parsed.map((r) => r.isbn).filter(Boolean) as string[];
      let existing = new Set<string>();
      if (isbns.length) {
        const { data } = await supabase.from("book_catalog")
          .select("isbn").eq("academic_year", schoolYear).in("isbn", isbns);
        existing = new Set(((data || []) as any[]).map((r) => r.isbn));
      }
      const withDupes = parsed.map((r) =>
        r.import_status === "ready" && r.isbn && existing.has(r.isbn)
          ? { ...r, import_status: "duplicate_db" as const, warning_message: "Already in DISbook catalog for this school year" }
          : r
      );
      // Auto-run comparison against previous year
      const previous = await fetchPreviousYear(schoolYear);
      const compared = compareRowsWithPreviousYear(withDupes, previous);
      setRows(compared);
      setFileName(f.name);
      const reusable = compared.filter(r => r.reuse_check_status === "reusable").length;
      toast.success(`Parsed ${compared.length} rows · ${reusable} strongly reusable`);
    } catch (e: any) {
      toast.error(e.message || "Failed to parse file");
    } finally {
      setBusy(false);
    }
  };

  const fetchPreviousYear = async (year: string): Promise<PreviousCatalogEntry[]> => {
    const py = prevYear(year);
    const { data } = await supabase.from("book_catalog")
      .select("id, isbn, title, author, publisher, grade")
      .or(`academic_year.eq.${py},school_year.eq.${py}`)
      .limit(5000);
    return (data as any) || [];
  };

  const runComparison = async () => {
    setComparing(true);
    try {
      const previous = await fetchPreviousYear(schoolYear);
      setRows((prev) => compareRowsWithPreviousYear(prev, previous));
      toast.success(`Compared with ${previous.length} previous-year books`);
    } catch (e: any) {
      toast.error(e.message || "Comparison failed");
    } finally { setComparing(false); }
  };

  const enrichAll = async () => {
    setEnriching(true);
    const out: ParsedRow[] = [];
    for (const r of rows) {
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
      const { data: imp, error: impErr } = await supabase.from("book_imports" as any).insert({
        uploaded_by: uid, file_name: fileName, school_year: schoolYear, academic_year: schoolYear,
        total_rows: rows.length, status: "processed",
      }).select().single();
      if (impErr) throw impErr;
      const importId = (imp as any).id;

      const catalogRows = toImport.map((r) => ({
        school_year: schoolYear,
        academic_year: schoolYear,
        previous_year: prevYear(schoolYear),
        program: r.programme || (r.class_year?.startsWith("MYP") ? "MYP" : "DP"),
        grade: r.class_year!,
        subject: r.subject,
        title: r.title || "(untitled)",
        author: r.author,
        publisher: r.publisher,
        isbn: r.isbn,
        is_sellable: r.purchasable_from_former_families === true,
        purchasable_from_former_families: r.purchasable_from_former_families,
        former_class_source: r.former_class_source,
        reuse_check_status: r.reuse_check_status,
        reuse_match_type: r.reuse_match_type,
        reuse_notes: r.reuse_notes,
        column_m_raw: r.column_m_raw,
      }));
      const { error: catErr } = await supabase.from("book_catalog").insert(catalogRows as any);
      if (catErr) throw catErr;

      const importedRowsPayload = rows.map((r) => ({
        import_id: importId, row_number: r.row_number, raw_data: r.raw_data as any,
        isbn: r.isbn, title: r.title, author: r.author, publisher: r.publisher, edition: r.edition,
        publication_year: r.publication_year, class_year: r.class_year, programme: r.programme,
        subject: r.subject, required_optional: r.required_optional, notes: r.notes,
        lookup_status: r.lookup_status || null, validation_status: null,
        warning_message: r.warning_message,
        import_status: r.import_status === "ready" ? "imported" : r.import_status,
        purchasable_from_former_families: r.purchasable_from_former_families,
        former_class_source: r.former_class_source,
        reuse_check_status: r.reuse_check_status,
        reuse_match_type: r.reuse_match_type,
        reuse_notes: r.reuse_notes,
        column_m_raw: r.column_m_raw,
        matched_previous_isbn: r.matched_previous_isbn,
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
    } finally { setBusy(false); }
  };

  const counts = {
    ready: rows.filter(r => r.import_status === "ready").length,
    warn: rows.filter(r => ["missing_isbn", "invalid_isbn", "missing_class", "unsupported_class", "duplicate_db", "duplicate_file", "needs_review"].includes(r.import_status)).length,
    skipped: rows.filter(r => r.import_status === "skipped").length,
    reusable: rows.filter(r => r.reuse_check_status === "reusable").length,
    review: rows.filter(r => r.reuse_check_status === "needs_manual_review" || r.reuse_check_status === "no_previous_match").length,
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          <p className="font-medium">Upload book list</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Upload the DIS book list (CSV or Excel, one sheet per class). Column M
          <span className="font-mono mx-1">“Purchasable from former XXX families”</span>
          is used to decide whether each book can be resold by former families.
        </p>
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-muted-foreground">School year</label>
            <Input value={schoolYear} onChange={e => setSchoolYear(e.target.value)} placeholder="2026-2027" />
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
              <Badge className="bg-emerald-600 hover:bg-emerald-600">Reusable: {counts.reusable}</Badge>
              <Badge variant="secondary">Need review: {counts.review}</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={runComparison} disabled={comparing}>
                {comparing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <GitCompare className="h-4 w-4 mr-2" />}
                Re-run comparison
              </Button>
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
                  <TableHead>Col M</TableHead>
                  <TableHead>Former class</TableHead>
                  <TableHead>Match</TableHead>
                  <TableHead>Reuse</TableHead>
                  <TableHead>Notes / warning</TableHead>
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
                    <TableCell className="text-[11px]">
                      {r.purchasable_from_former_families === true ? (
                        <Badge className="bg-emerald-600 hover:bg-emerald-600 text-[10px]">YES</Badge>
                      ) : r.purchasable_from_former_families === false ? (
                        <Badge variant="outline" className="text-[10px]">NO</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">{r.column_m_raw || "—"}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-[11px]">{r.former_class_source || "—"}</TableCell>
                    <TableCell className="text-[11px]">{r.reuse_match_type || "none"}</TableCell>
                    <TableCell>
                      {r.reuse_check_status && (
                        <Badge variant={(REUSE_COLORS[r.reuse_check_status] as any) || "outline"} className="text-[10px]">
                          {r.reuse_check_status}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-[11px] text-muted-foreground max-w-[220px]">
                      {r.warning_message ? <div>{r.warning_message}</div> : null}
                      {r.reuse_notes ? <div className="opacity-70">{r.reuse_notes}</div> : null}
                    </TableCell>
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
