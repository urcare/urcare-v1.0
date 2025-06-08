
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessagingInterface } from './MessagingInterface';
import { PatientPortalMessaging } from './PatientPortalMessaging';
import { NotificationManagement } from './NotificationManagement';
import { EmailSMSIntegration } from './EmailSMSIntegration';
import { VoIPIntegration } from './VoIPIntegration';
import { TelemedicineInterface } from './TelemedicineInterface';
import { 
  MessageCircle, 
  Users, 
  Bell, 
  Mail, 
  Phone, 
  Video,
  Activity,
  Shield,
  Clock
} from 'lucide-react';

export const CommunicationSystemsDashboard = () => {
  const [activeTab, setActiveTab] = useState('messaging');

  const communicationStats = [
    {
      title: 'Active Messages',
      value: '1,247',
      change: '+12%',
      icon: MessageCircle,
      color: 'text-blue-600'
    },
    {
      title: 'Patient Conversations',
      value: '892',
      change: '+8%',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Pending Notifications',
      value: '156',
      change: '-5%',
      icon: Bell,
      color: 'text-orange-600'
    },
    {
      title: 'Active Calls',
      value: '23',
      change: '+15%',
      icon: Phone,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Communication Systems</h1>
          <p className="text-gray-600">Comprehensive communication platform for healthcare</p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium text-green-700">HIPAA Compliant</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {communicationStats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm ${
                      stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change} from last week
                    </p>
                  </div>
                  <IconComponent className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Communication Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Communication Platform
          </CardTitle>
          <CardDescription>
            Manage all communication channels from a unified interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="messaging" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Messaging</span>
              </TabsTrigger>
              <TabsTrigger value="patient-portal" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Patient Portal</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="email-sms" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Email/SMS</span>
              </TabsTrigger>
              <TabsTrigger value="voip" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">VoIP</span>
              </TabsTrigger>
              <TabsTrigger value="telemedicine" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                <span className="hidden sm:inline">Telemedicine</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="messaging">
              <MessagingInterface />
            </TabsContent>

            <TabsContent value="patient-portal">
              <PatientPortalMessaging />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationManagement />
            </TabsContent>

            <TabsContent value="email-sms">
              <EmailSMSIntegration />
            </TabsContent>

            <TabsContent value="voip">
              <VoIPIntegration />
            </TabsContent>

            <TabsContent value="telemedicine">
              <TelemedicineInterface />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
