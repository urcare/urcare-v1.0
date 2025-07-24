
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Check, 
  X, 
  Clock, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  Calendar,
  MessageSquare,
  Settings,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'appointment' | 'message';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  created_at: string;
  action_url?: string;
  metadata?: Record<string, any>;
}

export const NotificationCenter = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate real-time notifications with mock data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Appointment Reminder',
        message: 'You have an appointment with Dr. Smith tomorrow at 2:00 PM',
        type: 'appointment',
        priority: 'high',
        read: false,
        created_at: new Date().toISOString(),
        action_url: '/appointments',
        metadata: { appointment_id: 'apt_123', doctor: 'Dr. Smith' }
      },
      {
        id: '2',
        title: 'Lab Results Available',
        message: 'Your blood test results are now available for review',
        type: 'info',
        priority: 'medium',
        read: false,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        action_url: '/documents',
        metadata: { test_type: 'blood_test' }
      },
      {
        id: '3',
        title: 'Medication Reminder',
        message: 'Time to take your morning medication (Lisinopril)',
        type: 'warning',
        priority: 'high',
        read: true,
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        metadata: { medication: 'Lisinopril', dosage: '10mg' }
      },
      {
        id: '4',
        title: 'Welcome Message',
        message: 'Welcome to your healthcare portal! Complete your profile to get started.',
        type: 'success',
        priority: 'low',
        read: true,
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        action_url: '/profile'
      },
      {
        id: '5',
        title: 'System Maintenance',
        message: 'Scheduled maintenance tonight from 11 PM to 1 AM. Services may be limited.',
        type: 'warning',
        priority: 'medium',
        read: false,
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
    setIsLoading(false);

    // Simulate real-time updates
    const interval = setInterval(() => {
      const randomTypes = ['info', 'appointment', 'warning', 'success'] as const;
      const randomType = randomTypes[Math.floor(Math.random() * randomTypes.length)];
      
      const newNotification: Notification = {
        id: `notif_${Date.now()}`,
        title: 'New Notification',
        message: `You have a new ${randomType} notification`,
        type: randomType,
        priority: 'medium',
        read: false,
        created_at: new Date().toISOString()
      };

      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      toast.info('New notification received');
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    toast.success('Notification deleted');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar className="h-4 w-4" />;
      case 'message': return <MessageSquare className="h-4 w-4" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'error': return <X className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'appointment': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'message': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filterNotifications = (filter: string) => {
    switch (filter) {
      case 'unread': return notifications.filter(n => !n.read);
      case 'appointments': return notifications.filter(n => n.type === 'appointment');
      case 'messages': return notifications.filter(n => n.type === 'message');
      default: return notifications;
    }
  };

  const filteredNotifications = filterNotifications(activeTab);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-1" />
              Mark All Read
            </Button>
            <Button size="sm" variant="outline">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
          </div>
        </div>
        <CardDescription>
          Stay updated with your healthcare notifications and reminders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <ScrollArea className="h-[500px] w-full">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <Card key={notification.id} className={`transition-all hover:shadow-md ${
                      !notification.read ? 'bg-blue-50/50 border-blue-200' : ''
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                              {getIcon(notification.type)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className={`font-medium truncate ${
                                  !notification.read ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {notification.title}
                                </h4>
                                <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`} />
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                )}
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-2">
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center gap-4 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(notification.created_at).toLocaleString()}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {notification.priority}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-1">
                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markAsRead(notification.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {notification.action_url && (
                          <div className="mt-3 pt-3 border-t">
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
