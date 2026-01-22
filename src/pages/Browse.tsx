import { MainLayout } from "@/components/layout/MainLayout";
import { LanguageProvider, useLanguage } from "@/i18n/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Euro, Heart, Tag, Search, Filter, X } from "lucide-react";
import { useState } from "react";

// Mock data
const mockListings = [
  {
    id: "1",
    title: "Mathematics - Student Book",
    subject: "Mathematics",
    program: "PYP",
    grade: "PYP 3",
    condition: "asNew",
    type: "sale",
    price: 15,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
    status: "available",
  },
  {
    id: "2",
    title: "English Language Arts",
    subject: "English",
    program: "MYP",
    grade: "MYP 1",
    condition: "used",
    type: "exchange",
    price: null,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop",
    status: "available",
  },
  {
    id: "3",
    title: "Science - Biology Workbook",
    subject: "Science",
    program: "DP",
    grade: "DP 1",
    condition: "new",
    type: "donation",
    price: null,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=400&fit=crop",
    status: "available",
  },
  {
    id: "4",
    title: "History - Ancient Civilizations",
    subject: "History",
    program: "MYP",
    grade: "MYP 2",
    condition: "used",
    type: "sale",
    price: 12,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
    status: "reserved",
  },
  {
    id: "5",
    title: "Art - Creative Expression",
    subject: "Art",
    program: "PYP",
    grade: "PYP 5",
    condition: "asNew",
    type: "donation",
    price: null,
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=400&fit=crop",
    status: "available",
  },
  {
    id: "6",
    title: "Physics HL - Course Companion",
    subject: "Physics",
    program: "DP",
    grade: "DP 2",
    condition: "new",
    type: "sale",
    price: 35,
    image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop",
    status: "available",
  },
];

const programs = ["PYP", "MYP", "DP"];
const types = ["sale", "exchange", "donation"];
const conditions = ["new", "asNew", "used"];

const BrowseContent = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

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

  const filteredListings = mockListings.filter((listing) => {
    if (searchQuery && !listing.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedProgram && listing.program !== selectedProgram) {
      return false;
    }
    if (selectedType && listing.type !== selectedType) {
      return false;
    }
    return true;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedProgram(null);
    setSelectedType(null);
  };

  const hasActiveFilters = searchQuery || selectedProgram || selectedType;

  return (
    <MainLayout>
      <div className="bg-secondary/30 border-b border-border">
        <div className="container py-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            {t.nav.browse}
          </h1>

          {/* Search bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t.common.search + "..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">{t.common.filter}</span>
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-card rounded-lg border border-border animate-slide-up">
              <div className="flex flex-wrap gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Program</p>
                  <div className="flex flex-wrap gap-2">
                    {programs.map((program) => (
                      <Button
                        key={program}
                        variant={selectedProgram === program ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedProgram(selectedProgram === program ? null : program)}
                      >
                        {program}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">{t.common.type}</p>
                  <div className="flex flex-wrap gap-2">
                    {types.map((type) => (
                      <Button
                        key={type}
                        variant={selectedType === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedType(selectedType === type ? null : type)}
                      >
                        {getTypeLabel(type)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  <X className="h-4 w-4" />
                  Clear filters
                </Button>
              )}
            </div>
          )}

          {/* Active filter badges */}
          {hasActiveFilters && !showFilters && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedProgram && (
                <Badge variant={selectedProgram.toLowerCase() as "pyp" | "myp" | "dp"}>
                  {selectedProgram}
                  <button onClick={() => setSelectedProgram(null)} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedType && (
                <Badge variant={selectedType as "sale" | "exchange" | "donation"}>
                  {getTypeLabel(selectedType)}
                  <button onClick={() => setSelectedType(null)} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-primary/5 border-b border-primary/10">
        <div className="container py-3 text-center">
          <p className="text-sm text-primary">
            <BookOpen className="h-4 w-4 inline mr-2" />
            {t.landing.hero.description}
          </p>
        </div>
      </div>

      {/* Listings grid */}
      <div className="container py-8">
        <p className="text-sm text-muted-foreground mb-6">
          {filteredListings.length} {filteredListings.length === 1 ? "book" : "books"} found
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.map((listing) => (
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
                {/* Status overlay */}
                {listing.status === "reserved" && (
                  <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                    <Badge variant="reserved" className="text-sm">
                      {t.common.reserved}
                    </Badge>
                  </div>
                )}
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
                <h3 className="font-display font-semibold text-foreground line-clamp-2 text-sm mb-2">
                  {listing.title}
                </h3>

                <div className="flex items-center gap-2 mb-3 flex-wrap">
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

        {filteredListings.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No books found matching your filters.</p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

const Browse = () => {
  return (
    <LanguageProvider>
      <BrowseContent />
    </LanguageProvider>
  );
};

export default Browse;
