import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ThumbsUp, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  tipId: string;
  it: boolean;
  enabled?: boolean;
  initialThumbs: number;
  initialHearts: number;
  initialMine: string[];
};

export const TipReactions = ({
  tipId,
  it,
  enabled = true,
  initialThumbs,
  initialHearts,
  initialMine,
}: Props) => {
  const { user } = useAuth();
  const [thumbs, setThumbs] = useState(initialThumbs);
  const [hearts, setHearts] = useState(initialHearts);
  const [mine, setMine] = useState<string[]>(initialMine ?? []);
  const [busy, setBusy] = useState<string | null>(null);

  if (!enabled) return null;

  const react = async (type: "thumbs_up" | "heart") => {
    if (!user) {
      toast.error(
        it ? "Accedi per reagire ai consigli della community." : "Please log in to react to community tips."
      );
      return;
    }
    setBusy(type);
    const { data, error } = await supabase.rpc("toggle_tip_reaction", {
      _tip_id: tipId,
      _reaction_type: type,
    });
    setBusy(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    const res = data as { thumbs_up_count: number; heart_count: number; my_reactions: string[] };
    setThumbs(res.thumbs_up_count ?? 0);
    setHearts(res.heart_count ?? 0);
    setMine(res.my_reactions ?? []);
  };

  const btn = (
    type: "thumbs_up" | "heart",
    Icon: typeof ThumbsUp,
    count: number,
    label: string
  ) => {
    const active = mine.includes(type);
    return (
      <button
        type="button"
        aria-label={label}
        aria-pressed={active}
        disabled={busy === type}
        onClick={() => react(type)}
        className={cn(
          "inline-flex min-h-[40px] items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60",
          active
            ? "border-accent bg-accent/10 text-accent"
            : "border-border text-muted-foreground hover:text-foreground hover:border-accent/50"
        )}
      >
        <Icon className={cn("h-4 w-4", active && "fill-current")} />
        <span className="tabular-nums">{count}</span>
      </button>
    );
  };

  return (
    <div className="flex items-center gap-2 pt-1">
      {btn("thumbs_up", ThumbsUp, thumbs, it ? "Mi piace" : "Thumbs up")}
      {btn("heart", Heart, hearts, it ? "Adoro" : "Heart")}
    </div>
  );
};
