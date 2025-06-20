
import React, { useState } from 'react';
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
import { mainMenuSections, bottomMenuItems } from './sidebar/menuItems';
import { ModernSidebarMenuItemComponent } from './sidebar/ModernSidebarMenuItem';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const { open, setOpen } = useSidebar();

  return (
    <Sidebar className={cn(
      "border-r border-gray-200 dark:border-gray-800 transition-all duration-300",
      "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm"
    )}>
      {/* Header */}
      <SidebarHeader className="border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Heart className="w-6 h-6 text-white" />
          </div>
          
          {open && (
            <div className="flex-1 animate-fade-in">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">UrCare</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">AI-Powered Healthcare</p>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
            className={cn(
              "w-8 h-8 rounded-lg transition-all duration-300",
              "hover:bg-gray-100 dark:hover:bg-gray-800",
              "text-gray-600 dark:text-gray-400"
            )}
          >
            {open ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </div>
      </SidebarHeader>

      {/* Main Content */}
      <SidebarContent className="px-2 py-4">
        {mainMenuSections.map((section, index) => (
          <SidebarGroup key={section.title} className="mb-4">
            {open && (
              <SidebarGroupLabel className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                {section.title}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {section.items.map((item) => (
                  <ModernSidebarMenuItemComponent 
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
      <SidebarFooter className="border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="space-y-1">
          {/* Theme Toggle */}
          <div className={cn(
            "flex items-center gap-3 px-3 py-2",
            !open && "justify-center"
          )}>
            <ThemeToggle />
            {open && (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Dark Mode
              </span>
            )}
          </div>
          
          {/* Bottom Menu Items */}
          <SidebarMenu className="space-y-1">
            {bottomMenuItems.map((item) => (
              <ModernSidebarMenuItemComponent 
                key={item.title} 
                item={item} 
                isCollapsed={!open}
              />
            ))}
          </SidebarMenu>
        </div>

        {/* User Profile Section */}
        {open && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">DR</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  Dr. Sarah Wilson
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  Cardiologist
                </p>
              </div>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
