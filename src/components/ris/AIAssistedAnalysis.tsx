
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap,
  Eye,
  Settings,
  Download,
  RefreshCw,
  X
} from 'lucide-react';

export const AIAssistedAnalysis = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState('pneumonia');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const availableAlgorithms = [
    {
      id: 'pneumonia',
      name: 'Pneumonia Detection',
      modality: 'Chest X-Ray',
      accuracy: 94.5,
      processingTime: '2-3 seconds',
      description: 'AI algorithm for detecting pneumonia in chest radiographs'
    },
    {
      id: 'fracture',
      name: 'Fracture Detection',
      modality: 'Orthopedic X-Ray',
      accuracy: 91.2,
      processingTime: '3-5 seconds',
      description: 'Detection of bone fractures in extremity radiographs'
    },
    {
      id: 'stroke',
      name: 'Acute Stroke Detection',
      modality: 'Head CT',
      accuracy: 89.8,
      processingTime: '5-8 seconds',
      description: 'Large vessel occlusion and hemorrhage detection in head CT'
    },
    {
      id: 'nodule',
      name: 'Lung Nodule Analysis',
      modality: 'Chest CT',
      accuracy: 92.1,
      processingTime: '10-15 seconds',
      description: 'Detection and characterization of pulmonary nodules'
    }
  ];

  const analysisResults = [
    {
      id: 'result1',
      finding: 'Possible Right Lower Lobe Consolidation',
      confidence: 87.3,
      location: 'Right lung base',
      severity: 'Moderate',
      recommendation: 'Consider antibiotic therapy, follow-up in 48 hours',
      overridden: false
    },
    {
      id: 'result2',
      finding: 'Cardiac Silhouette Normal',
      confidence: 95.1,
      location: 'Mediastinum',
      severity: 'Normal',
      recommendation: 'No further cardiac evaluation needed',
      overridden: false
    },
    {
      id: 'result3',
      finding: 'Mild Pleural Thickening',
      confidence: 73.8,
      location: 'Left costophrenic angle',
      severity: 'Mild',
      recommendation: 'Consider prior imaging comparison',
      overridden: true
    }
  ];

  const performanceMetrics = {
    totalAnalyses: 1247,
    todayAnalyses: 89,
    accuracy: 92.4,
    avgProcessingTime: 4.2,
    overrideRate: 12.3,
    criticalFindings: 15
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">AI-Assisted Analysis</h3>
          <p className="text-gray-600">Intelligent image analysis with radiologist oversight</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Algorithm Settings
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Results
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Algorithm Selection */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Available Algorithms</CardTitle>
              <CardDescription className="text-xs">Select AI analysis algorithms</CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                {availableAlgorithms.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                      selectedAnalysis === algorithm.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedAnalysis(algorithm.id)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Brain className="h-4 w-4 text-blue-600" />
                      <Badge variant="outline" className="text-xs">
                        {algorithm.modality}
                      </Badge>
                    </div>
                    <h5 className="font-medium text-sm text-gray-900">{algorithm.name}</h5>
                    <p className="text-xs text-gray-600 mb-2">{algorithm.description}</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-600">Accuracy: {algorithm.accuracy}%</span>
                      <span className="text-gray-500">{algorithm.processingTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{performanceMetrics.totalAnalyses}</p>
                <p className="text-xs text-gray-600">Total Analyses</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Today's Analyses</span>
                  <span className="font-medium">{performanceMetrics.todayAnalyses}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Overall Accuracy</span>
                  <span className="font-medium text-green-600">{performanceMetrics.accuracy}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Avg Processing</span>
                  <span className="font-medium">{performanceMetrics.avgProcessingTime}s</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Override Rate</span>
                  <span className="font-medium text-orange-600">{performanceMetrics.overrideRate}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Critical Findings</span>
                  <span className="font-medium text-red-600">{performanceMetrics.criticalFindings}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Results */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Analysis Results</CardTitle>
                  <CardDescription>AI findings with confidence scoring</CardDescription>
                </div>
                <Button
                  onClick={runAnalysis}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Run Analysis
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isAnalyzing ? (
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-blue-600 animate-pulse" />
                    <p className="text-lg font-medium text-gray-900">AI Analysis in Progress</p>
                    <p className="text-gray-600">Processing medical images...</p>
                  </div>
                  <Progress value={75} className="w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {analysisResults.map((result, index) => (
                    <div key={index} className={`border rounded-lg p-4 ${
                      result.overridden ? 'border-orange-200 bg-orange-50' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {result.severity === 'Normal' ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : result.confidence > 85 ? (
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-yellow-600" />
                          )}
                          <h4 className="font-medium text-gray-900">{result.finding}</h4>
                          {result.overridden && (
                            <Badge variant="outline" className="border-orange-500 text-orange-700">
                              Overridden
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Location: {result.location}</p>
                          <p className="text-sm text-gray-600">Severity: {result.severity}</p>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Confidence Score</span>
                              <span className={`font-medium ${
                                result.confidence > 90 ? 'text-green-600' :
                                result.confidence > 70 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {result.confidence}%
                              </span>
                            </div>
                            <Progress 
                              value={result.confidence} 
                              className={`w-full h-2 ${
                                result.confidence > 90 ? 'bg-green-100' :
                                result.confidence > 70 ? 'bg-yellow-100' : 'bg-red-100'
                              }`}
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">AI Recommendation:</p>
                          <p className="text-sm text-gray-700">{result.recommendation}</p>
                          <div className="mt-2 flex gap-2">
                            <Button size="sm" variant="outline" className="text-xs">
                              Accept
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs">
                              Override
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs">
                              Modify
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Algorithm Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Algorithm Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded">
                  <Brain className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm font-medium">Deep Learning Model</p>
                  <p className="text-xs text-gray-600">CNN Architecture</p>
                </div>
                <div className="text-center p-4 border rounded">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="text-sm font-medium">Real-time Analysis</p>
                  <p className="text-xs text-gray-600">Sub-second processing</p>
                </div>
                <div className="text-center p-4 border rounded">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-sm font-medium">FDA Approved</p>
                  <p className="text-xs text-gray-600">Clinical validation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
