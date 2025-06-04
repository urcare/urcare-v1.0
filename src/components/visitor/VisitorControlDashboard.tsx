
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { VisitorRegistrationSystem } from './VisitorRegistrationSystem';
import { QREntrySystem } from './QREntrySystem';
import { VisitorCategoryManager } from './VisitorCategoryManager';
import { ZoneAccessControl } from './ZoneAccessControl';
import { NightVisitControl } from './NightVisitControl';
import { EscortManagement } from './EscortManagement';
import { SecurityDashboard } from './SecurityDashboard';
import { 
  Shield, 
  UserPlus, 
  QrCode,
  Users,
  MapPin,
  Moon,
  UserCheck,
  AlertTriangle,
  Star
} from 'lucide-react';

export const VisitorControlDashboard = () => {
  const [activeTab, setActiveTab] = useState('registration');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Visitor & Access Control</h1>
                <p className="text-sm text-gray-600">Smart entry management and security monitoring</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/advanced-access-control'}
                className="border-yellow-400 text-yellow-700 hover:bg-yellow-50"
              >
                <Star className="w-4 h-4 mr-2" />
                Premium Features
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-7 w-full mb-6">
            <TabsTrigger value="registration" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Registration</span>
            </TabsTrigger>
            <TabsTrigger value="qr-entry" className="flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">QR Entry</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Categories</span>
            </TabsTrigger>
            <TabsTrigger value="zones" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Zone Access</span>
            </TabsTrigger>
            <TabsTrigger value="night-visits" className="flex items-center gap-2">
              <Moon className="w-4 h-4" />
              <span className="hidden sm:inline">Night Visits</span>
            </TabsTrigger>
            <TabsTrigger value="escorts" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Escorts</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="registration" className="space-y-6">
            <VisitorRegistrationSystem />
          </TabsContent>

          <TabsContent value="qr-entry" className="space-y-6">
            <QREntrySystem />
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <VisitorCategoryManager />
          </TabsContent>

          <TabsContent value="zones" className="space-y-6">
            <ZoneAccessControl />
          </TabsContent>

          <TabsContent value="night-visits" className="space-y-6">
            <NightVisitControl />
          </TabsContent>

          <TabsContent value="escorts" className="space-y-6">
            <EscortManagement />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecurityDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
