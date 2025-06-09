
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield,
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
  FileText,
  Clock,
  Users,
  BarChart3
} from 'lucide-react';

export const QualityAssuranceInterface = () => {
  const [selectedCheck, setSelectedCheck] = useState(null);

  const qaChecks = [
    {
      id: 1,
      name: 'HIPAA Compliance Verification',
      category: 'Privacy & Security',
      status: 'passed',
      lastRun: '2024-06-09 14:30',
      score: 98.5,
      issues: 0,
      automated: true
    },
    {
      id: 2,
      name: 'Clinical Documentation Review',
      category: 'Clinical Quality',
      status: 'warning',
      lastRun: '2024-06-09 14:25',
      score: 89.2,
      issues: 3,
      automated: true
    },
    {
      id: 3,
      name: 'Billing Code Accuracy Check',
      category: 'Financial',
      status: 'failed',
      lastRun: '2024-06-09 14:20',
      score: 76.8,
      issues: 12,
      automated: true
    },
    {
      id: 4,
      name: 'Medication Safety Protocol',
      category: 'Patient Safety',
      status: 'passed',
      lastRun: '2024-06-09 14:15',
      score: 96.1,
      issues: 1,
      automated: true
    }
  ];

  const complianceMetrics = [
    {
      category: 'Patient Safety',
      score: 94.8,
      trend: 'up',
      checks: 156,
      issues: 8
    },
    {
      category: 'Clinical Quality',
      score: 91.2,
      trend: 'down',
      checks: 203,
      issues: 15
    },
    {
      category: 'Privacy & Security',
      score: 97.6,
      trend: 'up',
      checks: 89,
      issues: 2
    },
    {
      category: 'Financial',
      score: 88.4,
      trend: 'up',
      checks: 124,
      issues: 18
    }
  ];

  const recentIssues = [
    {
      id: 1,
      title: 'Incomplete patient discharge summary',
      category: 'Clinical Quality',
      severity: 'medium',
      detected: '2024-06-09 14:28',
      status: 'resolved',
      assignedTo: 'Dr. Smith',
      resolution: 'Documentation completed and reviewed'
    },
    {
      id: 2,
      title: 'Billing code mismatch detected',
      category: 'Financial',
      severity: 'high',
      detected: '2024-06-09 14:22',
      status: 'pending',
      assignedTo: 'Billing Team',
      resolution: null
    },
    {
      id: 3,
      title: 'Medication dosage outside normal range',
      category: 'Patient Safety',
      severity: 'high',
      detected: '2024-06-09 14:18',
      status: 'resolved',
      assignedTo: 'Pharmacy',
      resolution: 'Physician consulted, dosage confirmed correct'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-orange-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* QA Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">93.2%</div>
            <div className="text-sm text-gray-600">Overall QA Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">572</div>
            <div className="text-sm text-gray-600">Automated Checks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">43</div>
            <div className="text-sm text-gray-600">Active Issues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">15min</div>
            <div className="text-sm text-gray-600">Avg Resolution Time</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="checks" className="w-full">
        <TabsList>
          <TabsTrigger value="checks">Quality Checks</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
        </TabsList>

        <TabsContent value="checks" className="space-y-4">
          {/* Automated Quality Checks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Automated Quality Assurance Checks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qaChecks.map((check) => (
                  <div key={check.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(check.status)}
                      <div>
                        <div className="font-medium">{check.name}</div>
                        <div className="text-sm text-gray-600">{check.category}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3" />
                          Last run: {check.lastRun}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{check.score}%</div>
                        <div className="text-sm text-gray-600">
                          {check.issues} issues found
                        </div>
                      </div>
                      <Badge className={getStatusColor(check.status)}>
                        {check.status}
                      </Badge>
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

        <TabsContent value="compliance" className="space-y-4">
          {/* Compliance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Compliance Monitoring Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Shield className="h-8 w-8 text-blue-600" />
                      <div>
                        <div className="font-medium">{metric.category}</div>
                        <div className="text-sm text-gray-600">
                          {metric.checks} checks • {metric.issues} issues
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{metric.score}%</div>
                        <div className={`text-sm flex items-center gap-1 ${
                          metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <TrendingUp className={`h-3 w-3 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                          {metric.trend === 'up' ? 'Improving' : 'Declining'}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Trends
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          {/* Recent Issues */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Recent Quality Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentIssues.map((issue) => (
                  <div key={issue.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(issue.status)}
                      <div>
                        <div className="font-medium">{issue.title}</div>
                        <div className="text-sm text-gray-600">{issue.category}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-4 mt-1">
                          <span>Detected: {issue.detected}</span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {issue.assignedTo}
                          </span>
                        </div>
                        {issue.resolution && (
                          <div className="text-xs text-green-600 mt-1">
                            Resolution: {issue.resolution}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge className={getSeverityColor(issue.severity)}>
                        {issue.severity} severity
                      </Badge>
                      <Badge className={getStatusColor(issue.status)}>
                        {issue.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
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
