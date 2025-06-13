
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Code,
  AlertTriangle,
  CheckCircle,
  FileText
} from 'lucide-react';

export const CodeQualityDashboard = () => {
  const [selectedMetric, setSelectedMetric] = useState('overview');

  const qualityMetrics = {
    overall: 8.2,
    maintainability: 7.8,
    reliability: 8.9,
    security: 9.1,
    coverage: 87.5,
    duplication: 3.2,
    complexity: 4.7,
    techDebt: 2.1
  };

  const codeAnalysis = [
    {
      file: 'src/components/patient/PatientDashboard.tsx',
      complexity: 15,
      lines: 342,
      issues: 3,
      coverage: 89.2,
      maintainability: 'A',
      lastAnalyzed: '2024-06-13 09:30'
    },
    {
      file: 'src/utils/calculations.ts',
      complexity: 28,
      lines: 156,
      issues: 7,
      coverage: 76.4,
      maintainability: 'C',
      lastAnalyzed: '2024-06-13 09:25'
    },
    {
      file: 'src/components/billing/BillingSystem.tsx',
      complexity: 12,
      lines: 298,
      issues: 2,
      coverage: 94.1,
      maintainability: 'A',
      lastAnalyzed: '2024-06-13 09:20'
    },
    {
      file: 'src/services/apiClient.ts',
      complexity: 22,
      lines: 187,
      issues: 5,
      coverage: 82.3,
      maintainability: 'B',
      lastAnalyzed: '2024-06-13 09:15'
    }
  ];

  const qualityGates = [
    {
      name: 'Code Coverage',
      current: 87.5,
      threshold: 80,
      status: 'passed',
      trend: 'up'
    },
    {
      name: 'Duplicate Code',
      current: 3.2,
      threshold: 5,
      status: 'passed',
      trend: 'down'
    },
    {
      name: 'Complexity Score',
      current: 4.7,
      threshold: 10,
      status: 'passed',
      trend: 'stable'
    },
    {
      name: 'Technical Debt',
      current: 2.1,
      threshold: 5,
      status: 'passed',
      trend: 'down'
    }
  ];

  const getMaintainabilityColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-orange-100 text-orange-800';
      case 'E': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-600" />;
      default: return <div className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Code Quality Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{qualityMetrics.overall}</div>
              <div className="text-sm text-gray-600">Overall Quality</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{qualityMetrics.coverage}%</div>
              <div className="text-sm text-gray-600">Test Coverage</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{qualityMetrics.duplication}%</div>
              <div className="text-sm text-gray-600">Code Duplication</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{qualityMetrics.techDebt}d</div>
              <div className="text-sm text-gray-600">Tech Debt (days)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quality Metrics Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Maintainability</span>
                <span className="text-sm font-bold text-blue-600">{qualityMetrics.maintainability}</span>
              </div>
              <Progress value={qualityMetrics.maintainability * 10} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Reliability</span>
                <span className="text-sm font-bold text-green-600">{qualityMetrics.reliability}</span>
              </div>
              <Progress value={qualityMetrics.reliability * 10} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Security</span>
                <span className="text-sm font-bold text-purple-600">{qualityMetrics.security}</span>
              </div>
              <Progress value={qualityMetrics.security * 10} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Complexity</span>
                <span className="text-sm font-bold text-orange-600">{qualityMetrics.complexity}</span>
              </div>
              <Progress value={qualityMetrics.complexity * 10} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality Gates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {qualityGates.map((gate, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-sm">{gate.name}</div>
                      <div className="text-xs text-gray-600">
                        Threshold: {gate.threshold}{gate.name.includes('Coverage') ? '%' : ''}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-sm font-bold">
                        {gate.current}{gate.name.includes('Coverage') ? '%' : ''}
                      </div>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(gate.trend)}
                        <span className="text-xs">{gate.trend}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(gate.status)}>
                      {gate.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            File-Level Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {codeAnalysis.map((file, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-sm">{file.file}</span>
                  </div>
                  <Badge className={getMaintainabilityColor(file.maintainability)}>
                    Grade {file.maintainability}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Complexity</div>
                    <div className={`${file.complexity > 20 ? 'text-red-600' : file.complexity > 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {file.complexity}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Lines</div>
                    <div className="text-gray-600">{file.lines}</div>
                  </div>
                  <div>
                    <div className="font-medium">Issues</div>
                    <div className={`${file.issues > 5 ? 'text-red-600' : file.issues > 2 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {file.issues}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Coverage</div>
                    <div className={`${file.coverage < 80 ? 'text-red-600' : file.coverage < 90 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {file.coverage}%
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                  <span>Last analyzed: {file.lastAnalyzed}</span>
                  <Button size="sm" variant="ghost" className="h-6 px-2">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
