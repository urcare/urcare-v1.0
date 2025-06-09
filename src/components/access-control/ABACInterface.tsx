
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Shield,
  Users,
  Settings,
  Plus,
  Edit,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const ABACInterface = () => {
  const [attributes, setAttributes] = useState([
    {
      id: 'ATTR001',
      name: 'Department',
      type: 'String',
      values: ['Cardiology', 'Neurology', 'Emergency', 'Radiology'],
      description: 'User department assignment'
    },
    {
      id: 'ATTR002',
      name: 'Clearance Level',
      type: 'Number',
      values: ['1', '2', '3', '4', '5'],
      description: 'Security clearance level'
    },
    {
      id: 'ATTR003',
      name: 'Shift',
      type: 'String',
      values: ['Day', 'Night', 'Weekend'],
      description: 'Work shift schedule'
    }
  ]);

  const [policies, setPolicies] = useState([
    {
      id: 'POLICY001',
      name: 'Patient Records Access',
      rule: 'Department = "Cardiology" AND ClearanceLevel >= 3',
      resource: 'Patient Medical Records',
      action: 'Read',
      status: 'Active',
      lastModified: '2024-01-22'
    },
    {
      id: 'POLICY002',
      name: 'Emergency Override',
      rule: 'Department = "Emergency" OR Role = "Doctor"',
      resource: 'All Patient Data',
      action: 'Read/Write',
      status: 'Active',
      lastModified: '2024-01-20'
    },
    {
      id: 'POLICY003',
      name: 'Administrative Functions',
      rule: 'Role = "Admin" AND ClearanceLevel = 5',
      resource: 'System Configuration',
      action: 'All',
      status: 'Draft',
      lastModified: '2024-01-18'
    }
  ]);

  const [accessDecisions, setAccessDecisions] = useState([
    {
      id: 'DEC001',
      user: 'Dr. Sarah Johnson',
      resource: 'Patient Record #12345',
      action: 'Read',
      decision: 'Permit',
      reason: 'User department matches patient assignment',
      timestamp: '2024-01-22 14:30:00'
    },
    {
      id: 'DEC002',
      user: 'Nurse Mike Chen',
      resource: 'Medication Orders',
      action: 'Write',
      decision: 'Deny',
      reason: 'Insufficient clearance level',
      timestamp: '2024-01-22 14:25:00'
    },
    {
      id: 'DEC003',
      user: 'Admin Jane Smith',
      resource: 'User Management',
      action: 'Delete',
      decision: 'Permit',
      reason: 'Administrative privileges confirmed',
      timestamp: '2024-01-22 14:20:00'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'Permit': return 'bg-green-100 text-green-800';
      case 'Deny': return 'bg-red-100 text-red-800';
      case 'Indeterminate': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* ABAC Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{attributes.length}</div>
            <div className="text-sm text-gray-600">Attributes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{policies.length}</div>
            <div className="text-sm text-gray-600">Active Policies</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">2,847</div>
            <div className="text-sm text-gray-600">Daily Decisions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">94.2%</div>
            <div className="text-sm text-gray-600">Policy Compliance</div>
          </CardContent>
        </Card>
      </div>

      {/* Attribute Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Attribute Management
          </CardTitle>
          <Button size="sm">
            <Plus className="h-3 w-3 mr-1" />
            New Attribute
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attributes.map((attr) => (
              <div key={attr.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium">{attr.name}</div>
                    <div className="text-sm text-gray-600">{attr.description}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{attr.type}</Badge>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {attr.values.map((value, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Policy Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Access Control Policies
          </CardTitle>
          <Button size="sm">
            <Plus className="h-3 w-3 mr-1" />
            New Policy
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {policies.map((policy) => (
              <div key={policy.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium">{policy.name}</div>
                    <div className="text-sm text-gray-600">ID: {policy.id}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(policy.status)}>
                      {policy.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Resource</div>
                    <div className="font-medium">{policy.resource}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Action</div>
                    <div className="font-medium">{policy.action}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Last Modified</div>
                    <div className="font-medium">{policy.lastModified}</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600 mb-1">Policy Rule</div>
                  <code className="text-sm font-mono">{policy.rule}</code>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Access Decision Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Recent Access Decisions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {accessDecisions.map((decision) => (
              <div key={decision.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium">{decision.user}</div>
                    <div className="text-sm text-gray-600">{decision.timestamp}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getDecisionColor(decision.decision)}>
                      {decision.decision === 'Permit' ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {decision.decision}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <div className="text-sm text-gray-600">Resource</div>
                    <div className="font-medium">{decision.resource}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Action</div>
                    <div className="font-medium">{decision.action}</div>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-sm text-blue-800">{decision.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Policy Testing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Policy Testing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="testUser">Test User</Label>
                <Input id="testUser" placeholder="Enter user ID or name" />
              </div>
              <div>
                <Label htmlFor="testResource">Resource</Label>
                <Input id="testResource" placeholder="Enter resource path" />
              </div>
              <div>
                <Label htmlFor="testAction">Action</Label>
                <Input id="testAction" placeholder="Enter action (read/write/delete)" />
              </div>
              <Button className="w-full">
                Test Policy
              </Button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Test Result</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Decision:</span>
                  <Badge className="bg-green-100 text-green-800">Permit</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Policy Matched:</span>
                  <span className="text-sm font-medium">POLICY001</span>
                </div>
                <div className="text-sm text-gray-600">
                  User attributes satisfy the policy requirements for accessing the requested resource.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
