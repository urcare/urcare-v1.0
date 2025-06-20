import { 
  Home, 
  Calendar, 
  Users, 
  FileText, 
  Settings, 
  Shield, 
  BarChart3, 
  Stethoscope, 
  Heart, 
  Brain, 
  Baby, 
  UserCheck, 
  Pill, 
  Building2, 
  CreditCard, 
  Phone, 
  Truck, 
  Activity, 
  Clipboard, 
  Search, 
  Database, 
  Lock, 
  Zap, 
  Globe, 
  Microscope, 
  FlaskConical, 
  TestTube, 
  DollarSign, 
  MessageSquare, 
  AlertTriangle, 
  TrendingUp, 
  Workflow, 
  GitBranch, 
  Layers, 
  Monitor, 
  Smartphone, 
  Cpu, 
  Cloud, 
  Link, 
  Radio, 
  UserPlus, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Target, 
  PieChart, 
  BarChart, 
  LineChart, 
  Video, 
  Headphones, 
  Mail, 
  Bell, 
  Eye, 
  Key, 
  Server, 
  HardDrive, 
  Wifi, 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  HelpCircle, 
  BookOpen, 
  FileCheck, 
  Award, 
  Trophy, 
  Star, 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Tag, 
  Filter, 
  ArrowUpDown, 
  Grid, 
  List, 
  Menu, 
  X, 
  Plus, 
  Minus, 
  Edit, 
  Trash2, 
  Copy, 
  Save, 
  Upload as UploadIcon, 
  Download as DownloadIcon,
  LogOut,
  UserCog,
  Wrench,
  Cog
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
    title: "Core Systems",
    items: [
      { title: "Dashboard", url: "/dashboard/admin", icon: Home },
      { title: "Patient Dashboard", url: "/dashboard", icon: Users },
      { title: "Appointments", url: "/appointments", icon: Calendar },
      { title: "Documents", url: "/documents", icon: FileText },
      { title: "Ward Management", url: "/ward", icon: Building2 },
      { title: "Patient Journey", url: "/patient-journey", icon: MapPin },
    ]
  },
  {
    title: "Medical Services",
    items: [
      { title: "Emergency Medicine", url: "/emergency-medicine", icon: AlertTriangle },
      { title: "Emergency", url: "/emergency", icon: Shield },
      { title: "Surgical Services", url: "/surgical-services", icon: Stethoscope },
      { title: "Pathology", url: "/pathology", icon: Microscope },
      { title: "Oncology Care", url: "/oncology-care", icon: Heart },
      { title: "Mental Health", url: "/mental-health", icon: Brain },
      { title: "Pediatric Care", url: "/pediatric-care", icon: Baby },
      { title: "Geriatric Care", url: "/geriatric-care", icon: UserCheck },
      { title: "Rehabilitation Services", url: "/rehabilitation-services", icon: Activity },
      { title: "Telemedicine", url: "/telemedicine", icon: Video },
    ]
  },
  {
    title: "Healthcare Analytics",
    items: [
      { title: "Hospital Analytics", url: "/hospital-analytics", icon: BarChart3 },
      { title: "Clinical Analytics", url: "/clinical-analytics", icon: TrendingUp },
      { title: "Clinical Decision Support", url: "/clinical-decision-support", icon: Brain },
      { title: "Clinical Optimization", url: "/clinical-optimization", icon: Target },
      { title: "Performance Monitoring", url: "/performance-monitoring", icon: Monitor },
      { title: "Performance Optimization", url: "/performance-optimization", icon: Zap },
    ]
  },
  {
    title: "Laboratory & Diagnostics",
    items: [
      { title: "LIMS", url: "/lims", icon: FlaskConical },
      { title: "RIS", url: "/ris", icon: TestTube },
      { title: "Pharmacy", url: "/pharmacy", icon: Pill },
    ]
  },
  {
    title: "Financial Management",
    items: [
      { title: "Billing", url: "/billing", icon: DollarSign },
      { title: "Insurance", url: "/insurance", icon: CreditCard },
      { title: "TPA", url: "/tpa", icon: Briefcase },
    ]
  },
  {
    title: "AI & Automation",
    items: [
      { title: "Advanced AI Diagnostics", url: "/advanced-ai-diagnostics", icon: Brain },
      { title: "Mental Health AI", url: "/mental-health-ai", icon: Headphones },
      { title: "Predictive Clinical AI", url: "/predictive-clinical-ai", icon: TrendingUp },
      { title: "Workflow Automation AI", url: "/workflow-automation-ai", icon: Workflow },
      { title: "Advanced Workflow AI", url: "/advanced-workflow-ai", icon: GitBranch },
      { title: "Process Optimization AI", url: "/process-optimization-ai", icon: Target },
      { title: "Treatment Protocol AI", url: "/treatment-protocol-ai", icon: Clipboard },
      { title: "Content Engagement AI", url: "/content-engagement-ai", icon: MessageSquare },
      { title: "Emotional Retention AI", url: "/emotional-retention-ai", icon: Heart },
      { title: "Safety Compliance AI", url: "/safety-compliance-ai", icon: Shield },
      { title: "Predictive Maintenance AI", url: "/predictive-maintenance-ai", icon: Wrench },
      { title: "Advanced Automation", url: "/advanced-automation", icon: Zap },
    ]
  },
  {
    title: "Patient Engagement",
    items: [
      { title: "Community", url: "/community", icon: Users },
      { title: "Engagement", url: "/engagement", icon: ThumbsUp },
      { title: "Wellness", url: "/wellness", icon: Heart },
      { title: "Intelligent Content", url: "/intelligent-content", icon: BookOpen },
    ]
  },
  {
    title: "System Management",
    items: [
      { title: "HR Management", url: "/hr-management", icon: UserPlus },
      { title: "HR Analytics", url: "/hr-analytics", icon: BarChart },
      { title: "Visitor Control", url: "/visitor-control", icon: Eye },
      { title: "Bio Waste Management", url: "/bio-waste-management", icon: Truck },
      { title: "System Integration", url: "/system-integration", icon: Link },
      { title: "Device Integration", url: "/device-integration", icon: Cpu },
      { title: "Communication Systems", url: "/communication-systems", icon: Phone },
      { title: "System Maintenance", url: "/system-maintenance", icon: Wrench },
    ]
  },
  {
    title: "Security & Compliance",
    items: [
      { title: "Advanced Security Features", url: "/advanced-security-features", icon: Lock },
      { title: "Advanced Access Control", url: "/advanced-access-control", icon: Key },
      { title: "Compliance Management", url: "/compliance-management", icon: CheckCircle },
      { title: "Data Governance", url: "/data-governance", icon: Database },
      { title: "Risk Management", url: "/risk-management", icon: AlertCircle },
      { title: "Quality Assurance", url: "/quality-assurance", icon: Award },
    ]
  },
  {
    title: "Advanced Features",
    items: [
      { title: "Advanced Research Tools", url: "/advanced-research-tools", icon: Search },
      { title: "Research Data Management", url: "/research-data-management", icon: Database },
      { title: "Public Health Integration", url: "/public-health-integration", icon: Globe },
      { title: "Natural Language Processing", url: "/natural-language-processing", icon: MessageCircle },
      { title: "Cross Platform Compatibility", url: "/cross-platform-compatibility", icon: Layers },
      { title: "Scalability Management", url: "/scalability-management", icon: TrendingUp },
      { title: "Advanced UI", url: "/advanced-ui", icon: Monitor },
    ]
  },
  {
    title: "Mobile & Optimization",
    items: [
      { title: "Mobile Optimization", url: "/mobile-optimization", icon: Smartphone },
      { title: "Advanced Mobile Features", url: "/advanced-mobile-features", icon: Smartphone },
      { title: "Mobile Landing", url: "/mobile-landing", icon: Globe },
    ]
  }
];

export const bottomMenuItems: MenuItem[] = [
  { title: "Profile Management", url: "/profile-management", icon: UserCog },
  { title: "Profile", url: "/profile", icon: Users },
  { title: "Settings", url: "/settings", icon: Cog },
];
