
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Bell, 
  Send, 
  Users, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';

interface NotificationCategory {
  id: string;
  name: string;
  enabled: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  recipients: number;
  deliveryRate: number;
  engagementRate: number;
}

interface NotificationCampaign {
  id: string;
  title: string;
  category: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  recipients: number;
  delivered: number;
  opened: number;
  clicked: number;
  scheduledTime?: Date;
}

export const PushNotificationManager = () => {
  const [categories, setCategories] = useState<NotificationCategory[]>([
    {
      id: 'medical',
      name: 'Medical Alerts',
      enabled: true,
      priority: 'critical',
      recipients: 5432,
      deliveryRate: 98.5,
      engagementRate: 85.2
    },
    {
      id: 'appointments',
      name: 'Appointments',
      enabled: true,
      priority: 'high',
      recipients: 12847,
      deliveryRate: 97.8,
      engagementRate: 76.3
    },
    {
      id: 'medication',
      name: 'Medication Reminders',
      enabled: true,
      priority: 'medium',
      recipients: 8934,
      deliveryRate: 96.7,
      engagementRate: 82.1
    },
    {
      id: 'wellness',
      name: 'Wellness Tips',
      enabled: false,
      priority: 'low',
      recipients: 15672,
      deliveryRate: 94.2,
      engagementRate: 45.8
    }
  ]);

  const [campaigns] = useState<NotificationCampaign[]>([
    {
      id: '1',
      title: 'COVID-19 Booster Reminder',
      category: 'medical',
      status: 'sent',
      recipients: 5432,
      delivered: 5348,
      opened: 4556,
      clicked: 3234
    },
    {
      id: '2',
      title: 'Tomorrow\'s Appointment Reminder',
      category: 'appointments',
      status: 'scheduled',
      recipients: 847,
      delivered: 0,
      opened: 0,
      clicked: 0,
      scheduledTime: new Date(Date.now() + 3600000)
    }
  ]);

  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    category: 'medical',
    priority: 'medium',
    targetAudience: 'all'
  });

  const [isSending, setIsSending] = useState(false);

  const toggleCategory = (categoryId: string) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, enabled: !cat.enabled }
          : cat
      )
    );
  };

  const sendNotification = async () => {
    setIsSending(true);
    
    // Simulate sending notification
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSending(false);
    setNewNotification({
      title: '',
      message: '',
      category: 'medical',
      priority: 'medium',
      targetAudience: 'all'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Send New Notification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Notification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={newNotification.title}
                onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Notification title"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={newNotification.category}
                onChange={(e) => setNewNotification(prev => ({ ...prev, category: e.target.value }))}
              >
                {categories.filter(cat => cat.enabled).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={3}
              value={newNotification.message}
              onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Notification message"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={newNotification.priority}
                onChange={(e) => setNewNotification(prev => ({ ...prev, priority: e.target.value }))}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Audience</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={newNotification.targetAudience}
                onChange={(e) => setNewNotification(prev => ({ ...prev, targetAudience: e.target.value }))}
              >
                <option value="all">All Users</option>
                <option value="patients">Patients Only</option>
                <option value="doctors">Doctors Only</option>
                <option value="staff">Staff Only</option>
              </select>
            </div>
          </div>

          <Button 
            onClick={sendNotification}
            disabled={isSending || !newNotification.title || !newNotification.message}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            {isSending ? 'Sending...' : 'Send Notification'}
          </Button>
        </CardContent>
      </Card>

      {/* Notification Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Notification Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={category.enabled}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <div>
                      <span className="font-medium">{category.name}</span>
                      <Badge className={`ml-2 ${getPriorityColor(category.priority)}`}>
                        {category.priority}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {category.recipients.toLocaleString()} recipients
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Delivery Rate: </span>
                    <span className="font-medium">{category.deliveryRate}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Engagement: </span>
                    <span className="font-medium">{category.engagementRate}%</span>
                  </div>
                </div>
                
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Delivery Rate</span>
                    <span>{category.deliveryRate}%</span>
                  </div>
                  <Progress value={category.deliveryRate} className="h-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(campaign.status)}
                    <span className="font-medium">{campaign.title}</span>
                    <Badge variant="outline">{campaign.category}</Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {campaign.recipients.toLocaleString()} recipients
                  </div>
                </div>
                
                {campaign.status === 'sent' && (
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium text-blue-600">{campaign.delivered}</div>
                      <div className="text-gray-600">Delivered</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-green-600">{campaign.opened}</div>
                      <div className="text-gray-600">Opened</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-purple-600">{campaign.clicked}</div>
                      <div className="text-gray-600">Clicked</div>
                    </div>
                  </div>
                )}
                
                {campaign.status === 'scheduled' && campaign.scheduledTime && (
                  <div className="text-sm text-gray-600">
                    Scheduled for: {campaign.scheduledTime.toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
