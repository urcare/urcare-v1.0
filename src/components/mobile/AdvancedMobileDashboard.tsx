
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PushNotificationManager } from './PushNotificationManager';
import { BiometricAuthManager } from './BiometricAuthManager';
import { MobilePaymentInterface } from './MobilePaymentInterface';
import { AREducationInterface } from './AREducationInterface';
import { WearableIntegration } from './WearableIntegration';
import { MobileWorkflowOptimizer } from './MobileWorkflowOptimizer';
import { 
  Smartphone, 
  Bell, 
  Fingerprint, 
  CreditCard,
  Eye,
  Watch,
  Workflow
} from 'lucide-react';

export const AdvancedMobileDashboard = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [mobileStats, setMobileStats] = useState({
    activeUsers: 12547,
    notificationsSent: 89234,
    biometricUsers: 8912,
    transactions: 2341,
    arSessions: 567,
    wearableConnections: 3456
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMobileStats(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10),
        notificationsSent: prev.notificationsSent + Math.floor(Math.random() * 20)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      id: 'notifications',
      title: 'Push Notifications',
      icon: Bell,
      component: PushNotificationManager,
      description: 'Category management, priority handling, rich displays'
    },
    {
      id: 'biometric',
      title: 'Biometric Auth',
      icon: Fingerprint,
      component: BiometricAuthManager,
      description: 'Fingerprint, face recognition, secure enrollment'
    },
    {
      id: 'payments',
      title: 'Mobile Payments',
      icon: CreditCard,
      component: MobilePaymentInterface,
      description: 'Secure transactions, payment methods, receipts'
    },
    {
      id: 'ar',
      title: 'AR Education',
      icon: Eye,
      component: AREducationInterface,
      description: '3D visualizations, anatomy models, procedures'
    },
    {
      id: 'wearables',
      title: 'Wearable Integration',
      icon: Watch,
      component: WearableIntegration,
      description: 'Health data, activity tracking, clinical correlation'
    },
    {
      id: 'workflows',
      title: 'Mobile Workflows',
      icon: Workflow,
      component: MobileWorkflowOptimizer,
      description: 'Optimized data entry, voice commands, shortcuts'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Smartphone className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold">Advanced Mobile Features</h1>
      </div>

      {/* Mobile Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{mobileStats.activeUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Active Mobile Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{mobileStats.notificationsSent.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Notifications Sent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{mobileStats.biometricUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Biometric Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{mobileStats.transactions.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Mobile Transactions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{mobileStats.arSessions.toLocaleString()}</div>
            <div className="text-sm text-gray-600">AR Sessions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-indigo-600">{mobileStats.wearableConnections.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Wearable Devices</div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <TabsTrigger key={feature.id} value={feature.id} className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{feature.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {features.map((feature) => {
          const ComponentToRender = feature.component;
          return (
            <TabsContent key={feature.id} value={feature.id} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <feature.icon className="h-5 w-5" />
                    {feature.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{feature.description}</p>
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
