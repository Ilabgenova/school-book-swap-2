import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";

/**
 * Number of listings that require admin attention:
 * - pending_review (new submission)
 * - needs_correction just resubmitted (moved back to pending_review by seller_resubmit_listing)
 *
 * Both currently share the `pending_review` status after resubmission.
 */
export const useAdminPendingCount = () => {
  const { isAdmin } = useIsAdmin();
  const [count, setCount] = useState(0);

  const load = async () => {
    const { count: c } = await supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending_review");
    setCount(c || 0);
  };

  useEffect(() => {
    if (!isAdmin) {
      setCount(0);
      return;
    }
    load();
    const ch = supabase
      .channel("admin-pending-listings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "listings" },
        () => load()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [isAdmin]);

  return count;
};
