
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Archive, 
  Calendar, 
  Database, 
  Trash2, 
  Download, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Settings,
  BarChart
} from 'lucide-react';

interface RetentionPolicy {
  id: string;
  name: string;
  documentType: string;
  retentionPeriod: string;
  action: 'archive' | 'delete' | 'review';
  status: 'active' | 'paused' | 'draft';
  documentsAffected: number;
  lastRun: string;
  nextRun: string;
}

interface ArchivalJob {
  id: string;
  name: string;
  type: 'manual' | 'scheduled' | 'policy';
  status: 'running' | 'completed' | 'failed' | 'queued';
  progress: number;
  documentsProcessed: number;
  totalDocuments: number;
  startTime: string;
  estimatedCompletion?: string;
  policy?: string;
}

interface ComplianceReport {
  id: string;
  reportType: string;
  period: string;
  status: 'generated' | 'pending' | 'failed';
  documentsReviewed: number;
  complianceRate: number;
  generatedAt: string;
  size: string;
}

export const DocumentArchival = () => {
  const [activeTab, setActiveTab] = useState('policies');

  const retentionPolicies: RetentionPolicy[] = [
    {
      id: 'policy-1',
      name: 'Standard Medical Records',
      documentType: 'Medical Records',
      retentionPeriod: '7 years',
      action: 'archive',
      status: 'active',
      documentsAffected: 15780,
      lastRun: '2024-01-15',
      nextRun: '2024-02-01'
    },
    {
      id: 'policy-2',
      name: 'Lab Results Retention',
      documentType: 'Laboratory Reports',
      retentionPeriod: '3 years',
      action: 'archive',
      status: 'active',
      documentsAffected: 8945,
      lastRun: '2024-01-10',
      nextRun: '2024-01-25'
    },
    {
      id: 'policy-3',
      name: 'Temporary Documents',
      documentType: 'Draft Documents',
      retentionPeriod: '6 months',
      action: 'delete',
      status: 'active',
      documentsAffected: 2346,
      lastRun: '2024-01-20',
      nextRun: '2024-01-27'
    },
    {
      id: 'policy-4',
      name: 'Insurance Claims',
      documentType: 'Insurance Documents',
      retentionPeriod: '5 years',
      action: 'review',
      status: 'paused',
      documentsAffected: 4567,
      lastRun: '2024-01-05',
      nextRun: 'Paused'
    }
  ];

  const archivalJobs: ArchivalJob[] = [
    {
      id: 'job-1',
      name: 'Monthly Lab Report Archive',
      type: 'scheduled',
      status: 'running',
      progress: 65,
      documentsProcessed: 1300,
      totalDocuments: 2000,
      startTime: '2024-01-22 02:00',
      estimatedCompletion: '2024-01-22 04:30',
      policy: 'Lab Results Retention'
    },
    {
      id: 'job-2',
      name: 'Emergency Document Cleanup',
      type: 'manual',
      status: 'completed',
      progress: 100,
      documentsProcessed: 500,
      totalDocuments: 500,
      startTime: '2024-01-21 14:00',
      estimatedCompletion: '2024-01-21 14:45'
    },
    {
      id: 'job-3',
      name: 'Insurance Document Archive',
      type: 'policy',
      status: 'queued',
      progress: 0,
      documentsProcessed: 0,
      totalDocuments: 800,
      startTime: '2024-01-23 01:00',
      policy: 'Insurance Claims'
    }
  ];

  const complianceReports: ComplianceReport[] = [
    {
      id: 'report-1',
      reportType: 'HIPAA Compliance',
      period: 'Q4 2023',
      status: 'generated',
      documentsReviewed: 25680,
      complianceRate: 98.7,
      generatedAt: '2024-01-15',
      size: '12.4 MB'
    },
    {
      id: 'report-2',
      reportType: 'Data Retention Audit',
      period: 'January 2024',
      status: 'generated',
      documentsReviewed: 8945,
      complianceRate: 96.2,
      generatedAt: '2024-01-20',
      size: '8.7 MB'
    },
    {
      id: 'report-3',
      reportType: 'Archive Summary',
      period: 'December 2023',
      status: 'generated',
      documentsReviewed: 15340,
      complianceRate: 99.1,
      generatedAt: '2024-01-01',
      size: '15.2 MB'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'queued': return 'bg-gray-100 text-gray-800';
      case 'generated': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'running': return Clock;
      case 'completed': return CheckCircle;
      case 'failed': return AlertTriangle;
      case 'paused': return Clock;
      case 'queued': return Clock;
      default: return FileText;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'archive': return Archive;
      case 'delete': return Trash2;
      case 'review': return Shield;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Document Archival System</h2>
          <p className="text-gray-600">Automated retention policies, archival management, and compliance reporting</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configure Policies
          </Button>
          <Button className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            Start Archive Job
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="policies">Retention Policies</TabsTrigger>
          <TabsTrigger value="jobs">Archival Jobs</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Reports</TabsTrigger>
          <TabsTrigger value="storage">Storage Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="policies">
          <div className="space-y-4">
            {retentionPolicies.map(policy => {
              const StatusIcon = getStatusIcon(policy.status);
              const ActionIcon = getActionIcon(policy.action);
              
              return (
                <Card key={policy.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <ActionIcon className="h-6 w-6 text-blue-600" />
                          <div>
                            <h3 className="font-medium">{policy.name}</h3>
                            <p className="text-sm text-gray-600">{policy.documentType}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(policy.status)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {policy.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Retention Period</p>
                          <p className="font-medium">{policy.retentionPeriod}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Action</p>
                          <p className="font-medium capitalize">{policy.action}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Documents Affected</p>
                          <p className="font-medium">{policy.documentsAffected.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Next Run</p>
                          <p className="font-medium">{policy.nextRun}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Last run: {policy.lastRun}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Settings className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            {policy.status === 'paused' ? 'Resume' : 'Pause'}
                          </Button>
                          <Button size="sm" variant="outline">
                            Run Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="jobs">
          <div className="space-y-4">
            {archivalJobs.map(job => {
              const StatusIcon = getStatusIcon(job.status);
              
              return (
                <Card key={job.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Archive className="h-6 w-6 text-blue-600" />
                          <div>
                            <h3 className="font-medium">{job.name}</h3>
                            <p className="text-sm text-gray-600">
                              {job.type} • {job.policy && `Policy: ${job.policy}`}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(job.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {job.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{job.progress}%</span>
                          </div>
                          <Progress value={job.progress} className="h-2" />
                          <p className="text-xs text-gray-500">
                            {job.documentsProcessed.toLocaleString()} of {job.totalDocuments.toLocaleString()} documents
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Started</p>
                          <p className="font-medium">{job.startTime}</p>
                          {job.estimatedCompletion && (
                            <>
                              <p className="text-sm text-gray-600 mt-2">Est. Completion</p>
                              <p className="font-medium">{job.estimatedCompletion}</p>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {job.status === 'running' && (
                            <Button size="sm" variant="outline">
                              Pause
                            </Button>
                          )}
                          {job.status === 'queued' && (
                            <Button size="sm" variant="outline">
                              Cancel
                            </Button>
                          )}
                          {job.status === 'completed' && (
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3" />
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="compliance">
          <div className="space-y-4">
            {complianceReports.map(report => (
              <Card key={report.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="h-6 w-6 text-green-600" />
                        <div>
                          <h3 className="font-medium">{report.reportType}</h3>
                          <p className="text-sm text-gray-600">{report.period}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Documents Reviewed</p>
                        <p className="font-medium">{report.documentsReviewed.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Compliance Rate</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{report.complianceRate}%</p>
                          {report.complianceRate >= 95 ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Generated</p>
                        <p className="font-medium">{report.generatedAt}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">File Size</p>
                        <p className="font-medium">{report.size}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        Schedule Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="storage">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Storage</p>
                      <p className="text-2xl font-bold">2.4 TB</p>
                      <p className="text-sm text-blue-600">68% utilized</p>
                    </div>
                    <Database className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Archived This Month</p>
                      <p className="text-2xl font-bold">156 GB</p>
                      <p className="text-sm text-green-600">+23% from last month</p>
                    </div>
                    <Archive className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Documents Purged</p>
                      <p className="text-2xl font-bold">1,247</p>
                      <p className="text-sm text-red-600">Saved 45 GB</p>
                    </div>
                    <Trash2 className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Retention Score</p>
                      <p className="text-2xl font-bold">96.8%</p>
                      <p className="text-sm text-green-600">Excellent</p>
                    </div>
                    <BarChart className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Storage Analytics</CardTitle>
                <CardDescription>Storage usage and archival trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <BarChart className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">Storage analytics chart would be displayed here</p>
                    <p className="text-sm text-gray-500">Showing usage trends, archival rates, and projections</p>
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
