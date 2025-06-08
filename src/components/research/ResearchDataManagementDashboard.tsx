
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Users, 
  Calendar, 
  Shield, 
  Download, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BookOpen,
  Database
} from 'lucide-react';
import { ProtocolManagement } from './ProtocolManagement';
import { ParticipantEnrollment } from './ParticipantEnrollment';
import { ConsentManagement } from './ConsentManagement';
import { StudyTimeline } from './StudyTimeline';
import { ParticipantPortal } from './ParticipantPortal';
import { IRBTracking } from './IRBTracking';
import { DataCollection } from './DataCollection';
import { ComplianceMonitor } from './ComplianceMonitor';

export const ResearchDataManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const overviewStats = {
    activeStudies: 12,
    totalParticipants: 847,
    pendingConsents: 23,
    complianceScore: 98,
    dataQualityScore: 94,
    protocolViolations: 3
  };

  const studyStatus = [
    { name: 'CARDIO-PREV-2024', phase: 'Phase III', participants: 245, completion: 78, status: 'active' },
    { name: 'NEURO-TRIAL-001', phase: 'Phase II', participants: 156, completion: 45, status: 'recruiting' },
    { name: 'ONCO-IMMUNEX', phase: 'Phase I', participants: 89, completion: 92, status: 'data_analysis' },
    { name: 'DIABETES-CTRL', phase: 'Phase IV', participants: 198, completion: 34, status: 'active' }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { color: 'bg-green-500', text: 'Active' },
      recruiting: { color: 'bg-blue-500', text: 'Recruiting' },
      data_analysis: { color: 'bg-orange-500', text: 'Data Analysis' },
      completed: { color: 'bg-gray-500', text: 'Completed' }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.active;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Research Data Management</h1>
          <p className="text-gray-600 mt-2">Comprehensive clinical research platform</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Audit Trail
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="protocols">Protocols</TabsTrigger>
          <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
          <TabsTrigger value="consent">Consent</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="portal">Portal</TabsTrigger>
          <TabsTrigger value="irb">IRB</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-900">{overviewStats.activeStudies}</p>
                    <p className="text-sm text-blue-700">Active Studies</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-900">{overviewStats.totalParticipants}</p>
                    <p className="text-sm text-green-700">Total Participants</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-900">{overviewStats.pendingConsents}</p>
                    <p className="text-sm text-orange-700">Pending Consents</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-900">{overviewStats.complianceScore}%</p>
                    <p className="text-sm text-purple-700">Compliance Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-teal-200 bg-teal-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Database className="h-8 w-8 text-teal-600" />
                  <div>
                    <p className="text-2xl font-bold text-teal-900">{overviewStats.dataQualityScore}%</p>
                    <p className="text-sm text-teal-700">Data Quality</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-900">{overviewStats.protocolViolations}</p>
                    <p className="text-sm text-red-700">Protocol Violations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Studies */}
          <Card>
            <CardHeader>
              <CardTitle>Active Research Studies</CardTitle>
              <CardDescription>Current clinical trials and research protocols</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studyStatus.map((study, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{study.name}</h4>
                        <p className="text-sm text-gray-600">{study.phase} • {study.participants} participants</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right min-w-0 flex-1">
                        <p className="text-sm text-gray-600 mb-1">Progress: {study.completion}%</p>
                        <Progress value={study.completion} className="w-32" />
                      </div>
                      <Badge className={`${getStatusBadge(study.status).color} text-white`}>
                        {getStatusBadge(study.status).text}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="protocols">
          <ProtocolManagement />
        </TabsContent>

        <TabsContent value="enrollment">
          <ParticipantEnrollment />
        </TabsContent>

        <TabsContent value="consent">
          <ConsentManagement />
        </TabsContent>

        <TabsContent value="timeline">
          <StudyTimeline />
        </TabsContent>

        <TabsContent value="portal">
          <ParticipantPortal />
        </TabsContent>

        <TabsContent value="irb">
          <IRBTracking />
        </TabsContent>

        <TabsContent value="compliance">
          <ComplianceMonitor />
        </TabsContent>
      </Tabs>
    </div>
  );
};
