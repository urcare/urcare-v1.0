
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Monitor, 
  FileText, 
  Share2, 
  Settings,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
  Zap,
  Image,
  Activity,
  Camera,
  Stethoscope
} from 'lucide-react';
import { RadiologyScheduling } from './RadiologyScheduling';
import { DICOMViewer } from './DICOMViewer';
import { RadiologistReporting } from './RadiologistReporting';
import { ImageSharing } from './ImageSharing';
import { EquipmentTracking } from './EquipmentTracking';

export const RISDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const risMetrics = {
    scheduledExams: 156,
    completedToday: 89,
    pendingReports: 24,
    criticalResults: 3,
    equipmentActive: 12,
    averageReportTime: 2.8,
    patientWaitTime: 18,
    radiologistWorkload: 76
  };

  const urgentStudies = [
    {
      id: 'ST001',
      patient: 'John Doe',
      study: 'CT Head',
      priority: 'STAT',
      ordered: '14:30',
      modality: 'CT',
      status: 'In Progress'
    },
    {
      id: 'ST002',
      patient: 'Jane Smith',
      study: 'Chest X-Ray',
      priority: 'Urgent',
      ordered: '14:45',
      modality: 'XR',
      status: 'Waiting'
    },
    {
      id: 'ST003',
      patient: 'Mike Johnson',
      study: 'MRI Brain',
      priority: 'STAT',
      ordered: '15:00',
      modality: 'MR',
      status: 'Acquired'
    }
  ];

  const equipmentStatus = [
    { name: 'CT Scanner 1', status: 'active', utilization: 85, nextMaintenance: '2024-01-15' },
    { name: 'MRI Machine 1', status: 'active', utilization: 92, nextMaintenance: '2024-01-10' },
    { name: 'X-Ray Room 1', status: 'maintenance', utilization: 0, nextMaintenance: '2024-01-08' },
    { name: 'Ultrasound 1', status: 'active', utilization: 67, nextMaintenance: '2024-01-20' }
  ];

  const pendingReports = [
    {
      id: 'RPT001',
      patient: 'Sarah Wilson',
      study: 'Mammography',
      acquired: '13:15',
      radiologist: 'Dr. Smith',
      priority: 'Routine'
    },
    {
      id: 'RPT002',
      patient: 'Robert Brown',
      study: 'Abdominal CT',
      acquired: '12:30',
      radiologist: 'Dr. Johnson',
      priority: 'Urgent'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Radiology Information System</h1>
          <p className="text-gray-600 mt-2">Comprehensive imaging workflow and management platform</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            DICOM Viewer
          </Button>
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Calendar className="h-4 w-4" />
            Schedule Exam
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          <TabsTrigger value="dicom">DICOM Viewer</TabsTrigger>
          <TabsTrigger value="reporting">Reporting</TabsTrigger>
          <TabsTrigger value="sharing">Image Sharing</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-900">{risMetrics.scheduledExams}</p>
                    <p className="text-sm text-blue-700">Scheduled Exams</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-900">{risMetrics.completedToday}</p>
                    <p className="text-sm text-green-700">Completed Today</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-900">{risMetrics.pendingReports}</p>
                    <p className="text-sm text-yellow-700">Pending Reports</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-900">{risMetrics.criticalResults}</p>
                    <p className="text-sm text-red-700">Critical Results</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Urgent Studies */}
          <Card>
            <CardHeader>
              <CardTitle>Urgent Studies</CardTitle>
              <CardDescription>High priority imaging studies requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {urgentStudies.map((study, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 border-l-4 rounded ${
                    study.priority === 'STAT' ? 'border-l-red-500 bg-red-50' : 'border-l-orange-500 bg-orange-50'
                  }`}>
                    <div className="flex items-center gap-4">
                      <Monitor className={`h-5 w-5 ${
                        study.priority === 'STAT' ? 'text-red-600' : 'text-orange-600'
                      }`} />
                      <div>
                        <h5 className="font-medium text-gray-900">{study.patient}</h5>
                        <p className="text-sm text-gray-600">{study.study} • {study.modality}</p>
                        <p className="text-xs text-gray-500">Ordered: {study.ordered}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={`${
                        study.priority === 'STAT' ? 'border-red-500 text-red-700' : 'border-orange-500 text-orange-700'
                      }`}>
                        {study.priority}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">{study.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Equipment Status */}
            <Card>
              <CardHeader>
                <CardTitle>Equipment Status</CardTitle>
                <CardDescription>Real-time equipment monitoring and utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {equipmentStatus.map((equipment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <Activity className={`h-5 w-5 ${
                          equipment.status === 'active' ? 'text-green-600' : 'text-red-600'
                        }`} />
                        <div>
                          <h5 className="font-medium text-gray-900">{equipment.name}</h5>
                          <p className="text-sm text-gray-600">Utilization: {equipment.utilization}%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className={`${
                          equipment.status === 'active' ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700'
                        }`}>
                          {equipment.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">Next: {equipment.nextMaintenance}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Reports</CardTitle>
                <CardDescription>Studies awaiting radiologist interpretation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingReports.map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <h5 className="font-medium text-gray-900">{report.patient}</h5>
                          <p className="text-sm text-gray-600">{report.study}</p>
                          <p className="text-xs text-gray-500">Acquired: {report.acquired}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{report.radiologist}</p>
                        <Badge variant="outline" className={`mt-1 ${
                          report.priority === 'Urgent' ? 'border-orange-500 text-orange-700' : 'border-blue-500 text-blue-700'
                        }`}>
                          {report.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{risMetrics.averageReportTime}h</p>
                <p className="text-sm text-gray-600">Avg Report Time</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{risMetrics.patientWaitTime}min</p>
                <p className="text-sm text-gray-600">Patient Wait Time</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Stethoscope className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{risMetrics.radiologistWorkload}%</p>
                <p className="text-sm text-gray-600">Radiologist Load</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Settings className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{risMetrics.equipmentActive}</p>
                <p className="text-sm text-gray-600">Active Equipment</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scheduling">
          <RadiologyScheduling />
        </TabsContent>

        <TabsContent value="dicom">
          <DICOMViewer />
        </TabsContent>

        <TabsContent value="reporting">
          <RadiologistReporting />
        </TabsContent>

        <TabsContent value="sharing">
          <ImageSharing />
        </TabsContent>

        <TabsContent value="equipment">
          <EquipmentTracking />
        </TabsContent>
      </Tabs>
    </div>
  );
};
