import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  QrCode, 
  TrendingUp, 
  DollarSign, 
  RefreshCw,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';

interface Payment {
  id: string;
  userId: string;
  amount: number;
  method: 'qr' | 'phonepe' | 'card';
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
  orderId: string;
  userEmail?: string;
  userName?: string;
}

interface PaymentChartProps {
  onRefresh?: () => void;
}

const PaymentChart: React.FC<PaymentChartProps> = ({ onRefresh }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  // Mock data - replace with actual API calls
  const mockPayments: Payment[] = [
    {
      id: '1',
      userId: 'user1',
      amount: 299,
      method: 'qr',
      status: 'completed',
      createdAt: '2025-10-01T10:30:00Z',
      orderId: 'ORDER_001',
      userEmail: 'user1@example.com',
      userName: 'John Doe'
    },
    {
      id: '2',
      userId: 'user2',
      amount: 499,
      method: 'phonepe',
      status: 'completed',
      createdAt: '2025-10-01T14:20:00Z',
      orderId: 'ORDER_002',
      userEmail: 'user2@example.com',
      userName: 'Jane Smith'
    },
    {
      id: '3',
      userId: 'user3',
      amount: 199,
      method: 'qr',
      status: 'pending',
      createdAt: '2025-10-02T09:15:00Z',
      orderId: 'ORDER_003',
      userEmail: 'user3@example.com',
      userName: 'Bob Johnson'
    },
    {
      id: '4',
      userId: 'user4',
      amount: 399,
      method: 'phonepe',
      status: 'completed',
      createdAt: '2025-10-02T16:45:00Z',
      orderId: 'ORDER_004',
      userEmail: 'user4@example.com',
      userName: 'Alice Brown'
    },
    {
      id: '5',
      userId: 'user5',
      amount: 599,
      method: 'qr',
      status: 'failed',
      createdAt: '2025-10-03T11:30:00Z',
      orderId: 'ORDER_005',
      userEmail: 'user5@example.com',
      userName: 'Charlie Wilson'
    }
  ];

  // Load payments
  const loadPayments = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPayments(mockPayments);
    } catch (error) {
      console.error('Error loading payments:', error);
      toast.error('Failed to load payments');
    } finally {
      setIsLoading(false);
    }
  };

  // Load payments on component mount
  useEffect(() => {
    loadPayments();
  }, []);

  // Refresh handler
  const handleRefresh = () => {
    loadPayments();
    if (onRefresh) onRefresh();
  };

  // Calculate statistics
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalTransactions = payments.length;
  const completedTransactions = payments.filter(p => p.status === 'completed').length;
  const pendingTransactions = payments.filter(p => p.status === 'pending').length;
  const failedTransactions = payments.filter(p => p.status === 'failed').length;

  // Prepare chart data
  const prepareChartData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayPayments = payments.filter(p => 
        p.createdAt.split('T')[0] === dateStr && p.status === 'completed'
      );
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: dayPayments.reduce((sum, p) => sum + p.amount, 0),
        transactions: dayPayments.length
      });
    }
    
    return data;
  };

  const chartData = prepareChartData();

  // Payment method distribution
  const methodDistribution = [
    { name: 'QR Code', value: payments.filter(p => p.method === 'qr').length, color: '#3B82F6' },
    { name: 'PhonePe', value: payments.filter(p => p.method === 'phonepe').length, color: '#10B981' },
    { name: 'Card', value: payments.filter(p => p.method === 'card').length, color: '#F59E0B' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'qr':
        return <QrCode className="w-4 h-4" />;
      case 'phonepe':
        return <CreditCard className="w-4 h-4" />;
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            Payment Analytics
          </h2>
          <p className="text-gray-600">Track payments and revenue trends</p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalTransactions > 0 ? Math.round((completedTransactions / totalTransactions) * 100) : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingTransactions}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={methodDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {methodDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">Loading transactions...</p>
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No transactions found</p>
              </div>
            ) : (
              payments.slice(0, 10).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {getMethodIcon(payment.method)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{payment.userName || 'Unknown User'}</p>
                      <p className="text-sm text-gray-600">{payment.userEmail}</p>
                      <p className="text-xs text-gray-500">Order: {payment.orderId}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{payment.amount}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentChart;
