
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmergencySOSButton } from './EmergencySOSButton';
import { EmergencyProfileCard } from './EmergencyProfileCard';
import { PanicModeSystem } from './PanicModeSystem';
import { FirstAidGuide } from './FirstAidGuide';
import { BedFinder } from './BedFinder';
import { CrisisConsentUnlock } from './CrisisConsentUnlock';
import { ContactCascadeSystem } from './ContactCascadeSystem';
import { MedicalAlertQR } from './MedicalAlertQR';
import { EmergencyMedicationList } from './EmergencyMedicationList';
import { HospitalNavigation } from './HospitalNavigation';
import { EmergencyTriggerSettings } from '../health-twin/EmergencyTriggerSettings';
import { Shield, Heart, AlertTriangle, BookOpen, Settings, Phone, Bed, Users, QrCode, Pill, Navigation, Lock } from 'lucide-react';

export const EmergencyDashboard = () => {
  const [activeTab, setActiveTab] = useState('sos');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
          Advanced Emergency System Dashboard
        </h1>
        <p className="text-gray-600">
          Comprehensive emergency response system with advanced tools and real-time capabilities
        </p>
      </div>

      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-white/50 rounded-lg">
              <Shield className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">Emergency SOS</h3>
              <p className="text-sm text-gray-600">GPS location & emergency contacts</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Bed className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">Hospital Finder</h3>
              <p className="text-sm text-gray-600">Real-time bed availability</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Navigation className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">Smart Navigation</h3>
              <p className="text-sm text-gray-600">Traffic-aware emergency routing</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Users className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">Contact Cascade</h3>
              <p className="text-sm text-gray-600">Automated emergency alerts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 lg:grid-cols-11 w-full">
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
            <span className="hidden sm:inline">Panic</span>
          </TabsTrigger>
          <TabsTrigger value="first-aid" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">First Aid</span>
          </TabsTrigger>
          <TabsTrigger value="bed-finder" className="flex items-center gap-2">
            <Bed className="h-4 w-4" />
            <span className="hidden sm:inline">Beds</span>
          </TabsTrigger>
          <TabsTrigger value="consent" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Consent</span>
          </TabsTrigger>
          <TabsTrigger value="cascade" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Cascade</span>
          </TabsTrigger>
          <TabsTrigger value="qr-code" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            <span className="hidden sm:inline">QR</span>
          </TabsTrigger>
          <TabsTrigger value="medications" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            <span className="hidden sm:inline">Meds</span>
          </TabsTrigger>
          <TabsTrigger value="navigation" className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            <span className="hidden sm:inline">Navigate</span>
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

        <TabsContent value="bed-finder" className="space-y-6">
          <BedFinder />
        </TabsContent>

        <TabsContent value="consent" className="space-y-6">
          <CrisisConsentUnlock />
        </TabsContent>

        <TabsContent value="cascade" className="space-y-6">
          <ContactCascadeSystem />
        </TabsContent>

        <TabsContent value="qr-code" className="space-y-6">
          <MedicalAlertQR />
        </TabsContent>

        <TabsContent value="medications" className="space-y-6">
          <EmergencyMedicationList />
        </TabsContent>

        <TabsContent value="navigation" className="space-y-6">
          <HospitalNavigation />
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
