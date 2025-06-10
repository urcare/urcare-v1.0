
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PediatricGrowthTracking } from './PediatricGrowthTracking';
import { VaccinationManagement } from './VaccinationManagement';
import { PediatricDosingCalculator } from './PediatricDosingCalculator';
import { ChildFriendlyInterface } from './ChildFriendlyInterface';
import { ParentalInvolvementTools } from './ParentalInvolvementTools';
import { PediatricEmergencyInterface } from './PediatricEmergencyInterface';
import { 
  Baby,
  Syringe,
  Calculator,
  Smile,
  Users,
  AlertTriangle,
  Heart,
  TrendingUp,
  Shield,
  Calendar
} from 'lucide-react';

export const PediatricCareDashboard = () => {
  const [activeTab, setActiveTab] = useState('growth');
  const [pediatricMetrics, setPediatricMetrics] = useState({
    totalPediatricPatients: 2847,
    vaccinationsToday: 45,
    growthAssessments: 128,
    emergencyCases: 3,
    parentalConsents: 156,
    developmentalScreenings: 89,
    dosageCalculations: 234,
    averageAge: 7.2
  });

  const pediatricTabs = [
    {
      id: 'growth',
      title: 'Growth Tracking',
      icon: TrendingUp,
      component: PediatricGrowthTracking,
      description: 'WHO/CDC growth charts, percentile calculations, and developmental milestones'
    },
    {
      id: 'vaccination',
      title: 'Vaccination Management',
      icon: Syringe,
      component: VaccinationManagement,
      description: 'Immunization schedules, reminders, and exemption tracking'
    },
    {
      id: 'dosing',
      title: 'Dosing Calculator',
      icon: Calculator,
      component: PediatricDosingCalculator,
      description: 'Weight-based calculations with safety alerts and age-appropriate formulations'
    },
    {
      id: 'interface',
      title: 'Child-Friendly Interface',
      icon: Smile,
      component: ChildFriendlyInterface,
      description: 'Colorful designs and interactive elements for young patients'
    },
    {
      id: 'parental',
      title: 'Parental Tools',
      icon: Users,
      component: ParentalInvolvementTools,
      description: 'Consent management, communication portals, and care plan sharing'
    },
    {
      id: 'emergency',
      title: 'Pediatric Emergency',
      icon: AlertTriangle,
      component: PediatricEmergencyInterface,
      description: 'Age-specific protocols and family notification systems'
    }
  ];

  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setPediatricMetrics(prev => ({
        ...prev,
        vaccinationsToday: prev.vaccinationsToday + Math.floor(Math.random() * 3),
        growthAssessments: prev.growthAssessments + Math.floor(Math.random() * 2),
        dosageCalculations: prev.dosageCalculations + Math.floor(Math.random() * 4)
      }));
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Baby className="h-6 w-6 text-pink-600" />
        <h1 className="text-2xl font-bold">Pediatric Care Module</h1>
      </div>

      {/* Pediatric Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-pink-600">{pediatricMetrics.totalPediatricPatients}</div>
            <div className="text-sm text-gray-600">Pediatric Patients</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{pediatricMetrics.vaccinationsToday}</div>
            <div className="text-sm text-gray-600">Vaccinations Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{pediatricMetrics.growthAssessments}</div>
            <div className="text-sm text-gray-600">Growth Assessments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{pediatricMetrics.emergencyCases}</div>
            <div className="text-sm text-gray-600">Emergency Cases</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{pediatricMetrics.parentalConsents}</div>
            <div className="text-sm text-gray-600">Parental Consents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{pediatricMetrics.developmentalScreenings}</div>
            <div className="text-sm text-gray-600">Dev. Screenings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-cyan-600">{pediatricMetrics.dosageCalculations}</div>
            <div className="text-sm text-gray-600">Dosage Calculations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-indigo-600">{pediatricMetrics.averageAge.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Average Age</div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Alert Banner */}
      {pediatricMetrics.emergencyCases > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Pediatric Emergency Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-700">
                <Heart className="h-4 w-4" />
                <span>{pediatricMetrics.emergencyCases} pediatric emergency cases require immediate attention</span>
              </div>
              <div className="flex items-center gap-2 text-red-700">
                <Shield className="h-4 w-4" />
                <span>Age-specific protocols are active and family notifications sent</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pediatric Care Feature Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          {pediatricTabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {pediatricTabs.map((tab) => {
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
