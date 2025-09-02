import {
  Crown,
  FileText,
  Gift,
  Grid,
  Heart,
  Home,
  LogOut,
  Menu,
  ShoppingCart,
  Store,
  ThumbsUp,
  User,
  Wallet,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setAnimateItems(false);
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
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-md">
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
        {/* Hamburger Menu Button */}
        <button
          onClick={toggleMenu}
          className="ml-4 sm:ml-6 mt-4 sm:mt-6 w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors relative z-20"
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
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
