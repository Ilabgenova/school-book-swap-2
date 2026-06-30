import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type AmazonLink = Database["public"]["Tables"]["amazon_links"]["Row"];

// In-memory cache so we don't refetch on every BookListItem render.
const cache = new Map<string, AmazonLink | null>();

/**
 * Lookup an admin-curated Amazon affiliate link for a book.
 * Matches primarily by ISBN, falls back to exact title match.
 * Returns `null` until an admin manually adds one — never auto-generated.
 */
export function useAmazonLink(isbn?: string, title?: string) {
  const key = isbn || (title ? `t:${title.toLowerCase()}` : "");
  const [link, setLink] = useState<AmazonLink | null>(
    key && cache.has(key) ? cache.get(key)! : null
  );
  const [loading, setLoading] = useState(!!key && !cache.has(key));

  useEffect(() => {
    if (!key) return;
    if (cache.has(key)) {
      setLink(cache.get(key)!);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      let query = supabase.from("amazon_links").select("*").limit(1);
      query = isbn
        ? query.eq("isbn", isbn)
        : query.ilike("title", title ?? "");
      const { data } = await query.maybeSingle();
      if (cancelled) return;
      const value = (data as AmazonLink | null) ?? null;
      cache.set(key, value);
      setLink(value);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [key, isbn, title]);

  return { link, loading };
}
