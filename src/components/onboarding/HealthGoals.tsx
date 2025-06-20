
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Target, Plus, X } from 'lucide-react';

interface HealthGoalsProps {
  onDataChange: (data: any) => void;
}

const predefinedGoals = [
  'Improve Sleep Quality',
  'Reduce Stress',
  'Manage Weight',
  'Stay Physically Fit',
  'Monitor Chronic Condition',
  'Better Nutrition',
  'Mental Health',
  'Preventive Care',
  'Just Explore'
];

const HealthGoals: React.FC<HealthGoalsProps> = ({ onDataChange }) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [customGoal, setCustomGoal] = useState('');

  const handleGoalToggle = (goal: string) => {
    let newGoals;
    if (selectedGoals.includes(goal)) {
      newGoals = selectedGoals.filter(g => g !== goal);
    } else {
      newGoals = [...selectedGoals, goal];
    }
    setSelectedGoals(newGoals);
    onDataChange({ healthGoals: newGoals });
  };

  const handleAddCustomGoal = () => {
    if (customGoal.trim() && !selectedGoals.includes(customGoal.trim())) {
      const newGoals = [...selectedGoals, customGoal.trim()];
      setSelectedGoals(newGoals);
      setCustomGoal('');
      onDataChange({ healthGoals: newGoals });
    }
  };

  const handleRemoveGoal = (goal: string) => {
    const newGoals = selectedGoals.filter(g => g !== goal);
    setSelectedGoals(newGoals);
    onDataChange({ healthGoals: newGoals });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Target className="w-12 h-12 text-teal-600 mx-auto mb-4" />
        <p className="text-gray-600">What are your top health goals? (Select up to 3)</p>
      </div>

      {/* Selected Goals */}
      {selectedGoals.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Your Selected Goals:</Label>
          <div className="flex flex-wrap gap-2">
            {selectedGoals.map((goal) => (
              <div key={goal} className="flex items-center gap-1 bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">
                {goal}
                <button
                  onClick={() => handleRemoveGoal(goal)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Predefined Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {predefinedGoals.map((goal) => (
          <Button
            key={goal}
            variant={selectedGoals.includes(goal) ? "default" : "outline"}
            className={`p-4 h-auto text-left justify-start ${
              selectedGoals.includes(goal)
                ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white'
                : 'hover:border-teal-300 hover:bg-teal-50'
            }`}
            onClick={() => handleGoalToggle(goal)}
            disabled={selectedGoals.length >= 3 && !selectedGoals.includes(goal)}
          >
            <Target className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm">{goal}</span>
          </Button>
        ))}
      </div>

      {/* Custom Goal Input */}
      {selectedGoals.length < 3 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Add Custom Goal:</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter your custom health goal..."
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomGoal()}
            />
            <Button
              onClick={handleAddCustomGoal}
              disabled={!customGoal.trim() || selectedGoals.length >= 3}
              className="bg-gradient-to-r from-teal-500 to-blue-500"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {selectedGoals.length >= 3 && (
        <div className="text-center text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          You've selected the maximum of 3 goals. Remove a goal to add a different one.
        </div>
      )}
    </div>
  );
};

export default HealthGoals;
