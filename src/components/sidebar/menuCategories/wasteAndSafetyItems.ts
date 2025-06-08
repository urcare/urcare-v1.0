
import { Trash, Shield } from "lucide-react"
import { MenuItem } from "../menuItems"

export const wasteAndSafetyMenuItems: MenuItem[] = [
  {
    title: "Bio-Waste Management",
    url: "/bio-waste",
    icon: Trash,
    description: "Complete waste tracking and compliance system"
  },
  {
    title: "Safety & Compliance AI",
    url: "/safety-compliance-ai",
    icon: Shield,
    description: "Comprehensive risk management with access monitoring, fraud detection, and compliance oversight"
  },
  {
    title: "Visitor & Access Control",
    icon: Shield,
    url: "/visitor-control",
    description: "Smart entry management and security systems"
  },
  {
    title: "Advanced Access Control",
    icon: Shield,
    url: "/advanced-access-control",
    description: "Premium security features with intelligent monitoring"
  },
];
