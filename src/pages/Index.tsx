import { MainLayout } from "@/components/layout/MainLayout";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { PreviewSection } from "@/components/landing/PreviewSection";
import { CTASection } from "@/components/landing/CTASection";
import { LanguageProvider } from "@/i18n/LanguageContext";

const IndexContent = () => {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PreviewSection />
      <CTASection />
    </MainLayout>
  );
};

const Index = () => {
  return (
    <LanguageProvider>
      <IndexContent />
    </LanguageProvider>
  );
};

export default Index;
