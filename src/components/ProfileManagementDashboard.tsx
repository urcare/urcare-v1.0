
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RoleBasedPersonalizer } from './RoleBasedPersonalizer';
import { ConsentManager } from './ConsentManager';
import { AppSkinPersonalizer } from './AppSkinPersonalizer';
import { FamilyHealthTree } from './FamilyHealthTree';
import { Settings, Palette, Shield, Users, User, Bell } from 'lucide-react';

export function ProfileManagementDashboard() {
  const [activeTab, setActiveTab] = useState('personalization');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-6 w-6" />
            Profile Management Dashboard
          </CardTitle>
          <CardDescription>
            Customize your experience, manage privacy, and connect with family
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personalization" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">AI Personalization</span>
            <span className="sm:hidden">AI</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Privacy & Consent</span>
            <span className="sm:hidden">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="themes" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Themes</span>
            <span className="sm:hidden">Themes</span>
          </TabsTrigger>
          <TabsTrigger value="family" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Family Tree</span>
            <span className="sm:hidden">Family</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personalization" className="space-y-6">
          <RoleBasedPersonalizer />
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <ConsentManager />
        </TabsContent>

        <TabsContent value="themes" className="space-y-6">
          <AppSkinPersonalizer />
        </TabsContent>

        <TabsContent value="family" className="space-y-6">
          <FamilyHealthTree />
        </TabsContent>
      </Tabs>
    </div>
  );
}
