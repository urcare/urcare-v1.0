
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmergencySOSButton } from './EmergencySOSButton';
import { EmergencyProfileCard } from './EmergencyProfileCard';
import { PanicModeSystem } from './PanicModeSystem';
import { FirstAidGuide } from './FirstAidGuide';
import { EmergencyTriggerSettings } from '../health-twin/EmergencyTriggerSettings';
import { Shield, Heart, AlertTriangle, BookOpen, Settings, Phone } from 'lucide-react';

export const EmergencyDashboard = () => {
  const [activeTab, setActiveTab] = useState('sos');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
          Emergency System Dashboard
        </h1>
        <p className="text-gray-600">
          Comprehensive emergency response system with SOS, medical profiles, and first aid guidance
        </p>
      </div>

      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-white/50 rounded-lg">
              <Shield className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">SOS System</h3>
              <p className="text-sm text-gray-600">GPS location sharing & emergency contacts</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Heart className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">Medical Profile</h3>
              <p className="text-sm text-gray-600">Critical health information for responders</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <BookOpen className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">First Aid Guide</h3>
              <p className="text-sm text-gray-600">Offline emergency medical procedures</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="sos" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">SOS</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="panic" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Panic Mode</span>
          </TabsTrigger>
          <TabsTrigger value="first-aid" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">First Aid</span>
          </TabsTrigger>
          <TabsTrigger value="triggers" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Triggers</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sos" className="space-y-6">
          <EmergencySOSButton />
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <EmergencyProfileCard />
        </TabsContent>

        <TabsContent value="panic" className="space-y-6">
          <PanicModeSystem />
        </TabsContent>

        <TabsContent value="first-aid" className="space-y-6">
          <FirstAidGuide />
        </TabsContent>

        <TabsContent value="triggers" className="space-y-6">
          <EmergencyTriggerSettings 
            triggers={[]}
            onAddTrigger={() => {}}
            onUpdateTrigger={() => {}}
            onDeleteTrigger={() => {}}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
