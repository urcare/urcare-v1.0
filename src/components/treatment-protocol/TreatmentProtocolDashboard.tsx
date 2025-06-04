
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChronicCareProtocolInterface } from './ChronicCareProtocolInterface';
import { AIDocumentationAssistant } from './AIDocumentationAssistant';
import { DischargeSummaryGenerator } from './DischargeSummaryGenerator';
import { InvestigationPlanningTool } from './InvestigationPlanningTool';
import { MentalHealthScoringInterface } from './MentalHealthScoringInterface';
import { RedundantTestDetector } from './RedundantTestDetector';
import { 
  Heart, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  UserCheck,
  Search,
  ClipboardList,
  Brain,
  ShieldCheck
} from 'lucide-react';

export const TreatmentProtocolDashboard = () => {
  const [activeTab, setActiveTab] = useState('chronic-care');

  const treatmentStats = [
    { label: 'Active Protocols', value: '234', icon: Heart, color: 'blue' },
    { label: 'AI Documentation', value: '89', icon: FileText, color: 'green' },
    { label: 'Discharge Plans', value: '67', icon: UserCheck, color: 'purple' },
    { label: 'Quality Score', value: '96.2%', icon: TrendingUp, color: 'orange' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Treatment Protocol AI</h1>
                <p className="text-sm text-gray-600">Comprehensive care management with intelligent protocol guidance</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {treatmentStats.map((stat, index) => (
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
            <TabsTrigger value="chronic-care" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Chronic Care</span>
            </TabsTrigger>
            <TabsTrigger value="documentation" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Documentation</span>
            </TabsTrigger>
            <TabsTrigger value="discharge" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Discharge</span>
            </TabsTrigger>
            <TabsTrigger value="investigation" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Investigation</span>
            </TabsTrigger>
            <TabsTrigger value="mental-health" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Mental Health</span>
            </TabsTrigger>
            <TabsTrigger value="test-detector" className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Test Detector</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chronic-care" className="space-y-6">
            <ChronicCareProtocolInterface />
          </TabsContent>

          <TabsContent value="documentation" className="space-y-6">
            <AIDocumentationAssistant />
          </TabsContent>

          <TabsContent value="discharge" className="space-y-6">
            <DischargeSummaryGenerator />
          </TabsContent>

          <TabsContent value="investigation" className="space-y-6">
            <InvestigationPlanningTool />
          </TabsContent>

          <TabsContent value="mental-health" className="space-y-6">
            <MentalHealthScoringInterface />
          </TabsContent>

          <TabsContent value="test-detector" className="space-y-6">
            <RedundantTestDetector />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
