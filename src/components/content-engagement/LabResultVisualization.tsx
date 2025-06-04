
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Video, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Play,
  Download,
  Share,
  Eye
} from 'lucide-react';

interface LabResult {
  id: string;
  patientId: string;
  patientName: string;
  testType: string;
  value: number;
  unit: string;
  normalRange: { min: number; max: number };
  trend: 'improving' | 'stable' | 'declining' | 'critical';
  videoGenerated: boolean;
  videoUrl?: string;
  educationalContent: string[];
  lastUpdated: string;
}

interface VideoAnalytics {
  id: string;
  resultId: string;
  views: number;
  completionRate: number;
  engagementScore: number;
  patientFeedback: 'positive' | 'neutral' | 'negative';
  recommendationsShown: number;
}

const mockResults: LabResult[] = [
  {
    id: 'LAB001',
    patientId: 'P2847',
    patientName: 'Sarah Johnson',
    testType: 'HbA1c',
    value: 7.2,
    unit: '%',
    normalRange: { min: 4.0, max: 5.6 },
    trend: 'improving',
    videoGenerated: true,
    videoUrl: '/videos/hba1c-explanation.mp4',
    educationalContent: ['Diabetes management tips', 'Diet recommendations', 'Exercise guidelines'],
    lastUpdated: '2024-01-20'
  },
  {
    id: 'LAB002',
    patientId: 'P1932',
    patientName: 'Michael Chen',
    testType: 'Cholesterol Total',
    value: 245,
    unit: 'mg/dL',
    normalRange: { min: 0, max: 200 },
    trend: 'critical',
    videoGenerated: true,
    videoUrl: '/videos/cholesterol-explained.mp4',
    educationalContent: ['Heart-healthy diet', 'Medication compliance', 'Lifestyle changes'],
    lastUpdated: '2024-01-19'
  },
  {
    id: 'LAB003',
    patientId: 'P3156',
    patientName: 'Emma Davis',
    testType: 'Blood Pressure',
    value: 135,
    unit: 'mmHg',
    normalRange: { min: 90, max: 120 },
    trend: 'stable',
    videoGenerated: false,
    educationalContent: ['Hypertension management', 'Stress reduction', 'Monitoring guidelines'],
    lastUpdated: '2024-01-20'
  }
];

const mockAnalytics: VideoAnalytics[] = [
  {
    id: 'VA001',
    resultId: 'LAB001',
    views: 234,
    completionRate: 89,
    engagementScore: 92,
    patientFeedback: 'positive',
    recommendationsShown: 5
  },
  {
    id: 'VA002',
    resultId: 'LAB002',
    views: 187,
    completionRate: 76,
    engagementScore: 84,
    patientFeedback: 'neutral',
    recommendationsShown: 7
  }
];

