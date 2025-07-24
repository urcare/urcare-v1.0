
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Users, 
  Heart, 
  MessageSquare, 
  Settings, 
  Shield,
  Activity,
  Stethoscope,
  Pill,
  TestTube,
  UserCheck,
  TrendingUp,
  CreditCard,
  AlertTriangle,
  User,
  UserPlus,
  Home,
  Phone,
  Clock,
  Bell,
  MapPin
} from 'lucide-react';

export interface MenuItem {
  title: string;
  url: string;
  icon: any;
  badge?: string;
  roles?: string[];
  description?: string;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

const defaultMenuSections: MenuSection[] = [
  {
    title: "Dashboard",
    items: [
      { title: "Overview", url: "/", icon: LayoutDashboard },
      { title: "Profile", url: "/profile", icon: User },
      { title: "Settings", url: "/settings", icon: Settings }
    ]
  }
];

export function getMenuSectionsByRole() {
  return defaultMenuSections;
}

export const bottomMenuItems: MenuItem[] = [
  {
    title: "Profile",
    url: "/patient-dashboard/profile",
    icon: User,
    roles: ["all"]
  },
  {
    title: "Settings",
    url: "/settings", 
    icon: Settings,
    roles: ["all"]
  }
];
