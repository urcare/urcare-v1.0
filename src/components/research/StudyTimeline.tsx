
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Target,
  TrendingUp,
  ChevronRight
} from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  type: 'enrollment' | 'visit' | 'analysis' | 'regulatory' | 'publication';
  targetDate: string;
  actualDate?: string;
  status: 'upcoming' | 'in_progress' | 'completed' | 'delayed';
  progress: number;
  description: string;
  responsible: string;
}

interface StudyPhase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'completed' | 'active' | 'upcoming';
  milestones: Milestone[];
}

export const StudyTimeline = () => {
  const [selectedStudy, setSelectedStudy] = useState('cardio-001');
  const [selectedView, setSelectedView] = useState('timeline');

  const studyPhases: StudyPhase[] = [
    {
      id: 'startup',
      name: 'Study Startup',
      startDate: '2023-06-01',
      endDate: '2023-09-30',
      status: 'completed',
      milestones: [
        {
          id: '1',
          title: 'IRB Approval',
          type: 'regulatory',
          targetDate: '2023-07-15',
          actualDate: '2023-07-10',
          status: 'completed',
          progress: 100,
          description: 'Institutional Review Board approval obtained',
          responsible: 'Regulatory Team'
        },
        {
          id: '2',
          title: 'Site Initiation',
          type: 'regulatory',
          targetDate: '2023-09-01',
          actualDate: '2023-08-28',
          status: 'completed',
          progress: 100,
          description: 'All study sites initiated and ready for enrollment',
          responsible: 'Clinical Operations'
        }
      ]
    },
    {
      id: 'enrollment',
      name: 'Patient Enrollment',
      startDate: '2023-10-01',
      endDate: '2024-06-30',
      status: 'active',
      milestones: [
        {
          id: '3',
          title: 'First Patient Enrolled',
          type: 'enrollment',
          targetDate: '2023-10-15',
          actualDate: '2023-10-12',
          status: 'completed',
          progress: 100,
          description: 'First patient successfully enrolled in study',
          responsible: 'Site Investigators'
        },
        {
          id: '4',
          title: '50% Enrollment Target',
          type: 'enrollment',
          targetDate: '2024-02-15',
          actualDate: '2024-01-30',
          status: 'completed',
          progress: 100,
          description: 'Reached 50% of target enrollment (125 patients)',
          responsible: 'Clinical Operations'
        },
        {
          id: '5',
          title: 'Last Patient Enrolled',
          type: 'enrollment',
          targetDate: '2024-06-30',
          status: 'in_progress',
          progress: 78,
          description: 'Complete enrollment of 250 patients',
          responsible: 'Site Investigators'
        }
      ]
    },
    {
      id: 'treatment',
      name: 'Treatment Phase',
      startDate: '2023-10-01',
      endDate: '2024-12-31',
      status: 'active',
      milestones: [
        {
          id: '6',
          title: 'First Patient Last Visit',
          type: 'visit',
          targetDate: '2024-04-15',
          actualDate: '2024-04-10',
          status: 'completed',
          progress: 100,
          description: 'First enrolled patient completed all visits',
          responsible: 'Site Investigators'
        },
        {
          id: '7',
          title: '50% Patients Completed',
          type: 'visit',
          targetDate: '2024-09-30',
          status: 'in_progress',
          progress: 45,
          description: '50% of patients completed treatment phase',
          responsible: 'Clinical Operations'
        },
        {
          id: '8',
          title: 'Last Patient Last Visit',
          type: 'visit',
          targetDate: '2024-12-31',
          status: 'upcoming',
          progress: 0,
          description: 'All patients completed treatment and follow-up',
          responsible: 'Site Investigators'
        }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'upcoming': return <Calendar className="h-5 w-5 text-gray-400" />;
      case 'delayed': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <Calendar className="h-5 w-5 text-gray-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'enrollment': return <Users className="h-4 w-4" />;
      case 'visit': return <Calendar className="h-4 w-4" />;
      case 'analysis': return <TrendingUp className="h-4 w-4" />;
      case 'regulatory': return <CheckCircle className="h-4 w-4" />;
      case 'publication': return <Target className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    const colorMap = {
      enrollment: 'bg-blue-500',
      visit: 'bg-green-500',
      analysis: 'bg-purple-500',
      regulatory: 'bg-orange-500',
      publication: 'bg-teal-500'
    };
    return colorMap[type as keyof typeof colorMap] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Study Timeline</h2>
          <p className="text-gray-600">Track study milestones and progress</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedStudy} onValueChange={setSelectedStudy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select study" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cardio-001">CARDIO-001</SelectItem>
              <SelectItem value="neuro-002">NEURO-002</SelectItem>
              <SelectItem value="onco-003">ONCO-003</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedView} onValueChange={setSelectedView}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="timeline">Timeline View</SelectItem>
              <SelectItem value="milestones">Milestones View</SelectItem>
              <SelectItem value="gantt">Gantt Chart</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Study Overview */}
      <Card>
        <CardHeader>
          <CardTitle>CARDIO-001 - Cardiovascular Prevention Trial</CardTitle>
          <CardDescription>Study Duration: June 2023 - March 2025 | Phase III</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">78%</p>
              <p className="text-sm text-gray-600">Overall Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">195</p>
              <p className="text-sm text-gray-600">Enrolled / 250 Target</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">12</p>
              <p className="text-sm text-gray-600">Active Sites</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">8</p>
              <p className="text-sm text-gray-600">Months Remaining</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline View */}
      <div className="space-y-6">
        {studyPhases.map((phase, phaseIndex) => (
          <Card key={phase.id} className="overflow-hidden">
            <CardHeader className={`${
              phase.status === 'completed' ? 'bg-green-50 border-green-200' :
              phase.status === 'active' ? 'bg-blue-50 border-blue-200' :
              'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {phase.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {phase.status === 'active' && <Clock className="h-5 w-5 text-blue-500" />}
                    {phase.status === 'upcoming' && <Calendar className="h-5 w-5 text-gray-400" />}
                    {phase.name}
                  </CardTitle>
                  <CardDescription>
                    {phase.startDate} - {phase.endDate}
                  </CardDescription>
                </div>
                <Badge className={`${
                  phase.status === 'completed' ? 'bg-green-500' :
                  phase.status === 'active' ? 'bg-blue-500' :
                  'bg-gray-500'
                } text-white`}>
                  {phase.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {phase.milestones.map((milestone, milestoneIndex) => (
                  <div key={milestone.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center">
                      {getStatusIcon(milestone.status)}
                      {milestoneIndex < phase.milestones.length - 1 && (
                        <div className="w-px h-12 bg-gray-200 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                        <Badge className={`${getTypeColor(milestone.type)} text-white flex items-center gap-1`}>
                          {getTypeIcon(milestone.type)}
                          {milestone.type.charAt(0).toUpperCase() + milestone.type.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Target Date:</span>
                          <p className="text-gray-600">{milestone.targetDate}</p>
                        </div>
                        {milestone.actualDate && (
                          <div>
                            <span className="font-medium text-gray-700">Actual Date:</span>
                            <p className="text-gray-600">{milestone.actualDate}</p>
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-gray-700">Responsible:</span>
                          <p className="text-gray-600">{milestone.responsible}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Progress:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={milestone.progress} className="flex-1" />
                            <span className="text-xs text-gray-600">{milestone.progress}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
