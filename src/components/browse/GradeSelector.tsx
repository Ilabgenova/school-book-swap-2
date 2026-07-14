import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, ChevronRight, BookOpen, Keyboard, Bot } from "lucide-react";
import { GENERIC_MYP_GRADE } from "@/data/officialBooks";

const grades = {
  MYP: ["MYP 1", "MYP 2", "MYP 3", "MYP 4", "MYP 5"],
  DP: ["DP 1", "DP 2"],
};

interface GradeSelectorProps {
  onSelectGrade: (grade: string, program: string) => void;
  onSelectGenericCategory?: (category: "keyboard" | "sphero") => void;
}

export const GradeSelector = ({ onSelectGrade, onSelectGenericCategory }: GradeSelectorProps) => {
  const { t, language } = useLanguage();
  const isIT = language === "it";

  return (
    <div className="space-y-8">
      <div className="text-center">
        <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          {isIT ? "Sfoglia per categoria" : "Browse by category"}
        </h2>
        <p className="text-muted-foreground">
          {isIT
            ? "Scegli Libri, Tastiera o Robot Sphero. I materiali generici non richiedono una classe."
            : "Choose Books, Keyboard or Sphero Robot. Generic items do not require a class/year."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Button
          type="button"
          variant="outline"
          className="h-auto items-start justify-between gap-3 p-4 text-left hover:border-primary hover:bg-primary/5"
          onClick={() => document.getElementById("book-grade-selector")?.scrollIntoView({ behavior: "smooth", block: "start" })}
        >
          <span className="flex min-w-0 items-start gap-3">
            <BookOpen className="h-5 w-5 shrink-0 text-primary" />
            <span className="min-w-0">
              <span className="block font-medium">{isIT ? "Libri" : "Books"}</span>
              <span className="block whitespace-normal text-xs font-normal text-muted-foreground">
                {isIT ? "Scegli MYP o DP" : "Choose MYP or DP"}
              </span>
            </span>
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-auto items-start justify-between gap-3 p-4 text-left hover:border-primary hover:bg-primary/5"
          onClick={() => onSelectGenericCategory?.("keyboard") ?? onSelectGrade(GENERIC_MYP_GRADE, "MYP")}
        >
          <span className="flex min-w-0 items-start gap-3">
            <Keyboard className="h-5 w-5 shrink-0 text-primary" />
            <span className="min-w-0">
              <span className="block font-medium">{isIT ? "Tastiera" : "Keyboard"}</span>
              <span className="block whitespace-normal text-xs font-normal text-muted-foreground">
                {isIT ? "Materiale generico" : "Generic item"}
              </span>
            </span>
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-auto items-start justify-between gap-3 p-4 text-left hover:border-primary hover:bg-primary/5"
          onClick={() => onSelectGenericCategory?.("sphero") ?? onSelectGrade(GENERIC_MYP_GRADE, "MYP")}
        >
          <span className="flex min-w-0 items-start gap-3">
            <Bot className="h-5 w-5 shrink-0 text-primary" />
            <span className="min-w-0">
              <span className="block font-medium">{isIT ? "Robot Sphero" : "Sphero Robot"}</span>
              <span className="block whitespace-normal text-xs font-normal text-muted-foreground">
                Sphero Mini
              </span>
            </span>
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Button>
      </div>

      <div id="book-grade-selector" className="space-y-6 scroll-mt-24">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">
            {t.browse.selectGrade}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.browse.selectGradeDescription}
          </p>
        </div>
        {Object.entries(grades).map(([program, programGrades]) => (
          <div key={program} className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant={program.toLowerCase() as "pyp" | "myp" | "dp"}>
                {program}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {program === "MYP" && t.browse.middleYears}
                {program === "DP" && t.browse.diplomaProgramme}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {programGrades.map((grade) => (
                <Button
                  key={grade}
                  variant="outline"
                  className="h-auto py-3 justify-between group hover:border-primary hover:bg-primary/5"
                  onClick={() => onSelectGrade(grade, program)}
                >
                  <span className="font-medium">{grade}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Button>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};
