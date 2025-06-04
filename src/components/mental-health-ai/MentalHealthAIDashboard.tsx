
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MentalHealthScreening } from './MentalHealthScreening';
import { MedicationAdherenceMonitor } from './MedicationAdherenceMonitor';
import { HealthScoreTracker } from './HealthScoreTracker';
import { StaffBurnoutAssessment } from './StaffBurnoutAssessment';
import { MoodPatternAnalyzer } from './MoodPatternAnalyzer';
import { CrisisInterventionSystem } from './CrisisInterventionSystem';
import { 
  Brain, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Heart,
  Pill,
  Shield
} from 'lucide-react';

export const MentalHealthAIDashboard = () => {
  const [activeTab, setActiveTab] = useState('screening');

  const mentalHealthStats = [
    { label: 'AI Assessments Today', value: '87', icon: Brain, color: 'purple' },
    { label: 'High Risk Alerts', value: '5', icon: AlertTriangle, color: 'red' },
    { label: 'Intervention Success', value: '92.8%', icon: TrendingUp, color: 'green' },
    { label: 'Active Monitoring', value: '156', icon: Activity, color: 'blue' }
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
                <h1 className="text-2xl font-bold text-gray-900">Mental Health AI</h1>
                <p className="text-sm text-gray-600">Advanced psychological wellness monitoring and intervention systems</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {mentalHealthStats.map((stat, index) => (
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
            <TabsTrigger value="screening" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Screening</span>
            </TabsTrigger>
            <TabsTrigger value="medication" className="flex items-center gap-2">
              <Pill className="w-4 h-4" />
              <span className="hidden sm:inline">Medication</span>
            </TabsTrigger>
            <TabsTrigger value="health-score" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Health Score</span>
            </TabsTrigger>
            <TabsTrigger value="burnout" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Burnout</span>
            </TabsTrigger>
            <TabsTrigger value="mood" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Mood</span>
            </TabsTrigger>
            <TabsTrigger value="crisis" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Crisis</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="screening" className="space-y-6">
            <MentalHealthScreening />
          </TabsContent>

          <TabsContent value="medication" className="space-y-6">
            <MedicationAdherenceMonitor />
          </TabsContent>

          <TabsContent value="health-score" className="space-y-6">
            <HealthScoreTracker />
          </TabsContent>

          <TabsContent value="burnout" className="space-y-6">
            <StaffBurnoutAssessment />
          </TabsContent>

          <TabsContent value="mood" className="space-y-6">
            <MoodPatternAnalyzer />
          </TabsContent>

          <TabsContent value="crisis" className="space-y-6">
            <CrisisInterventionSystem />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
