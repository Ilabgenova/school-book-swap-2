import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, ShieldOff, ShieldCheck, ShieldAlert, Mail, MailCheck } from "lucide-react";

type EnrichedUser = {
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  school: string | null;
  account_status: string;
  block_reason: string | null;
  admin_notes: string | null;
  suspension_until: string | null;
  rating_average: number;
  completed_transactions: number;
  created_at: string | null;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
  is_admin: boolean;
  listings_count: number;
  active_listings_count: number;
  sold_listings_count: number;
};

const REASONS = [
  "Abusive behaviour", "Inappropriate messages", "Fake book listings",
  "Unrelated or inappropriate photos", "Spam", "Scam attempt",
  "Repeated rule violations", "Personal data misuse", "Offensive language", "Other",
];

export const UsersPanel = () => {
  const [users, setUsers] = useState<EnrichedUser[]>([]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "pending">("all");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ user: EnrichedUser; action: "blocked" | "suspended" } | null>(null);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [until, setUntil] = useState("");
  const [resendingFor, setResendingFor] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("admin_list_users_with_auth" as any);
    if (error) toast.error(error.message);
    else setUsers(((data as any) || []) as EnrichedUser[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = users.filter(u => {
    const s = q.toLowerCase();
    const matchesText = !s
      || `${u.first_name ?? ""} ${u.last_name ?? ""}`.toLowerCase().includes(s)
      || (u.email ?? "").toLowerCase().includes(s);
    const confirmed = !!u.email_confirmed_at;
    const matchesStatus =
      statusFilter === "all"
      || (statusFilter === "confirmed" && confirmed)
      || (statusFilter === "pending" && !confirmed);
    return matchesText && matchesStatus;
  });

  const pendingCount = users.filter(u => !u.email_confirmed_at).length;

  const applyModeration = async () => {
    if (!modal) return;
    if (!reason) return toast.error("Reason required");
    const { user, action } = modal;
    const { error } = await supabase.rpc("admin_moderate_user", {
      _user_id: user.user_id,
      _action: action,
      _reason: reason,
      _internal_note: note || null,
      _suspension_until: action === "suspended" && until ? new Date(until).toISOString() : null,
    });
    if (error) return toast.error(error.message);
    toast.success(`User ${action}`);
    setModal(null); setReason(""); setNote(""); setUntil("");
    load();
  };

  const unblock = async (u: EnrichedUser) => {
    if (!confirm(`Unblock ${u.first_name} ${u.last_name}?`)) return;
    const { error } = await supabase.rpc("admin_moderate_user", {
      _user_id: u.user_id,
      _action: "unblocked",
      _reason: "Admin unblock",
      _internal_note: null,
      _suspension_until: null,
    });
    if (error) return toast.error(error.message);
    toast.success("User unblocked");
    load();
  };

  const resendConfirmation = async (u: EnrichedUser) => {
    if (!u.email) return toast.error("No email on file");
    setResendingFor(u.user_id);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: u.email,
      options: { emailRedirectTo: `${window.location.origin}/browse` },
    });
    setResendingFor(null);
    if (error) return toast.error(error.message);
    toast.success(`Confirmation email resent to ${u.email}`);
  };

  const fmtDate = (d: string | null) => d ? new Date(d).toLocaleDateString() : "—";

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Input placeholder="Search by name or email…" value={q} onChange={e => setQ(e.target.value)} className="max-w-sm" />
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All users ({users.length})</SelectItem>
            <SelectItem value="confirmed">Confirmed ({users.length - pendingCount})</SelectItem>
            <SelectItem value="pending">Pending confirmation ({pendingCount})</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={load}>Refresh</Button>
      </div>

      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <div className="space-y-2">
          {filtered.map(u => {
            const confirmed = !!u.email_confirmed_at;
            return (
              <Card key={u.user_id} className="p-3 flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium">
                      {(u.first_name || "").trim() || "—"} {(u.last_name || "").trim()}
                    </p>
                    {u.is_admin && <Badge variant="default">admin</Badge>}
                    <Badge variant={confirmed ? "outline" : "secondary"} className={confirmed ? "" : "bg-amber-100 text-amber-900 border-amber-300"}>
                      {confirmed
                        ? <><MailCheck className="h-3 w-3 mr-1" />Confirmed</>
                        : <><Mail className="h-3 w-3 mr-1" />Pending confirmation / In attesa di conferma</>}
                    </Badge>
                    <Badge variant={u.account_status === "active" ? "outline" : u.account_status === "blocked" ? "destructive" : "secondary"}>
                      {u.account_status}
                    </Badge>
                    {u.school && <Badge variant="secondary">{u.school}</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 break-all">
                    {u.email || "(no email)"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Registered {fmtDate(u.created_at)} · Last sign-in {fmtDate(u.last_sign_in_at)} · ★{u.rating_average || 0} · {u.completed_transactions} tx
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Listings: {u.listings_count} total · {u.active_listings_count} active · {u.sold_listings_count} sold
                  </p>
                  {u.block_reason && <p className="text-xs text-destructive">Reason: {u.block_reason}</p>}
                  {u.admin_notes && <p className="text-xs text-muted-foreground italic">Note: {u.admin_notes}</p>}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {!confirmed && (
                    <Button size="sm" variant="outline" onClick={() => resendConfirmation(u)} disabled={resendingFor === u.user_id}>
                      {resendingFor === u.user_id
                        ? <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        : <Mail className="h-4 w-4 mr-1" />}
                      Resend confirmation / Reinvia
                    </Button>
                  )}
                  {u.account_status === "active" && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => { setModal({ user: u, action: "suspended" }); }}>
                        <ShieldAlert className="h-4 w-4 mr-1" />Suspend
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => { setModal({ user: u, action: "blocked" }); }}>
                        <ShieldOff className="h-4 w-4 mr-1" />Block
                      </Button>
                    </>
                  )}
                  {u.account_status !== "active" && (
                    <Button size="sm" variant="outline" onClick={() => unblock(u)}>
                      <ShieldCheck className="h-4 w-4 mr-1" />Unblock
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
          {filtered.length === 0 && <p className="text-sm text-muted-foreground">No users.</p>}
        </div>
      )}

      <Dialog open={!!modal} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modal?.action === "blocked" ? "Block user" : "Suspend user"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {modal?.action === "blocked" && (
              <p className="text-sm text-muted-foreground">
                Are you sure? Their listings and wanted posts will be hidden and they will no longer be able to contact other users.
              </p>
            )}
            <div>
              <label className="text-xs text-muted-foreground">Reason *</label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                <SelectContent>
                  {REASONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {modal?.action === "suspended" && (
              <div>
                <label className="text-xs text-muted-foreground">Suspend until (optional)</label>
                <Input type="datetime-local" value={until} onChange={e => setUntil(e.target.value)} />
              </div>
            )}
            <div>
              <label className="text-xs text-muted-foreground">Internal admin note (not visible to user)</label>
              <Textarea value={note} onChange={e => setNote(e.target.value)} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
            <Button variant={modal?.action === "blocked" ? "destructive" : "default"} onClick={applyModeration}>
              Confirm {modal?.action}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
