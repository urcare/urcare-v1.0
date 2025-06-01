
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MedicationRequestFlow } from './MedicationRequestFlow';
import { DrugIssueSystem } from './DrugIssueSystem';
import { ReturnsTracker } from './ReturnsTracker';
import { AntibioticStewardship } from './AntibioticStewardship';
import { HighCostDrugManagement } from './HighCostDrugManagement';
import { RefillPredictions } from './RefillPredictions';
import { 
  Package, 
  Scan, 
  RotateCcw, 
  Shield, 
  DollarSign, 
  TrendingUp,
  Pill,
  Clock,
  User,
  AlertTriangle,
  Bell
} from 'lucide-react';

export const PharmacyDashboard = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const alerts = [
    { type: 'critical', message: 'Low stock alert: Paracetamol 500mg (2 days remaining)' },
    { type: 'urgent', message: 'Urgent medication request: Morphine 10mg for John Doe' },
    { type: 'warning', message: 'Antibiotic review due: Vancomycin for Patient XYZ' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Hospital Pharmacy System</h1>
                <p className="text-sm text-gray-600">Comprehensive medication management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Last updated: {currentTime.toLocaleTimeString()}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Chief Pharmacist</span>
              </div>
              
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-[10px] text-white font-bold">{alerts.length}</span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Alert Bar */}
      <div className="bg-red-50 border-l-4 border-red-500">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div className="flex-1">
              <div className="flex flex-wrap gap-4">
                {alerts.map((alert, index) => (
                  <span key={index} className="text-sm text-red-800">
                    {alert.message}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Quick Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                  <p className="text-2xl font-bold text-blue-600">24</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Issues</p>
                  <p className="text-2xl font-bold text-green-600">157</p>
                </div>
                <Scan className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Stock Alerts</p>
                  <p className="text-2xl font-bold text-red-600">8</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">High-Cost Pending</p>
                  <p className="text-2xl font-bold text-orange-600">3</p>
                </div>
                <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Navigation */}
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-6 w-full mb-6">
                <TabsTrigger value="requests" className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span className="hidden sm:inline">Medication Requests</span>
                  <span className="sm:hidden">Requests</span>
                </TabsTrigger>
                <TabsTrigger value="issue" className="flex items-center gap-2">
                  <Scan className="w-4 h-4" />
                  <span className="hidden sm:inline">Drug Issue</span>
                  <span className="sm:hidden">Issue</span>
                </TabsTrigger>
                <TabsTrigger value="returns" className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Returns</span>
                </TabsTrigger>
                <TabsTrigger value="stewardship" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Stewardship</span>
                </TabsTrigger>
                <TabsTrigger value="highcost" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="hidden sm:inline">High-Cost</span>
                </TabsTrigger>
                <TabsTrigger value="predictions" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="hidden sm:inline">Predictions</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="requests" className="space-y-6">
                <MedicationRequestFlow />
              </TabsContent>

              <TabsContent value="issue" className="space-y-6">
                <DrugIssueSystem />
              </TabsContent>

              <TabsContent value="returns" className="space-y-6">
                <ReturnsTracker />
              </TabsContent>

              <TabsContent value="stewardship" className="space-y-6">
                <AntibioticStewardship />
              </TabsContent>

              <TabsContent value="highcost" className="space-y-6">
                <HighCostDrugManagement />
              </TabsContent>

              <TabsContent value="predictions" className="space-y-6">
                <RefillPredictions />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
