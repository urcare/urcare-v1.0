import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  CreditCard, 
  MessageCircle, 
  BarChart3, 
  Server,
  RefreshCw,
  LogOut,
  Settings,
  Bell,
  Search
} from 'lucide-react';
import UserManagement from '@/components/admin/UserManagement';
import PaymentChart from '@/components/admin/PaymentChart';
import LiveChat from '@/components/admin/LiveChat';
import Analytics from '@/components/admin/Analytics';
import ServerStatus from '@/components/admin/ServerStatus';
import { toast } from 'sonner';

type TabType = 'users' | 'payments' | 'chat' | 'analytics' | 'servers';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(3); // Mock unread count

  const tabs = [
    { id: 'users', label: 'User Control', icon: Users },
    { id: 'payments', label: 'Payment Chart', icon: CreditCard },
    { id: 'chat', label: 'Live Chat', icon: MessageCircle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'servers', label: 'Server Status', icon: Server }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate refresh delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    // Handle logout logic
    toast.success('Logged out successfully');
    // Redirect to login page
    window.location.href = '/admin-login';
  };

  const handleChatMessageRead = () => {
    // Update unread count when messages are read
    setUnreadChatCount(prev => Math.max(0, prev - 1));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement onRefresh={handleRefresh} />;
      case 'payments':
        return <PaymentChart onRefresh={handleRefresh} />;
      case 'chat':
        return <LiveChat onRefresh={handleRefresh} onMessageRead={handleChatMessageRead} />;
      case 'analytics':
        return <Analytics onRefresh={handleRefresh} />;
      case 'servers':
        return <ServerStatus onRefresh={handleRefresh} />;
      default:
        return <UserManagement onRefresh={handleRefresh} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">ArshAdmin Dashboard</h1>
              <p className="text-sm text-gray-600">Complete admin control panel</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={isRefreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const showBadge = tab.id === 'chat' && unreadChatCount > 0;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'bg-gray-100 text-gray-900 border-b-2 border-blue-500'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadChatCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
