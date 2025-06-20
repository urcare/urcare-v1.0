
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
  MapPin,
  Brain,
  Video,
  Search,
  Building,
  Briefcase,
  BookOpen,
  Database,
  Lock,
  Zap,
  Smartphone,
  Globe,
  BarChart3,
  Monitor,
  Wrench,
  CircuitBoard,
  FlaskConical,
  Microscope,
  Syringe,
  Headphones,
  Archive,
  CheckCircle,
  Target,
  Lightbulb,
  Cpu,
  HardDrive,
  Network,
  CloudCog
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

export const mainMenuSections: MenuSection[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        url: "/",
        icon: LayoutDashboard,
        description: "Main dashboard overview"
      },
      {
        title: "Patient Portal",
        url: "/patient-dashboard",
        icon: User,
        description: "Patient-focused dashboard"
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: TrendingUp,
        description: "Data insights & metrics"
      }
    ]
  },
  {
    title: "Patient Care",
    items: [
      {
        title: "Appointments",
        url: "/appointments",
        icon: Calendar,
        description: "Schedule & manage appointments"
      },
      {
        title: "Teleconsultation",
        url: "/teleconsult",
        icon: Video,
        description: "Virtual consultations"
      },
      {
        title: "Health Records",
        url: "/records",
        icon: FileText,
        description: "Medical documents & history"
      },
      {
        title: "Documents",
        url: "/documents",
        icon: Archive,
        description: "Document management system"
      },
      {
        title: "Pharmacy",
        url: "/pharmacy",
        icon: Pill,
        description: "Medication management"
      }
    ]
  },
  {
    title: "Clinical Services",
    items: [
      {
        title: "Emergency",
        url: "/emergency",
        icon: AlertTriangle,
        description: "Emergency care & crisis support"
      },
      {
        title: "Mental Health",
        url: "/mental-health",
        icon: Brain,
        description: "Psychological care & support"
      },
      {
        title: "Oncology",
        url: "/oncology",
        icon: Target,
        description: "Cancer care & treatment"
      },
      {
        title: "Pediatric Care",
        url: "/pediatric",
        icon: Heart,
        description: "Children's healthcare"
      },
      {
        title: "Geriatric Care",
        url: "/geriatric",
        icon: UserCheck,
        description: "Elderly care services"
      },
      {
        title: "Rehabilitation",
        url: "/rehabilitation",
        icon: Activity,
        description: "Recovery & therapy services"
      }
    ]
  },
  {
    title: "Laboratory & Diagnostics",
    items: [
      {
        title: "Lab Management",
        url: "/lims",
        icon: TestTube,
        description: "Laboratory information system"
      },
      {
        title: "Pathology",
        url: "/pathology",
        icon: Microscope,
        description: "Pathology services"
      },
      {
        title: "Medical Imaging",
        url: "/imaging",
        icon: Monitor,
        description: "Radiology & imaging"
      }
    ]
  },
  {
    title: "Operations",
    items: [
      {
        title: "Billing",
        url: "/billing",
        icon: CreditCard,
        description: "Financial management"
      },
      {
        title: "HR Management",
        url: "/hr",
        icon: Users,
        description: "Human resources"
      },
      {
        title: "Compliance",
        url: "/compliance",
        icon: CheckCircle,
        description: "Regulatory compliance"
      },
      {
        title: "Quality Assurance",
        url: "/quality",
        icon: Shield,
        description: "Quality management"
      }
    ]
  },
  {
    title: "Research & Development",
    items: [
      {
        title: "Research",
        url: "/research",
        icon: BookOpen,
        description: "Research management"
      },
      {
        title: "Clinical Trials",
        url: "/clinical-trials",
        icon: FlaskConical,
        description: "Clinical trial management"
      },
      {
        title: "AI & Analytics",
        url: "/ai-diagnostics",
        icon: Brain,
        description: "AI-powered diagnostics"
      }
    ]
  },
  {
    title: "Community & Support",
    items: [
      {
        title: "Community",
        url: "/community",
        icon: Users,
        description: "Patient community & support"
      },
      {
        title: "Communication",
        url: "/messaging",
        icon: MessageSquare,
        description: "Messaging & communication"
      },
      {
        title: "Public Health",
        url: "/public-health",
        icon: Globe,
        description: "Public health initiatives"
      }
    ]
  },
  {
    title: "Technology & Security",
    items: [
      {
        title: "Security",
        url: "/security",
        icon: Lock,
        description: "Security management"
      },
      {
        title: "System Integration",
        url: "/integration",
        icon: Network,
        description: "System integrations"
      },
      {
        title: "Performance",
        url: "/performance",
        icon: Zap,
        description: "System performance"
      },
      {
        title: "Mobile Optimization",
        url: "/mobile",
        icon: Smartphone,
        description: "Mobile app management"
      }
    ]
  },
  {
    title: "Data & Governance",
    items: [
      {
        title: "Data Governance",
        url: "/data-governance",
        icon: Database,
        description: "Data management & governance"
      },
      {
        title: "Backup & Recovery",
        url: "/backup",
        icon: HardDrive,
        description: "Data backup systems"
      },
      {
        title: "Process Optimization",
        url: "/process-optimization",
        icon: Cpu,
        description: "Workflow optimization"
      }
    ]
  }
];

export const bottomMenuItems: MenuItem[] = [
  {
    title: "Profile",
    url: "/profile",
    icon: User,
    description: "User profile & settings"
  },
  {
    title: "Settings",
    url: "/settings", 
    icon: Settings,
    description: "System settings"
  },
  {
    title: "Admin",
    url: "/admin",
    icon: Shield,
    description: "Admin dashboard"
  }
];
