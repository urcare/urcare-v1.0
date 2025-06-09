
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RPAManagementInterface } from './RPAManagementInterface';
import { AutomatedReportingInterface } from './AutomatedReportingInterface';
import { IntelligentFormInterface } from './IntelligentFormInterface';
import { CaseRoutingDashboard } from './CaseRoutingDashboard';
import { QualityAssuranceInterface } from './QualityAssuranceInterface';
import { SelfHealingSystemInterface } from './SelfHealingSystemInterface';
import { 
  Bot,
  FileText,
  FormInput,
  Route,
  Shield,
  Wrench,
  Activity,
  TrendingUp,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const AdvancedAutomationDashboard = () => {
  const [activeTab, setActiveTab] = useState('rpa');
  const [automationMetrics, setAutomationMetrics] = useState({
    totalBots: 24,
    activeBots: 18,
    completedTasks: 3247,
    successRate: 96.8,
    automatedReports: 156,
    formsProcessed: 892,
    qualityScore: 94.2,
    systemHealth: 98.5
  });

  const automationTabs = [
    {
      id: 'rpa',
      title: 'RPA Management',
      icon: Bot,
      component: RPAManagementInterface,
      description: 'Bot performance monitoring and task automation management'
    },
    {
      id: 'reporting',
      title: 'Automated Reporting',
      icon: FileText,
      component: AutomatedReportingInterface,
      description: 'Template management and automated report distribution'
    },
    {
      id: 'forms',
      title: 'Intelligent Forms',
      icon: FormInput,
      component: IntelligentFormInterface,
      description: 'Smart form processing with auto-completion and validation'
    },
    {
      id: 'routing',
      title: 'Case Routing',
      icon: Route,
      component: CaseRoutingDashboard,
      description: 'AI-powered patient classification and specialty matching'
    },
    {
      id: 'quality',
      title: 'Quality Assurance',
      icon: Shield,
      component: QualityAssuranceInterface,
      description: 'Automated compliance checking and quality monitoring'
    },
    {
      id: 'healing',
      title: 'Self-Healing',
      icon: Wrench,
      component: SelfHealingSystemInterface,
      description: 'Automated issue detection and system recovery'
    }
  ];

  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setAutomationMetrics(prev => ({
        ...prev,
        completedTasks: prev.completedTasks + Math.floor(Math.random() * 5),
        successRate: Math.min(100, prev.successRate + (Math.random() - 0.5) * 0.1),
        formsProcessed: prev.formsProcessed + Math.floor(Math.random() * 3),
        systemHealth: Math.max(95, prev.systemHealth + (Math.random() - 0.5) * 0.2)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Activity className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold">Advanced Automation</h1>
      </div>

      {/* Automation Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{automationMetrics.totalBots}</div>
            <div className="text-sm text-gray-600">Total Bots</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{automationMetrics.activeBots}</div>
            <div className="text-sm text-gray-600">Active Bots</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{automationMetrics.completedTasks}</div>
            <div className="text-sm text-gray-600">Tasks Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{automationMetrics.successRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-cyan-600">{automationMetrics.automatedReports}</div>
            <div className="text-sm text-gray-600">Auto Reports</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{automationMetrics.formsProcessed}</div>
            <div className="text-sm text-gray-600">Forms Processed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{automationMetrics.qualityScore.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Quality Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{automationMetrics.systemHealth.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">System Health</div>
          </CardContent>
        </Card>
      </div>

      {/* System Status Alert */}
      {automationMetrics.systemHealth < 97 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Automation Performance Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-orange-700">
                <TrendingUp className="h-4 w-4" />
                <span>System health below optimal threshold - Initiating self-healing protocols</span>
              </div>
              <div className="flex items-center gap-2 text-orange-700">
                <CheckCircle className="h-4 w-4" />
                <span>Automated diagnostics in progress</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Automation Feature Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          {automationTabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {automationTabs.map((tab) => {
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
