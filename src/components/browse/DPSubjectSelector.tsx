import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Plus, BookOpen } from "lucide-react";
import { dpSubjectGroups, getSubjectsForGrade } from "@/data/officialBooks";

interface DPSubjectSelectorProps {
  selectedGrade: string;
  onSelectSubjects: (subjects: string[]) => void;
  onBack: () => void;
}

export const DPSubjectSelector = ({
  selectedGrade,
  onSelectSubjects,
  onBack,
}: DPSubjectSelectorProps) => {
  const { t } = useLanguage();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [showAdditional, setShowAdditional] = useState(false);
  
  const availableSubjects = getSubjectsForGrade(selectedGrade);
  
  // Group subjects by category
  const groupedSubjects: Record<string, string[]> = {};
  
  Object.entries(dpSubjectGroups).forEach(([key, group]) => {
    const matchingSubjects = group.subjects.filter(s => 
      availableSubjects.some(as => as.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(as.toLowerCase()))
    );
    if (matchingSubjects.length > 0) {
      groupedSubjects[group.name] = availableSubjects.filter(as =>
        matchingSubjects.some(ms => as.toLowerCase().includes(ms.toLowerCase()) || ms.toLowerCase().includes(as.toLowerCase()))
      );
    }
  });
  
  // Get ungrouped subjects
  const groupedSet = new Set(Object.values(groupedSubjects).flat());
  const otherSubjects = availableSubjects.filter(s => !groupedSet.has(s));

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev => {
      if (prev.includes(subject)) {
        return prev.filter(s => s !== subject);
      }
      return [...prev, subject];
    });
  };

  const handleContinue = () => {
    if (selectedSubjects.length > 0) {
      onSelectSubjects(selectedSubjects);
    }
  };

  const coreSubjects = availableSubjects.filter(s => 
    s.toLowerCase().includes("theory of knowledge") || 
    s.toLowerCase().includes("tok")
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="dp">DP</Badge>
            <h2 className="font-display text-xl font-bold text-foreground">
              {selectedGrade}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {t.browse.selectDPSubjects}
          </p>
        </div>
      </div>

      {/* Subject Selection Info */}
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
        <div className="flex items-start gap-3">
          <BookOpen className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">
              {t.browse.dpSubjectInfo}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t.browse.dpSubjectInfoDetail}
            </p>
          </div>
        </div>
      </div>

      {/* Selection Counter */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {t.browse.selectedSubjects}: <span className="font-bold text-foreground">{selectedSubjects.length}</span>
        </span>
        {selectedSubjects.length >= 6 && !showAdditional && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAdditional(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            {t.browse.addMoreSubjects}
          </Button>
        )}
      </div>

      {/* Subject Groups */}
      <div className="space-y-6">
        {/* Core (TOK) - Always included */}
        {coreSubjects.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Core</Badge>
              Theory of Knowledge
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {coreSubjects.map(subject => (
                <label
                  key={subject}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={selectedSubjects.includes(subject)}
                    onCheckedChange={() => toggleSubject(subject)}
                  />
                  <span className="text-sm font-medium">{subject}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Grouped Subjects */}
        {Object.entries(groupedSubjects).map(([groupName, subjects]) => {
          const filteredSubjects = subjects.filter(s => !coreSubjects.includes(s));
          if (filteredSubjects.length === 0) return null;
          
          return (
            <div key={groupName} className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                {groupName}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredSubjects.map(subject => (
                  <label
                    key={subject}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedSubjects.includes(subject)
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:bg-muted/50"
                    }`}
                  >
                    <Checkbox
                      checked={selectedSubjects.includes(subject)}
                      onCheckedChange={() => toggleSubject(subject)}
                    />
                    <span className="text-sm font-medium">{subject}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}

        {/* Other Subjects */}
        {otherSubjects.filter(s => !coreSubjects.includes(s)).length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              {t.browse.otherSubjects}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {otherSubjects.filter(s => !coreSubjects.includes(s)).map(subject => (
                <label
                  key={subject}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedSubjects.includes(subject)
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:bg-muted/50"
                  }`}
                >
                  <Checkbox
                    checked={selectedSubjects.includes(subject)}
                    onCheckedChange={() => toggleSubject(subject)}
                  />
                  <span className="text-sm font-medium">{subject}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Continue Button */}
      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleContinue}
          disabled={selectedSubjects.length === 0}
          size="lg"
        >
          {t.browse.continueToBooks}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
