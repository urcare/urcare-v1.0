
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  Banknote,
  Smartphone,
  Building2,
  Bitcoin,
  QrCode,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface PaymentTransaction {
  id: string;
  amount: number;
  method: 'Cash' | 'UPI' | 'Card' | 'Digital Wallet' | 'Bank Transfer' | 'Cryptocurrency';
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed' | 'Refunded';
  timestamp: string;
  patientName: string;
  reference: string;
  fees?: number;
}

interface PaymentStats {
  method: string;
  totalAmount: number;
  transactionCount: number;
  averageAmount: number;
  successRate: number;
  fees: number;
}

export const PaymentModeTracker = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

  const transactions: PaymentTransaction[] = [
    {
      id: 'TXN001',
      amount: 175.00,
      method: 'UPI',
      status: 'Completed',
      timestamp: '2024-06-01 09:30',
      patientName: 'John Doe',
      reference: 'UPI123456789',
      fees: 0
    },
    {
      id: 'TXN002',
      amount: 4130.00,
      method: 'Card',
      status: 'Completed',
      timestamp: '2024-06-01 10:15',
      patientName: 'Jane Wilson',
      reference: 'CARD987654321',
      fees: 82.60
    },
    {
      id: 'TXN003',
      amount: 500.00,
      method: 'Cash',
      status: 'Completed',
      timestamp: '2024-06-01 11:00',
      patientName: 'Bob Chen',
      reference: 'CASH001',
      fees: 0
    },
    {
      id: 'TXN004',
      amount: 1250.00,
      method: 'Digital Wallet',
      status: 'Processing',
      timestamp: '2024-06-01 11:30',
      patientName: 'Alice Smith',
      reference: 'WALLET567890',
      fees: 12.50
    },
    {
      id: 'TXN005',
      amount: 2500.00,
      method: 'Bank Transfer',
      status: 'Pending',
      timestamp: '2024-06-01 12:00',
      patientName: 'David Brown',
      reference: 'NEFT202406001',
      fees: 25.00
    }
  ];

  const paymentStats: PaymentStats[] = [
    {
      method: 'UPI',
      totalAmount: 12500.00,
      transactionCount: 45,
      averageAmount: 277.78,
      successRate: 98.5,
      fees: 0
    },
    {
      method: 'Card',
      totalAmount: 25600.00,
      transactionCount: 32,
      averageAmount: 800.00,
      successRate: 96.8,
      fees: 512.00
    },
    {
      method: 'Cash',
      totalAmount: 8750.00,
      transactionCount: 28,
      averageAmount: 312.50,
      successRate: 100.0,
      fees: 0
    },
    {
      method: 'Digital Wallet',
      totalAmount: 6200.00,
      transactionCount: 18,
      averageAmount: 344.44,
      successRate: 94.2,
      fees: 124.00
    },
    {
      method: 'Bank Transfer',
      totalAmount: 15800.00,
      transactionCount: 12,
      averageAmount: 1316.67,
      successRate: 92.5,
      fees: 316.00
    },
    {
      method: 'Cryptocurrency',
      totalAmount: 3200.00,
      transactionCount: 3,
      averageAmount: 1066.67,
      successRate: 85.0,
      fees: 96.00
    }
  ];

  const getMethodIcon = (method: string) => {
    const icons: { [key: string]: any } = {
      'Cash': Banknote,
      'UPI': QrCode,
      'Card': CreditCard,
      'Digital Wallet': Smartphone,
      'Bank Transfer': Building2,
      'Cryptocurrency': Bitcoin
    };
    return icons[method] || CreditCard;
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      'Pending': 'bg-amber-100 text-amber-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Failed': 'bg-red-100 text-red-800',
      'Refunded': 'bg-gray-100 text-gray-800'
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: any } = {
      'Pending': Clock,
      'Processing': Clock,
      'Completed': CheckCircle,
      'Failed': AlertTriangle,
      'Refunded': AlertTriangle
    };
    return icons[status] || Clock;
  };

  const totalAmount = paymentStats.reduce((sum, stat) => sum + stat.totalAmount, 0);
  const totalTransactions = paymentStats.reduce((sum, stat) => sum + stat.transactionCount, 0);
  const totalFees = paymentStats.reduce((sum, stat) => sum + stat.fees, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Mode Comprehensive Tracker</h2>
          <p className="text-gray-600">Real-time payment processing with multi-mode support</p>
        </div>
        
        <div className="flex gap-2">
          {(['today', 'week', 'month'] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={selectedPeriod === period ? 'bg-blue-600' : ''}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Payment Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">
                  ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-3xl font-bold text-blue-600">{totalTransactions}</p>
              </div>
              <CreditCard className="w-12 h-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing Fees</p>
                <p className="text-3xl font-bold text-red-600">
                  ${totalFees.toFixed(2)}
                </p>
              </div>
              <Banknote className="w-12 h-12 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Transaction</p>
                <p className="text-3xl font-bold text-purple-600">
                  ${(totalAmount / totalTransactions).toFixed(2)}
                </p>
              </div>
              <Smartphone className="w-12 h-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method Analysis</CardTitle>
          <CardDescription>Breakdown of payment methods and their performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {paymentStats.map((stat) => {
              const IconComponent = getMethodIcon(stat.method);
              const percentage = (stat.totalAmount / totalAmount) * 100;
              
              return (
                <div key={stat.method} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{stat.method}</h3>
                        <p className="text-sm text-gray-600">{stat.transactionCount} transactions</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        ${stat.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-sm text-gray-600">{percentage.toFixed(1)}% of total</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Average Amount</p>
                      <p className="font-medium">${stat.averageAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Success Rate</p>
                      <p className="font-medium text-green-600">{stat.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Processing Fees</p>
                      <p className="font-medium text-red-600">${stat.fees.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Net Revenue</p>
                      <p className="font-medium">${(stat.totalAmount - stat.fees).toFixed(2)}</p>
                    </div>
                  </div>

                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest payment transactions across all methods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => {
              const MethodIcon = getMethodIcon(transaction.method);
              const StatusIcon = getStatusIcon(transaction.status);
              
              return (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <MethodIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    
                    <div>
                      <h3 className="font-medium">{transaction.id}</h3>
                      <p className="text-sm text-gray-600">{transaction.patientName}</p>
                      <p className="text-xs text-gray-500">{transaction.reference}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Method</p>
                      <p className="font-medium">{transaction.method}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-semibold">${transaction.amount.toFixed(2)}</p>
                      {transaction.fees && transaction.fees > 0 && (
                        <p className="text-xs text-red-600">Fee: ${transaction.fees.toFixed(2)}</p>
                      )}
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="text-sm">{transaction.timestamp}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <StatusIcon className="w-4 h-4" />
                      <Badge className={getStatusBadge(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
