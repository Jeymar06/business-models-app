import { ClientsSection } from '@/features/landing/components/ClientsSection';
import { FAQSection } from '@/features/landing/components/FAQSection';
import { FeaturesSection } from '@/features/landing/components/FeaturesSection';
import { FinalCTASection } from '@/features/landing/components/FinalCTASection';
import { HeroSection } from '@/features/landing/components/HeroSection';
import { HowItWorksSection } from '@/features/landing/components/HowItWorksSection';
import { LandingFooter } from '@/features/landing/components/LandingFooter';
import { LandingNavbar } from '@/features/landing/components/LandingNavbar';
import { MediaGallerySection } from '@/features/landing/components/MediaGallerySection';
import { OwnersSection } from '@/features/landing/components/OwnersSection';
import { PricingSection } from '@/features/landing/components/PricingSection';
import { ProblemSolutionSection } from '@/features/landing/components/ProblemSolutionSection';
import { landingMediaGroups } from '@/features/landing/data/landingMedia';

export function LandingPage() {
  return (
    <div className="bg-ink text-cream">
      <LandingNavbar />
      <HeroSection />

      <MediaGallerySection
        cards={[
          {
            type: 'video' as const,
            src: landingMediaGroups.howItWorks[0].video,
            poster: landingMediaGroups.howItWorks[0].poster,
            alt: 'Video editorial Barber Flow 1',
          },
          {
            type: 'video' as const,
            src: landingMediaGroups.howItWorks[2].video,
            poster: landingMediaGroups.howItWorks[2].poster,
            alt: 'Video editorial Barber Flow 2',
          },
          {
            type: 'image' as const,
            src: landingMediaGroups.introGallery[2],
            alt: 'Atmosfera editorial Barber Flow 2',
          },
        ]}
        className="bg-ink py-10 lg:py-12"
        columnsClassName="md:grid-cols-3"
      />

      <FeaturesSection />

      <MediaGallerySection
        cards={[
          { type: 'video', src: landingMediaGroups.features.video, poster: landingMediaGroups.features.poster, alt: 'Video de producto Barber Flow' },
          { type: 'image', src: landingMediaGroups.features.sideTop, alt: 'Detalle visual de producto Barber Flow' },
          { type: 'image', src: landingMediaGroups.problem[0], alt: 'Escena de producto y barberia' },
        ]}
        className="bg-ink pb-10"
        columnsClassName="md:grid-cols-3"
        dark
      />

      <ProblemSolutionSection />

      <OwnersSection />

      <ClientsSection />

      <MediaGallerySection
        cards={[
          { type: 'video', src: landingMediaGroups.hero.centerVideo, poster: landingMediaGroups.hero.centerPoster, alt: 'Video de cliente usando Barber Flow' },
          { type: 'image', src: landingMediaGroups.clients.images[0], alt: 'Escena editorial para clientes Barber Flow' },
          { type: 'video', src: landingMediaGroups.clients.video, poster: landingMediaGroups.clients.poster, alt: 'Video para duenos y operacion Barber Flow' },
        ]}
        className="bg-ink-soft py-10"
        columnsClassName="md:grid-cols-3"
        dark
      />

      <HowItWorksSection />

      <PricingSection />

      <FAQSection />

      <FinalCTASection />

      <LandingFooter />
    </div>
  );
}
