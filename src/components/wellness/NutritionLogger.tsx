
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Apple, Plus, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
  time: string;
}

export const NutritionLogger = () => {
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([
    {
      id: '1',
      name: 'Greek Yogurt with Berries',
      calories: 150,
      protein: 15,
      carbs: 20,
      fat: 3,
      serving: '1 cup',
      time: '08:30'
    },
    {
      id: '2',
      name: 'Grilled Chicken Salad',
      calories: 350,
      protein: 30,
      carbs: 15,
      fat: 18,
      serving: '1 large bowl',
      time: '12:45'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Daily goals
  const dailyGoals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65
  };

  // Calculate totals
  const totals = foodEntries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const addFoodEntry = () => {
    setIsAdding(true);
    // Simulate food search and add
    setTimeout(() => {
      const newEntry: FoodEntry = {
        id: Date.now().toString(),
        name: searchQuery || 'Banana',
        calories: 105,
        protein: 1,
        carbs: 27,
        fat: 0.3,
        serving: '1 medium',
        time: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
      setFoodEntries(prev => [...prev, newEntry]);
      setSearchQuery('');
      setIsAdding(false);
      toast.success('Food added to your diary!');
    }, 1000);
  };

  const removeFoodEntry = (id: string) => {
    setFoodEntries(prev => prev.filter(entry => entry.id !== id));
    toast.success('Food entry removed');
  };

  const getProgressColor = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Apple className="h-5 w-5 text-green-500" />
            Nutrition Logger
          </CardTitle>
          <CardDescription>
            Track your daily food intake and monitor your nutritional goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Calories</span>
                <span>{totals.calories}/{dailyGoals.calories}</span>
              </div>
              <Progress 
                value={(totals.calories / dailyGoals.calories) * 100} 
                className="h-2"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Protein</span>
                <span>{totals.protein}g/{dailyGoals.protein}g</span>
              </div>
              <Progress 
                value={(totals.protein / dailyGoals.protein) * 100} 
                className="h-2"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Carbs</span>
                <span>{totals.carbs}g/{dailyGoals.carbs}g</span>
              </div>
              <Progress 
                value={(totals.carbs / dailyGoals.carbs) * 100} 
                className="h-2"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Fat</span>
                <span>{totals.fat}g/{dailyGoals.fat}g</span>
              </div>
              <Progress 
                value={(totals.fat / dailyGoals.fat) * 100} 
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Food</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Search for food (e.g., banana, chicken breast)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={addFoodEntry}
              disabled={isAdding}
            >
              {isAdding ? (
                <>
                  <Search className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Food Diary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {foodEntries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{entry.name}</h4>
                    <span className="text-sm text-gray-500">({entry.serving})</span>
                    <span className="text-xs text-gray-400">{entry.time}</span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>{entry.calories} cal</span>
                    <span>{entry.protein}g protein</span>
                    <span>{entry.carbs}g carbs</span>
                    <span>{entry.fat}g fat</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFoodEntry(entry.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {foodEntries.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No food entries yet. Start logging your meals!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nutrition Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800">Calorie Balance</h4>
              <p className="text-sm text-blue-600">
                {totals.calories < dailyGoals.calories ? 
                  `${dailyGoals.calories - totals.calories} calories remaining for today` :
                  `You've reached your calorie goal for today!`
                }
              </p>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800">Protein Goal</h4>
              <p className="text-sm text-green-600">
                {totals.protein >= dailyGoals.protein ? 
                  'Great job meeting your protein target!' :
                  `Need ${dailyGoals.protein - totals.protein}g more protein`
                }
              </p>
            </div>
            
            <div className="p-3 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-800">Balanced Eating</h4>
              <p className="text-sm text-orange-600">
                Aim for a balance of all macronutrients throughout the day
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
