// Book list import utilities: parse CSV/XLSX (multi-sheet), map columns, normalize,
// validate, and read the 2026-2027 "Purchasable from former XXX families" checkpoint
// used to decide whether a book can be resold/reused by former families.
import * as XLSX from "xlsx";
import Papa from "papaparse";

export type ImportStatus =
  | "pending" | "ready" | "duplicate_db" | "duplicate_file" | "missing_isbn"
  | "invalid_isbn" | "missing_class" | "unsupported_class" | "needs_review"
  | "imported" | "skipped" | "failed";

export type ReuseCheckStatus =
  | "reusable"
  | "not_reusable"
  | "needs_manual_review"
  | "no_previous_match"
  | "pending";

export type ReuseMatchType = "isbn" | "title_author" | "manual" | "none";

export interface ParsedRow {
  row_number: number;
  raw_data: Record<string, any>;
  sheet_name?: string | null;
  isbn: string | null;
  title: string | null;
  author: string | null;
  publisher: string | null;
  edition: string | null;
  publication_year: string | null;
  class_year: string | null;
  programme: string | null;
  subject: string | null;
  required_optional: string | null;
  notes: string | null;
  import_status: ImportStatus;
  warning_message: string | null;
  lookup_status?: string | null;

  // Column M: "Purchasable from former XXX families"
  column_m_header?: string | null;
  column_m_raw?: string | null;
  purchasable_from_former_families?: boolean | null;
  former_class_source?: string | null;

  // Comparison against previous-year list (populated by comparison step)
  reuse_check_status?: ReuseCheckStatus;
  reuse_match_type?: ReuseMatchType;
  reuse_notes?: string | null;
  matched_previous_isbn?: string | null;
}

const HEADER_ALIASES: Record<string, string[]> = {
  isbn: ["isbn", "isbn13", "isbn-13", "isbn10", "codice isbn"],
  title: ["title", "titolo", "book title", "book"],
  author: ["author", "autore", "authors", "autori", "author(s)"],
  publisher: ["publisher", "editore", "editor", "casa editrice"],
  edition: ["edition", "edizione", "ed."],
  publication_year: ["year", "anno", "publication year", "pub year"],
  class_year: ["class", "grade", "class/year", "class year", "classe", "anno scolastico", "grade/class", "level"],
  programme: ["programme", "program", "programma", "ib programme", "ib program"],
  subject: ["subject", "materia", "course", "corso"],
  required_optional: ["is paper version required?", "required", "optional", "type", "req/opt", "required/optional", "obbligatorio"],
  notes: ["notes", "note", "comment", "commenti", "remarks", "who needs it"],
};

const norm = (s: string) => s.toLowerCase().trim().replace(/\s+/g, " ");

function detectColumns(headers: string[]): Record<string, number> {
  const map: Record<string, number> = {};
  const normHeaders = headers.map((h) => norm(String(h || "")));
  for (const key of Object.keys(HEADER_ALIASES)) {
    for (const alias of HEADER_ALIASES[key]) {
      const idx = normHeaders.findIndex((h) => h === alias || h.includes(alias));
      if (idx >= 0) { map[key] = idx; break; }
    }
  }
  return map;
}

// Detect the "Purchasable from former XXX families" column (usually column M / index 12)
// Returns column index + extracted class label (e.g., "MYP1", "DP1") if present.
export function detectColumnM(headers: string[]): { index: number; header: string; formerClass: string | null } | null {
  const re = /purchasable\s+from\s+former\s+([A-Za-z0-9\s]+?)\s+famil/i;
  for (let i = 0; i < headers.length; i++) {
    const h = String(headers[i] || "");
    const m = h.match(re);
    if (m) {
      const rawClass = m[1].trim().toUpperCase().replace(/\s+/g, "");
      const normalized = normalizeClassYear(rawClass).value;
      return { index: i, header: h.trim(), formerClass: normalized };
    }
  }
  return null;
}

// Interpret the cell value of column M
export function parseColumnMValue(value: any): boolean | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim().toLowerCase();
  if (!s) return null;
  if (["yes", "y", "si", "sì", "true", "1", "x"].includes(s)) return true;
  if (["no", "n", "false", "0"].includes(s)) return false;
  return null; // unknown / free-text
}

