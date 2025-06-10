
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AutomatedTriageInterface } from './AutomatedTriageInterface';
import { EmergencySeverityTracking } from './EmergencySeverityTracking';
import { TraumaActivationInterface } from './TraumaActivationInterface';
import { EmergencyContactNotification } from './EmergencyContactNotification';
import { DisasterResponseInterface } from './DisasterResponseInterface';
import { EmergencySupplyManagement } from './EmergencySupplyManagement';
import { 
  Stethoscope,
  AlertTriangle,
  Users,
  Phone,
  Shield,
  Package,
  Activity,
  Clock,
  UserCheck,
  TrendingUp,
  Heart,
  Zap
} from 'lucide-react';

export const EmergencyMedicineDashboard = () => {
  const [activeTab, setActiveTab] = useState('triage');
  const [emergencyMetrics, setEmergencyMetrics] = useState({
    currentPatients: 47,
    triageLevel1: 3,
    triageLevel2: 8,
    triageLevel3: 18,
    triageLevel4: 12,
    triageLevel5: 6,
    averageWaitTime: 24,
    bedOccupancy: 89,
    traumaAlerts: 2,
    criticalSupplies: 4
  });

  const emergencyTabs = [
    {
      id: 'triage',
      title: 'Automated Triage',
      icon: UserCheck,
      component: AutomatedTriageInterface,
      description: 'ESI calculation, chief complaint processing, and priority assignment'
    },
    {
      id: 'severity',
      title: 'Severity Tracking',
      icon: Activity,
      component: EmergencySeverityTracking,
      description: 'Real-time patient status monitoring and resource allocation'
    },
    {
      id: 'trauma',
      title: 'Trauma Activation',
      icon: AlertTriangle,
      component: TraumaActivationInterface,
      description: 'Team notification systems and protocol checklists'
    },
    {
      id: 'contacts',
      title: 'Emergency Contacts',
      icon: Phone,
      component: EmergencyContactNotification,
      description: 'Automated calling systems and family communication'
    },
    {
      id: 'disaster',
      title: 'Disaster Response',
      icon: Shield,
      component: DisasterResponseInterface,
      description: 'Mass casualty protocols and resource coordination'
    },
    {
      id: 'supplies',
      title: 'Supply Management',
      icon: Package,
      component: EmergencySupplyManagement,
      description: 'Critical inventory tracking and disaster preparedness'
    }
  ];

  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setEmergencyMetrics(prev => ({
        ...prev,
        currentPatients: Math.max(0, prev.currentPatients + Math.floor(Math.random() * 5) - 2),
        averageWaitTime: Math.max(5, prev.averageWaitTime + Math.floor(Math.random() * 6) - 3),
        bedOccupancy: Math.min(100, Math.max(60, prev.bedOccupancy + Math.floor(Math.random() * 4) - 2))
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Stethoscope className="h-6 w-6 text-red-600" />
        <h1 className="text-2xl font-bold">Emergency Medicine Module</h1>
      </div>

      {/* Emergency Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{emergencyMetrics.currentPatients}</div>
            <div className="text-sm text-gray-600">Current Patients</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-800">{emergencyMetrics.triageLevel1}</div>
            <div className="text-sm text-gray-600">Level 1 (Critical)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{emergencyMetrics.triageLevel2}</div>
            <div className="text-sm text-gray-600">Level 2 (Emergent)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{emergencyMetrics.triageLevel3}</div>
            <div className="text-sm text-gray-600">Level 3 (Urgent)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{emergencyMetrics.triageLevel4}</div>
            <div className="text-sm text-gray-600">Level 4 (Less Urgent)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{emergencyMetrics.triageLevel5}</div>
            <div className="text-sm text-gray-600">Level 5 (Non-Urgent)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{emergencyMetrics.averageWaitTime}m</div>
            <div className="text-sm text-gray-600">Avg Wait Time</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-cyan-600">{emergencyMetrics.bedOccupancy}%</div>
            <div className="text-sm text-gray-600">Bed Occupancy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-500">{emergencyMetrics.traumaAlerts}</div>
            <div className="text-sm text-gray-600">Trauma Alerts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-500">{emergencyMetrics.criticalSupplies}</div>
            <div className="text-sm text-gray-600">Critical Supplies</div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alert Banner */}
      {(emergencyMetrics.triageLevel1 > 0 || emergencyMetrics.traumaAlerts > 0) && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Emergency Department Critical Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {emergencyMetrics.triageLevel1 > 0 && (
                <div className="flex items-center gap-2 text-red-700">
                  <Heart className="h-4 w-4" />
                  <span>{emergencyMetrics.triageLevel1} Level 1 critical patients require immediate attention</span>
                </div>
              )}
              {emergencyMetrics.traumaAlerts > 0 && (
                <div className="flex items-center gap-2 text-red-700">
                  <Zap className="h-4 w-4" />
                  <span>{emergencyMetrics.traumaAlerts} active trauma alerts - teams activated</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emergency Medicine Feature Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          {emergencyTabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {emergencyTabs.map((tab) => {
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
