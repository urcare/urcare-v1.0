
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClipboardList, Clock, User, AlertCircle, CheckCircle2, Play } from 'lucide-react';

export const NurseTaskboard = () => {
  const [selectedShift, setSelectedShift] = useState('day');
  const [filterPriority, setFilterPriority] = useState('all');

  const tasks = [
    {
      id: 1,
      patient: 'John Doe',
      room: '301A',
      task: 'Vital Signs Check',
      priority: 'high',
      status: 'pending',
      assignedTo: 'Nurse Johnson',
      dueTime: '09:00',
      estimatedDuration: '15 min',
      notes: 'Patient had fever yesterday'
    },
    {
      id: 2,
      patient: 'Jane Smith',
      room: '302B',
      task: 'Medication Administration',
      priority: 'critical',
      status: 'in_progress',
      assignedTo: 'Nurse Wilson',
      dueTime: '09:30',
      estimatedDuration: '20 min',
      notes: 'IV antibiotics'
    },
    {
      id: 3,
      patient: 'Mike Brown',
      room: '303A',
      task: 'Wound Dressing Change',
      priority: 'medium',
      status: 'completed',
      assignedTo: 'Nurse Davis',
      dueTime: '10:00',
      estimatedDuration: '30 min',
      notes: 'Post-surgical wound care'
    },
    {
      id: 4,
      patient: 'Sarah Wilson',
      room: '304B',
      task: 'Blood Draw',
      priority: 'high',
      status: 'pending',
      assignedTo: 'Nurse Johnson',
      dueTime: '10:30',
      estimatedDuration: '10 min',
      notes: 'Fasting blood work'
    },
    {
      id: 5,
      patient: 'Tom Anderson',
      room: '305A',
      task: 'Patient Assessment',
      priority: 'medium',
      status: 'pending',
      assignedTo: 'Nurse Taylor',
      dueTime: '11:00',
      estimatedDuration: '25 min',
      notes: 'Pre-discharge assessment'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Play className="h-4 w-4 text-blue-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'overdue': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredTasks = tasks.filter(task => 
    filterPriority === 'all' || task.priority === filterPriority
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-purple-600" />
          Nurse Taskboard
        </h2>
        <div className="flex gap-4">
          <Select value={selectedShift} onValueChange={setSelectedShift}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day Shift</SelectItem>
              <SelectItem value="evening">Evening Shift</SelectItem>
              <SelectItem value="night">Night Shift</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              Pending ({filteredTasks.filter(t => t.status === 'pending').length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredTasks.filter(task => task.status === 'pending').map(task => (
              <div key={task.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{task.task}</h4>
                    <p className="text-sm text-gray-600">{task.patient} - {task.room}</p>
                  </div>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Due: {task.dueTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{task.assignedTo}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{task.notes}</p>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">Start Task</Button>
                  <Button size="sm" variant="outline">Reassign</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* In Progress Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Play className="h-5 w-5 text-blue-600" />
              In Progress ({filteredTasks.filter(t => t.status === 'in_progress').length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredTasks.filter(task => task.status === 'in_progress').map(task => (
              <div key={task.id} className="border rounded-lg p-4 space-y-3 bg-blue-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{task.task}</h4>
                    <p className="text-sm text-gray-600">{task.patient} - {task.room}</p>
                  </div>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Started: {task.dueTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{task.assignedTo}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{task.notes}</p>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">Complete</Button>
                  <Button size="sm" variant="outline">Add Note</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Completed Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Completed ({filteredTasks.filter(t => t.status === 'completed').length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredTasks.filter(task => task.status === 'completed').map(task => (
              <div key={task.id} className="border rounded-lg p-4 space-y-3 bg-green-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{task.task}</h4>
                    <p className="text-sm text-gray-600">{task.patient} - {task.room}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    COMPLETED
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Completed: {task.dueTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{task.assignedTo}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{task.notes}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shift Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{filteredTasks.length}</div>
              <p className="text-sm text-blue-800">Total Tasks</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredTasks.filter(t => t.status === 'pending').length}
              </div>
              <p className="text-sm text-yellow-800">Pending</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {filteredTasks.filter(t => t.status === 'completed').length}
              </div>
              <p className="text-sm text-green-800">Completed</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {filteredTasks.filter(t => t.priority === 'critical').length}
              </div>
              <p className="text-sm text-red-800">Critical Priority</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
