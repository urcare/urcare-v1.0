import { HealthContentNew } from "@/components/HealthContentNew";
import { MobileNavigation } from "@/components/MobileNavigation";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen">
      <ThemeWrapper>
        <MobileNavigation>
          <HealthContentNew />
        </MobileNavigation>
      </ThemeWrapper>
    </div>
  );
};

export default Dashboard;
