import { ClientsSection } from '@/features/landing/components/ClientsSection';
import { FAQSection } from '@/features/landing/components/FAQSection';
import { FeaturesSection } from '@/features/landing/components/FeaturesSection';
import { FinalCTASection } from '@/features/landing/components/FinalCTASection';
import { HeroSection } from '@/features/landing/components/HeroSection';
import { HowItWorksSection } from '@/features/landing/components/HowItWorksSection';
import { LandingFooter } from '@/features/landing/components/LandingFooter';
import { LandingNavbar } from '@/features/landing/components/LandingNavbar';
import { OwnersSection } from '@/features/landing/components/OwnersSection';
import { PricingSection } from '@/features/landing/components/PricingSection';
import { ProblemSolutionSection } from '@/features/landing/components/ProblemSolutionSection';

export function LandingPage() {
  return (
    <div className="bg-[#0B0B0B] text-white">
      <LandingNavbar />
      <HeroSection />
      <ProblemSolutionSection />
      <HowItWorksSection />
      <FeaturesSection />
      <ClientsSection />
      <OwnersSection />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
      <LandingFooter />
    </div>
  );
}