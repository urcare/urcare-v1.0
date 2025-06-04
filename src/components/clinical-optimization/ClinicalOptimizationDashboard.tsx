
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CostInterventionDashboard } from './CostInterventionDashboard';
import { GenericSubstitutionInterface } from './GenericSubstitutionInterface';
import { OutcomeForecastingPanel } from './OutcomeForecastingPanel';
import { CaseComplexityScorer } from './CaseComplexityScorer';
import { ConsentRiskAnalyzer } from './ConsentRiskAnalyzer';
import { AIDecisionAuditSystem } from './AIDecisionAuditSystem';
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  AlertTriangle, 
  Shield, 
  Search,
  BarChart3,
  Pill,
  Users,
  FileText
} from 'lucide-react';

export const ClinicalOptimizationDashboard = () => {
  const [activeTab, setActiveTab] = useState('cost-intervention');

  const optimizationStats = [
    { label: 'Cost Savings', value: '$2.4M', icon: DollarSign, color: 'green' },
    { label: 'Resource Efficiency', value: '89%', icon: BarChart3, color: 'blue' },
    { label: 'Outcome Accuracy', value: '94.2%', icon: Target, color: 'purple' },
    { label: 'Risk Reduction', value: '23%', icon: Shield, color: 'orange' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Clinical Optimization AI</h1>
                <p className="text-sm text-gray-600">Resource and outcome enhancement with intelligent optimization</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {optimizationStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 w-full mb-6">
            <TabsTrigger value="cost-intervention" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Cost</span>
            </TabsTrigger>
            <TabsTrigger value="generic-substitution" className="flex items-center gap-2">
              <Pill className="w-4 h-4" />
              <span className="hidden sm:inline">Generic</span>
            </TabsTrigger>
            <TabsTrigger value="outcome-forecasting" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Outcomes</span>
            </TabsTrigger>
            <TabsTrigger value="case-complexity" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Complexity</span>
            </TabsTrigger>
            <TabsTrigger value="consent-risk" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Risk</span>
            </TabsTrigger>
            <TabsTrigger value="ai-audit" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Audit</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cost-intervention" className="space-y-6">
            <CostInterventionDashboard />
          </TabsContent>

          <TabsContent value="generic-substitution" className="space-y-6">
            <GenericSubstitutionInterface />
          </TabsContent>

          <TabsContent value="outcome-forecasting" className="space-y-6">
            <OutcomeForecastingPanel />
          </TabsContent>

          <TabsContent value="case-complexity" className="space-y-6">
            <CaseComplexityScorer />
          </TabsContent>

          <TabsContent value="consent-risk" className="space-y-6">
            <ConsentRiskAnalyzer />
          </TabsContent>

          <TabsContent value="ai-audit" className="space-y-6">
            <AIDecisionAuditSystem />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
