
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Calendar, Clock, User, CheckCircle, X, Plus, AlertCircle } from 'lucide-react';

interface CallbackSchedule {
  id: string;
  patientId: string;
  patientName: string;
  dischargeDate: string;
  phoneNumber: string;
  callbackType: 'wellness' | 'medication' | 'follow-up' | 'satisfaction' | 'complications';
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'completed' | 'missed' | 'rescheduled' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  notes?: string;
  callDuration?: string;
  outcome?: string;
  completedBy?: string;
  completedAt?: string;
  nextCallback?: string;
}

const mockCallbacks: CallbackSchedule[] = [
  {
    id: 'CB001',
    patientId: 'W003',
    patientName: 'Mike Davis',
    dischargeDate: '2024-01-22',
    phoneNumber: '+1-555-0123',
    callbackType: 'wellness',
    scheduledDate: '2024-01-24',
    scheduledTime: '10:00 AM',
    status: 'scheduled',
    priority: 'medium',
    assignedTo: 'Nurse Johnson',
    notes: 'Check surgical site healing and pain levels'
  },
  {
    id: 'CB002',
    patientId: 'W007',
    patientName: 'Lisa Thompson',
    dischargeDate: '2024-01-20',
    phoneNumber: '+1-555-0124',
    callbackType: 'medication',
    scheduledDate: '2024-01-23',
    scheduledTime: '2:00 PM',
    status: 'completed',
    priority: 'high',
    assignedTo: 'Pharmacist Lee',
    notes: 'Medication adherence check for diabetes management',
    callDuration: '15 minutes',
    outcome: 'Patient following medication schedule correctly. No side effects reported.',
    completedBy: 'Pharmacist Lee',
    completedAt: '2024-01-23 14:05',
    nextCallback: '2024-01-30'
  },
  {
    id: 'CB003',
    patientId: 'W008',
    patientName: 'Robert Chen',
    dischargeDate: '2024-01-19',
    phoneNumber: '+1-555-0125',
    callbackType: 'complications',
    scheduledDate: '2024-01-22',
    scheduledTime: '9:30 AM',
    status: 'missed',
    priority: 'urgent',
    assignedTo: 'Dr. Wilson',
    notes: 'Post-surgery complication follow-up - reported unusual symptoms'
  }
];

