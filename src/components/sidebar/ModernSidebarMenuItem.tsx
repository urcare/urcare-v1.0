
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { cn } from '@/lib/utils';
import { MenuItem } from './menuItems';

interface ModernSidebarMenuItemProps {
  item: MenuItem;
  isCollapsed: boolean;
}

export const ModernSidebarMenuItemComponent: React.FC<ModernSidebarMenuItemProps> = ({
  item,
  isCollapsed
}) => {
  const location = useLocation();
  const isActive = location.pathname === item.url || 
                   (item.url !== '/' && location.pathname.startsWith(item.url));
  
  const IconComponent = item.icon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link
          to={item.url}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all duration-200 group relative",
            isActive 
              ? "bg-blue-500 text-white shadow-md" 
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
          )}
        >
          <IconComponent className="w-5 h-5 flex-shrink-0" />
          
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{item.title}</div>
              {item.description && (
                <div className={cn(
                  "text-xs opacity-75 truncate",
                  isActive ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                )}>{item.description}</div>
              )}
            </div>
          )}

          {item.badge && (
            <span className={cn(
              "px-2 py-1 text-xs rounded-full font-medium",
              isActive 
                ? "bg-white/20 text-white" 
                : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            )}>
              {item.badge}
            </span>
          )}

          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {item.title}
              {item.description && (
                <div className="text-xs opacity-75">{item.description}</div>
              )}
            </div>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
