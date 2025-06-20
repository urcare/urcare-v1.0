
import React from 'react';
import { CommunityDashboard } from '@/components/community/CommunityDashboard';
import { ThemeWrapper } from '@/components/ThemeWrapper';

const Community = () => {
  return (
    <ThemeWrapper>
      <div className="container mx-auto">
        <CommunityDashboard />
      </div>
    </ThemeWrapper>
  );
};

export default Community;
