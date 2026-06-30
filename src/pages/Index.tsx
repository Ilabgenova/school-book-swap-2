import { MainLayout } from "@/components/layout/MainLayout";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { PreviewSection } from "@/components/landing/PreviewSection";
import { CommunityTipsSection } from "@/components/landing/CommunityTipsSection";
import { CTASection } from "@/components/landing/CTASection";

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PreviewSection />
      <CommunityTipsSection />
      <CTASection />
    </MainLayout>
  );
};

export default Index;
