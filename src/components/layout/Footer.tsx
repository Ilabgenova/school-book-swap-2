import { useLanguage } from "@/i18n/LanguageContext";
import { Link } from "react-router-dom";
import { Sparkles, ShieldCheck, Leaf } from "lucide-react";

export const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-accent shadow-soft">
                <Sparkles className="h-4.5 w-4.5" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg font-bold tracking-tight">
                  DISbook
                </span>
                <span className="text-[10px] uppercase tracking-[0.14em] text-primary-foreground/60 font-medium">
                  DIS · Genova
                </span>
              </div>
            </Link>
            <p className="text-primary-foreground/70 text-sm max-w-md leading-relaxed">
              Smart used books platform for the Deledda International School
              community. Buy, sell, donate and exchange — give books a second life.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-primary-foreground/10 border border-primary-foreground/15">
                <ShieldCheck className="h-3 w-3 text-[hsl(var(--teal))]" /> DIS community only
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-primary-foreground/10 border border-primary-foreground/15">
                <Leaf className="h-3 w-3 text-[hsl(var(--teal))]" /> Circular economy
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-xs uppercase tracking-[0.14em] text-primary-foreground/60 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/buy" className="text-primary-foreground/80 hover:text-[hsl(var(--electric-glow))] transition-colors">
                  {t.nav.browse}
                </Link>
              </li>
              <li>
                <Link to="/sell?intent=sell&mode=sell" className="text-primary-foreground/80 hover:text-[hsl(var(--electric-glow))] transition-colors">
                  List a book
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-primary-foreground/80 hover:text-[hsl(var(--electric-glow))] transition-colors">
                  {t.nav.login}
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-primary-foreground/80 hover:text-[hsl(var(--electric-glow))] transition-colors">
                  {t.nav.register}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display text-xs uppercase tracking-[0.14em] text-primary-foreground/60 mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/privacy" className="text-primary-foreground/80 hover:text-[hsl(var(--electric-glow))] transition-colors">
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-primary-foreground/80 hover:text-[hsl(var(--electric-glow))] transition-colors">
                  {t.footer.terms}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/80 hover:text-[hsl(var(--electric-glow))] transition-colors">
                  {t.footer.contact}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimers */}
        <div className="mt-10 pt-6 border-t border-primary-foreground/10 space-y-3">
          <p className="text-xs text-primary-foreground/70 leading-relaxed max-w-3xl">
            <span className="font-semibold text-primary-foreground">Independence.</span>{" "}
            DISbook is an independent student-created project for the DIS community and is not an
            official Deledda International School platform. It is not managed, approved or endorsed
            by the school.
            <br />
            <span className="italic">
              DISbook è un progetto indipendente creato da studenti per la comunità DIS e non è una
              piattaforma ufficiale della Deledda International School.
            </span>
          </p>
          <p className="text-xs text-primary-foreground/70 leading-relaxed max-w-3xl">
            <span className="font-semibold text-primary-foreground">Amazon affiliate.</span>{" "}
            Some Amazon links on DISbook are affiliate links. If you purchase through these links,
            DISbook may receive a small contribution from Amazon, at no extra cost to you. This
            helps us maintain and improve the app for the DIS community. Before purchasing, please
            carefully check the book title, ISBN, edition, author, publisher, and class requirements.
            <br />
            <span className="italic">
              Alcuni link Amazon presenti su DISbook sono link affiliati. Se acquisti tramite
              questi link, DISbook può ricevere un piccolo contributo da Amazon, senza costi
              aggiuntivi per te. Prima di acquistare, controlla titolo, ISBN, edizione, autore,
              editore e requisiti della classe.
            </span>
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-6 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-primary-foreground/60">
            © {currentYear} DISbook · Independent student-created community project — not affiliated with Deledda International School.
          </p>
          <p className="text-xs text-primary-foreground/60 font-mono">
            v1.0 · {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
};
