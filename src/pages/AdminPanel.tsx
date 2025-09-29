import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  Search
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
}

interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  created_at: string;
  payment_method: string;
  subscription_id?: string;
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

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalPayments: 0,
    averagePayment: 0
  });
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Check if already authenticated
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      loadAdminData();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (username === "arshadmin" && password === "admin123") {
        localStorage.setItem('adminAuth', 'true');
        setIsAuthenticated(true);
        await loadAdminData();
        toast.success("Admin login successful!");
      } else {
        toast.error("Invalid credentials!");
      }
    } catch (error) {
      toast.error("Login failed!");
    } finally {
      setLoading(false);
    }
  };

  const loadAdminData = async () => {
    setLoading(true);
    try {
      console.log('Loading admin data...');
      
      // Load user profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error loading profiles:', profilesError);
        throw profilesError;
      }

      console.log('Profiles loaded:', profilesData?.length || 0);

      // Load subscriptions with plan details
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from('subscriptions')
        .select(`
          id,
          user_id,
          status,
          billing_cycle,
          current_period_end,
          subscription_plans!inner(name)
        `);

      if (subscriptionsError) {
        console.error('Error loading subscriptions:', subscriptionsError);
        // Don't throw error, just log it
      }

      // Load payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (paymentsError) {
        console.error('Error loading payments:', paymentsError);
        // Don't throw error, just log it
      }

      // Process users data - for now, we'll use a placeholder email
      const processedUsers = profilesData?.map((profile) => {
        const userSubscription = subscriptionsData?.find(s => s.user_id === profile.id);
        const userPayments = paymentsData?.filter(p => p.user_id === profile.id) || [];
        const totalPayments = userPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
        const lastPayment = userPayments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
        
        return {
          id: profile.id,
          email: `user-${profile.id.slice(0, 8)}@example.com`, // Placeholder email
          full_name: profile.full_name || 'N/A',
          created_at: profile.created_at,
          status: profile.status || 'active',
          subscription_status: userSubscription?.status || 'inactive',
          subscription_id: userSubscription?.id,
          plan_name: userSubscription?.subscription_plans?.name,
          billing_cycle: userSubscription?.billing_cycle,
          current_period_end: userSubscription?.current_period_end,
          last_payment_date: lastPayment?.created_at,
          total_payments: totalPayments
        };
      }) || [];

      console.log('Processed users:', processedUsers.length);
      setUsers(processedUsers);
      setPayments(paymentsData || []);

      // Calculate stats
      const totalUsers = processedUsers.length;
      const activeSubscriptions = processedUsers.filter(u => u.subscription_status === 'active').length;
      const totalRevenue = paymentsData?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
      const monthlyRevenue = paymentsData?.filter(p => {
        const paymentDate = new Date(p.created_at);
        const currentDate = new Date();
        return paymentDate.getMonth() === currentDate.getMonth() && 
               paymentDate.getFullYear() === currentDate.getFullYear();
      }).reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
      const totalPayments = paymentsData?.length || 0;
      const averagePayment = totalPayments > 0 ? totalRevenue / totalPayments : 0;

      setStats({
        totalUsers,
        activeSubscriptions,
        totalRevenue,
        monthlyRevenue,
        totalPayments,
        averagePayment
      });

      console.log('Admin data loaded successfully');

    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const toggleSubscription = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'canceled' : 'active';
      
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: newStatus })
        .eq('user_id', userId);

      if (error) throw error;

      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, subscription_status: newStatus as 'active' | 'inactive' | 'cancelled' | 'trialing' | 'past_due' | 'unpaid' }
          : user
      ));

      toast.success(`Subscription ${newStatus === 'active' ? 'enabled' : 'disabled'} successfully!`);
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error("Failed to update subscription");
    }
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setShowUserDialog(true);
  };

  const deleteUserSubscription = async () => {
    if (!selectedUser) return;
    
    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('user_id', selectedUser.id);

      if (error) throw error;

      // Update local state
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, subscription_status: 'inactive', subscription_id: undefined, plan_name: undefined }
          : user
      ));

      toast.success("User subscription deleted successfully!");
      setShowUserDialog(false);
    } catch (error) {
      console.error('Error deleting subscription:', error);
      toast.error("Failed to delete subscription");
    }
  };

  const removeUser = async () => {
    if (!selectedUser) return;
    
    try {
      // First delete the user's subscription
      await supabase
        .from('subscriptions')
        .delete()
        .eq('user_id', selectedUser.id);

      // Then delete the user profile
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', selectedUser.id);

      if (error) throw error;

      // Update local state
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setStats(prev => ({
        ...prev,
        totalUsers: prev.totalUsers - 1
      }));

      toast.success("User removed successfully!");
      setShowUserDialog(false);
    } catch (error) {
      console.error('Error removing user:', error);
      toast.error("Failed to remove user");
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setUsers([]);
    setPayments([]);
    toast.success("Logged out successfully!");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Admin Panel
            </CardTitle>
            <CardDescription className="text-slate-600">
              Enter your admin credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-semibold text-slate-700">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="bg-white border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="bg-white border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 text-lg mt-2">
              Manage users, subscriptions, and payments
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-slate-800">{stats.totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Active Subscriptions</p>
                  <p className="text-3xl font-bold text-slate-800">{stats.activeSubscriptions}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-slate-800">{formatCurrency(stats.totalRevenue)}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-slate-800">{formatCurrency(stats.monthlyRevenue)}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users Table */}
          <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Users Management
              </CardTitle>
              <CardDescription>
                Manage user subscriptions and view user details
              </CardDescription>
              <div className="flex items-center gap-2 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-slate-200 focus:border-slate-400"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                      onClick={() => handleUserClick(user)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-slate-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-800">{user.full_name || 'N/A'}</h4>
                              <p className="text-sm text-slate-600 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {user.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>Joined: {formatDate(user.created_at)}</span>
                            <span>Payments: {formatCurrency(user.total_payments)}</span>
                            {user.plan_name && <span>Plan: {user.plan_name}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`${
                              user.subscription_status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : user.subscription_status === 'trialing'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {user.subscription_status}
                          </Badge>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSubscription(user.id, user.subscription_status);
                            }}
                            variant="outline"
                            size="sm"
                            className={`${
                              user.subscription_status === 'active'
                                ? 'border-red-300 text-red-700 hover:bg-red-50'
                                : 'border-green-300 text-green-700 hover:bg-green-50'
                            }`}
                          >
                            {user.subscription_status === 'active' ? (
                              <>
                                <XCircle className="w-3 h-3 mr-1" />
                                Disable
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Enable
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUserClick(user);
                            }}
                            variant="outline"
                            size="sm"
                            className="border-slate-300 text-slate-700 hover:bg-slate-50"
                          >
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payments Table */}
          <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                Recent Payments
              </CardTitle>
              <CardDescription>
                Latest payment transactions and revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {payments.slice(0, 10).map((payment) => (
                  <div
                    key={payment.id}
                    className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <CreditCard className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800">
                              {formatCurrency(payment.amount)}
                            </h4>
                            <p className="text-sm text-slate-600">
                              {payment.payment_method} • {payment.status}
                            </p>
                          </div>
                        </div>
                        <div className="text-xs text-slate-500">
                          {formatDate(payment.created_at)}
                        </div>
                      </div>
                      <Badge
                        className={`${
                          payment.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Total Payments</h3>
              <p className="text-3xl font-bold text-slate-800">{stats.totalPayments}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Average Payment</h3>
              <p className="text-3xl font-bold text-slate-800">{formatCurrency(stats.averagePayment)}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Conversion Rate</h3>
              <p className="text-3xl font-bold text-slate-800">
                {stats.totalUsers > 0 ? Math.round((stats.activeSubscriptions / stats.totalUsers) * 100) : 0}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* User Management Dialog */}
        <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
          <DialogContent className="bg-white border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                User Management
              </DialogTitle>
              <DialogDescription>
                Manage user subscription and account settings
              </DialogDescription>
            </DialogHeader>
            
            {selectedUser && (
              <div className="space-y-6">
                {/* User Info */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{selectedUser.full_name || 'N/A'}</h3>
                      <p className="text-sm text-slate-600 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Joined:</span>
                      <span className="ml-2 text-slate-800">{formatDate(selectedUser.created_at)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Total Payments:</span>
                      <span className="ml-2 text-slate-800">{formatCurrency(selectedUser.total_payments)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Status:</span>
                      <Badge className={`ml-2 ${
                        selectedUser.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedUser.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-slate-500">Subscription:</span>
                      <Badge className={`ml-2 ${
                        selectedUser.subscription_status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : selectedUser.subscription_status === 'trialing'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedUser.subscription_status}
                      </Badge>
                    </div>
                    {selectedUser.plan_name && (
                      <div className="col-span-2">
                        <span className="text-slate-500">Plan:</span>
                        <span className="ml-2 text-slate-800">{selectedUser.plan_name}</span>
                        {selectedUser.billing_cycle && (
                          <span className="ml-2 text-slate-500">({selectedUser.billing_cycle})</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={deleteUserSubscription}
                    variant="outline"
                    className="w-full border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Subscription
                  </Button>
                  
                  <Button
                    onClick={removeUser}
                    variant="outline"
                    className="w-full border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <UserX className="w-4 h-4 mr-2" />
                    Remove User
                  </Button>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button
                onClick={() => setShowUserDialog(false)}
                variant="outline"
                className="border-slate-300 text-slate-700"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminPanel;

