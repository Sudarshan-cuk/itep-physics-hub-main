import { HeroSection } from '@/components/home/HeroSection';
import { StatsSection } from '@/components/home/StatsSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { CtaSection } from '@/components/home/CtaSection';
import { FooterSection } from '@/components/home/FooterSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CtaSection />
      <FooterSection />
    </div>
  );
};

export default Index;