import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Heart, 
  Stethoscope, 
  Users, 
  Shield, 
  Zap, 
  Brain, 
  Activity, 
  Calendar,
  FileText,
  Bell,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Globe,
  Clock,
  TrendingUp,
  BarChart3,
  Microscope,
  Pill,
  Phone,
  MessageSquare,
  Video,
  MapPin,
  UserCheck,
  Database,
  Cpu,
  Smartphone,
  Tablet,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { user, profile, signOut } = useAuth();

  const quickActions = [
    {
      title: 'AI Diagnostics',
      description: 'Get AI-powered health insights',
      icon: Brain,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      href: '/ai-diagnostics'
    },
    {
      title: 'Appointments',
      description: 'Schedule and manage appointments',
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      href: '/appointments'
    },
    {
      title: 'Health Records',
      description: 'View your medical history',
      icon: FileText,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      href: '/medical-records'
    },
    {
      title: 'Mental Health',
      description: 'Access mental health resources',
      icon: Heart,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      href: '/mental-health'
    }
  ];

  const recentActivity = [
    {
      type: 'appointment',
      title: 'Upcoming Appointment',
      description: 'Dr. Smith - Cardiology',
      time: 'Tomorrow at 2:00 PM',
      icon: Calendar,
      color: 'text-blue-500'
    },
    {
      type: 'medication',
      title: 'Medication Reminder',
      description: 'Take your daily medication',
      time: 'Due in 2 hours',
      icon: Pill,
      color: 'text-green-500'
    },
    {
      type: 'test',
      title: 'Lab Results Available',
      description: 'Blood work results ready',
      time: '2 hours ago',
      icon: Microscope,
      color: 'text-purple-500'
    }
  ];

  const healthMetrics = [
    {
      title: 'Heart Rate',
      value: '72',
      unit: 'bpm',
      status: 'normal',
      icon: Heart,
      color: 'text-red-500'
    },
    {
      title: 'Blood Pressure',
      value: '120/80',
      unit: 'mmHg',
      status: 'normal',
      icon: Activity,
      color: 'text-blue-500'
    },
    {
      title: 'Weight',
      value: '68',
      unit: 'kg',
      status: 'stable',
      icon: TrendingUp,
      color: 'text-green-500'
    },
    {
      title: 'Sleep',
      value: '7.5',
      unit: 'hours',
      status: 'good',
      icon: Clock,
      color: 'text-indigo-500'
    }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="medical-nav px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              UrCare
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, {profile?.full_name || 'User'}!
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening with your health today.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="px-3 py-1">
                <User className="w-4 h-4 mr-2" />
                {profile?.role || 'Patient'}
              </Badge>
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                  {profile?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-blue-500" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Access your most frequently used features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Link key={index} to={action.href}>
                        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 ${action.bgColor} rounded-lg flex items-center justify-center`}>
                                <Icon className={`w-5 h-5 ${action.color}`} />
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground">{action.title}</h3>
                                <p className="text-sm text-muted-foreground">{action.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-500" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your latest health-related activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                        <div className={`w-10 h-10 bg-background rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${activity.color}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{activity.title}</h4>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Health Metrics */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-purple-500" />
                  Health Metrics
                </CardTitle>
                <CardDescription>
                  Your current health indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthMetrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-5 h-5 ${metric.color}`} />
                          <div>
                            <p className="text-sm font-medium text-foreground">{metric.title}</p>
                            <p className="text-xs text-muted-foreground capitalize">{metric.status}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-foreground">{metric.value}</p>
                          <p className="text-xs text-muted-foreground">{metric.unit}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-red-500" />
                  Emergency Contacts
                </CardTitle>
                <CardDescription>
                  Quick access to emergency contacts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <p className="font-medium text-foreground">{profile?.emergency_contact || 'Not set'}</p>
                    <p className="text-sm text-muted-foreground">{profile?.emergency_phone || 'No phone number'}</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Emergency
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Health Tips */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Daily Health Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                  <p className="text-sm text-foreground">
                    "Staying hydrated is crucial for your health. Aim to drink at least 8 glasses of water daily."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}; 