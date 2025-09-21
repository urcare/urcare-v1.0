import { HealthContentNew } from "@/components/HealthContentNew";
import { MobileNavigation } from "@/components/MobileNavigation";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import { UpcomingTasksCard } from "@/components/UpcomingTasksCard";
import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen">
      <ThemeWrapper>
        <MobileNavigation>
          <div className="p-4 space-y-6">
            <HealthContentNew />
            <UpcomingTasksCard />
          </div>
        </MobileNavigation>
      </ThemeWrapper>
    </div>
  );
};

export default Dashboard;
