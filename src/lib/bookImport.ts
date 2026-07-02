// Book list import utilities: parse CSV/XLSX, map columns, normalize, validate.
import * as XLSX from "xlsx";
import Papa from "papaparse";

export type ImportStatus =
  | "pending" | "ready" | "duplicate_db" | "duplicate_file" | "missing_isbn"
  | "invalid_isbn" | "missing_class" | "unsupported_class" | "needs_review"
  | "imported" | "skipped" | "failed";

export interface ParsedRow {
  row_number: number;
  raw_data: Record<string, any>;
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
}

const HEADER_ALIASES: Record<keyof Omit<ParsedRow, "row_number" | "raw_data" | "import_status" | "warning_message" | "lookup_status">, string[]> = {
  isbn: ["isbn", "isbn13", "isbn-13", "isbn10", "codice isbn"],
  title: ["title", "titolo", "book title", "book"],
  author: ["author", "autore", "authors", "autori"],
  publisher: ["publisher", "editore", "casa editrice"],
  edition: ["edition", "edizione", "ed."],
  publication_year: ["year", "anno", "publication year", "pub year"],
  class_year: ["class", "grade", "class/year", "class year", "classe", "year", "anno scolastico", "grade/class", "level"],
  programme: ["programme", "program", "programma", "ib programme", "ib program"],
  subject: ["subject", "materia", "course", "corso"],
  required_optional: ["required", "optional", "type", "req/opt", "required/optional", "obbligatorio"],
  notes: ["notes", "note", "comment", "commenti", "remarks"],
};

const norm = (s: string) => s.toLowerCase().trim().replace(/\s+/g, " ");

function detectColumns(headers: string[]): Record<string, number> {
  const map: Record<string, number> = {};
  const normHeaders = headers.map((h) => norm(String(h || "")));
  for (const key of Object.keys(HEADER_ALIASES) as (keyof typeof HEADER_ALIASES)[]) {
    for (const alias of HEADER_ALIASES[key]) {
      const idx = normHeaders.findIndex((h) => h === alias || h.includes(alias));
      if (idx >= 0) { map[key] = idx; break; }
    }
  }
  return map;
}

export function normalizeClassYear(raw: string | null): { value: string | null; supported: boolean } {
  if (!raw) return { value: null, supported: false };
  const s = String(raw).toUpperCase().replace(/[^A-Z0-9]/g, "");
  // Handle IBDP1, DP1, DP01, YEAR1 DP, MYP1, MYPYEAR1, PYP1...
  const m = s.match(/(PYP|MYP|DP)0?(\d)/);
  if (m) {
    const prog = m[1]; const num = parseInt(m[2], 10);
    if (prog === "MYP" && num >= 1 && num <= 5) return { value: `MYP${num}`, supported: true };
    if (prog === "DP" && (num === 1 || num === 2)) return { value: `DP${num}`, supported: true };
    if (prog === "PYP") return { value: `PYP${num}`, supported: false };
  }
  return { value: raw, supported: false };
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
  let aoa: any[][];
  if (ext === "csv" || ext === "txt") {
    const text = await file.text();
    const parsed = Papa.parse<string[]>(text, { skipEmptyLines: true });
    aoa = parsed.data as any[][];
  } else {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    aoa = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" }) as any[][];
  }
  return processAoa(aoa);
}

export function processAoa(aoa: any[][]): { headers: string[]; rows: ParsedRow[] } {
  // Find header row (first row with >= 3 non-empty cells)
  let headerIdx = 0;
  for (let i = 0; i < Math.min(10, aoa.length); i++) {
    const nonEmpty = aoa[i].filter((c) => c !== null && c !== undefined && String(c).trim() !== "").length;
    if (nonEmpty >= 3) { headerIdx = i; break; }
  }
  const headers = (aoa[headerIdx] || []).map((h) => String(h ?? "").trim());
  const cols = detectColumns(headers);
  const seenIsbn = new Set<string>();
  const rows: ParsedRow[] = [];
  for (let i = headerIdx + 1; i < aoa.length; i++) {
    const raw = aoa[i];
    if (!raw || raw.every((c) => c === null || c === undefined || String(c).trim() === "")) continue;
    const rawObj: Record<string, any> = {};
    headers.forEach((h, idx) => { if (h) rawObj[h] = raw[idx]; });

    const isbn = cleanIsbn(pick(raw, cols.isbn));
    const classRaw = pick(raw, cols.class_year);
    const norm = normalizeClassYear(classRaw);

    let status: ImportStatus = "ready";
    let warn: string | null = null;
    if (!isbn) { status = "missing_isbn"; warn = "ISBN missing — needs manual review"; }
    else if (!validateISBN(isbn)) { status = "invalid_isbn"; warn = "ISBN format invalid"; }
    else if (seenIsbn.has(isbn)) { status = "duplicate_file"; warn = "Duplicate ISBN inside this file"; }
    else if (!classRaw) { status = "missing_class"; warn = "Class/year missing"; }
    else if (!norm.supported) {
      status = "unsupported_class";
      warn = norm.value?.startsWith("PYP")
        ? "PYP is not supported on DISbook"
        : `Unsupported class/year: ${classRaw}`;
    }
    if (isbn && !seenIsbn.has(isbn)) seenIsbn.add(isbn);

    rows.push({
      row_number: i - headerIdx,
      raw_data: rawObj,
      isbn,
      title: pick(raw, cols.title),
      author: pick(raw, cols.author),
      publisher: pick(raw, cols.publisher),
      edition: pick(raw, cols.edition),
      publication_year: pick(raw, cols.publication_year),
      class_year: norm.value,
      programme: pick(raw, cols.programme) || (norm.value?.startsWith("MYP") ? "MYP" : norm.value?.startsWith("DP") ? "DP" : norm.value?.startsWith("PYP") ? "PYP" : null),
      subject: pick(raw, cols.subject),
      required_optional: pick(raw, cols.required_optional),
      notes: pick(raw, cols.notes),
      import_status: status,
      warning_message: warn,
    });
  }
  return { headers, rows };
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
