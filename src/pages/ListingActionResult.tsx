import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

type Variant = "success" | "error" | "info";

interface Content {
  variant: Variant;
  title: string;
  message: string;
  cta: { label: string; to: string };
}

const CONTENT: Record<string, Content> = {
  still_available: {
    variant: "success",
    title: "Listing confirmed",
    message:
      "Thank you. Your DISbook listing has been confirmed as still available. We will remind you again in about two weeks if it is still active.",
    cta: { label: "Go to My Books", to: "/my-books" },
  },
  marked_sold: {
    variant: "success",
    title: "Listing marked as Sold",
    message:
      "Thank you. Your DISbook listing has been marked as Sold and will no longer appear as available.",
    cta: { label: "Go to My Books", to: "/my-books" },
  },
  already_sold: {
    variant: "info",
    title: "Already marked as Sold",
    message:
      "This listing is already marked as Sold. Please log in if you want to change it.",
    cta: { label: "Log in to DISbook", to: "/login" },
  },
  not_active: {
    variant: "info",
    title: "Listing not active",
    message:
      "This listing is not active anymore. Please log in to review its current status.",
    cta: { label: "Log in to DISbook", to: "/login" },
  },
  account_blocked: {
    variant: "error",
    title: "Action not allowed",
    message: "This account cannot update listings at this time.",
    cta: { label: "Log in to DISbook", to: "/login" },
  },
  expired: {
    variant: "error",
    title: "Link expired",
    message:
      "This link is no longer valid. Please log in to DISbook and update your listing from My Books.",
    cta: { label: "Log in to DISbook", to: "/login" },
  },
  used: {
    variant: "info",
    title: "Link already used",
    message:
      "This link has already been used. Please log in to DISbook to view your listing.",
    cta: { label: "Log in to DISbook", to: "/login" },
  },
  invalid: {
    variant: "error",
    title: "Invalid link",
    message:
      "This link is no longer valid. Please log in to DISbook and update your listing from My Books.",
    cta: { label: "Log in to DISbook", to: "/login" },
  },
  error: {
    variant: "error",
    title: "Something went wrong",
    message: "Please try again later, or log in to DISbook to update your listing.",
    cta: { label: "Log in to DISbook", to: "/login" },
  },
};

const ListingActionResult = () => {
  const [params] = useSearchParams();
  const status = params.get("status") ?? "invalid";
  const content = CONTENT[status] ?? CONTENT.invalid;

  const Icon =
    content.variant === "success"
      ? CheckCircle2
      : content.variant === "error"
        ? XCircle
        : AlertCircle;

  const iconColor =
    content.variant === "success"
      ? "text-primary"
      : content.variant === "error"
        ? "text-destructive"
        : "text-muted-foreground";

  return (
    <MainLayout>
      <div className="container max-w-lg mx-auto py-16 px-4">
        <Card>
          <CardHeader className="text-center">
            <Icon className={`w-12 h-12 mx-auto mb-3 ${iconColor}`} />
            <CardTitle className="text-2xl">{content.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-muted-foreground">{content.message}</p>
            <Button asChild size="lg">
              <Link to={content.cta.to}>{content.cta.label}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ListingActionResult;
