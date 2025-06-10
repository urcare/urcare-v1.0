
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Calendar, User, BarChart3, Activity } from 'lucide-react';

export const ProgressMonitoringInterface = () => {
  const [selectedPatient, setSelectedPatient] = useState('patient-1');

  const patients = [
    {
      id: 'patient-1',
      name: 'John Smith',
      condition: 'Post-knee surgery',
      startDate: '2024-01-01',
      progress: 78,
      status: 'on-track',
      therapyType: 'Physical Therapy'
    },
    {
      id: 'patient-2',
      name: 'Maria Garcia',
      condition: 'Stroke recovery',
      startDate: '2023-12-15',
      progress: 65,
      status: 'improving',
      therapyType: 'Occupational Therapy'
    },
    {
      id: 'patient-3',
      name: 'Robert Wilson',
      condition: 'Speech impairment',
      startDate: '2024-01-10',
      progress: 45,
      status: 'needs-attention',
      therapyType: 'Speech Therapy'
    }
  ];

  const functionalAssessments = [
    { id: 1, assessment: 'Range of Motion', current: 85, target: 95, unit: 'degrees', trend: 'up' },
    { id: 2, assessment: 'Strength', current: 7, target: 10, unit: '/10', trend: 'up' },
    { id: 3, assessment: 'Balance', current: 6, target: 9, unit: '/10', trend: 'stable' },
    { id: 4, assessment: 'Pain Level', current: 3, target: 1, unit: '/10', trend: 'down' },
    { id: 5, assessment: 'Endurance', current: 12, target: 20, unit: 'minutes', trend: 'up' }
  ];

  const goals = [
    { id: 1, goal: 'Walk 100 meters without assistance', progress: 85, status: 'on-track', dueDate: '2024-02-15' },
    { id: 2, goal: 'Climb stairs independently', progress: 60, status: 'in-progress', dueDate: '2024-02-28' },
    { id: 3, goal: 'Return to work activities', progress: 40, status: 'planning', dueDate: '2024-03-15' },
    { id: 4, goal: 'Full knee flexion (120°)', progress: 75, status: 'on-track', dueDate: '2024-02-20' }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'on-track': return 'bg-green-500 text-white';
      case 'improving': return 'bg-blue-500 text-white';
      case 'needs-attention': return 'bg-orange-500 text-white';
      case 'in-progress': return 'bg-yellow-500 text-white';
      case 'planning': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      case 'stable': return <Activity className="h-4 w-4 text-yellow-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Progress Monitoring</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            View Reports
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <TrendingUp className="h-4 w-4 mr-2" />
            Update Assessment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patients.map((patient) => (
                <div 
                  key={patient.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPatient === patient.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPatient(patient.id)}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{patient.name}</h3>
                      <Badge className={getStatusColor(patient.status)}>
                        {patient.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{patient.condition}</p>
                    <p className="text-sm text-gray-600">{patient.therapyType}</p>
                    <div className="flex items-center gap-2">
                      <Progress value={patient.progress} className="flex-1" />
                      <span className="text-sm text-gray-600">{patient.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Functional Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {functionalAssessments.map((assessment) => (
                <div key={assessment.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{assessment.assessment}</h3>
                    {getTrendIcon(assessment.trend)}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Current:</span>
                      <div className="font-bold text-blue-600">
                        {assessment.current}{assessment.unit}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Target:</span>
                      <div className="font-bold text-green-600">
                        {assessment.target}{assessment.unit}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Progress:</span>
                      <div className="font-bold">
                        {Math.round((assessment.current / assessment.target) * 100)}%
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={(assessment.current / assessment.target) * 100} 
                    className="mt-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Treatment Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => (
              <Card key={goal.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-sm">{goal.goal}</h3>
                      <Badge className={getStatusColor(goal.status)}>
                        {goal.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={goal.progress} className="flex-1" />
                      <span className="text-sm text-gray-600">{goal.progress}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="h-3 w-3" />
                      Due: {goal.dueDate}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progress Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800">Goals Achieved</h3>
              <div className="text-2xl font-bold text-green-600">12</div>
              <p className="text-sm text-green-600">This month</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800">Average Progress</h3>
              <div className="text-2xl font-bold text-blue-600">76%</div>
              <p className="text-sm text-blue-600">All patients</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-800">Sessions Completed</h3>
              <div className="text-2xl font-bold text-orange-600">248</div>
              <p className="text-sm text-orange-600">This month</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-800">Adherence Rate</h3>
              <div className="text-2xl font-bold text-purple-600">89%</div>
              <p className="text-sm text-purple-600">Treatment plans</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
