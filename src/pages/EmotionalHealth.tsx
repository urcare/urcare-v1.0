
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Brain, Target, AlertTriangle, Users, MessageCircle } from 'lucide-react';
import { MoodTracker } from '@/components/emotional-health/MoodTracker';
import { AIInsightsDashboard } from '@/components/emotional-health/AIInsightsDashboard';
import { HabitPlanGenerator } from '@/components/emotional-health/HabitPlanGenerator';
import { EmotionalPatternAlerts } from '@/components/emotional-health/EmotionalPatternAlerts';
import { BuddyMatching } from '@/components/emotional-health/BuddyMatching';
import { CrisisDetector } from '@/components/emotional-health/CrisisDetector';
import { MoodEntry, EmotionalPattern, MicroHabit, BuddyProfile, CrisisAlert } from '@/types/emotionalHealth';

const EmotionalHealth = () => {
  const [activeTab, setActiveTab] = useState('tracker');
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [patterns, setPatterns] = useState<EmotionalPattern[]>([]);
  const [habits, setHabits] = useState<MicroHabit[]>([]);
  const [buddies, setBuddies] = useState<BuddyProfile[]>([]);
  const [crisisAlerts, setCrisisAlerts] = useState<CrisisAlert[]>([]);

  // Sample data
  const samplePatterns: EmotionalPattern[] = [
    {
      id: '1',
      type: 'weekly_low',
      description: 'Mood tends to drop on Sunday evenings',
      frequency: 'weekly',
      severity: 'moderate',
      triggers: ['work anxiety', 'weekend ending'],
      suggestions: ['Sunday self-care routine', 'Prepare for Monday night before'],
      detectedAt: new Date(2024, 4, 20)
    },
    {
      id: '2',
      type: 'stress_spike',
      description: 'Stress levels increase during 2-4 PM',
      frequency: 'daily',
      severity: 'mild',
      triggers: ['afternoon fatigue', 'work deadlines'],
      suggestions: ['Take 10-minute break', 'Try breathing exercises'],
      detectedAt: new Date(2024, 4, 18)
    }
  ];

  const sampleBuddies: BuddyProfile[] = [
    {
      id: '1',
      name: 'Alex M.',
      avatar: '🌟',
      moodCompatibility: 85,
      interests: ['meditation', 'walking', 'reading'],
      timezone: 'EST',
      isOnline: true,
      lastActive: new Date(),
      supportStyle: 'encouraging'
    },
    {
      id: '2',
      name: 'Jordan K.',
      avatar: '🌈',
      moodCompatibility: 78,
      interests: ['yoga', 'music', 'cooking'],
      timezone: 'PST',
      isOnline: false,
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      supportStyle: 'listening'
    }
  ];

  const handleMoodSubmit = (mood: MoodEntry) => {
    setMoodEntries(prev => [mood, ...prev]);
    // Simulate AI pattern detection
    if (mood.intensity <= 3) {
      const newAlert: CrisisAlert = {
        id: `alert_${Date.now()}`,
        severity: mood.intensity <= 2 ? 'high' : 'medium',
        message: mood.intensity <= 2 ? 'Consistently low mood detected. Consider reaching out for support.' : 'Lower mood pattern noticed.',
        triggeredAt: new Date(),
        isActive: true,
        recommendedActions: [
          'Contact your support person',
          'Practice grounding techniques',
          'Consider professional help if this continues'
        ]
      };
      setCrisisAlerts(prev => [newAlert, ...prev]);
    }
  };

  const handleGenerateHabits = (newHabits: MicroHabit[]) => {
    setHabits(prev => [...prev, ...newHabits]);
  };

  const handlePatternUpdate = (newPatterns: EmotionalPattern[]) => {
    setPatterns(newPatterns);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              Emotional Health Tracker
            </CardTitle>
            <CardDescription>
              Track your emotional wellbeing with AI-powered insights and personalized support
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="tracker" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Mood</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">AI Insights</span>
            </TabsTrigger>
            <TabsTrigger value="habits" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Habits</span>
            </TabsTrigger>
            <TabsTrigger value="patterns" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Patterns</span>
            </TabsTrigger>
            <TabsTrigger value="buddies" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Buddies</span>
            </TabsTrigger>
            <TabsTrigger value="crisis" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Crisis</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracker" className="space-y-6">
            <MoodTracker onMoodSubmit={handleMoodSubmit} recentEntries={moodEntries.slice(0, 7)} />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <AIInsightsDashboard moodEntries={moodEntries} patterns={samplePatterns} />
          </TabsContent>

          <TabsContent value="habits" className="space-y-6">
            <HabitPlanGenerator 
              currentMoodTrend={moodEntries.length > 0 ? moodEntries[0].mood : 'neutral'}
              onHabitsGenerated={handleGenerateHabits}
              existingHabits={habits}
            />
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            <EmotionalPatternAlerts 
              patterns={samplePatterns}
              recentMoods={moodEntries}
              onPatternUpdate={handlePatternUpdate}
            />
          </TabsContent>

          <TabsContent value="buddies" className="space-y-6">
            <BuddyMatching 
              currentMood={moodEntries.length > 0 ? moodEntries[0].mood : 'neutral'}
              availableBuddies={sampleBuddies}
            />
          </TabsContent>

          <TabsContent value="crisis" className="space-y-6">
            <CrisisDetector 
              recentMoods={moodEntries}
              alerts={crisisAlerts}
              onAlertUpdate={setCrisisAlerts}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EmotionalHealth;
