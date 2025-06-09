
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  AlertTriangle,
  Shield,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  Lock
} from 'lucide-react';

export const EmergencyAccessInterface = () => {
  const [emergencyAccess, setEmergencyAccess] = useState([
    {
      id: 'EMRG001',
      user: 'Dr. Sarah Johnson',
      reason: 'Code Blue - Patient 12345 requires immediate intervention',
      accessLevel: 'Full ICU Access',
      startTime: '2024-01-22 15:30:00',
      endTime: '2024-01-22 16:30:00',
      approver: 'Chief Medical Officer',
      status: 'Active',
      urgency: 'Critical'
    },
    {
      id: 'EMRG002',
      user: 'Nurse Michael Chen',
      reason: 'Emergency medication required for allergic reaction',
      accessLevel: 'Pharmacy Override',
      startTime: '2024-01-22 14:45:00',
      endTime: '2024-01-22 15:15:00',
      approver: 'Head Pharmacist',
      status: 'Completed',
      urgency: 'High'
    },
    {
      id: 'EMRG003',
      user: 'Security Officer Tom Wilson',
      reason: 'System security breach - immediate lockdown required',
      accessLevel: 'Security Override',
      startTime: '2024-01-22 13:00:00',
      endTime: '2024-01-22 14:00:00',
      approver: 'CISO',
      status: 'Under Review',
      urgency: 'Critical'
    }
  ]);

  const [breakGlassProcedures, setBreakGlassProcedures] = useState([
    {
      id: 'BGP001',
      name: 'Medical Emergency Access',
      description: 'Immediate access to patient records during medical emergencies',
      triggerConditions: ['Code Blue', 'Code Red', 'Cardiac Arrest'],
      accessGranted: ['Patient Records', 'Medication Orders', 'Lab Results'],
      maxDuration: 60,
      approvalRequired: false
    },
    {
      id: 'BGP002',
      name: 'Security Incident Response',
      description: 'Emergency system access during security incidents',
      triggerConditions: ['Data Breach', 'System Compromise', 'Unauthorized Access'],
      accessGranted: ['System Logs', 'Security Controls', 'Network Access'],
      maxDuration: 120,
      approvalRequired: true
    },
    {
      id: 'BGP003',
      name: 'System Recovery Access',
      description: 'Emergency access for critical system recovery',
      triggerConditions: ['System Failure', 'Database Corruption', 'Network Outage'],
      accessGranted: ['Administrative Functions', 'Database Access', 'System Configuration'],
      maxDuration: 240,
      approvalRequired: true
    }
  ]);

  const [auditTrail, setAuditTrail] = useState([
    {
      id: 'AUDIT001',
      timestamp: '2024-01-22 15:35:00',
      user: 'Dr. Sarah Johnson',
      action: 'Accessed Patient Record #12345',
      resource: 'ICU Patient Database',
      emergencyId: 'EMRG001',
      result: 'Success'
    },
    {
      id: 'AUDIT002',
      timestamp: '2024-01-22 15:32:00',
      user: 'Dr. Sarah Johnson',
      action: 'Emergency Access Activated',
      resource: 'Break-Glass Procedure BGP001',
      emergencyId: 'EMRG001',
      result: 'Success'
    },
    {
      id: 'AUDIT003',
      timestamp: '2024-01-22 14:50:00',
      user: 'Nurse Michael Chen',
      action: 'Medication Override Accessed',
      resource: 'Pharmacy System',
      emergencyId: 'EMRG002',
      result: 'Success'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-red-100 text-red-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Denied': return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="space-y-6">
      {/* Emergency Access Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {emergencyAccess.filter(access => access.status === 'Active').length}
            </div>
            <div className="text-sm text-gray-600">Active Emergency Access</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{breakGlassProcedures.length}</div>
            <div className="text-sm text-gray-600">Break-Glass Procedures</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{auditTrail.length}</div>
            <div className="text-sm text-gray-600">Audit Entries Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">98.5%</div>
            <div className="text-sm text-gray-600">Emergency Response Time</div>
          </CardContent>
        </Card>
      </div>

      {/* Break-Glass Procedures */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Break-Glass Emergency Procedures
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {breakGlassProcedures.map((procedure) => (
              <div key={procedure.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{procedure.name}</div>
                    <div className="text-sm text-gray-600">{procedure.description}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={procedure.approvalRequired ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}>
                      {procedure.approvalRequired ? 'Approval Required' : 'Auto-Approved'}
                    </Badge>
                    <Button size="sm" variant="destructive">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Activate
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Trigger Conditions</div>
                    <div className="flex flex-wrap gap-1">
                      {procedure.triggerConditions.map((condition, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Access Granted</div>
                    <div className="flex flex-wrap gap-1">
                      {procedure.accessGranted.map((access, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {access}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Max Duration</div>
                    <div className="font-medium">{procedure.maxDuration} minutes</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Emergency Access Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Active Emergency Access Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emergencyAccess.map((access) => (
              <div key={access.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{access.user}</div>
                    <div className="text-sm text-gray-600">Emergency ID: {access.id}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getUrgencyColor(access.urgency)}>
                      {access.urgency}
                    </Badge>
                    <Badge className={getStatusColor(access.status)}>
                      {access.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Access Level</div>
                    <div className="font-medium">{access.accessLevel}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Start Time</div>
                    <div className="font-medium">{access.startTime}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">End Time</div>
                    <div className="font-medium">{access.endTime}</div>
                  </div>
                </div>

                <div className="bg-red-50 p-3 rounded mb-3">
                  <div className="text-sm text-red-800">{access.reason}</div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Approved by: <span className="font-medium">{access.approver}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                    {access.status === 'Active' && (
                      <Button size="sm" variant="destructive">
                        <Lock className="h-3 w-3 mr-1" />
                        Revoke Access
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Access Request Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Request Emergency Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="emergencyType">Emergency Type</Label>
                <select className="w-full p-2 border rounded">
                  <option>Medical Emergency</option>
                  <option>Security Incident</option>
                  <option>System Failure</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <Label htmlFor="accessRequired">Access Required</Label>
                <Input id="accessRequired" placeholder="Specify access level needed" />
              </div>
              <div>
                <Label htmlFor="justification">Emergency Justification</Label>
                <textarea
                  className="w-full p-2 border rounded h-20"
                  placeholder="Provide detailed justification for emergency access"
                />
              </div>
              <Button className="w-full bg-red-600 hover:bg-red-700">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Request Emergency Access
              </Button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="text-sm font-medium text-red-800 mb-2">Emergency Access Guidelines</div>
                <div className="space-y-1 text-sm text-red-700">
                  <div>• Only use for genuine emergencies</div>
                  <div>• All access is logged and audited</div>
                  <div>• Approval may be required for certain access levels</div>
                  <div>• Access is time-limited and automatically revoked</div>
                  <div>• Misuse results in disciplinary action</div>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-800 mb-2">Emergency Contacts</div>
                <div className="space-y-1 text-sm text-blue-700">
                  <div>Medical: Emergency Department (2222)</div>
                  <div>Security: Security Desk (3333)</div>
                  <div>IT: Help Desk (1111)</div>
                  <div>Management: On-call Manager (4444)</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comprehensive Audit Trail */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Emergency Access Audit Trail
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditTrail.map((entry) => (
              <div key={entry.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium">{entry.user}</div>
                    <div className="text-sm text-gray-600">{entry.timestamp}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={entry.result === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {entry.result === 'Success' ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {entry.result}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Action</div>
                    <div className="font-medium">{entry.action}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Resource</div>
                    <div className="font-medium">{entry.resource}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Emergency Session</div>
                    <div className="font-medium">{entry.emergencyId}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
