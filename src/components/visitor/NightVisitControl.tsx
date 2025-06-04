
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Moon, 
  Clock, 
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Phone,
  User,
  FileText,
  Bell
} from 'lucide-react';

export const NightVisitControl = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);

  const nightVisitRequests = [
    {
      id: '1',
      visitor: 'Maria Rodriguez',
      patient: 'Carlos Rodriguez (Room 301)',
      relationship: 'Daughter',
      requestTime: '2024-06-04 18:30',
      requestedEntry: '22:00',
      reason: 'Patient critical condition, family request',
      urgency: 'high',
      status: 'pending',
      approver: 'Dr. Sarah Wilson',
      contact: '+1 (555) 123-4567'
    },
    {
      id: '2',
      visitor: 'James Thompson',
      patient: 'Mary Thompson (Room 205)',
      relationship: 'Husband',
      requestTime: '2024-06-04 19:15',
      requestedEntry: '23:30',
      reason: 'End-of-life care, last wishes',
      urgency: 'critical',
      status: 'approved',
      approver: 'Dr. Michael Chen',
      contact: '+1 (555) 987-6543'
    },
    {
      id: '3',
      visitor: 'Lisa Johnson',
      patient: 'Robert Johnson (Room 150)',
      relationship: 'Wife',
      requestTime: '2024-06-04 20:45',
      requestedEntry: '21:30',
      reason: 'Patient anxiety, emotional support needed',
      urgency: 'medium',
      status: 'denied',
      approver: 'Charge Nurse',
      contact: '+1 (555) 456-7890'
    }
  ];

  const nightPolicies = [
    {
      id: '1',
      name: 'ICU Night Visits',
      hours: '10:00 PM - 6:00 AM',
      maxVisitors: 1,
      maxDuration: '30 minutes',
      approvalRequired: 'Medical Staff',
      specialConditions: ['Critical condition', 'End-of-life care', 'Family emergency']
    },
    {
      id: '2',
      name: 'General Ward Night Visits',
      hours: '10:00 PM - 6:00 AM',
      maxVisitors: 2,
      maxDuration: '1 hour',
      approvalRequired: 'Charge Nurse',
      specialConditions: ['Patient request', 'Medical necessity', 'Compassionate grounds']
    },
    {
      id: '3',
      name: 'Emergency Night Access',
      hours: '24/7',
      maxVisitors: 'No limit',
      maxDuration: 'As needed',
      approvalRequired: 'Emergency Physician',
      specialConditions: ['Life-threatening emergency', 'Trauma cases', 'Critical decisions required']
    }
  ];

  const emergencyOverrides = [
    {
      id: '1',
      time: '2024-06-04 23:15',
      initiator: 'Dr. Emergency',
      reason: 'Code Blue - Room 302',
      action: 'Override all restrictions',
      status: 'active'
    },
    {
      id: '2',
      time: '2024-06-04 21:45',
      initiator: 'Security Chief',
      reason: 'Facility lockdown drill',
      action: 'Suspend all night visits',
      status: 'completed'
    }
  ];

  const auditLogs = [
    {
      id: '1',
      timestamp: '2024-06-04 23:30',
      action: 'Night visit approved',
      user: 'Dr. Sarah Wilson',
      visitor: 'Maria Rodriguez',
      details: 'Critical condition approval for Room 301'
    },
    {
      id: '2',
      timestamp: '2024-06-04 22:15',
      action: 'Emergency override activated',
      user: 'Dr. Emergency',
      visitor: 'Multiple',
      details: 'Code Blue emergency - all restrictions lifted'
    },
    {
      id: '3',
      timestamp: '2024-06-04 21:00',
      action: 'Night visit denied',
      user: 'Charge Nurse',
      visitor: 'Lisa Johnson',
      details: 'Patient rest period, non-critical condition'
    }
  ];

  const getUrgencyBadge = (urgency) => {
    const urgencyConfig = {
      low: { label: 'Low', className: 'bg-green-100 text-green-800' },
      medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-800' },
      high: { label: 'High', className: 'bg-orange-100 text-orange-800' },
      critical: { label: 'Critical', className: 'bg-red-100 text-red-800' }
    };
    const config = urgencyConfig[urgency];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { label: 'Approved', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      denied: { label: 'Denied', className: 'bg-red-100 text-red-800', icon: XCircle },
      active: { label: 'Active', className: 'bg-blue-100 text-blue-800', icon: Shield }
    };
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <Badge className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Night Visit Control Panel</h3>
          <p className="text-gray-600">Special approval workflows for after-hours visits with emergency overrides</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            Emergency Override
          </Button>
          <Button>
            <Moon className="w-4 h-4 mr-2" />
            New Night Request
          </Button>
        </div>
      </div>

      {/* Night Visit Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">8</div>
                <div className="text-sm text-gray-600">Pending Requests</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">12</div>
                <div className="text-sm text-gray-600">Approved Tonight</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">5</div>
                <div className="text-sm text-gray-600">Currently Inside</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">2</div>
                <div className="text-sm text-gray-600">Emergency Overrides</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Night Visit Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="w-5 h-5" />
            Night Visit Requests
          </CardTitle>
          <CardDescription>Special approval requests for after-hours access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nightVisitRequests.map((request) => (
              <div key={request.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{request.visitor}</h4>
                      {getUrgencyBadge(request.urgency)}
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="text-sm text-gray-600">
                      Visiting: {request.patient} • Relationship: {request.relationship}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium">Entry: {request.requestedEntry}</p>
                    <p className="text-xs text-gray-500">Requested: {request.requestTime}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Reason for Night Visit</p>
                    <p className="font-medium">{request.reason}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Contact Information</p>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <p className="text-sm">{request.contact}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Approver: {request.approver}
                  </div>
                  
                  <div className="flex gap-2">
                    {request.status === 'pending' && (
                      <>
                        <Button size="sm" variant="outline">
                          <XCircle className="w-4 h-4 mr-1" />
                          Deny
                        </Button>
                        <Button size="sm">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline">
                      <FileText className="w-4 h-4 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Night Visit Policies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Night Visit Policies
            </CardTitle>
            <CardDescription>Configured policies for after-hours access</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nightPolicies.map((policy) => (
                <div key={policy.id} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{policy.name}</h4>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div>
                      <p className="text-gray-500">Hours</p>
                      <p className="font-medium">{policy.hours}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Max Visitors</p>
                      <p className="font-medium">{policy.maxVisitors}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Max Duration</p>
                      <p className="font-medium">{policy.maxDuration}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Approval Required</p>
                      <p className="font-medium">{policy.approvalRequired}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Special Conditions</p>
                    <div className="flex flex-wrap gap-1">
                      {policy.specialConditions.map((condition, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Overrides & Audit Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Emergency Overrides & Audit
            </CardTitle>
            <CardDescription>Emergency protocols and activity tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Emergency Overrides */}
              <div>
                <h4 className="font-medium mb-3 text-red-700">Active Emergency Overrides</h4>
                <div className="space-y-2">
                  {emergencyOverrides.map((override) => (
                    <div key={override.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{override.reason}</span>
                        {getStatusBadge(override.status)}
                      </div>
                      <div className="text-xs text-gray-600">
                        {override.time} • Initiated by: {override.initiator}
                      </div>
                      <p className="text-xs text-red-700 mt-1">{override.action}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audit Logs */}
              <div>
                <h4 className="font-medium mb-3">Recent Audit Activity</h4>
                <div className="space-y-2">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{log.action}</span>
                        <span className="text-xs text-gray-500">{log.timestamp}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        User: {log.user} • Visitor: {log.visitor}
                      </div>
                      <p className="text-xs text-gray-700 mt-1">{log.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
