import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, ChevronRight, Music } from "lucide-react";
import { GENERIC_MYP_GRADE } from "@/data/officialBooks";

const grades = {
  MYP: ["MYP 1", "MYP 2", "MYP 3", "MYP 4", "MYP 5"],
  DP: ["DP 1", "DP 2"],
};

interface GradeSelectorProps {
  onSelectGrade: (grade: string, program: string) => void;
}

export const GradeSelector = ({ onSelectGrade }: GradeSelectorProps) => {
  const { t, language } = useLanguage();
  const isIT = language === "it";

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

        {/* Generic MYP items (Keyboard / Sphero Mini Robot) — not tied to one class */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="myp">MYP</Badge>
            <span className="text-sm text-muted-foreground">
              {isIT ? "Materiali generici" : "Generic materials"}
            </span>
          </div>
          <Button
            variant="outline"
            className="w-full h-auto py-4 justify-between group hover:border-primary hover:bg-primary/5"
            onClick={() => onSelectGrade(GENERIC_MYP_GRADE, "MYP")}
          >
            <span className="flex items-center gap-3 text-left">
              <Music className="h-5 w-5 text-primary shrink-0" />
              <span className="flex flex-col">
                <span className="font-medium">
                  {isIT ? "Tastiera / Robot Sphero Mini" : "Keyboard / Sphero Mini Robot"}
                </span>
                <span className="text-xs text-muted-foreground font-normal">
                  {isIT
                    ? "Materiali generici usati in tutte le classi MYP"
                    : "Generic items used across all MYP years"}
                </span>
              </span>
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </Button>
        </div>
      </div>
    </div>
  );
};