export function normalizeClassYear(raw: string | null): { value: string | null; supported: boolean } {
  if (!raw) return { value: null, supported: false };
  const s = String(raw).toUpperCase().replace(/[^A-Z0-9]/g, "");
  const m = s.match(/(PYP|MYP|DP)0?(\d)?/);
  if (m) {
    const prog = m[1];
    const num = m[2] ? parseInt(m[2], 10) : NaN;
    if (prog === "MYP" && num >= 1 && num <= 5) return { value: `MYP${num}`, supported: true };
    if (prog === "DP" && (num === 1 || num === 2)) return { value: `DP${num}`, supported: true };
    if (prog === "PYP") return { value: `PYP${isNaN(num) ? "" : num}`, supported: false };
  }
  // Handle "DIPLOMA DP1" style
  const d = s.match(/DIPLOMA?(DP)?(\d)/);
  if (d) return { value: `DP${d[2]}`, supported: d[2] === "1" || d[2] === "2" };
  return { value: raw, supported: false };
}

// Extract a class label from a sheet name like "MYP1", "Diploma DP1", "PYP".
export function classFromSheetName(name: string): { value: string | null; supported: boolean } {
  return normalizeClassYear(name);
}

export function validateISBN(isbn: string | null): boolean {
  if (!isbn) return false;
  const clean = isbn.replace(/[^0-9Xx]/g, "");
  return clean.length === 10 || clean.length === 13;
}

function cleanIsbn(v: any): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).replace(/[^0-9Xx]/g, "");
  return s || null;
}

function pick(row: any[], idx: number | undefined): string | null {
  if (idx === undefined) return null;
  const v = row[idx];
  if (v === null || v === undefined || v === "") return null;
  return String(v).trim();
}

export async function parseFile(file: File): Promise<{ headers: string[]; rows: ParsedRow[] }> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "csv" || ext === "txt") {
    const text = await file.text();
    const parsed = Papa.parse<string[]>(text, { skipEmptyLines: true });
    const { headers, rows } = processSheet(parsed.data as any[][], null);
    return { headers, rows };
  }
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const allRows: ParsedRow[] = [];
  let firstHeaders: string[] = [];
  const seenIsbn = new Set<string>();
  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" }) as any[][];
    const { headers, rows } = processSheet(aoa, sheetName, seenIsbn);
    if (!firstHeaders.length) firstHeaders = headers;
    allRows.push(...rows);
  }
  return { headers: firstHeaders, rows: allRows };
}

export function processAoa(aoa: any[][]): { headers: string[]; rows: ParsedRow[] } {
  return processSheet(aoa, null);
}

function processSheet(
  aoa: any[][],
  sheetName: string | null,
  seenIsbn: Set<string> = new Set()
): { headers: string[]; rows: ParsedRow[] } {
  // Find header row (first row with >= 3 non-empty cells)
  let headerIdx = 0;
  for (let i = 0; i < Math.min(10, aoa.length); i++) {
    const nonEmpty = (aoa[i] || []).filter((c) => c !== null && c !== undefined && String(c).trim() !== "").length;
    if (nonEmpty >= 3) { headerIdx = i; break; }
  }
  const headers = (aoa[headerIdx] || []).map((h) => String(h ?? "").trim());
  if (!headers.length) return { headers: [], rows: [] };
  const cols = detectColumns(headers);
  const colM = detectColumnM(headers);
  const sheetClass = sheetName ? classFromSheetName(sheetName) : { value: null, supported: false };

  const rows: ParsedRow[] = [];
  for (let i = headerIdx + 1; i < aoa.length; i++) {
    const raw = aoa[i];
    if (!raw || raw.every((c) => c === null || c === undefined || String(c).trim() === "")) continue;
    const rawObj: Record<string, any> = {};
    headers.forEach((h, idx) => { if (h) rawObj[h] = raw[idx]; });

    const isbn = cleanIsbn(pick(raw, cols.isbn));
    // Class: prefer explicit column, else fall back to sheet name
    const classRaw = pick(raw, cols.class_year);
    const normFromRow = normalizeClassYear(classRaw);
    const classNorm = normFromRow.value ? normFromRow : sheetClass;

    // Column M
    const columnMRaw = colM ? (raw[colM.index] ?? null) : null;
    const purchasable = colM ? parseColumnMValue(columnMRaw) : null;
    const formerClass = colM?.formerClass || sheetClass.value || null;

    let status: ImportStatus = "ready";
    let warn: string | null = null;
    if (!isbn) { status = "missing_isbn"; warn = "ISBN missing — needs manual review"; }
    else if (!validateISBN(isbn)) { status = "invalid_isbn"; warn = "ISBN format invalid"; }
    else if (seenIsbn.has(isbn + "|" + (classNorm.value || ""))) { status = "duplicate_file"; warn = "Duplicate ISBN inside this file"; }
    else if (!classNorm.value) { status = "missing_class"; warn = "Class/year missing"; }
    else if (!classNorm.supported) {
      status = "unsupported_class";
      warn = classNorm.value?.startsWith("PYP")
        ? "PYP is not supported on DISbook"
        : `Unsupported class/year: ${classNorm.value}`;
    }
    if (isbn) seenIsbn.add(isbn + "|" + (classNorm.value || ""));

    rows.push({
      row_number: i - headerIdx,
      raw_data: rawObj,
      sheet_name: sheetName,
      isbn,
      title: pick(raw, cols.title),
      author: pick(raw, cols.author),
      publisher: pick(raw, cols.publisher),
      edition: pick(raw, cols.edition),
      publication_year: pick(raw, cols.publication_year),
      class_year: classNorm.value,
      programme: pick(raw, cols.programme) || (classNorm.value?.startsWith("MYP") ? "MYP" : classNorm.value?.startsWith("DP") ? "DP" : classNorm.value?.startsWith("PYP") ? "PYP" : null),
      subject: pick(raw, cols.subject),
      required_optional: pick(raw, cols.required_optional),
      notes: pick(raw, cols.notes),
      import_status: status,
      warning_message: warn,
      column_m_header: colM?.header ?? null,
      column_m_raw: columnMRaw === null || columnMRaw === undefined ? null : String(columnMRaw).trim() || null,
      purchasable_from_former_families: purchasable,
      former_class_source: formerClass,
      reuse_check_status: "pending",
      reuse_match_type: "none",
      reuse_notes: null,
      matched_previous_isbn: null,
    });
  }
  return { headers, rows };
}

