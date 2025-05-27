
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Target, Clock, CheckCircle, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Habit {
  id: string;
  title: string;
  description: string;
  category: 'health' | 'fitness' | 'nutrition' | 'mindfulness' | 'productivity';
  difficulty: 'easy' | 'medium' | 'hard';
  frequency: 'daily' | 'weekly' | 'monthly';
  streak: number;
  completed: boolean;
  aiSuggested: boolean;
}

export const AIHabitPlanner = () => {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      title: 'Morning Meditation',
      description: '10 minutes of mindfulness to start your day',
      category: 'mindfulness',
      difficulty: 'easy',
      frequency: 'daily',
      streak: 7,
      completed: false,
      aiSuggested: true
    },
    {
      id: '2',
      title: 'Drink 8 Glasses of Water',
      description: 'Stay hydrated throughout the day',
      category: 'health',
      difficulty: 'easy',
      frequency: 'daily',
      streak: 12,
      completed: true,
      aiSuggested: true
    },
    {
      id: '3',
      title: 'Evening Walk',
      description: '30-minute walk after dinner',
      category: 'fitness',
      difficulty: 'medium',
      frequency: 'daily',
      streak: 4,
      completed: false,
      aiSuggested: false
    }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return 'bg-blue-100 text-blue-800';
      case 'fitness': return 'bg-green-100 text-green-800';
      case 'nutrition': return 'bg-orange-100 text-orange-800';
      case 'mindfulness': return 'bg-purple-100 text-purple-800';
      case 'productivity': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCompleteHabit = (habitId: string) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId 
        ? { ...habit, completed: true, streak: habit.streak + 1 }
        : habit
    ));
    toast.success('Habit completed! Great job! 🎉');
  };

  const generateAIHabits = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newHabits: Habit[] = [
        {
          id: Date.now().toString(),
          title: 'Protein-Rich Breakfast',
          description: 'Include 20g of protein in your morning meal',
          category: 'nutrition',
          difficulty: 'easy',
          frequency: 'daily',
          streak: 0,
          completed: false,
          aiSuggested: true
        },
        {
          id: (Date.now() + 1).toString(),
          title: 'Digital Sunset',
          description: 'No screens 1 hour before bedtime',
          category: 'health',
          difficulty: 'medium',
          frequency: 'daily',
          streak: 0,
          completed: false,
          aiSuggested: true
        }
      ];
      setHabits(prev => [...prev, ...newHabits]);
      setIsGenerating(false);
      toast.success('AI has suggested new personalized habits!');
    }, 2000);
  };

  const completedToday = habits.filter(h => h.completed).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Habit Planner
          </CardTitle>
          <CardDescription>
            Personalized habit suggestions powered by AI based on your health goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Today's Progress</p>
                <p className="text-sm text-gray-600">{completedToday} of {totalHabits} habits completed</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{Math.round(completionRate)}%</p>
              </div>
            </div>
            <Progress value={completionRate} className="h-2" />
            
            <Button 
              onClick={generateAIHabits} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Brain className="h-4 w-4 mr-2 animate-spin" />
                  Generating AI Suggestions...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Get AI Habit Suggestions
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {habits.map((habit) => (
          <Card key={habit.id} className={`transition-all ${habit.completed ? 'opacity-70 bg-green-50' : 'hover:shadow-md'}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={getCategoryColor(habit.category)}>
                      {habit.category}
                    </Badge>
                    <Badge className={getDifficultyColor(habit.difficulty)}>
                      {habit.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      {habit.frequency}
                    </Badge>
                    {habit.aiSuggested && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        AI Suggested
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="font-medium">{habit.title}</h3>
                  <p className="text-sm text-gray-600">{habit.description}</p>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-orange-600">{habit.streak} day streak</span>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  {habit.completed ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">Done!</span>
                    </div>
                  ) : (
                    <Button 
                      size="sm"
                      onClick={() => handleCompleteHabit(habit.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
