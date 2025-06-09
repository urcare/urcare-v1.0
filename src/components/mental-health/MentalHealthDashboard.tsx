
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MentalHealthScreeningInterface } from './MentalHealthScreeningInterface';
import { TherapySessionManagement } from './TherapySessionManagement';
import { CrisisInterventionInterface } from './CrisisInterventionInterface';
import { MentalHealthResourceLibrary } from './MentalHealthResourceLibrary';
import { SupportGroupManagement } from './SupportGroupManagement';
import { MentalHealthAnalyticsDashboard } from './MentalHealthAnalyticsDashboard';
import { 
  Brain,
  Calendar,
  AlertTriangle,
  BookOpen,
  Users,
  BarChart3,
  Heart,
  Shield,
  TrendingUp,
  Activity
} from 'lucide-react';

export const MentalHealthDashboard = () => {
  const [activeTab, setActiveTab] = useState('screening');
  const [mentalHealthMetrics, setMentalHealthMetrics] = useState({
    totalScreenings: 1247,
    activeTherapySessions: 89,
    crisisInterventions: 12,
    resourceAccess: 3456,
    supportGroupParticipants: 234,
    riskAlerts: 5,
    completedAssessments: 892,
    averageRiskScore: 3.2
  });

  const mentalHealthTabs = [
    {
      id: 'screening',
      title: 'Mental Health Screening',
      icon: Brain,
      component: MentalHealthScreeningInterface,
      description: 'Validated assessment tools with automated scoring and risk stratification'
    },
    {
      id: 'therapy',
      title: 'Therapy Management',
      icon: Calendar,
      component: TherapySessionManagement,
      description: 'Session scheduling, progress tracking, and treatment planning'
    },
    {
      id: 'crisis',
      title: 'Crisis Intervention',
      icon: AlertTriangle,
      component: CrisisInterventionInterface,
      description: 'Risk assessment protocols and emergency response systems'
    },
    {
      id: 'resources',
      title: 'Resource Library',
      icon: BookOpen,
      component: MentalHealthResourceLibrary,
      description: 'Categorized mental health resources with personalized recommendations'
    },
    {
      id: 'support',
      title: 'Support Groups',
      icon: Users,
      component: SupportGroupManagement,
      description: 'Virtual meetings, participant tracking, and facilitation tools'
    },
    {
      id: 'analytics',
      title: 'Mental Health Analytics',
      icon: BarChart3,
      component: MentalHealthAnalyticsDashboard,
      description: 'Population health metrics and treatment outcome analysis'
    }
  ];

  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setMentalHealthMetrics(prev => ({
        ...prev,
        resourceAccess: prev.resourceAccess + Math.floor(Math.random() * 5),
        activeTherapySessions: prev.activeTherapySessions + Math.floor(Math.random() * 3) - 1,
        averageRiskScore: Math.max(1, Math.min(10, prev.averageRiskScore + (Math.random() - 0.5) * 0.2))
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Brain className="h-6 w-6 text-purple-600" />
        <h1 className="text-2xl font-bold">Mental Health Module</h1>
      </div>

      {/* Mental Health Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{mentalHealthMetrics.totalScreenings}</div>
            <div className="text-sm text-gray-600">Total Screenings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{mentalHealthMetrics.activeTherapySessions}</div>
            <div className="text-sm text-gray-600">Active Sessions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{mentalHealthMetrics.crisisInterventions}</div>
            <div className="text-sm text-gray-600">Crisis Interventions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{mentalHealthMetrics.resourceAccess}</div>
            <div className="text-sm text-gray-600">Resource Access</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-indigo-600">{mentalHealthMetrics.supportGroupParticipants}</div>
            <div className="text-sm text-gray-600">Group Participants</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{mentalHealthMetrics.riskAlerts}</div>
            <div className="text-sm text-gray-600">Risk Alerts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-cyan-600">{mentalHealthMetrics.completedAssessments}</div>
            <div className="text-sm text-gray-600">Completed Assessments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{mentalHealthMetrics.averageRiskScore.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Avg Risk Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Crisis Alert Banner */}
      {mentalHealthMetrics.riskAlerts > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Crisis Alert Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-700">
                <Shield className="h-4 w-4" />
                <span>{mentalHealthMetrics.riskAlerts} high-risk patients require immediate attention</span>
              </div>
              <div className="flex items-center gap-2 text-red-700">
                <Heart className="h-4 w-4" />
                <span>Crisis intervention protocols are active and monitoring</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mental Health Feature Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          {mentalHealthTabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {mentalHealthTabs.map((tab) => {
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
