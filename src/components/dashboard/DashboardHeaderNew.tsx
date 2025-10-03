import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Bell } from "lucide-react";
import React from "react";

export const DashboardHeaderNew: React.FC = () => {
  const { user, profile } = useAuth();

  const getFullName = () => {
    if (profile?.full_name) {
      return profile.full_name.toUpperCase();
    }
    if (user?.email) {
      return user.email.split("@")[0].toUpperCase();
    }
    return "USER";
  };

  if (!user) {
    return (
      <div className="bg-black px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200"></div>
            <div>
              <h2 className="text-lg font-bold text-white">LOADING...</h2>
            </div>
          </div>
          <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Profile info */}
        <div className="flex items-center gap-3">
          {/* Profile Photo */}
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={
                user.user_metadata?.avatar_url ||
                user.user_metadata?.picture ||
                "/images/profile-placeholder.jpg"
              }
              alt={profile?.full_name || "User"}
            />
            <AvatarFallback className="bg-gray-800 text-white text-sm font-bold">
              {(profile?.full_name || user?.email || "U")
                .charAt(0)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* User Name */}
          <div>
            <h2 className="text-lg font-bold text-white">{getFullName()}</h2>
          </div>
        </div>

        {/* Right side - Notifications */}
        <div className="flex items-center">
          {/* Notifications icon with green dot */}
          <div className="relative">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Bell className="w-5 h-5 text-gray-600" />
            </div>
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
