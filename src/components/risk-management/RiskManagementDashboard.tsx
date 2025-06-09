
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RiskAssessmentDashboard } from './RiskAssessmentDashboard';
import { PrivacyImpactAssessment } from './PrivacyImpactAssessment';
import { VendorRiskManagement } from './VendorRiskManagement';
import { IncidentResponseDashboard } from './IncidentResponseDashboard';
import { BusinessImpactAnalysis } from './BusinessImpactAnalysis';
import { RegulatoryChangeManagement } from './RegulatoryChangeManagement';
import { 
  Shield,
  AlertTriangle,
  Users,
  Building,
  Target,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const RiskManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState('risk-assessment');
  const [riskMetrics, setRiskMetrics] = useState({
    overallRiskScore: 68.5,
    criticalRisks: 12,
    highRisks: 28,
    mediumRisks: 45,
    lowRisks: 134,
    openIncidents: 7,
    pendingAssessments: 23,
    vendorsAtRisk: 8,
    complianceGaps: 15,
    mitigationProgress: 72.3
  });

  const riskTabs = [
    {
      id: 'risk-assessment',
      title: 'Risk Assessment',
      icon: Shield,
      component: RiskAssessmentDashboard,
      description: 'Comprehensive threat and vulnerability analysis'
    },
    {
      id: 'privacy-impact',
      title: 'Privacy Impact',
      icon: FileText,
      component: PrivacyImpactAssessment,
      description: 'Privacy impact assessments and compliance'
    },
    {
      id: 'vendor-risk',
      title: 'Vendor Risk',
      icon: Building,
      component: VendorRiskManagement,
      description: 'Third-party vendor risk management'
    },
    {
      id: 'incident-response',
      title: 'Incident Response',
      icon: AlertTriangle,
      component: IncidentResponseDashboard,
      description: 'Incident management and response workflows'
    },
    {
      id: 'business-impact',
      title: 'Business Impact',
      icon: Target,
      component: BusinessImpactAnalysis,
      description: 'Business continuity and impact analysis'
    },
    {
      id: 'regulatory-change',
      title: 'Regulatory Change',
      icon: Users,
      component: RegulatoryChangeManagement,
      description: 'Regulatory compliance and change management'
    }
  ];

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getRiskBgColor = (score: number) => {
    if (score >= 80) return 'bg-red-100';
    if (score >= 60) return 'bg-orange-100';
    if (score >= 40) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  useEffect(() => {
    // Simulate real-time risk updates
    const interval = setInterval(() => {
      setRiskMetrics(prev => ({
        ...prev,
        overallRiskScore: Math.max(0, Math.min(100, prev.overallRiskScore + (Math.random() - 0.5) * 2)),
        openIncidents: Math.max(0, prev.openIncidents + Math.floor(Math.random() * 3) - 1)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold">Risk Management Center</h1>
      </div>

      {/* Risk Overview Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Overall Risk Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getRiskColor(riskMetrics.overallRiskScore)}`}>
                {riskMetrics.overallRiskScore.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Risk Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{riskMetrics.criticalRisks}</div>
              <div className="text-sm text-gray-600">Critical Risks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{riskMetrics.openIncidents}</div>
              <div className="text-sm text-gray-600">Open Incidents</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{riskMetrics.vendorsAtRisk}</div>
              <div className="text-sm text-gray-600">Vendors at Risk</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{riskMetrics.mitigationProgress}%</div>
              <div className="text-sm text-gray-600">Mitigation Progress</div>
            </div>
          </div>

          {/* Risk Distribution */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg border ${getRiskBgColor(90)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-medium">Critical</span>
                </div>
                <div className="text-lg font-bold text-red-600">{riskMetrics.criticalRisks}</div>
              </div>
              <div className="text-sm text-gray-600">Immediate action required</div>
            </div>
            <div className={`p-4 rounded-lg border ${getRiskBgColor(70)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span className="font-medium">High</span>
                </div>
                <div className="text-lg font-bold text-orange-600">{riskMetrics.highRisks}</div>
              </div>
              <div className="text-sm text-gray-600">Action needed soon</div>
            </div>
            <div className={`p-4 rounded-lg border ${getRiskBgColor(50)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium">Medium</span>
                </div>
                <div className="text-lg font-bold text-yellow-600">{riskMetrics.mediumRisks}</div>
              </div>
              <div className="text-sm text-gray-600">Monitor regularly</div>
            </div>
            <div className={`p-4 rounded-lg border ${getRiskBgColor(20)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Low</span>
                </div>
                <div className="text-lg font-bold text-green-600">{riskMetrics.lowRisks}</div>
              </div>
              <div className="text-sm text-gray-600">Routine monitoring</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      {riskMetrics.criticalRisks > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Critical Risks Requiring Immediate Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-4 w-4" />
                <span>Data breach detected in payment processing system</span>
              </div>
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-4 w-4" />
                <span>Vendor XYZ failed security assessment - contract expires in 30 days</span>
              </div>
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-4 w-4" />
                <span>Regulatory compliance gap detected in HIPAA requirements</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          {riskTabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {riskTabs.map((tab) => {
          const ComponentToRender = tab.component;
          return (
            <TabsContent key={tab.id} value={tab.id} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <tab.icon className="h-5 w-5" />
                    {tab.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{tab.description}</p>
                </CardHeader>
                <CardContent>
                  <ComponentToRender />
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};
