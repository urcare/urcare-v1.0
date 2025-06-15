
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarHeader,
  SidebarFooter,
  useSidebar
} from "@/components/ui/sidebar";
import { getMenuSectionsByRole, bottomMenuItems } from './roleBasedMenus';
import { RoleBasedSidebarMenuItem } from './RoleBasedSidebarMenuItem';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Heart, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export function RoleBasedSidebar() {
  const { open, setOpen } = useSidebar();
  const { user, profile, signOut } = useAuth();

  // Get menu sections based on user role
  const menuSections = getMenuSectionsByRole(profile?.role || 'patient');

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Sidebar className={cn(
      "border-r border-gray-200/50 dark:border-gray-800/50 transition-all duration-300",
      "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl",
      "shadow-xl shadow-gray-200/20 dark:shadow-gray-900/20"
    )}>
      {/* Header with Profile */}
      <SidebarHeader className="border-b border-gray-200/50 dark:border-gray-800/50 p-4">
        <div className="flex items-center gap-3">
          {/* Hospital Logo */}
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Heart className="w-6 h-6 text-white" />
          </div>
          
          {open && (
            <div className="flex-1 animate-fade-in">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                UrCare
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Healthcare Management
              </p>
            </div>
          )}
          
          {/* Collapse Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
            className={cn(
              "w-8 h-8 rounded-xl transition-all duration-300",
              "hover:bg-gray-100 dark:hover:bg-gray-800",
              "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            )}
          >
            {open ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* User Profile Section */}
        {open && profile && (
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl border border-blue-100 dark:border-blue-900/30 animate-fade-in">
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
      </SidebarHeader>

      {/* Main Content */}
      <SidebarContent className="px-3 py-4 space-y-6">
        {menuSections.map((section, index) => (
          <SidebarGroup key={section.title} className="space-y-2">
            {open && (
              <SidebarGroupLabel className="px-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                {section.title}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {section.items.map((item) => (
                  <RoleBasedSidebarMenuItem 
                    key={item.title} 
                    item={item} 
                    isCollapsed={!open}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-gray-200/50 dark:border-gray-800/50 p-4 space-y-3">
        {/* Theme Toggle */}
        <div className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300",
          "hover:bg-gray-50 dark:hover:bg-gray-800/50",
          !open && "justify-center"
        )}>
          <ThemeToggle />
          {open && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Theme
            </span>
          )}
        </div>
        
        {/* Bottom Menu Items */}
        <SidebarMenu className="space-y-2">
          {bottomMenuItems.map((item) => (
            <RoleBasedSidebarMenuItem 
              key={item.title} 
              item={item} 
              isCollapsed={!open}
            />
          ))}
        </SidebarMenu>

        {/* Logout Button */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full justify-start gap-3 px-4 py-3 rounded-2xl transition-all duration-300",
            "hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-700 dark:text-gray-300",
            "hover:text-red-600 dark:hover:text-red-400 border border-transparent",
            "hover:border-red-100 dark:hover:border-red-900/50",
            !open && "justify-center px-2"
          )}
        >
          <LogOut className="w-5 h-5" />
          {open && <span className="font-medium">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
