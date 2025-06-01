
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Timer, Clock, AlertTriangle, CheckCircle, Play, Pause } from 'lucide-react';

export const TimeBasedTaskTracker = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const tasks = [
    {
      id: 1,
      patient: 'John Doe',
      room: '301A',
      task: 'Post-op vitals check',
      startTime: '09:00',
      deadline: '09:15',
      duration: 15,
      timeElapsed: 8,
      status: 'in_progress',
      priority: 'high',
      nurse: 'Nurse Johnson',
      notes: 'Every 15 minutes for first 2 hours post-op'
    },
    {
      id: 2,
      patient: 'Jane Smith',
      room: '302B',
      task: 'Neurological assessment',
      startTime: '09:30',
      deadline: '09:45',
      duration: 15,
      timeElapsed: 0,
      status: 'pending',
      priority: 'critical',
      nurse: 'Nurse Wilson',
      notes: 'Post-stroke monitoring - hourly checks'
    },
    {
      id: 3,
      patient: 'Mike Brown',
      room: '303A',
      task: 'Wound drainage monitoring',
      startTime: '08:45',
      deadline: '09:00',
      duration: 15,
      timeElapsed: 15,
      status: 'completed',
      priority: 'medium',
      nurse: 'Nurse Davis',
      notes: 'Document output every hour'
    },
    {
      id: 4,
      patient: 'Sarah Wilson',
      room: '304B',
      task: 'Blood glucose check',
      startTime: '08:30',
      deadline: '08:45',
      duration: 15,
      timeElapsed: 20,
      status: 'overdue',
      priority: 'high',
      nurse: 'Nurse Taylor',
      notes: 'Pre-meal glucose monitoring'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
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

  const getProgressPercentage = (task: any) => {
    if (task.status === 'completed') return 100;
    if (task.status === 'pending') return 0;
    if (task.status === 'overdue') return 100;
    return Math.min((task.timeElapsed / task.duration) * 100, 100);
  };

  const getTimeRemaining = (task: any) => {
    if (task.status === 'completed') return 'Completed';
    if (task.status === 'pending') return `${task.duration} min`;
    if (task.status === 'overdue') return `${task.timeElapsed - task.duration} min overdue`;
    return `${task.duration - task.timeElapsed} min remaining`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Play className="h-4 w-4 text-blue-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Timer className="h-6 w-6 text-orange-600" />
          Time-Based Task Tracker
        </h2>
        <div className="text-lg font-mono bg-gray-100 px-4 py-2 rounded-lg">
          {currentTime.toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {tasks.filter(t => t.status === 'in_progress').length}
            </div>
            <p className="text-sm text-blue-800">In Progress</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {tasks.filter(t => t.status === 'pending').length}
            </div>
            <p className="text-sm text-yellow-800">Pending</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {tasks.filter(t => t.status === 'overdue').length}
            </div>
            <p className="text-sm text-red-800">Overdue</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {tasks.filter(t => t.status === 'completed').length}
            </div>
            <p className="text-sm text-green-800">Completed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tasks.map(task => (
          <Card key={task.id} className={`${
            task.status === 'overdue' ? 'border-red-200 bg-red-50' :
            task.status === 'in_progress' ? 'border-blue-200 bg-blue-50' :
            task.status === 'completed' ? 'border-green-200 bg-green-50' :
            'border-yellow-200 bg-yellow-50'
          }`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{task.task}</CardTitle>
                  <p className="text-sm text-gray-600">{task.patient} - {task.room}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority.toUpperCase()}
                  </Badge>
                  <Badge className={getStatusColor(task.status)}>
                    {getStatusIcon(task.status)}
                    <span className="ml-1">{task.status.replace('_', ' ').toUpperCase()}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Progress</span>
                  <span className={`font-medium ${
                    task.status === 'overdue' ? 'text-red-600' :
                    task.status === 'completed' ? 'text-green-600' :
                    'text-blue-600'
                  }`}>
                    {getTimeRemaining(task)}
                  </span>
                </div>
                <Progress 
                  value={getProgressPercentage(task)} 
                  className={`h-2 ${
                    task.status === 'overdue' ? '[&>div]:bg-red-500' :
                    task.status === 'completed' ? '[&>div]:bg-green-500' :
                    '[&>div]:bg-blue-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Start Time:</span> {task.startTime}
                </div>
                <div>
                  <span className="font-medium">Deadline:</span> {task.deadline}
                </div>
                <div>
                  <span className="font-medium">Duration:</span> {task.duration} min
                </div>
                <div>
                  <span className="font-medium">Nurse:</span> {task.nurse}
                </div>
              </div>

              <div className="text-sm">
                <span className="font-medium">Notes:</span>
                <p className="text-gray-700 mt-1">{task.notes}</p>
              </div>

              <div className="flex gap-2">
                {task.status === 'pending' && (
                  <>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Play className="h-4 w-4 mr-2" />
                      Start Task
                    </Button>
                    <Button size="sm" variant="outline">
                      Reschedule
                    </Button>
                  </>
                )}
                {task.status === 'in_progress' && (
                  <>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete
                    </Button>
                    <Button size="sm" variant="outline">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  </>
                )}
                {task.status === 'overdue' && (
                  <>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Complete Now
                    </Button>
                    <Button size="sm" variant="outline">
                      Document Delay
                    </Button>
                  </>
                )}
                {task.status === 'completed' && (
                  <Button size="sm" variant="outline" disabled>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Completed
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Time Management Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">92%</div>
              <p className="text-sm text-blue-800">On-Time Completion</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">12 min</div>
              <p className="text-sm text-green-800">Avg Task Duration</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <p className="text-sm text-yellow-800">Tasks This Hour</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">85%</div>
              <p className="text-sm text-purple-800">Efficiency Score</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
