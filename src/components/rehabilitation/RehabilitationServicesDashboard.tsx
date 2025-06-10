
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TherapySchedulingInterface } from './TherapySchedulingInterface';
import { ProgressMonitoringInterface } from './ProgressMonitoringInterface';
import { ExercisePrescriptionInterface } from './ExercisePrescriptionInterface';
import { OutcomeMeasurementInterface } from './OutcomeMeasurementInterface';
import { EquipmentManagementInterface } from './EquipmentManagementInterface';
import { PatientEngagementPlatform } from './PatientEngagementPlatform';
import { 
  Calendar, 
  TrendingUp, 
  Dumbbell, 
  Target, 
  Settings, 
  Users,
  Activity,
  Heart,
  Clock,
  CheckCircle
} from 'lucide-react';

export const RehabilitationServicesDashboard = () => {
  const [activeTab, setActiveTab] = useState('scheduling');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Activity className="h-8 w-8 text-green-600" />
          Rehabilitation Services Module
          <Heart className="h-8 w-8 text-blue-600" />
        </h1>
        <p className="text-gray-600">
          Comprehensive therapy management with scheduling, progress tracking, and patient engagement
        </p>
      </div>

      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-center">
            <div className="p-4 bg-white/50 rounded-lg">
              <Calendar className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">Scheduling</h3>
              <p className="text-sm text-gray-600">Therapy coordination</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">Progress</h3>
              <p className="text-sm text-gray-600">Outcome tracking</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Dumbbell className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-bold text-purple-800">Exercise</h3>
              <p className="text-sm text-gray-600">Program design</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Target className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <h3 className="font-bold text-orange-800">Outcomes</h3>
              <p className="text-sm text-gray-600">Assessment tools</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Settings className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">Equipment</h3>
              <p className="text-sm text-gray-600">Resource management</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Users className="h-8 w-8 mx-auto text-cyan-600 mb-2" />
              <h3 className="font-bold text-cyan-800">Engagement</h3>
              <p className="text-sm text-gray-600">Patient platform</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              Today's Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">28</div>
            <p className="text-sm text-gray-600">5 departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Active Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">156</div>
            <p className="text-sm text-gray-600">In treatment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              Goal Achievement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">78%</div>
            <p className="text-sm text-gray-600">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5 text-orange-600" />
              Equipment Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">85%</div>
            <p className="text-sm text-gray-600">Utilization rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="scheduling" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Schedule</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Progress</span>
          </TabsTrigger>
          <TabsTrigger value="exercise" className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4" />
            <span className="hidden sm:inline">Exercise</span>
          </TabsTrigger>
          <TabsTrigger value="outcomes" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Outcomes</span>
          </TabsTrigger>
          <TabsTrigger value="equipment" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Equipment</span>
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Engagement</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduling" className="space-y-6">
          <TherapySchedulingInterface />
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <ProgressMonitoringInterface />
        </TabsContent>

        <TabsContent value="exercise" className="space-y-6">
          <ExercisePrescriptionInterface />
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-6">
          <OutcomeMeasurementInterface />
        </TabsContent>

        <TabsContent value="equipment" className="space-y-6">
          <EquipmentManagementInterface />
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <PatientEngagementPlatform />
        </TabsContent>
      </Tabs>
    </div>
  );
};
