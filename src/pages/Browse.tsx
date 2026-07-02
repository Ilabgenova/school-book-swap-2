import { useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { useLanguage } from "@/i18n/LanguageContext";
import { GradeSelector } from "@/components/browse/GradeSelector";
import { BuyingModeSelector } from "@/components/browse/BuyingModeSelector";
import { DPSubjectSelector } from "@/components/browse/DPSubjectSelector";
import { MYPLanguageSelector } from "@/components/browse/MYPLanguageSelector";
import { BookList } from "@/components/browse/BookList";

type BrowseStep = "grade" | "mode" | "dpSubjects" | "mypLanguage" | "books";

const BrowseContent = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<BrowseStep>("grade");
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[] | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<Record<string, string> | null>(null);

  const handleSelectGrade = (grade: string, program: string) => {
    setSelectedGrade(grade);
    setSelectedProgram(program);
    setStep("mode");
  };

  const handleSelectMode = (mode: "new" | "used") => {
    if (mode === "used") {
      if (selectedProgram === "MYP") {
        setStep("mypLanguage");
      } else {
        // DP (and any other program) skip subject selection — show all books for the class
        setStep("books");
      }
    }
  };

  const handleSelectDPSubjects = (subjects: string[]) => {
    setSelectedSubjects(subjects);
    setStep("books");
  };

  const handleSelectLanguages = (languages: Record<string, string>) => {
    setSelectedLanguages(languages);
    setStep("books");
  };

  const handleBackToGrade = () => {
    setStep("grade");
    setSelectedGrade(null);
    setSelectedProgram(null);
    setSelectedSubjects(null);
    setSelectedLanguages(null);
  };

  const handleBackToMode = () => {
    setStep("mode");
    setSelectedSubjects(null);
    setSelectedLanguages(null);
  };

  const handleBackToDPSubjects = () => {
    setStep("dpSubjects");
  };

  const handleBackToMYPLanguage = () => {
    setStep("mypLanguage");
  };

  if (searchParams.get("mode") === "sell" || searchParams.get("intent") === "sell") {
    return <Navigate to="/sell?intent=sell&mode=sell" replace />;
  }

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
        {step === "mypLanguage" && selectedGrade && selectedProgram === "MYP" && (
          <MYPLanguageSelector
            selectedGrade={selectedGrade}
            onSelectLanguages={handleSelectLanguages}
            onBack={handleBackToMode}
          />
        )}
        {step === "books" && selectedGrade && selectedProgram && (
          <BookList
            selectedGrade={selectedGrade}
            selectedProgram={selectedProgram}
            selectedSubjects={selectedSubjects}
            selectedLanguages={selectedLanguages}
            onBack={
              selectedProgram === "MYP"
                ? handleBackToMYPLanguage
                : handleBackToMode
            }
          />
        )}
      </div>
    </MainLayout>
  );
};

const Browse = () => {
  return <BrowseContent />;
};

export default Browse;
