
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingDown,
  FileText,
  User,
  DollarSign
} from 'lucide-react';

interface ReversalRecord {
  id: string;
  originalBillId: string;
  patientName: string;
  amount: number;
  reason: string;
  reasonCode: string;
  requestedBy: string;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  financialImpact: number;
  department: string;
  timestamp: string;
}

interface DepartmentStats {
  department: string;
  totalReversals: number;
  reversalAmount: number;
  reversalRate: number;
  trend: 'up' | 'down' | 'stable';
}

export const ReversalCancellationManagement = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const reversalRecords: ReversalRecord[] = [
    {
      id: 'REV001',
      originalBillId: 'BILL12345',
      patientName: 'John Doe',
      amount: 1500.00,
      reason: 'Insurance pre-authorization denial',
      reasonCode: 'INS_DENIAL',
      requestedBy: 'Finance Manager',
      approvalStatus: 'Approved',
      financialImpact: -1500.00,
      department: 'Cardiology',
      timestamp: '2024-06-01 14:30'
    },
    {
      id: 'REV002',
      originalBillId: 'BILL12346',
      patientName: 'Jane Wilson',
      amount: 850.00,
      reason: 'Procedure cancelled due to patient condition',
      reasonCode: 'PROC_CANCEL',
      requestedBy: 'Dr. Smith',
      approvalStatus: 'Pending',
      financialImpact: -850.00,
      department: 'Surgery',
      timestamp: '2024-06-01 15:45'
    },
    {
      id: 'REV003',
      originalBillId: 'BILL12347',
      patientName: 'Bob Chen',
      amount: 300.00,
      reason: 'Duplicate billing error',
      reasonCode: 'DUPLICATE',
      requestedBy: 'Billing Clerk',
      approvalStatus: 'Approved',
      financialImpact: -300.00,
      department: 'Laboratory',
      timestamp: '2024-06-01 16:20'
    }
  ];

  const departmentStats: DepartmentStats[] = [
    { department: 'Cardiology', totalReversals: 12, reversalAmount: 18500, reversalRate: 2.3, trend: 'down' },
    { department: 'Surgery', totalReversals: 8, reversalAmount: 24600, reversalRate: 3.1, trend: 'up' },
    { department: 'Laboratory', totalReversals: 15, reversalAmount: 4200, reversalRate: 1.8, trend: 'stable' },
    { department: 'Emergency', totalReversals: 6, reversalAmount: 8900, reversalRate: 2.7, trend: 'down' }
  ];

  const reasonCodes = [
    { code: 'INS_DENIAL', description: 'Insurance pre-authorization denial', count: 8 },
    { code: 'PROC_CANCEL', description: 'Procedure cancelled', count: 6 },
    { code: 'DUPLICATE', description: 'Duplicate billing error', count: 4 },
    { code: 'PATIENT_REQ', description: 'Patient request', count: 3 },
    { code: 'MEDICAL_ERR', description: 'Medical necessity error', count: 2 }
  ];

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      'Pending': 'bg-amber-100 text-amber-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: any } = {
      'Pending': Clock,
      'Approved': CheckCircle,
      'Rejected': AlertTriangle
    };
    return icons[status] || Clock;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '↗️';
    if (trend === 'down') return '↘️';
    return '➡️';
  };

  const filteredRecords = reversalRecords.filter(record => {
    if (selectedFilter === 'all') return true;
    return record.approvalStatus.toLowerCase() === selectedFilter;
  });

  const totalReversalAmount = reversalRecords.reduce((sum, record) => sum + Math.abs(record.financialImpact), 0);
  const pendingApprovals = reversalRecords.filter(r => r.approvalStatus === 'Pending').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reversal & Cancellation Management</h2>
          <p className="text-gray-600">Complete audit trail and pattern analysis</p>
        </div>
        
        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter(filter)}
              className={selectedFilter === filter ? 'bg-blue-600' : ''}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reversals</p>
                <p className="text-3xl font-bold text-red-600">{reversalRecords.length}</p>
              </div>
              <RefreshCw className="w-12 h-12 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-3xl font-bold text-red-600">
                  ${totalReversalAmount.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-3xl font-bold text-amber-600">{pendingApprovals}</p>
              </div>
              <Clock className="w-12 h-12 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Processing Time</p>
                <p className="text-3xl font-bold text-blue-600">2.5h</p>
              </div>
              <TrendingDown className="w-12 h-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reversal Records */}
      <Card>
        <CardHeader>
          <CardTitle>Reversal Records</CardTitle>
          <CardDescription>Complete audit trail of all billing reversals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRecords.map((record) => {
              const StatusIcon = getStatusIcon(record.approvalStatus);
              
              return (
                <div key={record.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <RefreshCw className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{record.id} - {record.patientName}</h3>
                        <p className="text-sm text-gray-600">Original Bill: {record.originalBillId}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <StatusIcon className="w-4 h-4" />
                      <Badge className={getStatusBadge(record.approvalStatus)}>
                        {record.approvalStatus}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-semibold text-red-600">${record.amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Department</p>
                      <p className="font-medium">{record.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Requested By</p>
                      <p className="font-medium">{record.requestedBy}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Timestamp</p>
                      <p className="font-medium">{record.timestamp}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Reason</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{record.reasonCode}</Badge>
                      <span className="text-sm">{record.reason}</span>
                    </div>
                  </div>

                  {record.approvalStatus === 'Pending' && (
                    <div className="flex gap-2 pt-2 border-t">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-600">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Department Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Department Reversal Analysis</CardTitle>
            <CardDescription>Pattern analysis by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentStats.map((dept, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">{dept.department}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <span>{getTrendIcon(dept.trend)}</span>
                      <span>{dept.reversalRate}% rate</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Total Reversals</p>
                      <p className="font-semibold">{dept.totalReversals}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-semibold text-red-600">${dept.reversalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <Progress value={dept.reversalRate * 10} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reason Code Analysis</CardTitle>
            <CardDescription>Most common reversal reasons</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reasonCodes.map((reason, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{reason.code}</h3>
                    <p className="text-sm text-gray-600">{reason.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{reason.count}</p>
                    <p className="text-sm text-gray-600">cases</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
