
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  Download,
  Eye,
  Settings,
  Clock,
  Users
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';

export const ComplianceReportingSystem = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const complianceMetrics = [
    { label: 'Overall Compliance', value: '94.2%', target: '95%', status: 'warning' },
    { label: 'Training Completion', value: '89%', target: '90%', status: 'warning' },
    { label: 'Document Compliance', value: '97%', target: '95%', status: 'good' },
    { label: 'Audit Readiness', value: '92%', target: '90%', status: 'good' }
  ];

  const complianceAreas = [
    {
      name: 'Training & Certification',
      score: 89,
      trend: 'improving',
      items: [
        { requirement: 'HIPAA Training', completion: 94, due: '2024-06-30' },
        { requirement: 'Fire Safety Training', completion: 87, due: '2024-07-15' },
        { requirement: 'Infection Control', completion: 91, due: '2024-08-01' }
      ]
    },
    {
      name: 'Documentation & Records',
      score: 97,
      trend: 'stable',
      items: [
        { requirement: 'Employee Files', completion: 98, due: 'Ongoing' },
        { requirement: 'Performance Reviews', completion: 95, due: 'Quarterly' },
        { requirement: 'Incident Reports', completion: 99, due: 'As needed' }
      ]
    },
    {
      name: 'Regulatory Requirements',
      score: 92,
      trend: 'improving',
      items: [
        { requirement: 'OSHA Compliance', completion: 93, due: '2024-12-31' },
        { requirement: 'Background Checks', completion: 90, due: 'Annual' },
        { requirement: 'License Verification', completion: 94, due: 'Quarterly' }
      ]
    }
  ];

  const auditHistory = [
    {
      id: '1',
      date: '2024-05-15',
      type: 'Internal Audit',
      scope: 'Training Compliance',
      result: 'Pass',
      findings: 3,
      recommendations: 5
    },
    {
      id: '2',
      date: '2024-04-10',
      type: 'External Audit',
      scope: 'HIPAA Compliance',
      result: 'Pass with Conditions',
      findings: 7,
      recommendations: 12
    },
    {
      id: '3',
      date: '2024-03-20',
      type: 'Regulatory Review',
      scope: 'Employee Records',
      result: 'Pass',
      findings: 2,
      recommendations: 3
    }
  ];

  const complianceTrends = [
    { month: 'Jan', training: 85, documentation: 95, regulatory: 88 },
    { month: 'Feb', training: 87, documentation: 96, regulatory: 89 },
    { month: 'Mar', training: 86, documentation: 97, regulatory: 90 },
    { month: 'Apr', training: 88, documentation: 97, regulatory: 91 },
    { month: 'May', training: 89, documentation: 97, regulatory: 92 },
    { month: 'Jun', training: 89, documentation: 97, regulatory: 92 }
  ];

  const upcomingRequirements = [
    {
      requirement: 'Annual HIPAA Training',
      dueDate: '2024-06-30',
      status: 'urgent',
      completion: 78,
      department: 'All Staff'
    },
    {
      requirement: 'Fire Safety Certification',
      dueDate: '2024-07-15',
      status: 'due_soon',
      completion: 65,
      department: 'Clinical Staff'
    },
    {
      requirement: 'Background Check Renewals',
      dueDate: '2024-08-01',
      status: 'scheduled',
      completion: 45,
      department: 'New Hires'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      good: { label: 'Compliant', className: 'bg-green-100 text-green-800' },
      warning: { label: 'Attention Needed', className: 'bg-yellow-100 text-yellow-800' },
      critical: { label: 'Non-Compliant', className: 'bg-red-100 text-red-800' }
    };
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getUrgencyBadge = (status) => {
    const urgencyConfig = {
      urgent: { label: 'Urgent', className: 'bg-red-100 text-red-800' },
      due_soon: { label: 'Due Soon', className: 'bg-yellow-100 text-yellow-800' },
      scheduled: { label: 'Scheduled', className: 'bg-blue-100 text-blue-800' }
    };
    const config = urgencyConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getResultBadge = (result) => {
    if (result === 'Pass') return <Badge className="bg-green-100 text-green-800">Pass</Badge>;
    if (result === 'Pass with Conditions') return <Badge className="bg-yellow-100 text-yellow-800">Pass with Conditions</Badge>;
    return <Badge className="bg-red-100 text-red-800">Fail</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Compliance Reporting System</h3>
          <p className="text-gray-600">Comprehensive compliance tracking with automated reporting and audit trails</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Compliance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {complianceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">{metric.label}</p>
                {getStatusBadge(metric.status)}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-xs text-gray-500">Target: {metric.target}</p>
                </div>
                <div className="text-right">
                  {metric.status === 'good' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Compliance Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Compliance Trends
          </CardTitle>
          <CardDescription>Monthly compliance scores across key areas</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              training: { label: "Training", color: "#3b82f6" },
              documentation: { label: "Documentation", color: "#10b981" },
              regulatory: { label: "Regulatory", color: "#f59e0b" }
            }}
            className="h-64"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={complianceTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="training" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="documentation" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="regulatory" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Compliance Areas */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Areas</CardTitle>
          <CardDescription>Detailed breakdown of compliance requirements by area</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {complianceAreas.map((area, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium">{area.name}</h4>
                    <p className="text-sm text-gray-600">Overall Score: {area.score}%</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Progress value={area.score} className="w-24 h-2" />
                    <Badge variant={area.trend === 'improving' ? 'default' : 'secondary'}>
                      {area.trend}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {area.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium text-sm">{item.requirement}</p>
                        <p className="text-xs text-gray-500">Due: {item.due}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.completion}%</span>
                        <Progress value={item.completion} className="w-16 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Requirements
            </CardTitle>
            <CardDescription>Critical compliance deadlines and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingRequirements.map((req, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{req.requirement}</h4>
                    {getUrgencyBadge(req.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    <div>
                      <p className="text-gray-600">Due Date</p>
                      <p className="font-medium">{req.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Department</p>
                      <p className="font-medium">{req.department}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <Progress value={req.completion} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{req.completion}%</span>
                    </div>
                    <Button size="sm" variant="outline" className="ml-3">
                      Track
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Audit History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Audit History
            </CardTitle>
            <CardDescription>Recent audit results and findings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auditHistory.map((audit) => (
                <div key={audit.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{audit.type}</h4>
                      <p className="text-sm text-gray-600">{audit.date}</p>
                    </div>
                    {getResultBadge(audit.result)}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">Scope: {audit.scope}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Findings</p>
                      <p className="font-medium">{audit.findings}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Recommendations</p>
                      <p className="font-medium">{audit.recommendations}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      View Report
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Active Compliance Alerts
          </CardTitle>
          <CardDescription>Items requiring immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="font-medium text-red-800">Critical: HIPAA Training Deadline</span>
              </div>
              <p className="text-sm text-red-700">22% of staff have not completed mandatory HIPAA training due June 30, 2024</p>
            </div>
            
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">Warning: Documentation Review</span>
              </div>
              <p className="text-sm text-yellow-700">15 employee files require updated performance reviews</p>
            </div>
            
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">Info: Scheduled Audit</span>
              </div>
              <p className="text-sm text-blue-700">External compliance audit scheduled for July 15, 2024</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
