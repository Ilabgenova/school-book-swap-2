import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/**
 * Attention count for the seller's "My Books" section.
 * Counts the user's own listings that require action:
 *  - pending_review (waiting for admin approval)
 *  - needs_correction (admin asked for changes)
 */
export const useMyBooksAttentionCount = () => {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  const load = async (uid: string) => {
    const { count: c } = await supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("seller_id", uid)
      .in("status", ["pending_review", "needs_correction"]);
    setCount(c || 0);
  };

  useEffect(() => {
    if (!user) {
      setCount(0);
      return;
    }
    load(user.id);
    const ch = supabase
      .channel(`mybooks-attention-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "listings", filter: `seller_id=eq.${user.id}` },
        () => load(user.id)
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [user]);

  return count;
};
