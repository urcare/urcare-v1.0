import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Check, Edit, Settings, Shield } from "lucide-react";
import React, { useMemo } from "react";

export const DashboardHeader: React.FC = () => {
  const { user, profile } = useAuth();

  // Calculate health index based on profile data (out of 10)
  const healthIndex = useMemo(() => {
    if (!profile) return 0;

    let score = 5; // Base score (middle of 10-point scale)

    // BMI calculation
    if (profile.height_cm && profile.weight_kg) {
      const height = parseFloat(profile.height_cm);
      const weight = parseFloat(profile.weight_kg);
      const bmi = weight / (height / 100) ** 2;

      if (bmi >= 18.5 && bmi <= 24.9) {
        score += 2; // Healthy BMI
      } else if (bmi < 18.5 || bmi > 30) {
        score -= 1.5; // Underweight or obese
      } else {
        score += 0.5; // Overweight but not obese
      }
    }

    // Age factor
    if (profile.age) {
      if (profile.age >= 18 && profile.age <= 65) {
        score += 1;
      } else if (profile.age > 65) {
        score += 0.5;
      }
    }

    // Sleep schedule
    if (profile.sleep_time && profile.wake_up_time) {
      score += 1; // Has sleep schedule
    }

    // Workout routine
    if (profile.workout_time) {
      score += 1; // Has workout routine
    }

    // Diet type
    if (profile.diet_type && profile.diet_type !== "none") {
      score += 0.5; // Has dietary preferences
    }

    // Chronic conditions (negative impact)
    if (profile.chronic_conditions && profile.chronic_conditions.length > 0) {
      score -= profile.chronic_conditions.length * 0.5;
    }

    // Ensure score is between 0 and 10
    return Math.max(0, Math.min(10, Math.round(score * 10) / 10));
  }, [profile]);

  const getIndexColor = (index: number) => {
    if (index >= 8) return "text-green-500";
    if (index >= 6) return "text-yellow-500";
    return "text-red-500";
  };

  const getFirstName = () => {
    if (profile?.full_name) {
      return profile.full_name.split(" ")[0];
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  if (!user || !profile) {
    return (
      <div className="h-1/4 bg-transparent px-4 pt-4">
        <div className="text-gray-500 text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-3/20 bg-transparent px-2 sm:px-4 pt-2 sm:pt-4">
      {/* Profile Section - Matching the image layout */}
      <div className="flex items-center justify-between">
        {/* Left side - Profile info */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Profile Photo */}
          <Avatar className="w-12 h-12 sm:w-16 sm:h-16 ring-2 ring-white/50 shadow-lg">
            <AvatarImage
              src={
                user.user_metadata?.avatar_url ||
                user.user_metadata?.picture ||
                "/images/profile-placeholder.jpg"
              }
              alt={profile.full_name || "User"}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm sm:text-lg font-bold">
              {(profile.full_name || user?.email || "U")
                .charAt(0)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* User Info */}
          <div className="flex flex-col">
            {/* Professional greeting */}
            <h2
              className="text-lg sm:text-xl font-light text-gray-800 mb-1 sm:mb-2 tracking-wide"
              style={{
                fontFamily:
                  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              Hi, {getFirstName()}
            </h2>

            {/* Health Index with professional styling */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1">
                <span
                  className={`text-lg sm:text-xl font-bold ${getIndexColor(
                    healthIndex
                  )}`}
                >
                  {healthIndex.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-green-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-green-200/50">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" />
                <span className="text-xs sm:text-sm text-green-700 font-medium ml-1">
                  Health Index
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Edit and Settings icons */}
        <div className="flex flex-col gap-1 sm:gap-2">
          <button className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
            <Edit className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
          </button>
          <button className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
            <Settings className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
};
