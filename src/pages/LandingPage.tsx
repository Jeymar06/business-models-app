import { useRef, useState } from 'react';

import { ClientsSection } from '@/features/landing/components/ClientsSection';
import { FAQSection } from '@/features/landing/components/FAQSection';
import { FeaturesSection } from '@/features/landing/components/FeaturesSection';
import { FinalCTASection } from '@/features/landing/components/FinalCTASection';
import { HeroSection } from '@/features/landing/components/HeroSection';
import { HowItWorksSection } from '@/features/landing/components/HowItWorksSection';
import { LandingFooter } from '@/features/landing/components/LandingFooter';
import { LandingMarqueeSection, AnimatedMessageSection, PinnedShowcaseSection, VideoRevealSection } from '@/features/landing/components/MotionShowcaseSections';
import { LandingNavbar } from '@/features/landing/components/LandingNavbar';
import { LandingPreloader } from '@/features/landing/components/LandingPreloader';
import { PricingSection } from '@/features/landing/components/PricingSection';
import { ProblemSolutionSection } from '@/features/landing/components/ProblemSolutionSection';
import { useLandingMotion } from '@/features/landing/hooks/useLandingMotion';

export function LandingPage() {
  const landingRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useLandingMotion(landingRef, isReady);

  return (
    <div className="bg-ink text-cream">
      {!isReady ? <LandingPreloader onFinish={() => setIsReady(true)} /> : null}

      <div
        className={[
          'landing-page overflow-hidden transition-opacity duration-500',
          isReady ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        ref={landingRef}
      >
        <LandingNavbar />
        <HeroSection />
        <LandingMarqueeSection />
        <AnimatedMessageSection />
        <PinnedShowcaseSection />
        <FeaturesSection />
        <VideoRevealSection />
        <ProblemSolutionSection />
        <ClientsSection />
        <HowItWorksSection />
        <PricingSection />
        <FAQSection />
        <FinalCTASection />
        <LandingFooter />
      </div>
    </div>
  );
}
