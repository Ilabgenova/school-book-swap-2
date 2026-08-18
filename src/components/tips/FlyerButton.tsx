import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileDown, Loader2 } from "lucide-react";

export const getFlyerSignedUrl = async (path: string) => {
  const { data, error } = await supabase.storage.from("tip-flyers").createSignedUrl(path, 300);
  if (error || !data?.signedUrl) throw new Error(error?.message ?? "Flyer not available");
  return data.signedUrl;
};

export const FlyerButton = ({
  path,
  label,
  variant = "outline",
  size = "sm",
}: {
  path: string;
  label: string;
  variant?: "outline" | "secondary" | "default";
  size?: "sm" | "default";
}) => {
  const [loading, setLoading] = useState(false);

  const open = async () => {
    setLoading(true);
    try {
      const url = await getFlyerSignedUrl(path);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Flyer not available");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button type="button" variant={variant} size={size} onClick={open} disabled={loading} className="gap-1.5">
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileDown className="h-3.5 w-3.5" />}
      {label}
    </Button>
  );
};
