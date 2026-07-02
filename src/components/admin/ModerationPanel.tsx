import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Report = {
  id: string; reporter_id: string; target_type: string; target_id: string;
  reason: string; description: string | null; status: string;
  admin_notes: string | null; created_at: string;
};

export const ModerationPanel = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("reports" as any).select("*").order("created_at", { ascending: false }).limit(200);
    if (error) toast.error(error.message); else setReports((data as any) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: string) => {
    const { data: userRes } = await supabase.auth.getUser();
    const { error } = await supabase.from("reports" as any).update({
      status, reviewed_by: userRes.user!.id, reviewed_at: new Date().toISOString(),
    }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Report ${status}`); load();
  };

  const hideListing = async (r: Report) => {
    if (r.target_type !== "listing") return;
    const { error } = await supabase.from("listings").update({ status: "archived" as any }).eq("id", r.target_id);
    if (error) return toast.error(error.message);
    toast.success("Listing hidden");
    setStatus(r.id, "actioned");
  };

  return (
    <div className="space-y-3">
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : reports.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reports yet.</p>
      ) : (
        reports.map(r => (
          <Card key={r.id} className="p-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">{r.target_type}</Badge>
                <Badge variant={r.status === "open" ? "destructive" : "outline"}>{r.status}</Badge>
                <p className="text-sm font-medium">{r.reason}</p>
              </div>
              {r.description && <p className="text-xs text-muted-foreground mt-1">{r.description}</p>}
              <p className="text-[11px] text-muted-foreground">
                Target: {r.target_id.slice(0, 8)}… · Reporter: {r.reporter_id.slice(0, 8)}… · {new Date(r.created_at).toLocaleDateString()}
              </p>
            </div>
            {r.status === "open" && (
              <div className="flex gap-2 flex-wrap">
                {r.target_type === "listing" && (
                  <Button size="sm" variant="destructive" onClick={() => hideListing(r)}>Hide listing</Button>
                )}
                <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "dismissed")}>Dismiss</Button>
                <Button size="sm" onClick={() => setStatus(r.id, "actioned")}>Mark actioned</Button>
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  );
};
