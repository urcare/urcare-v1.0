
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Bell, Search, User, Shield, Video, Calendar } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PatientHeaderProps {
  activeSection: string;
  onMenuClick: () => void;
}

const sectionTitles: Record<string, string> = {
  'home': 'Dashboard',
  'health-records': 'Health Records',
  'appointments': 'Appointments',
  'teleconsult': 'Teleconsultation',
  'medications': 'Medications',
  'wellness': 'Wellness Hub',
  'emergency': 'Emergency Center',
  'community': 'Community',
  'family': 'Family Care',
  'profile': 'Profile & Settings'
};

export const PatientHeader: React.FC<PatientHeaderProps> = ({
  activeSection,
  onMenuClick
}) => {
  return (
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between p-4 lg:p-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {sectionTitles[activeSection] || 'Dashboard'}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
              Welcome back, manage your health journey
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Quick Actions */}
          <Button
            variant="outline"
            size="sm"
            className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/30 hidden md:flex"
          >
            <Video className="w-4 h-4 mr-2" />
            Teleconsult
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-green-200 text-green-600 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/30 hidden md:flex"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book
          </Button>

          {/* Emergency Button */}
          <Button
            variant="outline"
            size="sm"
            className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30 hidden sm:flex"
          >
            <Shield className="w-4 h-4 mr-2" />
            Emergency
          </Button>

          {/* Search */}
          <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-gray-100 dark:hover:bg-gray-800">
            <Search className="w-5 h-5" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 dark:hover:bg-gray-800">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">3</span>
            </span>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Profile */}
          <Avatar className="w-8 h-8 border-2 border-gray-200 dark:border-gray-700">
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback className="bg-blue-500 text-white text-sm font-semibold">
              DR
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};
