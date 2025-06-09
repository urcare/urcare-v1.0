
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  Shield, 
  AlertTriangle,
  FileText,
  Mail,
  Download,
  Upload,
  Eye,
  Lock,
  Users
} from 'lucide-react';

interface DLPPolicy {
  id: string;
  name: string;
  type: 'content' | 'context' | 'user' | 'device';
  enabled: boolean;
  severity: 'critical' | 'high' | 'medium' | 'low';
  violations: number;
  actions: string[];
  description: string;
}

interface DLPViolation {
  id: string;
  policyId: string;
  timestamp: Date;
  user: string;
  action: 'email' | 'download' | 'print' | 'upload' | 'copy';
  dataType: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'reviewing' | 'resolved' | 'false_positive';
  details: string;
}

interface DataClassification {
  type: string;
  count: number;
  protected: number;
  risk: 'high' | 'medium' | 'low';
  compliance: string[];
}

export const DataLossPreventionInterface = () => {
  const [dlpPolicies, setDlpPolicies] = useState<DLPPolicy[]>([
    {
      id: 'policy-001',
      name: 'Patient Health Information',
      type: 'content',
      enabled: true,
      severity: 'critical',
      violations: 12,
      actions: ['block', 'alert', 'encrypt'],
      description: 'Detect and protect PHI data patterns'
    },
    {
      id: 'policy-002',
      name: 'Financial Data Protection',
      type: 'content',
      enabled: true,
      severity: 'high',
      violations: 8,
      actions: ['alert', 'encrypt'],
      description: 'Protect credit card and financial information'
    },
    {
      id: 'policy-003',
      name: 'External Email Monitoring',
      type: 'context',
      enabled: true,
      severity: 'medium',
      violations: 23,
      actions: ['alert', 'quarantine'],
      description: 'Monitor sensitive data in outbound emails'
    },
    {
      id: 'policy-004',
      name: 'USB Device Control',
      type: 'device',
      enabled: false,
      severity: 'high',
      violations: 5,
      actions: ['block', 'alert'],
      description: 'Control data transfer to USB devices'
    }
  ]);

  const [violations, setViolations] = useState<DLPViolation[]>([
    {
      id: 'v001',
      policyId: 'policy-001',
      timestamp: new Date(Date.now() - 300000),
      user: 'dr.smith@hospital.com',
      action: 'email',
      dataType: 'Patient SSN',
      severity: 'critical',
      status: 'open',
      details: 'Attempted to email patient SSN to external recipient'
    },
    {
      id: 'v002',
      policyId: 'policy-002',
      timestamp: new Date(Date.now() - 600000),
      user: 'finance.admin@hospital.com',
      action: 'download',
      dataType: 'Credit Card Data',
      severity: 'high',
      status: 'reviewing',
      details: 'Downloaded file containing credit card numbers'
    },
    {
      id: 'v003',
      policyId: 'policy-003',
      timestamp: new Date(Date.now() - 900000),
      user: 'nurse.jones@hospital.com',
      action: 'print',
      dataType: 'Patient Records',
      severity: 'medium',
      status: 'resolved',
      details: 'Printed document with patient information'
    }
  ]);

  const [dataClassifications] = useState<DataClassification[]>([
    {
      type: 'Patient Health Information',
      count: 1245780,
      protected: 1198234,
      risk: 'high',
      compliance: ['HIPAA', 'GDPR']
    },
    {
      type: 'Financial Data',
      count: 567890,
      protected: 543210,
      risk: 'high',
      compliance: ['PCI-DSS', 'SOX']
    },
    {
      type: 'Personal Identifiers',
      count: 987654,
      protected: 923456,
      risk: 'medium',
      compliance: ['GDPR', 'CCPA']
    },
    {
      type: 'Intellectual Property',
      count: 234567,
      protected: 234567,
      risk: 'medium',
      compliance: ['Internal']
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'reviewing': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'false_positive': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'email': return Mail;
      case 'download': return Download;
      case 'upload': return Upload;
      case 'print': return FileText;
      case 'copy': return Eye;
      default: return AlertTriangle;
    }
  };

  const formatTime = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  const togglePolicy = (policyId: string) => {
    setDlpPolicies(prev => 
      prev.map(policy => 
        policy.id === policyId 
          ? { ...policy, enabled: !policy.enabled }
          : policy
      )
    );
  };

  const totalViolations = violations.length;
  const openViolations = violations.filter(v => v.status === 'open').length;
  const activePolicies = dlpPolicies.filter(p => p.enabled).length;
  const protectionRate = Math.round(
    (dataClassifications.reduce((sum, dc) => sum + dc.protected, 0) /
     dataClassifications.reduce((sum, dc) => sum + dc.count, 0)) * 100
  );

  return (
    <div className="space-y-6">
      {/* DLP Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Loss Prevention Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{openViolations}</div>
              <div className="text-sm text-gray-600">Open Violations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{totalViolations}</div>
              <div className="text-sm text-gray-600">Total Violations (24h)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{activePolicies}</div>
              <div className="text-sm text-gray-600">Active Policies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{protectionRate}%</div>
              <div className="text-sm text-gray-600">Protection Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Classification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data Classification & Protection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dataClassifications.map((classification, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">{classification.type}</div>
                      <div className="text-sm text-gray-600">
                        {classification.count.toLocaleString()} records
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRiskColor(classification.risk)}>
                      {classification.risk} risk
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Protection Coverage</span>
                    <span className="font-medium">
                      {classification.protected.toLocaleString()} / {classification.count.toLocaleString()}
                      ({Math.round((classification.protected / classification.count) * 100)}%)
                    </span>
                  </div>
                  <Progress 
                    value={Math.round((classification.protected / classification.count) * 100)} 
                    className="h-2" 
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Compliance:</span>
                  <div className="flex flex-wrap gap-1">
                    {classification.compliance.map((comp) => (
                      <Badge key={comp} variant="outline" className="text-xs">
                        {comp}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* DLP Policies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              DLP Policies
            </span>
            <Button>
              Create Policy
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dlpPolicies.map((policy) => (
              <div key={policy.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${policy.enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <div>
                      <div className="font-medium">{policy.name}</div>
                      <div className="text-sm text-gray-600">{policy.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(policy.severity)}>
                      {policy.severity}
                    </Badge>
                    <Switch
                      checked={policy.enabled}
                      onCheckedChange={() => togglePolicy(policy.id)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Type:</span>
                    <span className="ml-2">{policy.type}</span>
                  </div>
                  <div>
                    <span className="font-medium">Violations:</span>
                    <span className="ml-2 text-red-600">{policy.violations}</span>
                  </div>
                  <div>
                    <span className="font-medium">Actions:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {policy.actions.map((action) => (
                        <Badge key={action} variant="outline" className="text-xs">
                          {action}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Edit Policy
                  </Button>
                  <Button size="sm" variant="outline">
                    View Violations
                  </Button>
                  <Button size="sm" variant="outline">
                    Test Policy
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Violations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Recent Policy Violations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {violations.map((violation) => {
              const ActionIcon = getActionIcon(violation.action);
              const policy = dlpPolicies.find(p => p.id === violation.policyId);
              
              return (
                <div key={violation.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ActionIcon className={`h-5 w-5 ${
                        violation.severity === 'critical' ? 'text-red-600' :
                        violation.severity === 'high' ? 'text-orange-600' :
                        violation.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`} />
                      <div>
                        <div className="font-medium">{violation.details}</div>
                        <div className="text-sm text-gray-600">{formatTime(violation.timestamp)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(violation.severity)}>
                        {violation.severity}
                      </Badge>
                      <Badge className={getStatusColor(violation.status)}>
                        {violation.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">User:</span>
                      <span className="ml-2">{violation.user}</span>
                    </div>
                    <div>
                      <span className="font-medium">Action:</span>
                      <span className="ml-2">{violation.action}</span>
                    </div>
                    <div>
                      <span className="font-medium">Data Type:</span>
                      <span className="ml-2">{violation.dataType}</span>
                    </div>
                    <div>
                      <span className="font-medium">Policy:</span>
                      <span className="ml-2">{policy?.name}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Investigate
                    </Button>
                    <Button size="sm" variant="outline">
                      Approve
                    </Button>
                    <Button size="sm" variant="outline">
                      Mark False Positive
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Remediation Workflows */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Automated Remediation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Content Encryption</h4>
              <p className="text-sm text-gray-600 mb-3">
                Automatically encrypt sensitive content before transmission
              </p>
              <div className="flex justify-between items-center">
                <Badge className="bg-green-100 text-green-800">Active</Badge>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Email Quarantine</h4>
              <p className="text-sm text-gray-600 mb-3">
                Quarantine emails containing sensitive data
              </p>
              <div className="flex justify-between items-center">
                <Badge className="bg-green-100 text-green-800">Active</Badge>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">User Training</h4>
              <p className="text-sm text-gray-600 mb-3">
                Trigger training for users with violations
              </p>
              <div className="flex justify-between items-center">
                <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
