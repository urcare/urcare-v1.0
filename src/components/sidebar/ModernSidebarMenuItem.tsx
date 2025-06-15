
import React, { useState } from 'react';
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { MenuItem } from './menuItems';
import { cn } from "@/lib/utils";
import { useLocation } from 'react-router-dom';

interface ModernSidebarMenuItemProps {
  item: MenuItem;
  isCollapsed?: boolean;
}

export function ModernSidebarMenuItemComponent({ item, isCollapsed }: ModernSidebarMenuItemProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const location = useLocation();
  const isActive = location.pathname === item.url;

  return (
    <SidebarMenuItem>
      <div 
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <SidebarMenuButton 
          asChild
          className={cn(
            "group relative w-full rounded-xl transition-all duration-300 ease-in-out",
            "hover:bg-blue-50 dark:hover:bg-blue-950/30",
            "focus:bg-blue-50 dark:focus:bg-blue-950/30",
            isActive && "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700",
            !isActive && "text-gray-700 dark:text-gray-300"
          )}
        >
          <a href={item.url} className="flex items-center gap-3 px-3 py-2.5">
            <div className={cn(
              "flex items-center justify-center w-5 h-5 transition-colors duration-300",
              isActive ? "text-white" : "text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
            )}>
              <item.icon className="w-5 h-5" />
            </div>
            
            {!isCollapsed && (
              <>
                <span className={cn(
                  "font-medium transition-colors duration-300 flex-1",
                  isActive ? "text-white" : "group-hover:text-blue-600 dark:group-hover:text-blue-400"
                )}>
                  {item.title}
                </span>
                
                {item.badge && (
                  <span className={cn(
                    "px-2 py-0.5 text-xs font-semibold rounded-full transition-colors duration-300",
                    isActive 
                      ? "bg-white/20 text-white" 
                      : "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                  )}>
                    {item.badge}
                  </span>
                )}
              </>
            )}
            
            {/* Active indicator pill */}
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
            )}
          </a>
        </SidebarMenuButton>

        {/* Tooltip for collapsed mode */}
        {isCollapsed && showTooltip && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 animate-fade-in">
            <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-2 py-1 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
              {item.title}
              {item.badge && (
                <span className="ml-2 px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded-full">
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
