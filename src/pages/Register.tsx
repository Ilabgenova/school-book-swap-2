import { MainLayout } from "@/components/layout/MainLayout";
import { LanguageProvider, useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, Ticket } from "lucide-react";

const RegisterContent = () => {
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
              {t.nav.register}
            </h1>
            <p className="text-muted-foreground mt-2">
              Join our school community
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inviteCode" className="flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-primary" />
                  Invite Code
                </Label>
                <Input
                  id="inviteCode"
                  type="text"
                  placeholder="Enter your school invite code"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  You need an invite code from your school to register.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Mario"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Rossi"
                    required
                  />
                </div>
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                {t.nav.register}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-xs text-accent flex items-center gap-2">
                <Ticket className="h-4 w-4" />
                <span>€5 {t.common.perYear} - charged only on first transaction</span>
              </p>
            </div>

            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  {t.nav.login}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const Register = () => {
  return (
    <LanguageProvider>
      <RegisterContent />
    </LanguageProvider>
  );
};

export default Register;
