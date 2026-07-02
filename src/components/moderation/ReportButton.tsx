import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Flag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const REASONS = ["Fake listing", "Inappropriate photo", "Abusive message", "Spam", "Scam attempt", "Personal data issue", "Other"];

type Props = {
  targetType: "listing" | "wanted" | "user" | "message";
  targetId: string;
  size?: "sm" | "icon";
  variant?: "ghost" | "outline";
};

export const ReportButton = ({ targetType, targetId, size = "sm", variant = "ghost" }: Props) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!user) return toast.error("Please sign in to report");
    if (!reason) return toast.error("Select a reason");
    setBusy(true);
    const { error } = await supabase.from("reports" as any).insert({
      reporter_id: user.id, target_type: targetType, target_id: targetId,
      reason, description: description || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Report submitted. Admins will review it.");
    setOpen(false); setReason(""); setDescription("");
  };

  return (
    <>
      <Button
        size={size} variant={variant}
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        title="Report"
        className="text-muted-foreground hover:text-destructive"
      >
        <Flag className="h-3.5 w-3.5" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Report this {targetType}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger><SelectValue placeholder="Reason" /></SelectTrigger>
              <SelectContent>
                {REASONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
            <Textarea placeholder="Details (optional)" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} disabled={busy}>Submit report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
