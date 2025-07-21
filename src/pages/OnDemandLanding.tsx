import React from 'react';
import { OnDemandLandingPage } from '@/components/landing/OnDemandLandingPage';

interface OnDemandLandingProps {
  showModal?: boolean;
}

const OnDemandLanding = ({ showModal = false }: OnDemandLandingProps) => {
  return <OnDemandLandingPage showModal={showModal} />;
};

export default OnDemandLanding; 