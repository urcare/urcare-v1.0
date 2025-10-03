
import { BarChart3, Stethoscope } from "lucide-react"
import { MenuItem } from "../menuItems"

export const analyticsMenuItems: MenuItem[] = [
  {
    title: "Hospital Analytics",
    url: "/hospital-analytics",
    icon: BarChart3,
    description: "Comprehensive data visualization and performance monitoring dashboard"
  },
  {
    title: "Clinical Analytics",
    url: "/clinical-analytics",
    icon: Stethoscope,
    description: "Medical performance monitoring and clinical outcome analysis"
  },
  {
    title: "HR Analytics & Compliance",
    icon: BarChart3,
    url: "/hr-analytics",
    description: "Data-driven HR insights and compliance tracking"
  },
];
