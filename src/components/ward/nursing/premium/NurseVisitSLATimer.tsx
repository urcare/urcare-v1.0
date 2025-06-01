
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Timer, Clock, AlertTriangle, CheckCircle, User, Bell } from 'lucide-react';

interface NurseVisitSLATimerProps {
  nightMode: boolean;
}

export const NurseVisitSLATimer = ({ nightMode }: NurseVisitSLATimerProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const visits = [
    {
      id: 1,
      patient: 'John Doe',
      room: '301A',
      visitType: 'Medication Round',
      nurse: 'Nurse Johnson',
      scheduledTime: '14:00',
      slaMinutes: 15,
      timeElapsed: 8,
      status: 'on_time',
      priority: 'high',
      compliance: 95
    },
    {
      id: 2,
      patient: 'Jane Smith',
      room: '302B',
      visitType: 'Vital Signs Check',
      nurse: 'Nurse Wilson',
      scheduledTime: '14:15',
      slaMinutes: 10,
      timeElapsed: 12,
      status: 'approaching_limit',
      priority: 'critical',
      compliance: 87
    },
    {
      id: 3,
      patient: 'Mike Brown',
      room: '303A',
      visitType: 'Wound Assessment',
      nurse: 'Nurse Davis',
      scheduledTime: '13:45',
      slaMinutes: 20,
      timeElapsed: 25,
      status: 'overdue',
      priority: 'medium',
      compliance: 78
    },
    {
      id: 4,
      patient: 'Sarah Wilson',
      room: '304B',
      visitType: 'Patient Education',
      nurse: 'Nurse Taylor',
      scheduledTime: '14:30',
      slaMinutes: 30,
      timeElapsed: 0,
      status: 'pending',
      priority: 'low',
      compliance: 92
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_time': return 'bg-green-100 text-green-800 border-green-200';
      case 'approaching_limit': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getProgressPercentage = (elapsed: number, sla: number) => {
    return Math.min((elapsed / sla) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return '[&>div]:bg-red-500';
    if (percentage >= 80) return '[&>div]:bg-orange-500';
    return '[&>div]:bg-green-500';
  };

  const getTimeRemaining = (elapsed: number, sla: number) => {
    const remaining = sla - elapsed;
    if (remaining <= 0) return `${Math.abs(remaining)} min overdue`;
    return `${remaining} min remaining`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Timer className="h-6 w-6 text-green-600" />
          Nurse Visit SLA Timer
        </h2>
        <div className="text-lg font-mono bg-gray-100 px-4 py-2 rounded-lg">
          {currentTime.toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={nightMode ? 'bg-gray-800 border-gray-700' : 'border-green-200 bg-green-50'}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {visits.filter(v => v.status === 'on_time').length}
            </div>
            <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-green-800'}`}>On Time</p>
          </CardContent>
        </Card>
        <Card className={nightMode ? 'bg-gray-800 border-gray-700' : 'border-yellow-200 bg-yellow-50'}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {visits.filter(v => v.status === 'approaching_limit').length}
            </div>
            <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-yellow-800'}`}>Approaching Limit</p>
          </CardContent>
        </Card>
        <Card className={nightMode ? 'bg-gray-800 border-gray-700' : 'border-red-200 bg-red-50'}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {visits.filter(v => v.status === 'overdue').length}
            </div>
            <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-red-800'}`}>Overdue</p>
          </CardContent>
        </Card>
        <Card className={nightMode ? 'bg-gray-800 border-gray-700' : 'border-blue-200 bg-blue-50'}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(visits.reduce((sum, v) => sum + v.compliance, 0) / visits.length)}%
            </div>
            <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-blue-800'}`}>Avg Compliance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {visits.map(visit => (
          <Card key={visit.id} className={`${nightMode ? 'bg-gray-800 border-gray-700' : ''} ${
            visit.status === 'overdue' ? 'border-red-200 bg-red-50' :
            visit.status === 'approaching_limit' ? 'border-yellow-200 bg-yellow-50' :
            visit.status === 'on_time' ? 'border-green-200 bg-green-50' : ''
          }`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{visit.visitType}</CardTitle>
                  <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {visit.patient} - {visit.room}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getPriorityColor(visit.priority)}>
                    {visit.priority.toUpperCase()}
                  </Badge>
                  <Badge className={getStatusColor(visit.status)}>
                    {visit.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>SLA Progress</span>
                  <span className={`font-medium ${
                    visit.status === 'overdue' ? 'text-red-600' :
                    visit.status === 'approaching_limit' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {getTimeRemaining(visit.timeElapsed, visit.slaMinutes)}
                  </span>
                </div>
                <Progress 
                  value={getProgressPercentage(visit.timeElapsed, visit.slaMinutes)} 
                  className={`h-3 ${getProgressColor(getProgressPercentage(visit.timeElapsed, visit.slaMinutes))}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Scheduled:</span>
                  <p className={nightMode ? 'text-gray-300' : 'text-gray-700'}>{visit.scheduledTime}</p>
                </div>
                <div>
                  <span className="font-medium">SLA Target:</span>
                  <p className={nightMode ? 'text-gray-300' : 'text-gray-700'}>{visit.slaMinutes} minutes</p>
                </div>
                <div>
                  <span className="font-medium">Assigned Nurse:</span>
                  <p className={nightMode ? 'text-gray-300' : 'text-gray-700'}>{visit.nurse}</p>
                </div>
                <div>
                  <span className="font-medium">Compliance Rate:</span>
                  <p className={`${
                    visit.compliance >= 90 ? 'text-green-600' :
                    visit.compliance >= 75 ? 'text-yellow-600' :
                    'text-red-600'
                  } font-medium`}>
                    {visit.compliance}%
                  </p>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {visit.status === 'pending' && (
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Start Visit
                  </Button>
                )}
                {(visit.status === 'on_time' || visit.status === 'approaching_limit' || visit.status === 'overdue') && (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Visit
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  Reassign
                </Button>
                <Button size="sm" variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Extend SLA
                </Button>
                {visit.status === 'overdue' && (
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    <Bell className="h-4 w-4 mr-2" />
                    Escalate
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className={nightMode ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader>
          <CardTitle>SLA Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className={`p-4 ${nightMode ? 'bg-gray-700' : 'bg-green-50'} rounded-lg`}>
              <div className="text-2xl font-bold text-green-600">92%</div>
              <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-green-800'}`}>On-Time Rate</p>
            </div>
            <div className={`p-4 ${nightMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg`}>
              <div className="text-2xl font-bold text-blue-600">8 min</div>
              <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-blue-800'}`}>Avg Response Time</p>
            </div>
            <div className={`p-4 ${nightMode ? 'bg-gray-700' : 'bg-yellow-50'} rounded-lg`}>
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-yellow-800'}`}>SLA Breaches Today</p>
            </div>
            <div className={`p-4 ${nightMode ? 'bg-gray-700' : 'bg-purple-50'} rounded-lg`}>
              <div className="text-2xl font-bold text-purple-600">98%</div>
              <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-purple-800'}`}>Patient Satisfaction</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
