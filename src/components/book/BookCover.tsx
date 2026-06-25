import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookCoverProps {
  isbn?: string | null;
  title: string;
  className?: string;
  /** Tailwind size classes for the placeholder icon */
  iconClassName?: string;
}

/**
 * Edition-aware book cover lookup.
 * 1. Google Books API by ISBN (returns the cover of the specific edition when available).
 * 2. Fallback to Open Library covers by ISBN.
 * 3. If nothing is found, render a neutral placeholder.
 *
 * Results are cached in-memory per ISBN so the same lookup runs at most once per session.
 */

type CacheEntry = { url: string | null };
const coverCache = new Map<string, Promise<CacheEntry>>();

const cleanIsbn = (isbn: string) => isbn.replace(/[^0-9Xx]/g, "");

const upgradeGoogleThumb = (url: string) =>
  url
    .replace(/^http:\/\//, "https://")
    .replace("&edge=curl", "")
    .replace("zoom=1", "zoom=2");

const probeImage = (url: string) =>
  new Promise<boolean>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.naturalWidth > 2 && img.naturalHeight > 2);
    img.onerror = () => resolve(false);
    img.src = url;
  });

const resolveCover = async (rawIsbn: string): Promise<CacheEntry> => {
  const isbn = cleanIsbn(rawIsbn);
  if (!isbn) return { url: null };

  // 1) Google Books — edition-specific cover
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&maxResults=1&fields=items(volumeInfo/imageLinks)`
    );
    if (res.ok) {
      const data = await res.json();
      const links = data?.items?.[0]?.volumeInfo?.imageLinks;
      const candidate: string | undefined =
        links?.extraLarge || links?.large || links?.medium || links?.thumbnail || links?.smallThumbnail;
      if (candidate) return { url: upgradeGoogleThumb(candidate) };
    }
  } catch {
    // ignore, fall through
  }

  // 2) Open Library — verify the image actually exists (placeholder is 1×1)
  const olUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;
  if (await probeImage(olUrl)) return { url: olUrl };

  return { url: null };
};

const getCover = (isbn: string) => {
  let entry = coverCache.get(isbn);
  if (!entry) {
    entry = resolveCover(isbn);
    coverCache.set(isbn, entry);
  }
  return entry;
};

export const BookCover = ({ isbn, title, className, iconClassName }: BookCoverProps) => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(!!isbn);

  useEffect(() => {
    let cancelled = false;
    if (!isbn) {
      setUrl(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getCover(isbn).then((entry) => {
      if (!cancelled) {
        setUrl(entry.url);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [isbn]);

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-lg bg-muted flex items-center justify-center",
        className
      )}
    >
      {url ? (
        <img
          src={url}
          alt={`Cover of ${title}`}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={() => setUrl(null)}
        />
      ) : (
        <BookOpen
          className={cn(
            "text-muted-foreground/60",
            iconClassName ?? "h-6 w-6",
            loading && "animate-pulse"
          )}
        />
      )}
    </div>
  );
};
