
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Microscope, 
  FlaskConical, 
  FileText, 
  User, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Search,
  Eye,
  Download,
  Activity,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

interface PathologyCase {
  id: string;
  patientName: string;
  specimenType: string;
  caseDate: string;
  status: 'received' | 'processing' | 'staining' | 'reading' | 'completed';
  priority: 'routine' | 'urgent' | 'stat';
  pathologist: string;
  diagnosis?: string;
}

interface SpecimenTracking {
  id: string;
  specimenId: string;
  currentLocation: string;
  status: string;
  timestamp: string;
}

export const PathologyDashboard = () => {
  const [activeTab, setActiveTab] = useState('cases');
  const [cases] = useState<PathologyCase[]>([
    {
      id: '1',
      patientName: 'Alice Johnson',
      specimenType: 'Breast Biopsy',
      caseDate: '2024-01-22',
      status: 'reading',
      priority: 'urgent',
      pathologist: 'Dr. Smith',
      diagnosis: 'Pending review'
    },
    {
      id: '2',
      patientName: 'Robert Brown',
      specimenType: 'Colon Biopsy',
      caseDate: '2024-01-22',
      status: 'staining',
      priority: 'routine',
      pathologist: 'Dr. Johnson'
    },
    {
      id: '3',
      patientName: 'Mary Davis',
      specimenType: 'Skin Lesion',
      caseDate: '2024-01-21',
      status: 'completed',
      priority: 'stat',
      pathologist: 'Dr. Wilson',
      diagnosis: 'Benign nevus'
    }
  ]);

  const [specimens] = useState<SpecimenTracking[]>([
    {
      id: '1',
      specimenId: 'SP-2024-001',
      currentLocation: 'Histology Lab',
      status: 'H&E Staining',
      timestamp: '2024-01-22 10:30'
    },
    {
      id: '2',
      specimenId: 'SP-2024-002',
      currentLocation: 'IHC Lab',
      status: 'Immunohistochemistry',
      timestamp: '2024-01-22 09:15'
    },
    {
      id: '3',
      specimenId: 'SP-2024-003',
      currentLocation: 'Digital Pathology',
      status: 'Whole Slide Imaging',
      timestamp: '2024-01-22 11:45'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'staining': return 'bg-purple-100 text-purple-800';
      case 'reading': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'stat': return 'bg-red-100 text-red-800';
      case 'urgent': return 'bg-orange-100 text-orange-800';
      case 'routine': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Pathology Management System</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Comprehensive pathology workflow management with digital imaging and case tracking
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Cases</p>
                <p className="text-2xl font-bold">28</p>
              </div>
              <Microscope className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold">7</p>
              </div>
              <Eye className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold">15</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Turnaround Time</p>
                <p className="text-2xl font-bold">2.1d</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="cases">Case Management</TabsTrigger>
          <TabsTrigger value="specimens">Specimen Tracking</TabsTrigger>
          <TabsTrigger value="imaging">Digital Pathology</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Quality Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="cases" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Pathology Cases</h3>
            <div className="flex gap-2">
              <Input placeholder="Search cases..." className="w-64" />
              <Button>
                <FlaskConical className="h-4 w-4 mr-2" />
                New Case
              </Button>
            </div>
          </div>
          
          <div className="grid gap-4">
            {cases.map((caseItem) => (
              <Card key={caseItem.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Microscope className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{caseItem.patientName}</h4>
                        <p className="text-sm text-gray-600">{caseItem.specimenType}</p>
                        <p className="text-xs text-gray-500">
                          {caseItem.caseDate} • {caseItem.pathologist}
                        </p>
                        {caseItem.diagnosis && (
                          <p className="text-xs text-blue-600 mt-1">{caseItem.diagnosis}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={getPriorityColor(caseItem.priority)}>
                        {caseItem.priority.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(caseItem.status)}>
                        {caseItem.status}
                      </Badge>
                      <Button size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="specimens" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Specimen Tracking</h3>
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Track Specimen
            </Button>
          </div>
          
          <div className="grid gap-4">
            {specimens.map((specimen) => (
              <Card key={specimen.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <FlaskConical className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{specimen.specimenId}</h4>
                        <p className="text-sm text-gray-600">{specimen.currentLocation}</p>
                        <p className="text-xs text-gray-500">{specimen.timestamp}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{specimen.status}</Badge>
                      <Button size="sm" variant="outline">
                        <Activity className="h-4 w-4 mr-2" />
                        History
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="imaging" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Digital Pathology Viewer
              </CardTitle>
              <CardDescription>
                Whole slide imaging and AI-assisted diagnosis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <div className="border rounded-lg bg-gray-900 h-96 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Microscope className="h-16 w-16 mx-auto mb-4 opacity-60" />
                      <div className="text-lg">Digital Slide Viewer</div>
                      <div className="text-sm opacity-75">Load whole slide images for analysis</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">20x</Button>
                      <Button size="sm" variant="outline">40x</Button>
                      <Button size="sm" variant="outline">100x</Button>
                      <Button size="sm" variant="outline">400x</Button>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">
                        <Target className="h-4 w-4 mr-2" />
                        AI Analysis
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Case Information</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      <div><strong>Patient:</strong> Alice Johnson</div>
                      <div><strong>Specimen:</strong> Breast Biopsy</div>
                      <div><strong>Stain:</strong> H&E</div>
                      <div><strong>Block:</strong> A1</div>
                      <div><strong>Section:</strong> 1</div>
                      <div><strong>Magnification:</strong> 200x</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">AI Findings</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      <div className="p-2 bg-red-50 rounded">
                        <div className="font-medium text-red-800">Atypical Cells</div>
                        <div className="text-red-600">Suspicious cellular morphology detected</div>
                      </div>
                      <div className="p-2 bg-yellow-50 rounded">
                        <div className="font-medium text-yellow-800">Inflammatory Changes</div>
                        <div className="text-yellow-600">Chronic inflammation present</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Pathology Reports</h3>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-500">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <div className="text-lg">Report Management</div>
                <div className="text-sm">Create, review, and finalize pathology reports</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Diagnostic Accuracy</span>
                    <span className="font-bold">98.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Turnaround Time</span>
                    <span className="font-bold">2.1 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Second Opinion Rate</span>
                    <span className="font-bold">3.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amended Reports</span>
                    <span className="font-bold">1.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Workload Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Biopsies</span>
                    <span className="font-bold">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cytology</span>
                    <span className="font-bold">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Surgical Specimens</span>
                    <span className="font-bold">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frozen Sections</span>
                    <span className="font-bold">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