export const PostDischargeScheduler = () => {
  const [callbacks, setCallbacks] = useState<CallbackSchedule[]>(mockCallbacks);
  const [isAddingCallback, setIsAddingCallback] = useState(false);
  const [newCallback, setNewCallback] = useState<Partial<CallbackSchedule>>({
    callbackType: 'wellness',
    status: 'scheduled',
    priority: 'medium'
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'missed': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'wellness': return 'bg-green-100 text-green-800';
      case 'medication': return 'bg-blue-100 text-blue-800';
      case 'follow-up': return 'bg-purple-100 text-purple-800';
      case 'satisfaction': return 'bg-cyan-100 text-cyan-800';
      case 'complications': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'missed': return <X className="h-4 w-4 text-red-500" />;
      case 'rescheduled': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'cancelled': return <X className="h-4 w-4 text-gray-500" />;
      default: return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleAddCallback = () => {
    if (newCallback.patientName && newCallback.phoneNumber) {
      const callback: CallbackSchedule = {
        id: `CB${String(callbacks.length + 1).padStart(3, '0')}`,
        patientId: `W${String(callbacks.length + 1).padStart(3, '0')}`,
        patientName: newCallback.patientName || '',
        dischargeDate: newCallback.dischargeDate || new Date().toISOString().split('T')[0],
        phoneNumber: newCallback.phoneNumber || '',
        callbackType: newCallback.callbackType as any || 'wellness',
        scheduledDate: newCallback.scheduledDate || new Date().toISOString().split('T')[0],
        scheduledTime: newCallback.scheduledTime || '10:00 AM',
        status: newCallback.status as any || 'scheduled',
        priority: newCallback.priority as any || 'medium',
        assignedTo: newCallback.assignedTo || 'Current User',
        notes: newCallback.notes
      };

      setCallbacks(prev => [callback, ...prev]);
      setNewCallback({
        callbackType: 'wellness',
        status: 'scheduled',
        priority: 'medium'
      });
      setIsAddingCallback(false);
    }
  };

  const updateCallbackStatus = (callbackId: string, newStatus: string, outcome?: string) => {
    setCallbacks(prev => prev.map(callback => {
      if (callback.id === callbackId) {
        const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
        return {
          ...callback,
          status: newStatus as any,
          outcome: outcome || callback.outcome,
          completedBy: newStatus === 'completed' ? 'Current User' : callback.completedBy,
          completedAt: newStatus === 'completed' ? now : callback.completedAt
        };
      }
      return callback;
    }));
  };

  const sortedCallbacks = [...callbacks].sort((a, b) => {
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    const statusOrder = { missed: 4, scheduled: 3, rescheduled: 2, completed: 1, cancelled: 0 };
    
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[b.status] - statusOrder[a.status];
    }
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Post-Discharge Callback Scheduler
              </CardTitle>
              <CardDescription>
                Schedule and manage follow-up calls for discharged patients
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddingCallback(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Schedule Callback
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAddingCallback && (
            <Card className="mb-6 border-2 border-dashed">
              <CardHeader>
                <CardTitle className="text-lg">Schedule New Callback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Patient Name"
                    value={newCallback.patientName || ''}
                    onChange={(e) => setNewCallback(prev => ({ ...prev, patientName: e.target.value }))}
                  />
                  <Input
                    placeholder="Phone Number"
                    value={newCallback.phoneNumber || ''}
                    onChange={(e) => setNewCallback(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  />
                  <Input
                    type="date"
                    placeholder="Discharge Date"
                    value={newCallback.dischargeDate || ''}
                    onChange={(e) => setNewCallback(prev => ({ ...prev, dischargeDate: e.target.value }))}
                  />
                  <Input
                    type="date"
                    placeholder="Callback Date"
                    value={newCallback.scheduledDate || ''}
                    onChange={(e) => setNewCallback(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  />
                  <Input
                    placeholder="Callback Time (e.g., 10:00 AM)"
                    value={newCallback.scheduledTime || ''}
                    onChange={(e) => setNewCallback(prev => ({ ...prev, scheduledTime: e.target.value }))}
                  />
                  <Select
                    value={newCallback.callbackType}
                    onValueChange={(value) => setNewCallback(prev => ({ ...prev, callbackType: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Callback Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wellness">General Wellness</SelectItem>
                      <SelectItem value="medication">Medication Check</SelectItem>
                      <SelectItem value="follow-up">Follow-up Care</SelectItem>
                      <SelectItem value="satisfaction">Satisfaction Survey</SelectItem>
                      <SelectItem value="complications">Complications Check</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={newCallback.priority}
                    onValueChange={(value) => setNewCallback(prev => ({ ...prev, priority: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Assigned To"
                    value={newCallback.assignedTo || ''}
                    onChange={(e) => setNewCallback(prev => ({ ...prev, assignedTo: e.target.value }))}
                  />
                </div>

                <Textarea
                  placeholder="Notes about the callback..."
                  value={newCallback.notes || ''}
                  onChange={(e) => setNewCallback(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                />

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingCallback(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCallback}>
                    Schedule Callback
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {sortedCallbacks.map((callback) => (
              <Card key={callback.id} className={`border-l-4 ${
                callback.priority === 'urgent' ? 'border-l-red-500' :
                callback.priority === 'high' ? 'border-l-orange-500' :
                callback.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(callback.status)}
                      <h3 className="font-semibold text-lg">{callback.patientName}</h3>
                      <Badge variant="outline">{callback.patientId}</Badge>
                      <Badge className={getTypeColor(callback.callbackType)}>
                        {callback.callbackType.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(callback.priority)}>
                        {callback.priority.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(callback.status)}>
                        {callback.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{callback.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Discharged: {callback.dischargeDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Callback: {callback.scheduledDate} at {callback.scheduledTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>Assigned: {callback.assignedTo}</span>
                    </div>
                  </div>

                  {callback.notes && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium mb-1">Notes:</h4>
                      <p className="text-sm text-gray-700">{callback.notes}</p>
                    </div>
                  )}

                  {callback.outcome && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium mb-1">Call Outcome:</h4>
                      <p className="text-sm text-gray-700">{callback.outcome}</p>
                      {callback.callDuration && (
                        <p className="text-xs text-gray-500 mt-1">
                          Duration: {callback.callDuration} • Completed by: {callback.completedBy} • {callback.completedAt}
                        </p>
                      )}
                    </div>
                  )}

                  {callback.nextCallback && (
                    <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                      <strong>📅 Next Callback Scheduled:</strong> {callback.nextCallback}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t">
                    <div className="text-xs text-gray-500">
                      Callback ID: {callback.id}
                    </div>
                    <div className="flex gap-2">
                      {callback.status === 'scheduled' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateCallbackStatus(callback.id, 'completed', 'Call completed successfully')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark Complete
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateCallbackStatus(callback.id, 'missed')}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Mark Missed
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateCallbackStatus(callback.id, 'rescheduled')}
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Reschedule
                          </Button>
                        </>
                      )}
                      
                      {callback.status === 'missed' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateCallbackStatus(callback.id, 'rescheduled')}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Retry Call
                        </Button>
                      )}
                      
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-1" />
                        Call Now
                      </Button>
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
          <CardTitle>Callback Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {[
              { label: 'Scheduled', value: callbacks.filter(c => c.status === 'scheduled').length, icon: Calendar, color: 'text-blue-500' },
              { label: 'Completed', value: callbacks.filter(c => c.status === 'completed').length, icon: CheckCircle, color: 'text-green-500' },
              { label: 'Missed', value: callbacks.filter(c => c.status === 'missed').length, icon: X, color: 'text-red-500' },
              { label: 'Urgent', value: callbacks.filter(c => c.priority === 'urgent').length, icon: AlertCircle, color: 'text-red-500' },
              { label: 'Today', value: callbacks.filter(c => c.scheduledDate === new Date().toISOString().split('T')[0]).length, icon: Clock, color: 'text-purple-500' },
              { label: 'Success Rate', value: `${Math.round((callbacks.filter(c => c.status === 'completed').length / callbacks.length) * 100)}%`, icon: Phone, color: 'text-cyan-500' }
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <stat.icon className={`h-8 w-8 mx-auto ${stat.color} mb-2`} />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
