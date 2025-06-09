
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Microscope,
  Search,
  Layers,
  Target,
  Eye,
  Download,
  AlertTriangle,
  CheckCircle,
  Zap,
  Grid
} from 'lucide-react';

export const PathologyAIVisualization = () => {
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [tissueAnalysis] = useState([
    {
      id: 1,
      type: 'Adenocarcinoma',
      grade: 'Grade II',
      location: 'Glandular tissue',
      confidence: 92.4,
      severity: 'High',
      cellCount: 1247,
      area: '2.4mm²'
    },
    {
      id: 2,
      type: 'Inflammatory Infiltrate',
      grade: 'Moderate',
      location: 'Stromal tissue',
      confidence: 88.7,
      severity: 'Medium',
      cellCount: 856,
      area: '1.8mm²'
    },
    {
      id: 3,
      type: 'Normal Epithelium',
      grade: 'Normal',
      location: 'Surface epithelium',
      confidence: 96.1,
      severity: 'Low',
      cellCount: 2103,
      area: '3.2mm²'
    }
  ]);

  const [cellularMetrics] = useState({
    totalCells: 4206,
    abnormalCells: 1247,
    mitoticIndex: 12.3,
    necrosisPercentage: 8.7,
    tumorPurity: 73.2
  });

  const [diagnosticSuggestions] = useState([
    'Moderately differentiated adenocarcinoma',
    'Recommend immunohistochemistry panel',
    'Consider molecular testing for targeted therapy',
    'Staging evaluation recommended'
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
      {/* Pathology Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Slide Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                H&E Section 1
              </Button>
              <Button variant="outline" className="w-full justify-start">
                H&E Section 2
              </Button>
              <Button variant="outline" className="w-full justify-start">
                IHC Panel
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Target className="h-4 w-4 mr-2" />
                Cell Classification
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Grid className="h-4 w-4 mr-2" />
                Tissue Segmentation
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                Annotation
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Microscope className="h-5 w-5" />
              Magnification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full">4x Overview</Button>
              <Button variant="outline" className="w-full">10x Low Power</Button>
              <Button className="w-full">40x High Power</Button>
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
                Analyze
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" className="w-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                Review
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Digital Pathology Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Viewer */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Microscope className="h-5 w-5" />
                Digital Pathology Viewer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border rounded-lg bg-gray-100 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Microscope className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <div className="text-lg text-gray-600">H&E Stained Section</div>
                  <div className="text-sm text-gray-500">40x Magnification</div>
                  
                  {/* Simulated AI Annotations */}
                  <div className="absolute inset-4 pointer-events-none">
                    {tissueAnalysis.map((analysis, index) => (
                      <div 
                        key={analysis.id}
                        className={`absolute w-12 h-12 border-2 rounded-full opacity-75 ${
                          analysis.severity === 'High' ? 'border-red-500' :
                          analysis.severity === 'Medium' ? 'border-yellow-500' :
                          'border-green-500'
                        }`}
                        style={{
                          left: `${20 + index * 80}px`,
                          top: `${30 + index * 60}px`
                        }}
                        title={`${analysis.type} - ${analysis.confidence}% confidence`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Viewer Controls */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Pan</Button>
                  <Button size="sm" variant="outline">Zoom</Button>
                  <Button size="sm" variant="outline">Measure</Button>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Reset View</Button>
                  <Button size="sm" variant="outline">Full Screen</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Tissue Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tissueAnalysis.map((analysis) => (
                <div key={analysis.id} className={`p-4 border rounded-lg ${getSeverityColor(analysis.severity)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium text-sm">{analysis.type}</div>
                    <Badge variant="outline" className={getSeverityColor(analysis.severity)}>
                      {analysis.grade}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Location:</span> {analysis.location}
                    </div>
                    <div>
                      <span className="text-gray-600">Confidence:</span> {analysis.confidence}%
                    </div>
                    <div>
                      <span className="text-gray-600">Cell Count:</span> {analysis.cellCount}
                    </div>
                    <div>
                      <span className="text-gray-600">Area:</span> {analysis.area}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${analysis.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Focus
                    </Button>
                    <Button size="sm" variant="outline">
                      <Grid className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cellular Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid className="h-5 w-5" />
            Cellular Metrics & Quantification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{cellularMetrics.totalCells}</div>
              <div className="text-sm text-gray-600">Total Cells</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">{cellularMetrics.abnormalCells}</div>
              <div className="text-sm text-gray-600">Abnormal Cells</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">{cellularMetrics.mitoticIndex}%</div>
              <div className="text-sm text-gray-600">Mitotic Index</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">{cellularMetrics.necrosisPercentage}%</div>
              <div className="text-sm text-gray-600">Necrosis</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{cellularMetrics.tumorPurity}%</div>
              <div className="text-sm text-gray-600">Tumor Purity</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diagnostic Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            AI Diagnostic Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {diagnosticSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-blue-800">{suggestion}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="font-medium text-green-800">Analysis Complete</div>
                </div>
                <div className="text-sm text-green-700">
                  AI pathology analysis completed with high confidence
                </div>
              </div>
              
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
