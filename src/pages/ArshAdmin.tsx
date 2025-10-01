import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Settings, 
  MessageSquare, 
  UserCheck, 
  UserX, 
  Activity,
  BarChart3,
  Shield,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  status: 'active' | 'inactive' | 'suspended';
  last_login: string;
  subscription_status: string;
}

interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  timestamp: string;
  is_admin: boolean;
  attachments?: string[];
}

const ArshAdmin: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Mock users data
    setUsers([
      {
        id: '1',
        email: 'user1@example.com',
        full_name: 'John Doe',
        created_at: '2024-01-15',
        status: 'active',
        last_login: '2024-01-20',
        subscription_status: 'premium'
      },
      {
        id: '2',
        email: 'user2@example.com',
        full_name: 'Jane Smith',
        created_at: '2024-01-10',
        status: 'inactive',
        last_login: '2024-01-18',
        subscription_status: 'basic'
      }
    ]);

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
  }, []);

  const handleUserStatusChange = (userId: string, status: 'active' | 'inactive' | 'suspended') => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status } : user
    ));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      user_id: 'admin',
      message: newMessage,
      timestamp: new Date().toISOString(),
      is_admin: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user || user.email !== 'admin@urcare.com') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              UrCare Admin Panel
            </h1>
            <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage users, monitor performance, and handle support
            </p>
          </div>
          <Button
            onClick={() => setIsDarkMode(!isDarkMode)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>{isDarkMode ? 'Light' : 'Dark'} Mode</span>
          </Button>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className={`transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Users className="w-5 h-5" />
                  <span>User Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className={`p-4 rounded-lg border transition-colors duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.full_name.charAt(0)}
                          </div>
                          <div>
                            <h3 className={`font-semibold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {user.full_name}
                            </h3>
                            <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {user.email}
                            </p>
                            <p className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                              Last login: {new Date(user.last_login).toLocaleDateString()}
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
                              onClick={() => handleUserStatusChange(user.id, 'active')}
                              className="text-green-600 hover:text-green-700"
                            >
                              <UserCheck className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUserStatusChange(user.id, 'suspended')}
                              className="text-red-600 hover:text-red-700"
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <Card className={`transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <MessageSquare className="w-5 h-5" />
                  <span>Support Messages</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`p-4 rounded-lg border transition-colors duration-300 ${
                      message.is_admin 
                        ? 'bg-blue-50 border-blue-200' 
                        : isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                          message.is_admin ? 'bg-blue-500' : 'bg-green-500'
                        }`}>
                          {message.is_admin ? 'A' : 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`font-semibold text-sm transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {message.is_admin ? 'Admin' : 'User'}
                            </span>
                            <span className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {new Date(message.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {message.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Section */}
                <div className="mt-6 p-4 border rounded-lg">
                  <Label htmlFor="reply-message" className={`text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                    Reply to User
                  </Label>
                  <div className="flex space-x-2 mt-2">
                    <Input
                      id="reply-message"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card className={`transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <BarChart3 className="w-5 h-5" />
                  <span>Performance Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium text-green-800">Active Users</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900">1,234</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-medium text-blue-800">API Calls</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">45,678</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Settings className="w-5 h-5 text-purple-500" />
                      <span className="text-sm font-medium text-purple-800">Uptime</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-900">99.9%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className={`transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Settings className="w-5 h-5" />
                  <span>System Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className={`text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                      OpenAI API Key
                    </Label>
                    <Input
                      type="password"
                      placeholder="Enter OpenAI API key"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className={`text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                      Supabase URL
                    </Label>
                    <Input
                      placeholder="Enter Supabase URL"
                      className="mt-1"
                    />
                  </div>
                  <Button className="w-full">
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ArshAdmin;
