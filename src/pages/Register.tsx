import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { LanguageProvider, useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, School, UserPlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BooksToSellSuggestion } from "@/components/browse/BooksToSellSuggestion";

const grades = {
  PYP: ["PYP 1", "PYP 2", "PYP 3", "PYP 4", "PYP 5"],
  MYP: ["MYP 1", "MYP 2", "MYP 3", "MYP 4", "MYP 5"],
  DP: ["DP 1", "DP 2"],
};

const RegisterContent = () => {
  const { t } = useLanguage();
  const [isFromDIS, setIsFromDIS] = useState<boolean | null>(null);
  const [previousGrade, setPreviousGrade] = useState<string>("");
  const [previousProgram, setPreviousProgram] = useState<string>("");

  const handleSchoolOrigin = (fromDIS: boolean) => {
    setIsFromDIS(fromDIS);
    if (!fromDIS) {
      setPreviousGrade("");
      setPreviousProgram("");
    }
  };

  const handleGradeSelect = (grade: string) => {
    setPreviousGrade(grade);
    // Determine program from grade
    if (grade.startsWith("PYP")) setPreviousProgram("PYP");
    else if (grade.startsWith("MYP")) setPreviousProgram("MYP");
    else if (grade.startsWith("DP")) setPreviousProgram("DP");
  };

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

              {/* School Origin Question */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <School className="h-4 w-4 text-primary" />
                  {t.browse.schoolOriginQuestion}
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSchoolOrigin(true)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      isFromDIS === true
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <School className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <span className="text-sm font-medium">{t.browse.fromDISSchool}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSchoolOrigin(false)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      isFromDIS === false
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <UserPlus className="h-6 w-6 mx-auto mb-2 text-accent" />
                    <span className="text-sm font-medium">{t.browse.newToDIS}</span>
                  </button>
                </div>
              </div>

              {/* Previous Grade Selection - shown only if from DIS */}
              {isFromDIS && (
                <div className="space-y-2">
                  <Label>Previous Grade (Last Year)</Label>
                  <Select onValueChange={handleGradeSelect} value={previousGrade}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your previous grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(grades).map(([program, programGrades]) => (
                        programGrades.map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade}
                          </SelectItem>
                        ))
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

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


            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  {t.nav.login}
                </Link>
              </p>
            </div>
          </div>

          {/* Books to Sell Suggestion - shown if from DIS and grade selected */}
          {isFromDIS && previousGrade && previousProgram && (
            <BooksToSellSuggestion
              previousGrade={previousGrade}
              previousProgram={previousProgram}
            />
          )}
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
