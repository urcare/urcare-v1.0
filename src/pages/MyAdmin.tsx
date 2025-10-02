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
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Image as ImageIcon,
  FileText,
  Download,
  Upload,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UserData {
  id: string;
  email: string;
  full_name: string;
  subscription_status: string;
  created_at: string;
  last_sign_in: string;
  onboarding_completed: boolean;
  city?: string;
  plan_name?: string;
  billing_cycle?: string;
}

interface PaymentData {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  plan_name: string;
  billing_cycle: string;
}

interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  timestamp: string;
  attachments?: string[];
  is_admin: boolean;
}

const MyAdmin: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("users");

  // Check admin access
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const email = user.email?.toLowerCase() || '';
    if (email !== 'admin@urcare.com' && email !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/dashboard');
      return;
    }

    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadUsers(),
        loadPayments(),
        loadChatMessages()
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
        .from('user_profiles')
        .select(`
          id,
          full_name,
          email,
          subscription_status,
          created_at,
          onboarding_completed,
          city,
          plan_name,
          billing_cycle
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Mock last sign in data for demo
      const usersWithLastSignIn = data?.map(user => ({
        ...user,
        last_sign_in: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      })) || [];

      setUsers(usersWithLastSignIn);
    } catch (error) {
      console.error('Error loading users:', error);
      // Mock data for demo
      setUsers([
        {
          id: '1',
          email: 'test@email.com',
          full_name: 'Test User',
          subscription_status: 'active',
          created_at: new Date().toISOString(),
          last_sign_in: new Date().toISOString(),
          onboarding_completed: true,
          city: 'New York',
          plan_name: 'premium',
          billing_cycle: 'annual'
        },
        {
          id: '2',
          email: 'user2@example.com',
          full_name: 'John Doe',
          subscription_status: 'inactive',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          last_sign_in: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          onboarding_completed: false,
          city: 'Los Angeles'
        }
      ]);
    }
  };

  const loadPayments = async () => {
    try {
      // Mock payment data for demo
      const mockPayments: PaymentData[] = [
        {
          id: '1',
          user_id: '1',
          amount: 100,
          currency: 'INR',
          status: 'completed',
          created_at: new Date().toISOString(),
          plan_name: 'premium',
          billing_cycle: 'annual'
        },
        {
          id: '2',
          user_id: '2',
          amount: 50,
          currency: 'INR',
          status: 'pending',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          plan_name: 'basic',
          billing_cycle: 'monthly'
        }
      ];
      setPayments(mockPayments);
    } catch (error) {
      console.error('Error loading payments:', error);
    }
  };

  const loadChatMessages = async () => {
    try {
      // Mock chat data for demo
      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          user_id: '1',
          message: 'I need help with my health plan',
          timestamp: new Date().toISOString(),
          is_admin: false
        },
        {
          id: '2',
          user_id: 'admin',
          message: 'I can help you with that. What specific issues are you facing?',
          timestamp: new Date().toISOString(),
          is_admin: true
        }
      ];
      setChatMessages(mockMessages);
    } catch (error) {
      console.error('Error loading chat messages:', error);
    }
  };

  const handleUserAction = async (userId: string, action: 'activate' | 'deactivate' | 'delete') => {
    try {
      if (action === 'delete') {
        const { error } = await supabase
          .from('user_profiles')
          .delete()
          .eq('id', userId);
        
        if (error) throw error;
        
        setUsers(users.filter(u => u.id !== userId));
        toast.success('User deleted successfully');
      } else {
        const newStatus = action === 'activate' ? 'active' : 'inactive';
        const { error } = await supabase
          .from('user_profiles')
          .update({ subscription_status: newStatus })
          .eq('id', userId);
        
        if (error) throw error;
        
        setUsers(users.map(u => 
          u.id === userId ? { ...u, subscription_status: newStatus } : u
        ));
        toast.success(`User ${action}d successfully`);
      }
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      toast.error(`Failed to ${action} user`);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      user_id: 'admin',
      message: newMessage,
      timestamp: new Date().toISOString(),
      is_admin: true,
      attachments: selectedFile ? [selectedFile.name] : undefined
    };

    setChatMessages([...chatMessages, message]);
    setNewMessage('');
    setSelectedFile(null);
    toast.success('Message sent');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.success(`File selected: ${file.name}`);
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const activeUsers = users.filter(u => u.subscription_status === 'active').length;
  const totalUsers = users.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ArshAdmin Dashboard</h1>
              <p className="text-gray-600">Complete admin control panel</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={loadData}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={() => signOut()}
                variant="outline"
                size="sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">User Control</TabsTrigger>
            <TabsTrigger value="payments">Payment Chart</TabsTrigger>
            <TabsTrigger value="chat">Live Chat</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* User Control Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage user accounts and subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Badge variant="outline">
                    {filteredUsers.length} users
                  </Badge>
                </div>

                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{user.full_name}</h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant={user.subscription_status === 'active' ? 'default' : 'secondary'}
                              >
                                {user.subscription_status}
                              </Badge>
                              {user.plan_name && (
                                <Badge variant="outline">{user.plan_name}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserDialog(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'activate')}
                            disabled={user.subscription_status === 'active'}
                          >
                            <UserCheck className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'deactivate')}
                            disabled={user.subscription_status === 'inactive'}
                          >
                            <UserX className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Chart Tab */}
          <TabsContent value="payments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{totalRevenue}</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {((activeUsers / totalUsers) * 100).toFixed(1)}% of total users
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{payments.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {payments.filter(p => p.status === 'completed').length} completed
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>Latest payment transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Payment #{payment.id}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(payment.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">₹{payment.amount}</div>
                          <Badge
                            variant={payment.status === 'completed' ? 'default' : 'secondary'}
                          >
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Live Chat Support
                </CardTitle>
                <CardDescription>
                  Communicate with users in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Chat Messages */}
                  <ScrollArea className="h-64 border rounded-lg p-4">
                    <div className="space-y-4">
                      {chatMessages.map((message) => (
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
                            {message.attachments && (
                              <div className="mt-2">
                                {message.attachments.map((attachment, index) => (
                                  <div key={index} className="flex items-center gap-1 text-xs">
                                    <Paperclip className="w-3 h-3" />
                                    {attachment}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* File Upload */}
                    <div className="flex items-center gap-2">
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <Paperclip className="w-4 h-4 mr-2" />
                        Attach File
                      </Label>
                      <Input
                        id="file-upload"
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      {selectedFile && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FileText className="w-4 h-4" />
                          {selectedFile.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>Monthly user registration trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-32 flex items-center justify-center text-gray-500">
                    <BarChart3 className="w-8 h-8" />
                    <span className="ml-2">Chart placeholder</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                  <CardDescription>Monthly revenue analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-32 flex items-center justify-center text-gray-500">
                    <TrendingUp className="w-8 h-8" />
                    <span className="ml-2">Chart placeholder</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* User Details Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected user
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <p className="text-sm text-gray-600">{selectedUser.full_name}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="text-sm text-gray-600">{selectedUser.email}</p>
              </div>
              <div>
                <Label>Subscription Status</Label>
                <Badge variant={selectedUser.subscription_status === 'active' ? 'default' : 'secondary'}>
                  {selectedUser.subscription_status}
                </Badge>
              </div>
              <div>
                <Label>Created At</Label>
                <p className="text-sm text-gray-600">
                  {new Date(selectedUser.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <Label>Last Sign In</Label>
                <p className="text-sm text-gray-600">
                  {new Date(selectedUser.last_sign_in).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowUserDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyAdmin;
