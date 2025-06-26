import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Heart, 
  Stethoscope, 
  Users, 
  Shield, 
  Activity, 
  UserCheck, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Calendar,
  FileText,
  Bell,
  BarChart3,
  User,
  Pill,
  Microscope,
  Phone,
  MessageSquare,
  BookOpen,
  Award,
  Zap,
  Brain,
  Eye,
  Bed,
  Syringe,
  Thermometer,
  ActivitySquare,
  ClipboardList,
  CreditCard,
  Building2,
  GraduationCap,
  ShieldCheck,
  Database,
  Network,
  Cog,
  HelpCircle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description?: string;
  badge?: string;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export const AppSidebar = () => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const getRoleBasedSections = (): SidebarSection[] => {
    const role = profile?.role || user?.user_metadata?.role || 'patient';
    
    const commonSections: SidebarSection[] = [
      {
        title: 'Overview',
        items: [
          { title: 'Dashboard', href: '/dashboard', icon: Home, color: 'text-blue-500' },
          { title: 'Profile', href: '/profile', icon: User, color: 'text-green-500' },
          { title: 'Notifications', href: '/notifications', icon: Bell, color: 'text-orange-500' },
        ]
      }
    ];

    const roleSpecificSections: SidebarSection[] = [];

    switch (role) {
      case 'patient':
        roleSpecificSections.push(
          {
            title: 'Health Management',
            items: [
              { title: 'Medical Records', href: '/medical-records', icon: FileText, color: 'text-blue-500' },
              { title: 'Appointments', href: '/appointments', icon: Calendar, color: 'text-green-500' },
              { title: 'Medications', href: '/medications', icon: Pill, color: 'text-purple-500' },
              { title: 'Test Results', href: '/test-results', icon: Microscope, color: 'text-indigo-500' },
            ]
          },
          {
            title: 'Wellness',
            items: [
              { title: 'Health Score', href: '/health-score', icon: Activity, color: 'text-emerald-500' },
              { title: 'Mental Health', href: '/mental-health', icon: Brain, color: 'text-pink-500' },
              { title: 'Wellness Programs', href: '/wellness', icon: Award, color: 'text-yellow-500' },
            ]
          }
        );
        break;

      case 'doctor':
        roleSpecificSections.push(
          {
            title: 'Patient Care',
            items: [
              { title: 'Patient List', href: '/patients', icon: Users, color: 'text-blue-500' },
              { title: 'Appointments', href: '/appointments', icon: Calendar, color: 'text-green-500' },
              { title: 'Medical Records', href: '/medical-records', icon: FileText, color: 'text-purple-500' },
              { title: 'Diagnostics', href: '/diagnostics', icon: Stethoscope, color: 'text-indigo-500' },
            ]
          },
          {
            title: 'Clinical Tools',
            items: [
              { title: 'AI Diagnostics', href: '/ai-diagnostics', icon: Zap, color: 'text-orange-500' },
              { title: 'Treatment Plans', href: '/treatment-plans', icon: ClipboardList, color: 'text-teal-500' },
              { title: 'Clinical Analytics', href: '/clinical-analytics', icon: BarChart3, color: 'text-cyan-500' },
            ]
          }
        );
        break;

      case 'nurse':
        roleSpecificSections.push(
          {
            title: 'Patient Care',
            items: [
              { title: 'Patient List', href: '/patients', icon: Users, color: 'text-blue-500' },
              { title: 'Vital Signs', href: '/vital-signs', icon: Thermometer, color: 'text-red-500' },
              { title: 'Medication Admin', href: '/medication-admin', icon: Syringe, color: 'text-purple-500' },
              { title: 'Bed Management', href: '/bed-management', icon: Bed, color: 'text-green-500' },
            ]
          },
          {
            title: 'Care Coordination',
            items: [
              { title: 'Care Plans', href: '/care-plans', icon: ClipboardList, color: 'text-teal-500' },
              { title: 'Patient Monitoring', href: '/patient-monitoring', icon: ActivitySquare, color: 'text-orange-500' },
            ]
          }
        );
        break;

      case 'admin':
        roleSpecificSections.push(
          {
            title: 'System Management',
            items: [
              { title: 'User Management', href: '/users', icon: Users, color: 'text-blue-500' },
              { title: 'System Settings', href: '/settings', icon: Settings, color: 'text-gray-500' },
              { title: 'Security', href: '/security', icon: ShieldCheck, color: 'text-red-500' },
              { title: 'Database', href: '/database', icon: Database, color: 'text-purple-500' },
            ]
          },
          {
            title: 'Analytics',
            items: [
              { title: 'System Analytics', href: '/analytics', icon: BarChart3, color: 'text-green-500' },
              { title: 'Performance', href: '/performance', icon: Activity, color: 'text-orange-500' },
            ]
          }
        );
        break;

      case 'pharmacy':
        roleSpecificSections.push(
          {
            title: 'Pharmacy Management',
            items: [
              { title: 'Inventory', href: '/inventory', icon: Pill, color: 'text-blue-500' },
              { title: 'Prescriptions', href: '/prescriptions', icon: FileText, color: 'text-green-500' },
              { title: 'Dispensing', href: '/dispensing', icon: Syringe, color: 'text-purple-500' },
              { title: 'Drug Interactions', href: '/drug-interactions', icon: Shield, color: 'text-red-500' },
            ]
          }
        );
        break;

      case 'lab':
        roleSpecificSections.push(
          {
            title: 'Laboratory',
            items: [
              { title: 'Test Orders', href: '/test-orders', icon: ClipboardList, color: 'text-blue-500' },
              { title: 'Results', href: '/results', icon: Microscope, color: 'text-green-500' },
              { title: 'Equipment', href: '/equipment', icon: Activity, color: 'text-purple-500' },
              { title: 'Quality Control', href: '/quality-control', icon: ShieldCheck, color: 'text-orange-500' },
            ]
          }
        );
        break;

      case 'reception':
        roleSpecificSections.push(
          {
            title: 'Patient Services',
            items: [
              { title: 'Registration', href: '/registration', icon: UserCheck, color: 'text-blue-500' },
              { title: 'Appointments', href: '/appointments', icon: Calendar, color: 'text-green-500' },
              { title: 'Billing', href: '/billing', icon: CreditCard, color: 'text-purple-500' },
              { title: 'Insurance', href: '/insurance', icon: Shield, color: 'text-indigo-500' },
            ]
          }
        );
        break;

      case 'hr':
        roleSpecificSections.push(
          {
            title: 'Human Resources',
            items: [
              { title: 'Employee Management', href: '/employees', icon: Users, color: 'text-blue-500' },
              { title: 'Training', href: '/training', icon: GraduationCap, color: 'text-green-500' },
              { title: 'Compliance', href: '/compliance', icon: ShieldCheck, color: 'text-purple-500' },
              { title: 'Performance', href: '/performance', icon: BarChart3, color: 'text-orange-500' },
            ]
          }
        );
        break;
    }

    return [...commonSections, ...roleSpecificSections];
  };

  const sections = getRoleBasedSections();

  return (
    <div className={cn(
      "medical-sidebar h-screen flex flex-col transition-all duration-300 ease-in-out",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              UrCare
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0 hover:bg-muted"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {profile?.full_name || user.email}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {profile?.role}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-6">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {!collapsed && (
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className={cn(
                        "h-5 w-5 transition-colors duration-200",
                        isActive ? "text-primary-foreground" : item.color
                      )} />
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                      {collapsed && isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="space-y-2">
          {!collapsed && (
            <>
              <Link
                to="/help"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
              >
                <HelpCircle className="h-5 w-5" />
                <span>Help & Support</span>
              </Link>
              <Link
                to="/about"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
              >
                <Info className="h-5 w-5" />
                <span>About</span>
              </Link>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className={cn(
              "w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted",
              collapsed && "justify-center"
            )}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="ml-3">Sign Out</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};
