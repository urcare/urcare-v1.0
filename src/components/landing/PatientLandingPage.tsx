
import React from 'react';
import { HeroSection } from './HeroSection';
import { FeaturesSection, HowItWorksSection } from './LandingSections';
import { WhyChooseSection } from './WhyChooseSection';
import { CTASection } from './CTASection';
import { LandingFooter } from './LandingFooter';

export const PatientLandingPage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <WhyChooseSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
};
