
import { Calendar, FileText, Stethoscope, Heart, Brain, Trophy, Bookmark, Shield, Users, MapPin, Bed, Pill, CreditCard, BarChart3, Star, Trash, Activity, Lightbulb, ClipboardList } from "lucide-react"

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
    title: "Bio-Waste Management",
    url: "/bio-waste",
    icon: Trash,
    description: "Complete waste tracking and compliance system"
  },
  {
    title: "Predictive Clinical AI",
    url: "/predictive-ai",
    icon: Brain,
    description: "Advanced patient risk assessment and early warning systems"
  },
  {
    title: "Mental Health AI",
    url: "/mental-health-ai",
    icon: Activity,
    description: "Psychological wellness monitoring and intervention systems"
  },
  {
    title: "Clinical Decision Support",
    url: "/clinical-decision-support",
    icon: Lightbulb,
    description: "AI-powered treatment guidance and decision support"
  },
  {
    title: "Treatment Protocol AI",
    url: "/treatment-protocol-ai",
    icon: ClipboardList,
    description: "Comprehensive care management with intelligent protocol guidance"
  },
  {
    title: "Clinical Optimization AI",
    url: "/clinical-optimization",
    icon: TrendingUp,
    description: "Resource and outcome enhancement with intelligent optimization"
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
    title: "Visitor & Access Control",
    icon: Shield,
    url: "/visitor-control",
    description: "Smart entry management and security systems"
  },
  {
    title: "Advanced Access Control",
    icon: Star,
    url: "/advanced-access-control",
    description: "Premium security features with intelligent monitoring"
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
