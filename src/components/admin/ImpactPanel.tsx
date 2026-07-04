import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Leaf, Save } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";

type Stats = {
  total_listed: number;
  active_listings: number;
  pending_approvals: number;
  needs_correction: number;
  total_sold: number;
  books_sold: number;
  books_reused_through_disbook: number;
  keyboards_sold: number;
  sphero_sold: number;
  co2_kg_per_book: number;
  estimated_co2_avoided_kg: number;
};

export const ImpactPanel = () => {
  const { language } = useLanguage();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [coef, setCoef] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("admin_get_impact_stats");
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    setStats(data as any);
    setCoef(String((data as any)?.co2_kg_per_book ?? ""));
    const { data: noteRow } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "co2_source_note")
      .maybeSingle();
    setNote(typeof noteRow?.value === "string" ? (noteRow.value as string) : "");
    setLoading(false);
  };

  const saveNote = async () => {
    setSavingNote(true);
    const { error } = await supabase
      .from("app_settings")
      .upsert({ key: "co2_source_note", value: note as any, updated_at: new Date().toISOString() });
    setSavingNote(false);
    if (error) return toast.error(error.message);
    toast.success(language === "it" ? "Nota aggiornata" : "Note updated");
  };

  useEffect(() => {
    load();
  }, []);

  const saveCoef = async () => {
    const n = Number(coef);
    if (!Number.isFinite(n) || n < 0) {
      toast.error(language === "it" ? "Valore non valido" : "Invalid value");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("app_settings")
      .upsert({ key: "co2_kg_per_book", value: n as any, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(language === "it" ? "Coefficiente aggiornato" : "Coefficient updated");
    load();
  };

  const T = (it: string, en: string) => (language === "it" ? it : en);

  if (loading || !stats) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  const Stat = ({ label, value, hint }: { label: string; value: string | number; hint?: string }) => (
    <Card className="p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Leaf className="h-4 w-4 text-success" />
          {T("Impatto economia circolare", "Circular economy impact")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {T(
            "Statistiche sui libri e articoli riutilizzati tramite DISbook.",
            "Statistics on books and items reused through DISbook."
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label={T("Annunci attivi", "Active listings")} value={stats.active_listings} />
        <Stat label={T("In attesa di approvazione", "Pending approval")} value={stats.pending_approvals} />
        <Stat label={T("Articoli venduti", "Sold items")} value={stats.total_sold} />
        <Stat label={T("Totale annunci", "Total listed")} value={stats.total_listed} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label={T("Libri venduti", "Books sold")} value={stats.books_sold} />
        <Stat
          label={T("Libri riutilizzati", "Books reused")}
          value={stats.books_reused_through_disbook}
          hint={T("tramite DISbook", "through DISbook")}
        />
        <Stat label={T("Tastiere vendute", "Keyboards sold")} value={stats.keyboards_sold} />
        <Stat label={T("Sphero venduti", "Sphero sold")} value={stats.sphero_sold} />
      </div>

      <Card className="p-4 bg-success/5 border-success/30">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {T("CO₂ stimata evitata", "Estimated CO₂ avoided")}
        </p>
        <p className="text-3xl font-bold mt-1 flex items-center gap-2">
          <Leaf className="h-6 w-6 text-success" />
          {stats.estimated_co2_avoided_kg.toFixed(1)} kg CO₂e
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {T(
            `Calcolo: ${stats.books_sold} libri × ${stats.co2_kg_per_book} kg CO₂e per libro`,
            `Calculation: ${stats.books_sold} books × ${stats.co2_kg_per_book} kg CO₂e per book`
          )}
        </p>
      </Card>

      <Card className="p-4">
        <Label>{T("CO₂ evitata per libro riutilizzato (kg CO₂e)", "CO₂ avoided per reused book (kg CO₂e)")}</Label>
        <div className="mt-2 flex gap-2 max-w-sm">
          <Input
            type="number"
            step="0.1"
            min="0"
            value={coef}
            onChange={(e) => setCoef(e.target.value)}
          />
          <Button onClick={saveCoef} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {T("Salva", "Save")}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {T(
            "Questo coefficiente sarà aggiornato in futuro quando avremo dati più precisi.",
            "This coefficient can be updated later when more precise data is available."
          )}
        </p>
      </Card>

      <Card className="p-4">
        <Label>{T("Fonte / nota esplicativa", "Source / explanation note")}</Label>
        <Textarea
          className="mt-2"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={T("Es. Fonte: ...", "e.g. Source: ...")}
        />
        <div className="mt-2 flex justify-end">
          <Button onClick={saveNote} disabled={savingNote} size="sm">
            {savingNote ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {T("Salva nota", "Save note")}
          </Button>
        </div>
      </Card>
    </div>
  );
};
