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
  Download,
  Calendar,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react';

export const ComplianceMonitor = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

  const complianceMetrics = {
    overallScore: 96,
    protocolAdherence: 94,
    dataQuality: 98,
    auditReadiness: 92,
    documentationScore: 95
  };

  const violations = [
    {
      id: 'VIO-001',
      type: 'Protocol Deviation',
      severity: 'minor',
      study: 'CARDIO-001',
      description: 'Visit window exceeded by 2 days',
      status: 'resolved',
      reportedDate: '2024-01-20',
      resolvedDate: '2024-01-22'
    },
    {
      id: 'VIO-002',
      type: 'Data Entry Error',
      severity: 'major',
      study: 'NEURO-002',
      description: 'Incorrect dosage recorded',
      status: 'investigating',
      reportedDate: '2024-01-18',
      resolvedDate: null
    },
    {
      id: 'VIO-003',
      type: 'Consent Issue',
      severity: 'critical',
      study: 'ONCO-003',
      description: 'Expired consent form used',
      status: 'corrective_action',
      reportedDate: '2024-01-15',
      resolvedDate: null
    }
  ];

  const auditHistory = [
    {
      id: 'AUD-001',
      date: '2024-01-15',
      type: 'Internal Audit',
      scope: 'Data Quality Review',
      findings: 3,
      status: 'completed',
      auditor: 'Internal QA Team'
    },
    {
      id: 'AUD-002',
      date: '2023-12-10',
      type: 'FDA Inspection',
      scope: 'Protocol Compliance',
      findings: 1,
      status: 'closed',
      auditor: 'FDA Inspector'
    },
    {
      id: 'AUD-003',
      date: '2023-11-20',
      type: 'Sponsor Audit',
      scope: 'Site Qualification',
      findings: 0,
      status: 'completed',
      auditor: 'Sponsor QA'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'major': return 'bg-orange-500';
      case 'minor': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-500';
      case 'investigating': return 'bg-blue-500';
      case 'corrective_action': return 'bg-orange-500';
      case 'completed': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Compliance Monitoring</h2>
          <p className="text-gray-600">21 CFR Part 11 compliance and audit management</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Compliance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{complianceMetrics.overallScore}%</p>
            <p className="text-sm text-blue-700">Overall Score</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">{complianceMetrics.protocolAdherence}%</p>
            <p className="text-sm text-green-700">Protocol Adherence</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">{complianceMetrics.dataQuality}%</p>
            <p className="text-sm text-purple-700">Data Quality</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-900">{complianceMetrics.auditReadiness}%</p>
            <p className="text-sm text-orange-700">Audit Readiness</p>
          </CardContent>
        </Card>
        <Card className="border-teal-200 bg-teal-50">
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-teal-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-teal-900">{complianceMetrics.documentationScore}%</p>
            <p className="text-sm text-teal-700">Documentation</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Protocol Violations */}
        <Card>
          <CardHeader>
            <CardTitle>Protocol Violations & Deviations</CardTitle>
            <CardDescription>Recent compliance issues and their resolution status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {violations.map((violation) => (
                <div key={violation.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Badge className={`${getSeverityColor(violation.severity)} text-white`}>
                        {violation.severity.charAt(0).toUpperCase() + violation.severity.slice(1)}
                      </Badge>
                      <span className="font-medium text-gray-900">{violation.type}</span>
                    </div>
                    <Badge className={`${getStatusColor(violation.status)} text-white`}>
                      {violation.status.replace('_', ' ').charAt(0).toUpperCase() + violation.status.replace('_', ' ').slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{violation.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Study: {violation.study}</span>
                    <span>Reported: {violation.reportedDate}</span>
                    {violation.resolvedDate && <span>Resolved: {violation.resolvedDate}</span>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Audit History */}
        <Card>
          <CardHeader>
            <CardTitle>Audit History</CardTitle>
            <CardDescription>Recent audits and inspection records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auditHistory.map((audit) => (
                <div key={audit.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{audit.type}</h4>
                      <p className="text-sm text-gray-600">{audit.scope}</p>
                    </div>
                    <Badge className={`${getStatusColor(audit.status)} text-white`}>
                      {audit.status.charAt(0).toUpperCase() + audit.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {audit.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {audit.auditor}
                    </span>
                  </div>
                  {audit.findings > 0 && (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-orange-700">{audit.findings} findings identified</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
