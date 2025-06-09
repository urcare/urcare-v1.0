
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ABACInterface } from './ABACInterface';
import { DynamicPermissionDashboard } from './DynamicPermissionDashboard';
import { SessionManagementInterface } from './SessionManagementInterface';
import { PrivilegedAccessDashboard } from './PrivilegedAccessDashboard';
import { AccessReviewInterface } from './AccessReviewInterface';
import { EmergencyAccessInterface } from './EmergencyAccessInterface';
import { 
  Shield,
  Lock,
  Users,
  Clock,
  Key,
  AlertTriangle,
  CheckCircle,
  Activity,
  Eye,
  Settings
} from 'lucide-react';

export const AdvancedAccessControlDashboard = () => {
  const [activeTab, setActiveTab] = useState('abac');
  const [accessMetrics, setAccessMetrics] = useState({
    totalUsers: 3247,
    activeSessions: 1856,
    privilegedAccounts: 89,
    pendingReviews: 23,
    emergencyAccess: 3,
    policyViolations: 7,
    accessRequests: 45,
    averageSessionTime: 4.2
  });

  const accessTabs = [
    {
      id: 'abac',
      title: 'ABAC System',
      icon: Shield,
      component: ABACInterface,
      description: 'Attribute-based access control management'
    },
    {
      id: 'dynamic-permissions',
      title: 'Dynamic Permissions',
      icon: Settings,
      component: DynamicPermissionDashboard,
      description: 'Context-aware permission management'
    },
    {
      id: 'session-management',
      title: 'Session Management',
      icon: Clock,
      component: SessionManagementInterface,
      description: 'Session monitoring and control'
    },
    {
      id: 'privileged-access',
      title: 'Privileged Access',
      icon: Key,
      component: PrivilegedAccessDashboard,
      description: 'Elevated permissions and approvals'
    },
    {
      id: 'access-review',
      title: 'Access Review',
      icon: CheckCircle,
      component: AccessReviewInterface,
      description: 'Certification and review workflows'
    },
    {
      id: 'emergency-access',
      title: 'Emergency Access',
      icon: AlertTriangle,
      component: EmergencyAccessInterface,
      description: 'Break-glass procedures and audit'
    }
  ];

  useEffect(() => {
    // Simulate real-time access control updates
    const interval = setInterval(() => {
      setAccessMetrics(prev => ({
        ...prev,
        activeSessions: Math.max(0, prev.activeSessions + Math.floor(Math.random() * 10) - 5),
        pendingReviews: Math.max(0, prev.pendingReviews + Math.floor(Math.random() * 3) - 1),
        emergencyAccess: Math.max(0, prev.emergencyAccess + Math.floor(Math.random() * 2) - 1)
      }));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-purple-600" />
        <h1 className="text-2xl font-bold">Advanced Access Control</h1>
      </div>

      {/* Access Control Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{accessMetrics.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{accessMetrics.activeSessions.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Active Sessions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{accessMetrics.privilegedAccounts}</div>
            <div className="text-sm text-gray-600">Privileged Accounts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{accessMetrics.pendingReviews}</div>
            <div className="text-sm text-gray-600">Pending Reviews</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{accessMetrics.emergencyAccess}</div>
            <div className="text-sm text-gray-600">Emergency Access</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{accessMetrics.policyViolations}</div>
            <div className="text-sm text-gray-600">Policy Violations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-indigo-600">{accessMetrics.accessRequests}</div>
            <div className="text-sm text-gray-600">Access Requests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-teal-600">{accessMetrics.averageSessionTime}h</div>
            <div className="text-sm text-gray-600">Avg Session Time</div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {(accessMetrics.emergencyAccess > 0 || accessMetrics.policyViolations > 5) && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Critical Access Control Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {accessMetrics.emergencyAccess > 0 && (
                <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{accessMetrics.emergencyAccess} active emergency access sessions</span>
                </div>
              )}
              {accessMetrics.policyViolations > 5 && (
                <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-4 w-4" />
                  <span>High number of policy violations detected</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Access Control Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          {accessTabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {accessTabs.map((tab) => {
          const ComponentToRender = tab.component;
          return (
            <TabsContent key={tab.id} value={tab.id} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <tab.icon className="h-5 w-5" />
                    {tab.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{tab.description}</p>
                </CardHeader>
                <CardContent>
                  <ComponentToRender />
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};
