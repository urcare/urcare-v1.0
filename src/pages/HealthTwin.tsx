
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Search, AlertTriangle, Activity, Settings, Calendar } from 'lucide-react';
import { AvatarCreator } from '@/components/health-twin/AvatarCreator';
import { SymptomChecker } from '@/components/health-twin/SymptomChecker';
import { RiskEngineDashboard } from '@/components/health-twin/RiskEngineDashboard';
import { DailyHealthScore } from '@/components/health-twin/DailyHealthScore';
import { EmergencyTriggerSettings } from '@/components/health-twin/EmergencyTriggerSettings';
import { HealthProgressTimeline } from '@/components/health-twin/HealthProgressTimeline';
import { 
  HealthAvatar, 
  Symptom, 
  RiskFactor, 
  HealthScore, 
  EmergencyTrigger, 
  HealthMilestone, 
  HealthTimelineEvent,
  VitalSigns 
} from '@/types/healthTwin';

const HealthTwin = () => {
  const [activeTab, setActiveTab] = useState('avatar');
  const [avatar, setAvatar] = useState<HealthAvatar | null>(null);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([
    {
      id: '1',
      name: 'Sedentary Lifestyle',
      category: 'lifestyle',
      level: 'high',
      score: 75,
      description: 'Limited physical activity increases cardiovascular and metabolic risks',
      recommendations: [
        'Aim for 150 minutes of moderate exercise per week',
        'Take breaks from sitting every hour',
        'Use stairs instead of elevators when possible'
      ]
    },
    {
      id: '2',
      name: 'Family History of Diabetes',
      category: 'genetic',
      level: 'moderate',
      score: 60,
      description: 'Genetic predisposition to type 2 diabetes based on family history',
      recommendations: [
        'Monitor blood sugar levels regularly',
        'Maintain a healthy diet low in processed sugars',
        'Schedule annual diabetes screenings'
      ]
    }
  ]);
  
  const [healthScore, setHealthScore] = useState<HealthScore>({
    overall: 72,
    cardiovascular: 68,
    mental: 85,
    nutrition: 75,
    fitness: 60,
    sleep: 80,
    lastUpdated: new Date(),
    trend: 'improving'
  });

  const [emergencyTriggers, setEmergencyTriggers] = useState<EmergencyTrigger[]>([]);
  
  const [milestones, setMilestones] = useState<HealthMilestone[]>([
    {
      id: '1',
      title: 'Run 5K Without Stopping',
      description: 'Complete a 5 kilometer run without taking walking breaks',
      category: 'fitness',
      targetDate: new Date(2024, 11, 31),
      progress: 65,
      isCompleted: false
    },
    {
      id: '2',
      title: 'Reduce BMI to Normal Range',
      description: 'Achieve a BMI between 18.5 and 24.9',
      category: 'fitness',
      targetDate: new Date(2024, 8, 15),
      progress: 45,
      isCompleted: false
    },
    {
      id: '3',
      title: 'Complete Annual Physical',
      description: 'Schedule and complete comprehensive annual health checkup',
      category: 'medical',
      targetDate: new Date(2024, 5, 30),
      completedDate: new Date(2024, 5, 15),
      progress: 100,
      isCompleted: true
    }
  ]);

  const [timelineEvents, setTimelineEvents] = useState<HealthTimelineEvent[]>([
    {
      id: '1',
      date: new Date(2024, 4, 15),
      type: 'milestone',
      title: 'Completed Annual Physical',
      description: 'Successfully completed comprehensive health checkup with Dr. Smith',
      category: 'medical'
    },
    {
      id: '2',
      date: new Date(2024, 4, 10),
      type: 'vitals',
      title: 'Blood Pressure Check',
      description: 'BP: 125/82 mmHg - slightly elevated, monitoring recommended',
      severity: 'medium',
      category: 'cardiovascular'
    },
    {
      id: '3',
      date: new Date(2024, 4, 5),
      type: 'symptom',
      title: 'Headache Episode',
      description: 'Tension headache lasting 4 hours, resolved with rest and hydration',
      severity: 'low',
      category: 'neurological'
    }
  ]);

  const currentVitals: VitalSigns = {
    heartRate: 72,
    bloodPressure: { systolic: 125, diastolic: 82 },
    temperature: 36.8,
    oxygenSaturation: 98,
    respiratoryRate: 16,
    timestamp: new Date()
  };

  const handleSaveAvatar = (newAvatar: HealthAvatar) => {
    setAvatar(newAvatar);
    // Add timeline event
    const event: HealthTimelineEvent = {
      id: `event_${Date.now()}`,
      date: new Date(),
      type: 'milestone',
      title: 'Avatar Created',
      description: `Created health avatar: ${newAvatar.name}`,
      category: 'setup'
    };
    setTimelineEvents(prev => [event, ...prev]);
  };

  const handleAddSymptom = (symptom: Symptom) => {
    setSymptoms(prev => [...prev, symptom]);
    // Add timeline event
    const event: HealthTimelineEvent = {
      id: `event_${Date.now()}`,
      date: new Date(),
      type: 'symptom',
      title: `New Symptom: ${symptom.name}`,
      description: `${symptom.name} in ${symptom.bodyPart} - ${symptom.severity}/5 severity`,
      severity: symptom.severity >= 4 ? 'high' : symptom.severity >= 3 ? 'medium' : 'low',
      category: 'symptoms'
    };
    setTimelineEvents(prev => [event, ...prev]);
  };

  const handleAnalyzeSymptoms = (symptomsToAnalyze: Symptom[]) => {
    // This would typically call an AI service for analysis
    console.log('Analyzing symptoms:', symptomsToAnalyze);
    // Add timeline event
    const event: HealthTimelineEvent = {
      id: `event_${Date.now()}`,
      date: new Date(),
      type: 'milestone',
      title: 'AI Symptom Analysis',
      description: `Analyzed ${symptomsToAnalyze.length} symptoms using AI`,
      category: 'analysis'
    };
    setTimelineEvents(prev => [event, ...prev]);
  };

  const handleUpdateRisk = (riskId: string, updates: Partial<RiskFactor>) => {
    setRiskFactors(prev => prev.map(risk => 
      risk.id === riskId ? { ...risk, ...updates } : risk
    ));
  };

  const handleRefreshHealthScore = () => {
    // Simulate score refresh
    setHealthScore(prev => ({
      ...prev,
      lastUpdated: new Date(),
      overall: Math.max(0, Math.min(100, prev.overall + (Math.random() - 0.5) * 10))
    }));
  };

  const handleAddTrigger = (trigger: EmergencyTrigger) => {
    setEmergencyTriggers(prev => [...prev, trigger]);
  };

  const handleUpdateTrigger = (triggerId: string, updates: Partial<EmergencyTrigger>) => {
    setEmergencyTriggers(prev => prev.map(trigger => 
      trigger.id === triggerId ? { ...trigger, ...updates } : trigger
    ));
  };

  const handleDeleteTrigger = (triggerId: string) => {
    setEmergencyTriggers(prev => prev.filter(trigger => trigger.id !== triggerId));
  };

  const handleUpdateMilestone = (milestoneId: string, updates: Partial<HealthMilestone>) => {
    setMilestones(prev => prev.map(milestone => 
      milestone.id === milestoneId ? { ...milestone, ...updates } : milestone
    ));
    
    // Add timeline event if milestone completed
    if (updates.isCompleted) {
      const milestone = milestones.find(m => m.id === milestoneId);
      if (milestone) {
        const event: HealthTimelineEvent = {
          id: `event_${Date.now()}`,
          date: new Date(),
          type: 'milestone',
          title: `Milestone Completed: ${milestone.title}`,
          description: milestone.description,
          category: milestone.category
        };
        setTimelineEvents(prev => [event, ...prev]);
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6" />
              AI Health Twin System
            </CardTitle>
            <CardDescription>
              Your comprehensive digital health companion powered by artificial intelligence
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="avatar" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Avatar</span>
            </TabsTrigger>
            <TabsTrigger value="symptoms" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Symptoms</span>
            </TabsTrigger>
            <TabsTrigger value="risks" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Risks</span>
            </TabsTrigger>
            <TabsTrigger value="score" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Health Score</span>
            </TabsTrigger>
            <TabsTrigger value="emergency" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Emergency</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Timeline</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="avatar" className="space-y-6">
            <AvatarCreator onSave={handleSaveAvatar} initialAvatar={avatar || undefined} />
          </TabsContent>

          <TabsContent value="symptoms" className="space-y-6">
            <SymptomChecker onSymptomAdd={handleAddSymptom} onAnalyze={handleAnalyzeSymptoms} />
          </TabsContent>

          <TabsContent value="risks" className="space-y-6">
            <RiskEngineDashboard riskFactors={riskFactors} onUpdateRisk={handleUpdateRisk} />
          </TabsContent>

          <TabsContent value="score" className="space-y-6">
            <DailyHealthScore healthScore={healthScore} onRefresh={handleRefreshHealthScore} />
          </TabsContent>

          <TabsContent value="emergency" className="space-y-6">
            <EmergencyTriggerSettings 
              triggers={emergencyTriggers}
              onAddTrigger={handleAddTrigger}
              onUpdateTrigger={handleUpdateTrigger}
              onDeleteTrigger={handleDeleteTrigger}
              currentVitals={currentVitals}
            />
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <HealthProgressTimeline 
              milestones={milestones}
              timelineEvents={timelineEvents}
              onUpdateMilestone={handleUpdateMilestone}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default HealthTwin;
