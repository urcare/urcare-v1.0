
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Eye, 
  AlertTriangle, 
  Activity,
  DollarSign,
  Server,
  Brain,
  Lock,
  FileText,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import { AccessPatternMonitor } from './AccessPatternMonitor';
import { ConsentOverrideWatchdog } from './ConsentOverrideWatchdog';
import { FraudDetectionSystem } from './FraudDetectionSystem';
import { MissedChargePredictor } from './MissedChargePredictor';
import { SystemLoadBalancer } from './SystemLoadBalancer';
import { AIQualityMonitor } from './AIQualityMonitor';

interface ComplianceMetrics {
  totalAccess: number;
  suspiciousActivity: number;
  consentOverrides: number;
  fraudAlerts: number;
  missedCharges: number;
  systemLoad: number;
  aiPerformance: number;
  complianceScore: number;
}

const mockMetrics: ComplianceMetrics = {
  totalAccess: 15847,
  suspiciousActivity: 23,
  consentOverrides: 12,
  fraudAlerts: 7,
  missedCharges: 156,
  systemLoad: 78,
  aiPerformance: 94,
  complianceScore: 97
};

export const SafetyComplianceDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics] = useState<ComplianceMetrics>(mockMetrics);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-red-600" />
            Safety & Compliance AI Dashboard
          </CardTitle>
          <CardDescription>
            Comprehensive risk management with access monitoring, fraud detection, and compliance oversight
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-6">
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Eye className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{metrics.totalAccess.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Access</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-orange-200 bg-orange-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-600">{metrics.suspiciousActivity}</p>
                  <p className="text-sm text-gray-600">Suspicious</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-purple-200 bg-purple-50">
              <div className="flex items-center gap-2">
                <Lock className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-600">{metrics.consentOverrides}</p>
                  <p className="text-sm text-gray-600">Overrides</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">{metrics.fraudAlerts}</p>
                  <p className="text-sm text-gray-600">Fraud Alerts</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-2">
                <DollarSign className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{metrics.missedCharges}</p>
                  <p className="text-sm text-gray-600">Missed Charges</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-teal-200 bg-teal-50">
              <div className="flex items-center gap-2">
                <Server className="h-8 w-8 text-teal-600" />
                <div>
                  <p className="text-2xl font-bold text-teal-600">{metrics.systemLoad}%</p>
                  <p className="text-sm text-gray-600">System Load</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-indigo-200 bg-indigo-50">
              <div className="flex items-center gap-2">
                <Brain className="h-8 w-8 text-indigo-600" />
                <div>
                  <p className="text-2xl font-bold text-indigo-600">{metrics.aiPerformance}%</p>
                  <p className="text-sm text-gray-600">AI Performance</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <FileText className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">{metrics.complianceScore}%</p>
                  <p className="text-sm text-gray-600">Compliance</p>
                </div>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="access" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Access</span>
          </TabsTrigger>
          <TabsTrigger value="consent" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Consent</span>
          </TabsTrigger>
          <TabsTrigger value="fraud" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Fraud</span>
          </TabsTrigger>
          <TabsTrigger value="charges" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Charges</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
          <TabsTrigger value="ai-quality" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">AI Quality</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Overview</CardTitle>
                <CardDescription>Critical safety and compliance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span className="font-medium">High-priority alerts</span>
                    </div>
                    <Badge className="bg-red-500 text-white">7</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-orange-600" />
                      <span className="font-medium">Suspicious access patterns</span>
                    </div>
                    <Badge className="bg-orange-500 text-white">23</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Compliance score</span>
                    </div>
                    <Badge className="bg-green-500 text-white">97%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Incidents</CardTitle>
                <CardDescription>Latest security and compliance events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-sm">Fraud alert triggered</p>
                      <p className="text-xs text-gray-500">Unusual billing pattern detected - 5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-sm">Access anomaly detected</p>
                      <p className="text-xs text-gray-500">Multiple failed login attempts - 12 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-sm">Consent override authorized</p>
                      <p className="text-xs text-gray-500">Emergency access granted - 18 minutes ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="access" className="space-y-6">
          <AccessPatternMonitor />
        </TabsContent>

        <TabsContent value="consent" className="space-y-6">
          <ConsentOverrideWatchdog />
        </TabsContent>

        <TabsContent value="fraud" className="space-y-6">
          <FraudDetectionSystem />
        </TabsContent>

        <TabsContent value="charges" className="space-y-6">
          <MissedChargePredictor />
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <SystemLoadBalancer />
        </TabsContent>

        <TabsContent value="ai-quality" className="space-y-6">
          <AIQualityMonitor />
        </TabsContent>
      </Tabs>
    </div>
  );
};
