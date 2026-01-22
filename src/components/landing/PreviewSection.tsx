import { useLanguage } from "@/i18n/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Euro, Heart, Tag } from "lucide-react";

// Mock data for preview
const mockListings = [
  {
    id: "1",
    title: "Math Grade 3 - Student Book",
    program: "PYP",
    grade: "PYP 3",
    condition: "asNew",
    type: "sale",
    price: 15,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
  },
  {
    id: "2",
    title: "English Language Arts",
    program: "MYP",
    grade: "MYP 1",
    condition: "used",
    type: "exchange",
    price: null,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop",
  },
  {
    id: "3",
    title: "Science - Biology Workbook",
    program: "DP",
    grade: "DP 1",
    condition: "new",
    type: "donation",
    price: null,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=400&fit=crop",
  },
];

export const PreviewSection = () => {
  const { t } = useLanguage();

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case "new": return t.common.new;
      case "asNew": return t.common.asNew;
      case "used": return t.common.used;
      default: return condition;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "sale": return t.common.sale;
      case "exchange": return t.common.exchange;
      case "donation": return t.common.donation;
      default: return type;
    }
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.nav.browse}
          </h2>
          <p className="text-muted-foreground">
            {t.landing.hero.description}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockListings.map((listing) => (
            <div
              key={listing.id}
              className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-primary/30"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Type badge */}
                <div className="absolute top-3 left-3">
                  <Badge variant={listing.type as "sale" | "exchange" | "donation"}>
                    {listing.type === "donation" && <Heart className="h-3 w-3 mr-1" />}
                    {getTypeLabel(listing.type)}
                  </Badge>
                </div>
                {/* Program badge */}
                <div className="absolute top-3 right-3">
                  <Badge variant={listing.program.toLowerCase() as "pyp" | "myp" | "dp"}>
                    {listing.program}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display font-semibold text-foreground line-clamp-2 text-sm">
                    {listing.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">
                    {listing.grade}
                  </Badge>
                  <Badge variant={listing.condition as "new" | "asNew" | "used"} className="text-xs">
                    {getConditionLabel(listing.condition)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  {listing.type === "sale" && listing.price ? (
                    <span className="font-display font-bold text-lg text-primary flex items-center">
                      <Euro className="h-4 w-4 mr-0.5" />
                      {listing.price}
                    </span>
                  ) : listing.type === "donation" ? (
                    <span className="font-medium text-donation flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {t.common.free}
                    </span>
                  ) : (
                    <span className="font-medium text-accent flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      {t.common.exchange}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {t.common.atSchool}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
