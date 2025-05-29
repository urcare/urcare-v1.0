
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Users, Bed, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface TransitionRequest {
  id: string;
  patientName: string;
  patientId: string;
  currentType: 'OPD' | 'IPD';
  requestedType: 'OPD' | 'IPD';
  reason: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requestedBy: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected' | 'in-progress' | 'completed';
}

const mockTransitions: TransitionRequest[] = [
  {
    id: 'T001',
    patientName: 'Alice Brown',
    patientId: 'P004',
    currentType: 'OPD',
    requestedType: 'IPD',
    reason: 'Requires extended observation for cardiac monitoring',
    priority: 'high',
    requestedBy: 'Dr. Smith',
    timestamp: '10 min ago',
    status: 'pending'
  },
  {
    id: 'T002',
    patientName: 'Robert Wilson',
    patientId: 'P005',
    currentType: 'IPD',
    requestedType: 'OPD',
    reason: 'Patient stable, ready for outpatient follow-up',
    priority: 'medium',
    requestedBy: 'Dr. Johnson',
    timestamp: '25 min ago',
    status: 'approved'
  }
];

export const IPDOPDTransition = () => {
  const [transitions, setTransitions] = useState<TransitionRequest[]>(mockTransitions);
  const [selectedTransition, setSelectedTransition] = useState<string | null>(null);

  const handleTransitionAction = (transitionId: string, action: 'approve' | 'reject') => {
    setTransitions(prev => prev.map(t => 
      t.id === transitionId 
        ? { ...t, status: action === 'approve' ? 'approved' : 'rejected' }
        : t
    ));
    
    toast.success(`Transition ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            IPD/OPD Smart Transition Management
          </CardTitle>
          <CardDescription>
            Manage patient transitions between inpatient and outpatient care
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {transitions.map((transition) => (
              <div key={transition.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{transition.patientName}</h3>
                    <Badge variant="outline">{transition.patientId}</Badge>
                    <Badge className={getPriorityColor(transition.priority)}>
                      {transition.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <Badge className={getStatusColor(transition.status)}>
                    {transition.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    {transition.currentType === 'IPD' ? <Bed className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                    <span className="font-medium">{transition.currentType}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  <div className="flex items-center gap-2">
                    {transition.requestedType === 'IPD' ? <Bed className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                    <span className="font-medium">{transition.requestedType}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700">{transition.reason}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>Requested by: {transition.requestedBy}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{transition.timestamp}</span>
                  </div>
                </div>

                {transition.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleTransitionAction(transition.id, 'approve')}
                    >
                      Approve Transition
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleTransitionAction(transition.id, 'reject')}
                    >
                      Reject
                    </Button>
                  </div>
                )}

                {transition.status === 'approved' && (
                  <div className="flex items-center gap-2">
                    <Button size="sm">
                      Execute Transition
                    </Button>
                    <span className="text-sm text-green-600">Ready to proceed</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Transition Request</CardTitle>
          <CardDescription>Create a new transition request</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Patient ID</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="P001">P001 - John Smith</SelectItem>
                  <SelectItem value="P002">P002 - Sarah Johnson</SelectItem>
                  <SelectItem value="P003">P003 - Mike Davis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Transition Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select transition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="opd-to-ipd">OPD → IPD</SelectItem>
                  <SelectItem value="ipd-to-opd">IPD → OPD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Priority</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Set priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full">
                Submit Request
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
