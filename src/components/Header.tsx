
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ProfileMenu } from './ProfileMenu';
import { ProfileSwitcher } from './ProfileSwitcher';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { MobileSidebar } from './sidebar/MobileSidebar';

export function Header() {
  return (
    <header className="border-b bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm sticky top-0 z-40 transition-colors duration-300">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Mobile Sidebar Trigger */}
          <MobileSidebar />
          
          {/* Desktop Sidebar Trigger */}
          <SidebarTrigger className="hidden md:block" />
          
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search patients, appointments..."
              className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-700 transition-colors duration-300"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative h-9 w-9">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-[10px] text-white font-bold">3</span>
            </span>
          </Button>

          {/* Theme Toggle - Hidden on mobile to save space */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          
          {/* Profile Switcher - Hidden on mobile */}
          <div className="hidden lg:block">
            <ProfileSwitcher />
          </div>
          
          {/* Profile Menu */}
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
