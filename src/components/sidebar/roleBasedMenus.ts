
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
  ClipboardList,
  Microscope,
  Bed,
  Building2,
  User
} from 'lucide-react';

export interface MenuItem {
  title: string;
  url: string;
  icon: any;
  badge?: string;
  description?: string;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

// Doctor Menu Configuration
export const doctorMenuSections: MenuSection[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        url: "/doctor/dashboard",
        icon: LayoutDashboard,
        description: "Clinical overview and metrics"
      },
      {
        title: "Analytics",
        url: "/doctor/analytics",
        icon: TrendingUp,
        description: "Patient analytics and insights"
      }
    ]
  },
  {
    title: "Patient Care",
    items: [
      {
        title: "Appointments",
        url: "/doctor/appointments",
        icon: Calendar,
        description: "Manage patient appointments"
      },
      {
        title: "Patient Records",
        url: "/doctor/records",
        icon: FileText,
        description: "View and update patient records"
      },
      {
        title: "Prescriptions",
        url: "/doctor/prescriptions",
        icon: Pill,
        description: "Manage prescriptions"
      }
    ]
  },
  {
    title: "Clinical",
    items: [
      {
        title: "Lab Results",
        url: "/doctor/lab-results",
        icon: TestTube,
        description: "Review laboratory results"
      },
      {
        title: "Ward Rounds",
        url: "/doctor/ward-rounds",
        icon: Bed,
        description: "Daily ward rounds"
      }
    ]
  },
  {
    title: "Communication",
    items: [
      {
        title: "Messages",
        url: "/doctor/messages",
        icon: MessageSquare,
        badge: "3",
        description: "Internal messaging"
      }
    ]
  }
];

// Nurse Menu Configuration
export const nurseMenuSections: MenuSection[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        url: "/nurse/dashboard",
        icon: LayoutDashboard,
        description: "Nursing dashboard overview"
      }
    ]
  },
  {
    title: "Patient Care",
    items: [
      {
        title: "Patient List",
        url: "/nurse/patients",
        icon: Users,
        description: "Assigned patients"
      },
      {
        title: "Medications",
        url: "/nurse/medications",
        icon: Pill,
        description: "Medication administration"
      },
      {
        title: "Vital Signs",
        url: "/nurse/vitals",
        icon: Activity,
        description: "Record vital signs"
      }
    ]
  },
  {
    title: "Tasks",
    items: [
      {
        title: "Care Plans",
        url: "/nurse/care-plans",
        icon: ClipboardList,
        description: "Patient care plans"
      },
      {
        title: "Shift Reports",
        url: "/nurse/shift-reports",
        icon: FileText,
        description: "Shift handover reports"
      }
    ]
  }
];

// Lab Staff Menu Configuration
export const labMenuSections: MenuSection[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Lab Dashboard",
        url: "/lab/dashboard",
        icon: LayoutDashboard,
        description: "Laboratory overview"
      }
    ]
  },
  {
    title: "Laboratory",
    items: [
      {
        title: "Test Queue",
        url: "/lab/test-queue",
        icon: TestTube,
        description: "Pending tests"
      },
      {
        title: "Results Entry",
        url: "/lab/results",
        icon: Microscope,
        description: "Enter test results"
      },
      {
        title: "Sample Tracking",
        url: "/lab/samples",
        icon: FileText,
        description: "Track sample status"
      }
    ]
  },
  {
    title: "Quality Control",
    items: [
      {
        title: "QC Reports",
        url: "/lab/qc-reports",
        icon: Shield,
        description: "Quality control reports"
      }
    ]
  }
];

// Pharmacy Menu Configuration
export const pharmacyMenuSections: MenuSection[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Pharmacy Dashboard",
        url: "/pharmacy/dashboard",
        icon: LayoutDashboard,
        description: "Pharmacy overview"
      }
    ]
  },
  {
    title: "Medications",
    items: [
      {
        title: "Prescription Queue",
        url: "/pharmacy/prescriptions",
        icon: Pill,
        badge: "12",
        description: "Pending prescriptions"
      },
      {
        title: "Inventory",
        url: "/pharmacy/inventory",
        icon: Building2,
        description: "Drug inventory management"
      },
      {
        title: "Dispensing",
        url: "/pharmacy/dispensing",
        icon: UserCheck,
        description: "Medication dispensing"
      }
    ]
  }
];

// Patient Menu Configuration
export const patientMenuSections: MenuSection[] = [
  {
    title: "My Health",
    items: [
      {
        title: "Dashboard",
        url: "/patient/dashboard",
        icon: LayoutDashboard,
        description: "Health overview"
      },
      {
        title: "Health Records",
        url: "/patient/records",
        icon: FileText,
        description: "My medical records"
      }
    ]
  },
  {
    title: "Appointments",
    items: [
      {
        title: "My Appointments",
        url: "/patient/appointments",
        icon: Calendar,
        description: "View appointments"
      },
      {
        title: "Book Appointment",
        url: "/patient/book-appointment",
        icon: UserCheck,
        description: "Schedule new appointment"
      }
    ]
  },
  {
    title: "Wellness",
    items: [
      {
        title: "Wellness Tracker",
        url: "/patient/wellness",
        icon: Heart,
        description: "Track health metrics"
      },
      {
        title: "Lab Results",
        url: "/patient/lab-results",
        icon: TestTube,
        description: "View test results"
      }
    ]
  },
  {
    title: "Communication",
    items: [
      {
        title: "Messages",
        url: "/patient/messages",
        icon: MessageSquare,
        description: "Chat with healthcare team"
      }
    ]
  }
];

// Admin Menu Configuration
export const adminMenuSections: MenuSection[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Admin Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
        description: "System overview"
      },
      {
        title: "Analytics",
        url: "/admin/analytics",
        icon: TrendingUp,
        description: "Hospital analytics"
      }
    ]
  },
  {
    title: "User Management",
    items: [
      {
        title: "Staff Management",
        url: "/admin/staff",
        icon: Users,
        description: "Manage hospital staff"
      },
      {
        title: "Patient Management",
        url: "/admin/patients",
        icon: User,
        description: "Manage patients"
      },
      {
        title: "Roles & Permissions",
        url: "/admin/roles",
        icon: Shield,
        description: "Configure access control"
      }
    ]
  },
  {
    title: "Operations",
    items: [
      {
        title: "Billing",
        url: "/admin/billing",
        icon: CreditCard,
        description: "Financial management"
      },
      {
        title: "Emergency",
        url: "/admin/emergency",
        icon: AlertTriangle,
        description: "Emergency protocols"
      }
    ]
  }
];

// Bottom menu items (common across all roles)
export const bottomMenuItems: MenuItem[] = [
  {
    title: "Profile",
    url: "/profile",
    icon: User,
    description: "User profile settings"
  },
  {
    title: "Settings",
    url: "/settings", 
    icon: Settings,
    description: "Application settings"
  }
];

// Function to get menu sections based on user role
export const getMenuSectionsByRole = (role: string): MenuSection[] => {
  switch (role?.toLowerCase()) {
    case 'doctor':
      return doctorMenuSections;
    case 'nurse':
      return nurseMenuSections;
    case 'lab':
    case 'laboratory':
      return labMenuSections;
    case 'pharmacy':
      return pharmacyMenuSections;
    case 'patient':
      return patientMenuSections;
    case 'admin':
      return adminMenuSections;
    default:
      return patientMenuSections; // Default to patient menu
  }
};
