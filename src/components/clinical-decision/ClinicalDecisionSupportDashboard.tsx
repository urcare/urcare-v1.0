
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PrescriptionSuggestionInterface } from './PrescriptionSuggestionInterface';
import { AutomatedCodingSystem } from './AutomatedCodingSystem';
import { DiagnosticTestRecommender } from './DiagnosticTestRecommender';
import { TreatmentPathwayGenerator } from './TreatmentPathwayGenerator';
import { AntibioticStewardshipDashboard } from './AntibioticStewardshipDashboard';
import { MissedDiagnosisAlertSystem } from './MissedDiagnosisAlertSystem';
import { 
  Brain, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Pill, 
  FileText,
  TestTube,
  Route,
  Shield,
  Stethoscope
} from 'lucide-react';

export const ClinicalDecisionSupportDashboard = () => {
  const [activeTab, setActiveTab] = useState('prescriptions');

  const clinicalStats = [
    { label: 'AI Recommendations Today', value: '342', icon: Brain, color: 'blue' },
    { label: 'Drug Interactions Prevented', value: '23', icon: AlertTriangle, color: 'red' },
    { label: 'Coding Accuracy', value: '97.2%', icon: TrendingUp, color: 'green' },
    { label: 'Active Protocols', value: '156', icon: Activity, color: 'purple' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Clinical Decision Support AI</h1>
                <p className="text-sm text-gray-600">Intelligent treatment guidance with evidence-based recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {clinicalStats.map((stat, index) => (
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
            <TabsTrigger value="prescriptions" className="flex items-center gap-2">
              <Pill className="w-4 h-4" />
              <span className="hidden sm:inline">Prescriptions</span>
            </TabsTrigger>
            <TabsTrigger value="coding" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Coding</span>
            </TabsTrigger>
            <TabsTrigger value="tests" className="flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              <span className="hidden sm:inline">Tests</span>
            </TabsTrigger>
            <TabsTrigger value="pathways" className="flex items-center gap-2">
              <Route className="w-4 h-4" />
              <span className="hidden sm:inline">Pathways</span>
            </TabsTrigger>
            <TabsTrigger value="antibiotics" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Antibiotics</span>
            </TabsTrigger>
            <TabsTrigger value="diagnosis" className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              <span className="hidden sm:inline">Diagnosis</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prescriptions" className="space-y-6">
            <PrescriptionSuggestionInterface />
          </TabsContent>

          <TabsContent value="coding" className="space-y-6">
            <AutomatedCodingSystem />
          </TabsContent>

          <TabsContent value="tests" className="space-y-6">
            <DiagnosticTestRecommender />
          </TabsContent>

          <TabsContent value="pathways" className="space-y-6">
            <TreatmentPathwayGenerator />
          </TabsContent>

          <TabsContent value="antibiotics" className="space-y-6">
            <AntibioticStewardshipDashboard />
          </TabsContent>

          <TabsContent value="diagnosis" className="space-y-6">
            <MissedDiagnosisAlertSystem />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
