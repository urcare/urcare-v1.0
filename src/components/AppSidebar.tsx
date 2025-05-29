
import { Calendar, FileText, Stethoscope, Heart, Brain, Trophy, Bookmark, Shield, Users, MapPin } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items array
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Heart,
  },
  {
    title: "Appointments",
    url: "/appointments",
    icon: Calendar,
  },
  {
    title: "Patient Journey",
    url: "/patient-journey",
    icon: MapPin,
  },
  {
    title: "Documents",
    url: "/documents",
    icon: FileText,
  },
  {
    title: "Health Twin",
    url: "/health-twin",
    icon: Stethoscope,
  },
  {
    title: "Wellness",
    url: "/wellness",
    icon: Heart,
  },
  {
    title: "Emotional Health",
    url: "/emotional-health",
    icon: Brain,
  },
  {
    title: "Engagement",
    url: "/engagement",
    icon: Trophy,
  },
  {
    title: "Content",
    url: "/content",
    icon: Bookmark,
  },
  {
    title: "Emergency",
    url: "/emergency",
    icon: Shield,
  },
  {
    title: "Community",
    url: "/community",
    icon: Users,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>UrCare Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
