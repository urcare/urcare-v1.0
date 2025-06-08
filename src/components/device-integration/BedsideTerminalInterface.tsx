
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Tablet, 
  User, 
  Pill, 
  FileText, 
  QrCode,
  CheckCircle,
  AlertTriangle,
  Clock,
  Shield
} from 'lucide-react';

export const BedsideTerminalInterface = () => {
  const [selectedTerminal, setSelectedTerminal] = useState('terminal-1');

  const terminals = [
    {
      id: 'terminal-1',
      location: 'Room 201A',
      patient: 'John Smith',
      status: 'active',
      lastLogin: 'Nurse Sarah - 2 mins ago',
      pendingTasks: 3,
      medications: 2,
      alerts: [],
      battery: 85,
      connectivity: 'excellent'
    },
    {
      id: 'terminal-2',
      location: 'ICU - Bed 3',
      patient: 'Mary Johnson',
      status: 'active',
      lastLogin: 'Dr. Wilson - 5 mins ago',
      pendingTasks: 7,
      medications: 4,
      alerts: ['Medication overdue'],
      battery: 45,
      connectivity: 'good'
    },
    {
      id: 'terminal-3',
      location: 'Room 305B',
      patient: 'Robert Davis',
      status: 'locked',
      lastLogin: 'Nurse Maria - 1 hour ago',
      pendingTasks: 1,
      medications: 1,
      alerts: ['Authentication timeout'],
      battery: 92,
      connectivity: 'poor'
    }
  ];

  const selectedTerminalData = terminals.find(t => t.id === selectedTerminal);

  const patientCarePlan = [
    {
      id: 'task-1',
      type: 'medication',
      description: 'Administer Metformin 500mg',
      scheduledTime: '14:00',
      status: 'pending',
      priority: 'normal'
    },
    {
      id: 'task-2',
      type: 'vital-signs',
      description: 'Take vital signs',
      scheduledTime: '14:30',
      status: 'pending',
      priority: 'normal'
    },
    {
      id: 'task-3',
      type: 'assessment',
      description: 'Wound assessment',
      scheduledTime: '15:00',
      status: 'overdue',
      priority: 'high'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'border-green-500 bg-green-50';
      case 'locked': return 'border-orange-500 bg-orange-50';
      case 'offline': return 'border-red-500 bg-red-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getConnectivityColor = (connectivity: string) => {
    switch (connectivity) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-orange-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 50) return 'text-green-600';
    if (battery > 20) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Bedside Terminal Management</h3>
          <p className="text-gray-600">Patient identification, medication verification, and care plan access</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security Settings
          </Button>
          <Button className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            Generate QR
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Terminal List */}
        <Card>
          <CardHeader>
            <CardTitle>Bedside Terminals</CardTitle>
            <CardDescription>Active terminals and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {terminals.map((terminal) => (
                <div
                  key={terminal.id}
                  className={`p-3 border-l-4 rounded cursor-pointer transition-colors ${
                    getStatusColor(terminal.status)
                  } ${selectedTerminal === terminal.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedTerminal(terminal.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900">{terminal.location}</h5>
                      <p className="text-sm text-gray-700">{terminal.patient}</p>
                      <p className="text-xs text-gray-500">{terminal.lastLogin}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={`${
                        terminal.status === 'active' ? 'border-green-500 text-green-700' :
                        terminal.status === 'locked' ? 'border-orange-500 text-orange-700' :
                        'border-red-500 text-red-700'
                      }`}>
                        {terminal.status}
                      </Badge>
                      {terminal.alerts.length > 0 && (
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-1 ml-auto" />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-600">Tasks: {terminal.pendingTasks}</span>
                      <span className="text-xs text-gray-600">Meds: {terminal.medications}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${getBatteryColor(terminal.battery)}`}>
                        {terminal.battery}%
                      </span>
                      <span className={`text-xs ${getConnectivityColor(terminal.connectivity)}`}>
                        {terminal.connectivity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Terminal Details */}
        <div className="lg:col-span-2 space-y-4">
          {selectedTerminalData && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tablet className="h-5 w-5" />
                    {selectedTerminalData.location}
                  </CardTitle>
                  <CardDescription>Patient: {selectedTerminalData.patient}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 border rounded-lg bg-blue-50">
                      <User className="h-5 w-5 text-blue-600 mb-2" />
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-bold text-gray-900 capitalize">{selectedTerminalData.status}</p>
                    </div>
                    <div className="p-3 border rounded-lg bg-green-50">
                      <FileText className="h-5 w-5 text-green-600 mb-2" />
                      <p className="text-sm text-gray-600">Pending Tasks</p>
                      <p className="font-bold text-gray-900">{selectedTerminalData.pendingTasks}</p>
                    </div>
                    <div className="p-3 border rounded-lg bg-purple-50">
                      <Pill className="h-5 w-5 text-purple-600 mb-2" />
                      <p className="text-sm text-gray-600">Medications</p>
                      <p className="font-bold text-gray-900">{selectedTerminalData.medications}</p>
                    </div>
                    <div className="p-3 border rounded-lg bg-orange-50">
                      <Clock className="h-5 w-5 text-orange-600 mb-2" />
                      <p className="text-sm text-gray-600">Last Login</p>
                      <p className="font-bold text-gray-900 text-xs">{selectedTerminalData.lastLogin}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Patient Care Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>Care Plan Tasks</CardTitle>
                  <CardDescription>Scheduled activities and medications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {patientCarePlan.map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-center justify-between p-3 border rounded-lg ${
                          task.status === 'overdue' ? 'border-red-200 bg-red-50' :
                          task.status === 'completed' ? 'border-green-200 bg-green-50' :
                          'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            task.type === 'medication' ? 'bg-purple-100' :
                            task.type === 'vital-signs' ? 'bg-blue-100' :
                            'bg-orange-100'
                          }`}>
                            {task.type === 'medication' ? <Pill className="h-4 w-4 text-purple-600" /> :
                             task.type === 'vital-signs' ? <User className="h-4 w-4 text-blue-600" /> :
                             <FileText className="h-4 w-4 text-orange-600" />}
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">{task.description}</h5>
                            <p className="text-sm text-gray-600">Scheduled: {task.scheduledTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`${
                            task.status === 'overdue' ? 'border-red-500 text-red-700' :
                            task.status === 'completed' ? 'border-green-500 text-green-700' :
                            'border-orange-500 text-orange-700'
                          }`}>
                            {task.status}
                          </Badge>
                          {task.priority === 'high' && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Authentication Panel */}
              <Card>
                <CardHeader>
                  <CardTitle>Authentication & Security</CardTitle>
                  <CardDescription>Terminal access and security status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Two-Factor Authentication</span>
                      </div>
                      <Badge variant="outline" className="border-green-500 text-green-700">
                        Enabled
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <QrCode className="h-5 w-5 text-purple-600" />
                        <span className="font-medium">QR Code Authentication</span>
                      </div>
                      <Badge variant="outline" className="border-green-500 text-green-700">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-orange-600" />
                        <span className="font-medium">Session Timeout</span>
                      </div>
                      <span className="text-sm text-gray-600">15 minutes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Terminal health and connectivity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Battery Level</span>
                        <span className={`text-sm font-medium ${getBatteryColor(selectedTerminalData.battery)}`}>
                          {selectedTerminalData.battery}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedTerminalData.battery > 50 ? 'bg-green-600' :
                            selectedTerminalData.battery > 20 ? 'bg-orange-600' :
                            'bg-red-600'
                          }`}
                          style={{ width: `${selectedTerminalData.battery}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Connectivity</span>
                        <span className={`text-sm font-medium ${getConnectivityColor(selectedTerminalData.connectivity)}`}>
                          {selectedTerminalData.connectivity}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedTerminalData.connectivity === 'excellent' ? 'bg-green-600' :
                            selectedTerminalData.connectivity === 'good' ? 'bg-orange-600' :
                            'bg-red-600'
                          }`}
                          style={{ width: `${
                            selectedTerminalData.connectivity === 'excellent' ? 100 :
                            selectedTerminalData.connectivity === 'good' ? 70 :
                            30
                          }%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
