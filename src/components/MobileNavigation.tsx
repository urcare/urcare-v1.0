import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface MobileNavigationProps {
  children: React.ReactNode;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  children,
}) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check if a route is active
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const handleHomeNavigation = () => {
    navigate("/dashboard");
  };

  const handleCameraNavigation = () => {
    navigate("/camera");
  };

  const handleNurseNavigation = () => {
    navigate("/nurse");
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
    <div className="relative h-screen overflow-hidden bg-gray-900">
      {/* Main Content Area - Clean layout without menu */}
      <div className="h-full relative z-10 bg-gray-900">
        {/* Content - Full screen without containers */}
        <div className="bg-gray-900 min-h-screen pb-24">{children}</div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-6 left-4 right-4">
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl px-4 py-3 shadow-2xl border border-white/30 ring-1 ring-white/20">
            <div className="flex items-center justify-center gap-8">
              {/* Home Icon */}
              <div
                onClick={handleHomeNavigation}
                className={`w-14 h-14 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-300 cursor-pointer border ${
                  isActiveRoute("/dashboard")
                    ? "bg-blue-500/80 border-blue-400 shadow-lg shadow-blue-500/30"
                    : "bg-white/30 border-white/20 hover:bg-white/40"
                }`}
              >
                <img
                  src="/icons/home.png"
                  alt="Home"
                  className={`w-7 h-7 transition-all duration-300 ${
                    isActiveRoute("/dashboard") ? "brightness-0 invert" : ""
                  }`}
                />
              </div>

              {/* Camera Icon */}
              <div
                onClick={handleCameraNavigation}
                className={`w-14 h-14 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-300 cursor-pointer border ${
                  isActiveRoute("/camera")
                    ? "bg-blue-500/80 border-blue-400 shadow-lg shadow-blue-500/30"
                    : "bg-white/30 border-white/20 hover:bg-white/40"
                }`}
              >
                <img
                  src="/icons/camera.png"
                  alt="Camera"
                  className={`w-7 h-7 transition-all duration-300 ${
                    isActiveRoute("/camera") ? "brightness-0 invert" : ""
                  }`}
                />
              </div>

              {/* Nurse Icon */}
              <div
                onClick={handleNurseNavigation}
                className={`w-14 h-14 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-300 cursor-pointer border ${
                  isActiveRoute("/nurse")
                    ? "bg-blue-500/80 border-blue-400 shadow-lg shadow-blue-500/30"
                    : "bg-white/30 border-white/20 hover:bg-white/40"
                }`}
              >
                <img
                  src="/icons/nurse.png"
                  alt="Nurse"
                  className={`w-7 h-7 transition-all duration-300 ${
                    isActiveRoute("/nurse") ? "brightness-0 invert" : ""
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
