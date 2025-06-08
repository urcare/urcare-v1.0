
import { Stethoscope, Heart, Brain, Trophy, Bookmark } from "lucide-react"
import { MenuItem } from "../menuItems"

export const patientWellnessMenuItems: MenuItem[] = [
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
];
