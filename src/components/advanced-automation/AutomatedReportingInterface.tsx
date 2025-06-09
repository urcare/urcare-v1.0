
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText,
  Calendar,
  Users,
  Send,
  Clock,
  CheckCircle,
  Settings,
  Plus,
  Download,
  Edit,
  Eye
} from 'lucide-react';

export const AutomatedReportingInterface = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const reportTemplates = [
    {
      id: 1,
      name: 'Daily Patient Census Report',
      description: 'Summary of patient admissions, discharges, and occupancy',
      frequency: 'Daily',
      nextRun: '2024-06-10 06:00 AM',
      recipients: ['admin@hospital.com', 'nursing@hospital.com'],
      status: 'active',
      lastGenerated: '2024-06-09 06:00 AM'
    },
    {
      id: 2,
      name: 'Weekly Financial Summary',
      description: 'Revenue, expenses, and billing analytics',
      frequency: 'Weekly',
      nextRun: '2024-06-10 09:00 AM',
      recipients: ['finance@hospital.com', 'admin@hospital.com'],
      status: 'active',
      lastGenerated: '2024-06-03 09:00 AM'
    },
    {
      id: 3,
      name: 'Monthly Quality Metrics',
      description: 'Patient satisfaction, clinical outcomes, and compliance metrics',
      frequency: 'Monthly',
      nextRun: '2024-07-01 08:00 AM',
      recipients: ['quality@hospital.com', 'medical-director@hospital.com'],
      status: 'active',
      lastGenerated: '2024-06-01 08:00 AM'
    }
  ];

  const recentReports = [
    {
      id: 1,
      name: 'Daily Patient Census Report',
      generated: '2024-06-09 06:00 AM',
      status: 'completed',
      recipients: 3,
      size: '2.4 MB'
    },
    {
      id: 2,
      name: 'Emergency Department Analytics',
      generated: '2024-06-09 05:30 AM',
      status: 'completed',
      recipients: 5,
      size: '1.8 MB'
    },
    {
      id: 3,
      name: 'Staff Scheduling Report',
      generated: '2024-06-09 05:00 AM',
      status: 'failed',
      recipients: 0,
      size: '0 MB'
    }
  ];

  const scheduledReports = [
    {
      id: 1,
      name: 'Daily Patient Census Report',
      scheduledTime: '2024-06-10 06:00 AM',
      status: 'pending',
      recipients: 3
    },
    {
      id: 2,
      name: 'Weekly Financial Summary',
      scheduledTime: '2024-06-10 09:00 AM',
      status: 'pending',
      recipients: 2
    },
    {
      id: 3,
      name: 'Lab Results Summary',
      scheduledTime: '2024-06-10 07:00 AM',
      status: 'processing',
      recipients: 4
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'processing': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="templates" className="w-full">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="recent">Recent Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          {/* Report Templates */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Report Templates</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </div>

          <div className="grid gap-4">
            {reportTemplates.map((template) => (
              <Card key={template.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-gray-600">{template.description}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {template.frequency}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {template.recipients.length} recipients
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Next: {template.nextRun}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge className={getStatusColor(template.status)}>
                        {template.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          {/* Scheduled Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Scheduled Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(report.status)}
                      <div>
                        <div className="font-medium">{report.name}</div>
                        <div className="text-sm text-gray-600">
                          Scheduled for: {report.scheduledTime}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">{report.recipients} recipients</div>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(report.status)}
                      <div>
                        <div className="font-medium">{report.name}</div>
                        <div className="text-sm text-gray-600">
                          Generated: {report.generated}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          {report.recipients} recipients • {report.size}
                        </div>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
