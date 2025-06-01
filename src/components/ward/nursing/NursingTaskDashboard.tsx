
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NurseTaskboard } from './NurseTaskboard';
import { EscalationAlerts } from './EscalationAlerts';
import { ShiftHandoffLog } from './ShiftHandoffLog';
import { MedicationTracker } from './MedicationTracker';
import { TimeBasedTaskTracker } from './TimeBasedTaskTracker';
import { StaffLoadMonitor } from './StaffLoadMonitor';
import { ClipboardList, AlertTriangle, Clock, Pill, Timer, Users } from 'lucide-react';

export const NursingTaskDashboard = () => {
  const [activeTab, setActiveTab] = useState('taskboard');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <ClipboardList className="h-8 w-8 text-purple-600" />
          Nursing Task Management
          <Users className="h-8 w-8 text-pink-600" />
        </h1>
        <p className="text-gray-600">
          Comprehensive task tracking, shift management, and workload monitoring for nursing staff
        </p>
      </div>

      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-center">
            <div className="p-4 bg-white/50 rounded-lg">
              <ClipboardList className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-bold text-purple-800">Taskboard</h3>
              <p className="text-sm text-gray-600">Shift priorities</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <AlertTriangle className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">Escalations</h3>
              <p className="text-sm text-gray-600">Task delays</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Clock className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">Handoff</h3>
              <p className="text-sm text-gray-600">Shift changes</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Pill className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">Medications</h3>
              <p className="text-sm text-gray-600">Tracking & alerts</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Timer className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <h3 className="font-bold text-orange-800">Time Tasks</h3>
              <p className="text-sm text-gray-600">Deadlines</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Users className="h-8 w-8 mx-auto text-cyan-600 mb-2" />
              <h3 className="font-bold text-cyan-800">Staff Load</h3>
              <p className="text-sm text-gray-600">Workload monitor</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="taskboard" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">Taskboard</span>
          </TabsTrigger>
          <TabsTrigger value="escalations" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Escalations</span>
          </TabsTrigger>
          <TabsTrigger value="handoff" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Handoff</span>
          </TabsTrigger>
          <TabsTrigger value="medications" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            <span className="hidden sm:inline">Medications</span>
          </TabsTrigger>
          <TabsTrigger value="timetasks" className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            <span className="hidden sm:inline">Time Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="staffload" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Staff Load</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="taskboard" className="space-y-6">
          <NurseTaskboard />
        </TabsContent>

        <TabsContent value="escalations" className="space-y-6">
          <EscalationAlerts />
        </TabsContent>

        <TabsContent value="handoff" className="space-y-6">
          <ShiftHandoffLog />
        </TabsContent>

        <TabsContent value="medications" className="space-y-6">
          <MedicationTracker />
        </TabsContent>

        <TabsContent value="timetasks" className="space-y-6">
          <TimeBasedTaskTracker />
        </TabsContent>

        <TabsContent value="staffload" className="space-y-6">
          <StaffLoadMonitor />
        </TabsContent>
      </Tabs>
    </div>
  );
};
