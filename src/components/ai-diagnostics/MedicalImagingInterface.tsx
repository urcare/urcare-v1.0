
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain,
  Upload,
  Download,
  Layers,
  Zap,
  AlertTriangle,
  CheckCircle,
  Eye,
  Target,
  Activity
} from 'lucide-react';

export const MedicalImagingInterface = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState({
    confidence: 94.7,
    findings: [
      { type: 'Nodule', location: 'Upper right lobe', confidence: 96.2, severity: 'High' },
      { type: 'Opacity', location: 'Lower left lobe', confidence: 87.4, severity: 'Medium' },
      { type: 'Calcification', location: 'Mediastinum', confidence: 91.8, severity: 'Low' }
    ],
    recommendations: [
      'Immediate radiologist review recommended',
      'Consider follow-up CT in 3 months',
      'Correlate with clinical symptoms'
    ]
  });

  const [imageTypes] = useState([
    { type: 'CT Chest', count: 45, avgAccuracy: 94.2 },
    { type: 'MRI Brain', count: 32, avgAccuracy: 96.8 },
    { type: 'X-Ray', count: 78, avgAccuracy: 89.5 },
    { type: 'Mammography', count: 29, avgAccuracy: 93.1 }
  ]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'border-red-300 text-red-700';
      case 'Medium': return 'border-yellow-300 text-yellow-700';
      case 'Low': return 'border-green-300 text-green-700';
      default: return 'border-gray-300 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Image Upload and Analysis Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Image Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-sm text-gray-600 mb-4">
                Drag & drop medical images or click to browse
              </p>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Select Images
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {aiAnalysis.confidence}%
                </div>
                <div className="text-sm text-gray-600">Confidence Score</div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">
                  <Zap className="h-4 w-4 mr-2" />
                  Analyze
                </Button>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Visualization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Target className="h-4 w-4 mr-2" />
                Heat Map Overlay
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Activity className="h-4 w-4 mr-2" />
                Anomaly Highlighting
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Image Analysis Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Findings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              AI Findings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiAnalysis.findings.map((finding, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium">{finding.type}</div>
                    <Badge variant="outline" className={getSeverityColor(finding.severity)}>
                      {finding.severity} Risk
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      <strong>Location:</strong> {finding.location}
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Confidence:</strong> {finding.confidence}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${finding.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiAnalysis.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-blue-800">{recommendation}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <div className="flex gap-2">
                <Button>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Flag for Review
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Image Type Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Imaging Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {imageTypes.map((type, index) => (
              <div key={index} className="p-4 border rounded-lg text-center">
                <div className="text-lg font-bold text-blue-600">{type.count}</div>
                <div className="text-sm text-gray-600 mb-2">{type.type}</div>
                <div className="text-xs text-green-600">
                  {type.avgAccuracy}% avg accuracy
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
