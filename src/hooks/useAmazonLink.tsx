import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { findAmazonLink } from "@/data/amazonLinks2026";

export type AmazonLink = Database["public"]["Tables"]["amazon_links"]["Row"];

/**
 * Result of looking up an Amazon affiliate link for a book.
 * - `url` present  → show "Buy new on Amazon / Compra nuovo su Amazon"
 * - `url` null and `resolved` true → show "Not available on Amazon / Non disponibile su Amazon"
 */
export interface AmazonLinkResult {
  url: string | null;
  loading: boolean;
  resolved: boolean;
  source: "static" | "db" | "none";
}

// In-memory cache for DB lookups to avoid refetching per render.
const dbCache = new Map<string, AmazonLink | null>();

/**
 * Lookup an Amazon affiliate link for a book.
 * 1. Static 2026-2027 map (source of truth from the official school file).
 * 2. Admin-curated overrides in the `amazon_links` table.
 * Returns `resolved=true` once we know whether a link exists, so the UI
 * can show "Not available on Amazon" instead of a broken button.
 */
export function useAmazonLink(isbn?: string, title?: string): AmazonLinkResult {
  const staticUrl = findAmazonLink(isbn, title);
  const key = isbn || (title ? `t:${title.toLowerCase()}` : "");

  const [dbLink, setDbLink] = useState<AmazonLink | null>(
    key && dbCache.has(key) ? dbCache.get(key)! : null
  );
  const [loading, setLoading] = useState(!staticUrl && !!key && !dbCache.has(key));

  useEffect(() => {
    // Static hit — no DB call needed.
    if (staticUrl) {
      setLoading(false);
      return;
    }
    if (!key) {
      setLoading(false);
      return;
    }
    if (dbCache.has(key)) {
      setDbLink(dbCache.get(key)!);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      let query = supabase.from("amazon_links").select("*").limit(1);
      query = isbn ? query.eq("isbn", isbn) : query.ilike("title", title ?? "");
      const { data } = await query.maybeSingle();
      if (cancelled) return;
      const value = (data as AmazonLink | null) ?? null;
      dbCache.set(key, value);
      setDbLink(value);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [key, isbn, title, staticUrl]);

  if (staticUrl) {
    return { url: staticUrl, loading: false, resolved: true, source: "static" };
  }
  const dbUrl =
    dbLink && dbLink.status === "available"
      ? dbLink.affiliate_url || dbLink.amazon_url || null
      : null;
  return {
    url: dbUrl,
    loading,
    resolved: !loading,
    source: dbUrl ? "db" : "none",
  };
}
