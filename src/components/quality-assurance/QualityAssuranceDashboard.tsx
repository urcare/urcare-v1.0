
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TestSuiteManagement } from './TestSuiteManagement';
import { BugTrackingSystem } from './BugTrackingSystem';
import { UserAcceptanceTestingPortal } from './UserAcceptanceTestingPortal';
import { CodeQualityDashboard } from './CodeQualityDashboard';
import { SecurityScanningInterface } from './SecurityScanningInterface';
import { 
  Shield, 
  Bug, 
  TestTube, 
  Users, 
  BarChart3,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp
} from 'lucide-react';

export const QualityAssuranceDashboard = () => {
  const [activeTab, setActiveTab] = useState('tests');

  const qaOverview = {
    testCoverage: 87.5,
    activeBugs: 23,
    pendingApprovals: 7,
    codeQuality: 8.2,
    securityScore: 94.3,
    passedTests: 1247,
    failedTests: 38,
    pendingTests: 12
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Shield className="h-8 w-8 text-green-600" />
          Quality Assurance Dashboard
          <TestTube className="h-8 w-8 text-blue-600" />
        </h1>
        <p className="text-gray-600">
          Comprehensive quality management and testing coordination
        </p>
      </div>

      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-white/50 rounded-lg">
              <BarChart3 className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">Test Coverage</h3>
              <p className="text-2xl font-bold">{qaOverview.testCoverage}%</p>
              <p className="text-sm text-gray-600">Code Coverage</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Bug className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">Active Bugs</h3>
              <p className="text-2xl font-bold">{qaOverview.activeBugs}</p>
              <p className="text-sm text-gray-600">Pending Resolution</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Users className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">UAT Pending</h3>
              <p className="text-2xl font-bold">{qaOverview.pendingApprovals}</p>
              <p className="text-sm text-gray-600">Awaiting Approval</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Shield className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-bold text-purple-800">Security</h3>
              <p className="text-2xl font-bold">{qaOverview.securityScore}%</p>
              <p className="text-sm text-gray-600">Security Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Execution Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{qaOverview.passedTests}</div>
                <div className="text-sm text-gray-600">Passed Tests</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">{qaOverview.failedTests}</div>
                <div className="text-sm text-gray-600">Failed Tests</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">{qaOverview.pendingTests}</div>
                <div className="text-sm text-gray-600">Pending Tests</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="tests" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            <span className="hidden sm:inline">Tests</span>
          </TabsTrigger>
          <TabsTrigger value="bugs" className="flex items-center gap-2">
            <Bug className="h-4 w-4" />
            <span className="hidden sm:inline">Bugs</span>
          </TabsTrigger>
          <TabsTrigger value="uat" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">UAT</span>
          </TabsTrigger>
          <TabsTrigger value="quality" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Quality</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-6">
          <TestSuiteManagement />
        </TabsContent>

        <TabsContent value="bugs" className="space-y-6">
          <BugTrackingSystem />
        </TabsContent>

        <TabsContent value="uat" className="space-y-6">
          <UserAcceptanceTestingPortal />
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <CodeQualityDashboard />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecurityScanningInterface />
        </TabsContent>
      </Tabs>
    </div>
  );
};
