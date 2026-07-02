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
import { Loader2, ShieldOff, ShieldCheck, ShieldAlert, StickyNote } from "lucide-react";

type Profile = {
  user_id: string; first_name: string; last_name: string; school: string | null;
  account_status: string; blocked_at: string | null; block_reason: string | null;
  suspension_until: string | null; admin_notes: string | null;
  rating_average: number; completed_transactions: number;
};

const REASONS = [
  "Abusive behaviour", "Inappropriate messages", "Fake book listings",
  "Unrelated or inappropriate photos", "Spam", "Scam attempt",
  "Repeated rule violations", "Personal data misuse", "Offensive language", "Other",
];

export const UsersPanel = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ user: Profile; action: "blocked" | "suspended" } | null>(null);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [until, setUntil] = useState("");

  const load = async () => {
    setLoading(true);
    let query = supabase.from("profiles").select("user_id,first_name,last_name,school,account_status,blocked_at,block_reason,suspension_until,admin_notes,rating_average,completed_transactions").order("created_at", { ascending: false }).limit(500);
    const { data, error } = await query;
    if (error) toast.error(error.message); else setUsers((data as any) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = users.filter(u => {
    const s = q.toLowerCase();
    return !s || `${u.first_name} ${u.last_name}`.toLowerCase().includes(s) || u.user_id.includes(s);
  });

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

  const unblock = async (u: Profile) => {
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


  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="Search by name…" value={q} onChange={e => setQ(e.target.value)} className="max-w-sm" />
        <Button variant="outline" size="sm" onClick={load}>Refresh</Button>
      </div>
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <div className="space-y-2">
          {filtered.map(u => (
            <Card key={u.user_id} className="p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium">{u.first_name} {u.last_name}</p>
                  <Badge variant={u.account_status === "active" ? "outline" : u.account_status === "blocked" ? "destructive" : "secondary"}>
                    {u.account_status}
                  </Badge>
                  {u.school && <Badge variant="secondary">{u.school}</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">
                  {u.user_id.slice(0, 8)}… · ★{u.rating_average || 0} · {u.completed_transactions} tx
                </p>
                {u.block_reason && <p className="text-xs text-destructive">Reason: {u.block_reason}</p>}
                {u.admin_notes && <p className="text-xs text-muted-foreground italic">Note: {u.admin_notes}</p>}
              </div>
              <div className="flex gap-2 flex-wrap">
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
          ))}
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
