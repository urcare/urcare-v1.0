
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowRightLeft, Clock, User, MessageSquare, CheckCircle, AlertTriangle } from 'lucide-react';

interface HandoffMessage {
  id: string;
  patientId: string;
  patientName: string;
  fromStaff: string;
  fromRole: string;
  toStaff: string;
  toRole: string;
  shift: string;
  timestamp: string;
  priority: 'routine' | 'important' | 'urgent';
  category: 'medication' | 'treatment' | 'observation' | 'follow-up' | 'concern';
  message: string;
  status: 'pending' | 'acknowledged' | 'completed';
  acknowledgmentTime?: string;
}

const mockHandoffs: HandoffMessage[] = [
  {
    id: 'HO001',
    patientId: 'P001',
    patientName: 'John Smith',
    fromStaff: 'Nurse Anderson',
    fromRole: 'Day Shift Nurse',
    toStaff: 'Nurse Williams',
    toRole: 'Night Shift Nurse',
    shift: 'Day to Night',
    timestamp: '2024-01-22 19:00',
    priority: 'urgent',
    category: 'observation',
    message: 'Patient showing signs of confusion. Monitor neurological status closely. Family has been notified.',
    status: 'pending'
  },
  {
    id: 'HO002',
    patientId: 'P002',
    patientName: 'Mary Wilson',
    fromStaff: 'Dr. Johnson',
    fromRole: 'Attending Physician',
    toStaff: 'Dr. Chen',
    toRole: 'On-call Physician',
    shift: 'Day to Night',
    timestamp: '2024-01-22 18:45',
    priority: 'important',
    category: 'medication',
    message: 'Adjusted pain medication dosage. Monitor for effectiveness and side effects.',
    status: 'acknowledged',
    acknowledgmentTime: '2024-01-22 19:15'
  }
];

export const ClinicalHandoffSystem = () => {
  const [handoffs, setHandoffs] = useState<HandoffMessage[]>(mockHandoffs);
  const [newHandoff, setNewHandoff] = useState({
    patientId: '',
    toStaff: '',
    priority: 'routine' as const,
    category: 'follow-up' as const,
    message: ''
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600 text-white';
      case 'important': return 'bg-orange-500 text-white';
      case 'routine': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'medication': return 'bg-blue-500 text-white';
      case 'treatment': return 'bg-purple-500 text-white';
      case 'observation': return 'bg-yellow-600 text-white';
      case 'follow-up': return 'bg-green-600 text-white';
      case 'concern': return 'bg-red-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'acknowledged': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const handleAcknowledge = (handoffId: string) => {
    setHandoffs(prev => prev.map(handoff => 
      handoff.id === handoffId 
        ? { ...handoff, status: 'acknowledged', acknowledgmentTime: new Date().toISOString() }
        : handoff
    ));
  };

  const handleComplete = (handoffId: string) => {
    setHandoffs(prev => prev.map(handoff => 
      handoff.id === handoffId 
        ? { ...handoff, status: 'completed' }
        : handoff
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Clinical Handoff Communication System
          </CardTitle>
          <CardDescription>
            Structured communication for shift changes and care transitions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Handoffs */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Active Handoffs</h3>
                <div className="flex gap-2">
                  <Badge className="bg-yellow-500">3 Pending</Badge>
                  <Badge className="bg-blue-500">2 Acknowledged</Badge>
                </div>
              </div>

              {handoffs.map((handoff) => (
                <Card key={handoff.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">{handoff.patientName}</h4>
                        <Badge variant="outline">{handoff.patientId}</Badge>
                        <Badge className={getPriorityColor(handoff.priority)}>
                          {handoff.priority.toUpperCase()}
                        </Badge>
                        <Badge className={getCategoryColor(handoff.category)}>
                          {handoff.category.toUpperCase()}
                        </Badge>
                      </div>
                      <Badge className={getStatusColor(handoff.status)}>
                        {handoff.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">{handoff.fromStaff}</p>
                          <p className="text-xs text-gray-600">{handoff.fromRole}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRightLeft className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">{handoff.toStaff}</p>
                          <p className="text-xs text-gray-600">{handoff.toRole}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">{handoff.message}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span><strong>Sent:</strong> {handoff.timestamp}</span>
                      </div>
                      {handoff.acknowledgmentTime && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span><strong>Acknowledged:</strong> {handoff.acknowledgmentTime}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {handoff.status === 'pending' && (
                        <>
                          <Button size="sm" onClick={() => handleAcknowledge(handoff.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Acknowledge
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Clarify
                          </Button>
                        </>
                      )}
                      {handoff.status === 'acknowledged' && (
                        <>
                          <Button size="sm" onClick={() => handleComplete(handoff.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark Complete
                          </Button>
                          <Button size="sm" variant="outline">Add Update</Button>
                        </>
                      )}
                      {handoff.priority === 'urgent' && handoff.status === 'pending' && (
                        <Button size="sm" variant="destructive">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Escalate
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Create New Handoff */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Create Handoff Message</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Patient</label>
                    <Select value={newHandoff.patientId} onValueChange={(value) => setNewHandoff(prev => ({ ...prev, patientId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="P001">John Smith - P001</SelectItem>
                        <SelectItem value="P002">Mary Wilson - P002</SelectItem>
                        <SelectItem value="P003">Robert Davis - P003</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">To Staff Member</label>
                    <Select value={newHandoff.toStaff} onValueChange={(value) => setNewHandoff(prev => ({ ...prev, toStaff: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipient" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nurse1">Nurse Williams (Night)</SelectItem>
                        <SelectItem value="nurse2">Nurse Johnson (Day)</SelectItem>
                        <SelectItem value="doc1">Dr. Chen (On-call)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Priority</label>
                      <Select value={newHandoff.priority} onValueChange={(value: any) => setNewHandoff(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="routine">Routine</SelectItem>
                          <SelectItem value="important">Important</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <Select value={newHandoff.category} onValueChange={(value: any) => setNewHandoff(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="medication">Medication</SelectItem>
                          <SelectItem value="treatment">Treatment</SelectItem>
                          <SelectItem value="observation">Observation</SelectItem>
                          <SelectItem value="follow-up">Follow-up</SelectItem>
                          <SelectItem value="concern">Concern</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <Textarea
                      placeholder="Enter detailed handoff information..."
                      value={newHandoff.message}
                      onChange={(e) => setNewHandoff(prev => ({ ...prev, message: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  <Button className="w-full" disabled={!newHandoff.patientId || !newHandoff.toStaff || !newHandoff.message}>
                    Send Handoff Message
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pending Responses</span>
                    <Badge className="bg-red-500">3</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg Response Time</span>
                    <span className="text-sm font-medium">12 min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Handoffs Today</span>
                    <span className="text-sm font-medium">24</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
