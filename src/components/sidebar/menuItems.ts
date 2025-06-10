import { LucideIcon } from "lucide-react"
import { coreMenuItems } from './menuCategories/coreItems'
import { analyticsMenuItems } from './menuCategories/analyticsItems'
import { researchMenuItems } from './menuCategories/researchItems'
import { wasteAndSafetyMenuItems } from './menuCategories/wasteAndSafetyItems'
import { aiMenuItems } from './menuCategories/aiItems'
import { hrMenuItems } from './menuCategories/hrItems'
import { patientWellnessMenuItems } from './menuCategories/patientWellnessItems'
import { mobileMenuItems } from './menuCategories/mobileItems'
import { securityMenuItems } from './menuCategories/securityItems'
import { complianceMenuItems } from './menuCategories/complianceItems'
import { riskManagementMenuItems } from './menuCategories/riskManagementItems'
import { accessControlMenuItems } from './menuCategories/accessControlItems'
import { dataGovernanceItems } from './menuCategories/dataGovernanceItems'
import { aiDiagnosticsItems } from './menuCategories/aiDiagnosticsItems'
import { predictiveMaintenanceItems } from './menuCategories/predictiveMaintenanceItems'
import { nlpItems } from './menuCategories/nlpItems'
import { advancedAutomationItems } from './menuCategories/advancedAutomationItems'
import { telemedicineItems } from './menuCategories/telemedicineItems'
import { pediatricItems } from './menuCategories/pediatricItems'
import { mentalHealthItems } from './menuCategories/mentalHealthItems'
import { geriatricItems } from './menuCategories/geriatricItems'
import { oncologyItems } from './menuCategories/oncologyItems'

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
  ...aiDiagnosticsItems,
  ...hrMenuItems,
  ...patientWellnessMenuItems,
  ...securityMenuItems,
  ...complianceMenuItems,
  ...riskManagementMenuItems,
  ...accessControlMenuItems,
  ...dataGovernanceItems,
  ...predictiveMaintenanceItems,
  ...nlpItems,
  ...advancedAutomationItems,
  ...telemedicineItems,
  ...pediatricItems,
  ...mentalHealthItems,
  ...geriatricItems,
  ...oncologyItems,
  ...mobileMenuItems,
];
