import { MainLayout } from "@/components/layout/MainLayout";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { PreviewSection } from "@/components/landing/PreviewSection";
import { CommunityTipsSection } from "@/components/landing/CommunityTipsSection";
import { CTASection } from "@/components/landing/CTASection";
import { Co2ImpactBand } from "@/components/landing/Co2ImpactBand";
import { SustainabilitySection } from "@/components/landing/SustainabilitySection";
import { CategoryBrowseSection } from "@/components/landing/CategoryBrowseSection";

const Index = () => {
  return (
    <MainLayout>
      <Co2ImpactBand />
      <HeroSection />
      <CategoryBrowseSection />
      <FeaturesSection />
      <HowItWorksSection />
      <SustainabilitySection />
      <PreviewSection />
      <CommunityTipsSection />
      <CTASection />
    </MainLayout>
  );
};

export default Index;
