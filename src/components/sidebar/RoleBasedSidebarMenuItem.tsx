
import React, { useState } from 'react';
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { MenuItem } from './roleBasedMenus';
import { cn } from "@/lib/utils";
import { useLocation } from 'react-router-dom';

interface RoleBasedSidebarMenuItemProps {
  item: MenuItem;
  isCollapsed?: boolean;
}

export function RoleBasedSidebarMenuItem({ item, isCollapsed }: RoleBasedSidebarMenuItemProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const location = useLocation();
  const isActive = location.pathname === item.url;

  return (
    <SidebarMenuItem>
      <div 
        className="relative group"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <SidebarMenuButton 
          asChild
          className={cn(
            "group relative w-full rounded-2xl transition-all duration-300 ease-in-out",
            "hover:bg-blue-50/80 dark:hover:bg-blue-950/30 hover:shadow-md",
            "focus:bg-blue-50/80 dark:focus:bg-blue-950/30 focus:shadow-md",
            "border border-transparent hover:border-blue-100 dark:hover:border-blue-900/50",
            isActive && [
              "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg",
              "hover:from-blue-600 hover:to-blue-700",
              "dark:from-blue-600 dark:to-blue-700"
            ],
            !isActive && "text-gray-700 dark:text-gray-300"
          )}
        >
          <a href={item.url} className="flex items-center gap-3 px-4 py-3 relative">
            {/* Floating pill indicator for active state */}
            {isActive && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 opacity-100 transition-opacity duration-300" />
            )}
            
            <div className={cn(
              "flex items-center justify-center w-5 h-5 transition-all duration-300 relative z-10",
              isActive ? "text-white" : "text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
            )}>
              <item.icon className="w-5 h-5" />
            </div>
            
            {!isCollapsed && (
              <>
                <span className={cn(
                  "font-medium transition-all duration-300 flex-1 relative z-10",
                  isActive ? "text-white" : "group-hover:text-blue-600 dark:group-hover:text-blue-400"
                )}>
                  {item.title}
                </span>
                
                {item.badge && (
                  <span className={cn(
                    "px-2 py-1 text-xs font-semibold rounded-full transition-all duration-300 relative z-10",
                    isActive 
                      ? "bg-white/20 text-white backdrop-blur-sm" 
                      : "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                  )}>
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </a>
        </SidebarMenuButton>

        {/* Tooltip for collapsed mode */}
        {isCollapsed && showTooltip && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 animate-fade-in">
            <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap shadow-xl border border-gray-200 dark:border-gray-700">
              {item.title}
              {item.description && (
                <div className="text-xs opacity-75 mt-1">{item.description}</div>
              )}
              {item.badge && (
                <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                  {item.badge}
                </span>
              )}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45" />
            </div>
          </div>
        )}
      </div>
    </SidebarMenuItem>
  );
}
