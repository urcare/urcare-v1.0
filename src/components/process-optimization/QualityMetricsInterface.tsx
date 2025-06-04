
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  TrendingUp, 
  Star, 
  Award,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface QualityMetric {
  id: string;
  metricName: string;
  category: string;
  currentValue: number;
  targetValue: number;
  benchmarkValue: number;
  trend: 'improving' | 'declining' | 'stable';
  performanceLevel: 'excellent' | 'good' | 'needs_improvement' | 'critical';
  unit: string;
  improvementSuggestions: string[];
  lastUpdated: string;
}

const mockMetrics: QualityMetric[] = [
  {
    id: 'QM001',
    metricName: 'Patient Satisfaction Score',
    category: 'Patient Experience',
    currentValue: 4.2,
    targetValue: 4.5,
    benchmarkValue: 4.3,
    trend: 'improving',
    performanceLevel: 'good',
    unit: '/5.0',
    improvementSuggestions: [
      'Reduce waiting times in emergency department',
      'Improve communication training for staff',
      'Enhance discharge process efficiency'
    ],
    lastUpdated: '2024-01-22'
  },
  {
    id: 'QM002',
    metricName: 'Readmission Rate',
    category: 'Clinical Quality',
    currentValue: 8.5,
    targetValue: 6.0,
    benchmarkValue: 7.2,
    trend: 'stable',
    performanceLevel: 'needs_improvement',
    unit: '%',
    improvementSuggestions: [
      'Enhance discharge planning process',
      'Implement better follow-up protocols',
      'Improve medication reconciliation'
    ],
    lastUpdated: '2024-01-22'
  },
  {
    id: 'QM003',
    metricName: 'Infection Rate',
    category: 'Safety',
    currentValue: 2.1,
    targetValue: 1.5,
    benchmarkValue: 2.8,
    trend: 'improving',
    performanceLevel: 'good',
    unit: '%',
    improvementSuggestions: [
      'Strengthen hand hygiene compliance',
      'Enhance environmental cleaning protocols',
      'Improve isolation procedures'
    ],
    lastUpdated: '2024-01-22'
  },
  {
    id: 'QM004',
    metricName: 'Medication Error Rate',
    category: 'Safety',
    currentValue: 0.8,
    targetValue: 0.5,
    benchmarkValue: 1.2,
    trend: 'declining',
    performanceLevel: 'needs_improvement',
    unit: '%',
    improvementSuggestions: [
      'Implement barcode medication administration',
      'Enhance pharmacist clinical review',
      'Improve medication reconciliation at transitions'
    ],
    lastUpdated: '2024-01-22'
  }
];

