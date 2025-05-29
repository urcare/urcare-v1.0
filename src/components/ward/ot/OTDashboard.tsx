
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OTSchedulingGrid } from './OTSchedulingGrid';
import { PreOpChecklistTracker } from './PreOpChecklistTracker';
import { SurgeryCountdownTimer } from './SurgeryCountdownTimer';
import { OTRoleAssignment } from './OTRoleAssignment';
import { BatchImplantTracker } from './BatchImplantTracker';
import { OTVideoRecordingLog } from './OTVideoRecordingLog';
import { OTSafetyQualityDashboard } from './safety/OTSafetyQualityDashboard';
import { Calendar, CheckSquare, Timer, Users, Package, Video, Stethoscope, Activity, Shield } from 'lucide-react';

export const OTDashboard = () => {
  const [activeTab, setActiveTab] = useState('scheduling');
  const [showSafety, setShowSafety] = useState(false);

  if (showSafety) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setShowSafety(false)}
            className="mb-4"
          >
            ← Back to OT Management
          </Button>
          <Badge className="bg-red-500 text-white">
            <Shield className="h-3 w-3 mr-1" />
            Safety & Quality Active
          </Badge>
        </div>
        <OTSafetyQualityDashboard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Stethoscope className="h-8 w-8 text-green-600" />
          Operating Theater Management
          <Activity className="h-8 w-8 text-blue-600" />
        </h1>
        <p className="text-gray-600">
          Comprehensive OT management for scheduling, tracking, and documentation
        </p>
        <div className="flex justify-center">
          <Button 
            onClick={() => setShowSafety(true)}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
          >
            <Shield className="h-4 w-4 mr-2" />
            Safety & Quality Tools
          </Button>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-center">
            <div className="p-4 bg-white/50 rounded-lg">
              <Calendar className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">Scheduling</h3>
              <p className="text-sm text-gray-600">Grid & availability</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <CheckSquare className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">Pre-Op</h3>
              <p className="text-sm text-gray-600">Checklist tracker</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Timer className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <h3 className="font-bold text-orange-800">Countdown</h3>
              <p className="text-sm text-gray-600">Surgery timer</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Users className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-bold text-purple-800">Roles</h3>
              <p className="text-sm text-gray-600">Staff assignment</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Package className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">Inventory</h3>
              <p className="text-sm text-gray-600">Batch & implants</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Video className="h-8 w-8 mx-auto text-cyan-600 mb-2" />
              <h3 className="font-bold text-cyan-800">Recording</h3>
              <p className="text-sm text-gray-600">Video log</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="scheduling" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Schedule</span>
          </TabsTrigger>
          <TabsTrigger value="preop" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Pre-Op</span>
          </TabsTrigger>
          <TabsTrigger value="countdown" className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            <span className="hidden sm:inline">Timer</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Roles</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Inventory</span>
          </TabsTrigger>
          <TabsTrigger value="recording" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">Recording</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduling" className="space-y-6">
          <OTSchedulingGrid />
        </TabsContent>

        <TabsContent value="preop" className="space-y-6">
          <PreOpChecklistTracker />
        </TabsContent>

        <TabsContent value="countdown" className="space-y-6">
          <SurgeryCountdownTimer />
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <OTRoleAssignment />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <BatchImplantTracker />
        </TabsContent>

        <TabsContent value="recording" className="space-y-6">
          <OTVideoRecordingLog />
        </TabsContent>
      </Tabs>
    </div>
  );
};
