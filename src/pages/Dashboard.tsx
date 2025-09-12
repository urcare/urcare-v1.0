import { HealthContentNew } from "@/components/HealthContentNew";
import { MobileNavigation } from "@/components/MobileNavigation";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import React from "react";

const Dashboard: React.FC = () => {
  return (
    <ThemeWrapper>
      <MobileNavigation>
        <HealthContentNew />
      </MobileNavigation>
    </ThemeWrapper>
  );
};

export default Dashboard;
