
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeriatricAssessmentInterface } from './GeriatricAssessmentInterface';
import { FallRiskAssessment } from './FallRiskAssessment';
import { GeriatricMedicationManagement } from './GeriatricMedicationManagement';
import { CognitiveAssessmentTools } from './CognitiveAssessmentTools';
import { FamilyCaregiverPortal } from './FamilyCaregiverPortal';
import { LongTermCarePlanning } from './LongTermCarePlanning';
import { 
  Users,
  AlertTriangle,
  Pill,
  Brain,
  Heart,
  Calendar,
  Activity,
  TrendingUp,
  Shield,
  UserCheck
} from 'lucide-react';

export const GeriatricCareDashboard = () => {
  const [activeTab, setActiveTab] = useState('assessment');
  const [geriatricMetrics, setGeriatricMetrics] = useState({
    totalGeriatricPatients: 1847,
    highRiskFalls: 127,
    cognitiveAssessments: 89,
    medicationReviews: 156,
    familyEngagements: 234,
    carePlansActive: 178,
    emergencyAlerts: 5,
    averageAge: 78.4
  });

  const geriatricTabs = [
    {
      id: 'assessment',
      title: 'Geriatric Assessment',
      icon: Activity,
      component: GeriatricAssessmentInterface,
      description: 'Activities of daily living, frailty measurements, and comprehensive evaluations'
    },
    {
      id: 'fallrisk',
      title: 'Fall Risk Assessment',
      icon: AlertTriangle,
      component: FallRiskAssessment,
      description: 'Environmental evaluations, medication reviews, and prevention planning'
    },
    {
      id: 'medication',
      title: 'Medication Management',
      icon: Pill,
      component: GeriatricMedicationManagement,
      description: 'Polypharmacy tracking, drug interactions, and adherence monitoring'
    },
    {
      id: 'cognitive',
      title: 'Cognitive Assessment',
      icon: Brain,
      component: CognitiveAssessmentTools,
      description: 'MMSE, MoCA tools with tracking and care plan adjustments'
    },
    {
      id: 'family',
      title: 'Family Caregiver Portal',
      icon: Users,
      component: FamilyCaregiverPortal,
      description: 'Care plan sharing, notifications, and educational resources'
    },
    {
      id: 'planning',
      title: 'Long-Term Care Planning',
      icon: Calendar,
      component: LongTermCarePlanning,
      description: 'Care transitions, resource coordination, and advance directives'
    }
  ];

  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setGeriatricMetrics(prev => ({
        ...prev,
        highRiskFalls: prev.highRiskFalls + Math.floor(Math.random() * 2),
        cognitiveAssessments: prev.cognitiveAssessments + Math.floor(Math.random() * 3),
        familyEngagements: prev.familyEngagements + Math.floor(Math.random() * 4)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <UserCheck className="h-6 w-6 text-purple-600" />
        <h1 className="text-2xl font-bold">Geriatric Care Module</h1>
      </div>

      {/* Geriatric Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{geriatricMetrics.totalGeriatricPatients}</div>
            <div className="text-sm text-gray-600">Geriatric Patients</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{geriatricMetrics.highRiskFalls}</div>
            <div className="text-sm text-gray-600">High Fall Risk</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{geriatricMetrics.cognitiveAssessments}</div>
            <div className="text-sm text-gray-600">Cognitive Assessments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{geriatricMetrics.medicationReviews}</div>
            <div className="text-sm text-gray-600">Medication Reviews</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{geriatricMetrics.familyEngagements}</div>
            <div className="text-sm text-gray-600">Family Engagements</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-cyan-600">{geriatricMetrics.carePlansActive}</div>
            <div className="text-sm text-gray-600">Active Care Plans</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{geriatricMetrics.emergencyAlerts}</div>
            <div className="text-sm text-gray-600">Emergency Alerts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-indigo-600">{geriatricMetrics.averageAge.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Average Age</div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Alert Banner */}
      {geriatricMetrics.emergencyAlerts > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Geriatric Emergency Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-700">
                <Heart className="h-4 w-4" />
                <span>{geriatricMetrics.emergencyAlerts} geriatric patients require immediate attention</span>
              </div>
              <div className="flex items-center gap-2 text-red-700">
                <Shield className="h-4 w-4" />
                <span>Age-specific protocols activated and families notified</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Geriatric Care Feature Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          {geriatricTabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {geriatricTabs.map((tab) => {
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
