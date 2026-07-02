import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const useIsAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.rpc("current_user_is_admin");
      if (!cancelled) {
        setIsAdmin(!error && data === true);
        setLoading(false);
      }
    };
    check();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return { isAdmin, loading };
};
