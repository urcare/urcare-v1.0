
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrowserCompatibilityTester } from './BrowserCompatibilityTester';
import { MobileAppWrapper } from './MobileAppWrapper';
import { TabletOptimizedLayout } from './TabletOptimizedLayout';
import { KioskModeInterface } from './KioskModeInterface';
import { SmartTVIntegration } from './SmartTVIntegration';
import { SmartwatchCompanion } from './SmartwatchCompanion';
import { UnifiedAuthSystem } from './UnifiedAuthSystem';
import { CrossPlatformAnalytics } from './CrossPlatformAnalytics';
import { 
  Monitor, 
  Smartphone, 
  Tablet,
  Computer,
  Tv,
  Watch,
  Shield,
  BarChart3,
  Sync
} from 'lucide-react';

export const CrossPlatformDashboard = () => {
  const [activeTab, setActiveTab] = useState('browser');
  const [platformStats, setPlatformStats] = useState({
    totalDevices: 15247,
    activePlatforms: 8,
    compatibilityScore: 94.7,
    syncedSessions: 8934,
    performanceScore: 92.3,
    securityScore: 97.8
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setPlatformStats(prev => ({
        ...prev,
        totalDevices: prev.totalDevices + Math.floor(Math.random() * 5),
        syncedSessions: prev.syncedSessions + Math.floor(Math.random() * 3)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const platforms = [
    {
      id: 'browser',
      title: 'Browser Testing',
      icon: Monitor,
      component: BrowserCompatibilityTester,
      description: 'Automated browser compatibility testing and issue tracking'
    },
    {
      id: 'mobile',
      title: 'Mobile App',
      icon: Smartphone,
      component: MobileAppWrapper,
      description: 'Native mobile app wrapper with performance optimization'
    },
    {
      id: 'tablet',
      title: 'Tablet Layout',
      icon: Tablet,
      component: TabletOptimizedLayout,
      description: 'Large screen optimized interfaces and productivity features'
    },
    {
      id: 'kiosk',
      title: 'Kiosk Mode',
      icon: Computer,
      component: KioskModeInterface,
      description: 'Locked-down interfaces with timeout and maintenance controls'
    },
    {
      id: 'tv',
      title: 'Smart TV',
      icon: Tv,
      component: SmartTVIntegration,
      description: 'Patient room entertainment and health information displays'
    },
    {
      id: 'watch',
      title: 'Smartwatch',
      icon: Watch,
      component: SmartwatchCompanion,
      description: 'Quick actions, health monitoring, and emergency features'
    },
    {
      id: 'auth',
      title: 'Unified Auth',
      icon: Shield,
      component: UnifiedAuthSystem,
      description: 'Cross-platform authentication and security management'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: BarChart3,
      component: CrossPlatformAnalytics,
      description: 'Performance metrics and usage patterns across platforms'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sync className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold">Cross-Platform Compatibility</h1>
      </div>

      {/* Platform Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{platformStats.totalDevices.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Connected Devices</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{platformStats.compatibilityScore}%</div>
            <div className="text-sm text-gray-600">Compatibility Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{platformStats.syncedSessions.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Synced Sessions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{platformStats.activePlatforms}</div>
            <div className="text-sm text-gray-600">Active Platforms</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{platformStats.performanceScore}%</div>
            <div className="text-sm text-gray-600">Performance Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-indigo-600">{platformStats.securityScore}%</div>
            <div className="text-sm text-gray-600">Security Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:grid-cols-8">
          {platforms.map((platform) => {
            const IconComponent = platform.icon;
            return (
              <TabsTrigger key={platform.id} value={platform.id} className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{platform.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {platforms.map((platform) => {
          const ComponentToRender = platform.component;
          return (
            <TabsContent key={platform.id} value={platform.id} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <platform.icon className="h-5 w-5" />
                    {platform.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{platform.description}</p>
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
