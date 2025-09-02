import React, { useState } from 'react';
import { 
  Grid, 
  Wallet, 
  Gift, 
  Crown, 
  MapPin, 
  ThumbsUp, 
  FileText, 
  Heart, 
  LogOut,
  Search,
  X,
  Menu,
  Home,
  ShoppingCart
} from 'lucide-react';

interface MobileNavigationProps {
  children: React.ReactNode;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ children }) => {
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
        className={`fixed top-0 left-0 h-full w-80 bg-green-500 z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Status Bar */}
        <div className="text-white text-sm font-medium pt-6 pl-6">
          9:41
        </div>

        {/* Search Icon */}
        <div className="flex justify-center mt-6">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <Search className="w-6 h-6 text-green-500" />
          </div>
        </div>

        {/* Menu Items */}
        <div className="mt-8 px-6 space-y-6">
          <div className="flex items-center gap-4 text-white cursor-pointer hover:bg-green-600 p-3 rounded-lg transition-colors">
            <Grid className="w-6 h-6" />
            <span className="text-lg font-medium">Categories</span>
          </div>
          
          <div className="flex items-center gap-4 text-white cursor-pointer hover:bg-green-600 p-3 rounded-lg transition-colors">
            <Wallet className="w-6 h-6" />
            <span className="text-lg font-medium">Wallet</span>
          </div>
          
          <div className="flex items-center gap-4 text-white cursor-pointer hover:bg-green-600 p-3 rounded-lg transition-colors">
            <Gift className="w-6 h-6" />
            <span className="text-lg font-medium">Ideas</span>
          </div>
          
          <div className="flex items-center gap-4 text-white cursor-pointer hover:bg-green-600 p-3 rounded-lg transition-colors">
            <Crown className="w-6 h-6" />
            <span className="text-lg font-medium">Subscription</span>
          </div>
          
          <div className="flex items-center gap-4 text-white cursor-pointer hover:bg-green-600 p-3 rounded-lg transition-colors">
            <MapPin className="w-6 h-6" />
            <span className="text-lg font-medium">Creator</span>
          </div>
          
          <div className="flex items-center gap-4 text-white cursor-pointer hover:bg-green-600 p-3 rounded-lg transition-colors">
            <ThumbsUp className="w-6 h-6" />
            <span className="text-lg font-medium">Program</span>
          </div>
          
          <div className="flex items-center gap-4 text-white cursor-pointer hover:bg-green-600 p-3 rounded-lg transition-colors">
            <FileText className="w-6 h-6" />
            <span className="text-lg font-medium">Blog & Articles</span>
          </div>
          
          <div className="flex items-center gap-4 text-white cursor-pointer hover:bg-green-600 p-3 rounded-lg transition-colors">
            <Heart className="w-6 h-6" />
            <span className="text-lg font-medium">Help & Support</span>
          </div>
          
          <div className="flex items-center gap-4 text-white cursor-pointer hover:bg-green-600 p-3 rounded-lg transition-colors mt-auto">
            <LogOut className="w-6 h-6" />
            <span className="text-lg font-medium">Logout</span>
          </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={closeMenu}
          className="absolute top-6 right-6 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center hover:bg-green-300 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Main Content Area */}
      <div 
        className={`h-full transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-80' : 'translate-x-0'
        }`}
      >
        {/* Status Bar */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="text-black text-sm font-medium">9:41</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-black rounded-full"></div>
            <div className="w-2 h-2 bg-black rounded-full"></div>
            <div className="w-2 h-2 bg-black rounded-full"></div>
          </div>
        </div>

        {/* Hamburger Menu Button */}
        <button 
          onClick={toggleMenu}
          className="ml-6 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        {/* Content */}
        <div className="px-6 mt-6">
          {children}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <Home className="w-6 h-6 text-gray-400" />
              <div className="w-1 h-1 bg-orange-500 rounded-full mt-1"></div>
            </div>
            <Heart className="w-6 h-6 text-gray-400" />
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <Grid className="w-6 h-6 text-white" />
            </div>
            <ShoppingCart className="w-6 h-6 text-gray-400" />
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
