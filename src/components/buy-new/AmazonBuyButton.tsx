import { ShoppingBag, Construction, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAmazonLink } from "@/hooks/useAmazonLink";

interface AmazonBuyButtonProps {
  isbn?: string;
  title?: string;
}

/**
 * Shows the "Buy New on Amazon" CTA ONLY when an admin has manually added
 * an affiliate link for this book (matched by ISBN, fallback title).
 * Otherwise renders a disabled "Coming Soon" placeholder.
 *
 * Includes the Amazon Associates affiliate disclosure near the button.
 */
export const AmazonBuyButton = ({ isbn, title }: AmazonBuyButtonProps) => {
  const { link, loading } = useAmazonLink(isbn, title);

  const url = link?.affiliate_url || link?.amazon_url;
  const isAvailable = !loading && link?.status === "available" && !!url;

  if (isAvailable) {
    return (
      <div className="flex flex-col gap-1">
        <Button asChild size="sm" variant="default" className="gap-1">
          <a href={url!} target="_blank" rel="noopener nofollow sponsored">
            <ShoppingBag className="h-3 w-3" />
            Buy new on Amazon
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
        <p className="text-[10px] text-muted-foreground italic">
          As an Amazon Associate, DISbook may earn from qualifying purchases,
          at no extra cost to you.
        </p>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      disabled
      className="gap-1 cursor-not-allowed opacity-60"
    >
      <ShoppingBag className="h-3 w-3" />
      Buy new
      <Badge
        variant="outline"
        className="ml-1 text-[10px] px-1.5 py-0 h-4 border-amber-300 text-amber-600 bg-amber-50"
      >
        <Construction className="h-2.5 w-2.5 mr-0.5" />
        Coming Soon
      </Badge>
    </Button>
  );
};
