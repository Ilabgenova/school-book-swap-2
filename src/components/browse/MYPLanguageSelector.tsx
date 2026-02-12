import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Languages, ChevronRight } from "lucide-react";

const foreignLanguages = [
  { id: "Spanish", labelIt: "Spagnolo", labelEn: "Spanish", flag: "🇪🇸" },
  { id: "German", labelIt: "Tedesco", labelEn: "German", flag: "🇩🇪" },
  { id: "Chinese", labelIt: "Cinese", labelEn: "Chinese", flag: "🇨🇳" },
  { id: "French", labelIt: "Francese", labelEn: "French", flag: "🇫🇷" },
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
  const [selectedForeignLang, setSelectedForeignLang] = useState<string | null>(null);

  const handleContinue = () => {
    const languages: Record<string, string> = {};
    if (selectedForeignLang) languages.foreignLanguage = selectedForeignLang;
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
          {t.browse.selectForeignLanguage}
        </h2>
        <p className="text-muted-foreground">
          {t.browse.selectForeignLanguageDesc}
        </p>
      </div>

      {/* Foreign Language Selection */}
      <div className="grid grid-cols-2 gap-4">
        {foreignLanguages.map((lang) => (
          <Button
            key={lang.id}
            variant={selectedForeignLang === lang.id ? "default" : "outline"}
            className="h-auto py-6 flex flex-col gap-2 text-lg"
            onClick={() => setSelectedForeignLang(selectedForeignLang === lang.id ? null : lang.id)}
          >
            <span className="text-2xl">{lang.flag}</span>
            <span className="font-medium">
              {language === "it" ? lang.labelIt : lang.labelEn}
            </span>
          </Button>
        ))}
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
