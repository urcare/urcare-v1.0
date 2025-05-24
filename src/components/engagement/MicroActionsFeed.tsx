
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Zap, Target } from 'lucide-react';
import { toast } from 'sonner';

interface MicroAction {
  id: string;
  title: string;
  description: string;
  timeToComplete: string;
  category: 'hydration' | 'movement' | 'nutrition' | 'mindfulness' | 'medication';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  completed: boolean;
}

interface Props {
  onActionComplete: (actionId: string) => void;
}

const microActions: MicroAction[] = [
  {
    id: 'action-1',
    title: 'Drink a Glass of Water',
    description: 'Stay hydrated for better energy and focus',
    timeToComplete: '30 seconds',
    category: 'hydration',
    difficulty: 'easy',
    points: 5,
    completed: false
  },
  {
    id: 'action-2',
    title: 'Take 10 Deep Breaths',
    description: 'Quick mindfulness exercise to reduce stress',
    timeToComplete: '2 minutes',
    category: 'mindfulness',
    difficulty: 'easy',
    points: 10,
    completed: false
  },
  {
    id: 'action-3',
    title: 'Walk for 5 Minutes',
    description: 'Light movement to boost circulation',
    timeToComplete: '5 minutes',
    category: 'movement',
    difficulty: 'medium',
    points: 15,
    completed: false
  },
  {
    id: 'action-4',
    title: 'Check Medication Schedule',
    description: 'Ensure you\'re on track with your prescriptions',
    timeToComplete: '1 minute',
    category: 'medication',
    difficulty: 'easy',
    points: 20,
    completed: false
  }
];

export const MicroActionsFeed = ({ onActionComplete }: Props) => {
  const [actions, setActions] = useState<MicroAction[]>(microActions);
  const [completedToday, setCompletedToday] = useState(0);
  const dailyGoal = 5;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'hydration': return 'bg-blue-100 text-blue-800';
      case 'movement': return 'bg-green-100 text-green-800';
      case 'nutrition': return 'bg-orange-100 text-orange-800';
      case 'mindfulness': return 'bg-purple-100 text-purple-800';
      case 'medication': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyPoints = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };

  const handleCompleteAction = (actionId: string) => {
    setActions(prev => 
      prev.map(action => 
        action.id === actionId 
          ? { ...action, completed: true }
          : action
      )
    );
    
    const action = actions.find(a => a.id === actionId);
    if (action) {
      setCompletedToday(prev => prev + 1);
      onActionComplete(actionId);
      toast.success(`+${action.points} points! Great job completing "${action.title}"`);
    }
  };

  const progressPercentage = (completedToday / dailyGoal) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Micro-Actions Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Daily Progress</p>
                <p className="text-sm text-gray-600">{completedToday} of {dailyGoal} actions completed</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{Math.round(progressPercentage)}%</p>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {actions.map((action) => (
          <Card key={action.id} className={`transition-all ${action.completed ? 'opacity-60 bg-green-50' : 'hover:shadow-md'}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(action.category)}>
                      {action.category}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {getDifficultyPoints(action.difficulty)} {action.timeToComplete}
                    </span>
                  </div>
                  
                  <h3 className="font-medium">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                  
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-600">+{action.points} points</span>
                  </div>
                </div>
                
                <div className="ml-4">
                  {action.completed ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">Done!</span>
                    </div>
                  ) : (
                    <Button 
                      size="sm"
                      onClick={() => handleCompleteAction(action.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Do Now
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {completedToday >= dailyGoal && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-bold text-green-700 mb-2">🎉 Daily Goal Achieved!</h3>
            <p className="text-green-600">You've completed all your micro-actions for today. Great job!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
