
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, ArrowRight, Target, Lightbulb, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface HabitSwap {
  id: string;
  oldHabit: string;
  newHabit: string;
  reason: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  progress: number;
  startDate: string;
  status: 'active' | 'completed' | 'paused';
  tips: string[];
}

interface SwapSuggestion {
  id: string;
  title: string;
  oldHabit: string;
  newHabit: string;
  benefit: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
}

export const HabitSwapLogic = () => {
  const [activeSwaps, setActiveSwaps] = useState<HabitSwap[]>([
    {
      id: '1',
      oldHabit: 'Checking phone first thing in morning',
      newHabit: 'Drinking a glass of water and stretching',
      reason: 'Better mental clarity and hydration',
      difficulty: 'medium',
      category: 'morning routine',
      progress: 65,
      startDate: '2024-01-15',
      status: 'active',
      tips: [
        'Keep water by your bedside',
        'Put phone in another room while sleeping',
        'Use a sunrise alarm clock'
      ]
    },
    {
      id: '2',
      oldHabit: 'Snacking on chips while watching TV',
      newHabit: 'Preparing cut vegetables or nuts',
      reason: 'Better nutrition and mindful eating',
      difficulty: 'easy',
      category: 'nutrition',
      progress: 85,
      startDate: '2024-01-10',
      status: 'active',
      tips: [
        'Prep healthy snacks on Sunday',
        'Remove unhealthy snacks from sight',
        'Use smaller bowls for portion control'
      ]
    }
  ]);

  const [suggestions] = useState<SwapSuggestion[]>([
    {
      id: '1',
      title: 'Mindful Scrolling',
      oldHabit: 'Endless social media scrolling',
      newHabit: '5-minute breathing exercise',
      benefit: 'Reduces anxiety and improves focus',
      difficulty: 'easy',
      estimatedTime: '5 minutes'
    },
    {
      id: '2',
      title: 'Active Commute',
      oldHabit: 'Taking elevator everywhere',
      newHabit: 'Taking stairs when possible',
      benefit: 'Increases daily activity and energy',
      difficulty: 'easy',
      estimatedTime: '2 minutes'
    },
    {
      id: '3',
      title: 'Sleep Optimization',
      oldHabit: 'Watching TV before bed',
      newHabit: 'Reading a book for 15 minutes',
      benefit: 'Better sleep quality and learning',
      difficulty: 'medium',
      estimatedTime: '15 minutes'
    }
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartSwap = (suggestion: SwapSuggestion) => {
    const newSwap: HabitSwap = {
      id: `swap_${Date.now()}`,
      oldHabit: suggestion.oldHabit,
      newHabit: suggestion.newHabit,
      reason: suggestion.benefit,
      difficulty: suggestion.difficulty,
      category: 'behavior change',
      progress: 0,
      startDate: new Date().toISOString().split('T')[0],
      status: 'active',
      tips: [
        'Start small and be consistent',
        'Track your progress daily',
        'Reward yourself for milestones'
      ]
    };

    setActiveSwaps(prev => [...prev, newSwap]);
    toast.success('Habit swap started! You can do this! 💪');
  };

  const updateProgress = (swapId: string, newProgress: number) => {
    setActiveSwaps(prev =>
      prev.map(swap =>
        swap.id === swapId
          ? { ...swap, progress: newProgress, status: newProgress >= 100 ? 'completed' : 'active' }
          : swap
      )
    );

    if (newProgress >= 100) {
      toast.success('🎉 Habit swap completed! Your new habit is now part of your routine!');
    }
  };

  const pauseSwap = (swapId: string) => {
    setActiveSwaps(prev =>
      prev.map(swap =>
        swap.id === swapId
          ? { ...swap, status: swap.status === 'paused' ? 'active' : 'paused' }
          : swap
      )
    );
    toast.success('Habit swap status updated');
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-green-600" />
            Habit Swap Logic
          </CardTitle>
          <CardDescription>
            Replace unhealthy habits with positive ones using proven behavior change strategies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{activeSwaps.length}</div>
              <p className="text-sm text-gray-600">Active Swaps</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {activeSwaps.filter(swap => swap.status === 'completed').length}
              </div>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {Math.round(activeSwaps.reduce((sum, swap) => sum + swap.progress, 0) / activeSwaps.length) || 0}%
              </div>
              <p className="text-sm text-gray-600">Average Progress</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {activeSwaps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Active Habit Swaps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeSwaps.map((swap) => (
                <div key={swap.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(swap.difficulty)}>
                        {swap.difficulty}
                      </Badge>
                      <Badge variant="outline" className={
                        swap.status === 'completed' ? 'bg-green-100 text-green-800' :
                        swap.status === 'paused' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'
                      }>
                        {swap.status}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => pauseSwap(swap.id)}
                      disabled={swap.status === 'completed'}
                    >
                      {swap.status === 'paused' ? 'Resume' : 'Pause'}
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 p-3 bg-red-50 rounded border border-red-200">
                      <h4 className="font-medium text-red-800">Old Habit</h4>
                      <p className="text-sm text-red-700">{swap.oldHabit}</p>
                    </div>
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                    <div className="flex-1 p-3 bg-green-50 rounded border border-green-200">
                      <h4 className="font-medium text-green-800">New Habit</h4>
                      <p className="text-sm text-green-700">{swap.newHabit}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{swap.progress}%</span>
                    </div>
                    <Progress value={swap.progress} className="h-2" />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateProgress(swap.id, Math.min(swap.progress + 10, 100))}
                        disabled={swap.status === 'completed' || swap.status === 'paused'}
                      >
                        +10%
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateProgress(swap.id, Math.max(swap.progress - 5, 0))}
                        disabled={swap.status === 'completed' || swap.status === 'paused'}
                      >
                        -5%
                      </Button>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Success Tips
                    </h5>
                    <ul className="text-sm space-y-1">
                      {swap.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-600">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Suggested Habit Swaps</CardTitle>
          <CardDescription>
            Evidence-based habit replacements to improve your wellbeing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="p-4 border rounded-lg space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">{suggestion.title}</h4>
                  <Badge className={getDifficultyColor(suggestion.difficulty)}>
                    {suggestion.difficulty}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="p-2 bg-red-50 rounded text-sm">
                    <span className="font-medium text-red-800">Replace: </span>
                    <span className="text-red-700">{suggestion.oldHabit}</span>
                  </div>
                  <div className="p-2 bg-green-50 rounded text-sm">
                    <span className="font-medium text-green-800">With: </span>
                    <span className="text-green-700">{suggestion.newHabit}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong>Benefit:</strong> {suggestion.benefit}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Time:</strong> {suggestion.estimatedTime}
                  </p>
                </div>

                <Button
                  onClick={() => handleStartSwap(suggestion)}
                  className="w-full"
                  size="sm"
                >
                  Start This Swap
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
