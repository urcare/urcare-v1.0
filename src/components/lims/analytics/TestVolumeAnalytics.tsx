
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Filter,
  Download,
  Eye,
  Clock
} from 'lucide-react';

export const TestVolumeAnalytics = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('volume');

  const volumeMetrics = {
    totalTests: 12567,
    dailyAverage: 405,
    weeklyGrowth: 8.5,
    monthlyGrowth: 11.8,
    peakHour: '11:00 AM',
    peakDay: 'Tuesday'
  };

  const departmentVolume = [
    {
      department: 'Chemistry',
      tests: 4567,
      percentage: 36.3,
      growth: 12.5,
      avgTAT: 2.4,
      status: 'up'
    },
    {
      department: 'Hematology',
      tests: 2890,
      percentage: 23.0,
      growth: 8.9,
      avgTAT: 1.8,
      status: 'up'
    },
    {
      department: 'Microbiology',
      tests: 1756,
      percentage: 14.0,
      growth: 15.2,
      avgTAT: 48.2,
      status: 'up'
    },
    {
      department: 'Immunology',
      tests: 1823,
      percentage: 14.5,
      growth: 6.7,
      avgTAT: 4.6,
      status: 'up'
    },
    {
      department: 'Molecular',
      tests: 987,
      percentage: 7.9,
      growth: 28.4,
      avgTAT: 12.8,
      status: 'up'
    },
    {
      department: 'Pathology',
      tests: 544,
      percentage: 4.3,
      growth: 4.1,
      avgTAT: 72.5,
      status: 'up'
    }
  ];

  const hourlyVolume = [
    { hour: '6:00', volume: 45, capacity: 100 },
    { hour: '7:00', volume: 89, capacity: 120 },
    { hour: '8:00', volume: 156, capacity: 180 },
    { hour: '9:00', volume: 234, capacity: 250 },
    { hour: '10:00', volume: 312, capacity: 320 },
    { hour: '11:00', volume: 345, capacity: 350 },
    { hour: '12:00', volume: 298, capacity: 320 },
    { hour: '13:00', volume: 267, capacity: 300 },
    { hour: '14:00', volume: 289, capacity: 310 },
    { hour: '15:00', volume: 198, capacity: 280 },
    { hour: '16:00', volume: 156, capacity: 200 },
    { hour: '17:00', volume: 98, capacity: 150 }
  ];

  const topTests = [
    { test: 'Complete Blood Count', volume: 1245, growth: 8.5, revenue: 89600 },
    { test: 'Basic Metabolic Panel', volume: 1089, growth: 12.3, revenue: 78450 },
    { test: 'Lipid Panel', volume: 876, growth: 15.7, revenue: 67890 },
    { test: 'Thyroid Function Panel', volume: 654, growth: 22.1, revenue: 58770 },
    { test: 'Hemoglobin A1c', volume: 543, growth: 18.9, revenue: 45230 }
  ];

  const predictiveAnalysis = {
    nextWeekForecast: 13245,
    confidence: 92.5,
    seasonalTrend: 'increasing',
    recommendedCapacity: 420
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Test Volume Analytics</h3>
          <p className="text-gray-600">Comprehensive test volume analysis and forecasting</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedDepartment} 
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Departments</option>
            <option value="chemistry">Chemistry</option>
            <option value="hematology">Hematology</option>
            <option value="microbiology">Microbiology</option>
            <option value="immunology">Immunology</option>
            <option value="molecular">Molecular</option>
          </select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Volume Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-blue-900">{volumeMetrics.totalTests.toLocaleString()}</p>
            <p className="text-xs text-blue-700">Total Tests</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <Calendar className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-green-900">{volumeMetrics.dailyAverage}</p>
            <p className="text-xs text-green-700">Daily Average</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-purple-900">{volumeMetrics.weeklyGrowth}%</p>
            <p className="text-xs text-purple-700">Weekly Growth</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-orange-900">{volumeMetrics.monthlyGrowth}%</p>
            <p className="text-xs text-orange-700">Monthly Growth</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-red-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-red-900">{volumeMetrics.peakHour}</p>
            <p className="text-xs text-red-700">Peak Hour</p>
          </CardContent>
        </Card>
        <Card className="border-indigo-200 bg-indigo-50">
          <CardContent className="p-4 text-center">
            <Calendar className="h-6 w-6 text-indigo-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-indigo-900">{volumeMetrics.peakDay}</p>
            <p className="text-xs text-indigo-700">Peak Day</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Volume Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Department Volume Analysis</CardTitle>
            <CardDescription>Test volume distribution by laboratory department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentVolume.map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <div>
                      <h5 className="font-medium text-gray-900">{dept.department}</h5>
                      <p className="text-sm text-gray-600">{dept.tests.toLocaleString()} tests • {dept.percentage}%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">+{dept.growth}%</p>
                    <p className="text-xs text-gray-500">{dept.avgTAT}h TAT</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hourly Volume Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Hourly Volume Distribution</CardTitle>
            <CardDescription>Test volume patterns throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hourlyVolume.map((hour, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-12">{hour.hour}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <div 
                      className="bg-blue-500 h-4 rounded-full" 
                      style={{ width: `${(hour.volume / hour.capacity) * 100}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {hour.volume}/{hour.capacity}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">
                    {Math.round((hour.volume / hour.capacity) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Tests */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Tests</CardTitle>
            <CardDescription>Highest volume tests with growth analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topTests.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <h5 className="font-medium text-gray-900">{test.test}</h5>
                    <p className="text-sm text-gray-600">{test.volume} tests</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">+{test.growth}%</p>
                    <p className="text-sm text-gray-500">${test.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Predictive Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Volume Forecasting</CardTitle>
            <CardDescription>AI-powered volume predictions and capacity planning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Next Week Forecast</h4>
                <p className="text-2xl font-bold text-blue-700">{predictiveAnalysis.nextWeekForecast.toLocaleString()}</p>
                <p className="text-sm text-blue-600">tests predicted</p>
                <div className="mt-2">
                  <Badge variant="outline" className="border-blue-500 text-blue-700">
                    {predictiveAnalysis.confidence}% confidence
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Capacity Recommendation</h4>
                <p className="text-2xl font-bold text-green-700">{predictiveAnalysis.recommendedCapacity}</p>
                <p className="text-sm text-green-600">tests per day capacity</p>
                <div className="mt-2">
                  <Badge variant="outline" className="border-green-500 text-green-700">
                    {predictiveAnalysis.seasonalTrend} trend
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
