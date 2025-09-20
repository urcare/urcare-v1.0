import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, LogOut } from "lucide-react";
import React from "react";

export const DashboardHeaderNew: React.FC = () => {
  const { user, profile, signOut } = useAuth();

  const getFirstName = () => {
    if (profile?.full_name) {
      return profile.full_name.split(" ")[0];
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200"></div>
          <div>
            <h2 className="text-lg font-medium text-gray-800">Loading...</h2>
          </div>
        </div>
        <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-4 py-1">
      {/* Left side - Logout button and Profile info */}
      <div className="flex items-center gap-3">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5 text-gray-600" />
        </button>

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
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold">
            {(profile?.full_name || user?.email || "U").charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Greeting */}
        <div>
          <h2 className="text-lg font-medium text-gray-800">
            Hello, {getFirstName()}!
          </h2>
        </div>
      </div>

      {/* Right side - Notifications only */}
      <div className="flex items-center gap-3">
        {/* Notifications icon with red dot */}
        <div className="relative">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
          </div>
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
