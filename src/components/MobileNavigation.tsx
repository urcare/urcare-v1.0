import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import { useNavigate } from "react-router-dom";

interface MobileNavigationProps {
  children: React.ReactNode;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  children,
}) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleDietNavigation = () => {
    navigate("/diet");
  };

  const handleWorkoutNavigation = () => {
    navigate("/workout");
  };

  const handlePlannerNavigation = () => {
    navigate("/planner");
  };

  const handleHomeNavigation = () => {
    navigate("/dashboard");
  };

  const handleHealthPlanNavigation = () => {
    navigate("/health-plan");
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // The signOut function will handle the redirect automatically
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback redirect in case of error
      window.location.href = "/";
    }
  };

  // Navigation handlers for bottom navigation only

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Main Content Area - Clean layout without menu */}
      <div className="h-full relative z-10">
        {/* Clean Header - No menu button, notifications, or profile elements */}
        <div className="px-3 pt-2 pb-2">
          {/* Empty header space for future components */}
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 mt-4 sm:mt-6 pb-24 overflow-hidden">
          {children}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-6 left-4 right-4">
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl px-4 py-3 shadow-2xl border border-white/30 ring-1 ring-white/20">
            <div className="flex items-center justify-between">
              {/* Home Icon */}
              <div
                onClick={handleHomeNavigation}
                className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-white/40 transition-all duration-300 cursor-pointer border border-white/20"
              >
                <img src="/icons/home.png" alt="Home" className="w-7 h-7" />
              </div>

              {/* Planner Icon */}
              <div
                onClick={handlePlannerNavigation}
                className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-white/40 transition-all duration-300 cursor-pointer border border-white/20"
              >
                <img
                  src="/icons/planner.png"
                  alt="Planner"
                  className="w-7 h-7"
                />
              </div>

              {/* Meals Icon */}
              <div
                onClick={handleDietNavigation}
                className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-white/40 transition-all duration-300 cursor-pointer border border-white/20"
              >
                <img src="/icons/diet.png" alt="Meals" className="w-7 h-7" />
              </div>

              {/* Workout Icon */}
              <div
                onClick={handleWorkoutNavigation}
                className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-white/40 transition-all duration-300 cursor-pointer border border-white/20"
              >
                <img src="/icons/gym.png" alt="Workout" className="w-7 h-7" />
              </div>

              {/* Profile Icon */}
              <div className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-white/40 transition-all duration-300 cursor-pointer border border-white/20">
                <img
                  src="/icons/profile.png"
                  alt="Profile"
                  className="w-7 h-7"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
