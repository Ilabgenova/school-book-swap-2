import { useState, FormEvent } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { BookOpen, ArrowRight, School, UserPlus, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BooksToSellSuggestion } from "@/components/browse/BooksToSellSuggestion";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const grades = {
  MYP: ["MYP 1", "MYP 2", "MYP 3", "MYP 4", "MYP 5"],
  DP: ["DP 1", "DP 2"],
};

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.2-5.5 4.2-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.6 14.7 2.7 12 2.7 6.9 2.7 2.8 6.8 2.8 12s4.1 9.3 9.2 9.3c5.3 0 8.8-3.7 8.8-9 0-.6-.1-1.1-.2-1.6H12z"/>
  </svg>
);

const RegisterContent = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const nextPath = new URLSearchParams(window.location.search).get("next");
  const redirectTo = nextPath?.startsWith("/") ? nextPath : "/browse";
  const [isFromDIS, setIsFromDIS] = useState<boolean | null>(null);
  const [previousGrade, setPreviousGrade] = useState<string>("");
  const [previousProgram, setPreviousProgram] = useState<string>("");
  const [newGrade, setNewGrade] = useState<string>("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={redirectTo} replace />;

  const handleSchoolOrigin = (fromDIS: boolean) => {
    setIsFromDIS(fromDIS);
    if (!fromDIS) {
      setPreviousGrade("");
      setPreviousProgram("");
    }
  };

  const handleGradeSelect = (grade: string) => {
    setPreviousGrade(grade);
    if (grade.startsWith("MYP")) setPreviousProgram("MYP");
    else if (grade.startsWith("DP")) setPreviousProgram("DP");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}${redirectTo}`,
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`.trim(),
        },
      },
    });
    if (error) {
      setLoading(false);
      const msg = error.message?.toLowerCase() || "";
      if (msg.includes("pwned") || msg.includes("compromised") || msg.includes("breach") || msg.includes("weak")) {
        toast.error(
          "This password has appeared in known data breaches. Please choose a different password (it doesn't need to be complex — just not a commonly used one).",
          { duration: 8000 }
        );
      } else {
        toast.error(error.message);
      }
      return;
    }
    // Update profile with extra fields (school / grade) if provided
    if (data.user) {
      await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          is_from_dis: isFromDIS ?? false,
          previous_grade: previousGrade || null,
          previous_program: previousProgram || null,
        })
        .eq("user_id", data.user.id);
    }
    setLoading(false);
    toast.success("Account created! Check your email to confirm.");
    navigate(redirectTo);
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/register?next=${encodeURIComponent(redirectTo)}`,
    });
    if (result.error) toast.error("Google sign-in failed");
  };

  const originChosen = isFromDIS !== null;
  const canShowAuth = isFromDIS === false || (isFromDIS === true && !!previousGrade);

  return (
    <MainLayout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg mx-auto mb-4">
              <BookOpen className="h-7 w-7" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">{t.nav.register}</h1>
            <p className="text-muted-foreground mt-2">Join the DIS community project</p>
            <p className="text-[11px] text-muted-foreground/80 mt-3 italic leading-relaxed border-l-2 border-accent/40 pl-2 text-left">
              DISbook is an independent student-created project for the DIS community.
              It is not an official platform of Deledda International School and is not
              managed, approved or endorsed by the school.
            </p>
          </div>

          {/* Step 1 — DIS origin */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-lg space-y-4">
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <School className="h-4 w-4 text-primary" />
                <span className="text-xs uppercase tracking-wide text-muted-foreground mr-1">Step 1</span>
                {t.browse.schoolOriginQuestion}
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSchoolOrigin(true)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    isFromDIS === true ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <School className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <span className="text-sm font-medium">{t.browse.fromDISSchool}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSchoolOrigin(false)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    isFromDIS === false ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <UserPlus className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <span className="text-sm font-medium">{t.browse.newToDIS}</span>
                </button>
              </div>
            </div>

            {isFromDIS && (
              <div className="space-y-2">
                <Label>Previous Grade (Last Year)</Label>
                <Select onValueChange={handleGradeSelect} value={previousGrade}>
                  <SelectTrigger><SelectValue placeholder="Select your previous grade" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(grades).map(([, programGrades]) =>
                      programGrades.map((grade) => (
                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  We'll suggest which books from last year you can list now.
                </p>
              </div>
            )}
          </div>

          {/* Previous-year sellable suggestion (before account creation) */}
          {isFromDIS && previousGrade && previousProgram && (
            <BooksToSellSuggestion previousGrade={previousGrade} previousProgram={previousProgram} />
          )}

          {/* Step 2 — Account creation, gated */}
          {originChosen && (
            <div className={`mt-6 bg-card rounded-2xl border border-border p-6 shadow-lg transition-opacity ${canShowAuth ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
                Step 2 — Create your account
              </p>
              {!canShowAuth && (
                <p className="text-sm text-muted-foreground mb-3">
                  Select your previous grade above to continue.
                </p>
              )}
              <Button type="button" variant="outline" className="w-full mb-4" onClick={handleGoogle} disabled={!canShowAuth}>
                <GoogleIcon /> Continue with Google
              </Button>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" type="text" placeholder="Mario" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" type="text" placeholder="Rossi" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading || !canShowAuth}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{t.nav.register}<ArrowRight className="h-4 w-4" /></>}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary font-medium hover:underline">{t.nav.login}</Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};


const Register = () => <RegisterContent />;

export default Register;
