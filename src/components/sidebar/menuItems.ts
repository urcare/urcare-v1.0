
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
  User
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
        title: "Analytics",
        url: "/analytics",
        icon: TrendingUp,
        roles: ["doctor", "admin", "nurse"]
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
        title: "Book Appointment",
        url: "/appointments/book",
        icon: UserCheck,
        roles: ["patient", "receptionist"]
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
      },
      {
        title: "Wellness",
        url: "/wellness",
        icon: Heart,
        roles: ["patient", "doctor"]
      }
    ]
  },
  {
    title: "Communication",
    items: [
      {
        title: "Messages",
        url: "/messages",
        icon: MessageSquare,
        badge: "3",
        roles: ["all"]
      },
      {
        title: "Community",
        url: "/community",
        icon: Users,
        roles: ["patient", "doctor"]
      }
    ]
  },
  {
    title: "Emergency",
    items: [
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
    url: "/profile",
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

// Legacy export for backward compatibility
export const menuItems = mainMenuSections.flatMap(section => section.items);
