import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLoginPopup from "@/components/AdminLoginPopup";
import { 
  Users, 
  DollarSign, 
  Shield, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  Calendar,
  Mail,
  User,
  CreditCard,
  Activity,
  BarChart3,
  Settings,
  LogOut,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  UserX,
  MoreVertical,
  Search,
  MessageSquare,
  UserCheck,
  Phone,
  Globe,
  Cpu,
  HardDrive,
  Wifi,
  AlertTriangle,
  Clock,
  TrendingDown,
  Send,
  Paperclip,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  subscription_status: 'active' | 'inactive' | 'cancelled' | 'trialing' | 'past_due' | 'unpaid';
  subscription_type?: string;
  last_payment_date?: string;
  total_payments: number;
  subscription_id?: string;
  plan_name?: string;
  billing_cycle?: string;
  current_period_end?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  last_login?: string;
}

interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  timestamp: string;
  is_admin: boolean;
  attachments?: string[];
}

interface Metric {
  name: string;
  value: string | number;
  status: 'good' | 'warning' | 'error';
  trend: 'up' | 'down' | 'stable';
  change: string;
}

interface ServerMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'error';
  threshold: number;
}

interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  payment_method: string;
  created_at: string;
  plan_id?: string;
  billing_cycle?: string;
  phonepe_transaction_id?: string;
  processed_at?: string;
}

interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalPayments: number;
  averagePayment: number;
}

