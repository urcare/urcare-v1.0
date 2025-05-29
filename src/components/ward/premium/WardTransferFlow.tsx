
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowRight, Clock, CheckCircle, XCircle, AlertTriangle, User } from 'lucide-react';

interface TransferRequest {
  id: string;
  patientId: string;
  patientName: string;
  fromWard: string;
  toWard: string;
  reason: string;
  requestedBy: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  approvedBy?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  medicalJustification: string;
  estimatedDuration?: string;
}

const mockTransferRequests: TransferRequest[] = [
  {
    id: 'TR001',
    patientId: 'W001',
    patientName: 'John Smith',
    fromWard: 'General Ward A',
    toWard: 'ICU',
    reason: 'Respiratory distress requiring intensive monitoring',
    requestedBy: 'Dr. Johnson',
    requestDate: '2024-01-22 14:30',
    status: 'pending',
    priority: 'urgent',
    medicalJustification: 'Patient showing signs of respiratory failure, O2 sat dropping below 90%',
    estimatedDuration: '3-5 days'
  },
  {
    id: 'TR002',
    patientId: 'W005',
    patientName: 'Mary Wilson',
    fromWard: 'ICU',
    toWard: 'General Ward B',
    reason: 'Stable condition, ready for step-down care',
    requestedBy: 'Dr. Brown',
    requestDate: '2024-01-22 10:15',
    status: 'approved',
    approvedBy: 'Dr. Smith',
    priority: 'medium',
    medicalJustification: 'Vitals stable for 48 hours, no longer requires intensive monitoring'
  }
];

const availableWards = [
  'General Ward A',
  'General Ward B', 
  'ICU',
  'Emergency',
  'Pediatric Ward',
  'Cardiac Unit',
  'Surgical Ward'
];

export const WardTransferFlow = () => {
  const [transfers, setTransfers] = useState<TransferRequest[]>(mockTransferRequests);
  const [newTransfer, setNewTransfer] = useState({
    patientId: '',
    fromWard: '',
    toWard: '',
    reason: '',
    priority: 'medium' as const,
    medicalJustification: ''
  });

  const handleApproval = (transferId: string, approved: boolean) => {
    setTransfers(prev => prev.map(transfer => 
      transfer.id === transferId 
        ? { ...transfer, status: approved ? 'approved' : 'rejected', approvedBy: 'Current User' }
        : transfer
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Ward Transfer Management
          </CardTitle>
          <CardDescription>
            Manage inter-ward patient transfers with approval workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {transfers.map((transfer) => (
              <Card key={transfer.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{transfer.patientName}</h3>
                      <Badge variant="outline">{transfer.id}</Badge>
                      <Badge className={getPriorityColor(transfer.priority)}>
                        {transfer.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <Badge className={getStatusColor(transfer.status)}>
                      {transfer.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        <strong>From:</strong> {transfer.fromWard} → <strong>To:</strong> {transfer.toWard}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        <strong>Requested by:</strong> {transfer.requestedBy}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        <strong>Date:</strong> {transfer.requestDate}
                      </span>
                    </div>
                    {transfer.estimatedDuration && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          <strong>Est. Duration:</strong> {transfer.estimatedDuration}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm"><strong>Reason:</strong> {transfer.reason}</p>
                    <p className="text-sm mt-2"><strong>Medical Justification:</strong> {transfer.medicalJustification}</p>
                  </div>

                  {transfer.status === 'pending' && (
                    <div className="flex gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Approve Transfer Request</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to approve the transfer of {transfer.patientName} from {transfer.fromWard} to {transfer.toWard}?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleApproval(transfer.id, true)}>
                              Approve Transfer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reject Transfer Request</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to reject this transfer request? Please provide a reason.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleApproval(transfer.id, false)}>
                              Reject Transfer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}

                  {transfer.approvedBy && (
                    <div className="mt-2 text-sm text-gray-600">
                      {transfer.status === 'approved' ? 'Approved' : 'Rejected'} by: {transfer.approvedBy}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Request New Transfer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Select value={newTransfer.fromWard} onValueChange={(value) => setNewTransfer(prev => ({ ...prev, fromWard: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="From Ward" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableWards.map(ward => (
                      <SelectItem key={ward} value={ward}>{ward}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={newTransfer.toWard} onValueChange={(value) => setNewTransfer(prev => ({ ...prev, toWard: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="To Ward" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableWards.filter(ward => ward !== newTransfer.fromWard).map(ward => (
                      <SelectItem key={ward} value={ward}>{ward}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Select value={newTransfer.priority} onValueChange={(value: any) => setNewTransfer(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Textarea
                placeholder="Reason for transfer..."
                value={newTransfer.reason}
                onChange={(e) => setNewTransfer(prev => ({ ...prev, reason: e.target.value }))}
              />

              <Textarea
                placeholder="Medical justification..."
                value={newTransfer.medicalJustification}
                onChange={(e) => setNewTransfer(prev => ({ ...prev, medicalJustification: e.target.value }))}
              />

              <Button className="w-full">
                Submit Transfer Request
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
