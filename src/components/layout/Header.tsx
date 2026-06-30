import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export const Header = () => {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-xl shadow-sm"
          : "border-b border-transparent bg-background/60 backdrop-blur-md"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg gradient-accent text-accent-foreground shadow-soft group-hover:shadow-glow transition-all">
            <Sparkles className="h-4.5 w-4.5" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg font-bold text-foreground tracking-tight">
              DISbook
            </span>
            <span className="hidden sm:inline text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-medium">
              DIS · Genova
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/browse">
            <Button
              variant="ghost"
              size="sm"
              className={isActive("/browse") ? "text-accent bg-accent/10" : ""}
            >
              {t.nav.browse}
            </Button>
          </Link>
          <Link to="/sell?intent=sell&mode=sell">
            <Button
              variant="ghost"
              size="sm"
              className={isActive("/sell") ? "text-accent bg-accent/10" : ""}
            >
              List a book
            </Button>
          </Link>
          <Link to="/buy">
            <Button
              variant="ghost"
              size="sm"
              className={isActive("/buy") ? "text-accent bg-accent/10" : ""}
            >
              Buy a book
            </Button>
          </Link>
          <Link to="/wanted">
            <Button
              variant="ghost"
              size="sm"
              className={isActive("/wanted") ? "text-accent bg-accent/10" : ""}
            >
              Wanted
            </Button>
          </Link>
          <div className="mx-1 h-5 w-px bg-border" />
          <LanguageSwitcher />
          {user ? (
            <>
              <Link to="/my-books">
                <Button
                  variant="ghost"
                  size="sm"
                  className={isActive("/my-books") ? "text-accent bg-accent/10" : ""}
                >
                  My Books
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="gap-1.5 text-muted-foreground"
              >
                <LogOut className="h-4 w-4" /> {t.nav.logout}
              </Button>
            </>

          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  {t.nav.login}
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="hero" size="sm">
                  {t.nav.register}
                </Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-1 md:hidden">
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
        <div className="md:hidden border-t border-border bg-background animate-slide-up">
          <nav className="container flex flex-col gap-2 py-4">
            <Link to="/browse" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                {t.nav.browse}
              </Button>
            </Link>
            <Link to="/buy" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Buy a book
              </Button>
            </Link>

            <Link to="/sell?intent=sell&mode=sell" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                List a book
              </Button>
            </Link>
            <Link to="/wanted" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Wanted
              </Button>
            </Link>

            {user ? (
              <>
                <Link to="/my-books" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    My Books
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full gap-1.5"
                  onClick={handleSignOut}
                >
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
                  <Button variant="hero" className="w-full">
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
