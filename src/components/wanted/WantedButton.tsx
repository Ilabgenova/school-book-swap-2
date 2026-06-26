import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { OfficialBook } from "@/data/officialBooks";

interface WantedButtonProps {
  book: OfficialBook;
}

export const WantedButton = ({ book }: WantedButtonProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [wanted, setWanted] = useState(false);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { count: total } = await supabase
        .from("wanted_books")
        .select("id", { count: "exact", head: true })
        .eq("book_id", book.id);
      if (!cancelled) setCount(total ?? 0);

      if (user) {
        const { data } = await supabase
          .from("wanted_books")
          .select("id")
          .eq("book_id", book.id)
          .eq("user_id", user.id)
          .maybeSingle();
        if (!cancelled) setWanted(!!data);
      } else if (!cancelled) {
        setWanted(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [book.id, user]);

  const toggle = async () => {
    if (!user) {
      navigate(`/login?next=${encodeURIComponent("/buy")}`);
      return;
    }
    setLoading(true);
    try {
      if (wanted) {
        const { error } = await supabase
          .from("wanted_books")
          .delete()
          .eq("user_id", user.id)
          .eq("book_id", book.id);
        if (error) throw error;
        setWanted(false);
        setCount((c) => Math.max(0, (c ?? 1) - 1));
        toast.success("Removed from wanted list");
      } else {
        const { error } = await supabase.from("wanted_books").insert([{
          user_id: user.id,
          book_id: book.id,
          title: book.title,
          isbn: book.isbn ?? null,
          subject: book.subject,
          program: book.program,
          class_year: book.grade,
        }]);
        if (error) throw error;
        setWanted(true);
        setCount((c) => (c ?? 0) + 1);
        toast.success("Added to wanted list — sellers will see it");
      }
    } catch (err: any) {
      toast.error(err.message || "Could not update wanted list");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant={wanted ? "default" : "outline"}
      onClick={toggle}
      disabled={loading}
      className="gap-1"
    >
      {loading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Heart className={`h-3 w-3 ${wanted ? "fill-current" : ""}`} />
      )}
      {wanted ? "Wanted" : "Mark as wanted"}
      {count !== null && count > 0 && (
        <Badge variant="outline" className="ml-1 h-4 px-1.5 text-[10px]">
          {count}
        </Badge>
      )}
    </Button>
  );
};