export const LabResultVisualization = () => {
  const [results] = useState<LabResult[]>(mockResults);
  const [analytics] = useState<VideoAnalytics[]>(mockAnalytics);
  const [selectedResult, setSelectedResult] = useState<LabResult | null>(null);

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'stable': return 'text-blue-600';
      case 'declining': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return TrendingUp;
      case 'stable': return Eye;
      case 'declining': return TrendingDown;
      case 'critical': return AlertTriangle;
      default: return Eye;
    }
  };

  const isAbnormal = (result: LabResult) => {
    return result.value < result.normalRange.min || result.value > result.normalRange.max;
  };

  const getResultAnalytics = (resultId: string) => {
    return analytics.find(a => a.resultId === resultId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Lab Result Visualization System
          </CardTitle>
          <CardDescription>
            Automated video generation, trend analysis, and patient education
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Video className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {results.filter(r => r.videoGenerated).length}
                  </p>
                  <p className="text-sm text-gray-600">Videos Generated</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-orange-200 bg-orange-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-600">
                    {results.filter(r => isAbnormal(r)).length}
                  </p>
                  <p className="text-sm text-gray-600">Abnormal Results</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {results.filter(r => r.trend === 'improving').length}
                  </p>
                  <p className="text-sm text-gray-600">Improving</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-purple-200 bg-purple-50">
              <div className="flex items-center gap-2">
                <Eye className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {analytics.reduce((sum, a) => sum + a.views, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Views</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Lab Results</h3>
              {results.map((result) => {
                const TrendIcon = getTrendIcon(result.trend);
                const resultAnalytics = getResultAnalytics(result.id);
                return (
                  <Card 
                    key={result.id} 
                    className={`cursor-pointer transition-colors ${selectedResult?.id === result.id ? 'ring-2 ring-blue-500' : ''} border-l-4 ${isAbnormal(result) ? 'border-l-red-400' : 'border-l-green-400'}`}
                    onClick={() => setSelectedResult(result)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold mb-1">{result.patientName}</h4>
                          <p className="text-sm text-gray-600 mb-1">ID: {result.patientId}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{result.testType}</span>
                            <Badge className={isAbnormal(result) ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}>
                              {isAbnormal(result) ? 'Abnormal' : 'Normal'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="text-right">
                            <p className={`text-lg font-bold ${isAbnormal(result) ? 'text-red-600' : 'text-green-600'}`}>
                              {result.value} {result.unit}
                            </p>
                            <p className="text-xs text-gray-500">
                              Normal: {result.normalRange.min}-{result.normalRange.max}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendIcon className={`h-4 w-4 ${getTrendColor(result.trend)}`} />
                            <span className={`text-sm font-medium ${getTrendColor(result.trend)}`}>
                              {result.trend}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          {result.videoGenerated ? (
                            <Badge className="bg-blue-500 text-white">
                              <Video className="h-3 w-3 mr-1" />
                              Video Ready
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              Video Pending
                            </Badge>
                          )}
                          {resultAnalytics && (
                            <Badge variant="outline">
                              {resultAnalytics.views} views
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">Updated: {result.lastUpdated}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div>
              {selectedResult ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedResult.patientName} - {selectedResult.testType}</CardTitle>
                    <CardDescription>Detailed analysis and educational content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Result Details</h4>
                          <div className="space-y-1 text-sm">
                            <p>Value: <strong className={isAbnormal(selectedResult) ? 'text-red-600' : 'text-green-600'}>
                              {selectedResult.value} {selectedResult.unit}
                            </strong></p>
                            <p>Normal Range: <strong>{selectedResult.normalRange.min}-{selectedResult.normalRange.max}</strong></p>
                            <p>Trend: <strong className={getTrendColor(selectedResult.trend)}>
                              {selectedResult.trend}
                            </strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Video Analytics</h4>
                          {getResultAnalytics(selectedResult.id) ? (
                            <div className="space-y-1 text-sm">
                              <p>Views: <strong>{getResultAnalytics(selectedResult.id)?.views}</strong></p>
                              <p>Completion: <strong>{getResultAnalytics(selectedResult.id)?.completionRate}%</strong></p>
                              <p>Engagement: <strong>{getResultAnalytics(selectedResult.id)?.engagementScore}</strong></p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No analytics available</p>
                          )}
                        </div>
                      </div>
                      
                      {selectedResult.videoGenerated && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            Generated Video Content
                          </h4>
                          <div className="flex gap-2">
                            <Button size="sm">
                              <Play className="h-4 w-4 mr-1" />
                              Play Video
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            <Button size="sm" variant="outline">
                              <Share className="h-4 w-4 mr-1" />
                              Share
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-medium mb-2">Educational Content</h4>
                        <div className="space-y-2">
                          {selectedResult.educationalContent.map((content, index) => (
                            <div key={index} className="text-sm bg-green-50 p-2 rounded">
                              <div className="flex items-start gap-2">
                                <Video className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-green-700">{content}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <Video className="h-4 w-4 mr-1" />
                          Generate Video
                        </Button>
                        <Button variant="outline">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          View Trends
                        </Button>
                        <Button variant="outline">
                          <Share className="h-4 w-4 mr-1" />
                          Share Results
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Select a lab result to view detailed analysis and video content</p>
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
