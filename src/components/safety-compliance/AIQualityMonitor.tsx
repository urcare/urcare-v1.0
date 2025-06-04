
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  TrendingDown, 
  TrendingUp,
  Activity,
  Search,
  Eye,
  FileText,
  BarChart3,
  Settings,
  RotateCcw
} from 'lucide-react';

interface AISystem {
  id: string;
  name: string;
  type: 'clinical_prediction' | 'diagnostic_support' | 'treatment_recommendation' | 'workflow_automation' | 'patient_engagement';
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  driftScore: number;
  confidenceThreshold: number;
  lastValidation: string;
  monthlyPredictions: number;
  status: 'optimal' | 'degraded' | 'at_risk' | 'needs_retraining';
  validationFrequency: string;
  dataLastUpdated: string;
}

interface ModelDrift {
  id: string;
  systemId: string;
  systemName: string;
  featureName: string;
  metricType: 'data_drift' | 'concept_drift' | 'performance_drift' | 'bias_drift';
  driftScore: number;
  driftThreshold: number;
  detectedAt: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  recommendedAction: string;
  status: 'detected' | 'investigating' | 'mitigated' | 'scheduled';
}

interface ValidationMetric {
  id: string;
  systemId: string;
  metricName: string;
  currentValue: number;
  previousValue: number;
  threshold: number;
  trend: 'improving' | 'stable' | 'declining';
  lastUpdated: string;
}

const mockSystems: AISystem[] = [
  {
    id: 'AI001',
    name: 'Clinical Risk Predictor',
    type: 'clinical_prediction',
    accuracy: 92.5,
    precision: 94.2,
    recall: 89.8,
    f1Score: 91.9,
    driftScore: 5.2,
    confidenceThreshold: 80,
    lastValidation: '2024-01-15',
    monthlyPredictions: 125000,
    status: 'optimal',
    validationFrequency: 'Weekly',
    dataLastUpdated: '2024-01-19'
  },
  {
    id: 'AI002',
    name: 'Diagnostic Image Analyzer',
    type: 'diagnostic_support',
    accuracy: 89.6,
    precision: 92.1,
    recall: 88.4,
    f1Score: 90.2,
    driftScore: 12.6,
    confidenceThreshold: 85,
    lastValidation: '2024-01-12',
    monthlyPredictions: 78000,
    status: 'degraded',
    validationFrequency: 'Daily',
    dataLastUpdated: '2024-01-20'
  },
  {
    id: 'AI003',
    name: 'Treatment Recommendation Engine',
    type: 'treatment_recommendation',
    accuracy: 87.2,
    precision: 89.5,
    recall: 86.9,
    f1Score: 88.1,
    driftScore: 18.9,
    confidenceThreshold: 90,
    lastValidation: '2024-01-10',
    monthlyPredictions: 45000,
    status: 'at_risk',
    validationFrequency: 'Bi-weekly',
    dataLastUpdated: '2024-01-18'
  },
  {
    id: 'AI004',
    name: 'Workflow Prioritizer',
    type: 'workflow_automation',
    accuracy: 95.3,
    precision: 96.5,
    recall: 94.8,
    f1Score: 95.6,
    driftScore: 2.1,
    confidenceThreshold: 70,
    lastValidation: '2024-01-18',
    monthlyPredictions: 230000,
    status: 'optimal',
    validationFrequency: 'Weekly',
    dataLastUpdated: '2024-01-20'
  }
];

