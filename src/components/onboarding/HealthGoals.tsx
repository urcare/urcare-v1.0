
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Target, Moon, Zap, Scale, Activity, Heart, Eye, Plus, X } from 'lucide-react';

interface HealthGoalsProps {
  onDataChange: (data: any) => void;
}

const predefinedGoals = [
  { id: 'improve-sleep', label: 'Improve Sleep', icon: Moon, color: 'bg-purple-100 text-purple-700' },
  { id: 'reduce-stress', label: 'Reduce Stress', icon: Zap, color: 'bg-yellow-100 text-yellow-700' },
  { id: 'manage-weight', label: 'Manage Weight', icon: Scale, color: 'bg-green-100 text-green-700' },
  { id: 'stay-fit', label: 'Stay Fit', icon: Activity, color: 'bg-red-100 text-red-700' },
  { id: 'monitor-condition', label: 'Monitor Chronic Condition', icon: Heart, color: 'bg-blue-100 text-blue-700' },
  { id: 'just-explore', label: 'Just Explore', icon: Eye, color: 'bg-gray-100 text-gray-700' },
];

const HealthGoals: React.FC<HealthGoalsProps> = ({ onDataChange }) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [customGoal, setCustomGoal] = useState('');
  const [customGoals, setCustomGoals] = useState<string[]>([]);

  const handleGoalToggle = (goalId: string) => {
    let newSelected;
    if (selectedGoals.includes(goalId)) {
      newSelected = selectedGoals.filter(id => id !== goalId);
    } else {
      newSelected = [...selectedGoals, goalId];
    }
    setSelectedGoals(newSelected);
    onDataChange({ selectedGoals: newSelected, customGoals });
  };

  const handleAddCustomGoal = () => {
    if (customGoal.trim() && !customGoals.includes(customGoal.trim())) {
      const newCustomGoals = [...customGoals, customGoal.trim()];
      setCustomGoals(newCustomGoals);
      setCustomGoal('');
      onDataChange({ selectedGoals, customGoals: newCustomGoals });
    }
  };

  const handleRemoveCustomGoal = (goalToRemove: string) => {
    const newCustomGoals = customGoals.filter(goal => goal !== goalToRemove);
    setCustomGoals(newCustomGoals);
    onDataChange({ selectedGoals, customGoals: newCustomGoals });
  };

  const totalGoals = selectedGoals.length + customGoals.length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Target className="w-12 h-12 text-teal-600 mx-auto mb-4" />
        <p className="text-gray-600">What are your top health goals?</p>
        <p className="text-sm text-gray-500 mt-2">Select 1-3 goals that matter most to you</p>
      </div>

      {/* Goal Selection Limit */}
      {totalGoals > 0 && (
        <div className="text-center">
          <Badge variant="outline" className="text-teal-600 border-teal-300">
            {totalGoals}/3 goals selected
          </Badge>
        </div>
      )}

      {/* Predefined Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {predefinedGoals.map((goal) => {
          const IconComponent = goal.icon;
          const isSelected = selectedGoals.includes(goal.id);
          const isDisabled = !isSelected && totalGoals >= 3;
          
          return (
            <Button
              key={goal.id}
              variant={isSelected ? "default" : "outline"}
              className={`p-4 h-auto flex items-center gap-3 ${
                isSelected 
                  ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white border-transparent' 
                  : isDisabled 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:border-teal-300 hover:bg-teal-50'
              }`}
              onClick={() => !isDisabled && handleGoalToggle(goal.id)}
              disabled={isDisabled}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isSelected ? 'bg-white/20' : goal.color
              }`}>
                <IconComponent className={`w-5 h-5 ${isSelected ? 'text-white' : ''}`} />
              </div>
              <div className="flex-1 text-left">
                <span className="font-medium">{goal.label}</span>
              </div>
            </Button>
          );
        })}
      </div>

      {/* Custom Goals */}
      {customGoals.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Your Custom Goals:</Label>
          <div className="flex flex-wrap gap-2">
            {customGoals.map((goal) => (
              <Badge key={goal} variant="secondary" className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                {goal}
                <button
                  onClick={() => handleRemoveCustomGoal(goal)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Goal */}
      {totalGoals < 3 && (
        <div className="space-y-2">
          <Label htmlFor="custom-goal" className="text-sm font-medium text-gray-700">
            Add a custom goal:
          </Label>
          <div className="flex gap-2">
            <Input
              id="custom-goal"
              placeholder="Enter your health goal..."
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomGoal()}
            />
            <Button
              onClick={handleAddCustomGoal}
              disabled={!customGoal.trim()}
              className="bg-gradient-to-r from-teal-500 to-blue-500"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Selected Goals Summary */}
      {totalGoals > 0 && (
        <div className="bg-teal-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-teal-900 mb-2">Your Health Goals:</h4>
          <ul className="text-sm text-teal-800 space-y-1">
            {selectedGoals.map((goalId) => {
              const goal = predefinedGoals.find(g => g.id === goalId);
              return goal ? <li key={goalId}>• {goal.label}</li> : null;
            })}
            {customGoals.map((goal) => (
              <li key={goal}>• {goal}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HealthGoals;
