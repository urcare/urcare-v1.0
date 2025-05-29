
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, BarChart3, Calendar, Award, AlertCircle } from 'lucide-react';

export const SurgicalOutcomeTracking = () => {
  const [timeframe, setTimeframe] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('success_rate');

  const outcomeData = {
    summary: {
      totalSurgeries: 145,
      successRate: 94.5,
      complicationRate: 3.2,
      mortalityRate: 0.7,
      readmissionRate: 2.1,
      avgDuration: 142
    },
    byProcedure: [
      {
        procedure: 'CABG',
        count: 25,
        successRate: 96.0,
        complications: 1,
        avgDuration: 240,
        mortalityRate: 0,
        readmissions: 1,
        trend: 'up'
      },
      {
        procedure: 'Hip Replacement',
        count: 35,
        successRate: 97.1,
        complications: 1,
        avgDuration: 180,
        mortalityRate: 0,
        readmissions: 0,
        trend: 'up'
      },
      {
        procedure: 'Appendectomy',
        count: 42,
        successRate: 95.2,
        complications: 2,
        avgDuration: 90,
        mortalityRate: 0,
        readmissions: 1,
        trend: 'stable'
      },
      {
        procedure: 'Cholecystectomy',
        count: 28,
        successRate: 92.9,
        complications: 2,
        avgDuration: 120,
        mortalityRate: 1,
        readmissions: 1,
        trend: 'down'
      },
      {
        procedure: 'Hernia Repair',
        count: 15,
        successRate: 93.3,
        complications: 1,
        avgDuration: 75,
        mortalityRate: 0,
        readmissions: 0,
        trend: 'up'
      }
    ],
    bySurgeon: [
      {
        surgeon: 'Dr. Smith',
        procedures: 32,
        successRate: 96.9,
        complications: 1,
        avgDuration: 145,
        specialties: ['Cardiothoracic'],
        rating: 4.8
      },
      {
        surgeon: 'Dr. Johnson',
        procedures: 28,
        successRate: 96.4,
        complications: 1,
        avgDuration: 165,
        specialties: ['Orthopedic'],
        rating: 4.7
      },
      {
        surgeon: 'Dr. Brown',
        procedures: 35,
        successRate: 94.3,
        complications: 2,
        avgDuration: 95,
        specialties: ['General Surgery'],
        rating: 4.5
      },
      {
        surgeon: 'Dr. Wilson',
        procedures: 24,
        successRate: 91.7,
        complications: 2,
        avgDuration: 155,
        specialties: ['General Surgery'],
        rating: 4.3
      },
      {
        surgeon: 'Dr. Davis',
        procedures: 26,
        successRate: 92.3,
        complications: 2,
        avgDuration: 135,
        specialties: ['Plastic Surgery'],
        rating: 4.4
      }
    ]
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-orange-600" />
          Surgical Outcome Tracking
        </h2>
        <div className="flex gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-orange-600 hover:bg-orange-700">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-6 w-6 mx-auto text-blue-600 mb-2" />
            <div className="text-2xl font-bold text-blue-600">{outcomeData.summary.totalSurgeries}</div>
            <p className="text-sm text-gray-600">Total Surgeries</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-6 w-6 mx-auto text-green-600 mb-2" />
            <div className="text-2xl font-bold text-green-600">{outcomeData.summary.successRate}%</div>
            <p className="text-sm text-gray-600">Success Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertCircle className="h-6 w-6 mx-auto text-yellow-600 mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{outcomeData.summary.complicationRate}%</div>
            <p className="text-sm text-gray-600">Complications</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingDown className="h-6 w-6 mx-auto text-red-600 mb-2" />
            <div className="text-2xl font-bold text-red-600">{outcomeData.summary.mortalityRate}%</div>
            <p className="text-sm text-gray-600">Mortality</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-6 w-6 mx-auto text-purple-600 mb-2" />
            <div className="text-2xl font-bold text-purple-600">{outcomeData.summary.readmissionRate}%</div>
            <p className="text-sm text-gray-600">Readmissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-6 w-6 mx-auto text-orange-600 mb-2" />
            <div className="text-2xl font-bold text-orange-600">{outcomeData.summary.avgDuration}m</div>
            <p className="text-sm text-gray-600">Avg Duration</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Outcomes by Procedure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {outcomeData.byProcedure.map((procedure, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="font-semibold">{procedure.procedure}</h3>
                      <p className="text-sm text-gray-600">{procedure.count} procedures</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(procedure.trend)}
                      <span className={`font-bold ${getSuccessRateColor(procedure.successRate)}`}>
                        {procedure.successRate}%
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Complications:</p>
                      <p className="font-medium">{procedure.complications}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Avg Duration:</p>
                      <p className="font-medium">{procedure.avgDuration}m</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Readmissions:</p>
                      <p className="font-medium">{procedure.readmissions}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Progress value={procedure.successRate} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Surgeon Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {outcomeData.bySurgeon.map((surgeon, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="font-semibold">{surgeon.surgeon}</h3>
                      <p className="text-sm text-gray-600">{surgeon.specialties.join(', ')}</p>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${getSuccessRateColor(surgeon.successRate)}`}>
                        {surgeon.successRate}%
                      </div>
                      <div className="text-sm text-yellow-600">
                        {getRatingStars(surgeon.rating)} {surgeon.rating}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Procedures:</p>
                      <p className="font-medium">{surgeon.procedures}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Complications:</p>
                      <p className="font-medium">{surgeon.complications}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Avg Duration:</p>
                      <p className="font-medium">{surgeon.avgDuration}m</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Progress value={surgeon.successRate} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quality Benchmarks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">A+</div>
              <p className="text-sm font-medium">Overall Grade</p>
              <p className="text-xs text-gray-600">Above national average</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">12th</div>
              <p className="text-sm font-medium">National Ranking</p>
              <p className="text-xs text-gray-600">Top 5% hospitals</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">98.2%</div>
              <p className="text-sm font-medium">Patient Satisfaction</p>
              <p className="text-xs text-gray-600">Exceeds target</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">⭐⭐⭐⭐⭐</div>
              <p className="text-sm font-medium">Quality Rating</p>
              <p className="text-xs text-gray-600">5-star certification</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
