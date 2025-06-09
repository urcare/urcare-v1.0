
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MFASetupInterface } from './MFASetupInterface';
import { SSOIntegrationDashboard } from './SSOIntegrationDashboard';
import { SecurityMonitoringInterface } from './SecurityMonitoringInterface';
import { EncryptionManagementInterface } from './EncryptionManagementInterface';
import { IntrusionDetectionDashboard } from './IntrusionDetectionDashboard';
import { DataLossPreventionInterface } from './DataLossPreventionInterface';
import { 
  Shield, 
  Lock, 
  Users,
  Eye,
  Key,
  AlertTriangle,
  Database,
  TrendingUp
} from 'lucide-react';

export const AdvancedSecurityDashboard = () => {
  const [activeTab, setActiveTab] = useState('mfa');
  const [securityMetrics, setSecurityMetrics] = useState({
    totalUsers: 8947,
    mfaEnabled: 7623,
    ssoSessions: 4521,
    activeThreats: 12,
    encryptedData: 98.7,
    dlpViolations: 3,
    securityScore: 94.2,
    incidentCount: 7
  });

  useEffect(() => {
    // Simulate real-time security metrics updates
    const interval = setInterval(() => {
      setSecurityMetrics(prev => ({
        ...prev,
        activeThreats: prev.activeThreats + Math.floor(Math.random() * 3) - 1,
        ssoSessions: prev.ssoSessions + Math.floor(Math.random() * 10) - 5,
        dlpViolations: Math.max(0, prev.dlpViolations + Math.floor(Math.random() * 2) - 1)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const securityTabs = [
    {
      id: 'mfa',
      title: 'Multi-Factor Auth',
      icon: Shield,
      component: MFASetupInterface,
      description: 'Comprehensive MFA setup and management'
    },
    {
      id: 'sso',
      title: 'SSO Integration',
      icon: Users,
      component: SSOIntegrationDashboard,
      description: 'Enterprise single sign-on configuration'
    },
    {
      id: 'monitoring',
      title: 'Security Monitoring',
      icon: Eye,
      component: SecurityMonitoringInterface,
      description: 'Real-time threat detection and monitoring'
    },
    {
      id: 'encryption',
      title: 'Encryption Management',
      icon: Lock,
      component: EncryptionManagementInterface,
      description: 'Key management and encryption controls'
    },
    {
      id: 'intrusion',
      title: 'Intrusion Detection',
      icon: AlertTriangle,
      component: IntrusionDetectionDashboard,
      description: 'Advanced threat detection and response'
    },
    {
      id: 'dlp',
      title: 'Data Loss Prevention',
      icon: Database,
      component: DataLossPreventionInterface,
      description: 'Policy enforcement and violation monitoring'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-red-600" />
        <h1 className="text-2xl font-bold">Advanced Security Management</h1>
      </div>

      {/* Security Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{securityMetrics.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{securityMetrics.mfaEnabled.toLocaleString()}</div>
            <div className="text-sm text-gray-600">MFA Enabled</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{securityMetrics.ssoSessions.toLocaleString()}</div>
            <div className="text-sm text-gray-600">SSO Sessions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{securityMetrics.activeThreats}</div>
            <div className="text-sm text-gray-600">Active Threats</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-indigo-600">{securityMetrics.encryptedData}%</div>
            <div className="text-sm text-gray-600">Data Encrypted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{securityMetrics.dlpViolations}</div>
            <div className="text-sm text-gray-600">DLP Violations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-teal-600">{securityMetrics.securityScore}%</div>
            <div className="text-sm text-gray-600">Security Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-pink-600">{securityMetrics.incidentCount}</div>
            <div className="text-sm text-gray-600">Open Incidents</div>
          </CardContent>
        </Card>
      </div>

      {/* Security Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          {securityTabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {securityTabs.map((tab) => {
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
