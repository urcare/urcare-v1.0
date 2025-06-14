
import React from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { WhyChooseSection } from '@/components/landing/WhyChooseSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { CTASection } from '@/components/landing/CTASection';
import { LandingFooter } from '@/components/landing/LandingFooter';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
};

export default Landing;
