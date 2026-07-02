import { useState, FormEvent } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { BookOpen, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.2-5.5 4.2-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.6 14.7 2.7 12 2.7 6.9 2.7 2.8 6.8 2.8 12s4.1 9.3 9.2 9.3c5.3 0 8.8-3.7 8.8-9 0-.6-.1-1.1-.2-1.6H12z"/>
  </svg>
);

const LoginContent = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const nextPath = new URLSearchParams(window.location.search).get("next");
  const isSafeRedirect = (u: string | null): u is string =>
    typeof u === "string" && u.startsWith("/") && !u.startsWith("//") && !u.startsWith("/\\");
  const redirectTo = isSafeRedirect(nextPath) ? nextPath : "/browse";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={redirectTo} replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      const msg = error.message?.toLowerCase() || "";
      if (msg.includes("confirm") || msg.includes("not confirmed")) {
        toast.error(
          language === "it"
            ? "Email non ancora confermata. Clicca 'Reinvia email di conferma' qui sotto."
            : "Email not confirmed yet. Click 'Resend confirmation email' below."
        );
      } else {
        toast.error(error.message);
      }
      return;
    }
    toast.success(language === "it" ? "Bentornato!" : "Welcome back!");
    navigate(redirectTo);
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      toast.error(language === "it" ? "Inserisci prima la tua email" : "Please enter your email first");
      return;
    }
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}${redirectTo}` },
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(
      language === "it"
        ? "Email di conferma inviata. Controlla la casella (anche spam)."
        : "Confirmation email sent. Check your inbox (and spam folder)."
    );
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/login?next=${encodeURIComponent(redirectTo)}`,
    });
    if (result.error) toast.error(language === "it" ? "Accesso con Google non riuscito" : "Google sign-in failed");
  };

  return (
    <MainLayout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg mx-auto mb-4">
              <BookOpen className="h-7 w-7" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">{t.nav.login}</h1>
            <p className="text-muted-foreground mt-2">
              {language === "it" ? "Bentornato su DISbook" : "Welcome back to DISbook"}
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
            <Button type="button" variant="outline" className="w-full mb-4" onClick={handleGoogle}>
              <GoogleIcon /> {language === "it" ? "Continua con Google" : "Continue with Google"}
            </Button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">{language === "it" ? "oppure" : "or"}</span>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{t.nav.login}<ArrowRight className="h-4 w-4" /></>}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleResendConfirmation}
                className="text-xs text-muted-foreground hover:text-primary underline"
              >
                {language === "it" ? "Reinvia email di conferma" : "Resend confirmation email"}
              </button>
            </div>

            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                {language === "it" ? "Non hai un account?" : "Don't have an account?"}{" "}
                <Link to={`/register?next=${encodeURIComponent(redirectTo)}`} className="text-primary font-medium hover:underline">{t.nav.register}</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const Login = () => <LoginContent />;

export default Login;
