import { ThemeWrapper } from "@/components/ThemeWrapper";
import { MobileNavigation } from "./MobileNavigation";
import { HealthContent } from "./HealthContent";

export const Dashboard = () => {
  return (
    <ThemeWrapper>
      <MobileNavigation>
        <HealthContent />
      </MobileNavigation>
    </ThemeWrapper>
  );
};
