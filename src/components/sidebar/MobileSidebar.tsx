
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, X, Heart, LogOut } from 'lucide-react';
import { getMenuSectionsByRole, bottomMenuItems } from './roleBasedMenus';
import { RoleBasedSidebarMenuItem } from './RoleBasedSidebarMenuItem';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  // Get menu sections based on user role
  const menuSections = getMenuSectionsByRole(profile?.role || 'patient');

  const handleLogout = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Close sidebar when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [window.location.pathname]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className="w-5 h-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="left" 
        className={cn(
          "w-80 p-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r",
          "border-gray-200/50 dark:border-gray-800/50"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="border-b border-gray-200/50 dark:border-gray-800/50 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg">
                  <img src="/urcare-logo.svg" alt="UrCare Logo" className="w-8 h-8" />
                </div>
                <div>
                                      <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      UrCare
                    </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Healthcare Management
                  </p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* User Profile Section */}
            {profile && (
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 ring-2 ring-blue-200 dark:ring-blue-800">
                    <AvatarImage src="/placeholder-avatar.jpg" alt={profile.full_name || 'User'} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-semibold">
                      {(profile.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {profile.full_name || user?.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 truncate font-medium">
                      {profile.role || 'Patient'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
            {menuSections.map((section) => (
              <div key={section.title} className="space-y-2">
                <div className="px-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  {section.title}
                </div>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <div key={item.title} onClick={() => setIsOpen(false)}>
                      <RoleBasedSidebarMenuItem 
                        item={item} 
                        isCollapsed={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200/50 dark:border-gray-800/50 p-4 space-y-3">
            {/* Theme Toggle */}
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <ThemeToggle />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Theme
              </span>
            </div>
            
            {/* Bottom Menu Items */}
            <div className="space-y-2">
              {bottomMenuItems.map((item) => (
                <div key={item.title} onClick={() => setIsOpen(false)}>
                  <RoleBasedSidebarMenuItem 
                    item={item} 
                    isCollapsed={false}
                  />
                </div>
              ))}
            </div>

            {/* Logout Button */}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-3 px-4 py-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 border border-transparent hover:border-red-100 dark:hover:border-red-900/50"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
