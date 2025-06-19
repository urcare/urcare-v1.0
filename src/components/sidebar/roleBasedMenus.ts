
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

const patientMenuSections: MenuSection[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Home",
        url: "/patient-dashboard",
        icon: Home,
        description: "AI insights & quick actions"
      },
      {
        title: "Overview",
        url: "/",
        icon: LayoutDashboard,
        description: "Main dashboard"
      }
    ]
  },
  {
    title: "Health Management",
    items: [
      {
        title: "Health Records",
        url: "/patient-dashboard/health-records",
        icon: FileText,
        description: "Documents & timeline"
      },
      {
        title: "Appointments",
        url: "/patient-dashboard/appointments",
        icon: Calendar,
        description: "Booking & teleconsults"
      },
      {
        title: "Medications",
        url: "/patient-dashboard/medications",
        icon: Pill,
        description: "Prescriptions & reminders"
      },
      {
        title: "Wellness Hub",
        url: "/patient-dashboard/wellness",
        icon: Heart,
        description: "AI coaching & tracking"
      }
    ]
  },
  {
    title: "Support & Community",
    items: [
      {
        title: "Community",
        url: "/patient-dashboard/community",
        icon: Users,
        description: "Support & social health"
      },
      {
        title: "Family Care",
        url: "/patient-dashboard/family",
        icon: UserPlus,
        description: "Guardian & family mode"
      },
      {
        title: "Emergency",
        url: "/patient-dashboard/emergency",
        icon: AlertTriangle,
        description: "Safety & crisis tools"
      }
    ]
  },
  {
    title: "Account",
    items: [
      {
        title: "Profile",
        url: "/patient-dashboard/profile",
        icon: User,
        description: "Settings & preferences"
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
        description: "App preferences"
      }
    ]
  }
];

const doctorMenuSections: MenuSection[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        url: "/",
        icon: LayoutDashboard
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: TrendingUp
      }
    ]
  },
  {
    title: "Patient Care",
    items: [
      {
        title: "Appointments",
        url: "/appointments",
        icon: Calendar
      },
      {
        title: "Patient Records",
        url: "/records",
        icon: FileText
      },
      {
        title: "Prescriptions",
        url: "/pharmacy",
        icon: Pill
      }
    ]
  }
];

const adminMenuSections: MenuSection[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        url: "/",
        icon: LayoutDashboard
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: TrendingUp
      }
    ]
  },
  {
    title: "Management",
    items: [
      {
        title: "User Management",
        url: "/admin/users",
        icon: Shield
      },
      {
        title: "Billing",
        url: "/billing",
        icon: CreditCard
      },
      {
        title: "HR Management",
        url: "/hr",
        icon: Users
      }
    ]
  }
];

export function getMenuSectionsByRole(role: string = 'patient'): MenuSection[] {
  switch (role.toLowerCase()) {
    case 'doctor':
    case 'physician':
      return doctorMenuSections;
    case 'admin':
    case 'administrator':
      return adminMenuSections;
    case 'patient':
    default:
      return patientMenuSections;
  }
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
