
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  Target, 
  Calendar,
  CheckCircle,
  TrendingUp,
  Award,
  Heart
} from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  points: number;
  level: number;
  nextMilestone: number;
  isCompleted: boolean;
  lastCompleted: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  category: string;
}

const mockHabits: Habit[] = [
  {
    id: 'H001',
    name: 'Daily Meditation',
    category: 'Mental Health',
    difficulty: 'medium',
    currentStreak: 12,
    longestStreak: 28,
    completionRate: 85,
    points: 1240,
    level: 3,
    nextMilestone: 1500,
    isCompleted: true,
    lastCompleted: '2024-01-20'
  },
  {
    id: 'H002',
    name: 'Mood Check-in',
    category: 'Emotional Tracking',
    difficulty: 'easy',
    currentStreak: 45,
    longestStreak: 45,
    completionRate: 92,
    points: 2250,
    level: 5,
    nextMilestone: 2500,
    isCompleted: true,
    lastCompleted: '2024-01-20'
  },
  {
    id: 'H003',
    name: 'Evening Journaling',
    category: 'Self Reflection',
    difficulty: 'hard',
    currentStreak: 0,
    longestStreak: 15,
    completionRate: 67,
    points: 980,
    level: 2,
    nextMilestone: 1200,
    isCompleted: false,
    lastCompleted: '2024-01-18'
  }
];

const mockAchievements: Achievement[] = [
  {
    id: 'A001',
    name: 'Meditation Master',
    description: 'Complete 30 days of meditation',
    icon: '🧘',
    unlocked: false,
    category: 'Mental Health'
  },
  {
    id: 'A002',
    name: 'Mood Tracker',
    description: 'Track mood for 45 consecutive days',
    icon: '😊',
    unlocked: true,
    unlockedDate: '2024-01-20',
    category: 'Emotional Tracking'
  },
  {
    id: 'A003',
    name: 'Streak Champion',
    description: 'Maintain any habit for 50 days',
    icon: '🔥',
    unlocked: false,
    category: 'Consistency'
  }
];

export const GamifiedHabitTracker = () => {
  const [habits] = useState<Habit[]>(mockHabits);
  const [achievements] = useState<Achievement[]>(mockAchievements);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'hard': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-blue-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const totalPoints = habits.reduce((sum, habit) => sum + habit.points, 0);
  const averageLevel = Math.round(habits.reduce((sum, habit) => sum + habit.level, 0) / habits.length);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Gamified Habit Tracker
          </CardTitle>
          <CardDescription>
            Achievement systems with progress visualization and motivation enhancement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <Star className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{totalPoints}</p>
                    <p className="text-sm text-gray-600">Total Points</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Trophy className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{averageLevel}</p>
                    <p className="text-sm text-gray-600">Avg Level</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {habits.filter(h => h.isCompleted).length}
                    </p>
                    <p className="text-sm text-gray-600">Completed Today</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <Award className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">
                      {achievements.filter(a => a.unlocked).length}
                    </p>
                    <p className="text-sm text-gray-600">Achievements</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold">Active Habits</h3>
              {habits.map((habit) => (
                <Card 
                  key={habit.id} 
                  className={`cursor-pointer transition-colors ${selectedHabit?.id === habit.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-green-400`}
                  onClick={() => setSelectedHabit(habit)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold mb-1">{habit.name}</h4>
                        <p className="text-sm text-gray-600 mb-1">{habit.category}</p>
                        <div className="flex items-center gap-2">
                          {habit.isCompleted ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Target className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm font-medium">
                            Level {habit.level} • {habit.currentStreak} day streak
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getDifficultyColor(habit.difficulty)}>
                          {habit.difficulty.toUpperCase()}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-bold">{habit.points}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Completion Rate</span>
                        <span className={`font-bold ${getCompletionColor(habit.completionRate)}`}>
                          {habit.completionRate}%
                        </span>
                      </div>
                      <Progress value={habit.completionRate} className="h-2" />
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress to Level {habit.level + 1}</span>
                        <span className="font-bold">
                          {habit.points}/{habit.nextMilestone}
                        </span>
                      </div>
                      <Progress value={(habit.points / habit.nextMilestone) * 100} className="h-2" />
                      
                      <div className="flex justify-between items-center mt-3 text-sm">
                        <div className="flex items-center gap-1 text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>Last: {habit.lastCompleted}</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-600">
                          <TrendingUp className="h-3 w-3" />
                          <span>Best: {habit.longestStreak} days</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-6">
              {selectedHabit && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedHabit.name}</CardTitle>
                    <CardDescription>Habit details and progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Current Status</h4>
                        <div className="space-y-1 text-sm">
                          <p>Level: <strong>{selectedHabit.level}</strong></p>
                          <p>Points: <strong>{selectedHabit.points}</strong></p>
                          <p>Streak: <strong>{selectedHabit.currentStreak} days</strong></p>
                          <p>Completion: <strong className={getCompletionColor(selectedHabit.completionRate)}>
                            {selectedHabit.completionRate}%
                          </strong></p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Next Milestone</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress to Level {selectedHabit.level + 1}</span>
                            <span>{selectedHabit.points}/{selectedHabit.nextMilestone}</span>
                          </div>
                          <Progress value={(selectedHabit.points / selectedHabit.nextMilestone) * 100} className="h-2" />
                          <p className="text-xs text-gray-500">
                            {selectedHabit.nextMilestone - selectedHabit.points} points to go
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button className="flex-1">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark Complete
                        </Button>
                        {!selectedHabit.isCompleted && (
                          <Button variant="outline">
                            <Heart className="h-4 w-4 mr-1" />
                            Motivate
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Unlock rewards and celebrate progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-3 rounded-lg border ${
                          achievement.unlocked 
                            ? 'bg-yellow-50 border-yellow-200' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                            {achievement.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-semibold ${achievement.unlocked ? 'text-yellow-800' : 'text-gray-600'}`}>
                              {achievement.name}
                            </h4>
                            <p className={`text-sm ${achievement.unlocked ? 'text-yellow-700' : 'text-gray-500'}`}>
                              {achievement.description}
                            </p>
                            {achievement.unlocked && achievement.unlockedDate && (
                              <p className="text-xs text-yellow-600 mt-1">
                                Unlocked: {achievement.unlockedDate}
                              </p>
                            )}
                          </div>
                          {achievement.unlocked && (
                            <Trophy className="h-5 w-5 text-yellow-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
