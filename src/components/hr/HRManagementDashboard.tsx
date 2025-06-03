
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeoAttendanceSystem } from './GeoAttendanceSystem';
import { SmartShiftRoster } from './SmartShiftRoster';
import { BurnoutRiskTracker } from './BurnoutRiskTracker';
import { LeaveConflictManager } from './LeaveConflictManager';
import { PayrollAutoCalculator } from './PayrollAutoCalculator';
import { ComplianceTrainingTracker } from './ComplianceTrainingTracker';
import { 
  Users, 
  MapPin, 
  Calendar, 
  Heart,
  Plane,
  Calculator,
  GraduationCap
} from 'lucide-react';

export const HRManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState('attendance');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">HR & Staff Management</h1>
                <p className="text-sm text-gray-600">Comprehensive workforce management for healthcare operations</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 w-full mb-6">
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Attendance</span>
            </TabsTrigger>
            <TabsTrigger value="roster" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Roster</span>
            </TabsTrigger>
            <TabsTrigger value="burnout" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Wellness</span>
            </TabsTrigger>
            <TabsTrigger value="leave" className="flex items-center gap-2">
              <Plane className="w-4 h-4" />
              <span className="hidden sm:inline">Leave</span>
            </TabsTrigger>
            <TabsTrigger value="payroll" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Payroll</span>
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Training</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-6">
            <GeoAttendanceSystem />
          </TabsContent>

          <TabsContent value="roster" className="space-y-6">
            <SmartShiftRoster />
          </TabsContent>

          <TabsContent value="burnout" className="space-y-6">
            <BurnoutRiskTracker />
          </TabsContent>

          <TabsContent value="leave" className="space-y-6">
            <LeaveConflictManager />
          </TabsContent>

          <TabsContent value="payroll" className="space-y-6">
            <PayrollAutoCalculator />
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <ComplianceTrainingTracker />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
