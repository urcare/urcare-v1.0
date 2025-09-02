import { HealthContent } from "@/components/HealthContent";
import { MobileNavigation } from "@/components/MobileNavigation";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import React from "react";

const Dashboard: React.FC = () => {
  return (
    <ThemeWrapper>
      <MobileNavigation>
        <HealthContent />
      </MobileNavigation>
    </ThemeWrapper>
  );
};

export default Dashboard;
