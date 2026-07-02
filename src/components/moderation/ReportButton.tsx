import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Flag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";
import { toast } from "sonner";

const REASONS: { value: string; en: string; it: string }[] = [
  { value: "Fake listing", en: "Fake listing", it: "Annuncio falso" },
  { value: "Inappropriate photo", en: "Inappropriate photo", it: "Foto inappropriata" },
  { value: "Abusive message", en: "Abusive message", it: "Messaggio offensivo" },
  { value: "Spam", en: "Spam", it: "Spam" },
  { value: "Scam attempt", en: "Scam attempt", it: "Tentativo di truffa" },
  { value: "Personal data issue", en: "Personal data issue", it: "Problema di dati personali" },
  { value: "Other", en: "Other", it: "Altro" },
];

const TARGET_LABELS: Record<string, { en: string; it: string }> = {
  listing: { en: "listing", it: "annuncio" },
  wanted: { en: "wanted book", it: "libro cercato" },
  user: { en: "user", it: "utente" },
  message: { en: "message", it: "messaggio" },
};

type Props = {
  targetType: "listing" | "wanted" | "user" | "message";
  targetId: string;
  size?: "sm" | "icon";
  variant?: "ghost" | "outline";
};

export const ReportButton = ({ targetType, targetId, size = "sm", variant = "ghost" }: Props) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isIT = language === "it";
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!user) return toast.error(isIT ? "Accedi per segnalare" : "Please sign in to report");
    if (!reason) return toast.error(isIT ? "Seleziona un motivo" : "Select a reason");
    setBusy(true);
    const { error } = await supabase.from("reports" as any).insert({
      reporter_id: user.id, target_type: targetType, target_id: targetId,
      reason, description: description || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(isIT ? "Segnalazione inviata. Gli admin la esamineranno." : "Report submitted. Admins will review it.");
    setOpen(false); setReason(""); setDescription("");
  };

  const targetLabel = TARGET_LABELS[targetType] ? (isIT ? TARGET_LABELS[targetType].it : TARGET_LABELS[targetType].en) : targetType;

  return (
    <>
      <Button
        size={size} variant={variant}
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        title={isIT ? "Segnala" : "Report"}
        className="text-muted-foreground hover:text-destructive"
      >
        <Flag className="h-3.5 w-3.5" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isIT ? `Segnala questo ${targetLabel}` : `Report this ${targetLabel}`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger><SelectValue placeholder={isIT ? "Motivo" : "Reason"} /></SelectTrigger>
              <SelectContent>
                {REASONS.map(r => (
                  <SelectItem key={r.value} value={r.value}>{isIT ? r.it : r.en}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea placeholder={isIT ? "Dettagli (facoltativo)" : "Details (optional)"} value={description} onChange={e => setDescription(e.target.value)} rows={3} />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>{isIT ? "Annulla" : "Cancel"}</Button>
            <Button onClick={submit} disabled={busy}>{isIT ? "Invia segnalazione" : "Submit report"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
