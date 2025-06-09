
import { LucideIcon } from "lucide-react"
import { coreMenuItems } from './menuCategories/coreItems'
import { analyticsMenuItems } from './menuCategories/analyticsItems'
import { researchMenuItems } from './menuCategories/researchItems'
import { wasteAndSafetyMenuItems } from './menuCategories/wasteAndSafetyItems'
import { aiMenuItems } from './menuCategories/aiItems'
import { hrMenuItems } from './menuCategories/hrItems'
import { patientWellnessMenuItems } from './menuCategories/patientWellnessItems'
import { mobileMenuItems } from './menuCategories/mobileItems'

export interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  description?: string;
}

export const menuItems: MenuItem[] = [
  ...coreMenuItems,
  ...analyticsMenuItems,
  ...researchMenuItems,
  ...wasteAndSafetyMenuItems,
  ...aiMenuItems,
  ...hrMenuItems,
  ...patientWellnessMenuItems,
  ...mobileMenuItems,
];
