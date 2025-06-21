
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Scan, 
  Monitor, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  User,
  Activity,
  Brain,
  Eye,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

interface Study {
  id: string;
  patientName: string;
  studyType: string;
  studyDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'reported';
  priority: 'routine' | 'urgent' | 'stat';
  modality: string;
  referringPhysician: string;
}

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: 'available' | 'in-use' | 'maintenance' | 'offline';
  location: string;
  lastMaintenance: string;
}

export const RISDashboard = () => {
  const [activeTab, setActiveTab] = useState('worklist');
  const [studies] = useState<Study[]>([
    {
      id: '1',
      patientName: 'John Smith',
      studyType: 'CT Chest',
      studyDate: '2024-01-22',
      status: 'pending',
      priority: 'urgent',
      modality: 'CT',
      referringPhysician: 'Dr. Johnson'
    },
    {
      id: '2',
      patientName: 'Mary Jones',
      studyType: 'MRI Brain',
      studyDate: '2024-01-22',
      status: 'in-progress',
      priority: 'routine',
      modality: 'MRI',
      referringPhysician: 'Dr. Smith'
    },
    {
      id: '3',
      patientName: 'Bob Wilson',
      studyType: 'X-Ray Chest',
      studyDate: '2024-01-21',
      status: 'completed',
      priority: 'stat',
      modality: 'XR',
      referringPhysician: 'Dr. Brown'
    }
  ]);

  const [equipment] = useState<Equipment[]>([
    {
      id: '1',
      name: 'CT Scanner 1',
      type: 'CT',
      status: 'available',
      location: 'Room 101',
      lastMaintenance: '2024-01-15'
    },
    {
      id: '2',
      name: 'MRI Scanner 1',
      type: 'MRI',
      status: 'in-use',
      location: 'Room 102',
      lastMaintenance: '2024-01-10'
    },
    {
      id: '3',
      name: 'X-Ray Machine 1',
      type: 'XR',
      status: 'maintenance',
      location: 'Room 103',
      lastMaintenance: '2024-01-20'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'reported': return 'bg-purple-100 text-purple-800';
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

  const getEquipmentStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'in-use': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Radiology Information System</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Comprehensive radiology workflow management with AI-powered diagnostics and equipment tracking
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Studies</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Equipment Online</p>
                <p className="text-2xl font-bold">15/18</p>
              </div>
              <Monitor className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="worklist">Worklist</TabsTrigger>
          <TabsTrigger value="viewer">Image Viewer</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="worklist" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Study Worklist</h3>
            <div className="flex gap-2">
              <Input placeholder="Search studies..." className="w-64" />
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
            </div>
          </div>
          
          <div className="grid gap-4">
            {studies.map((study) => (
              <Card key={study.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Scan className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{study.patientName}</h4>
                        <p className="text-sm text-gray-600">{study.studyType}</p>
                        <p className="text-xs text-gray-500">
                          {study.studyDate} • {study.referringPhysician}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={getPriorityColor(study.priority)}>
                        {study.priority.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(study.status)}>
                        {study.status}
                      </Badge>
                      <Badge variant="outline">{study.modality}</Badge>
                      <Button size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="viewer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                DICOM Image Viewer
              </CardTitle>
              <CardDescription>
                Advanced medical image viewing with AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <div className="border rounded-lg bg-gray-900 h-96 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Scan className="h-16 w-16 mx-auto mb-4 opacity-60" />
                      <div className="text-lg">Medical Image Viewer</div>
                      <div className="text-sm opacity-75">Load DICOM images for analysis</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Zoom In</Button>
                      <Button size="sm" variant="outline">Zoom Out</Button>
                      <Button size="sm" variant="outline">Pan</Button>
                      <Button size="sm" variant="outline">Measure</Button>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">
                        <Brain className="h-4 w-4 mr-2" />
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
                      <CardTitle className="text-sm">Study Information</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      <div><strong>Patient:</strong> John Smith</div>
                      <div><strong>Study:</strong> CT Chest</div>
                      <div><strong>Date:</strong> 2024-01-22</div>
                      <div><strong>Modality:</strong> CT</div>
                      <div><strong>Series:</strong> 3</div>
                      <div><strong>Images:</strong> 120</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">AI Findings</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      <div className="p-2 bg-yellow-50 rounded">
                        <div className="font-medium text-yellow-800">Nodule Detected</div>
                        <div className="text-yellow-600">8mm nodule in right upper lobe</div>
                      </div>
                      <div className="p-2 bg-green-50 rounded">
                        <div className="font-medium text-green-800">Normal Finding</div>
                        <div className="text-green-600">Heart size within normal limits</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Equipment Status</h3>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Maintenance
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipment.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{item.name}</h4>
                    <Badge className={getEquipmentStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div><strong>Type:</strong> {item.type}</div>
                    <div><strong>Location:</strong> {item.location}</div>
                    <div><strong>Last Maintenance:</strong> {item.lastMaintenance}</div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline">
                      <Activity className="h-4 w-4 mr-2" />
                      Status
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Radiology Reports</h3>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              New Report
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-500">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <div className="text-lg">Report Management</div>
                <div className="text-sm">Create, edit, and manage radiology reports</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>CT Scans</span>
                    <span className="font-bold">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span>MRI Scans</span>
                    <span className="font-bold">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span>X-Rays</span>
                    <span className="font-bold">45</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ultrasounds</span>
                    <span className="font-bold">32</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Average Report Time</span>
                    <span className="font-bold">2.4 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Equipment Uptime</span>
                    <span className="font-bold">98.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quality Score</span>
                    <span className="font-bold">4.8/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Patient Satisfaction</span>
                    <span className="font-bold">96%</span>
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
