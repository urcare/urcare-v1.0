
import { Calendar, FileText, Stethoscope, Heart, Users, MapPin, Bed, Pill, CreditCard, Shield, Monitor } from "lucide-react"
import { MenuItem } from "../menuItems"

export const coreMenuItems: MenuItem[] = [
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
    title: "LIMS",
    url: "/lims",
    icon: Stethoscope,
  },
  {
    title: "Radiology (RIS)",
    url: "/ris",
    icon: Monitor,
  },
  {
    title: "Documents",
    url: "/documents",
    icon: FileText,
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
];
