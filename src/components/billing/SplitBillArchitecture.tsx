
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  CreditCard, 
  Shield, 
  Building,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface SplitPayment {
  id: string;
  type: 'Self Pay' | 'TPA Coverage' | 'Government Scheme' | 'Corporate';
  amount: number;
  percentage: number;
  status: 'Pending' | 'Approved' | 'Processing' | 'Completed' | 'Failed';
  approvalBy?: string;
  notes?: string;
}

interface SplitBill {
  id: string;
  patient: string;
  totalAmount: number;
  splits: SplitPayment[];
  status: 'Draft' | 'Pending Approval' | 'Processing' | 'Completed';
  createdAt: string;
}

export const SplitBillArchitecture = () => {
  const [selectedBill, setSelectedBill] = useState<string | null>(null);

  const splitBills: SplitBill[] = [
    {
      id: 'SB001',
      patient: 'John Doe (REG001234)',
      totalAmount: 5000.00,
      splits: [
        { id: 'SP001', type: 'Self Pay', amount: 1500.00, percentage: 30, status: 'Approved', approvalBy: 'Patient' },
        { id: 'SP002', type: 'TPA Coverage', amount: 3000.00, percentage: 60, status: 'Approved', approvalBy: 'TPA Manager' },
        { id: 'SP003', type: 'Government Scheme', amount: 500.00, percentage: 10, status: 'Approved', approvalBy: 'Govt Portal' }
      ],
      status: 'Processing',
      createdAt: '2024-06-01 10:30'
    },
    {
      id: 'SB002',
      patient: 'Jane Wilson (REG001235)',
      totalAmount: 12500.00,
      splits: [
        { id: 'SP004', type: 'Self Pay', amount: 2500.00, percentage: 20, status: 'Pending', notes: 'Awaiting patient confirmation' },
        { id: 'SP005', type: 'TPA Coverage', amount: 7500.00, percentage: 60, status: 'Approved', approvalBy: 'Insurance Co.' },
        { id: 'SP006', type: 'Corporate', amount: 2500.00, percentage: 20, status: 'Processing', approvalBy: 'HR Department' }
      ],
      status: 'Pending Approval',
      createdAt: '2024-06-01 11:15'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      'Pending': 'bg-amber-100 text-amber-800',
      'Approved': 'bg-green-100 text-green-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-gray-100 text-gray-800',
      'Failed': 'bg-red-100 text-red-800'
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentIcon = (type: string) => {
    const icons: { [key: string]: any } = {
      'Self Pay': CreditCard,
      'TPA Coverage': Shield,
      'Government Scheme': Building,
      'Corporate': Users
    };
    return icons[type] || DollarSign;
  };

  const handleProcessBill = (billId: string) => {
    console.log(`Processing split bill ${billId}`);
  };

  const handleApproveSplit = (billId: string, splitId: string) => {
    console.log(`Approving split ${splitId} for bill ${billId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Split Bill Architecture</h2>
          <p className="text-gray-600">Advanced billing splitting with multi-payer support</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Users className="w-4 h-4 mr-2" />
          Create Split Bill
        </Button>
      </div>

      {/* Split Bills List */}
      <div className="grid gap-6">
        {splitBills.map((bill) => (
          <Card key={bill.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{bill.id} - {bill.patient}</CardTitle>
                  <CardDescription>Created: {bill.createdAt}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusBadge(bill.status)}>
                    {bill.status}
                  </Badge>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      ${bill.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-gray-600">Total Amount</p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Payment Split Configuration</h4>
                
                {bill.splits.map((split) => {
                  const IconComponent = getPaymentIcon(split.type);
                  return (
                    <div key={split.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{split.type}</p>
                            <p className="text-sm text-gray-600">{split.percentage}% of total</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-lg font-semibold">
                              ${split.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          <Badge className={getStatusBadge(split.status)}>
                            {split.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="mb-3">
                        <Progress value={split.percentage} className="h-2" />
                      </div>

                      {split.approvalBy && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Approved by: {split.approvalBy}</span>
                        </div>
                      )}

                      {split.notes && (
                        <div className="flex items-center gap-2 text-sm text-amber-600 mt-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{split.notes}</span>
                        </div>
                      )}

                      {split.status === 'Pending' && (
                        <div className="mt-3 flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleApproveSplit(bill.id, split.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </Button>
                          <Button size="sm" variant="outline">
                            Request Info
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Processing Time: 2-3 business days</span>
                  </div>
                  
                  {bill.status === 'Processing' && (
                    <Button 
                      onClick={() => handleProcessBill(bill.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Process All Payments
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Split Billing Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">
                ${splitBills.reduce((sum, bill) => sum + bill.totalAmount, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Split Amount</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">
                {splitBills.filter(bill => bill.status === 'Completed').length}
              </p>
              <p className="text-sm text-gray-600">Completed Bills</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <p className="text-3xl font-bold text-amber-600">
                {splitBills.filter(bill => bill.status === 'Pending Approval').length}
              </p>
              <p className="text-sm text-gray-600">Pending Approval</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">
                {splitBills.reduce((sum, bill) => sum + bill.splits.length, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Payment Methods</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
