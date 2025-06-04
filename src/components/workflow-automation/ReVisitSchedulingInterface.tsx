
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  User, 
  Bell,
  CheckCircle,
  AlertCircle,
  Bot,
  Send
} from 'lucide-react';

interface ReVisitSchedule {
  id: string;
  patientName: string;
  condition: string;
  lastVisit: string;
  suggestedDate: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  doctor: string;
  department: string;
  reason: string;
  aiConfidence: number;
  status: 'suggested' | 'scheduled' | 'confirmed' | 'completed';
  notificationsSent: number;
}

const mockSchedules: ReVisitSchedule[] = [
  {
    id: 'RS001',
    patientName: 'Emma Thompson',
    condition: 'Hypertension Follow-up',
    lastVisit: '2023-12-15',
    suggestedDate: '2024-01-22 10:00',
    priority: 'high',
    doctor: 'Dr. Robert Chen',
    department: 'Cardiology',
    reason: 'Blood pressure monitoring and medication adjustment',
    aiConfidence: 92,
    status: 'suggested',
    notificationsSent: 0
  },
  {
    id: 'RS002',
    patientName: 'James Wilson',
    condition: 'Diabetes Management',
    lastVisit: '2023-12-20',
    suggestedDate: '2024-01-25 14:30',
    priority: 'normal',
    doctor: 'Dr. Lisa Martinez',
    department: 'Endocrinology',
    reason: 'Quarterly HbA1c review and lifestyle counseling',
    aiConfidence: 87,
    status: 'scheduled',
    notificationsSent: 1
  }
];

export const ReVisitSchedulingInterface = () => {
  const [schedules] = useState<ReVisitSchedule[]>(mockSchedules);
  const [selectedSchedule, setSelectedSchedule] = useState<ReVisitSchedule | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'normal': return 'bg-blue-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'suggested': return 'bg-yellow-500 text-white';
      case 'scheduled': return 'bg-blue-500 text-white';
      case 'confirmed': return 'bg-green-500 text-white';
      case 'completed': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Re-visit Scheduling Interface
          </CardTitle>
          <CardDescription>
            Automated appointment suggestions with patient notifications and care coordination
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{schedules.length}</p>
                    <p className="text-sm text-gray-600">Suggested Visits</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <Bot className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">89%</p>
                    <p className="text-sm text-gray-600">AI Accuracy</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <Bell className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{schedules.reduce((sum, s) => sum + s.notificationsSent, 0)}</p>
                    <p className="text-sm text-gray-600">Notifications Sent</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">94%</p>
                    <p className="text-sm text-gray-600">Attendance Rate</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">AI-Suggested Re-visits</h3>
              {schedules.map((schedule) => (
                <Card 
                  key={schedule.id} 
                  className={`cursor-pointer transition-colors ${selectedSchedule?.id === schedule.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-green-400`}
                  onClick={() => setSelectedSchedule(schedule)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-gray-500" />
                          <h4 className="font-semibold">{schedule.patientName}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{schedule.condition}</p>
                        <p className="text-sm font-medium text-blue-600">{schedule.department}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getPriorityColor(schedule.priority)}>
                          {schedule.priority.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(schedule.status)}>
                          {schedule.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Last Visit:</span>
                          <p className="font-medium">{schedule.lastVisit}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Suggested:</span>
                          <p className="font-medium">{schedule.suggestedDate}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Bot className="h-3 w-3" />
                          <span>AI Confidence: {schedule.aiConfidence}%</span>
                        </div>
                        {schedule.notificationsSent > 0 && (
                          <div className="flex items-center gap-1 text-sm text-blue-600">
                            <Bell className="h-3 w-3" />
                            <span>{schedule.notificationsSent} sent</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedSchedule ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedSchedule.patientName}</CardTitle>
                    <CardDescription>{selectedSchedule.condition}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Schedule Details</h4>
                          <div className="space-y-1 text-sm">
                            <p>Doctor: <strong>{selectedSchedule.doctor}</strong></p>
                            <p>Department: <strong>{selectedSchedule.department}</strong></p>
                            <p>Suggested Date: <strong>{selectedSchedule.suggestedDate}</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">AI Analysis</h4>
                          <div className="space-y-1 text-sm">
                            <p>Confidence: <strong>{selectedSchedule.aiConfidence}%</strong></p>
                            <p>Priority: <strong>{selectedSchedule.priority}</strong></p>
                            <p>Status: <strong>{selectedSchedule.status}</strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Visit Reason</h4>
                        <p className="text-sm bg-blue-50 p-3 rounded">{selectedSchedule.reason}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">AI Recommendations</h4>
                        <div className="text-sm bg-green-50 p-3 rounded space-y-1">
                          <p>• Optimal timing based on treatment protocol and patient history</p>
                          <p>• Consider morning appointment for better patient compliance</p>
                          <p>• Recommend pre-visit preparation checklist</p>
                          <p>• Schedule follow-up lab work 3 days prior to visit</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Notification History</h4>
                        <div className="text-sm">
                          {selectedSchedule.notificationsSent > 0 ? (
                            <p className="text-blue-600">{selectedSchedule.notificationsSent} notification(s) sent to patient</p>
                          ) : (
                            <p className="text-gray-500">No notifications sent yet</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule Appointment
                        </Button>
                        <Button variant="outline">
                          <Send className="h-4 w-4 mr-1" />
                          Send Notification
                        </Button>
                        <Button variant="outline">
                          <Clock className="h-4 w-4 mr-1" />
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a re-visit schedule to view details and management options</p>
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
