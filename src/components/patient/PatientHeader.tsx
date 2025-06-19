
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Bell, Search, User, Shield } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface PatientHeaderProps {
  activeSection: string;
  onMenuClick: () => void;
}

const sectionTitles: Record<string, string> = {
  'home': 'Dashboard Home',
  'health-records': 'Health Records',
  'appointments': 'Appointments',
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
    <header className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-30">
      <div className="flex items-center justify-between p-4 lg:p-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              {sectionTitles[activeSection] || 'Dashboard'}
            </h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Welcome back, manage your health journey
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Emergency Button */}
          <Button
            variant="outline"
            size="sm"
            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground hidden sm:flex"
          >
            <Shield className="w-4 h-4 mr-2" />
            Emergency
          </Button>

          {/* Search */}
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="w-5 h-5" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full flex items-center justify-center">
              <span className="text-xs text-destructive-foreground font-bold">3</span>
            </span>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Profile */}
          <Button variant="ghost" size="icon">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
