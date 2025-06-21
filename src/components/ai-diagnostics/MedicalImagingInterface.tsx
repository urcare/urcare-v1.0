
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  Brain, 
  Eye, 
  Heart, 
  Zap,
  Upload,
  Download,
  Share2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface ImagingStudy {
  id: string;
  patientName: string;
  studyType: string;
  studyDate: string;
  aiAnalysis: {
    findings: string[];
    confidence: number;
    recommendations: string[];
    abnormalityDetected: boolean;
  };
  radiologistReview: 'pending' | 'completed' | 'in-progress';
}

export const MedicalImagingInterface = () => {
  const [activeTab, setActiveTab] = useState('analysis');
  const [selectedStudy, setSelectedStudy] = useState<ImagingStudy | null>(null);

  const imagingStudies: ImagingStudy[] = [
    {
      id: 'IS001',
      patientName: 'John Doe',
      studyType: 'Chest X-Ray',
      studyDate: '2024-01-15',
      aiAnalysis: {
        findings: ['Possible pneumonia in right lower lobe', 'Heart size within normal limits'],
        confidence: 87,
        recommendations: ['CT scan for further evaluation', 'Clinical correlation advised'],
        abnormalityDetected: true
      },
      radiologistReview: 'pending'
    },
    {
      id: 'IS002',
      patientName: 'Jane Smith',
      studyType: 'Brain MRI',
      studyDate: '2024-01-14',
      aiAnalysis: {
        findings: ['No acute intracranial abnormality', 'Age-appropriate brain changes'],
        confidence: 94,
        recommendations: ['Routine follow-up', 'No immediate intervention required'],
        abnormalityDetected: false
      },
      radiologistReview: 'completed'
    },
    {
      id: 'IS003',
      patientName: 'Robert Wilson',
      studyType: 'ECG Analysis',
      studyDate: '2024-01-15',
      aiAnalysis: {
        findings: ['Sinus rhythm', 'Possible ST elevation in leads II, III, aVF'],
        confidence: 92,
        recommendations: ['Immediate cardiology consultation', 'Serial ECGs recommended'],
        abnormalityDetected: true
      },
      radiologistReview: 'in-progress'
    }
  ];

  const handleUploadImage = () => {
    toast.success('Image uploaded successfully for AI analysis');
  };

  const handleExportReport = () => {
    toast.success('Analysis report exported');
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getReviewStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-6 w-6 text-purple-600" />
            AI Medical Imaging Analysis
          </CardTitle>
          <CardDescription>
            Advanced AI-powered analysis of medical images and diagnostic studies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Eye className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">Studies Today</h3>
              <p className="text-2xl font-bold text-blue-600">47</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Brain className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">AI Accuracy</h3>
              <p className="text-2xl font-bold text-green-600">96.2%</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Heart className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">Critical Findings</h3>
              <p className="text-2xl font-bold text-red-600">3</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Zap className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
              <h3 className="font-bold text-yellow-800">Avg Analysis Time</h3>
              <p className="text-2xl font-bold text-yellow-600">12s</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="upload">Upload & Analyze</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid gap-4">
            {imagingStudies.map((study) => (
              <Card 
                key={study.id} 
                className={`cursor-pointer transition-colors ${
                  selectedStudy?.id === study.id ? 'ring-2 ring-blue-500' : ''
                } ${study.aiAnalysis.abnormalityDetected ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-green-500'}`}
                onClick={() => setSelectedStudy(study)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{study.patientName}</h3>
                      <p className="text-gray-600">{study.studyType}</p>
                      <p className="text-sm text-gray-500">{study.studyDate}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getReviewStatusColor(study.radiologistReview)}>
                        {study.radiologistReview.replace('-', ' ').toUpperCase()}
                      </Badge>
                      {study.aiAnalysis.abnormalityDetected && (
                        <Badge className="bg-red-100 text-red-800">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Abnormality Detected
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">AI Confidence:</span>
                        <span className={`font-bold ${getConfidenceColor(study.aiAnalysis.confidence)}`}>
                          {study.aiAnalysis.confidence}%
                        </span>
                      </div>
                      <Progress value={study.aiAnalysis.confidence} className="h-2" />
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Key Findings:</h4>
                      <ul className="space-y-1">
                        {study.aiAnalysis.findings.map((finding, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              study.aiAnalysis.abnormalityDetected && index === 0 ? 'bg-red-400' : 'bg-blue-400'
                            }`}></div>
                            {finding}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">AI Recommendations:</h4>
                      <div className="flex flex-wrap gap-1">
                        {study.aiAnalysis.recommendations.map((rec, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {rec}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Images
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Export Report
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share with Radiologist
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Medical Images for AI Analysis</CardTitle>
              <CardDescription>
                Upload DICOM files, X-rays, MRIs, CT scans, or other medical images for instant AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Drop files here or click to upload</h3>
                <p className="text-gray-600 mb-4">
                  Supports DICOM, JPEG, PNG files up to 100MB
                </p>
                <Button onClick={handleUploadImage}>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Quick Analysis Options</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Detect abnormalities</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Generate findings report</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" />
                        <span className="text-sm">Compare with previous studies</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" />
                        <span className="text-sm">Generate differential diagnosis</span>
                      </label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Supported Study Types</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>• Chest X-Ray</div>
                      <div>• Brain MRI</div>
                      <div>• CT Scans</div>
                      <div>• Mammography</div>
                      <div>• Ultrasound</div>
                      <div>• ECG/EKG</div>
                      <div>• Retinal Images</div>
                      <div>• Dermatology</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Reports & Export</CardTitle>
              <CardDescription>
                Generate comprehensive reports and export analysis results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Recent Analysis Reports</h3>
                  <Button onClick={handleExportReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                  </Button>
                </div>

                <div className="grid gap-3">
                  {imagingStudies.map((study) => (
                    <div key={study.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">{study.patientName}</span>
                        <span className="text-gray-600 ml-2">- {study.studyType}</span>
                        <div className="text-sm text-gray-500">{study.studyDate}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
