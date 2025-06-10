
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SurgicalSchedulingInterface } from './SurgicalSchedulingInterface';
import { PreOperativeAssessment } from './PreOperativeAssessment';
import { IntraoperativeDocumentation } from './IntraoperativeDocumentation';
import { PostOperativeCare } from './PostOperativeCare';
import { SurgicalInstrumentTracking } from './SurgicalInstrumentTracking';
import { SurgicalOutcomeAnalysis } from './SurgicalOutcomeAnalysis';
import { 
  Calendar, 
  CheckSquare, 
  FileText, 
  Heart, 
  Package, 
  BarChart3,
  Stethoscope,
  Clock,
  Users,
  Activity
} from 'lucide-react';

export const SurgicalServicesDashboard = () => {
  const [activeTab, setActiveTab] = useState('scheduling');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Stethoscope className="h-8 w-8 text-blue-600" />
          Surgical Services Module
          <Activity className="h-8 w-8 text-purple-600" />
        </h1>
        <p className="text-gray-600">
          Comprehensive surgical workflow management with scheduling, documentation, and outcome tracking
        </p>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-center">
            <div className="p-4 bg-white/50 rounded-lg">
              <Calendar className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">Scheduling</h3>
              <p className="text-sm text-gray-600">OR optimization</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <CheckSquare className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">Pre-Op</h3>
              <p className="text-sm text-gray-600">Assessment workflow</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <FileText className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <h3 className="font-bold text-orange-800">Intra-Op</h3>
              <p className="text-sm text-gray-600">Documentation</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Heart className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">Post-Op</h3>
              <p className="text-sm text-gray-600">Recovery care</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Package className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-bold text-purple-800">Instruments</h3>
              <p className="text-sm text-gray-600">RFID tracking</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <BarChart3 className="h-8 w-8 mx-auto text-cyan-600 mb-2" />
              <h3 className="font-bold text-cyan-800">Analytics</h3>
              <p className="text-sm text-gray-600">Outcome analysis</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Today's Surgeries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">12</div>
            <p className="text-sm text-gray-600">5 in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              OR Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">87%</div>
            <p className="text-sm text-gray-600">Above target</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-orange-600" />
              Pre-Op Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">8/12</div>
            <p className="text-sm text-gray-600">4 pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-600" />
              Instrument Sets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">24</div>
            <p className="text-sm text-gray-600">Ready for use</p>
          </CardContent>
        </Card>
      </div>

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
          <TabsTrigger value="intraop" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Intra-Op</span>
          </TabsTrigger>
          <TabsTrigger value="postop" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Post-Op</span>
          </TabsTrigger>
          <TabsTrigger value="instruments" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Instruments</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduling" className="space-y-6">
          <SurgicalSchedulingInterface />
        </TabsContent>

        <TabsContent value="preop" className="space-y-6">
          <PreOperativeAssessment />
        </TabsContent>

        <TabsContent value="intraop" className="space-y-6">
          <IntraoperativeDocumentation />
        </TabsContent>

        <TabsContent value="postop" className="space-y-6">
          <PostOperativeCare />
        </TabsContent>

        <TabsContent value="instruments" className="space-y-6">
          <SurgicalInstrumentTracking />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <SurgicalOutcomeAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
};
