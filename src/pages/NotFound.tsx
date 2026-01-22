import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen } from "lucide-react";
import { LanguageProvider, useLanguage } from "@/i18n/LanguageContext";
import { useEffect } from "react";

const NotFoundContent = () => {
  const { t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="container flex flex-col items-center justify-center min-h-[60vh] text-center py-16">
        <div className="mb-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted mb-6 mx-auto">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            404
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {t.errors.notFound}
          </p>
        </div>

        <Link to="/">
          <Button variant="default" size="lg">
            <Home className="h-5 w-5" />
            {t.nav.home}
          </Button>
        </Link>
      </div>
    </MainLayout>
  );
};

const NotFound = () => {
  return (
    <LanguageProvider>
      <NotFoundContent />
    </LanguageProvider>
  );
};

export default NotFound;
