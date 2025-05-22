
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Heart,
  Users,
  Calendar,
  FileText,
  Stethoscope,
  Pill,
  UserPlus,
  BarChart3,
  Settings,
  Home,
  Activity,
  ClipboardList,
} from 'lucide-react';

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Patients",
    url: "/patients",
    icon: Users,
  },
  {
    title: "Appointments",
    url: "/appointments",
    icon: Calendar,
  },
  {
    title: "Medical Records",
    url: "/records",
    icon: FileText,
  },
  {
    title: "Consultations",
    url: "/consultations",
    icon: Stethoscope,
  },
  {
    title: "Prescriptions",
    url: "/prescriptions",
    icon: Pill,
  },
  {
    title: "Staff Management",
    url: "/staff",
    icon: UserPlus,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
  },
  {
    title: "Lab Results",
    url: "/lab-results",
    icon: Activity,
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: ClipboardList,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r-0 shadow-lg">
      <SidebarHeader className="medical-gradient p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <div className="text-white">
            <h1 className="text-xl font-bold">UrCare</h1>
            <p className="text-xs text-blue-100">Hospital Management</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-primary">
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-100 text-xs uppercase tracking-wider px-3">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className="text-white hover:bg-white/10 transition-all duration-200 rounded-lg mx-2"
                  >
                    <a href={item.url} className="flex items-center gap-3 p-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="bg-primary p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-white hover:bg-white/10 transition-all duration-200 rounded-lg">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
