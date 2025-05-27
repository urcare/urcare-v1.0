
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Scale, TrendingUp, TrendingDown, Target, Plus, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { toast } from 'sonner';

interface WeightEntry {
  date: string;
  weight: number;
  bmi: number;
  bodyFat?: number;
  muscleMass?: number;
}

interface WeightGoal {
  target: number;
  deadline: string;
  type: 'lose' | 'gain' | 'maintain';
  weeklyTarget: number;
}

export const WeightBMITracker = () => {
  const [weightData, setWeightData] = useState<WeightEntry[]>([
    { date: '2024-01-01', weight: 75.2, bmi: 24.1, bodyFat: 18.5, muscleMass: 35.2 },
    { date: '2024-01-07', weight: 74.8, bmi: 24.0, bodyFat: 18.2, muscleMass: 35.4 },
    { date: '2024-01-14', weight: 74.5, bmi: 23.9, bodyFat: 18.0, muscleMass: 35.6 },
    { date: '2024-01-21', weight: 74.1, bmi: 23.8, bodyFat: 17.8, muscleMass: 35.8 }
  ]);

  const [currentGoal] = useState<WeightGoal>({
    target: 72.0,
    deadline: '2024-03-01',
    type: 'lose',
    weeklyTarget: 0.3
  });

  const [newWeight, setNewWeight] = useState('');
  const [height] = useState(175); // cm

  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  const handleAddWeight = () => {
    if (!newWeight || isNaN(Number(newWeight))) {
      toast.error('Please enter a valid weight');
      return;
    }

    const weight = Number(newWeight);
    const bmi = calculateBMI(weight, height);
    const newEntry: WeightEntry = {
      date: new Date().toISOString().split('T')[0],
      weight,
      bmi
    };

    setWeightData(prev => [...prev, newEntry]);
    setNewWeight('');
    toast.success('Weight entry added successfully!');
  };

  const currentWeight = weightData[weightData.length - 1];
  const previousWeight = weightData[weightData.length - 2];
  const weightChange = currentWeight && previousWeight ? currentWeight.weight - previousWeight.weight : 0;
  const progressToGoal = currentWeight ? ((currentWeight.weight - currentGoal.target) / (weightData[0].weight - currentGoal.target)) * 100 : 0;

  const formatData = weightData.map(entry => ({
    ...entry,
    formattedDate: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Weight & BMI Tracker
          </CardTitle>
          <CardDescription>
            Track your weight progress with detailed analytics and trending graphs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {currentWeight ? currentWeight.weight : '-- '}kg
              </div>
              <p className="text-sm text-gray-600">Current Weight</p>
              {weightChange !== 0 && (
                <div className={`flex items-center justify-center gap-1 mt-1 ${
                  weightChange > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {weightChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span className="text-xs">{Math.abs(weightChange).toFixed(1)}kg</span>
                </div>
              )}
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {currentWeight ? currentWeight.bmi : '--'}
              </div>
              <p className="text-sm text-gray-600">Current BMI</p>
              {currentWeight && (
                <Badge className={`mt-1 ${getBMICategory(currentWeight.bmi).color} bg-transparent border-current`}>
                  {getBMICategory(currentWeight.bmi).category}
                </Badge>
              )}
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{currentGoal.target}kg</div>
              <p className="text-sm text-gray-600">Goal Weight</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Target className="h-3 w-3 text-purple-600" />
                <span className="text-xs text-purple-600">{currentGoal.type}</span>
              </div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">
                {Math.abs(currentWeight ? currentWeight.weight - currentGoal.target : 0).toFixed(1)}kg
              </div>
              <p className="text-sm text-gray-600">To Goal</p>
              <div className="mt-1">
                <Progress value={Math.max(0, 100 - progressToGoal)} className="h-2" />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <input
              type="number"
              step="0.1"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder="Enter weight (kg)"
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button onClick={handleAddWeight}>
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Weight Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formatData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedDate" />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip 
                  formatter={(value, name) => [`${value}kg`, 'Weight']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>BMI Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={formatData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedDate" />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip 
                  formatter={(value, name) => [value, 'BMI']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="bmi" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weight History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weightData.slice().reverse().map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium">
                    {new Date(entry.date).toLocaleDateString()}
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {entry.weight}kg
                  </div>
                  <Badge variant="outline">
                    BMI: {entry.bmi}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {entry.bodyFat && (
                    <span>Body Fat: {entry.bodyFat}%</span>
                  )}
                  {entry.muscleMass && (
                    <span>Muscle: {entry.muscleMass}kg</span>
                  )}
                  {index < weightData.length - 1 && (
                    <div className={`flex items-center gap-1 ${
                      entry.weight < weightData[weightData.length - 2 - index].weight 
                        ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {entry.weight < weightData[weightData.length - 2 - index].weight 
                        ? <TrendingDown className="h-3 w-3" /> 
                        : <TrendingUp className="h-3 w-3" />
                      }
                      <span className="text-xs">
                        {Math.abs(entry.weight - weightData[weightData.length - 2 - index].weight).toFixed(1)}kg
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
