
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MicroHabit, MoodType } from '@/types/emotionalHealth';
import { Target, Clock, Zap, CheckCircle } from 'lucide-react';

interface HabitPlanGeneratorProps {
  currentMoodTrend: MoodType;
  onHabitsGenerated: (habits: MicroHabit[]) => void;
  existingHabits: MicroHabit[];
}

const habitTemplates: Record<MoodType, MicroHabit[]> = {
  very_sad: [
    {
      id: 'habit_1',
      title: '5-Minute Gentle Stretch',
      description: 'Simple stretches to release tension and boost mood',
      category: 'movement',
      duration: 5,
      difficulty: 'easy',
      moodBoost: 3,
      isCompleted: false,
      streak: 0
    },
    {
      id: 'habit_2',
      title: 'Write One Gratitude',
      description: 'Write down one thing you\'re grateful for today',
      category: 'mindfulness',
      duration: 2,
      difficulty: 'easy',
      moodBoost: 4,
      isCompleted: false,
      streak: 0
    }
  ],
  sad: [
    {
      id: 'habit_3',
      title: 'Text a Friend',
      description: 'Send a quick message to someone you care about',
      category: 'social',
      duration: 3,
      difficulty: 'easy',
      moodBoost: 5,
      isCompleted: false,
      streak: 0
    },
    {
      id: 'habit_4',
      title: 'Listen to Upbeat Music',
      description: 'Play your favorite energizing song',
      category: 'creativity',
      duration: 4,
      difficulty: 'easy',
      moodBoost: 4,
      isCompleted: false,
      streak: 0
    }
  ],
  neutral: [
    {
      id: 'habit_5',
      title: '10-Minute Walk',
      description: 'Take a short walk outside or around your space',
      category: 'movement',
      duration: 10,
      difficulty: 'easy',
      moodBoost: 5,
      isCompleted: false,
      streak: 0
    },
    {
      id: 'habit_6',
      title: 'Deep Breathing',
      description: '4-7-8 breathing technique for relaxation',
      category: 'mindfulness',
      duration: 5,
      difficulty: 'easy',
      moodBoost: 4,
      isCompleted: false,
      streak: 0
    }
  ],
  anxious: [
    {
      id: 'habit_7',
      title: 'Grounding Exercise',
      description: '5-4-3-2-1 sensory grounding technique',
      category: 'mindfulness',
      duration: 3,
      difficulty: 'easy',
      moodBoost: 6,
      isCompleted: false,
      streak: 0
    },
    {
      id: 'habit_8',
      title: 'Organize Small Space',
      description: 'Tidy your desk or one drawer for a sense of control',
      category: 'self_care',
      duration: 10,
      difficulty: 'easy',
      moodBoost: 3,
      isCompleted: false,
      streak: 0
    }
  ],
  stressed: [
    {
      id: 'habit_9',
      title: 'Progressive Muscle Relaxation',
      description: 'Tense and release muscle groups to reduce stress',
      category: 'mindfulness',
      duration: 8,
      difficulty: 'medium',
      moodBoost: 7,
      isCompleted: false,
      streak: 0
    },
    {
      id: 'habit_10',
      title: 'Make Herbal Tea',
      description: 'Prepare and mindfully drink calming tea',
      category: 'self_care',
      duration: 10,
      difficulty: 'easy',
      moodBoost: 4,
      isCompleted: false,
      streak: 0
    }
  ],
  happy: [
    {
      id: 'habit_11',
      title: 'Share Good News',
      description: 'Tell someone about something positive in your day',
      category: 'social',
      duration: 5,
      difficulty: 'easy',
      moodBoost: 3,
      isCompleted: false,
      streak: 0
    },
    {
      id: 'habit_12',
      title: 'Creative Expression',
      description: 'Draw, write, or create something for 10 minutes',
      category: 'creativity',
      duration: 10,
      difficulty: 'medium',
      moodBoost: 4,
      isCompleted: false,
      streak: 0
    }
  ],
  very_happy: [
    {
      id: 'habit_13',
      title: 'Help Someone',
      description: 'Do a small favor or kind gesture for someone',
      category: 'social',
      duration: 15,
      difficulty: 'medium',
      moodBoost: 2,
      isCompleted: false,
      streak: 0
    },
    {
      id: 'habit_14',
      title: 'Plan Future Joy',
      description: 'Schedule something fun for later this week',
      category: 'self_care',
      duration: 5,
      difficulty: 'easy',
      moodBoost: 3,
      isCompleted: false,
      streak: 0
    }
  ],
  excited: [
    {
      id: 'habit_15',
      title: 'Channel Energy',
      description: 'Do jumping jacks or dance for 5 minutes',
      category: 'movement',
      duration: 5,
      difficulty: 'easy',
      moodBoost: 2,
      isCompleted: false,
      streak: 0
    }
  ],
  calm: [
    {
      id: 'habit_16',
      title: 'Maintain Peace',
      description: 'Practice mindful breathing to maintain calm state',
      category: 'mindfulness',
      duration: 5,
      difficulty: 'easy',
      moodBoost: 2,
      isCompleted: false,
      streak: 0
    }
  ],
  angry: [
    {
      id: 'habit_17',
      title: 'Physical Release',
      description: 'Do intense exercise or punch a pillow',
      category: 'movement',
      duration: 10,
      difficulty: 'medium',
      moodBoost: 6,
      isCompleted: false,
      streak: 0
    }
  ]
};

