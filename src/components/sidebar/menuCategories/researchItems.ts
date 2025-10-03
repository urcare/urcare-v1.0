
import { FlaskConical, Microscope, Globe } from "lucide-react"
import { MenuItem } from "../menuItems"

export const researchMenuItems: MenuItem[] = [
  {
    title: "Research Data Management",
    url: "/research-data-management",
    icon: FlaskConical,
    description: "Clinical research platform with protocol management and compliance"
  },
  {
    title: "Advanced Research Tools",
    url: "/advanced-research-tools",
    icon: Microscope,
    description: "Publication tracking, grant management, and research collaboration tools"
  },
  {
    title: "Laboratory Information System",
    url: "/lims",
    icon: FlaskConical,
    description: "Comprehensive lab management with sample tracking, quality control, and result processing"
  },
  {
    title: "Public Health Integration",
    url: "/public-health-integration",
    icon: Globe,
    description: "Disease surveillance, outbreak detection, and epidemiological analysis"
  },
];
