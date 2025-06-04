
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Shield, 
  Clock,
  User,
  FileText,
  TrendingUp,
  Filter,
  Search,
  Bell
} from 'lucide-react';

export const SOPViolationPanel = () => {
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const violations = [
    {
      id: '1',
      type: 'Hand Hygiene',
      severity: 'high',
      status: 'open',
      department: 'ICU',
      reportedBy: 'System Monitor',
      reportedAt: '2024-06-04 14:30',
      description: 'Staff member did not follow proper hand hygiene protocol before patient contact',
      location: 'ICU Room 205',
      involvedStaff: 'Dr. Sarah Wilson',
      escalationLevel: 2,
      actions: ['Warning issued', 'Mandatory training scheduled']
    },
    {
      id: '2',
      type: 'Medication Protocol',
      severity: 'critical',
      status: 'investigating',
      department: 'Emergency',
      reportedBy: 'Pharmacy Department',
      reportedAt: '2024-06-04 12:15',
      description: 'Double dosage administered without verification',
      location: 'Emergency Ward',
      involvedStaff: 'Nurse John Smith',
      escalationLevel: 3,
      actions: ['Immediate suspension', 'Investigation initiated', 'Legal review required']
    },
    {
      id: '3',
      type: 'PPE Compliance',
      severity: 'medium',
      status: 'resolved',
      department: 'General Ward',
      reportedBy: 'Infection Control',
      reportedAt: '2024-06-04 09:45',
      description: 'Improper mask wearing in isolation area',
      location: 'Isolation Ward B',
      involvedStaff: 'Nurse Lisa Brown',
      escalationLevel: 1,
      actions: ['Counseling completed', 'Additional training provided']
    }
  ];

  const getSeverityBadge = (severity) => {
    const severityConfig = {
      critical: { label: 'Critical', className: 'bg-red-100 text-red-800 border-red-300' },
      high: { label: 'High', className: 'bg-orange-100 text-orange-800 border-orange-300' },
      medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
      low: { label: 'Low', className: 'bg-blue-100 text-blue-800 border-blue-300' }
    };
    const config = severityConfig[severity];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { label: 'Open', className: 'bg-red-100 text-red-800' },
      investigating: { label: 'Investigating', className: 'bg-yellow-100 text-yellow-800' },
      resolved: { label: 'Resolved', className: 'bg-green-100 text-green-800' },
      closed: { label: 'Closed', className: 'bg-gray-100 text-gray-800' }
    };
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getEscalationColor = (level) => {
    const colors = {
      1: 'text-blue-600',
      2: 'text-yellow-600',
      3: 'text-red-600'
    };
    return colors[level] || 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">SOP Violation Alert Panel</h3>
          <p className="text-gray-600">Real-time monitoring and management of protocol violations</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Bell className="w-4 h-4 mr-2" />
            Set Alerts
          </Button>
        </div>
      </div>

      {/* Violation Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">12</div>
                <div className="text-sm text-gray-600">Open Violations</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">3</div>
                <div className="text-sm text-gray-600">Critical Issues</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">24h</div>
                <div className="text-sm text-gray-600">Avg Resolution</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">85%</div>
                <div className="text-sm text-gray-600">Compliance Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Violation Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Violation Categories</CardTitle>
          <CardDescription>Distribution of violations by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Hand Hygiene</span>
                <span>35%</span>
              </div>
              <Progress value={35} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>PPE Compliance</span>
                <span>28%</span>
              </div>
              <Progress value={28} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Medication Protocol</span>
                <span>20%</span>
              </div>
              <Progress value={20} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Documentation</span>
                <span>17%</span>
              </div>
              <Progress value={17} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Violation List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Violations</CardTitle>
          <CardDescription>Detailed list of SOP violations requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {violations.map((violation) => (
              <div key={violation.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{violation.type}</h4>
                      {getSeverityBadge(violation.severity)}
                      {getStatusBadge(violation.status)}
                    </div>
                    <p className="text-sm text-gray-600">{violation.description}</p>
                  </div>
                  
                  <div className={`text-right ${getEscalationColor(violation.escalationLevel)}`}>
                    <div className="font-semibold">Level {violation.escalationLevel}</div>
                    <div className="text-xs">Escalation</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="font-medium">{violation.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-medium">{violation.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Involved Staff</p>
                    <p className="font-medium">{violation.involvedStaff}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Actions Taken</p>
                  <div className="flex flex-wrap gap-1">
                    {violation.actions.map((action, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {action}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Reported by {violation.reportedBy}</span>
                  <span>{violation.reportedAt}</span>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                  <Button size="sm" variant="outline">
                    <User className="w-4 h-4 mr-1" />
                    Assign
                  </Button>
                  {violation.status === 'open' && (
                    <Button size="sm">
                      Escalate
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
