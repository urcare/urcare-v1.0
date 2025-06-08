
import React from 'react';
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { MenuItem } from './menuItems';

interface SidebarMenuItemProps {
  item: MenuItem;
}

export function SidebarMenuItemComponent({ item }: SidebarMenuItemProps) {
  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild>
        <a href={item.url}>
          <item.icon />
          <span>{item.title}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
