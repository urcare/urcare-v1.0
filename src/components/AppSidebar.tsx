import { Calendar, FileText, Stethoscope, Heart, Brain, Trophy, Bookmark, Shield, Users, MapPin, Bed, Pill, CreditCard, BarChart3 } from "lucide-react"

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
    title: "Ward Management",
    url: "/ward",
    icon: Bed,
  },
  {
    title: "Pharmacy System",
    url: "/pharmacy",
    icon: Pill,
  },
  {
    title: "Billing System",
    url: "/billing",
    icon: CreditCard,
  },
  {
    title: "Insurance & Payments",
    url: "/insurance",
    icon: Shield,
  },
  {
    title: "HR & Staff Management",
    icon: Users,
    url: "/hr-management",
    description: "Comprehensive workforce management tools"
  },
  {
    title: "HR Analytics & Compliance",
    icon: BarChart3,
    url: "/hr-analytics",
    description: "Data-driven HR insights and compliance tracking"
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
