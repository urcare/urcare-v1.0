
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
  Moon,
  LogOut,
  User,
  UserPlus,
  Home
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

export const mainMenuSections: MenuSection[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        url: "/",
        icon: LayoutDashboard,
        roles: ["all"]
      },
      {
        title: "Patient Dashboard",
        url: "/patient-dashboard",
        icon: Home,
        roles: ["patient", "admin"],
        description: "Personal health dashboard"
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: TrendingUp,
        roles: ["doctor", "admin", "nurse"]
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
        roles: ["patient", "doctor", "nurse"],
        description: "Medical documents & timeline"
      },
      {
        title: "Medications",
        url: "/patient-dashboard/medications",
        icon: Pill,
        roles: ["patient", "doctor", "pharmacy"],
        description: "Prescriptions & reminders"
      },
      {
        title: "Wellness Hub",
        url: "/patient-dashboard/wellness",
        icon: Heart,
        roles: ["patient", "doctor"],
        description: "AI coaching & tracking"
      }
    ]
  },
  {
    title: "Appointments",
    items: [
      {
        title: "Schedule",
        url: "/appointments",
        icon: Calendar,
        roles: ["all"]
      },
      {
        title: "My Appointments",
        url: "/patient-dashboard/appointments",
        icon: UserCheck,
        roles: ["patient"],
        description: "Booking & teleconsults"
      },
      {
        title: "Book Appointment",
        url: "/appointments/book",
        icon: UserCheck,
        roles: ["patient", "receptionist"]
      }
    ]
  },
  {
    title: "Community & Support",
    items: [
      {
        title: "Community Hub",
        url: "/patient-dashboard/community",
        icon: Users,
        roles: ["patient", "doctor"],
        description: "Support & social health"
      },
      {
        title: "Family Care",
        url: "/patient-dashboard/family",
        icon: UserPlus,
        roles: ["patient"],
        description: "Guardian & family mode"
      },
      {
        title: "Messages",
        url: "/messages",
        icon: MessageSquare,
        badge: "3",
        roles: ["all"]
      }
    ]
  },
  {
    title: "Emergency",
    items: [
      {
        title: "Emergency Dashboard",
        url: "/patient-dashboard/emergency",
        icon: AlertTriangle,
        roles: ["patient"],
        description: "Safety & crisis tools"
      },
      {
        title: "Emergency",
        url: "/emergency",
        icon: AlertTriangle,
        roles: ["all"]
      },
      {
        title: "ICU/Ward",
        url: "/ward",
        icon: Activity,
        roles: ["doctor", "nurse", "admin"]
      }
    ]
  },
  {
    title: "Medical Records",
    items: [
      {
        title: "Patient Records",
        url: "/records",
        icon: FileText,
        roles: ["doctor", "nurse", "admin"]
      },
      {
        title: "My Records",
        url: "/my-records",
        icon: FileText,
        roles: ["patient"]
      },
      {
        title: "Documents",
        url: "/documents",
        icon: FileText,
        roles: ["all"]
      }
    ]
  },
  {
    title: "Healthcare",
    items: [
      {
        title: "Prescriptions",
        url: "/pharmacy",
        icon: Pill,
        roles: ["doctor", "pharmacy", "patient"]
      },
      {
        title: "Lab Results",
        url: "/lab",
        icon: TestTube,
        roles: ["doctor", "lab", "patient"]
      }
    ]
  },
  {
    title: "Administration",
    items: [
      {
        title: "User Management",
        url: "/admin/users",
        icon: Shield,
        roles: ["admin"]
      },
      {
        title: "Billing",
        url: "/billing",
        icon: CreditCard,
        roles: ["admin", "receptionist"]
      },
      {
        title: "HR Management",
        url: "/hr",
        icon: Users,
        roles: ["admin"]
      }
    ]
  }
];

export const bottomMenuItems: MenuItem[] = [
  {
    title: "Profile",
    url: "/patient-dashboard/profile",
    icon: User,
    roles: ["all"],
    description: "Settings & preferences"
  },
  {
    title: "Settings",
    url: "/settings", 
    icon: Settings,
    roles: ["all"]
  }
];

// Legacy export for backward compatibility
export const menuItems = mainMenuSections.flatMap(section => section.items);
