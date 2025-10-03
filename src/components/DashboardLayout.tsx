import React from 'react';
import { AppSidebar } from './AppSidebar';
import { NotificationBell } from './notifications/NotificationBell';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Bell, 
  Settings, 
  User,
  Heart,
  Activity,
  TrendingUp,
  Calendar,
  FileText,
  Users,
  Shield,
  Zap
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showHeader?: boolean;
  showStats?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  description,
  showHeader = true,
  showStats = false
}) => {
  const { user, profile } = useAuth();

  const getQuickStats = () => {
    const role = profile?.role || user?.user_metadata?.role || 'patient';
    
    switch (role) {
      case 'patient':
        return [
          { title: 'Health Score', value: '92%', icon: Heart, color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20' },
          { title: 'Next Appointment', value: 'Tomorrow', icon: Calendar, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
          { title: 'Active Medications', value: '3', icon: FileText, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
          { title: 'Recent Tests', value: '2', icon: Activity, color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-900/20' },
        ];
      case 'doctor':
        return [
          { title: 'Today\'s Patients', value: '12', icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
          { title: 'Pending Reviews', value: '5', icon: FileText, color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-900/20' },
          { title: 'AI Insights', value: '8', icon: Zap, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
          { title: 'Success Rate', value: '94%', icon: TrendingUp, color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20' },
        ];
      case 'nurse':
        return [
          { title: 'Active Patients', value: '8', icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
          { title: 'Vital Checks', value: '15', icon: Activity, color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20' },
          { title: 'Medications Due', value: '6', icon: FileText, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
          { title: 'Alerts', value: '2', icon: Bell, color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-900/20' },
        ];
      case 'admin':
        return [
          { title: 'Active Users', value: '156', icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
          { title: 'System Health', value: '98%', icon: Shield, color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20' },
          { title: 'Security Alerts', value: '0', icon: Shield, color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20' },
          { title: 'Performance', value: '96%', icon: TrendingUp, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
        ];
      default:
        return [
          { title: 'Tasks', value: '12', icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
          { title: 'Notifications', value: '5', icon: Bell, color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-900/20' },
          { title: 'Health Score', value: '85%', icon: Heart, color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20' },
          { title: 'Activity', value: 'High', icon: Activity, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
        ];
    }
  };

  const stats = getQuickStats();

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        {showHeader && (
          <header className="medical-nav px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  {title && (
                    <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                  )}
                  {description && (
                    <p className="text-muted-foreground">{description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-10 w-64 bg-muted/50 border-0 focus:bg-background"
                  />
                </div>
                
                {/* Notifications */}
                <NotificationBell />
                
                {/* User Menu */}
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-foreground">
                      {profile?.full_name || user?.email}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {profile?.role}
                    </p>
                  </div>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="" alt={profile?.full_name || ''} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                      {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Quick Stats */}
        {showStats && (
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                          <Icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                          </p>
                          <p className="text-lg font-semibold text-foreground">
                            {stat.value}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-background">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Enhanced Page Header Component
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  breadcrumbs
}) => {
  return (
    <div className="mb-8">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>/</span>}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </a>
              ) : (
                <span className="text-foreground font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      
      {/* Title and Description */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
          {description && (
            <p className="text-lg text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Card Components
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  trend,
  description
}) => {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-foreground mb-1">
              {value}
            </p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {trend && (
              <div className="flex items-center mt-2">
                <TrendingUp 
                  className={`h-4 w-4 mr-1 ${
                    trend.isPositive ? 'text-green-500' : 'text-red-500'
                  }`} 
                />
                <span className={`text-xs font-medium ${
                  trend.isPositive ? 'text-green-500' : 'text-red-500'
                }`}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${bgColor}`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Loading State Component
export const LoadingState: React.FC<{ message?: string }> = ({ 
  message = "Loading..." 
}) => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

// Empty State Component
interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action
}) => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4 max-w-md">{description}</p>
        {action && action}
      </div>
    </div>
  );
};
