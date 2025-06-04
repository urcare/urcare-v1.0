
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  Users, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  User,
  Stethoscope
} from 'lucide-react';

interface CareTimeline {
  id: string;
  patientName: string;
  primaryCondition: string;
  specialists: string[];
  totalAppointments: number;
  completedAppointments: number;
  nextAppointment: string;
  coordinationScore: number;
  urgency: 'critical' | 'high' | 'routine';
  status: 'active' | 'coordinating' | 'completed' | 'delayed';
  estimatedCompletion: string;
}

const mockTimelines: CareTimeline[] = [
  {
    id: 'MT001',
    patientName: 'Jennifer Adams',
    primaryCondition: 'Cardiac Surgery Recovery',
    specialists: ['Cardiology', 'Cardiac Surgery', 'Physical Therapy', 'Nutrition'],
    totalAppointments: 8,
    completedAppointments: 5,
    nextAppointment: '2024-01-25 10:00 - Cardiology',
    coordinationScore: 92,
    urgency: 'high',
    status: 'active',
    estimatedCompletion: '2024-02-15'
  },
  {
    id: 'MT002',
    patientName: 'Robert Kim',
    primaryCondition: 'Complex Diabetes Management',
    specialists: ['Endocrinology', 'Ophthalmology', 'Podiatry', 'Nephrology'],
    totalAppointments: 6,
    completedAppointments: 3,
    nextAppointment: '2024-01-24 14:30 - Endocrinology',
    coordinationScore: 87,
    urgency: 'routine',
    status: 'coordinating',
    estimatedCompletion: '2024-02-28'
  }
];

export const MultiSpecialtyTimelineCoordinator = () => {
  const [timelines] = useState<CareTimeline[]>(mockTimelines);
  const [selectedTimeline, setSelectedTimeline] = useState<CareTimeline | null>(null);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'routine': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'coordinating': return 'bg-yellow-500 text-white';
      case 'completed': return 'bg-gray-500 text-white';
      case 'delayed': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Multi-Specialty Timeline Coordinator
          </CardTitle>
          <CardDescription>
            Care sequence optimization with intelligent appointment scheduling and provider communication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{timelines.length}</p>
                    <p className="text-sm text-gray-600">Active Timelines</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">89%</p>
                    <p className="text-sm text-gray-600">Coordination Score</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">12</p>
                    <p className="text-sm text-gray-600">Specialists Involved</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">2.1 days</p>
                    <p className="text-sm text-gray-600">Avg Wait Time</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Care Coordination Timelines</h3>
              {timelines.map((timeline) => (
                <Card 
                  key={timeline.id} 
                  className={`cursor-pointer transition-colors ${selectedTimeline?.id === timeline.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-blue-400`}
                  onClick={() => setSelectedTimeline(timeline)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-gray-500" />
                          <h4 className="font-semibold">{timeline.patientName}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{timeline.primaryCondition}</p>
                        <p className="text-sm font-medium text-blue-600">{timeline.specialists.length} specialists involved</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getUrgencyColor(timeline.urgency)}>
                          {timeline.urgency.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(timeline.status)}>
                          {timeline.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Care Progress</span>
                        <span className="font-bold">{timeline.completedAppointments}/{timeline.totalAppointments}</span>
                      </div>
                      <Progress value={(timeline.completedAppointments / timeline.totalAppointments) * 100} className="h-2" />
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Coordination Score</span>
                        <span className="font-bold">{timeline.coordinationScore}%</span>
                      </div>
                      <Progress value={timeline.coordinationScore} className="h-2" />
                      
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>Next: {timeline.nextAppointment.split(' - ')[1]}</span>
                        </div>
                        <div className="text-sm text-blue-600">
                          <span>{timeline.nextAppointment.split(' - ')[0]}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedTimeline ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedTimeline.patientName}</CardTitle>
                    <CardDescription>{selectedTimeline.primaryCondition}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Timeline Overview</h4>
                          <div className="space-y-1 text-sm">
                            <p>Progress: <strong>{selectedTimeline.completedAppointments}/{selectedTimeline.totalAppointments}</strong></p>
                            <p>Coordination: <strong>{selectedTimeline.coordinationScore}%</strong></p>
                            <p>Est. Completion: <strong>{selectedTimeline.estimatedCompletion}</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Status Details</h4>
                          <div className="space-y-1 text-sm">
                            <p>Urgency: <strong>{selectedTimeline.urgency}</strong></p>
                            <p>Status: <strong>{selectedTimeline.status}</strong></p>
                            <p>Specialists: <strong>{selectedTimeline.specialists.length}</strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Involved Specialists</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedTimeline.specialists.map((specialist, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm p-2 bg-blue-50 rounded">
                              <Stethoscope className="h-4 w-4 text-blue-600" />
                              <span>{specialist}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Care Sequence Timeline</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-green-50 rounded">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">Initial Cardiology Consultation</p>
                              <p className="text-xs text-gray-500">Jan 10, 2024 - Completed</p>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400 mx-auto" />
                          <div className="flex items-center gap-3 p-3 bg-green-50 rounded">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">Pre-Surgery Assessment</p>
                              <p className="text-xs text-gray-500">Jan 15, 2024 - Completed</p>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400 mx-auto" />
                          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded">
                            <AlertCircle className="h-5 w-5 text-blue-600" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">Follow-up Cardiology</p>
                              <p className="text-xs text-gray-500">Jan 25, 2024 - Upcoming</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">AI Optimization Suggestions</h4>
                        <div className="text-sm bg-green-50 p-3 rounded space-y-1">
                          <p>• Schedule Physical Therapy 2 days after next cardiology visit</p>
                          <p>• Coordinate nutrition consultation with PT appointment</p>
                          <p>• Add 1-week buffer between intensive appointments</p>
                          <p>• Ensure all reports are shared before each consultation</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <Calendar className="h-4 w-4 mr-1" />
                          Optimize Schedule
                        </Button>
                        <Button variant="outline">
                          <Users className="h-4 w-4 mr-1" />
                          Coordinate Team
                        </Button>
                        <Button variant="outline">
                          <Clock className="h-4 w-4 mr-1" />
                          Adjust Timeline
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a care timeline to view coordination details and optimization options</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
