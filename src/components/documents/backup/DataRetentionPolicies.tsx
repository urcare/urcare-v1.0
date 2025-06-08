
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  FileText, 
  Calendar, 
  Shield, 
  Trash2, 
  Archive,
  Clock,
  AlertTriangle,
  CheckCircle,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface RetentionPolicy {
  id: string;
  name: string;
  dataType: string;
  retentionPeriod: string;
  action: 'archive' | 'delete' | 'transfer';
  status: 'active' | 'inactive' | 'expired';
  compliance: string[];
  autoClassification: boolean;
  itemsAffected: number;
  nextExecution: string;
}

interface ClassificationRule {
  id: string;
  name: string;
  criteria: string;
  dataType: string;
  confidence: number;
  status: 'active' | 'learning' | 'disabled';
}

export const DataRetentionPolicies = () => {
  const [selectedPolicy, setSelectedPolicy] = useState<string>('');
  const [autoClassificationEnabled, setAutoClassificationEnabled] = useState(true);

  const retentionPolicies: RetentionPolicy[] = [
    {
      id: 'policy-1',
      name: 'Medical Records - Adult Patients',
      dataType: 'Medical Records',
      retentionPeriod: '7 years',
      action: 'archive',
      status: 'active',
      compliance: ['HIPAA', 'State Law'],
      autoClassification: true,
      itemsAffected: 15420,
      nextExecution: '2024-01-25'
    },
    {
      id: 'policy-2',
      name: 'Pediatric Records',
      dataType: 'Medical Records',
      retentionPeriod: '21 years',
      action: 'archive',
      status: 'active',
      compliance: ['HIPAA', 'Pediatric Requirements'],
      autoClassification: true,
      itemsAffected: 5670,
      nextExecution: '2024-01-30'
    },
    {
      id: 'policy-3',
      name: 'Administrative Documents',
      dataType: 'Administrative',
      retentionPeriod: '3 years',
      action: 'delete',
      status: 'active',
      compliance: ['Internal Policy'],
      autoClassification: false,
      itemsAffected: 2340,
      nextExecution: '2024-02-01'
    },
    {
      id: 'policy-4',
      name: 'Financial Records',
      dataType: 'Financial',
      retentionPeriod: '7 years',
      action: 'transfer',
      status: 'active',
      compliance: ['SOX', 'IRS Requirements'],
      autoClassification: true,
      itemsAffected: 8920,
      nextExecution: '2024-01-28'
    }
  ];

  const classificationRules: ClassificationRule[] = [
    {
      id: 'rule-1',
      name: 'Patient Demographics',
      criteria: 'Contains PII + Medical ID',
      dataType: 'Medical Records',
      confidence: 95,
      status: 'active'
    },
    {
      id: 'rule-2',
      name: 'Lab Results',
      criteria: 'Lab test codes + numeric values',
      dataType: 'Medical Records',
      confidence: 88,
      status: 'active'
    },
    {
      id: 'rule-3',
      name: 'Financial Transactions',
      criteria: 'Transaction IDs + monetary amounts',
      dataType: 'Financial',
      confidence: 92,
      status: 'learning'
    }
  ];

  const complianceReports = [
    { framework: 'HIPAA', compliance: 98, lastAudit: '2024-01-15', nextAudit: '2024-04-15' },
    { framework: 'SOX', compliance: 95, lastAudit: '2024-01-10', nextAudit: '2024-04-10' },
    { framework: 'State Medical Records Law', compliance: 100, lastAudit: '2024-01-12', nextAudit: '2024-04-12' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'learning': return 'bg-blue-100 text-blue-800';
      case 'disabled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'archive': return Archive;
      case 'delete': return Trash2;
      case 'transfer': return FileText;
      default: return FileText;
    }
  };

  const handlePolicyAction = (policyId: string, action: 'execute' | 'pause' | 'delete') => {
    toast.success(`Policy ${action}d successfully`);
  };

  const handleCreatePolicy = () => {
    toast.success('New retention policy created');
  };

  return (
    <div className="space-y-6">
      {/* Policy Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Retention Policies
              </CardTitle>
              <CardDescription>Manage automated data retention and archival policies</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy Name</TableHead>
                    <TableHead>Data Type</TableHead>
                    <TableHead>Retention Period</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {retentionPolicies.map((policy) => {
                    const ActionIcon = getActionIcon(policy.action);
                    return (
                      <TableRow key={policy.id}>
                        <TableCell className="font-medium">{policy.name}</TableCell>
                        <TableCell>{policy.dataType}</TableCell>
                        <TableCell>{policy.retentionPeriod}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <ActionIcon className="h-3 w-3" />
                            <span className="capitalize">{policy.action}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(policy.status)}>
                            {policy.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{policy.itemsAffected.toLocaleString()}</TableCell>
                        <TableCell>{policy.nextExecution}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePolicyAction(policy.id, 'execute')}
                            >
                              Execute
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handlePolicyAction(policy.id, 'pause')}
                            >
                              <Settings className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Create New Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Create Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Policy Name</label>
                <Input placeholder="Enter policy name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical">Medical Records</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="administrative">Administrative</SelectItem>
                    <SelectItem value="imaging">Medical Imaging</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Retention Period</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-year">1 Year</SelectItem>
                    <SelectItem value="3-years">3 Years</SelectItem>
                    <SelectItem value="7-years">7 Years</SelectItem>
                    <SelectItem value="21-years">21 Years</SelectItem>
                    <SelectItem value="permanent">Permanent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Action</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="archive">Archive</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreatePolicy} className="w-full">
                Create Policy
              </Button>
            </CardContent>
          </Card>

          {/* Auto Classification */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Auto Classification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">AI-Powered Classification</p>
                  <p className="text-sm text-gray-600">Automatically classify documents</p>
                </div>
                <Switch
                  checked={autoClassificationEnabled}
                  onCheckedChange={setAutoClassificationEnabled}
                />
              </div>
              
              <div className="space-y-2">
                <p className="font-medium text-sm">Classification Rules</p>
                {classificationRules.slice(0, 3).map((rule) => (
                  <div key={rule.id} className="p-2 border rounded text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{rule.name}</span>
                      <Badge className={getStatusColor(rule.status)} variant="secondary">
                        {rule.confidence}%
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-xs mt-1">{rule.criteria}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Compliance Reporting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Compliance Reporting
          </CardTitle>
          <CardDescription>Monitor compliance with regulatory requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {complianceReports.map((report, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{report.framework}</h4>
                  <Badge className={report.compliance >= 95 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {report.compliance >= 95 ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
                    {report.compliance}%
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Last Audit:</span>
                    <span>{report.lastAudit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Audit:</span>
                    <span>{report.nextAudit}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  <FileText className="h-3 w-3 mr-1" />
                  Generate Report
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
