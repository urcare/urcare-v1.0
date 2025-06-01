
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pill, AlertTriangle, Clock, User, CheckCircle, Bell } from 'lucide-react';

export const MedicationTracker = () => {
  const [filterStatus, setFilterStatus] = useState('all');

  const medications = [
    {
      id: 1,
      patient: 'John Doe',
      room: '301A',
      medication: 'Morphine 10mg IV',
      scheduledTime: '09:00',
      currentTime: '09:15',
      status: 'overdue',
      assignedNurse: 'Nurse Johnson',
      priority: 'critical',
      notes: 'Post-operative pain management',
      lastGiven: '05:00'
    },
    {
      id: 2,
      patient: 'Jane Smith',
      room: '302B',
      medication: 'Insulin 8 units SC',
      scheduledTime: '09:30',
      currentTime: '09:15',
      status: 'due_soon',
      assignedNurse: 'Nurse Wilson',
      priority: 'high',
      notes: 'Pre-meal insulin',
      lastGiven: '05:30'
    },
    {
      id: 3,
      patient: 'Mike Brown',
      room: '303A',
      medication: 'Metformin 500mg PO',
      scheduledTime: '08:00',
      currentTime: '09:15',
      status: 'completed',
      assignedNurse: 'Nurse Davis',
      priority: 'medium',
      notes: 'With breakfast',
      lastGiven: '08:00'
    },
    {
      id: 4,
      patient: 'Sarah Wilson',
      room: '304B',
      medication: 'Warfarin 5mg PO',
      scheduledTime: '10:00',
      currentTime: '09:15',
      status: 'scheduled',
      assignedNurse: 'Nurse Taylor',
      priority: 'high',
      notes: 'Check INR levels',
      lastGiven: '10:00 yesterday'
    },
    {
      id: 5,
      patient: 'Tom Anderson',
      room: '305A',
      medication: 'Antibiotic IV',
      scheduledTime: '08:30',
      currentTime: '09:15',
      status: 'missed',
      assignedNurse: 'Nurse Johnson',
      priority: 'high',
      notes: 'Patient was in radiology',
      lastGiven: '20:30 yesterday'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'missed': return 'bg-red-100 text-red-800 border-red-200';
      case 'due_soon': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
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
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'missed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'due_soon': return <Bell className="h-4 w-4 text-yellow-600" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredMedications = medications.filter(med => 
    filterStatus === 'all' || med.status === filterStatus
  );

  const criticalAlerts = medications.filter(med => 
    med.status === 'overdue' || med.status === 'missed'
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Pill className="h-6 w-6 text-green-600" />
          Medication Tracker
        </h2>
        <div className="flex gap-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Medications</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="due_soon">Due Soon</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="missed">Missed</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-red-600 hover:bg-red-700">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Critical Alerts ({criticalAlerts.length})
          </Button>
        </div>
      </div>

      {criticalAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Critical Medication Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {criticalAlerts.map(med => (
                <div key={med.id} className="border border-red-300 rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-red-900">{med.medication}</h4>
                      <p className="text-sm text-red-700">{med.patient} - {med.room}</p>
                    </div>
                    <Badge className="bg-red-500 text-white">
                      {med.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm text-red-800 mb-3">
                    Due: {med.scheduledTime} | Assigned: {med.assignedNurse}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Give Now
                    </Button>
                    <Button size="sm" variant="outline">
                      Document Reason
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {medications.filter(m => m.status === 'overdue' || m.status === 'missed').length}
            </div>
            <p className="text-sm text-red-800">Critical Alerts</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {medications.filter(m => m.status === 'due_soon').length}
            </div>
            <p className="text-sm text-yellow-800">Due Soon</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {medications.filter(m => m.status === 'scheduled').length}
            </div>
            <p className="text-sm text-blue-800">Scheduled</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {medications.filter(m => m.status === 'completed').length}
            </div>
            <p className="text-sm text-green-800">Completed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Medication Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMedications.map(med => (
              <div key={med.id} className={`border rounded-lg p-4 ${
                med.status === 'overdue' || med.status === 'missed' ? 'bg-red-50 border-red-200' :
                med.status === 'due_soon' ? 'bg-yellow-50 border-yellow-200' :
                med.status === 'completed' ? 'bg-green-50 border-green-200' :
                'bg-white'
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{med.medication}</h4>
                      <Badge className={getPriorityColor(med.priority)}>
                        {med.priority.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(med.status)}>
                        {getStatusIcon(med.status)}
                        <span className="ml-1">{med.status.replace('_', ' ').toUpperCase()}</span>
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Patient:</span> {med.patient}
                      </div>
                      <div>
                        <span className="font-medium">Room:</span> {med.room}
                      </div>
                      <div>
                        <span className="font-medium">Scheduled:</span> {med.scheduledTime}
                      </div>
                      <div>
                        <span className="font-medium">Nurse:</span> {med.assignedNurse}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      <span className="font-medium">Notes:</span> {med.notes}
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      <span className="font-medium">Last Given:</span> {med.lastGiven}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {med.status === 'scheduled' || med.status === 'due_soon' ? (
                    <>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Give Medication
                      </Button>
                      <Button size="sm" variant="outline">
                        Reschedule
                      </Button>
                    </>
                  ) : med.status === 'overdue' || med.status === 'missed' ? (
                    <>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        Give Now
                      </Button>
                      <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                        Document Delay
                      </Button>
                      <Button size="sm" variant="outline">
                        Contact Physician
                      </Button>
                    </>
                  ) : med.status === 'completed' ? (
                    <Button size="sm" variant="outline" disabled>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completed
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
