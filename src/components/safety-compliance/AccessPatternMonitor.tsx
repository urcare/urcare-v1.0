
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Eye, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Shield,
  Activity,
  Users,
  Search,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface AccessPattern {
  id: string;
  userId: string;
  userName: string;
  role: string;
  accessTime: string;
  location: string;
  ipAddress: string;
  deviceType: string;
  accessedResources: string[];
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  anomalyFlags: string[];
  investigationStatus: 'pending' | 'investigating' | 'resolved' | 'escalated';
}

interface SecurityAlert {
  id: string;
  type: 'unusual_time' | 'new_location' | 'multiple_failures' | 'privilege_escalation' | 'data_exfiltration';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId: string;
  userName: string;
  description: string;
  timestamp: string;
  status: 'active' | 'investigating' | 'resolved';
  investigator?: string;
}

const mockPatterns: AccessPattern[] = [
  {
    id: 'AP001',
    userId: 'U2847',
    userName: 'Dr. Sarah Johnson',
    role: 'Senior Physician',
    accessTime: '2024-01-20 02:15:00',
    location: 'Remote - Home',
    ipAddress: '192.168.1.105',
    deviceType: 'Mobile',
    accessedResources: ['Patient Records', 'Lab Results', 'Prescription System'],
    riskScore: 85,
    riskLevel: 'high',
    anomalyFlags: ['Unusual access time', 'Remote location', 'Mobile device'],
    investigationStatus: 'investigating'
  },
  {
    id: 'AP002',
    userId: 'U1932',
    userName: 'Nurse Michael Chen',
    role: 'ICU Nurse',
    accessTime: '2024-01-20 14:30:00',
    location: 'ICU Station 3',
    ipAddress: '10.0.3.45',
    deviceType: 'Workstation',
    accessedResources: ['Patient Monitoring', 'Medication Records'],
    riskScore: 25,
    riskLevel: 'low',
    anomalyFlags: [],
    investigationStatus: 'resolved'
  },
  {
    id: 'AP003',
    userId: 'U3156',
    userName: 'Admin User',
    role: 'System Administrator',
    accessTime: '2024-01-20 16:45:00',
    location: 'IT Department',
    ipAddress: '10.0.1.20',
    deviceType: 'Workstation',
    accessedResources: ['System Configurations', 'User Management', 'Audit Logs'],
    riskScore: 75,
    riskLevel: 'medium',
    anomalyFlags: ['Elevated privileges', 'Multiple systems accessed'],
    investigationStatus: 'pending'
  }
];

const mockAlerts: SecurityAlert[] = [
  {
    id: 'SA001',
    type: 'unusual_time',
    severity: 'high',
    userId: 'U2847',
    userName: 'Dr. Sarah Johnson',
    description: 'Access attempt at 2:15 AM from remote location',
    timestamp: '2024-01-20 02:15:00',
    status: 'investigating',
    investigator: 'Security Team'
  },
  {
    id: 'SA002',
    type: 'multiple_failures',
    severity: 'medium',
    userId: 'U4521',
    userName: 'John Doe',
    description: '5 consecutive failed login attempts',
    timestamp: '2024-01-20 14:22:00',
    status: 'active'
  },
  {
    id: 'SA003',
    type: 'privilege_escalation',
    severity: 'critical',
    userId: 'U3156',
    userName: 'Admin User',
    description: 'Attempt to access restricted system configurations',
    timestamp: '2024-01-20 16:45:00',
    status: 'escalated',
    investigator: 'Chief Security Officer'
  }
];

