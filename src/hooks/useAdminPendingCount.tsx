import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";

/**
 * Attention count for the Admin section:
 * - listings with status = 'pending_review' (new + seller-resubmitted)
 * - feedback_reports with status = 'open'
 */
export const useAdminPendingCount = () => {
  const { isAdmin } = useIsAdmin();
  const [count, setCount] = useState(0);

  const load = async () => {
    const [listingsRes, feedbackRes] = await Promise.all([
      supabase
        .from("listings")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending_review"),
      supabase
        .from("feedback_reports")
        .select("id", { count: "exact", head: true })
        .eq("status", "open"),
    ]);
    setCount((listingsRes.count || 0) + (feedbackRes.count || 0));
  };

  useEffect(() => {
    if (!isAdmin) {
      setCount(0);
      return;
    }
    load();
    const ch = supabase
      .channel("admin-attention")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "listings" },
        () => load()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "feedback_reports" },
        () => load()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [isAdmin]);

  return count;
};
