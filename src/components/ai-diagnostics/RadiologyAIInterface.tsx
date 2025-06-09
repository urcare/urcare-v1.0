
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Scan,
  Search,
  Target,
  Layers,
  Ruler,
  Eye,
  Download,
  AlertTriangle,
  CheckCircle,
  Zap
} from 'lucide-react';

export const RadiologyAIInterface = () => {
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [aiFindings] = useState([
    {
      id: 1,
      type: 'Pulmonary Nodule',
      location: 'Right upper lobe',
      size: '8.2mm',
      confidence: 94.7,
      severity: 'High',
      coordinates: { x: 245, y: 167 },
      recommendation: 'Follow-up CT recommended in 3 months'
    },
    {
      id: 2,
      type: 'Ground Glass Opacity',
      location: 'Left lower lobe',
      size: '15.4mm',
      confidence: 89.3,
      severity: 'Medium',
      coordinates: { x: 158, y: 298 },
      recommendation: 'Clinical correlation suggested'
    },
    {
      id: 3,
      type: 'Calcified Granuloma',
      location: 'Right middle lobe',
      size: '4.1mm',
      confidence: 96.8,
      severity: 'Low',
      coordinates: { x: 287, y: 234 },
      recommendation: 'Benign finding, no follow-up needed'
    }
  ]);

  const [measurementTools] = useState([
    { name: 'Linear', icon: Ruler, active: false },
    { name: 'Area', icon: Target, active: false },
    { name: 'Angle', icon: Layers, active: false },
    { name: 'Volume', icon: Scan, active: true }
  ]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'border-red-300 text-red-700 bg-red-50';
      case 'Medium': return 'border-yellow-300 text-yellow-700 bg-yellow-50';
      case 'Low': return 'border-green-300 text-green-700 bg-green-50';
      default: return 'border-gray-300 text-gray-700 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Radiology Viewer Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Study Selector
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                CT Chest - 2024/01/22
              </Button>
              <Button variant="outline" className="w-full justify-start">
                MRI Brain - 2024/01/21
              </Button>
              <Button variant="outline" className="w-full justify-start">
                X-Ray Chest - 2024/01/20
              </Button>
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
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Target className="h-4 w-4 mr-2" />
                Heat Map
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                Overlay
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Zap className="h-4 w-4 mr-2" />
                Highlight
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5" />
              Measurements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {measurementTools.map((tool, index) => {
                const IconComponent = tool.icon;
                return (
                  <Button 
                    key={index}
                    variant={tool.active ? "default" : "outline"} 
                    className="w-full justify-start"
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {tool.name}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Run AI Analysis
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" className="w-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Image Viewer and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Image Viewer */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="h-5 w-5" />
                Radiology Viewer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border rounded-lg bg-gray-900 h-96 flex items-center justify-center">
                <div className="text-white text-center">
                  <Scan className="h-16 w-16 mx-auto mb-4 opacity-60" />
                  <div className="text-lg">CT Chest Study</div>
                  <div className="text-sm opacity-75">Slice 45/120</div>
                  
                  {/* Simulated AI Annotations */}
                  <div className="absolute top-4 left-4 space-y-2">
                    {aiFindings.map((finding) => (
                      <div 
                        key={finding.id}
                        className="w-4 h-4 border-2 border-red-400 rounded-full cursor-pointer"
                        style={{
                          position: 'absolute',
                          left: `${finding.coordinates.x}px`,
                          top: `${finding.coordinates.y}px`
                        }}
                        title={`${finding.type} - ${finding.confidence}% confidence`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Image Controls */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Previous</Button>
                  <Button size="sm" variant="outline">Next</Button>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Zoom In</Button>
                  <Button size="sm" variant="outline">Zoom Out</Button>
                  <Button size="sm" variant="outline">Reset</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Findings Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              AI Findings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiFindings.map((finding) => (
                <div key={finding.id} className={`p-4 border rounded-lg ${getSeverityColor(finding.severity)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium text-sm">{finding.type}</div>
                    <Badge variant="outline" className={getSeverityColor(finding.severity)}>
                      {finding.severity}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Location:</span> {finding.location}
                    </div>
                    <div>
                      <span className="text-gray-600">Size:</span> {finding.size}
                    </div>
                    <div>
                      <span className="text-gray-600">Confidence:</span> {finding.confidence}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${finding.confidence}%` }}
                      ></div>
                    </div>
                    <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
                      {finding.recommendation}
                    </div>
                  </div>
                  
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Focus
                    </Button>
                    <Button size="sm" variant="outline">
                      <Ruler className="h-3 w-3 mr-1" />
                      Measure
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            AI Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="font-medium text-green-800">Analysis Complete</div>
                </div>
                <div className="text-sm text-green-700">
                  AI analysis completed successfully with high confidence
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">3</div>
                <div className="text-sm text-gray-600">Findings Detected</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">93.6%</div>
                <div className="text-sm text-gray-600">Average Confidence</div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">2.4s</div>
                <div className="text-sm text-gray-600">Processing Time</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div className="font-medium text-yellow-800">Attention Required</div>
                </div>
                <div className="text-sm text-yellow-700">
                  1 high-priority finding requires radiologist review
                </div>
              </div>
              
              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
