import { useAuth } from "@/contexts/AuthContext";
import {
  Bell,
  Crown,
  FileText,
  Gift,
  Grid,
  Heart,
  LogOut,
  Menu,
  Store,
  ThumbsUp,
  User,
  Wallet,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Helper functions for header
const getGreeting = () => {
  return "Hello";
};

const getUserName = () => {
  // You can replace this with actual user data from your auth context
  return "John";
};

interface MobileNavigationProps {
  children: React.ReactNode;
}

const menuItems = [
  { icon: Grid, label: "Categories", delay: 0 },
  { icon: Wallet, label: "Wallet", delay: 100 },
  { icon: Gift, label: "Gift Ideas", delay: 200 },
  { icon: Crown, label: "Subscription", delay: 300 },
  { icon: Store, label: "Store Locator", delay: 400 },
  { icon: ThumbsUp, label: "Loyalty Program", delay: 500 },
  { icon: FileText, label: "Blog & Articles", delay: 600 },
  { icon: Heart, label: "Help & Support", delay: 700 },
  { icon: LogOut, label: "Logout", delay: 800 },
];

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  children,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [animateItems, setAnimateItems] = useState(false);
  const [greeting, setGreeting] = useState("");
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Initialize greeting on component mount
  useEffect(() => {
    setGreeting("Hello");
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setAnimateItems(false);
  };

  const handleDietNavigation = () => {
    navigate("/diet");
  };

  const handleWorkoutNavigation = () => {
    navigate("/workout");
  };

  const handleHomeNavigation = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    if (isMenuOpen) {
      // Start animation after menu is visible
      const timer = setTimeout(() => setAnimateItems(true), 50);
      return () => clearTimeout(timer);
    } else {
      setAnimateItems(false);
    }
  }, [isMenuOpen]);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Mobile Navigation Drawer - Full Screen */}
      <div
        className={`fixed inset-0 bg-gradient-to-b from-green-700 to-green-900 backdrop-blur-md bg-opacity-67 z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Profile Icon - Top Left */}
        <div className="absolute top-4 left-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-transparent rounded-full flex items-center justify-center shadow-md">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={closeMenu}
          className="absolute top-4 right-4 w-8 h-8 bg-green-600/80 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors backdrop-blur-sm"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        {/* Menu Items with Staggered Animation */}
        <div className="mt-20 sm:mt-24 px-4 sm:px-6 space-y-3 sm:space-y-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`flex items-center gap-3 sm:gap-4 text-white cursor-pointer hover:bg-green-600/40 p-2 sm:p-3 rounded-lg transition-all duration-300 transform backdrop-blur-sm ${
                  animateItems
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-full opacity-0"
                }`}
                style={{
                  transitionDelay: animateItems ? `${item.delay}ms` : "0ms",
                }}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-base sm:text-lg font-medium">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area - Remains at normal size when menu is open */}
      <div
        className={`h-full transition-all duration-300 ease-in-out relative z-10 ${
          isMenuOpen ? "transform translate-x-[25%]" : "translate-x-0"
        }`}
      >
        {/* Header with Greeting and User Profile */}
        <div className="px-3 pt-2 pb-2">
          <div className="flex items-center justify-between">
            {/* Left Side - Menu Button and Greeting */}
            <div className="flex items-center gap-2">
              {/* Hamburger Menu Button */}
              <button
                onClick={toggleMenu}
                className="w-8 h-8 bg-transparent rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors relative z-20"
              >
                <Menu className="w-4 h-4 text-gray-700" />
              </button>

              {/* Greeting */}
              <div className="flex flex-col">
                <h1 className="text-sm font-semibold text-gray-800">
                  {greeting},{" "}
                  {user?.user_metadata?.full_name ||
                    user?.email?.split("@")[0] ||
                    "Guest"}
                </h1>
              </div>
            </div>

            {/* Right Side - Notification and Profile */}
            <div className="flex items-center space-x-2">
              {/* Notification Bell */}
              <div className="relative">
                <div className="w-8 h-8 bg-transparent rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                  <Bell className="w-4 h-4 text-gray-600" />
                </div>
                {/* Notification Dot */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </div>

              {/* User Profile Picture */}
              <div className="w-8 h-8 rounded-full overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                <img
                  src={
                    user?.user_metadata?.avatar_url ||
                    user?.user_metadata?.picture ||
                    "/images/profile-placeholder.jpg"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236B7280'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 mt-4 sm:mt-6 pb-24 overflow-y-auto max-h-[calc(100vh-120px)]">
          {children}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-6 left-4 right-4">
          <div className="bg-white/20 backdrop-blur-xl rounded-full px-4 py-3 shadow-2xl border border-white/30 ring-1 ring-white/20">
            <div className="flex items-center justify-between">
              {/* Home Icon */}
              <div
                onClick={handleHomeNavigation}
                className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-all duration-300 cursor-pointer border border-white/20"
              >
                <img src="/icons/home.png" alt="Home" className="w-7 h-7" />
              </div>

              {/* Meals Icon */}
              <div
                onClick={handleDietNavigation}
                className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-all duration-300 cursor-pointer border border-white/20"
              >
                <img src="/icons/diet.png" alt="Meals" className="w-7 h-7" />
              </div>

              {/* Workout Icon */}
              <div
                onClick={handleWorkoutNavigation}
                className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-all duration-300 cursor-pointer border border-white/20"
              >
                <img src="/icons/gym.png" alt="Workout" className="w-7 h-7" />
              </div>

              {/* Profile Icon */}
              <div className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-all duration-300 cursor-pointer border border-white/20">
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
