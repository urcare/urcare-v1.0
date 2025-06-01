
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ClipboardList, CheckCircle, Clock, AlertTriangle, User, Calendar, Target } from 'lucide-react';

interface NursingCarePlanManagerProps {
  nightMode: boolean;
}

export const NursingCarePlanManager = ({ nightMode }: NursingCarePlanManagerProps) => {
  const [selectedPlan, setSelectedPlan] = useState('all');

  const carePlans = [
    {
      id: 1,
      patient: 'John Doe',
      room: '301A',
      diagnosis: 'Post-operative recovery',
      goals: [
        { id: 1, goal: 'Pain management', status: 'achieved', dueDate: '2024-06-02', priority: 'high' },
        { id: 2, goal: 'Mobility improvement', status: 'in_progress', dueDate: '2024-06-05', priority: 'medium' },
        { id: 3, goal: 'Infection prevention', status: 'in_progress', dueDate: '2024-06-03', priority: 'high' }
      ],
      interventions: [
        'Pain assessment q4h',
        'Encourage ambulation',
        'Wound care BID'
      ],
      progress: 67,
      lastUpdated: '2024-06-01 14:30',
      assignedNurse: 'Nurse Johnson'
    },
    {
      id: 2,
      patient: 'Jane Smith',
      room: '302B',
      diagnosis: 'Cardiac monitoring',
      goals: [
        { id: 4, goal: 'Stable vital signs', status: 'achieved', dueDate: '2024-06-01', priority: 'critical' },
        { id: 5, goal: 'Medication compliance', status: 'in_progress', dueDate: '2024-06-04', priority: 'high' },
        { id: 6, goal: 'Patient education', status: 'not_started', dueDate: '2024-06-06', priority: 'medium' }
      ],
      interventions: [
        'Continuous cardiac monitoring',
        'Medication administration',
        'Diet education'
      ],
      progress: 45,
      lastUpdated: '2024-06-01 13:15',
      assignedNurse: 'Nurse Wilson'
    }
  ];

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'achieved': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'not_started': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'at_risk': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'achieved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'not_started': return <AlertTriangle className="h-4 w-4 text-gray-600" />;
      case 'at_risk': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-orange-600" />
          Nursing Care Plan Management
        </h2>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <ClipboardList className="h-4 w-4 mr-2" />
          Create New Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={nightMode ? 'bg-gray-800 border-gray-700' : 'border-blue-200 bg-blue-50'}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {carePlans.length}
            </div>
            <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-blue-800'}`}>Active Plans</p>
          </CardContent>
        </Card>
        <Card className={nightMode ? 'bg-gray-800 border-gray-700' : 'border-green-200 bg-green-50'}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {carePlans.reduce((sum, plan) => sum + plan.goals.filter(g => g.status === 'achieved').length, 0)}
            </div>
            <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-green-800'}`}>Goals Achieved</p>
          </CardContent>
        </Card>
        <Card className={nightMode ? 'bg-gray-800 border-gray-700' : 'border-yellow-200 bg-yellow-50'}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {carePlans.reduce((sum, plan) => sum + plan.goals.filter(g => g.status === 'in_progress').length, 0)}
            </div>
            <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-yellow-800'}`}>In Progress</p>
          </CardContent>
        </Card>
        <Card className={nightMode ? 'bg-gray-800 border-gray-700' : 'border-purple-200 bg-purple-50'}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(carePlans.reduce((sum, plan) => sum + plan.progress, 0) / carePlans.length)}%
            </div>
            <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-purple-800'}`}>Avg Progress</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {carePlans.map(plan => (
          <Card key={plan.id} className={nightMode ? 'bg-gray-800 border-gray-700' : ''}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{plan.patient} - {plan.room}</CardTitle>
                  <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Diagnosis: {plan.diagnosis}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Overall Progress</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={plan.progress} className="w-20 h-2" />
                    <span className="text-sm font-medium">{plan.progress}%</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Goals Section */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Care Goals ({plan.goals.length})
                  </h4>
                  <div className="space-y-3">
                    {plan.goals.map(goal => (
                      <div key={goal.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="font-medium">{goal.goal}</p>
                            <p className={`text-sm ${nightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Due: {goal.dueDate}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getPriorityColor(goal.priority)}>
                              {goal.priority.toUpperCase()}
                            </Badge>
                            <Badge className={getGoalStatusColor(goal.status)}>
                              {getStatusIcon(goal.status)}
                              <span className="ml-1">{goal.status.replace('_', ' ').toUpperCase()}</span>
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Update Status</Button>
                          <Button size="sm" variant="outline">Add Note</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interventions Section */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    Nursing Interventions
                  </h4>
                  <div className="space-y-2">
                    {plan.interventions.map((intervention, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 border rounded">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="flex-1">{intervention}</span>
                        <Button size="sm" variant="outline">Edit</Button>
                      </div>
                    ))}
                  </div>
                  <Button size="sm" className="mt-3 w-full" variant="outline">
                    Add Intervention
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>Assigned: {plan.assignedNurse}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Last Updated: {plan.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Update Plan
                    </Button>
                    <Button size="sm" variant="outline">
                      Print Plan
                    </Button>
                    <Button size="sm" variant="outline">
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className={nightMode ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader>
          <CardTitle>Care Plan Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className={`p-4 ${nightMode ? 'bg-gray-700' : 'bg-green-50'} rounded-lg`}>
              <div className="text-2xl font-bold text-green-600">85%</div>
              <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-green-800'}`}>Goal Achievement Rate</p>
            </div>
            <div className={`p-4 ${nightMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg`}>
              <div className="text-2xl font-bold text-blue-600">2.3</div>
              <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-blue-800'}`}>Avg Days to Goal</p>
            </div>
            <div className={`p-4 ${nightMode ? 'bg-gray-700' : 'bg-purple-50'} rounded-lg`}>
              <div className="text-2xl font-bold text-purple-600">12</div>
              <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-purple-800'}`}>Plans This Month</p>
            </div>
            <div className={`p-4 ${nightMode ? 'bg-gray-700' : 'bg-yellow-50'} rounded-lg`}>
              <div className="text-2xl font-bold text-yellow-600">96%</div>
              <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-yellow-800'}`}>Update Compliance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