// -----------------------------------------------------------------------------
// Reuse comparison against the previous-year catalog
// -----------------------------------------------------------------------------
export interface PreviousCatalogEntry {
  id: string;
  isbn: string | null;
  title: string | null;
  author: string | null;
  publisher: string | null;
  grade: string | null;
}

function normStr(s: string | null | undefined): string {
  return (s || "").toLowerCase().replace(/\s+/g, " ").trim();
}

export function compareRowsWithPreviousYear(
  rows: ParsedRow[],
  previous: PreviousCatalogEntry[]
): ParsedRow[] {
  const byIsbn = new Map<string, PreviousCatalogEntry>();
  const byTitleAuthor = new Map<string, PreviousCatalogEntry>();
  for (const p of previous) {
    const isbn = (p.isbn || "").replace(/[^0-9Xx]/g, "");
    if (isbn) byIsbn.set(isbn, p);
    const key = normStr(p.title) + "|" + normStr(p.author);
    if (key !== "|") byTitleAuthor.set(key, p);
  }

  return rows.map((r) => {
    const purch = r.purchasable_from_former_families;
    // If column M is not YES, don't mark reusable
    if (purch !== true) {
      return {
        ...r,
        reuse_check_status: "not_reusable",
        reuse_match_type: "none",
        reuse_notes: purch === false ? "Column M = NO" : "Column M not marked YES",
      };
    }
    // Purchasable YES — try to match against previous year
    const isbn = (r.isbn || "").replace(/[^0-9Xx]/g, "");
    if (isbn && byIsbn.has(isbn)) {
      const prev = byIsbn.get(isbn)!;
      return {
        ...r,
        reuse_check_status: "reusable",
        reuse_match_type: "isbn",
        matched_previous_isbn: prev.isbn,
        reuse_notes: `Strong ISBN match with previous year (${prev.grade || "?"})`,
      };
    }
    const key = normStr(r.title) + "|" + normStr(r.author);
    if (key !== "|" && byTitleAuthor.has(key)) {
      const prev = byTitleAuthor.get(key)!;
      return {
        ...r,
        reuse_check_status: "needs_manual_review",
        reuse_match_type: "title_author",
        matched_previous_isbn: prev.isbn,
        reuse_notes: `Possible title/author match — admin review required (${prev.grade || "?"})`,
      };
    }
    return {
      ...r,
      reuse_check_status: "no_previous_match",
      reuse_match_type: "none",
      reuse_notes: "Marked purchasable but no previous-year match found",
    };
  });
}

export async function enrichRowByISBN(row: ParsedRow): Promise<ParsedRow> {
  if (!row.isbn || !validateISBN(row.isbn)) return { ...row, lookup_status: "skipped" };
  try {
    const res = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${row.isbn}&format=json&jscmd=data`);
    const data = await res.json();
    const info = data[`ISBN:${row.isbn}`];
    if (!info) return { ...row, lookup_status: "not_found" };
    return {
      ...row,
      title: row.title || info.title || null,
      author: row.author || (info.authors || []).map((a: any) => a.name).join(", ") || null,
      publisher: row.publisher || (info.publishers || []).map((p: any) => p.name).join(", ") || null,
      publication_year: row.publication_year || info.publish_date || null,
      lookup_status: "ok",
    };
  } catch {
    return { ...row, lookup_status: "failed" };
  }
}
