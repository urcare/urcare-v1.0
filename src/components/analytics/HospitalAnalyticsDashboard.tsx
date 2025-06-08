
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Bed,
  DollarSign,
  Activity,
  Clock,
  AlertTriangle,
  Download,
  Filter,
  Calendar,
  Building2
} from 'lucide-react';
import { PatientFlowAnalytics } from './PatientFlowAnalytics';
import { RevenueAnalytics } from './RevenueAnalytics';
import { StaffProductivityAnalytics } from './StaffProductivityAnalytics';
import { BedUtilizationAnalytics } from './BedUtilizationAnalytics';
import { AnalyticsFilters } from './AnalyticsFilters';
import { KPIDashboard } from './KPIDashboard';

interface AnalyticsMetrics {
  totalPatients: number;
  totalRevenue: number;
  bedOccupancy: number;
  staffUtilization: number;
  avgLengthOfStay: number;
  patientSatisfaction: number;
  emergencyAdmissions: number;
  dischargeToday: number;
}

const mockMetrics: AnalyticsMetrics = {
  totalPatients: 847,
  totalRevenue: 2450000,
  bedOccupancy: 78,
  staffUtilization: 85,
  avgLengthOfStay: 4.2,
  patientSatisfaction: 94,
  emergencyAdmissions: 23,
  dischargeToday: 15
};

export const HospitalAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics] = useState<AnalyticsMetrics>(mockMetrics);
  const [dateRange, setDateRange] = useState('last30days');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const handleExportReport = (format: 'pdf' | 'excel') => {
    console.log(`Exporting ${format} report for ${dateRange}, department: ${selectedDepartment}`);
    // Implementation would call backend API
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                Hospital Analytics Dashboard
              </CardTitle>
              <CardDescription>
                Comprehensive real-time analytics and performance monitoring
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleExportReport('pdf')}>
                <Download className="h-4 w-4 mr-1" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={() => handleExportReport('excel')}>
                <Download className="h-4 w-4 mr-1" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AnalyticsFilters 
            dateRange={dateRange}
            setDateRange={setDateRange}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
          />
        </CardContent>
      </Card>

      <KPIDashboard metrics={metrics} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="patient-flow" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Patient Flow</span>
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Revenue</span>
          </TabsTrigger>
          <TabsTrigger value="staff" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Staff</span>
          </TabsTrigger>
          <TabsTrigger value="beds" className="flex items-center gap-2">
            <Bed className="h-4 w-4" />
            <span className="hidden sm:inline">Beds</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Performance Summary</CardTitle>
                <CardDescription>Key metrics for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">New Admissions</span>
                    </div>
                    <Badge className="bg-blue-500 text-white">32</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Discharges</span>
                    </div>
                    <Badge className="bg-green-500 text-white">28</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <span className="font-medium">Emergency Cases</span>
                    </div>
                    <Badge className="bg-orange-500 text-white">12</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Avg Wait Time</span>
                    </div>
                    <Badge className="bg-purple-500 text-white">23 min</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
                <CardDescription>Top performing departments today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Cardiology</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">95% efficiency</p>
                      <p className="text-xs text-gray-500">42 patients</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">Emergency</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">88% efficiency</p>
                      <p className="text-xs text-gray-500">67 patients</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium">Surgery</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">82% efficiency</p>
                      <p className="text-xs text-gray-500">18 operations</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patient-flow" className="space-y-6">
          <PatientFlowAnalytics dateRange={dateRange} department={selectedDepartment} />
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <RevenueAnalytics dateRange={dateRange} department={selectedDepartment} />
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
          <StaffProductivityAnalytics dateRange={dateRange} department={selectedDepartment} />
        </TabsContent>

        <TabsContent value="beds" className="space-y-6">
          <BedUtilizationAnalytics dateRange={dateRange} department={selectedDepartment} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