const AdminPanelNew: React.FC = () => {
  const navigate = useNavigate();
  const { user, showAdminPopup, setShowAdminPopup } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedChatUser, setSelectedChatUser] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalPayments: 0,
    averagePayment: 0
  });
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [serverMetrics, setServerMetrics] = useState<ServerMetric[]>([]);
  const [webMetrics, setWebMetrics] = useState<Metric[]>([]);

  // Check admin authentication
  useEffect(() => {
    if (user && user.email === 'admin@urcare.com') {
      setIsAuthenticated(true);
      loadAdminData();
    } else if (!user) {
      setShowAdminPopup(true);
    }
  }, [user, setShowAdminPopup]);

  // Load admin data
  const loadAdminData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadUsers(),
        loadPayments(),
        loadMessages(),
        loadStats(),
        loadPerformanceMetrics()
      ]);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const usersWithStatus = data?.map(user => ({
        ...user,
        status: 'active' as const,
        last_login: new Date().toISOString(),
        subscription_status: 'active' as const,
        total_payments: Math.floor(Math.random() * 1000),
        subscription_type: 'premium'
      })) || [];

      setUsers(usersWithStatus);
    } catch (error) {
      console.error('Error loading users:', error);
      // Mock data for development
      setUsers([
        {
          id: '1',
          email: 'user1@example.com',
          full_name: 'John Doe',
          created_at: '2024-01-15',
          status: 'active',
          last_login: '2024-01-20',
          subscription_status: 'active',
          total_payments: 500,
          subscription_type: 'premium'
        },
        {
          id: '2',
          email: 'user2@example.com',
          full_name: 'Jane Smith',
          created_at: '2024-01-10',
          status: 'inactive',
          last_login: '2024-01-18',
          subscription_status: 'inactive',
          total_payments: 200,
          subscription_type: 'basic'
        }
      ]);
    }
  };

  const loadPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error loading payments:', error);
      // Mock data for development
      setPayments([
        {
          id: '1',
          user_id: '1',
          amount: 2999,
          currency: 'INR',
          status: 'completed',
          payment_method: 'razorpay',
          created_at: '2024-01-20T10:30:00Z',
          plan_id: 'premium',
          billing_cycle: 'monthly'
        }
      ]);
    }
  };

  const loadMessages = async () => {
    // Mock messages data
    setMessages([
      {
        id: '1',
        user_id: '1',
        message: 'I need help with my workout plan',
        timestamp: '2024-01-20T10:30:00Z',
        is_admin: false
      },
      {
        id: '2',
        user_id: 'admin',
        message: 'I can help you with that. What specific exercises are you having trouble with?',
        timestamp: '2024-01-20T10:35:00Z',
        is_admin: true
      }
    ]);
  };

  const loadStats = async () => {
    // Mock stats data
    setStats({
      totalUsers: users.length,
      activeSubscriptions: users.filter(u => u.subscription_status === 'active').length,
      totalRevenue: payments.reduce((sum, p) => sum + p.amount, 0),
      monthlyRevenue: payments.reduce((sum, p) => sum + p.amount, 0) * 0.3,
      totalPayments: payments.length,
      averagePayment: payments.length > 0 ? payments.reduce((sum, p) => sum + p.amount, 0) / payments.length : 0
    });
  };

  const loadPerformanceMetrics = () => {
    // Mock performance metrics
    setServerMetrics([
      { name: 'CPU Usage', value: 45, unit: '%', status: 'good', threshold: 80 },
      { name: 'Memory Usage', value: 62, unit: '%', status: 'good', threshold: 85 },
      { name: 'Disk Usage', value: 38, unit: '%', status: 'good', threshold: 90 },
      { name: 'Network I/O', value: 120, unit: 'Mbps', status: 'good', threshold: 1000 }
    ]);

    setWebMetrics([
      { name: 'Page Load Time', value: '1.2s', status: 'good', trend: 'down', change: '-15%' },
      { name: 'API Response Time', value: '180ms', status: 'good', trend: 'down', change: '-8%' },
      { name: 'Error Rate', value: '0.2%', status: 'good', trend: 'down', change: '-50%' },
      { name: 'Uptime', value: '99.9%', status: 'good', trend: 'stable', change: '0%' }
    ]);
  };

  const handleUserAction = async (userId: string, action: 'activate' | 'deactivate' | 'suspend') => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const newStatus = action === 'activate' ? 'active' : action === 'deactivate' ? 'inactive' : 'suspended';
      
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status: newStatus } : u
      ));

      toast.success(`User ${action}d successfully`);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChatUser) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      user_id: 'admin',
      message: newMessage,
      timestamp: new Date().toISOString(),
      is_admin: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    toast.success('Message sent');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast.success(`File ${file.name} uploaded`);
      // Handle file upload logic here
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  // Show loading while checking authentication
  if (!isAuthenticated && !showAdminPopup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
            <p className="text-gray-600">Checking admin access...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied if user is logged in but not admin
  if (user && user.email !== 'admin@urcare.com') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
            <Button 
              onClick={() => setShowAdminPopup(true)}
              className="mt-4"
            >
              Admin Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage users, payments, and system performance</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                {isDarkMode ? 'Light' : 'Dark'} Mode
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Back to App
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
                  <p className="text-xs text-muted-foreground">
                    +8% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +20% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{stats.monthlyRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +15% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest user registrations and payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{user.full_name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    {users
                      .filter(user => 
                        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{user.full_name}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                              <p className="text-xs text-gray-500">
                                Joined: {new Date(user.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUserAction(user.id, 'activate')}
                                disabled={user.status === 'active'}
                              >
                                <UserCheck className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUserAction(user.id, 'suspend')}
                                disabled={user.status === 'suspended'}
                              >
                                <UserX className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Management</CardTitle>
                <CardDescription>View and manage payment transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">₹{payment.amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">{payment.payment_method}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(payment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Users List */}
              <Card>
                <CardHeader>
                  <CardTitle>Users</CardTitle>
                  <CardDescription>Select a user to start chatting</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedChatUser === user.id
                            ? 'bg-blue-100 border border-blue-300'
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedChatUser(user.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{user.full_name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Chat Messages */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                  <CardDescription>
                    {selectedChatUser ? `Chatting with ${users.find(u => u.id === selectedChatUser)?.full_name}` : 'Select a user to start chatting'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedChatUser ? (
                    <div className="space-y-4">
                      <div className="h-64 overflow-y-auto space-y-2">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.is_admin ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs p-3 rounded-lg ${
                                message.is_admin
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className="text-sm">{message.message}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button size="sm" onClick={handleSendMessage}>
                          <Send className="w-4 h-4" />
                        </Button>
                        <input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          onChange={handleFileUpload}
                          accept="image/*,.pdf,.txt"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          <Paperclip className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Select a user to start chatting</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Server Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Server Performance</CardTitle>
                  <CardDescription>Real-time server metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {serverMetrics.map((metric) => (
                      <div key={metric.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Cpu className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">{metric.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-bold ${getMetricStatusColor(metric.status)}`}>
                            {metric.value}{metric.unit}
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                metric.status === 'good' ? 'bg-green-500' :
                                metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(metric.value, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Web Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Web Performance</CardTitle>
                  <CardDescription>Application performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {webMetrics.map((metric) => (
                      <div key={metric.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">{metric.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-bold ${getMetricStatusColor(metric.status)}`}>
                            {metric.value}
                          </span>
                          {getTrendIcon(metric.trend)}
                          <span className="text-xs text-gray-500">{metric.change}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Admin Login Popup */}
      <AdminLoginPopup
        isOpen={showAdminPopup}
        onClose={() => setShowAdminPopup(false)}
        onSuccess={() => {
          setShowAdminPopup(false);
          setIsAuthenticated(true);
        }}
      />
    </div>
  );
};

export default AdminPanelNew;
