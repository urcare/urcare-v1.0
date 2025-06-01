import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OPDBilling } from './OPDBilling';
import { IPDBilling } from './IPDBilling';
import { LabBilling } from './LabBilling';
import { PharmacyBilling } from './PharmacyBilling';
import { AdvanceDeposit } from './AdvanceDeposit';
import { RefundEngine } from './RefundEngine';
import { PackageReconciliation } from './PackageReconciliation';
import { AdvancedBillingDashboard } from './AdvancedBillingDashboard';
import { BillingAnalyticsDashboard } from './analytics/BillingAnalyticsDashboard';
import { 
  CreditCard, 
  Receipt, 
  Calculator, 
  DollarSign,
  TrendingUp,
  FileText,
  Clock,
  User,
  Building,
  Plus,
  Eye,
  Settings,
  BarChart3
} from 'lucide-react';

export const BillingDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dailyCollections, setDailyCollections] = useState(125847.50);
  const [weeklyCollections, setWeeklyCollections] = useState(756284.75);
  const [monthlyCollections, setMonthlyCollections] = useState(3247891.25);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate real-time collections update
      setDailyCollections(prev => prev + Math.random() * 100);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const departmentRevenue = [
    { name: 'OPD', amount: 45620.75, color: 'bg-blue-500' },
    { name: 'IPD', amount: 89750.25, color: 'bg-green-500' },
    { name: 'Laboratory', amount: 23450.80, color: 'bg-purple-500' },
    { name: 'Pharmacy', amount: 67234.90, color: 'bg-orange-500' },
    { name: 'Radiology', amount: 34890.65, color: 'bg-pink-500' },
    { name: 'Surgery', amount: 156789.45, color: 'bg-indigo-500' }
  ];

  const quickStats = [
    { label: 'Pending Bills', value: 24, icon: Clock, color: 'text-amber-600' },
    { label: 'Today\'s Patients', value: 187, icon: User, color: 'text-blue-600' },
    { label: 'Active IPD', value: 42, icon: Building, color: 'text-green-600' },
    { label: 'Refund Requests', value: 8, icon: FileText, color: 'text-red-600' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Unified Billing System</h1>
                <p className="text-sm text-gray-600">Comprehensive hospital revenue management</p>
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
                <span className="text-sm font-medium text-blue-900">Billing Manager</span>
              </div>
              
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Bill
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-10 w-full mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="opd" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">OPD</span>
            </TabsTrigger>
            <TabsTrigger value="ipd" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              <span className="hidden sm:inline">IPD</span>
            </TabsTrigger>
            <TabsTrigger value="lab" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Lab</span>
            </TabsTrigger>
            <TabsTrigger value="pharmacy" className="flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              <span className="hidden sm:inline">Pharmacy</span>
            </TabsTrigger>
            <TabsTrigger value="deposits" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Deposits</span>
            </TabsTrigger>
            <TabsTrigger value="refunds" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Refunds</span>
            </TabsTrigger>
            <TabsTrigger value="packages" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Packages</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Advanced</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Revenue Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Daily Collections</p>
                      <p className="text-3xl font-bold text-green-600">
                        ${dailyCollections.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                      <Badge className="bg-green-100 text-green-800 mt-2">
                        +12.5% from yesterday
                      </Badge>
                    </div>
                    <TrendingUp className="w-12 h-12 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Weekly Collections</p>
                      <p className="text-3xl font-bold text-blue-600">
                        ${weeklyCollections.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                      <Badge className="bg-blue-100 text-blue-800 mt-2">
                        +8.3% from last week
                      </Badge>
                    </div>
                    <CreditCard className="w-12 h-12 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Monthly Collections</p>
                      <p className="text-3xl font-bold text-purple-600">
                        ${monthlyCollections.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                      <Badge className="bg-purple-100 text-purple-800 mt-2">
                        +15.7% from last month
                      </Badge>
                    </div>
                    <Calculator className="w-12 h-12 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Department Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Department-wise Revenue (Today)</CardTitle>
                <CardDescription>
                  Real-time breakdown of collections by department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentRevenue.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded ${dept.color}`}></div>
                        <span className="font-medium">{dept.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${dept.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                        <p className="text-sm text-gray-600">
                          {((dept.amount / dailyCollections) * 100).toFixed(1)}% of total
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      </div>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="opd" className="space-y-6">
            <OPDBilling />
          </TabsContent>

          <TabsContent value="ipd" className="space-y-6">
            <IPDBilling />
          </TabsContent>

          <TabsContent value="lab" className="space-y-6">
            <LabBilling />
          </TabsContent>

          <TabsContent value="pharmacy" className="space-y-6">
            <PharmacyBilling />
          </TabsContent>

          <TabsContent value="deposits" className="space-y-6">
            <AdvanceDeposit />
          </TabsContent>

          <TabsContent value="refunds" className="space-y-6">
            <RefundEngine />
          </TabsContent>

          <TabsContent value="packages" className="space-y-6">
            <PackageReconciliation />
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <AdvancedBillingDashboard />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <BillingAnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
