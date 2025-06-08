
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
  Users, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Settings,
  FileText
} from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'email' | 'sms';
  category: string;
}

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms';
  recipients: number;
  status: 'draft' | 'sending' | 'completed' | 'failed';
  deliveryRate: number;
  openRate?: number;
  clickRate?: number;
  scheduledTime?: string;
}

export const EmailSMSIntegration = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('template-1');

  const emailTemplates: EmailTemplate[] = [
    {
      id: 'template-1',
      name: 'Appointment Reminder',
      subject: 'Upcoming Appointment Reminder',
      content: 'Dear {{patient_name}}, this is a reminder for your appointment on {{appointment_date}} at {{appointment_time}}.',
      type: 'email',
      category: 'Appointment'
    },
    {
      id: 'template-2',
      name: 'Lab Results Ready',
      subject: 'Your Lab Results Are Ready',
      content: 'Hello {{patient_name}}, your lab results are now available in your patient portal.',
      type: 'email',
      category: 'Lab Results'
    },
    {
      id: 'template-3',
      name: 'Prescription Ready',
      subject: '',
      content: 'Hi {{patient_name}}, your prescription is ready for pickup at our pharmacy.',
      type: 'sms',
      category: 'Pharmacy'
    }
  ];

  const campaigns: Campaign[] = [
    {
      id: 'camp-1',
      name: 'Monthly Health Newsletter',
      type: 'email',
      recipients: 2543,
      status: 'completed',
      deliveryRate: 98.5,
      openRate: 42.3,
      clickRate: 12.7,
      scheduledTime: '2024-01-15 09:00'
    },
    {
      id: 'camp-2',
      name: 'Appointment Reminders',
      type: 'sms',
      recipients: 156,
      status: 'sending',
      deliveryRate: 95.2,
      scheduledTime: '2024-01-20 08:00'
    },
    {
      id: 'camp-3',
      name: 'Flu Vaccination Drive',
      type: 'email',
      recipients: 892,
      status: 'draft',
      deliveryRate: 0,
      openRate: 0,
      clickRate: 0
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'sending': return Clock;
      case 'failed': return AlertCircle;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email & SMS Integration</h2>
          <p className="text-gray-600">Manage communication templates and campaigns</p>
        </div>
        <Button className="flex items-center gap-2">
          <Send className="h-4 w-4" />
          New Campaign
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="delivery">Delivery Tracking</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Template List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Message Templates</CardTitle>
                <CardDescription>Pre-configured message templates</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {emailTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 border-b ${
                        selectedTemplate === template.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {template.type === 'email' ? 
                          <Mail className="h-4 w-4 text-blue-600" /> : 
                          <MessageSquare className="h-4 w-4 text-green-600" />
                        }
                        <span className="font-medium text-sm">{template.name}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{template.category}</p>
                      <Badge variant="outline" className="text-xs">
                        {template.type.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Template Editor */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Template Editor</CardTitle>
                <CardDescription>Edit and customize message templates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Template Name</label>
                  <Input defaultValue="Appointment Reminder" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Subject (Email Only)</label>
                  <Input defaultValue="Upcoming Appointment Reminder" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message Content</label>
                  <textarea
                    className="w-full p-3 border rounded-lg resize-none h-32"
                    defaultValue="Dear {{patient_name}}, this is a reminder for your appointment on {{appointment_date}} at {{appointment_time}}."
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <select className="border rounded px-3 py-2">
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select className="border rounded px-3 py-2">
                      <option value="appointment">Appointment</option>
                      <option value="lab">Lab Results</option>
                      <option value="pharmacy">Pharmacy</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Preview</Button>
                  <Button>Save Template</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Message Campaigns</CardTitle>
              <CardDescription>Manage bulk messaging campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => {
                  const StatusIcon = getStatusIcon(campaign.status);
                  return (
                    <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {campaign.type === 'email' ? 
                            <Mail className="h-5 w-5 text-blue-600" /> : 
                            <MessageSquare className="h-5 w-5 text-green-600" />
                          }
                          <div>
                            <h4 className="font-medium">{campaign.name}</h4>
                            <p className="text-sm text-gray-600">{campaign.recipients} recipients</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-4 w-4" />
                            <Badge className={getStatusColor(campaign.status)}>
                              {campaign.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Delivery: {campaign.deliveryRate}%
                            {campaign.openRate && ` • Open: ${campaign.openRate}%`}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Messages Sent Today</p>
                    <p className="text-2xl font-bold">1,247</p>
                    <p className="text-sm text-green-600">+12% from yesterday</p>
                  </div>
                  <Send className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Delivery Rate</p>
                    <p className="text-2xl font-bold">97.8%</p>
                    <p className="text-sm text-green-600">+0.5% from last week</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Failed Deliveries</p>
                    <p className="text-2xl font-bold">28</p>
                    <p className="text-sm text-red-600">+3 from yesterday</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">SMTP Server</label>
                  <Input defaultValue="smtp.hospital.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Port</label>
                  <Input defaultValue="587" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">From Email</label>
                  <Input defaultValue="noreply@hospital.com" />
                </div>
                <Button>Save Email Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  SMS Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">SMS Provider</label>
                  <select className="w-full border rounded px-3 py-2">
                    <option>Twilio</option>
                    <option>AWS SNS</option>
                    <option>TextMagic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">API Key</label>
                  <Input type="password" defaultValue="••••••••••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">From Number</label>
                  <Input defaultValue="+1234567890" />
                </div>
                <Button>Save SMS Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
