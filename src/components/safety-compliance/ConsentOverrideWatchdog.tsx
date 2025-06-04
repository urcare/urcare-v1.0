
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Lock, 
  Unlock, 
  AlertTriangle, 
  Clock, 
  User, 
  FileText,
  Shield,
  Eye,
  CheckCircle,
  XCircle,
  Calendar
} from 'lucide-react';

interface ConsentOverride {
  id: string;
  patientId: string;
  patientName: string;
  overrideType: 'emergency' | 'clinical_necessity' | 'legal_requirement' | 'administrative';
  requestedBy: string;
  requestedByRole: string;
  authorizedBy: string;
  authorizedByRole: string;
  requestTime: string;
  authorizationTime: string;
  reason: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'denied' | 'expired' | 'revoked';
  accessGranted: string[];
  duration: number; // in hours
  expiryTime: string;
  auditNotes: string;
  complianceScore: number;
}

interface ConsentMetrics {
  totalOverrides: number;
  emergencyOverrides: number;
  pendingApprovals: number;
  expiredOverrides: number;
  complianceViolations: number;
  averageApprovalTime: number;
}

const mockOverrides: ConsentOverride[] = [
  {
    id: 'CO001',
    patientId: 'P2847',
    patientName: 'Sarah Johnson',
    overrideType: 'emergency',
    requestedBy: 'Dr. Michael Chen',
    requestedByRole: 'Emergency Physician',
    authorizedBy: 'Dr. Lisa Thompson',
    authorizedByRole: 'Chief Medical Officer',
    requestTime: '2024-01-20 02:15:00',
    authorizationTime: '2024-01-20 02:18:00',
    reason: 'Patient unconscious, emergency surgery required, family unreachable',
    urgencyLevel: 'critical',
    status: 'approved',
    accessGranted: ['Full Medical Records', 'Treatment Authorization', 'Billing Information'],
    duration: 24,
    expiryTime: '2024-01-21 02:18:00',
    auditNotes: 'Emergency override approved due to life-threatening condition. Family contacted post-procedure.',
    complianceScore: 95
  },
  {
    id: 'CO002',
    patientId: 'P1932',
    patientName: 'Robert Davis',
    overrideType: 'clinical_necessity',
    requestedBy: 'Dr. Anna Wilson',
    requestedByRole: 'Cardiologist',
    authorizedBy: 'Dr. James Brown',
    authorizedByRole: 'Department Head',
    requestTime: '2024-01-20 14:30:00',
    authorizationTime: '2024-01-20 14:45:00',
    reason: 'Urgent cardiac intervention required, patient capacity questionable',
    urgencyLevel: 'high',
    status: 'approved',
    accessGranted: ['Cardiac Records', 'Treatment Planning', 'Medication History'],
    duration: 12,
    expiryTime: '2024-01-21 02:45:00',
    auditNotes: 'Clinical necessity override for time-sensitive cardiac procedure.',
    complianceScore: 88
  },
  {
    id: 'CO003',
    patientId: 'P3156',
    patientName: 'Emily Rodriguez',
    overrideType: 'administrative',
    requestedBy: 'Admin Jane Smith',
    requestedByRole: 'Records Manager',
    authorizedBy: 'Pending',
    authorizedByRole: 'Pending',
    requestTime: '2024-01-20 16:20:00',
    authorizationTime: '',
    reason: 'Insurance audit requires access to historical records',
    urgencyLevel: 'low',
    status: 'pending',
    accessGranted: [],
    duration: 0,
    expiryTime: '',
    auditNotes: '',
    complianceScore: 0
  }
];

const mockMetrics: ConsentMetrics = {
  totalOverrides: 156,
  emergencyOverrides: 23,
  pendingApprovals: 7,
  expiredOverrides: 12,
  complianceViolations: 3,
  averageApprovalTime: 15 // minutes
};

