import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { LanguageProvider, useLanguage } from "@/i18n/LanguageContext";
import { GradeSelector } from "@/components/browse/GradeSelector";
import { BuyingModeSelector } from "@/components/browse/BuyingModeSelector";
import { BookList } from "@/components/browse/BookList";

type BrowseStep = "grade" | "mode" | "books";

const BrowseContent = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState<BrowseStep>("grade");
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  const handleSelectGrade = (grade: string, program: string) => {
    setSelectedGrade(grade);
    setSelectedProgram(program);
    setStep("mode");
  };

  const handleSelectMode = (mode: "new" | "used") => {
    if (mode === "used") {
      setStep("books");
    }
    // "new" mode opens Amazon link directly in BuyingModeSelector
  };

  const handleBackToGrade = () => {
    setStep("grade");
    setSelectedGrade(null);
    setSelectedProgram(null);
  };

  const handleBackToMode = () => {
    setStep("mode");
  };

  return (
    <MainLayout>
      <div className="container py-8">
        {step === "grade" && (
          <GradeSelector onSelectGrade={handleSelectGrade} />
        )}
        {step === "mode" && selectedGrade && selectedProgram && (
          <BuyingModeSelector
            selectedGrade={selectedGrade}
            selectedProgram={selectedProgram}
            onSelectMode={handleSelectMode}
            onBack={handleBackToGrade}
          />
        )}
        {step === "books" && selectedGrade && selectedProgram && (
          <BookList
            selectedGrade={selectedGrade}
            selectedProgram={selectedProgram!}
            onBack={handleBackToMode}
          />
        )}
      </div>
    </MainLayout>
  );
};

const Browse = () => {
  return (
    <LanguageProvider>
      <BrowseContent />
    </LanguageProvider>
  );
};

export default Browse;
