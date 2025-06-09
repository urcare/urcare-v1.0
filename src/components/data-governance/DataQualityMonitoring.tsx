
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Search,
  Settings,
  Activity,
  Target
} from 'lucide-react';

export const DataQualityMonitoring = () => {
  const [qualityMetrics, setQualityMetrics] = useState([
    {
      dataset: 'Patient Demographics',
      completeness: 98.5,
      accuracy: 96.2,
      consistency: 94.8,
      validity: 97.1,
      overall: 96.7,
      trend: 'up',
      issues: 12,
      lastCheck: '2024-01-22 14:30:00'
    },
    {
      dataset: 'Medical Records',
      completeness: 95.3,
      accuracy: 93.7,
      consistency: 91.2,
      validity: 94.8,
      overall: 93.8,
      trend: 'down',
      issues: 28,
      lastCheck: '2024-01-22 13:45:00'
    },
    {
      dataset: 'Financial Data',
      completeness: 99.1,
      accuracy: 98.3,
      consistency: 97.6,
      validity: 98.9,
      overall: 98.5,
      trend: 'up',
      issues: 3,
      lastCheck: '2024-01-22 12:15:00'
    }
  ]);

  const [qualityRules, setQualityRules] = useState([
    {
      id: 'QR001',
      name: 'Patient Name Validation',
      type: 'Validity',
      rule: 'Name must contain only alphabetic characters',
      dataset: 'Patient Demographics',
      violations: 15,
      status: 'Active'
    },
    {
      id: 'QR002',
      name: 'Date Range Check',
      type: 'Consistency',
      rule: 'Birth date must be before admission date',
      dataset: 'Medical Records',
      violations: 7,
      status: 'Active'
    },
    {
      id: 'QR003',
      name: 'Financial Amount Format',
      type: 'Accuracy',
      rule: 'Currency amounts must have valid format',
      dataset: 'Financial Data',
      violations: 2,
      status: 'Active'
    }
  ]);

  const getQualityColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingUp className="h-4 w-4 text-red-600 transform rotate-180" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Quality Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">92.4%</div>
            <div className="text-sm text-gray-600">Overall Quality Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">847</div>
            <div className="text-sm text-gray-600">Quality Rules</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">156</div>
            <div className="text-sm text-gray-600">Active Issues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">24/7</div>
            <div className="text-sm text-gray-600">Monitoring</div>
          </CardContent>
        </Card>
      </div>

      {/* Data Quality Scorecard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Data Quality Scorecard
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm">
              <Activity className="h-3 w-3 mr-1" />
              Run Quality Check
            </Button>
            <Button size="sm" variant="outline">
              <Settings className="h-3 w-3 mr-1" />
              Configure Rules
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {qualityMetrics.map((metric, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-medium">{metric.dataset}</div>
                    <div className="text-sm text-gray-600">Last checked: {metric.lastCheck}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(metric.trend)}
                    <div className={`text-2xl font-bold ${getQualityColor(metric.overall)}`}>
                      {metric.overall}%
                    </div>
                    <Badge variant="outline" className={metric.issues > 20 ? 'border-red-300 text-red-700' : 'border-green-300 text-green-700'}>
                      {metric.issues} issues
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getQualityColor(metric.completeness)}`}>
                      {metric.completeness}%
                    </div>
                    <div className="text-sm text-gray-600">Completeness</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getQualityColor(metric.accuracy)}`}>
                      {metric.accuracy}%
                    </div>
                    <div className="text-sm text-gray-600">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getQualityColor(metric.consistency)}`}>
                      {metric.consistency}%
                    </div>
                    <div className="text-sm text-gray-600">Consistency</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getQualityColor(metric.validity)}`}>
                      {metric.validity}%
                    </div>
                    <div className="text-sm text-gray-600">Validity</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quality Rules Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Quality Rules & Violations
          </CardTitle>
          <Button size="sm">
            <Settings className="h-3 w-3 mr-1" />
            New Rule
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {qualityRules.map((rule) => (
              <div key={rule.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{rule.name}</div>
                    <div className="text-sm text-gray-600">ID: {rule.id} | Type: {rule.type}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={rule.violations > 10 ? 'border-red-300 text-red-700' : 'border-green-300 text-green-700'}>
                      {rule.violations} violations
                    </Badge>
                    <Badge className="bg-green-100 text-green-800">
                      {rule.status}
                    </Badge>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-sm text-gray-600 mb-1">Rule Definition</div>
                  <div className="bg-gray-50 p-2 rounded text-sm">{rule.rule}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">Dataset: {rule.dataset}</div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Search className="h-3 w-3 mr-1" />
                      View Violations
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit Rule
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quality Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quality Trends & Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="font-medium text-green-800">Improving Datasets</div>
              </div>
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-sm text-green-700">Quality scores trending up</div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div className="font-medium text-yellow-800">Attention Required</div>
              </div>
              <div className="text-2xl font-bold text-yellow-600">5</div>
              <div className="text-sm text-yellow-700">Datasets below threshold</div>
            </div>

            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div className="font-medium text-red-800">Critical Issues</div>
              </div>
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-sm text-red-700">Immediate remediation needed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
