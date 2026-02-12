import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Languages, ChevronRight, BookOpen } from "lucide-react";

const englishLevels = [
  { id: "English Proficient", label: "Proficient" },
  { id: "English Capable", label: "Capable" },
];

const italianLevels = [
  { id: "Italiano Fase 1", label: "Fase 1 (A1)", descIt: "Principiante", descEn: "Beginner" },
  { id: "Italiano Fase 2", label: "Fase 2 (A2)", descIt: "Elementare", descEn: "Elementary" },
  { id: "Italiano Fase 3", label: "Fase 3 (B1)", descIt: "Intermedio", descEn: "Intermediate" },
  { id: "Italiano Fase 4", label: "Fase 4 (B2)", descIt: "Intermedio superiore", descEn: "Upper Intermediate" },
  { id: "Italiano Fase 5", label: "Fase 5 (C1)", descIt: "Avanzato", descEn: "Advanced" },
];

interface MYPLanguageSelectorProps {
  selectedGrade: string;
  onSelectLanguages: (languages: Record<string, string>) => void;
  onBack: () => void;
}

export const MYPLanguageSelector = ({
  selectedGrade,
  onSelectLanguages,
  onBack,
}: MYPLanguageSelectorProps) => {
  const { t, language } = useLanguage();
  const [selectedEnglish, setSelectedEnglish] = useState<string | null>(null);
  const [selectedItalian, setSelectedItalian] = useState<string | null>(null);

  const handleContinue = () => {
    const languages: Record<string, string> = {};
    if (selectedEnglish) languages.english = selectedEnglish;
    if (selectedItalian) languages.italian = selectedItalian;
    onSelectLanguages(languages);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="myp">MYP</Badge>
            <h2 className="font-display text-xl font-bold text-foreground">
              {selectedGrade}
            </h2>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Languages className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          {t.browse.selectLanguageLevel}
        </h2>
        <p className="text-muted-foreground">
          {t.browse.selectLanguageLevelDesc}
        </p>
      </div>

      {/* English Level */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">English</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {englishLevels.map((level) => (
            <Button
              key={level.id}
              variant={selectedEnglish === level.id ? "default" : "outline"}
              className="h-auto py-4 flex flex-col gap-1"
              onClick={() => setSelectedEnglish(selectedEnglish === level.id ? null : level.id)}
            >
              <span className="font-medium">{level.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Italian Level */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Italiano</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {italianLevels.map((level) => (
            <Button
              key={level.id}
              variant={selectedItalian === level.id ? "default" : "outline"}
              className="h-auto py-4 flex flex-col gap-1"
              onClick={() => setSelectedItalian(selectedItalian === level.id ? null : level.id)}
            >
              <span className="font-medium">{level.label}</span>
              <span className="text-xs opacity-70">
                {language === "it" ? level.descIt : level.descEn}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Continue button */}
      <Button
        size="lg"
        className="w-full gap-2"
        onClick={handleContinue}
      >
        {t.browse.continueToBooks}
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