const mockDrifts: ModelDrift[] = [
  {
    id: 'MD001',
    systemId: 'AI002',
    systemName: 'Diagnostic Image Analyzer',
    featureName: 'Image Contrast Distribution',
    metricType: 'data_drift',
    driftScore: 12.6,
    driftThreshold: 10.0,
    detectedAt: '2024-01-19 14:30',
    impact: 'medium',
    recommendedAction: 'Update feature preprocessing and recalibrate model',
    status: 'investigating'
  },
  {
    id: 'MD002',
    systemId: 'AI003',
    systemName: 'Treatment Recommendation Engine',
    featureName: 'Diagnosis-Treatment Correlation',
    metricType: 'concept_drift',
    driftScore: 18.9,
    driftThreshold: 15.0,
    detectedAt: '2024-01-18 10:15',
    impact: 'high',
    recommendedAction: 'Retrain model with updated clinical guidelines',
    status: 'scheduled'
  },
  {
    id: 'MD003',
    systemId: 'AI003',
    systemName: 'Treatment Recommendation Engine',
    featureName: 'Patient Age Distribution',
    metricType: 'data_drift',
    driftScore: 9.2,
    driftThreshold: 10.0,
    detectedAt: '2024-01-17 16:45',
    impact: 'low',
    recommendedAction: 'Monitor closely',
    status: 'detected'
  }
];

const mockValidationMetrics: ValidationMetric[] = [
  {
    id: 'VM001',
    systemId: 'AI002',
    metricName: 'Precision',
    currentValue: 92.1,
    previousValue: 94.5,
    threshold: 90.0,
    trend: 'declining',
    lastUpdated: '2024-01-12'
  },
  {
    id: 'VM002',
    systemId: 'AI002',
    metricName: 'Recall',
    currentValue: 88.4,
    previousValue: 87.2,
    threshold: 85.0,
    trend: 'improving',
    lastUpdated: '2024-01-12'
  },
  {
    id: 'VM003',
    systemId: 'AI003',
    metricName: 'F1 Score',
    currentValue: 88.1,
    previousValue: 91.4,
    threshold: 87.0,
    trend: 'declining',
    lastUpdated: '2024-01-10'
  }
];

