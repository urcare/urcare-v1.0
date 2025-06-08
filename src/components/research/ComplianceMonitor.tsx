
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Users,
  Database,
  Lock,
  Eye,
  Download
} from 'lucide-react';

export const ComplianceMonitor = () => {
  const [selectedRegulation, setSelectedRegulation] = useState('21cfr11');

  const complianceOverview = {
    overallScore: 96,
    criticalIssues: 2,
    warnings: 8,
    passed: 142,
    lastAudit: '2024-01-20',
    nextAudit: '2024-04-20'
  };

  const regulatoryFrameworks = [
    {
      id: '21cfr11',
      name: '21 CFR Part 11',
      description: 'Electronic records and signatures',
      score: 95,
      status: 'compliant',
      requirements: 15,
      passed: 14,
      issues: 1
    },
    {
      id: 'gcp',
      name: 'Good Clinical Practice (GCP)',
      description: 'International ethical and scientific standards',
      score: 98,
      status: 'compliant',
      requirements: 25,
      passed: 24,
      issues: 1
    },
    {
      id: 'hipaa',
      name: 'HIPAA',
      description: 'Health Insurance Portability and Accountability',
      score: 92,
      status: 'compliant',
      requirements: 18,
      passed: 16,
      issues: 2
    },
    {
      id: 'gdpr',
      name: 'GDPR',
      description: 'General Data Protection Regulation',
      score: 94,
      status: 'compliant',
      requirements: 12,
      passed: 11,
      issues: 1
    }
  ];

  const complianceChecks = {
    '21cfr11': [
      {
        category: 'Electronic Signatures',
        requirement: 'Unique user identification',
        status: 'passed',
        description: 'Each user has unique login credentials',
        lastChecked: '2024-01-25'
      },
      {
        category: 'Electronic Signatures',
        requirement: 'Multi-factor authentication',
        status: 'passed',
        description: 'MFA implemented for all users',
        lastChecked: '2024-01-25'
      },
      {
        category: 'Audit Trail',
        requirement: 'Complete audit trail',
        status: 'warning',
        description: 'Some historical data missing audit entries',
        lastChecked: '2024-01-25'
      },
      {
        category: 'Data Integrity',
        requirement: 'Tamper-evident records',
        status: 'passed',
        description: 'Digital signatures and checksums implemented',
        lastChecked: '2024-01-25'
      },
      {
        category: 'Access Controls',
        requirement: 'Role-based access',
        status: 'passed',
        description: 'Proper role-based permissions in place',
        lastChecked: '2024-01-25'
      }
    ]
  };

  const securityMetrics = [
    {
      category: 'Data Encryption',
      score: 100,
      description: 'All data encrypted at rest and in transit',
      icon: Lock
    },
    {
      category: 'Access Monitoring',
      score: 94,
      description: 'User access continuously monitored',
      icon: Eye
    },
    {
      category: 'Backup & Recovery',
      score: 96,
      description: 'Regular backups with tested recovery',
      icon: Database
    },
    {
      category: 'User Training',
      score: 89,
      description: 'Staff compliance training up to date',
      icon: Users
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      compliant: 'bg-green-500',
      warning: 'bg-yellow-500',
      'non-compliant': 'bg-red-500'
    };
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Compliance Monitor</h2>
          <p className="text-gray-600">21 CFR Part 11 and regulatory compliance tracking</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Compliance Report
          </Button>
          <Button className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Run Audit
          </Button>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">{complianceOverview.overallScore}%</p>
            <p className="text-sm text-green-700">Overall Score</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-900">{complianceOverview.criticalIssues}</p>
            <p className="text-sm text-red-700">Critical Issues</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-900">{complianceOverview.warnings}</p>
            <p className="text-sm text-yellow-700">Warnings</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{complianceOverview.passed}</p>
            <p className="text-sm text-blue-700">Passed Checks</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-purple-900">{complianceOverview.lastAudit}</p>
            <p className="text-sm text-purple-700">Last Audit</p>
          </CardContent>
        </Card>
        <Card className="border-teal-200 bg-teal-50">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-teal-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-teal-900">{complianceOverview.nextAudit}</p>
            <p className="text-sm text-teal-700">Next Audit</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regulatory Frameworks */}
        <Card>
          <CardHeader>
            <CardTitle>Regulatory Frameworks</CardTitle>
            <CardDescription>Compliance status across different regulations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {regulatoryFrameworks.map((framework) => (
              <div key={framework.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{framework.name}</h4>
                  <Badge className={`${getStatusColor(framework.status)} text-white`}>
                    {framework.score}%
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{framework.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {framework.passed}/{framework.requirements} requirements
                  </span>
                  <span className="text-red-600">
                    {framework.issues} issue{framework.issues !== 1 ? 's' : ''}
                  </span>
                </div>
                <Progress value={framework.score} className="mt-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Security Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Security Metrics</CardTitle>
            <CardDescription>Data protection and security measures</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {securityMetrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                  <IconComponent className="h-8 w-8 text-blue-600" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">{metric.category}</h4>
                      <span className="text-sm font-medium text-gray-900">{metric.score}%</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{metric.description}</p>
                    <Progress value={metric.score} className="h-2" />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Compliance Checks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Detailed Compliance Checks</CardTitle>
              <CardDescription>Specific requirement compliance status</CardDescription>
            </div>
            <Select value={selectedRegulation} onValueChange={setSelectedRegulation}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select regulation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="21cfr11">21 CFR Part 11</SelectItem>
                <SelectItem value="gcp">Good Clinical Practice</SelectItem>
                <SelectItem value="hipaa">HIPAA</SelectItem>
                <SelectItem value="gdpr">GDPR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complianceChecks[selectedRegulation as keyof typeof complianceChecks]?.map((check, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
                {getStatusIcon(check.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{check.requirement}</h4>
                    <Badge variant="outline" className="text-xs">
                      {check.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{check.description}</p>
                  <p className="text-xs text-gray-500">Last checked: {check.lastChecked}</p>
                </div>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
