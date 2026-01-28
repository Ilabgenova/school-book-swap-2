import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { LanguageProvider, useLanguage } from "@/i18n/LanguageContext";
import { GradeSelector } from "@/components/browse/GradeSelector";
import { BuyingModeSelector } from "@/components/browse/BuyingModeSelector";
import { DPSubjectSelector } from "@/components/browse/DPSubjectSelector";
import { BookList } from "@/components/browse/BookList";

type BrowseStep = "grade" | "mode" | "dpSubjects" | "books";

const BrowseContent = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState<BrowseStep>("grade");
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[] | null>(null);

  const handleSelectGrade = (grade: string, program: string) => {
    setSelectedGrade(grade);
    setSelectedProgram(program);
    setStep("mode");
  };

  const handleSelectMode = (mode: "new" | "used") => {
    if (mode === "used") {
      // For DP program, show subject selection first
      if (selectedProgram === "DP") {
        setStep("dpSubjects");
      } else {
        setStep("books");
      }
    }
    // "new" mode opens Amazon link directly in BuyingModeSelector
  };

  const handleSelectDPSubjects = (subjects: string[]) => {
    setSelectedSubjects(subjects);
    setStep("books");
  };

  const handleBackToGrade = () => {
    setStep("grade");
    setSelectedGrade(null);
    setSelectedProgram(null);
    setSelectedSubjects(null);
  };

  const handleBackToMode = () => {
    setStep("mode");
    setSelectedSubjects(null);
  };

  const handleBackToDPSubjects = () => {
    setStep("dpSubjects");
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
        {step === "dpSubjects" && selectedGrade && selectedProgram === "DP" && (
          <DPSubjectSelector
            selectedGrade={selectedGrade}
            onSelectSubjects={handleSelectDPSubjects}
            onBack={handleBackToMode}
          />
        )}
        {step === "books" && selectedGrade && selectedProgram && (
          <BookList
            selectedGrade={selectedGrade}
            selectedProgram={selectedProgram!}
            selectedSubjects={selectedSubjects}
            onBack={selectedProgram === "DP" ? handleBackToDPSubjects : handleBackToMode}
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
