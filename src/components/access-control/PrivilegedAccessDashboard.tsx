
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Key,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Shield,
  Eye
} from 'lucide-react';

export const PrivilegedAccessDashboard = () => {
  const [privilegedAccounts, setPrivilegedAccounts] = useState([
    {
      id: 'PRIV001',
      user: 'Dr. Sarah Wilson',
      role: 'Chief Medical Officer',
      permissions: ['All Patient Data', 'System Configuration', 'User Management'],
      lastUsed: '2024-01-22 14:30:00',
      status: 'Active',
      riskScore: 85
    },
    {
      id: 'PRIV002',
      user: 'Admin John Carter',
      role: 'System Administrator',
      permissions: ['Database Access', 'Server Management', 'Security Settings'],
      lastUsed: '2024-01-22 13:45:00',
      status: 'Suspended',
      riskScore: 92
    },
    {
      id: 'PRIV003',
      user: 'Security Manager Lisa Chen',
      role: 'CISO',
      permissions: ['Audit Logs', 'Security Policies', 'Incident Response'],
      lastUsed: '2024-01-22 15:20:00',
      status: 'Active',
      riskScore: 78
    }
  ]);

  const [accessRequests, setAccessRequests] = useState([
    {
      id: 'REQ001',
      requester: 'Dr. Mike Rodriguez',
      requestedRole: 'Emergency Override',
      justification: 'Critical patient requiring immediate intervention',
      requestTime: '2024-01-22 15:30:00',
      approver: 'Dr. Sarah Wilson',
      status: 'Pending',
      urgency: 'Critical'
    },
    {
      id: 'REQ002',
      requester: 'Nurse Jennifer Park',
      requestedRole: 'Medication Override',
      justification: 'Patient allergic to standard medication',
      requestTime: '2024-01-22 15:25:00',
      approver: 'Pharmacy Manager',
      status: 'Approved',
      urgency: 'High'
    },
    {
      id: 'REQ003',
      requester: 'IT Specialist Tom Brown',
      requestedRole: 'Database Maintenance',
      justification: 'Scheduled maintenance window',
      requestTime: '2024-01-22 14:00:00',
      approver: 'Admin John Carter',
      status: 'Denied',
      urgency: 'Low'
    }
  ]);

  const [activityLogs, setActivityLogs] = useState([
    {
      id: 'LOG001',
      user: 'Dr. Sarah Wilson',
      action: 'Accessed Patient Database',
      resource: 'ICU Patient Records',
      timestamp: '2024-01-22 15:35:00',
      riskLevel: 'Medium'
    },
    {
      id: 'LOG002',
      user: 'Security Manager Lisa Chen',
      action: 'Modified Security Policy',
      resource: 'Access Control Rules',
      timestamp: '2024-01-22 15:20:00',
      riskLevel: 'High'
    },
    {
      id: 'LOG003',
      user: 'Admin John Carter',
      action: 'System Configuration Change',
      resource: 'Database Settings',
      timestamp: '2024-01-22 13:45:00',
      riskLevel: 'Critical'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Denied': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 90) return 'text-red-600';
    if (riskScore >= 75) return 'text-orange-600';
    if (riskScore >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Privileged Access Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{privilegedAccounts.length}</div>
            <div className="text-sm text-gray-600">Privileged Accounts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {accessRequests.filter(req => req.status === 'Pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending Requests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{activityLogs.length}</div>
            <div className="text-sm text-gray-600">Recent Activities</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">87%</div>
            <div className="text-sm text-gray-600">Approval Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Privileged Account Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Privileged Account Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {privilegedAccounts.map((account) => (
              <div key={account.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{account.user}</div>
                    <div className="text-sm text-gray-600">{account.role}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(account.status)}>
                      {account.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Manage
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Privileged Permissions</div>
                    <div className="flex flex-wrap gap-1">
                      {account.permissions.map((permission, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Last Used</div>
                    <div className="font-medium">{account.lastUsed}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Risk Score</span>
                    <span className={`font-medium ${getRiskColor(account.riskScore)}`}>
                      {account.riskScore}/100
                    </span>
                  </div>
                  <Progress value={account.riskScore} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Approval Workflows */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Elevated Access Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {accessRequests.map((request) => (
              <div key={request.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{request.requester}</div>
                    <div className="text-sm text-gray-600">{request.requestTime}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getUrgencyColor(request.urgency)}>
                      {request.urgency}
                    </Badge>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Requested Role</div>
                    <div className="font-medium">{request.requestedRole}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Approver</div>
                    <div className="font-medium">{request.approver}</div>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded mb-3">
                  <div className="text-sm text-blue-800">{request.justification}</div>
                </div>

                {request.status === 'Pending' && (
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive">
                      <XCircle className="h-3 w-3 mr-1" />
                      Deny
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Privileged Activity Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activityLogs.map((log) => (
              <div key={log.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium">{log.user}</div>
                    <div className="text-sm text-gray-600">{log.timestamp}</div>
                  </div>
                  <Badge className={getStatusColor(log.riskLevel)}>
                    {log.riskLevel} Risk
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Action</div>
                    <div className="font-medium">{log.action}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Resource</div>
                    <div className="font-medium">{log.resource}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Just-in-Time Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Just-in-Time Access Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-800 mb-2">Request Elevated Access</div>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="Role or permission needed" 
                    className="w-full p-2 border rounded text-sm"
                  />
                  <textarea 
                    placeholder="Justification for access request"
                    className="w-full p-2 border rounded text-sm h-20"
                  />
                  <Button size="sm" className="w-full">
                    Submit Request
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium mb-2">Access Statistics</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Avg Approval Time:</span>
                    <span className="font-medium">12 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Sessions:</span>
                    <span className="font-medium">3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
