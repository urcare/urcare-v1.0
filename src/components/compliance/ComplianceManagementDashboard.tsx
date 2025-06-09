
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HIPAAComplianceDashboard } from './HIPAAComplianceDashboard';
import { GDPRPrivacyManagement } from './GDPRPrivacyManagement';
import { SOXFinancialCompliance } from './SOXFinancialCompliance';
import { FDAComplianceTracking } from './FDAComplianceTracking';
import { JointCommissionInterface } from './JointCommissionInterface';
import { LocalRegulationDashboard } from './LocalRegulationDashboard';
import { 
  Shield,
  Lock,
  DollarSign,
  Stethoscope,
  Award,
  Building,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

export const ComplianceManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState('hipaa');
  const [complianceMetrics, setComplianceMetrics] = useState({
    overallScore: 94.2,
    hipaaCompliance: 96.8,
    gdprCompliance: 92.5,
    soxCompliance: 95.1,
    fdaCompliance: 93.7,
    jointCommission: 97.2,
    localRegulations: 89.3,
    criticalIssues: 3,
    pendingAudits: 7,
    completedAssessments: 42,
    upcomingDeadlines: 12
  });

  const complianceTabs = [
    {
      id: 'hipaa',
      title: 'HIPAA',
      icon: Shield,
      component: HIPAAComplianceDashboard,
      score: complianceMetrics.hipaaCompliance,
      description: 'Healthcare privacy and security compliance'
    },
    {
      id: 'gdpr',
      title: 'GDPR',
      icon: Lock,
      component: GDPRPrivacyManagement,
      score: complianceMetrics.gdprCompliance,
      description: 'European data protection regulations'
    },
    {
      id: 'sox',
      title: 'SOX',
      icon: DollarSign,
      component: SOXFinancialCompliance,
      score: complianceMetrics.soxCompliance,
      description: 'Financial reporting and controls'
    },
    {
      id: 'fda',
      title: 'FDA',
      icon: Stethoscope,
      component: FDAComplianceTracking,
      score: complianceMetrics.fdaCompliance,
      description: 'Medical device and drug regulations'
    },
    {
      id: 'jointcommission',
      title: 'Joint Commission',
      icon: Award,
      component: JointCommissionInterface,
      score: complianceMetrics.jointCommission,
      description: 'Healthcare accreditation standards'
    },
    {
      id: 'local',
      title: 'Local Regulations',
      icon: Building,
      component: LocalRegulationDashboard,
      score: complianceMetrics.localRegulations,
      description: 'Regional and local compliance requirements'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 95) return 'bg-green-100';
    if (score >= 85) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  useEffect(() => {
    // Simulate real-time compliance updates
    const interval = setInterval(() => {
      setComplianceMetrics(prev => ({
        ...prev,
        criticalIssues: Math.max(0, prev.criticalIssues + Math.floor(Math.random() * 2) - 1),
        pendingAudits: Math.max(0, prev.pendingAudits + Math.floor(Math.random() * 2) - 1)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold">Compliance Management Center</h1>
      </div>

      {/* Overall Compliance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Overall Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{complianceMetrics.overallScore}%</div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{complianceMetrics.criticalIssues}</div>
              <div className="text-sm text-gray-600">Critical Issues</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{complianceMetrics.pendingAudits}</div>
              <div className="text-sm text-gray-600">Pending Audits</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{complianceMetrics.upcomingDeadlines}</div>
              <div className="text-sm text-gray-600">Upcoming Deadlines</div>
            </div>
          </div>

          {/* Compliance Scores Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {complianceTabs.map((tab) => (
              <div key={tab.id} className={`p-4 rounded-lg border ${getScoreBgColor(tab.score)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.title}</span>
                  </div>
                  <div className={`text-lg font-bold ${getScoreColor(tab.score)}`}>
                    {tab.score}%
                  </div>
                </div>
                <div className="text-sm text-gray-600">{tab.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      {complianceMetrics.criticalIssues > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Critical Compliance Issues Requiring Immediate Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-4 w-4" />
                <span>HIPAA: Potential data breach detected in System A</span>
              </div>
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-4 w-4" />
                <span>GDPR: Data retention policy violation - 127 records overdue</span>
              </div>
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-4 w-4" />
                <span>SOX: Financial control gap in billing reconciliation</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          {complianceTabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {complianceTabs.map((tab) => {
          const ComponentToRender = tab.component;
          return (
            <TabsContent key={tab.id} value={tab.id} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <tab.icon className="h-5 w-5" />
                    {tab.title} Compliance Dashboard
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
