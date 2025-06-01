
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calculator,
  User,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  CreditCard
} from 'lucide-react';

interface RefundRequest {
  id: string;
  patient: {
    name: string;
    regId: string;
    category: string;
  };
  refundDetails: {
    amount: number;
    category: 'Overpayment' | 'Cancelled Procedure' | 'Discharge Adjustment' | 'Medical Error' | 'Insurance Reimbursement';
    reason: string;
    originalBill: string;
    paymentMethod: string;
  };
  approval: {
    level: 'Auto' | 'Supervisor' | 'Manager' | 'Committee';
    status: 'Pending' | 'Approved' | 'Rejected' | 'Processed';
    approvedBy?: string;
    approvedAt?: string;
  };
  processing: {
    estimatedDays: number;
    actualDays?: number;
    processingFee: number;
  };
  auditTrail: Array<{
    action: string;
    user: string;
    timestamp: string;
    notes?: string;
  }>;
  timestamp: string;
}

export const RefundEngine = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewRefund, setShowNewRefund] = useState(false);

  const refundRequests: RefundRequest[] = [
    {
      id: 'REF001',
      patient: { name: 'John Doe', regId: 'REG001234', category: 'General' },
      refundDetails: {
        amount: 150.00,
        category: 'Cancelled Procedure',
        reason: 'Surgery cancelled due to patient condition',
        originalBill: 'IPD001',
        paymentMethod: 'Credit Card'
      },
      approval: {
        level: 'Supervisor',
        status: 'Approved',
        approvedBy: 'Dr. Smith',
        approvedAt: '2024-06-01 10:30'
      },
      processing: {
        estimatedDays: 3,
        actualDays: 2,
        processingFee: 5.00
      },
      auditTrail: [
        { action: 'Refund Requested', user: 'Billing Clerk', timestamp: '2024-06-01 09:00' },
        { action: 'Supervisor Review', user: 'Dr. Smith', timestamp: '2024-06-01 10:30', notes: 'Medical necessity confirmed' },
        { action: 'Approved', user: 'Dr. Smith', timestamp: '2024-06-01 10:30' }
      ],
      timestamp: '2024-06-01 09:00'
    },
    {
      id: 'REF002',
      patient: { name: 'Jane Wilson', regId: 'REG001235', category: 'Senior Citizen' },
      refundDetails: {
        amount: 75.50,
        category: 'Overpayment',
        reason: 'Duplicate payment processing error',
        originalBill: 'OPD002',
        paymentMethod: 'Cash'
      },
      approval: {
        level: 'Auto',
        status: 'Processed',
        approvedBy: 'System',
        approvedAt: '2024-06-01 11:00'
      },
      processing: {
        estimatedDays: 1,
        actualDays: 1,
        processingFee: 0.00
      },
      auditTrail: [
        { action: 'Refund Requested', user: 'Cashier', timestamp: '2024-06-01 10:45' },
        { action: 'Auto-Approved', user: 'System', timestamp: '2024-06-01 11:00', notes: 'Below auto-approval threshold' },
        { action: 'Processed', user: 'Finance System', timestamp: '2024-06-01 11:00' }
      ],
      timestamp: '2024-06-01 10:45'
    },
    {
      id: 'REF003',
      patient: { name: 'Bob Chen', regId: 'REG001236', category: 'Employee' },
      refundDetails: {
        amount: 500.00,
        category: 'Discharge Adjustment',
        reason: 'Early discharge - room charges adjustment',
        originalBill: 'IPD003',
        paymentMethod: 'UPI'
      },
      approval: {
        level: 'Manager',
        status: 'Pending',
      },
      processing: {
        estimatedDays: 5,
        processingFee: 15.00
      },
      auditTrail: [
        { action: 'Refund Requested', user: 'Ward Clerk', timestamp: '2024-06-01 12:00' },
        { action: 'Under Review', user: 'Billing Manager', timestamp: '2024-06-01 12:30' }
      ],
      timestamp: '2024-06-01 12:00'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      'Pending': 'bg-amber-100 text-amber-800',
      'Approved': 'bg-blue-100 text-blue-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Processed': 'bg-green-100 text-green-800'
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  const getApprovalLevelBadge = (level: string) => {
    const variants: { [key: string]: string } = {
      'Auto': 'bg-green-100 text-green-800',
      'Supervisor': 'bg-blue-100 text-blue-800',
      'Manager': 'bg-purple-100 text-purple-800',
      'Committee': 'bg-orange-100 text-orange-800'
    };
    return variants[level] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: any } = {
      'Overpayment': DollarSign,
      'Cancelled Procedure': XCircle,
      'Discharge Adjustment': Calculator,
      'Medical Error': AlertTriangle,
      'Insurance Reimbursement': CreditCard
    };
    return icons[category] || FileText;
  };

  const handleApprove = (requestId: string) => {
    console.log(`Approving refund request ${requestId}`);
  };

  const handleReject = (requestId: string) => {
    console.log(`Rejecting refund request ${requestId}`);
  };

  const handleProcess = (requestId: string) => {
    console.log(`Processing refund ${requestId}`);
  };

  const filteredRequests = refundRequests.filter(request => 
    statusFilter === 'all' || request.approval.status === statusFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Smart Refund Engine</h2>
          <p className="text-gray-600">Automated refund processing with multi-level approval workflows</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calculator className="w-4 h-4" />
            <span>{filteredRequests.length} refund requests</span>
          </div>
          <Button onClick={() => setShowNewRefund(true)} className="bg-blue-600 hover:bg-blue-700">
            New Refund Request
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-amber-600">
                  {refundRequests.filter(r => r.approval.status === 'Pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved Today</p>
                <p className="text-2xl font-bold text-blue-600">
                  {refundRequests.filter(r => r.approval.status === 'Approved').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processed</p>
                <p className="text-2xl font-bold text-green-600">
                  {refundRequests.filter(r => r.approval.status === 'Processed').length}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${refundRequests.reduce((sum, r) => sum + r.refundDetails.amount, 0).toLocaleString()}
                </p>
              </div>
              <Calculator className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Processed">Processed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Refund Requests */}
      <div className="grid gap-6">
        {filteredRequests.map((request) => {
          const CategoryIcon = getCategoryIcon(request.refundDetails.category);
          
          return (
            <Card key={request.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <CategoryIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl">{request.id}</h3>
                      <p className="text-gray-600">{request.refundDetails.category}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{request.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusBadge(request.approval.status)}>
                      {request.approval.status}
                    </Badge>
                    <Badge className={getApprovalLevelBadge(request.approval.level)}>
                      {request.approval.level}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Patient & Refund Details */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Patient & Refund Details
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm text-gray-500">Patient</label>
                        <p className="font-medium">{request.patient.name}</p>
                        <p className="text-sm text-gray-600">{request.patient.regId}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Amount</label>
                        <p className="text-lg font-bold text-green-600">
                          ${request.refundDetails.amount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Original Bill</label>
                        <p className="text-sm">{request.refundDetails.originalBill}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Payment Method</label>
                        <Badge variant="outline">{request.refundDetails.paymentMethod}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Approval & Processing */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Approval & Processing
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm text-gray-500">Approval Level</label>
                        <Badge className={getApprovalLevelBadge(request.approval.level)}>
                          {request.approval.level}
                        </Badge>
                      </div>
                      {request.approval.approvedBy && (
                        <div>
                          <label className="text-sm text-gray-500">Approved By</label>
                          <p className="text-sm">{request.approval.approvedBy}</p>
                          <p className="text-xs text-gray-500">{request.approval.approvedAt}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm text-gray-500">Processing Time</label>
                        <p className="text-sm">
                          {request.processing.actualDays 
                            ? `Completed in ${request.processing.actualDays} days`
                            : `Estimated ${request.processing.estimatedDays} days`}
                        </p>
                      </div>
                      {request.processing.processingFee > 0 && (
                        <div>
                          <label className="text-sm text-gray-500">Processing Fee</label>
                          <p className="text-sm text-red-600">
                            ${request.processing.processingFee.toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reason & Audit Trail */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Reason & Audit Trail
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-500">Reason</label>
                        <p className="text-sm bg-gray-50 p-2 rounded">{request.refundDetails.reason}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Recent Activity</label>
                        <div className="space-y-1">
                          {request.auditTrail.slice(-2).map((entry, index) => (
                            <div key={index} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                              <p className="font-medium">{entry.action}</p>
                              <p>By: {entry.user} • {entry.timestamp}</p>
                              {entry.notes && <p className="italic">"{entry.notes}"</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  {request.approval.status === 'Pending' && (
                    <>
                      <Button 
                        onClick={() => handleApprove(request.id)}
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      
                      <Button 
                        onClick={() => handleReject(request.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  
                  {request.approval.status === 'Approved' && (
                    <Button 
                      onClick={() => handleProcess(request.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Process Refund
                    </Button>
                  )}
                  
                  <Button variant="outline" size="sm">
                    View Full Audit Trail
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    Generate Documentation
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredRequests.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No refund requests found</h3>
            <p className="text-gray-600">Try adjusting your filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
