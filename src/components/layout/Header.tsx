import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  LogOut,
  Sparkles,
  MessageCircle,
  BookOpen,
  ShoppingBag,
  Tag,
  Shield,
  MoreHorizontal,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();
  const unread = useUnreadMessages();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
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
      <div className="container flex h-16 items-center justify-between gap-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
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
          <Link to="/sell?intent=sell&mode=sell">
            <Button
              variant="ghost"
              size="sm"
              className={isActive("/sell") ? "text-accent bg-accent/10" : ""}
            >
              {t.nav.list}
            </Button>
          </Link>
          <Link to="/buy">
            <Button
              variant="ghost"
              size="sm"
              className={isActive("/buy") || isActive("/browse") ? "text-accent bg-accent/10" : ""}
            >
              {t.nav.buy}
            </Button>
          </Link>
          <Link to="/wanted">
            <Button
              variant="ghost"
              size="sm"
              className={isActive("/wanted") ? "text-accent bg-accent/10" : ""}
            >
              {t.nav.wanted}
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
                  {t.nav.myBooks}
                </Button>
              </Link>
              <Link to="/messages">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-1.5 relative",
                    isActive("/messages") ? "text-accent bg-accent/10" : ""
                  )}
                >
                  <MessageCircle className="h-4 w-4" />
                  {t.nav.messages}
                  {unread > 0 && (
                    <Badge className="ml-1 h-5 min-w-5 rounded-full px-1.5 text-[10px]">
                      {unread}
                    </Badge>
                  )}
                </Button>
              </Link>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className={isActive("/admin") ? "text-accent bg-accent/10" : ""}>
                    Admin
                  </Button>
                </Link>
              )}
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

        {/* Mobile Navigation */}
        <div className="flex items-center gap-1 md:hidden">
          {user ? (
            <>
              <Link to="/my-books" aria-label={t.nav.myBooks}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-1.5 px-2",
                    isActive("/my-books") ? "text-accent bg-accent/10" : ""
                  )}
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden xs:inline text-xs">{t.nav.myBooks}</span>
                </Button>
              </Link>
              <Link to="/messages" aria-label={t.nav.messages}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-1.5 px-2 relative",
                    isActive("/messages") ? "text-accent bg-accent/10" : ""
                  )}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden xs:inline text-xs">{t.nav.messages}</span>
                  {unread > 0 && (
                    <Badge className="ml-0.5 h-4 min-w-4 rounded-full px-1 text-[10px]">
                      {unread}
                    </Badge>
                  )}
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm" className="px-2 text-xs">
                {t.nav.login}
              </Button>
            </Link>
          )}
          <LanguageSwitcher />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t.nav.more}
                className="h-9 w-9"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate("/buy")}>
                <ShoppingBag className="h-4 w-4 mr-2" />
                {t.nav.buy}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/sell?intent=sell&mode=sell")}>
                <Tag className="h-4 w-4 mr-2" />
                {t.nav.list}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/wanted")}>
                <BookOpen className="h-4 w-4 mr-2" />
                {t.nav.wanted}
              </DropdownMenuItem>
              {user && isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    <Shield className="h-4 w-4 mr-2" />
                    Admin
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              {user ? (
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  {t.nav.logout}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => navigate("/register")}>
                  {t.nav.register}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