export const AIQualityMonitor = () => {
  const [systems] = useState<AISystem[]>(mockSystems);
  const [drifts] = useState<ModelDrift[]>(mockDrifts);
  const [metrics] = useState<ValidationMetric[]>(mockValidationMetrics);
  const [selectedSystem, setSelectedSystem] = useState<AISystem | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-green-600 bg-green-100';
      case 'degraded': return 'text-yellow-600 bg-yellow-100';
      case 'at_risk': return 'text-orange-600 bg-orange-100';
      case 'needs_retraining': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDriftImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return 'bg-blue-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'critical': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getDriftStatusColor = (status: string) => {
    switch (status) {
      case 'detected': return 'bg-blue-500 text-white';
      case 'investigating': return 'bg-yellow-500 text-white';
      case 'scheduled': return 'bg-purple-500 text-white';
      case 'mitigated': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'stable': return <Activity className="h-4 w-4 text-blue-600" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatLargeNumber = (num: number) => {
    return num >= 1000 ? `${(num / 1000).toFixed(0)}k` : num;
  };

  const getDriftColor = (score: number, threshold: number) => {
    if (score >= threshold * 1.5) return 'text-red-600';
    if (score >= threshold) return 'text-orange-600';
    if (score >= threshold * 0.8) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getSystemMetrics = (systemId: string) => {
    return metrics.filter(m => m.systemId === systemId);
  };

  const getSystemDrifts = (systemId: string) => {
    return drifts.filter(d => d.systemId === systemId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Quality Monitor
          </CardTitle>
          <CardDescription>
            Comprehensive output validation, drift detection, and performance maintenance tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-purple-200 bg-purple-50">
              <div className="flex items-center gap-2">
                <Brain className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-600">{systems.length}</p>
                  <p className="text-sm text-gray-600">AI Systems</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-orange-200 bg-orange-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-600">
                    {drifts.filter(d => d.status !== 'mitigated').length}
                  </p>
                  <p className="text-sm text-gray-600">Detected Drifts</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatLargeNumber(systems.reduce((sum, system) => sum + system.monthlyPredictions, 0))}
                  </p>
                  <p className="text-sm text-gray-600">Monthly Predictions</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(systems.reduce((sum, system) => sum + system.accuracy, 0) / systems.length)}%
                  </p>
                  <p className="text-sm text-gray-600">Average Accuracy</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">AI Systems</h3>
              {systems.map((system) => (
                <Card 
                  key={system.id} 
                  className={`cursor-pointer transition-colors ${selectedSystem?.id === system.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-purple-400`}
                  onClick={() => setSelectedSystem(system)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold mb-1">{system.name}</h4>
                        <p className="text-sm text-gray-600 mb-1">
                          {system.type.replace('_', ' ')}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{formatLargeNumber(system.monthlyPredictions)} predictions/month</span>
                          <span className="text-gray-400">•</span>
                          <span>Last validated: {system.lastValidation}</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(system.status)}>
                        {system.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Accuracy</span>
                        <span className="font-bold">{system.accuracy}%</span>
                      </div>
                      <Progress value={system.accuracy} className="h-2" />
                      
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-gray-600">Precision</p>
                          <p className="font-semibold">{system.precision}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Recall</p>
                          <p className="font-semibold">{system.recall}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">F1 Score</p>
                          <p className="font-semibold">{system.f1Score}%</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Drift Score</span>
                        <span className={`font-bold ${system.driftScore > 10 ? 'text-orange-600' : 'text-green-600'}`}>
                          {system.driftScore}%
                        </span>
                      </div>
                      <Progress 
                        value={system.driftScore} 
                        max={25} 
                        className={`h-2 ${system.driftScore > 10 ? 'bg-orange-100' : 'bg-green-100'}`} 
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedSystem ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedSystem.name} - Quality Analysis</CardTitle>
                    <CardDescription>Comprehensive performance monitoring and drift detection</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">System Information</h4>
                          <div className="space-y-1 text-sm">
                            <p>Type: <strong>{selectedSystem.type.replace('_', ' ')}</strong></p>
                            <p>Status: <strong className={
                              selectedSystem.status === 'at_risk' || selectedSystem.status === 'needs_retraining' 
                                ? 'text-red-600' : selectedSystem.status === 'degraded' 
                                ? 'text-yellow-600' : 'text-green-600'
                            }>
                              {selectedSystem.status.replace('_', ' ')}
                            </strong></p>
                            <p>Last Validation: <strong>{selectedSystem.lastValidation}</strong></p>
                            <p>Data Updated: <strong>{selectedSystem.dataLastUpdated}</strong></p>
                            <p>Confidence Threshold: <strong>{selectedSystem.confidenceThreshold}%</strong></p>
                            <p>Validation Frequency: <strong>{selectedSystem.validationFrequency}</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Performance Metrics</h4>
                          <div className="space-y-1 text-sm">
                            <p>Accuracy: <strong>{selectedSystem.accuracy}%</strong></p>
                            <p>Precision: <strong>{selectedSystem.precision}%</strong></p>
                            <p>Recall: <strong>{selectedSystem.recall}%</strong></p>
                            <p>F1 Score: <strong>{selectedSystem.f1Score}%</strong></p>
                            <p>Drift Score: <strong className={selectedSystem.driftScore > 10 ? 'text-orange-600' : 'text-green-600'}>
                              {selectedSystem.driftScore}%
                            </strong></p>
                            <p>Monthly Predictions: <strong>{selectedSystem.monthlyPredictions.toLocaleString()}</strong></p>
                          </div>
                        </div>
                      </div>
                      
                      {getSystemDrifts(selectedSystem.id).length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Detected Drifts</h4>
                          <div className="space-y-2">
                            {getSystemDrifts(selectedSystem.id).map((drift) => (
                              <div key={drift.id} className="text-sm bg-orange-50 p-3 rounded">
                                <div className="flex justify-between items-start mb-1">
                                  <div className="flex items-start gap-2">
                                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <p className="font-medium">{drift.featureName}</p>
                                      <p className="text-gray-600 text-xs">Type: {drift.metricType.replace('_', ' ')}</p>
                                    </div>
                                  </div>
                                  <div className="flex gap-1">
                                    <Badge className={getDriftImpactColor(drift.impact)}>
                                      {drift.impact}
                                    </Badge>
                                    <Badge className={getDriftStatusColor(drift.status)}>
                                      {drift.status}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <div className="flex items-center justify-between text-xs mb-1">
                                    <span>Drift Score</span>
                                    <span className={`font-bold ${getDriftColor(drift.driftScore, drift.driftThreshold)}`}>
                                      {drift.driftScore}% (threshold: {drift.driftThreshold}%)
                                    </span>
                                  </div>
                                  <Progress 
                                    value={drift.driftScore} 
                                    max={Math.max(drift.driftThreshold * 2, drift.driftScore + 5)} 
                                    className="h-1.5" 
                                  />
                                </div>
                                <p className="mt-2 text-xs text-orange-700">
                                  Recommendation: {drift.recommendedAction}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {getSystemMetrics(selectedSystem.id).length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Validation Metrics</h4>
                          <div className="space-y-2">
                            {getSystemMetrics(selectedSystem.id).map((metric) => (
                              <div key={metric.id} className="text-sm bg-blue-50 p-3 rounded">
                                <div className="flex justify-between items-center mb-2">
                                  <p className="font-medium">{metric.metricName}</p>
                                  <div className="flex items-center gap-1">
                                    {getTrendIcon(metric.trend)}
                                    <span className={metric.trend === 'declining' ? 'text-red-600' : 
                                      metric.trend === 'improving' ? 'text-green-600' : 'text-blue-600'}>
                                      {metric.trend}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span>Current: <strong>{metric.currentValue}%</strong></span>
                                  <span>Previous: <strong>{metric.previousValue}%</strong></span>
                                  <span>Threshold: <strong>{metric.threshold}%</strong></span>
                                </div>
                                <Progress 
                                  value={metric.currentValue} 
                                  className={`h-1.5 ${
                                    metric.currentValue < metric.threshold ? 'bg-red-100' : 'bg-blue-100'
                                  }`} 
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        {selectedSystem.status === 'at_risk' || selectedSystem.status === 'needs_retraining' ? (
                          <Button>
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Retrain Model
                          </Button>
                        ) : (
                          <Button>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Validate Model
                          </Button>
                        )}
                        <Button variant="outline">
                          <Settings className="h-4 w-4 mr-1" />
                          Configure Thresholds
                        </Button>
                        <Button variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Predictions
                        </Button>
                        <Button variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Generate Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Select an AI system to view detailed quality metrics and drift analysis</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Model Drift Analysis</CardTitle>
              <CardDescription>Comprehensive drift detection and quality maintenance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {drifts.map((drift) => (
                  <div key={drift.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{drift.systemName}</h4>
                        <p className="text-sm">{drift.featureName} - {drift.metricType.replace('_', ' ')}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getDriftImpactColor(drift.impact)}>
                          {drift.impact}
                        </Badge>
                        <Badge className={getDriftStatusColor(drift.status)}>
                          {drift.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Drift Score</span>
                        <span className={`font-bold ${getDriftColor(drift.driftScore, drift.driftThreshold)}`}>
                          {drift.driftScore}% (threshold: {drift.driftThreshold}%)
                        </span>
                      </div>
                      <Progress 
                        value={drift.driftScore} 
                        max={Math.max(drift.driftThreshold * 2, drift.driftScore + 5)} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div className="text-sm mb-3">
                      <p className="text-gray-600">Detected: <strong>{drift.detectedAt}</strong></p>
                      <p className="text-gray-600 mt-1">Recommendation: <strong>{drift.recommendedAction}</strong></p>
                    </div>
                    
                    <div className="flex gap-2">
                      {drift.status === 'detected' && (
                        <Button size="sm">Investigate</Button>
                      )}
                      {drift.status === 'investigating' && (
                        <Button size="sm">Schedule Fix</Button>
                      )}
                      {drift.status === 'scheduled' && (
                        <Button size="sm">Implement</Button>
                      )}
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
