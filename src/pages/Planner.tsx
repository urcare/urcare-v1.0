import { MobileNavigation } from "@/components/MobileNavigation";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, Target } from "lucide-react";
import React, { useState } from "react";

const Planner: React.FC = () => {
  const { user, profile } = useAuth();
  const [currentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(22);
  const [selectedDay, setSelectedDay] = useState(
    new Date().toISOString().split("T")[0]
  );

  return (
    <ThemeWrapper>
      <div className="min-h-screen bg-background">
        <MobileNavigation />

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Health Planner
            </h1>
            <p className="text-muted-foreground">
              Plan your health and wellness activities
            </p>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Planner Coming Soon
              </h3>
              <p className="text-muted-foreground mb-6">
                The health planner feature is currently under development.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4" />
                <span>Track your health goals</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeWrapper>
  );
};

export default Planner;
