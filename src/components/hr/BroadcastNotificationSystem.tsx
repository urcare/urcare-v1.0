
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Send, 
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageSquare,
  Target,
  Megaphone,
  Filter
} from 'lucide-react';

export const BroadcastNotificationSystem = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [messageText, setMessageText] = useState('');

  const messageTemplates = [
    {
      id: 'emergency',
      name: 'Emergency Alert',
      category: 'critical',
      template: 'EMERGENCY: Immediate action required. All staff report to assigned stations.',
      icon: AlertTriangle,
      priority: 'critical'
    },
    {
      id: 'shift_change',
      name: 'Shift Change Notification',
      category: 'operational',
      template: 'Shift change reminder: Your shift starts in 30 minutes. Please ensure smooth handover.',
      icon: Clock,
      priority: 'normal'
    },
    {
      id: 'training',
      name: 'Training Reminder',
      category: 'training',
      template: 'Training session scheduled for {date} at {time}. Attendance is mandatory.',
      icon: Users,
      priority: 'normal'
    },
    {
      id: 'maintenance',
      name: 'Maintenance Alert',
      category: 'operational',
      template: 'Scheduled maintenance in {location} from {start_time} to {end_time}. Please plan accordingly.',
      icon: Bell,
      priority: 'low'
    },
    {
      id: 'policy',
      name: 'Policy Update',
      category: 'administrative',
      template: 'New policy update effective {date}. Please review the updated guidelines in your portal.',
      icon: MessageSquare,
      priority: 'normal'
    }
  ];

  const recipientGroups = [
    { id: 'all_staff', name: 'All Staff', count: 105, icon: Users },
    { id: 'doctors', name: 'Doctors Only', count: 45, icon: Users },
    { id: 'nurses', name: 'Nursing Staff', count: 60, icon: Users },
    { id: 'icu', name: 'ICU Department', count: 24, icon: Target },
    { id: 'emergency', name: 'Emergency Department', count: 18, icon: Target },
    { id: 'surgery', name: 'Surgery Department', count: 15, icon: Target },
    { id: 'management', name: 'Management Team', count: 8, icon: Users }
  ];

  const recentNotifications = [
    {
      id: '1',
      subject: 'Emergency Drill Scheduled',
      template: 'emergency',
      sentTo: ['all_staff'],
      sentAt: '2024-06-04 14:30',
      deliveryStatus: {
        sent: 105,
        delivered: 102,
        read: 95,
        failed: 3
      },
      priority: 'critical',
      status: 'completed'
    },
    {
      id: '2',
      subject: 'New COVID-19 Protocols',
      template: 'policy',
      sentTo: ['doctors', 'nurses'],
      sentAt: '2024-06-04 12:15',
      deliveryStatus: {
        sent: 105,
        delivered: 100,
        read: 88,
        failed: 5
      },
      priority: 'normal',
      status: 'completed'
    },
    {
      id: '3',
      subject: 'Equipment Maintenance Notice',
      template: 'maintenance',
      sentTo: ['icu', 'surgery'],
      sentAt: '2024-06-04 09:00',
      deliveryStatus: {
        sent: 39,
        delivered: 39,
        read: 35,
        failed: 0
      },
      priority: 'low',
      status: 'completed'
    }
  ];

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      critical: { label: 'Critical', className: 'bg-red-100 text-red-800' },
      normal: { label: 'Normal', className: 'bg-blue-100 text-blue-800' },
      low: { label: 'Low', className: 'bg-green-100 text-green-800' }
    };
    const config = priorityConfig[priority];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getDeliveryRate = (status) => {
    return Math.round((status.delivered / status.sent) * 100);
  };

  const getReadRate = (status) => {
    return Math.round((status.read / status.sent) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Broadcast Notification System</h3>
          <p className="text-gray-600">Send targeted messages to staff with delivery tracking</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Message History
          </Button>
          <Button>
            <Megaphone className="w-4 h-4 mr-2" />
            Emergency Broadcast
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Send className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">45</div>
                <div className="text-sm text-gray-600">Messages Sent Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">97%</div>
                <div className="text-sm text-gray-600">Delivery Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">84%</div>
                <div className="text-sm text-gray-600">Read Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">3</div>
                <div className="text-sm text-gray-600">Emergency Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Message Composer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Compose Broadcast Message
          </CardTitle>
          <CardDescription>Create and send targeted messages to staff groups</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Message Templates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Template
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {messageTemplates.map((template) => {
                const IconComponent = template.icon;
                return (
                  <button
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setMessageText(template.template);
                    }}
                    className={`p-3 border rounded-lg text-left hover:bg-gray-50 transition-colors ${
                      selectedTemplate === template.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <IconComponent className="w-4 h-4" />
                      <span className="text-sm font-medium">{template.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 capitalize">{template.category}</span>
                      {getPriorityBadge(template.priority)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recipients Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Recipients
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {recipientGroups.map((group) => {
                const IconComponent = group.icon;
                const isSelected = selectedRecipients.includes(group.id);
                return (
                  <button
                    key={group.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedRecipients(selectedRecipients.filter(id => id !== group.id));
                      } else {
                        setSelectedRecipients([...selectedRecipients, group.id]);
                      }
                    }}
                    className={`p-3 border rounded-lg text-left hover:bg-gray-50 transition-colors ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <IconComponent className="w-4 h-4" />
                      <span className="text-sm font-medium">{group.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{group.count} members</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Content
            </label>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Enter your message here..."
              className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none"
            />
          </div>

          {/* Priority and Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-lg">
                <option value="low">Low Priority</option>
                <option value="normal">Normal Priority</option>
                <option value="critical">Critical Priority</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Options
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm">Push Notification</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm">Email Notification</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">SMS Notification</span>
                </label>
              </div>
            </div>
          </div>

          {/* Send Button */}
          <div className="flex gap-3">
            <Button 
              className="flex-1" 
              disabled={!selectedRecipients.length || !messageText.trim()}
            >
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
            <Button variant="outline">
              Schedule
            </Button>
            <Button variant="outline">
              Save Draft
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>Delivery status and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentNotifications.map((notification) => (
              <div key={notification.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{notification.subject}</h4>
                    <p className="text-sm text-gray-600">
                      Sent to {notification.sentTo.join(', ')} • {notification.sentAt}
                    </p>
                  </div>
                  {getPriorityBadge(notification.priority)}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="text-lg font-bold text-blue-700">{notification.deliveryStatus.sent}</div>
                    <div className="text-xs text-blue-600">Sent</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="text-lg font-bold text-green-700">
                      {getDeliveryRate(notification.deliveryStatus)}%
                    </div>
                    <div className="text-xs text-green-600">Delivered</div>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded">
                    <div className="text-lg font-bold text-yellow-700">
                      {getReadRate(notification.deliveryStatus)}%
                    </div>
                    <div className="text-xs text-yellow-600">Read</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded">
                    <div className="text-lg font-bold text-red-700">{notification.deliveryStatus.failed}</div>
                    <div className="text-xs text-red-600">Failed</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {notification.status}
                  </Badge>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      Resend Failed
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
