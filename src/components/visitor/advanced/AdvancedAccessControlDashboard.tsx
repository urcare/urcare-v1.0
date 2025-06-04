
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StaffAuthenticationInterface } from './StaffAuthenticationInterface';
import { BlacklistWatchlistManager } from './BlacklistWatchlistManager';
import { VisitorTimeTrackingDashboard } from './VisitorTimeTrackingDashboard';
import { 
  Shield, 
  Eye, 
  Clock,
  AlertTriangle,
  Users,
  Settings
} from 'lucide-react';

export const AdvancedAccessControlDashboard = () => {
  const [activeTab, setActiveTab] = useState('staff-auth');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Advanced Access Control</h1>
                <p className="text-sm text-gray-600">Premium security features with intelligent monitoring</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full mb-6">
            <TabsTrigger value="staff-auth" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Staff Authentication</span>
            </TabsTrigger>
            <TabsTrigger value="watchlist" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Watchlist Manager</span>
            </TabsTrigger>
            <TabsTrigger value="time-tracking" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Time Tracking</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="staff-auth" className="space-y-6">
            <StaffAuthenticationInterface />
          </TabsContent>

          <TabsContent value="watchlist" className="space-y-6">
            <BlacklistWatchlistManager />
          </TabsContent>

          <TabsContent value="time-tracking" className="space-y-6">
            <VisitorTimeTrackingDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
