
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  FileText, 
  Users, 
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms';
  subject?: string;
  content: string;
  category: string;
  lastUsed: string;
  usageCount: number;
}

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'both';
  recipients: number;
  sent: number;
  delivered: number;
  opened?: number;
  clicked?: number;
  status: 'draft' | 'sending' | 'completed' | 'failed';
  scheduledTime?: string;
}

export const EmailSMSIntegration = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [recipientList, setRecipientList] = useState<string>('');

  const templates: Template[] = [
    {
      id: 'temp-1',
      name: 'Appointment Confirmation',
      type: 'email',
      subject: 'Appointment Confirmation - {date}',
      content: 'Dear {patient_name}, your appointment is confirmed for {date} at {time}.',
      category: 'Appointments',
      lastUsed: '2 days ago',
      usageCount: 45
    },
    {
      id: 'temp-2',
      name: 'Lab Results Ready',
      type: 'sms',
      content: 'Your lab results are ready for review. Please log into your patient portal.',
      category: 'Lab Results',
      lastUsed: '1 hour ago',
      usageCount: 28
    },
    {
      id: 'temp-3',
      name: 'Medication Reminder',
      type: 'both',
      subject: 'Medication Refill Reminder',
      content: 'It\'s time to refill your prescription for {medication}. Contact us to arrange pickup.',
      category: 'Medications',
      lastUsed: '3 days ago',
      usageCount: 67
    }
  ];

  const campaigns: Campaign[] = [
    {
      id: 'camp-1',
      name: 'Annual Flu Shot Reminder',
      type: 'email',
      recipients: 1500,
      sent: 1500,
      delivered: 1485,
      opened: 892,
      clicked: 234,
      status: 'completed'
    },
    {
      id: 'camp-2',
      name: 'Lab Results Notification',
      type: 'sms',
      recipients: 45,
      sent: 45,
      delivered: 44,
      status: 'completed'
    },
    {
      id: 'camp-3',
      name: 'Appointment Reminders',
      type: 'both',
      recipients: 120,
      sent: 85,
      delivered: 82,
      opened: 52,
      status: 'sending',
      scheduledTime: 'Today 2:00 PM'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'sending': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'sms': return MessageSquare;
      case 'both': return Send;
      default: return Send;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Mail className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">2,847</p>
                <p className="text-sm text-gray-600">Emails Sent Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">1,156</p>
                <p className="text-sm text-gray-600">SMS Sent Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">97.8%</p>
                <p className="text-sm text-gray-600">Delivery Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Eye className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">68.5%</p>
                <p className="text-sm text-gray-600">Open Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="compose" className="space-y-6">
        <TabsList>
          <TabsTrigger value="compose">Compose Message</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="compose">
          <Card>
            <CardHeader>
              <CardTitle>Compose New Message</CardTitle>
              <CardDescription>Send emails or SMS to patients and staff</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message Type</label>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      SMS
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Both
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Template</label>
                  <select 
                    className="w-full p-2 border rounded-lg"
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                  >
                    <option value="">Select a template</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Recipients</label>
                <textarea
                  value={recipientList}
                  onChange={(e) => setRecipientList(e.target.value)}
                  placeholder="Enter patient IDs, email addresses, or phone numbers (one per line)"
                  className="w-full p-3 border rounded-lg h-24 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Subject (Email)</label>
                <Input placeholder="Enter email subject line" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message Content</label>
                <textarea
                  placeholder="Enter your message content..."
                  className="w-full p-3 border rounded-lg h-32 resize-none"
                />
                <p className="text-xs text-gray-500">
                  Use variables like {"{patient_name}"}, {"{appointment_date}"}, {"{doctor_name}"}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    Schedule for later
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    Save as template
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Preview</Button>
                  <Button className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Send Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Message Templates
                  </CardTitle>
                  <CardDescription>Manage reusable message templates</CardDescription>
                </div>
                <Button>Create Template</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => {
                  const TypeIcon = getTypeIcon(template.type);
                  return (
                    <div key={template.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <TypeIcon className="h-5 w-5 text-gray-500" />
                          <div>
                            <h4 className="font-medium">{template.name}</h4>
                            <p className="text-sm text-gray-600">{template.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{template.type}</Badge>
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button size="sm">Use Template</Button>
                        </div>
                      </div>
                      {template.subject && (
                        <div className="mb-2">
                          <span className="text-sm font-medium">Subject: </span>
                          <span className="text-sm text-gray-600">{template.subject}</span>
                        </div>
                      )}
                      <div className="mb-3">
                        <p className="text-sm bg-gray-50 p-2 rounded">{template.content}</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Last used: {template.lastUsed}</span>
                        <span>Used {template.usageCount} times</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Bulk Messaging Campaigns
              </CardTitle>
              <CardDescription>Track bulk message delivery and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => {
                  const TypeIcon = getTypeIcon(campaign.type);
                  const deliveryRate = ((campaign.delivered / campaign.sent) * 100).toFixed(1);
                  
                  return (
                    <div key={campaign.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <TypeIcon className="h-5 w-5 text-gray-500" />
                          <div>
                            <h4 className="font-medium">{campaign.name}</h4>
                            {campaign.scheduledTime && (
                              <p className="text-sm text-gray-600">Scheduled: {campaign.scheduledTime}</p>
                            )}
                          </div>
                        </div>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Recipients</p>
                          <p className="font-medium">{campaign.recipients}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Sent</p>
                          <p className="font-medium">{campaign.sent}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Delivered</p>
                          <p className="font-medium">{campaign.delivered} ({deliveryRate}%)</p>
                        </div>
                        {campaign.opened && (
                          <div>
                            <p className="text-gray-600">Opened</p>
                            <p className="font-medium">{campaign.opened} ({((campaign.opened / campaign.delivered) * 100).toFixed(1)}%)</p>
                          </div>
                        )}
                        {campaign.clicked && (
                          <div>
                            <p className="text-gray-600">Clicked</p>
                            <p className="font-medium">{campaign.clicked} ({((campaign.clicked / campaign.opened!) * 100).toFixed(1)}%)</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Analytics</CardTitle>
              <CardDescription>Track message performance and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Email Performance</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm">Delivery Rate</span>
                      <span className="font-medium">98.2%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm">Open Rate</span>
                      <span className="font-medium">68.5%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm">Click Rate</span>
                      <span className="font-medium">24.7%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm">Bounce Rate</span>
                      <span className="font-medium">1.8%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">SMS Performance</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm">Delivery Rate</span>
                      <span className="font-medium">97.5%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm">Response Rate</span>
                      <span className="font-medium">12.3%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm">Opt-out Rate</span>
                      <span className="font-medium">0.5%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm">Failed Rate</span>
                      <span className="font-medium">2.5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
