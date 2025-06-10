
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TreatmentProtocolInterface } from './TreatmentProtocolInterface';
import { ChemotherapyManagement } from './ChemotherapyManagement';
import { TumorBoardCollaboration } from './TumorBoardCollaboration';
import { SurvivorshipCarePlanning } from './SurvivorshipCarePlanning';
import { ClinicalTrialMatching } from './ClinicalTrialMatching';
import { OncologyQualityMetrics } from './OncologyQualityMetrics';
import { 
  Activity,
  Pill,
  Users,
  Heart,
  Search,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  Shield,
  Stethoscope
} from 'lucide-react';

export const OncologyCareDashboard = () => {
  const [activeTab, setActiveTab] = useState('protocols');
  const [oncologyMetrics, setOncologyMetrics] = useState({
    activePatients: 1247,
    activeTreatments: 384,
    tumorBoardCases: 56,
    survivorshipPlans: 892,
    clinicalTrials: 23,
    qualityScore: 94.2,
    criticalAlerts: 8,
    treatmentCompletionRate: 87.5
  });

  const oncologyTabs = [
    {
      id: 'protocols',
      title: 'Treatment Protocols',
      icon: Activity,
      component: TreatmentProtocolInterface,
      description: 'Evidence-based guidelines, personalized treatment planning, and multidisciplinary coordination'
    },
    {
      id: 'chemotherapy',
      title: 'Chemotherapy Management',
      icon: Pill,
      component: ChemotherapyManagement,
      description: 'Scheduling optimization, administration tracking, and side effect monitoring'
    },
    {
      id: 'tumorboard',
      title: 'Tumor Board',
      icon: Users,
      component: TumorBoardCollaboration,
      description: 'Case presentations, decision documentation, and multidisciplinary communication'
    },
    {
      id: 'survivorship',
      title: 'Survivorship Care',
      icon: Heart,
      component: SurvivorshipCarePlanning,
      description: 'Follow-up scheduling, late effect monitoring, and wellness program integration'
    },
    {
      id: 'trials',
      title: 'Clinical Trials',
      icon: Search,
      component: ClinicalTrialMatching,
      description: 'Eligibility screening, enrollment management, and patient communication'
    },
    {
      id: 'metrics',
      title: 'Quality Metrics',
      icon: BarChart3,
      component: OncologyQualityMetrics,
      description: 'Outcome tracking, benchmark comparisons, and quality improvement analytics'
    }
  ];

  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setOncologyMetrics(prev => ({
        ...prev,
        activePatients: prev.activePatients + Math.floor(Math.random() * 3) - 1,
        activeTreatments: prev.activeTreatments + Math.floor(Math.random() * 2),
        criticalAlerts: Math.max(0, prev.criticalAlerts + Math.floor(Math.random() * 2) - 1)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Stethoscope className="h-6 w-6 text-pink-600" />
        <h1 className="text-2xl font-bold">Oncology Care Module</h1>
      </div>

      {/* Oncology Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-pink-600">{oncologyMetrics.activePatients}</div>
            <div className="text-sm text-gray-600">Active Patients</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{oncologyMetrics.activeTreatments}</div>
            <div className="text-sm text-gray-600">Active Treatments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{oncologyMetrics.tumorBoardCases}</div>
            <div className="text-sm text-gray-600">Tumor Board Cases</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{oncologyMetrics.survivorshipPlans}</div>
            <div className="text-sm text-gray-600">Survivorship Plans</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{oncologyMetrics.clinicalTrials}</div>
            <div className="text-sm text-gray-600">Clinical Trials</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-cyan-600">{oncologyMetrics.qualityScore}%</div>
            <div className="text-sm text-gray-600">Quality Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{oncologyMetrics.criticalAlerts}</div>
            <div className="text-sm text-gray-600">Critical Alerts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-indigo-600">{oncologyMetrics.treatmentCompletionRate}%</div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alert Banner */}
      {oncologyMetrics.criticalAlerts > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Oncology Critical Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-700">
                <Shield className="h-4 w-4" />
                <span>{oncologyMetrics.criticalAlerts} patients require immediate oncology attention</span>
              </div>
              <div className="flex items-center gap-2 text-red-700">
                <TrendingUp className="h-4 w-4" />
                <span>Treatment protocols activated and oncology team notified</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Oncology Care Feature Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          {oncologyTabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {oncologyTabs.map((tab) => {
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
