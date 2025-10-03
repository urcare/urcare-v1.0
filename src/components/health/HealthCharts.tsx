import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ChartData {
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: string;
  color: string;
}

interface HealthChartsProps {
  data: ChartData[];
}

export const HealthCharts: React.FC<HealthChartsProps> = ({ data }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <Card key={index} className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">{item.label}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">{item.value}</span>
                  <span className="text-sm text-gray-500">{item.unit}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {getTrendIcon(item.trend)}
                <span className={`text-sm font-medium ${getTrendColor(item.trend)}`}>
                  {item.change}
                </span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${item.color}`}
                style={{ width: `${Math.min((item.value / 100) * 100, 100)}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Weekly Activity Chart Component
export const WeeklyActivityChart: React.FC = () => {
  const weekData = [
    { day: 'Mon', steps: 8500, calories: 2100, active: 45 },
    { day: 'Tue', steps: 9200, calories: 1950, active: 52 },
    { day: 'Wed', steps: 7800, calories: 2200, active: 38 },
    { day: 'Thu', steps: 10500, calories: 2050, active: 65 },
    { day: 'Fri', steps: 8900, calories: 2150, active: 48 },
    { day: 'Sat', steps: 12000, calories: 2300, active: 72 },
    { day: 'Sun', steps: 6500, calories: 1800, active: 32 }
  ];

  const maxSteps = Math.max(...weekData.map(d => d.steps));
  const maxActive = Math.max(...weekData.map(d => d.active));

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <span>Weekly Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Steps Chart */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Steps</span>
              <span className="text-sm text-gray-500">
                {weekData.reduce((sum, d) => sum + d.steps, 0).toLocaleString()} total
              </span>
            </div>
            <div className="flex items-end space-x-1 h-20">
              {weekData.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-green-500 rounded-t-sm transition-all hover:bg-green-600"
                    style={{ height: `${(day.steps / maxSteps) * 100}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">{day.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Minutes Chart */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Active Minutes</span>
              <span className="text-sm text-gray-500">
                {weekData.reduce((sum, d) => sum + d.active, 0)} total
              </span>
            </div>
            <div className="flex items-end space-x-1 h-20">
              {weekData.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-blue-500 rounded-t-sm transition-all hover:bg-blue-600"
                    style={{ height: `${(day.active / maxActive) * 100}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">{day.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Health Score Progress Component
export const HealthScoreProgress: React.FC<{ score: number; goal: number }> = ({ score, goal }) => {
  const percentage = (score / goal) * 100;
  const getColor = (percent: number) => {
    if (percent >= 80) return 'text-green-500';
    if (percent >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 80) return 'bg-green-500';
    if (percent >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle>Health Score Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className={`text-4xl font-bold ${getColor(percentage)}`}>{score}</div>
          <div className="text-sm text-gray-500">out of {goal} goal</div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm text-gray-500">
          <span>0</span>
          <span>{goal}</span>
        </div>
      </CardContent>
    </Card>
  );
};
