
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MedicalImagingInterface } from './MedicalImagingInterface';
import { ECGInterpretationDashboard } from './ECGInterpretationDashboard';
import { RadiologyAIInterface } from './RadiologyAIInterface';
import { PathologyAIVisualization } from './PathologyAIVisualization';
import { DrugDiscoveryInterface } from './DrugDiscoveryInterface';
import { GenomicsAnalysisDashboard } from './GenomicsAnalysisDashboard';
import { 
  Brain,
  Activity,
  Scan,
  Microscope,
  FlaskConical,
  Dna,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

export const AdvancedAIDiagnosticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('imaging');
  const [diagnosticMetrics, setDiagnosticMetrics] = useState({
    totalAnalyses: 24856,
    aiAccuracy: 94.7,
    processingTime: 1.2,
    criticalAlerts: 18,
    pendingReviews: 127,
    completedToday: 342
  });

  const diagnosticTabs = [
    {
      id: 'imaging',
      title: 'Medical Imaging',
      icon: Brain,
      component: MedicalImagingInterface,
      description: 'AI-powered medical image analysis'
    },
    {
      id: 'ecg',
      title: 'ECG Analysis',
      icon: Activity,
      component: ECGInterpretationDashboard,
      description: 'Real-time ECG interpretation and monitoring'
    },
    {
      id: 'radiology',
      title: 'Radiology AI',
      icon: Scan,
      component: RadiologyAIInterface,
      description: 'Advanced radiology analysis and reporting'
    },
    {
      id: 'pathology',
      title: 'Pathology AI',
      icon: Microscope,
      component: PathologyAIVisualization,
      description: 'Digital pathology and tissue analysis'
    },
    {
      id: 'drug-discovery',
      title: 'Drug Discovery',
      icon: FlaskConical,
      component: DrugDiscoveryInterface,
      description: 'Molecular analysis and compound research'
    },
    {
      id: 'genomics',
      title: 'Genomics',
      icon: Dna,
      component: GenomicsAnalysisDashboard,
      description: 'Genetic analysis and personalized medicine'
    }
  ];

  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setDiagnosticMetrics(prev => ({
        ...prev,
        aiAccuracy: Math.min(100, prev.aiAccuracy + (Math.random() - 0.5) * 0.1),
        processingTime: Math.max(0.5, prev.processingTime + (Math.random() - 0.5) * 0.1),
        criticalAlerts: Math.max(0, prev.criticalAlerts + Math.floor(Math.random() * 3) - 1),
        completedToday: prev.completedToday + Math.floor(Math.random() * 5)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Brain className="h-6 w-6 text-purple-600" />
        <h1 className="text-2xl font-bold">Advanced AI Diagnostics</h1>
      </div>

      {/* AI Diagnostics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{diagnosticMetrics.totalAnalyses.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Analyses</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{diagnosticMetrics.aiAccuracy.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">AI Accuracy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{diagnosticMetrics.processingTime.toFixed(1)}s</div>
            <div className="text-sm text-gray-600">Avg Processing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{diagnosticMetrics.criticalAlerts}</div>
            <div className="text-sm text-gray-600">Critical Alerts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{diagnosticMetrics.pendingReviews}</div>
            <div className="text-sm text-gray-600">Pending Reviews</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-cyan-600">{diagnosticMetrics.completedToday}</div>
            <div className="text-sm text-gray-600">Completed Today</div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {diagnosticMetrics.criticalAlerts > 15 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Critical AI Diagnostic Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-4 w-4" />
                <span>High-priority findings requiring immediate physician review</span>
              </div>
              <div className="flex items-center gap-2 text-red-700">
                <Clock className="h-4 w-4" />
                <span>Multiple urgent cases pending radiologist confirmation</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Diagnostics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          {diagnosticTabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {diagnosticTabs.map((tab) => {
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