export function HabitPlanGenerator({ currentMoodTrend, onHabitsGenerated, existingHabits }: HabitPlanGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateHabits = () => {
    setIsGenerating(true);
    
    // Simulate AI generation delay
    setTimeout(() => {
      const templates = habitTemplates[currentMoodTrend] || habitTemplates.neutral;
      const newHabits = templates.map(template => ({
        ...template,
        id: `${template.id}_${Date.now()}`,
      }));
      
      onHabitsGenerated(newHabits);
      setIsGenerating(false);
    }, 1500);
  };

  const toggleHabitCompletion = (habitId: string) => {
    // This would typically update the habit in the parent component
    console.log('Toggle habit completion:', habitId);
  };

  const getCategoryIcon = (category: MicroHabit['category']) => {
    switch (category) {
      case 'mindfulness': return '🧘‍♀️';
      case 'movement': return '🏃‍♀️';
      case 'social': return '👥';
      case 'creativity': return '🎨';
      case 'self_care': return '💆‍♀️';
      default: return '✨';
    }
  };

  const getDifficultyColor = (difficulty: MicroHabit['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            AI Micro-Habit Generator
          </CardTitle>
          <CardDescription>
            Personalized micro-habits based on your current mood: {currentMoodTrend.replace('_', ' ')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <Button 
              onClick={generateHabits} 
              disabled={isGenerating}
              className="mb-4"
            >
              {isGenerating ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-spin" />
                  Generating Habits...
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  Generate Personalized Habits
                </>
              )}
            </Button>
            <p className="text-sm text-gray-600">
              AI will create micro-habits tailored to your current emotional state
            </p>
          </div>
        </CardContent>
      </Card>

      {existingHabits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Micro-Habits</CardTitle>
            <CardDescription>
              Complete these small actions to boost your mood
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {existingHabits.map((habit) => (
                <div
                  key={habit.id}
                  className={`p-4 border rounded-lg transition-all ${
                    habit.isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getCategoryIcon(habit.category)}</span>
                        <h4 className={`font-semibold ${habit.isCompleted ? 'line-through text-gray-500' : ''}`}>
                          {habit.title}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{habit.description}</p>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {habit.duration}m
                        </Badge>
                        <Badge className={`text-xs ${getDifficultyColor(habit.difficulty)}`}>
                          {habit.difficulty}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          +{habit.moodBoost} mood
                        </Badge>
                        {habit.streak > 0 && (
                          <Badge variant="outline" className="text-xs">
                            🔥 {habit.streak} day streak
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant={habit.isCompleted ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleHabitCompletion(habit.id)}
                      className="ml-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Habit Categories</CardTitle>
          <CardDescription>
            Understanding the types of micro-habits we recommend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-1">🧘‍♀️</div>
              <div className="font-medium text-sm">Mindfulness</div>
              <div className="text-xs text-gray-600">Breathing, meditation</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl mb-1">🏃‍♀️</div>
              <div className="font-medium text-sm">Movement</div>
              <div className="text-xs text-gray-600">Exercise, stretching</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl mb-1">👥</div>
              <div className="font-medium text-sm">Social</div>
              <div className="text-xs text-gray-600">Connection, sharing</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl mb-1">🎨</div>
              <div className="font-medium text-sm">Creativity</div>
              <div className="text-xs text-gray-600">Art, music, writing</div>
            </div>
            <div className="text-center p-3 bg-pink-50 rounded-lg">
              <div className="text-2xl mb-1">💆‍♀️</div>
              <div className="font-medium text-sm">Self-Care</div>
              <div className="text-xs text-gray-600">Rest, comfort, care</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
