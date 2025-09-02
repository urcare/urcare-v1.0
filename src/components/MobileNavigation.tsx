import {
  Crown,
  FileText,
  Gift,
  Grid,
  Heart,
  Home,
  LogOut,
  MapPin,
  Menu,
  ShoppingCart,
  ThumbsUp,
  User,
  Wallet,
  X,
} from "lucide-react";
import React, { useState } from "react";

interface MobileNavigationProps {
  children: React.ReactNode;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  children,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 sm:w-72 md:w-80 bg-gradient-to-b from-green-400 to-green-600 z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Profile Icon - Top Left */}
        <div className="absolute top-4 left-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-md">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </div>
        </div>

        {/* Menu Items */}
        <div className="mt-20 sm:mt-24 px-4 sm:px-6 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3 sm:gap-4 text-white cursor-pointer hover:bg-green-500/30 p-2 sm:p-3 rounded-lg transition-colors">
            <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base font-medium">Categories</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-white cursor-pointer hover:bg-green-500/30 p-2 sm:p-3 rounded-lg transition-colors">
            <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base font-medium">Wallet</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-white cursor-pointer hover:bg-green-500/30 p-2 sm:p-3 rounded-lg transition-colors">
            <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base font-medium">Ideas</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-white cursor-pointer hover:bg-green-500/30 p-2 sm:p-3 rounded-lg transition-colors">
            <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base font-medium">
              Subscription
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-white cursor-pointer hover:bg-green-500/30 p-2 sm:p-3 rounded-lg transition-colors">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base font-medium">Creator</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-white cursor-pointer hover:bg-green-500/30 p-2 sm:p-3 rounded-lg transition-colors">
            <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base font-medium">Program</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-white cursor-pointer hover:bg-green-500/30 p-2 sm:p-3 rounded-lg transition-colors">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base font-medium">
              Blog & Articles
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-white cursor-pointer hover:bg-green-500/30 p-2 sm:p-3 rounded-lg transition-colors">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base font-medium">
              Help & Support
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-white cursor-pointer hover:bg-green-500/30 p-2 sm:p-3 rounded-lg transition-colors mt-auto">
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base font-medium">Logout</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={closeMenu}
          className="absolute top-4 right-4 w-8 h-8 bg-green-500/50 rounded-full flex items-center justify-center hover:bg-green-500/70 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Main Content Area */}
      <div
        className={`h-full transition-transform duration-300 ease-in-out ${
          isMenuOpen
            ? "translate-x-64 sm:translate-x-72 md:translate-x-80"
            : "translate-x-0"
        }`}
      >
        {/* Hamburger Menu Button */}
        <button
          onClick={toggleMenu}
          className="ml-4 sm:ml-6 mt-4 sm:mt-6 w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </button>

        {/* Content */}
        <div className="px-4 sm:px-6 mt-4 sm:mt-6">{children}</div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <Home className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
              <div className="w-1 h-1 bg-orange-500 rounded-full mt-1"></div>
            </div>
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <Grid className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
        />
      )}
    </div>
  );
};
