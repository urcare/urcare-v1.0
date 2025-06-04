
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AITriageDashboard } from './AITriageDashboard';
import { ICUDeteriorationMonitor } from './ICUDeteriorationMonitor';
import { ReadmissionRiskPanel } from './ReadmissionRiskPanel';
import { EmergencyEscalationDashboard } from './EmergencyEscalationDashboard';
import { ElderlyFallRiskInterface } from './ElderlyFallRiskInterface';
import { SepsisDetectionSystem } from './SepsisDetectionSystem';
import { 
  Brain, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Zap,
  Shield,
  Heart
} from 'lucide-react';

export const PredictiveClinicalAIDashboard = () => {
  const [activeTab, setActiveTab] = useState('triage');

  const aiStats = [
    { label: 'AI Predictions Today', value: '156', icon: Brain, color: 'blue' },
    { label: 'High Risk Alerts', value: '8', icon: AlertTriangle, color: 'red' },
    { label: 'Accuracy Rate', value: '94.2%', icon: TrendingUp, color: 'green' },
    { label: 'Active Monitoring', value: '42', icon: Activity, color: 'purple' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Predictive Clinical AI</h1>
                <p className="text-sm text-gray-600">Advanced patient risk assessment and early warning systems</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {aiStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 w-full mb-6">
            <TabsTrigger value="triage" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">AI Triage</span>
            </TabsTrigger>
            <TabsTrigger value="icu" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">ICU Monitor</span>
            </TabsTrigger>
            <TabsTrigger value="readmission" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Readmission</span>
            </TabsTrigger>
            <TabsTrigger value="escalation" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Escalation</span>
            </TabsTrigger>
            <TabsTrigger value="falls" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Fall Risk</span>
            </TabsTrigger>
            <TabsTrigger value="sepsis" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Sepsis</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="triage" className="space-y-6">
            <AITriageDashboard />
          </TabsContent>

          <TabsContent value="icu" className="space-y-6">
            <ICUDeteriorationMonitor />
          </TabsContent>

          <TabsContent value="readmission" className="space-y-6">
            <ReadmissionRiskPanel />
          </TabsContent>

          <TabsContent value="escalation" className="space-y-6">
            <EmergencyEscalationDashboard />
          </TabsContent>

          <TabsContent value="falls" className="space-y-6">
            <ElderlyFallRiskInterface />
          </TabsContent>

          <TabsContent value="sepsis" className="space-y-6">
            <SepsisDetectionSystem />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
