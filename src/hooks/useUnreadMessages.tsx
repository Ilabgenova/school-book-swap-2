import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const useUnreadMessages = () => {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  const load = async (uid: string) => {
    // Get user's conversations
    const { data: convs } = await supabase
      .from("conversations")
      .select("id")
      .or(`buyer_id.eq.${uid},seller_id.eq.${uid}`);
    const ids = (convs || []).map((c: any) => c.id);
    if (!ids.length) {
      setCount(0);
      return;
    }
    const { count: c } = await supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .in("conversation_id", ids)
      .neq("sender_id", uid)
      .is("read_at", null);
    setCount(c || 0);
  };

  useEffect(() => {
    if (!user) {
      setCount(0);
      return;
    }
    load(user.id);
    const ch = supabase
      .channel(`unread-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        () => load(user.id)
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [user]);

  return count;
};
