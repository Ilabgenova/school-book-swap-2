import { MainLayout } from "@/components/layout/MainLayout";
import { LanguageProvider, useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";

const LoginContent = () => {
  const { t } = useLanguage();

  return (
    <MainLayout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg mx-auto mb-4">
              <BookOpen className="h-7 w-7" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {t.nav.login}
            </h1>
             <p className="text-muted-foreground mt-2">
              Welcome back to DISbook
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                {t.nav.login}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary font-medium hover:underline">
                  {t.nav.register}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const Login = () => {
  return (
    <LanguageProvider>
      <LoginContent />
    </LanguageProvider>
  );
};

export default Login;
