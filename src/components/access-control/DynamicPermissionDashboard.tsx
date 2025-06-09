
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Settings,
  Clock,
  MapPin,
  Shield,
  User,
  Smartphone,
  Wifi,
  Calendar
} from 'lucide-react';

export const DynamicPermissionDashboard = () => {
  const [permissionTemplates, setPermissionTemplates] = useState([
    {
      id: 'TEMP001',
      name: 'Emergency Room Doctor',
      basePermissions: ['Patient Read', 'Order Write', 'Medication Prescribe'],
      contextualRules: [
        'Location: Emergency Department',
        'Time: 24/7 Access',
        'Device: Hospital Workstation'
      ],
      activeUsers: 12
    },
    {
      id: 'TEMP002',
      name: 'Night Shift Nurse',
      basePermissions: ['Patient Read', 'Vitals Write', 'Alert Create'],
      contextualRules: [
        'Time: 10 PM - 6 AM',
        'Location: Assigned Ward',
        'Supervision: Required for critical actions'
      ],
      activeUsers: 8
    },
    {
      id: 'TEMP003',
      name: 'Radiology Technician',
      basePermissions: ['Image Read', 'Equipment Control', 'Report Create'],
      contextualRules: [
        'Location: Radiology Department',
        'Time: Business hours',
        'Certification: Valid and current'
      ],
      activeUsers: 6
    }
  ]);

  const [contextFactors, setContextFactors] = useState([
    {
      id: 'CTX001',
      name: 'Time-based Access',
      type: 'Temporal',
      status: 'Active',
      description: 'Restricts access based on work hours and shifts',
      icon: Clock
    },
    {
      id: 'CTX002',
      name: 'Location Verification',
      type: 'Spatial',
      status: 'Active',
      description: 'Validates user location within hospital premises',
      icon: MapPin
    },
    {
      id: 'CTX003',
      name: 'Device Trust Level',
      type: 'Device',
      status: 'Active',
      description: 'Ensures access from approved and secure devices',
      icon: Smartphone
    },
    {
      id: 'CTX004',
      name: 'Network Security',
      type: 'Network',
      status: 'Active',
      description: 'Requires connection from secure hospital network',
      icon: Wifi
    }
  ]);

  const [realtimeAdjustments, setRealtimeAdjustments] = useState([
    {
      id: 'ADJ001',
      user: 'Dr. Emily Rodriguez',
      adjustment: 'Elevated Emergency Access',
      reason: 'Code Blue situation - ICU',
      timestamp: '2024-01-22 15:30:00',
      duration: '30 minutes',
      status: 'Active'
    },
    {
      id: 'ADJ002',
      user: 'Nurse Michael Thompson',
      adjustment: 'Restricted Medication Access',
      reason: 'Failed compliance training',
      timestamp: '2024-01-22 14:45:00',
      duration: 'Until training completion',
      status: 'Active'
    },
    {
      id: 'ADJ003',
      user: 'Admin Jessica Chen',
      adjustment: 'Extended System Access',
      reason: 'Maintenance window oversight',
      timestamp: '2024-01-22 13:00:00',
      duration: '2 hours',
      status: 'Expired'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Expired': return 'bg-gray-100 text-gray-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Permission Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{permissionTemplates.length}</div>
            <div className="text-sm text-gray-600">Permission Templates</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{contextFactors.length}</div>
            <div className="text-sm text-gray-600">Context Factors</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {realtimeAdjustments.filter(adj => adj.status === 'Active').length}
            </div>
            <div className="text-sm text-gray-600">Active Adjustments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">1,247</div>
            <div className="text-sm text-gray-600">Context Evaluations</div>
          </CardContent>
        </Card>
      </div>

      {/* Role-based Permission Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Role-based Permission Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {permissionTemplates.map((template) => (
              <div key={template.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{template.name}</div>
                    <div className="text-sm text-gray-600">Template ID: {template.id}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{template.activeUsers} users</Badge>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Base Permissions</div>
                    <div className="flex flex-wrap gap-1">
                      {template.basePermissions.map((permission, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Contextual Rules</div>
                    <div className="space-y-1">
                      {template.contextualRules.map((rule, index) => (
                        <div key={index} className="text-sm text-gray-600">• {rule}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Context-aware Permission Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Context-aware Permission Factors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contextFactors.map((factor) => {
              const IconComponent = factor.icon;
              return (
                <div key={factor.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                      <div className="font-medium">{factor.name}</div>
                    </div>
                    <Switch checked={factor.status === 'Active'} />
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{factor.description}</div>
                  <Badge variant="secondary">{factor.type}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Access Adjustments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Real-time Access Adjustments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {realtimeAdjustments.map((adjustment) => (
              <div key={adjustment.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium">{adjustment.user}</div>
                    <div className="text-sm text-gray-600">{adjustment.timestamp}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(adjustment.status)}>
                      {adjustment.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                  <div>
                    <div className="text-sm text-gray-600">Adjustment</div>
                    <div className="font-medium">{adjustment.adjustment}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Duration</div>
                    <div className="font-medium">{adjustment.duration}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Action</div>
                    <Button size="sm" variant="outline">
                      {adjustment.status === 'Active' ? 'Revoke' : 'Extend'}
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-sm text-blue-800">{adjustment.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permission Context Simulator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Permission Context Simulator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium mb-2">Current Context</div>
                <div className="space-y-1 text-sm">
                  <div>• Time: 15:30 (Business Hours)</div>
                  <div>• Location: Emergency Department</div>
                  <div>• Device: Trusted Hospital Workstation</div>
                  <div>• Network: Secure Internal</div>
                </div>
              </div>
              <Button className="w-full">
                Simulate Access Request
              </Button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm font-medium text-green-800 mb-2">Access Granted</div>
                <div className="text-sm text-green-700">
                  User context matches all required criteria for the requested permission level.
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Granted Permissions:</div>
                <div className="flex flex-wrap gap-1">
                  <Badge className="bg-green-100 text-green-800 text-xs">Patient Read</Badge>
                  <Badge className="bg-green-100 text-green-800 text-xs">Order Write</Badge>
                  <Badge className="bg-green-100 text-green-800 text-xs">Emergency Override</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