export const QualityMetricsInterface = () => {
  const [metrics] = useState<QualityMetric[]>(mockMetrics);
  const [selectedMetric, setSelectedMetric] = useState<QualityMetric | null>(null);

  const getPerformanceColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'bg-green-500 text-white';
      case 'good': return 'bg-blue-500 text-white';
      case 'needs_improvement': return 'bg-yellow-500 text-white';
      case 'critical': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return ArrowUp;
      case 'declining': return ArrowDown;
      case 'stable': return BarChart3;
      default: return BarChart3;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'declining': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getProgressValue = (metric: QualityMetric) => {
    if (metric.metricName.includes('Rate') && metric.unit === '%') {
      // For rates, lower is better
      return Math.max(0, 100 - (metric.currentValue / metric.targetValue) * 100);
    } else {
      // For scores, higher is better
      return (metric.currentValue / metric.targetValue) * 100;
    }
  };

  const getBenchmarkComparison = (current: number, benchmark: number, unit: string) => {
    const diff = current - benchmark;
    const isRate = unit === '%' && current < 10; // Assume it's a rate if it's a percentage and small
    
    if (isRate) {
      // For rates, lower is better
      if (diff < 0) return { text: `${Math.abs(diff).toFixed(1)}${unit} below benchmark`, color: 'text-green-600' };
      if (diff > 0) return { text: `${diff.toFixed(1)}${unit} above benchmark`, color: 'text-red-600' };
    } else {
      // For scores, higher is better
      if (diff > 0) return { text: `${diff.toFixed(1)}${unit} above benchmark`, color: 'text-green-600' };
      if (diff < 0) return { text: `${Math.abs(diff).toFixed(1)}${unit} below benchmark`, color: 'text-red-600' };
    }
    return { text: 'At benchmark', color: 'text-gray-600' };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Quality Metrics & Improvement Interface
          </CardTitle>
          <CardDescription>
            Performance tracking with benchmark comparison and improvement analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <Award className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {metrics.filter(m => m.performanceLevel === 'excellent' || m.performanceLevel === 'good').length}
                    </p>
                    <p className="text-sm text-gray-600">Good Performance</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-yellow-200 bg-yellow-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {metrics.filter(m => m.performanceLevel === 'needs_improvement').length}
                    </p>
                    <p className="text-sm text-gray-600">Needs Improvement</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {metrics.filter(m => m.trend === 'improving').length}
                    </p>
                    <p className="text-sm text-gray-600">Improving Trends</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Star className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">82%</p>
                    <p className="text-sm text-gray-600">Overall Score</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quality Metrics Overview</h3>
              {metrics.map((metric) => {
                const TrendIcon = getTrendIcon(metric.trend);
                const benchmarkComparison = getBenchmarkComparison(metric.currentValue, metric.benchmarkValue, metric.unit);
                
                return (
                  <Card 
                    key={metric.id} 
                    className={`cursor-pointer transition-colors ${selectedMetric?.id === metric.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-purple-400`}
                    onClick={() => setSelectedMetric(metric)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold mb-1">{metric.metricName}</h4>
                          <p className="text-sm text-gray-600 mb-1">{metric.category}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-blue-600">
                              {metric.currentValue}{metric.unit}
                            </span>
                            <span className="text-sm text-gray-500">
                              / {metric.targetValue}{metric.unit} target
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge className={getPerformanceColor(metric.performanceLevel)}>
                            {metric.performanceLevel.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <div className={`flex items-center gap-1 ${getTrendColor(metric.trend)}`}>
                            <TrendIcon className="h-4 w-4" />
                            <span className="text-xs capitalize">{metric.trend}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress to Target</span>
                          <span className="font-bold">{Math.round(getProgressValue(metric))}%</span>
                        </div>
                        <Progress value={getProgressValue(metric)} className="h-2" />
                        
                        <div className="flex justify-between items-center mt-3 text-sm">
                          <div className={`flex items-center gap-1 ${benchmarkComparison.color}`}>
                            <BarChart3 className="h-3 w-3" />
                            <span>{benchmarkComparison.text}</span>
                          </div>
                          <div className="text-gray-500">
                            Updated: {metric.lastUpdated}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div>
              {selectedMetric ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedMetric.metricName}</CardTitle>
                    <CardDescription>{selectedMetric.category} • Updated {selectedMetric.lastUpdated}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Performance Metrics</h4>
                          <div className="space-y-1 text-sm">
                            <p>Current: <strong>{selectedMetric.currentValue}{selectedMetric.unit}</strong></p>
                            <p>Target: <strong>{selectedMetric.targetValue}{selectedMetric.unit}</strong></p>
                            <p>Benchmark: <strong>{selectedMetric.benchmarkValue}{selectedMetric.unit}</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Status</h4>
                          <div className="space-y-1 text-sm">
                            <p>Level: <strong>{selectedMetric.performanceLevel.replace('_', ' ')}</strong></p>
                            <p>Trend: <strong className={getTrendColor(selectedMetric.trend)}>
                              {selectedMetric.trend}
                            </strong></p>
                            <p>Progress: <strong>{Math.round(getProgressValue(selectedMetric))}%</strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Performance vs Target</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Target Achievement</span>
                            <span className="font-bold">{Math.round(getProgressValue(selectedMetric))}%</span>
                          </div>
                          <Progress value={getProgressValue(selectedMetric)} className="h-2" />
                          <div className="text-xs text-gray-500">
                            {getProgressValue(selectedMetric) >= 100 
                              ? 'Target achieved!' 
                              : `${(100 - getProgressValue(selectedMetric)).toFixed(1)}% gap to target`}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Benchmark Comparison</h4>
                        <div className="text-sm bg-blue-50 p-3 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <span>Industry Benchmark</span>
                            <span className="font-bold">{selectedMetric.benchmarkValue}{selectedMetric.unit}</span>
                          </div>
                          <div className={`font-medium ${getBenchmarkComparison(selectedMetric.currentValue, selectedMetric.benchmarkValue, selectedMetric.unit).color}`}>
                            {getBenchmarkComparison(selectedMetric.currentValue, selectedMetric.benchmarkValue, selectedMetric.unit).text}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Improvement Suggestions</h4>
                        <div className="space-y-2">
                          {selectedMetric.improvementSuggestions.map((suggestion, index) => (
                            <div key={index} className="text-sm bg-green-50 p-2 rounded">
                              <div className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-green-700">{suggestion}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Action Plan Priority</h4>
                        <div className="space-y-2">
                          {selectedMetric.performanceLevel === 'critical' && (
                            <div className="text-sm bg-red-50 p-2 rounded">
                              <p className="font-medium text-red-800">Immediate Action Required</p>
                              <p className="text-red-700">Critical performance level requires urgent intervention</p>
                            </div>
                          )}
                          {selectedMetric.performanceLevel === 'needs_improvement' && (
                            <div className="text-sm bg-yellow-50 p-2 rounded">
                              <p className="font-medium text-yellow-800">Improvement Plan Needed</p>
                              <p className="text-yellow-700">Develop systematic approach to reach target performance</p>
                            </div>
                          )}
                          {(selectedMetric.performanceLevel === 'good' || selectedMetric.performanceLevel === 'excellent') && (
                            <div className="text-sm bg-green-50 p-2 rounded">
                              <p className="font-medium text-green-800">Maintain Excellence</p>
                              <p className="text-green-700">Continue current practices and monitor for sustained performance</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <Target className="h-4 w-4 mr-1" />
                          Create Action Plan
                        </Button>
                        <Button variant="outline">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          View Trends
                        </Button>
                        <Button variant="outline">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Compare Benchmarks
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a quality metric to view detailed performance analysis and improvement recommendations</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