export const AccessPatternMonitor = () => {
  const [patterns] = useState<AccessPattern[]>(mockPatterns);
  const [alerts] = useState<SecurityAlert[]>(mockAlerts);
  const [selectedPattern, setSelectedPattern] = useState<AccessPattern | null>(null);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'critical': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-500 text-white';
      case 'investigating': return 'bg-blue-500 text-white';
      case 'resolved': return 'bg-green-500 text-white';
      case 'escalated': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Access Pattern Monitoring Dashboard
          </CardTitle>
          <CardDescription>
            Real-time monitoring of user access patterns with anomaly detection and investigation tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{patterns.length}</p>
                  <p className="text-sm text-gray-600">Active Sessions</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-orange-200 bg-orange-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-600">
                    {patterns.filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical').length}
                  </p>
                  <p className="text-sm text-gray-600">High Risk</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">{alerts.length}</p>
                  <p className="text-sm text-gray-600">Active Alerts</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-purple-200 bg-purple-50">
              <div className="flex items-center gap-2">
                <Search className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {patterns.filter(p => p.investigationStatus === 'investigating').length}
                  </p>
                  <p className="text-sm text-gray-600">Under Investigation</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Access Patterns</h3>
              {patterns.map((pattern) => (
                <Card 
                  key={pattern.id} 
                  className={`cursor-pointer transition-colors ${selectedPattern?.id === pattern.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-purple-400`}
                  onClick={() => setSelectedPattern(pattern)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold mb-1">{pattern.userName}</h4>
                        <p className="text-sm text-gray-600 mb-1">{pattern.role}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{pattern.accessTime}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getRiskColor(pattern.riskLevel)}>
                          {pattern.riskLevel.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(pattern.investigationStatus)}>
                          {pattern.investigationStatus}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Risk Score</span>
                        <span className="font-bold">{pattern.riskScore}%</span>
                      </div>
                      <Progress value={pattern.riskScore} className="h-2" />
                      
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{pattern.location}</span>
                        <span className="text-gray-400">•</span>
                        <span>{pattern.deviceType}</span>
                      </div>
                      
                      {pattern.anomalyFlags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {pattern.anomalyFlags.map((flag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {flag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedPattern ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedPattern.userName} - Access Details</CardTitle>
                    <CardDescription>Comprehensive access pattern analysis and investigation tools</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Access Information</h4>
                          <div className="space-y-1 text-sm">
                            <p>User ID: <strong>{selectedPattern.userId}</strong></p>
                            <p>Role: <strong>{selectedPattern.role}</strong></p>
                            <p>Time: <strong>{selectedPattern.accessTime}</strong></p>
                            <p>Location: <strong>{selectedPattern.location}</strong></p>
                            <p>IP Address: <strong>{selectedPattern.ipAddress}</strong></p>
                            <p>Device: <strong>{selectedPattern.deviceType}</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Risk Assessment</h4>
                          <div className="space-y-1 text-sm">
                            <p>Risk Score: <strong className={
                              selectedPattern.riskScore > 70 ? 'text-red-600' : 
                              selectedPattern.riskScore > 40 ? 'text-yellow-600' : 'text-green-600'
                            }>
                              {selectedPattern.riskScore}%
                            </strong></p>
                            <p>Risk Level: <strong className={
                              selectedPattern.riskLevel === 'high' || selectedPattern.riskLevel === 'critical' 
                                ? 'text-red-600' : selectedPattern.riskLevel === 'medium' 
                                ? 'text-yellow-600' : 'text-green-600'
                            }>
                              {selectedPattern.riskLevel}
                            </strong></p>
                            <p>Status: <strong>{selectedPattern.investigationStatus}</strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Accessed Resources</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedPattern.accessedResources.map((resource, index) => (
                            <Badge key={index} variant="outline">
                              {resource}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {selectedPattern.anomalyFlags.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Anomaly Flags</h4>
                          <div className="space-y-2">
                            {selectedPattern.anomalyFlags.map((flag, index) => (
                              <div key={index} className="text-sm bg-orange-50 p-2 rounded">
                                <div className="flex items-start gap-2">
                                  <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-orange-700">{flag}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button>
                          <Search className="h-4 w-4 mr-1" />
                          Investigate
                        </Button>
                        <Button variant="outline">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Create Alert
                        </Button>
                        <Button variant="outline">
                          <Shield className="h-4 w-4 mr-1" />
                          Block Access
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Select an access pattern to view detailed analysis and investigation tools</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Security Alerts</CardTitle>
              <CardDescription>Real-time security alerts requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                      alert.severity === 'critical' ? 'text-red-600' :
                      alert.severity === 'high' ? 'text-orange-600' :
                      alert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{alert.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {alert.userName} ({alert.userId}) - {alert.timestamp}
                          </p>
                          {alert.investigator && (
                            <p className="text-xs text-blue-600 mt-1">
                              Assigned to: {alert.investigator}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <Badge className={getStatusColor(alert.status)}>
                            {alert.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
