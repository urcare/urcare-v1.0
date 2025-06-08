
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Microscope, 
  Workflow, 
  FileText, 
  Camera,
  Share2, 
  Settings,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
  Stethoscope,
  Image,
  Activity,
  Brain,
  Eye,
  BookOpen
} from 'lucide-react';
import { TissueTracking } from './TissueTracking';
import { PathologyReporting } from './PathologyReporting';
import { DigitalPathology } from './DigitalPathology';
import { ImmunohistochemistryTracking } from './ImmunohistochemistryTracking';
import { CaseConsultation } from './CaseConsultation';
import { MolecularPathology } from './MolecularPathology';

export const PathologyDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const pathologyMetrics = {
    pendingCases: 89,
    completedToday: 156,
    urgentCases: 12,
    avgTurnaroundTime: 2.8,
    qualityScore: 98.5,
    consultations: 23,
    digitalSlides: 445,
    ihdStains: 67
  };

  const urgentCases = [
    {
      id: 'PATH001',
      patient: 'John Doe',
      specimen: 'Lung Biopsy',
      priority: 'STAT',
      received: '14:30',
      status: 'Grossing',
      pathologist: 'Dr. Smith'
    },
    {
      id: 'PATH002',
      patient: 'Jane Smith',
      specimen: 'Breast Core',
      priority: 'Urgent',
      received: '13:45',
      status: 'Sectioning',
      pathologist: 'Dr. Johnson'
    },
    {
      id: 'PATH003',
      patient: 'Mike Wilson',
      specimen: 'Colon Resection',
      priority: 'STAT',
      received: '15:00',
      status: 'Staining',
      pathologist: 'Dr. Brown'
    }
  ];

  const recentConsultations = [
    {
      id: 'CONS001',
      case: 'Melanoma Diagnosis',
      consultant: 'Dr. Expert',
      status: 'Pending Review',
      urgency: 'High'
    },
    {
      id: 'CONS002',
      case: 'Lymphoma Subtyping',
      consultant: 'Dr. Specialist',
      status: 'Completed',
      urgency: 'Routine'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pathology Management System</h1>
          <p className="text-gray-600 mt-2">Comprehensive tissue tracking and diagnostic workflow management</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Digital Pathology
          </Button>
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Microscope className="h-4 w-4" />
            New Case
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tissue-tracking">Tissue Tracking</TabsTrigger>
          <TabsTrigger value="reporting">Reporting</TabsTrigger>
          <TabsTrigger value="digital">Digital Pathology</TabsTrigger>
          <TabsTrigger value="ihc">Immunohistochemistry</TabsTrigger>
          <TabsTrigger value="molecular">Molecular</TabsTrigger>
          <TabsTrigger value="consultation">Consultation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Microscope className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-900">{pathologyMetrics.pendingCases}</p>
                    <p className="text-sm text-blue-700">Pending Cases</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-900">{pathologyMetrics.completedToday}</p>
                    <p className="text-sm text-green-700">Completed Today</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-900">{pathologyMetrics.urgentCases}</p>
                    <p className="text-sm text-red-700">Urgent Cases</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Camera className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-900">{pathologyMetrics.digitalSlides}</p>
                    <p className="text-sm text-purple-700">Digital Slides</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Urgent Cases */}
          <Card>
            <CardHeader>
              <CardTitle>Urgent Cases</CardTitle>
              <CardDescription>High priority specimens requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {urgentCases.map((case_item, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 border-l-4 rounded ${
                    case_item.priority === 'STAT' ? 'border-l-red-500 bg-red-50' : 'border-l-orange-500 bg-orange-50'
                  }`}>
                    <div className="flex items-center gap-4">
                      <Microscope className={`h-5 w-5 ${
                        case_item.priority === 'STAT' ? 'text-red-600' : 'text-orange-600'
                      }`} />
                      <div>
                        <h5 className="font-medium text-gray-900">{case_item.patient}</h5>
                        <p className="text-sm text-gray-600">{case_item.specimen}</p>
                        <p className="text-xs text-gray-500">Received: {case_item.received}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={`${
                        case_item.priority === 'STAT' ? 'border-red-500 text-red-700' : 'border-orange-500 text-orange-700'
                      }`}>
                        {case_item.priority}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">{case_item.status}</p>
                      <p className="text-xs text-gray-500">{case_item.pathologist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Consultations */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Consultations</CardTitle>
                <CardDescription>Expert opinions and case reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentConsultations.map((consultation, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-blue-600" />
                        <div>
                          <h5 className="font-medium text-gray-900">{consultation.case}</h5>
                          <p className="text-sm text-gray-600">{consultation.consultant}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className={`${
                          consultation.status === 'Completed' ? 'border-green-500 text-green-700' : 'border-blue-500 text-blue-700'
                        }`}>
                          {consultation.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{consultation.urgency}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quality Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
                <CardDescription>Performance indicators and quality assurance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Turnaround Time</span>
                    <span className="font-medium">{pathologyMetrics.avgTurnaroundTime} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Quality Score</span>
                    <span className="font-medium text-green-600">{pathologyMetrics.qualityScore}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">IHC Stains</span>
                    <span className="font-medium">{pathologyMetrics.ihdStains}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Consultations</span>
                    <span className="font-medium">{pathologyMetrics.consultations}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{pathologyMetrics.avgTurnaroundTime}d</p>
                <p className="text-sm text-gray-600">Avg Turnaround</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{pathologyMetrics.qualityScore}%</p>
                <p className="text-sm text-gray-600">Quality Score</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{pathologyMetrics.consultations}</p>
                <p className="text-sm text-gray-600">Active Consultations</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tissue-tracking">
          <TissueTracking />
        </TabsContent>

        <TabsContent value="reporting">
          <PathologyReporting />
        </TabsContent>

        <TabsContent value="digital">
          <DigitalPathology />
        </TabsContent>

        <TabsContent value="ihc">
          <ImmunohistochemistryTracking />
        </TabsContent>

        <TabsContent value="molecular">
          <MolecularPathology />
        </TabsContent>

        <TabsContent value="consultation">
          <CaseConsultation />
        </TabsContent>
      </Tabs>
    </div>
  );
};