export const ConsentOverrideWatchdog = () => {
  const [overrides] = useState<ConsentOverride[]>(mockOverrides);
  const [metrics] = useState<ConsentMetrics>(mockMetrics);
  const [selectedOverride, setSelectedOverride] = useState<ConsentOverride | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 text-white';
      case 'approved': return 'bg-green-500 text-white';
      case 'denied': return 'bg-red-500 text-white';
      case 'expired': return 'bg-gray-500 text-white';
      case 'revoked': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'clinical_necessity': return 'bg-orange-100 text-orange-800';
      case 'legal_requirement': return 'bg-blue-100 text-blue-800';
      case 'administrative': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (hours: number) => {
    if (hours < 1) return `${hours * 60} minutes`;
    if (hours < 24) return `${hours} hours`;
    return `${Math.floor(hours / 24)} days`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Consent Override Watchdog Interface
          </CardTitle>
          <CardDescription>
            Authorization tracking, exception monitoring, and comprehensive audit reporting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Lock className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{metrics.totalOverrides}</p>
                  <p className="text-sm text-gray-600">Total Overrides</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">{metrics.emergencyOverrides}</p>
                  <p className="text-sm text-gray-600">Emergency</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-2">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{metrics.pendingApprovals}</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <XCircle className="h-8 w-8 text-gray-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-600">{metrics.expiredOverrides}</p>
                  <p className="text-sm text-gray-600">Expired</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-orange-200 bg-orange-50">
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-600">{metrics.complianceViolations}</p>
                  <p className="text-sm text-gray-600">Violations</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">{metrics.averageApprovalTime}m</p>
                  <p className="text-sm text-gray-600">Avg Approval</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Consent Overrides</h3>
              {overrides.map((override) => (
                <Card 
                  key={override.id} 
                  className={`cursor-pointer transition-colors ${selectedOverride?.id === override.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-red-400`}
                  onClick={() => setSelectedOverride(override)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold mb-1">{override.patientName}</h4>
                        <p className="text-sm text-gray-600 mb-1">Patient ID: {override.patientId}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>Requested: {override.requestTime}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getTypeColor(override.overrideType)}>
                          {override.overrideType.replace('_', ' ')}
                        </Badge>
                        <Badge className={getStatusColor(override.status)}>
                          {override.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Urgency Level</span>
                        <span className={`font-bold ${getUrgencyColor(override.urgencyLevel)}`}>
                          {override.urgencyLevel}
                        </span>
                      </div>
                      
                      <div className="text-sm">
                        <p className="text-gray-600">Requested by: <strong>{override.requestedBy}</strong></p>
                        <p className="text-gray-600">Role: <strong>{override.requestedByRole}</strong></p>
                      </div>
                      
                      {override.status === 'approved' && (
                        <div className="text-sm">
                          <p className="text-green-600">Duration: <strong>{formatDuration(override.duration)}</strong></p>
                          <p className="text-gray-600">Expires: <strong>{override.expiryTime}</strong></p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedOverride ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedOverride.patientName} - Override Details</CardTitle>
                    <CardDescription>Comprehensive authorization tracking and audit information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Request Information</h4>
                          <div className="space-y-1 text-sm">
                            <p>Override ID: <strong>{selectedOverride.id}</strong></p>
                            <p>Type: <strong>{selectedOverride.overrideType.replace('_', ' ')}</strong></p>
                            <p>Urgency: <strong className={getUrgencyColor(selectedOverride.urgencyLevel)}>
                              {selectedOverride.urgencyLevel}
                            </strong></p>
                            <p>Status: <strong>{selectedOverride.status}</strong></p>
                            <p>Requested: <strong>{selectedOverride.requestTime}</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Authorization Details</h4>
                          <div className="space-y-1 text-sm">
                            <p>Requested by: <strong>{selectedOverride.requestedBy}</strong></p>
                            <p>Role: <strong>{selectedOverride.requestedByRole}</strong></p>
                            {selectedOverride.authorizedBy !== 'Pending' && (
                              <>
                                <p>Authorized by: <strong>{selectedOverride.authorizedBy}</strong></p>
                                <p>Auth Role: <strong>{selectedOverride.authorizedByRole}</strong></p>
                                <p>Auth Time: <strong>{selectedOverride.authorizationTime}</strong></p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Reason for Override</h4>
                        <p className="text-sm bg-gray-50 p-3 rounded">{selectedOverride.reason}</p>
                      </div>
                      
                      {selectedOverride.accessGranted.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Access Granted</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedOverride.accessGranted.map((access, index) => (
                              <Badge key={index} variant="outline">
                                {access}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {selectedOverride.status === 'approved' && (
                        <div>
                          <h4 className="font-medium mb-2">Duration & Expiry</h4>
                          <div className="space-y-1 text-sm">
                            <p>Duration: <strong>{formatDuration(selectedOverride.duration)}</strong></p>
                            <p>Expires: <strong>{selectedOverride.expiryTime}</strong></p>
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>Compliance Score</span>
                                <span className="font-bold">{selectedOverride.complianceScore}%</span>
                              </div>
                              <Progress value={selectedOverride.complianceScore} className="h-2" />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {selectedOverride.auditNotes && (
                        <div>
                          <h4 className="font-medium mb-2">Audit Notes</h4>
                          <p className="text-sm bg-blue-50 p-3 rounded">{selectedOverride.auditNotes}</p>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        {selectedOverride.status === 'pending' && (
                          <>
                            <Button>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button variant="destructive">
                              <XCircle className="h-4 w-4 mr-1" />
                              Deny
                            </Button>
                          </>
                        )}
                        {selectedOverride.status === 'approved' && (
                          <Button variant="outline">
                            <Lock className="h-4 w-4 mr-1" />
                            Revoke Access
                          </Button>
                        )}
                        <Button variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Audit Report
                        </Button>
                        <Button variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Logs
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Select a consent override to view detailed authorization tracking and audit information</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
