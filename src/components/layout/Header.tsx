import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Menu, X, Plus, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export const Header = () => {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md group-hover:shadow-glow transition-shadow">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold text-foreground hidden sm:inline">
            DISbook
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/browse">
            <Button variant="ghost" size="sm">
              {t.nav.browse}
            </Button>
          </Link>
          <LanguageSwitcher />
          {user ? (
            <>
              <Link to="/sell">
                <Button variant="default" size="sm" className="gap-1">
                  <Plus className="h-4 w-4" /> Sell
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-1">
                <LogOut className="h-4 w-4" /> {t.nav.logout}
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  {t.nav.login}
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="default" size="sm">
                  {t.nav.register}
                </Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background animate-slide-up">
          <nav className="container flex flex-col gap-2 py-4">
            <Link to="/browse" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                {t.nav.browse}
              </Button>
            </Link>
            {user ? (
              <>
                <Link to="/sell" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="default" className="w-full gap-1">
                    <Plus className="h-4 w-4" /> Sell
                  </Button>
                </Link>
                <Button variant="outline" className="w-full gap-1" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" /> {t.nav.logout}
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    {t.nav.login}
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="default" className="w-full">
                    {t.nav.register}
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
