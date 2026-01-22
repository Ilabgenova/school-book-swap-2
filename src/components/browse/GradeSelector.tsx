import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, ChevronRight } from "lucide-react";

const grades = {
  PYP: ["PYP 1", "PYP 2", "PYP 3", "PYP 4", "PYP 5"],
  MYP: ["MYP 1", "MYP 2", "MYP 3", "MYP 4", "MYP 5"],
  DP: ["DP 1", "DP 2"],
};

interface GradeSelectorProps {
  onSelectGrade: (grade: string, program: string) => void;
}

export const GradeSelector = ({ onSelectGrade }: GradeSelectorProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          {t.browse.selectGrade}
        </h2>
        <p className="text-muted-foreground">
          {t.browse.selectGradeDescription}
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(grades).map(([program, programGrades]) => (
          <div key={program} className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant={program.toLowerCase() as "pyp" | "myp" | "dp"}>
                {program}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {program === "PYP" && t.browse.primaryYears}
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
