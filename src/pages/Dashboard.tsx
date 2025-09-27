import { HealthContentNew } from "@/components/HealthContentNew";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="bg-green-500 min-h-screen">
      <ThemeWrapper>
        <div className="space-y-2">
          <HealthContentNew />
        </div>
      </ThemeWrapper>
    </div>
  );
};

export default Dashboard;
