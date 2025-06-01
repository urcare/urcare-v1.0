
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Target, 
  Clock,
  CreditCard,
  Banknote,
  Smartphone,
  DollarSign
} from 'lucide-react';

interface CollectionMetric {
  label: string;
  current: number;
  target: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

interface PaymentMethodStat {
  method: string;
  amount: number;
  percentage: number;
  transactionCount: number;
  color: string;
  icon: any;
}

interface OutstandingBill {
  billId: string;
  patientName: string;
  amount: number;
  daysOverdue: number;
  department: string;
  priority: 'High' | 'Medium' | 'Low';
}

export const LiveCollectionDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveCollections, setLiveCollections] = useState(145678.50);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate live collection updates
      setLiveCollections(prev => prev + Math.random() * 50);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const collectionMetrics: CollectionMetric[] = [
    { label: 'Daily Target', current: liveCollections, target: 150000, percentage: 97.1, trend: 'up' },
    { label: 'Weekly Target', current: 823456, target: 1000000, percentage: 82.3, trend: 'up' },
    { label: 'Monthly Target', current: 3247891, target: 4000000, percentage: 81.2, trend: 'stable' }
  ];

  const paymentMethods: PaymentMethodStat[] = [
    { method: 'UPI', amount: 45600, percentage: 31.3, transactionCount: 156, color: '#3b82f6', icon: Smartphone },
    { method: 'Card', amount: 52300, percentage: 35.9, transactionCount: 89, color: '#059669', icon: CreditCard },
    { method: 'Cash', amount: 28400, percentage: 19.5, transactionCount: 67, color: '#dc2626', icon: Banknote },
    { method: 'Bank Transfer', amount: 19378, percentage: 13.3, transactionCount: 23, color: '#f59e0b', icon: DollarSign }
  ];

  const outstandingBills: OutstandingBill[] = [
    { billId: 'BILL12345', patientName: 'John Doe', amount: 2500, daysOverdue: 15, department: 'Cardiology', priority: 'High' },
    { billId: 'BILL12346', patientName: 'Jane Wilson', amount: 1800, daysOverdue: 8, department: 'Surgery', priority: 'Medium' },
    { billId: 'BILL12347', patientName: 'Bob Chen', amount: 950, daysOverdue: 5, department: 'Laboratory', priority: 'Low' },
    { billId: 'BILL12348', patientName: 'Alice Smith', amount: 3200, daysOverdue: 22, department: 'Emergency', priority: 'High' }
  ];

  const getPriorityBadge = (priority: string) => {
    const variants: { [key: string]: string } = {
      'High': 'bg-red-100 text-red-800',
      'Medium': 'bg-amber-100 text-amber-800',
      'Low': 'bg-green-100 text-green-800'
    };
    return variants[priority] || 'bg-gray-100 text-gray-800';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '↗️';
    if (trend === 'down') return '↘️';
    return '➡️';
  };

  const totalOutstanding = outstandingBills.reduce((sum, bill) => sum + bill.amount, 0);
  const avgCollectionTime = 2.3; // days
  const collectionEfficiency = 94.7; // percentage

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Collection Dashboard</h2>
          <p className="text-gray-600">Real-time collection tracking and efficiency metrics</p>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-600">Last updated: {currentTime.toLocaleTimeString()}</p>
          <p className="text-lg font-semibold text-green-600">
            ${liveCollections.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Live Collection Counter */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Today's Collections (Live)</h3>
            <p className="text-5xl font-bold text-green-600 mb-4">
              ${liveCollections.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-green-600">+12.5% vs yesterday</span>
              </div>
              <div className="text-gray-600">
                Target: $150,000
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Target Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {collectionMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">{metric.label}</h3>
                <div className="flex items-center gap-1 text-sm">
                  <span>{getTrendIcon(metric.trend)}</span>
                  <span>{metric.percentage}%</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Current: ${metric.current.toLocaleString()}</span>
                  <span>Target: ${metric.target.toLocaleString()}</span>
                </div>
                <Progress value={metric.percentage} className="h-3" />
                <p className="text-xs text-gray-600 text-center">
                  ${(metric.target - metric.current).toLocaleString()} remaining
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Method Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method Distribution</CardTitle>
          <CardDescription>Real-time breakdown of payment modes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {paymentMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${method.color}20` }}>
                        <IconComponent className="w-4 h-4" style={{ color: method.color }} />
                      </div>
                      <span className="font-medium">{method.method}</span>
                    </div>
                    <Badge variant="outline">{method.percentage}%</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-lg font-semibold" style={{ color: method.color }}>
                      ${method.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">{method.transactionCount} transactions</p>
                    <Progress value={method.percentage} className="h-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Collection Efficiency Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Collection Efficiency</p>
                <p className="text-3xl font-bold text-green-600">{collectionEfficiency}%</p>
              </div>
              <Target className="w-12 h-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Collection Time</p>
                <p className="text-3xl font-bold text-blue-600">{avgCollectionTime} days</p>
              </div>
              <Clock className="w-12 h-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding Amount</p>
                <p className="text-3xl font-bold text-red-600">
                  ${totalOutstanding.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Outstanding Bills Aging Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Outstanding Bills - Aging Analysis</CardTitle>
          <CardDescription>Bills pending payment with priority classification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {outstandingBills.map((bill, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{bill.billId} - {bill.patientName}</h3>
                    <p className="text-sm text-gray-600">{bill.department}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-semibold">${bill.amount.toLocaleString()}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Days Overdue</p>
                    <p className="font-semibold text-red-600">{bill.daysOverdue}</p>
                  </div>
                  
                  <Badge className={getPriorityBadge(bill.priority)}>
                    {bill.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
