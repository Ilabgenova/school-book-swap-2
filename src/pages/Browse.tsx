import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { LanguageProvider, useLanguage } from "@/i18n/LanguageContext";
import { GradeSelector } from "@/components/browse/GradeSelector";
import { BookList } from "@/components/browse/BookList";

const BrowseContent = () => {
  const { t } = useLanguage();
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  const handleSelectGrade = (grade: string, program: string) => {
    setSelectedGrade(grade);
    setSelectedProgram(program);
  };

  const handleBack = () => {
    setSelectedGrade(null);
    setSelectedProgram(null);
  };

  return (
    <MainLayout>
      <div className="container py-8">
        {!selectedGrade ? (
          <GradeSelector onSelectGrade={handleSelectGrade} />
        ) : (
          <BookList
            selectedGrade={selectedGrade}
            selectedProgram={selectedProgram!}
            onBack={handleBack}
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
