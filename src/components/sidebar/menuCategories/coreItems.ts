import { 
  Calendar, 
  CreditCard, 
  FileText, 
  Users, 
  Stethoscope,
  TestTube,
  Camera,
  Microscope,
  MapPin,
  Building,
  UserCheck,
  Trash2,
  Shield,
  DollarSign,
  Network,
  Monitor,
  MessageSquare,
  Smartphone,
  Zap,
  BarChart3,
  Activity,
  Wrench
} from 'lucide-react';
import { MenuItem } from '../menuItems';

export const coreMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
    description: "Main overview and key metrics"
  },
  {
    title: "Appointments",
    url: "/appointments",
    icon: Calendar,
    description: "Schedule and manage patient appointments"
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
    description: "Comprehensive billing and payment management"
  },
  {
    title: "Documents",
    url: "/documents",
    icon: FileText,
    description: "Medical records and document management"
  },
  {
    title: "Patient Journey",
    url: "/patient-journey",
    icon: MapPin,
    description: "Track patient flow through hospital systems"
  },
  {
    title: "Ward Management",
    url: "/ward",
    icon: Building,
    description: "Hospital ward and bed management"
  },
  {
    title: "Pharmacy",
    url: "/pharmacy",
    icon: Stethoscope,
    description: "Medication management and dispensing"
  },
  {
    title: "LIMS",
    url: "/lims",
    icon: TestTube,
    description: "Laboratory Information Management System"
  },
  {
    title: "RIS",
    url: "/ris",
    icon: Camera,
    description: "Radiology Information System"
  },
  {
    title: "Pathology",
    url: "/pathology",
    icon: Microscope,
    description: "Pathology management and digital pathology"
  },
  {
    title: "System Integration",
    url: "/system-integration",
    icon: Network,
    description: "Centralized integration hub for all systems"
  },
  {
    title: "TPA Management",
    url: "/tpa",
    icon: Shield,
    description: "Third Party Administrator workflow"
  },
  {
    title: "Insurance",
    url: "/insurance",
    icon: DollarSign,
    description: "Insurance verification and claims"
  },
  {
    title: "Visitor Control",
    url: "/visitor-control",
    icon: UserCheck,
    description: "Hospital visitor management system"
  },
  {
    title: "Bio-waste Management",
    url: "/bio-waste",
    icon: Trash2,
    description: "Medical waste tracking and compliance"
  },
  {
    title: "Device Integration",
    url: "/device-integration",
    icon: Monitor,
    description: "Medical device management and IoT integration"
  },
  {
    title: "Communication Systems",
    url: "/communication-systems",
    icon: MessageSquare,
    description: "Comprehensive communication and telemedicine platform"
  },
  {
    title: "Mobile Optimization",
    url: "/mobile-optimization",
    icon: Smartphone,
    description: "PWA, offline functionality, and mobile features"
  },
  {
    title: "Performance Optimization",
    url: "/performance-optimization",
    icon: Zap,
    description: "Intelligent optimization, caching, and performance monitoring"
  },
  {
    title: "Performance Monitoring",
    url: "/performance-monitoring", 
    icon: Monitor,
    description: "Real-time system monitoring with comprehensive analytics and alerting"
  },
  {
    title: "Scalability Management",
    url: "/scalability-management", 
    icon: Activity,
    description: "Auto-scaling, load balancing, and resource optimization"
  },
  {
    title: "System Maintenance",
    url: "/system-maintenance",
    icon: Wrench,
    description: "Maintenance scheduling, updates, backup, and disaster recovery"
  },
  {
    title: "Quality Assurance",
    url: "/quality-assurance", 
    icon: Shield,
    description: "Comprehensive testing, bug tracking, code quality, and security scanning"
  }
];
