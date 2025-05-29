
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RealTimeTracker } from './RealTimeTracker';
import { IPDOPDTransition } from './IPDOPDTransition';
import { BedAllocationMap } from './BedAllocationMap';
import { DoctorVisitScheduler } from './DoctorVisitScheduler';
import { DailyRoundsLog } from './DailyRoundsLog';
import { SmartConsentChecklist } from './SmartConsentChecklist';
import { MapPin, Users, Bed, Calendar, ClipboardList, FileCheck, Activity } from 'lucide-react';

export const PatientJourneyDashboard = () => {
  const [activeTab, setActiveTab] = useState('tracker');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Patient Journey Management
        </h1>
        <p className="text-gray-600">
          Real-time tracking and management of patient care journey
        </p>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-center">
            <div className="p-4 bg-white/50 rounded-lg">
              <Activity className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">Real-Time</h3>
              <p className="text-sm text-gray-600">Live patient tracking</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Users className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">IPD/OPD</h3>
              <p className="text-sm text-gray-600">Smart transitions</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Bed className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-bold text-purple-800">Bed Map</h3>
              <p className="text-sm text-gray-600">Room allocation</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Calendar className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <h3 className="font-bold text-orange-800">Scheduler</h3>
              <p className="text-sm text-gray-600">Doctor visits</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <ClipboardList className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">Rounds</h3>
              <p className="text-sm text-gray-600">Daily logs</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <FileCheck className="h-8 w-8 mx-auto text-cyan-600 mb-2" />
              <h3 className="font-bold text-cyan-800">Consent</h3>
              <p className="text-sm text-gray-600">Digital signatures</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="tracker" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Tracker</span>
          </TabsTrigger>
          <TabsTrigger value="transition" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">IPD/OPD</span>
          </TabsTrigger>
          <TabsTrigger value="beds" className="flex items-center gap-2">
            <Bed className="h-4 w-4" />
            <span className="hidden sm:inline">Beds</span>
          </TabsTrigger>
          <TabsTrigger value="scheduler" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Schedule</span>
          </TabsTrigger>
          <TabsTrigger value="rounds" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">Rounds</span>
          </TabsTrigger>
          <TabsTrigger value="consent" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Consent</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracker" className="space-y-6">
          <RealTimeTracker />
        </TabsContent>

        <TabsContent value="transition" className="space-y-6">
          <IPDOPDTransition />
        </TabsContent>

        <TabsContent value="beds" className="space-y-6">
          <BedAllocationMap />
        </TabsContent>

        <TabsContent value="scheduler" className="space-y-6">
          <DoctorVisitScheduler />
        </TabsContent>

        <TabsContent value="rounds" className="space-y-6">
          <DailyRoundsLog />
        </TabsContent>

        <TabsContent value="consent" className="space-y-6">
          <SmartConsentChecklist />
        </TabsContent>
      </Tabs>
    </div>
  );
};
