
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
  Home,
  Brain,
  Microscope,
  Building2,
  Truck,
  Search,
  Zap,
  BarChart3,
  Globe,
  Smartphone,
  Lock,
  Database,
  Workflow,
  Wrench,
  MonitorSpeaker,
  Layers,
  Cpu,
  Target,
  Network,
  Languages,
  CloudCog,
  Sparkles,
  Accessibility,
  FlaskConical,
  Blocks,
  BookOpen,
  Camera,
  Phone,
  Palette,
  Gamepad2,
  Baby,
  Gem,
  HandHeart,
  Siren,
  Eye,
  ShieldCheck,
  CheckCircle,
  Cog,
  Gauge,
  Scale,
  HeartHandshake,
  Combine,
  Bot,
  FlaskRound
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
      },
      {
        title: "Hospital Analytics",
        url: "/hospital-analytics",
        icon: BarChart3,
        roles: ["admin", "doctor"]
      },
      {
        title: "Clinical Analytics",
        url: "/clinical-analytics",
        icon: Activity,
        roles: ["doctor", "admin"]
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
      },
      {
        title: "Wellness",
        url: "/wellness",
        icon: Heart,
        roles: ["all"]
      },
      {
        title: "Health Twin",
        url: "/health-twin",
        icon: User,
        roles: ["patient", "doctor"]
      },
      {
        title: "Emotional Health",
        url: "/emotional-health",
        icon: Brain,
        roles: ["patient", "doctor"]
      }
    ]
  },
  {
    title: "Appointments & Scheduling",
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
    title: "Medical Services",
    items: [
      {
        title: "Telemedicine",
        url: "/telemedicine",
        icon: Phone,
        roles: ["doctor", "patient"]
      },
      {
        title: "Emergency Medicine",
        url: "/emergency-medicine",
        icon: Siren,
        roles: ["doctor", "nurse"]
      },
      {
        title: "Surgical Services",
        url: "/surgical-services",
        icon: Stethoscope,
        roles: ["doctor", "nurse"]
      },
      {
        title: "Pathology",
        url: "/pathology",
        icon: Microscope,
        roles: ["doctor", "lab"]
      },
      {
        title: "Mental Health",
        url: "/mental-health",
        icon: Brain,
        roles: ["doctor", "patient"]
      },
      {
        title: "Mental Health AI",
        url: "/mental-health-ai",
        icon: Bot,
        roles: ["doctor", "patient"]
      },
      {
        title: "Pediatric Care",
        url: "/pediatric-care",
        icon: Baby,
        roles: ["doctor", "patient"]
      },
      {
        title: "Geriatric Care",
        url: "/geriatric-care",
        icon: HandHeart,
        roles: ["doctor", "patient"]
      },
      {
        title: "Oncology Care",
        url: "/oncology-care",
        icon: Heart,
        roles: ["doctor", "patient"]
      },
      {
        title: "Rehabilitation Services",
        url: "/rehabilitation-services",
        icon: HeartHandshake,
        roles: ["doctor", "patient"]
      }
    ]
  },
  {
    title: "Laboratory & Diagnostics",
    items: [
      {
        title: "LIMS",
        url: "/lims",
        icon: TestTube,
        roles: ["lab", "doctor"]
      },
      {
        title: "RIS",
        url: "/ris",
        icon: Eye,
        roles: ["radiologist", "doctor"]
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
        title: "Community",
        url: "/community",
        icon: Users,
        roles: ["all"]
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
      },
      {
        title: "Communication Systems",
        url: "/communication-systems",
        icon: MessageSquare,
        roles: ["all"]
      }
    ]
  },
  {
    title: "Emergency & Safety",
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
    title: "Documents & Records",
    items: [
      {
        title: "Documents",
        url: "/documents",
        icon: FileText,
        roles: ["all"]
      },
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
      }
    ]
  },
  {
    title: "Pharmacy & Prescriptions",
    items: [
      {
        title: "Pharmacy",
        url: "/pharmacy",
        icon: Pill,
        roles: ["doctor", "pharmacy", "patient"]
      },
      {
        title: "Prescriptions",
        url: "/prescriptions",
        icon: Pill,
        roles: ["doctor", "pharmacy", "patient"]
      }
    ]
  },
  {
    title: "AI & Advanced Features",
    items: [
      {
        title: "Advanced AI Diagnostics",
        url: "/advanced-ai-diagnostics",
        icon: Bot,
        roles: ["doctor", "admin"]
      },
      {
        title: "Clinical Decision Support",
        url: "/clinical-decision-support",
        icon: Brain,
        roles: ["doctor", "nurse"]
      },
      {
        title: "Predictive Clinical AI",
        url: "/predictive-clinical-ai",
        icon: TrendingUp,
        roles: ["doctor", "admin"]
      },
      {
        title: "Treatment Protocol AI",
        url: "/treatment-protocol-ai",
        icon: Workflow,
        roles: ["doctor", "admin"]
      },
      {
        title: "Advanced Workflow AI",
        url: "/advanced-workflow-ai",
        icon: Workflow,
        roles: ["admin", "doctor"]
      },
      {
        title: "Workflow Automation AI",
        url: "/workflow-automation-ai",
        icon: Zap,
        roles: ["admin"]
      },
      {
        title: "Process Optimization AI",
        url: "/process-optimization-ai",
        icon: Target,
        roles: ["admin"]
      },
      {
        title: "Content Engagement AI",
        url: "/content-engagement-ai",
        icon: Sparkles,
        roles: ["admin"]
      },
      {
        title: "Emotional Retention AI",
        url: "/emotional-retention-ai",
        icon: Heart,
        roles: ["admin"]
      },
      {
        title: "Natural Language Processing",
        url: "/natural-language-processing",
        icon: Languages,
        roles: ["admin", "doctor"]
      },
      {
        title: "Predictive Maintenance AI",
        url: "/predictive-maintenance-ai",
        icon: Wrench,
        roles: ["admin"]
      }
    ]
  },
  {
    title: "Administration & Management",
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
      },
      {
        title: "HR Analytics",
        url: "/hr-analytics",
        icon: BarChart3,
        roles: ["admin"]
      },
      {
        title: "Insurance",
        url: "/insurance",
        icon: Shield,
        roles: ["admin", "patient"]
      },
      {
        title: "TPA",
        url: "/tpa",
        icon: Building2,
        roles: ["admin"]
      },
      {
        title: "Visitor Control",
        url: "/visitor-control",
        icon: UserCheck,
        roles: ["admin", "security"]
      }
    ]
  },
  {
    title: "Research & Development",
    items: [
      {
        title: "Advanced Research Tools",
        url: "/advanced-research-tools",
        icon: FlaskConical,
        roles: ["researcher", "doctor"]
      },
      {
        title: "Research Data Management",
        url: "/research-data-management",
        icon: Database,
        roles: ["researcher", "admin"]
      },
      {
        title: "Clinical Optimization",
        url: "/clinical-optimization",
        icon: Target,
        roles: ["doctor", "admin"]
      }
    ]
  },
  {
    title: "Quality & Compliance",
    items: [
      {
        title: "Quality Assurance",
        url: "/quality-assurance",
        icon: CheckCircle,
        roles: ["admin", "doctor"]
      },
      {
        title: "Compliance Management",
        url: "/compliance-management",
        icon: ShieldCheck,
        roles: ["admin"]
      },
      {
        title: "Safety Compliance AI",
        url: "/safety-compliance-ai",
        icon: Shield,
        roles: ["admin"]
      },
      {
        title: "Risk Management",
        url: "/risk-management",
        icon: AlertTriangle,
        roles: ["admin", "doctor"]
      },
      {
        title: "Bio Waste Management",
        url: "/bio-waste-management",
        icon: Truck,
        roles: ["admin", "environmental"]
      }
    ]
  },
  {
    title: "Technology & Integration",
    items: [
      {
        title: "Device Integration",
        url: "/device-integration",
        icon: Smartphone,
        roles: ["admin", "technician"]
      },
      {
        title: "System Integration",
        url: "/system-integration",
        icon: Network,
        roles: ["admin", "it"]
      },
      {
        title: "Advanced Security Features",
        url: "/advanced-security-features",
        icon: Lock,
        roles: ["admin", "security"]
      },
      {
        title: "Advanced Access Control",
        url: "/advanced-access-control",
        icon: Shield,
        roles: ["admin"]
      },
      {
        title: "Data Governance",
        url: "/data-governance",
        icon: Database,
        roles: ["admin"]
      },
      {
        title: "Cross Platform Compatibility",
        url: "/cross-platform-compatibility",
        icon: Layers,
        roles: ["admin", "it"]
      }
    ]
  },
  {
    title: "Mobile & Accessibility",
    items: [
      {
        title: "Advanced Mobile Features",
        url: "/advanced-mobile-features",
        icon: Smartphone,
        roles: ["all"]
      },
      {
        title: "Mobile Optimization",
        url: "/mobile-optimization",
        icon: Smartphone,
        roles: ["admin"]
      },
      {
        title: "Advanced UI",
        url: "/advanced-ui",
        icon: Palette,
        roles: ["admin"]
      }
    ]
  },
  {
    title: "Performance & Monitoring",
    items: [
      {
        title: "Performance Monitoring",
        url: "/performance-monitoring",
        icon: MonitorSpeaker,
        roles: ["admin", "it"]
      },
      {
        title: "Performance Optimization",
        url: "/performance-optimization",
        icon: Gauge,
        roles: ["admin", "it"]
      },
      {
        title: "System Maintenance",
        url: "/system-maintenance",
        icon: Wrench,
        roles: ["admin", "it"]
      },
      {
        title: "Scalability Management",
        url: "/scalability-management",
        icon: Scale,
        roles: ["admin", "it"]
      }
    ]
  },
  {
    title: "Automation & Optimization",
    items: [
      {
        title: "Advanced Automation",
        url: "/advanced-automation",
        icon: Zap,
        roles: ["admin"]
      },
      {
        title: "Intelligent Content",
        url: "/intelligent-content",
        icon: BookOpen,
        roles: ["admin", "content"]
      },
      {
        title: "Engagement",
        url: "/engagement",
        icon: Gamepad2,
        roles: ["admin", "marketing"]
      }
    ]
  },
  {
    title: "Specialized Services",
    items: [
      {
        title: "Patient Journey",
        url: "/patient-journey",
        icon: Users,
        roles: ["admin", "doctor"]
      },
      {
        title: "Public Health Integration",
        url: "/public-health-integration",
        icon: Globe,
        roles: ["admin", "public-health"]
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
