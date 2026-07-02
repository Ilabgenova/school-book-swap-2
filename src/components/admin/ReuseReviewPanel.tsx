import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Check, X, HelpCircle, Link2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type CatalogRow = {
  id: string;
  academic_year: string | null;
  school_year: string | null;
  previous_year: string | null;
  grade: string | null;
  subject: string | null;
  title: string;
  author: string | null;
  publisher: string | null;
  isbn: string | null;
  purchasable_from_former_families: boolean | null;
  former_class_source: string | null;
  reuse_check_status: string | null;
  reuse_match_type: string | null;
  reuse_notes: string | null;
  previous_year_book_id: string | null;
  column_m_raw: string | null;
};

const SUPPORTED = ["MYP1", "MYP2", "MYP3", "MYP4", "MYP5", "DP1", "DP2"];

const STATUS_COLORS: Record<string, string> = {
  reusable: "default",
  needs_manual_review: "secondary",
  no_previous_match: "destructive",
  not_reusable: "outline",
  pending: "outline",
};

export const ReuseReviewPanel = () => {
  const [year, setYear] = useState("2026-2027");
  const [status, setStatus] = useState<string>("needs_manual_review");
  const [rows, setRows] = useState<CatalogRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [edits, setEdits] = useState<Record<string, Partial<CatalogRow>>>({});

  const load = async () => {
    setLoading(true);
    let q: any = supabase.from("book_catalog")
      .select("*")
      .eq("academic_year", year)
      .order("grade")
      .order("subject")
      .limit(1000);
    if (status !== "all") q = q.eq("reuse_check_status", status);
    const { data, error } = await q;
    if (error) toast.error(error.message);
    else setRows(((data as any) || []).filter((r: CatalogRow) => !(r.grade || "").startsWith("PYP")));
    setEdits({});
    setLoading(false);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [year, status]);

  const patch = (id: string, p: Partial<CatalogRow>) => {
    setEdits((prev) => ({ ...prev, [id]: { ...prev[id], ...p } }));
  };

  const save = async (row: CatalogRow) => {
    const p = edits[row.id];
    if (!p) return toast.info("No changes");
    const { error } = await (supabase.from("book_catalog") as any).update(p).eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    load();
  };

  const quickAction = async (row: CatalogRow, action: "confirm" | "reject" | "review") => {
    const p: Partial<CatalogRow> =
      action === "confirm"
        ? { reuse_check_status: "reusable", reuse_match_type: (row.reuse_match_type as any) || "manual" }
        : action === "reject"
        ? { reuse_check_status: "not_reusable", reuse_match_type: "none" }
        : { reuse_check_status: "needs_manual_review" };
    const { error } = await supabase.from("book_catalog").update(p as any).eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    load();
  };

  const linkManually = async (row: CatalogRow) => {
    const isbn = prompt("Enter previous-year ISBN to link this book to:", row.isbn || "");
    if (!isbn) return;
    const clean = isbn.replace(/[^0-9Xx]/g, "");
    const { data, error } = await supabase.from("book_catalog")
      .select("id")
      .eq("isbn", clean)
      .eq("academic_year", row.previous_year || "")
      .maybeSingle();
    if (error) return toast.error(error.message);
    if (!data) return toast.error("No previous-year book found with that ISBN");
    const { error: upErr } = await supabase.from("book_catalog").update({
      previous_year_book_id: (data as any).id,
      reuse_check_status: "reusable",
      reuse_match_type: "manual",
      reuse_notes: `Manually linked to previous-year ISBN ${clean}`,
    } as any).eq("id", row.id);
    if (upErr) return toast.error(upErr.message);
    toast.success("Linked");
    load();
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <p className="text-sm text-muted-foreground mb-3">
          Review every 2026-2027 book flagged via column M
          <span className="font-mono mx-1">“Purchasable from former XXX families”</span>.
          Confirm strong matches, reject bad ones, or link manually to a previous-year book.
        </p>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs text-muted-foreground">Academic year</label>
            <Input value={year} onChange={e => setYear(e.target.value)} className="w-40" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Reuse status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="reusable">Reusable (strong)</SelectItem>
                <SelectItem value="needs_manual_review">Needs manual review</SelectItem>
                <SelectItem value="no_previous_match">No previous-year match</SelectItem>
                <SelectItem value="not_reusable">Not reusable</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm" onClick={load}>Refresh</Button>
        </div>
      </Card>

      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <Card className="p-0 overflow-hidden">
          <div className="max-h-[600px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Col M</TableHead>
                  <TableHead>Former</TableHead>
                  <TableHead>Match</TableHead>
                  <TableHead>Reuse</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => {
                  const e = edits[r.id] || {};
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="max-w-[260px]">
                        <p className="font-medium text-sm truncate">{r.title}</p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {r.subject || "—"} · {r.author || "—"}
                        </p>
                        <p className="text-[10px] font-mono text-muted-foreground">
                          ISBN {r.isbn || "—"}
                        </p>
                      </TableCell>
                      <TableCell className="text-xs">{r.grade}</TableCell>
                      <TableCell className="text-[11px]">
                        {r.purchasable_from_former_families === true ? (
                          <Badge className="bg-emerald-600 hover:bg-emerald-600 text-[10px]">YES</Badge>
                        ) : r.purchasable_from_former_families === false ? (
                          <Badge variant="outline" className="text-[10px]">NO</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">{r.column_m_raw || "—"}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Input
                          value={(e.former_class_source ?? r.former_class_source) || ""}
                          onChange={ev => patch(r.id, { former_class_source: ev.target.value })}
                          className="h-7 text-xs w-20"
                        />
                      </TableCell>
                      <TableCell className="text-[11px]">{r.reuse_match_type || "none"}</TableCell>
                      <TableCell>
                        <Badge variant={(STATUS_COLORS[r.reuse_check_status || "pending"] as any) || "outline"} className="text-[10px]">
                          {r.reuse_check_status || "pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="min-w-[180px]">
                        <Textarea
                          value={(e.reuse_notes ?? r.reuse_notes) || ""}
                          onChange={ev => patch(r.id, { reuse_notes: ev.target.value })}
                          className="text-xs min-h-[40px]"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Button size="sm" variant="outline" onClick={() => quickAction(r, "confirm")} title="Confirm reusable">
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => quickAction(r, "reject")} title="Reject">
                            <X className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => quickAction(r, "review")} title="Mark as needs manual review">
                            <HelpCircle className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => linkManually(r)} title="Link to previous-year book">
                            <Link2 className="h-3 w-3" />
                          </Button>
                          {edits[r.id] && (
                            <Button size="sm" onClick={() => save(r)} title="Save edits">
                              <Save className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {rows.length === 0 && (
                  <TableRow><TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-6">
                    No books match this filter.
                  </TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
};
