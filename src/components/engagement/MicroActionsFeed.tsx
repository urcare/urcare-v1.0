
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, CheckCircle, Clock, Star, Flame, Trophy } from 'lucide-react';
import { toast } from 'sonner';

interface MicroAction {
  id: string;
  title: string;
  description: string;
  category: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  completed: boolean;
  streak?: number;
}

interface MicroActionsFeedProps {
  onActionComplete: (actionId: string) => void;
}

export const MicroActionsFeed = ({ onActionComplete }: MicroActionsFeedProps) => {
  const [actions, setActions] = useState<MicroAction[]>([
    {
      id: '1',
      title: 'Drink a Glass of Water',
      description: 'Stay hydrated by drinking a full glass of water right now',
      category: 'Hydration',
      points: 5,
      difficulty: 'easy',
      estimatedTime: '1 min',
      completed: false,
      streak: 3
    },
    {
      id: '2',
      title: 'Take 10 Deep Breaths',
      description: 'Practice mindful breathing for stress relief',
      category: 'Mindfulness',
      points: 10,
      difficulty: 'easy',
      estimatedTime: '2 min',
      completed: false
    },
    {
      id: '3',
      title: 'Stand and Stretch',
      description: 'Get up from your chair and do 5 simple stretches',
      category: 'Movement',
      points: 15,
      difficulty: 'medium',
      estimatedTime: '5 min',
      completed: false
    },
    {
      id: '4',
      title: 'Log Your Mood',
      description: 'Take a moment to check in with how you\'re feeling',
      category: 'Mental Health',
      points: 10,
      difficulty: 'easy',
      estimatedTime: '2 min',
      completed: false,
      streak: 7
    },
    {
      id: '5',
      title: '5-Minute Walk',
      description: 'Take a short walk around your space or outside',
      category: 'Movement',
      points: 20,
      difficulty: 'medium',
      estimatedTime: '5 min',
      completed: false
    }
  ]);

  const handleCompleteAction = (actionId: string) => {
    setActions(prev => prev.map(action => 
      action.id === actionId ? { ...action, completed: true } : action
    ));
    onActionComplete(actionId);
    toast.success('Great job! Action completed! 🎉');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Hydration': return '💧';
      case 'Mindfulness': return '🧠';
      case 'Movement': return '🏃';
      case 'Mental Health': return '💚';
      default: return '⭐';
    }
  };

  const completedCount = actions.filter(action => action.completed).length;
  const totalPoints = actions.filter(action => action.completed).reduce((sum, action) => sum + action.points, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Micro Actions Feed
          </CardTitle>
          <CardDescription>
            Quick, actionable steps to improve your health throughout the day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{completedCount}</div>
              <p className="text-sm text-gray-600">Actions Completed</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalPoints}</div>
              <p className="text-sm text-gray-600">Points Earned</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((completedCount / actions.length) * 100)}%
              </div>
              <p className="text-sm text-gray-600">Completion Rate</p>
            </div>
          </div>
          
          <Progress value={(completedCount / actions.length) * 100} className="mb-4" />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {actions.map((action) => (
          <Card key={action.id} className={`transition-all duration-200 hover:shadow-md ${action.completed ? 'opacity-60 bg-gray-50' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getCategoryIcon(action.category)}</span>
                    <h3 className="font-semibold">{action.title}</h3>
                    {action.streak && (
                      <div className="flex items-center gap-1">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-orange-600">{action.streak} day streak</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3">{action.description}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      {action.category}
                    </Badge>
                    <Badge className={`text-xs ${getDifficultyColor(action.difficulty)}`}>
                      {action.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {action.estimatedTime}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-blue-600">
                      <Star className="h-3 w-3" />
                      {action.points} pts
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  {action.completed ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => handleCompleteAction(action.id)}
                      size="sm"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Do It Now
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
