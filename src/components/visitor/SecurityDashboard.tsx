
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Shield, 
  Eye,
  Clock,
  Users,
  MapPin,
  Bell,
  FileText,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const SecurityDashboard = () => {
  const [selectedIncident, setSelectedIncident] = useState(null);

  const securityAlerts = [
    {
      id: '1',
      timestamp: '2024-06-04 14:45',
      type: 'Unauthorized Access',
      location: 'ICU - Room 301',
      visitor: 'Unknown Individual',
      severity: 'high',
      status: 'active',
      description: 'Visitor detected in restricted area without proper authorization',
      response: 'Security dispatched, area secured',
      assignedOfficer: 'Security Officer A'
    },
    {
      id: '2',
      timestamp: '2024-06-04 13:30',
      type: 'Overstay Violation',
      location: 'Patient Room 205',
      visitor: 'John Smith',
      severity: 'medium',
      status: 'resolved',
      description: 'Visitor exceeded maximum visit duration by 45 minutes',
      response: 'Visitor notified and escorted out',
      assignedOfficer: 'Charge Nurse'
    },
    {
      id: '3',
      timestamp: '2024-06-04 12:15',
      type: 'Tailgating Detected',
      location: 'Main Entrance',
      visitor: 'Emily Johnson',
      severity: 'low',
      status: 'investigating',
      description: 'Visitor followed authorized person through secure entrance',
      response: 'Reviewing security footage',
      assignedOfficer: 'Security Officer B'
    }
  ];

  const incidentClassification = [
    {
      category: 'Unauthorized Access',
      count: 8,
      trend: 'increasing',
      severity: 'high',
      protocols: ['Immediate lockdown', 'Security dispatch', 'Authority notification']
    },
    {
      category: 'Overstay Violations',
      count: 23,
      trend: 'stable',
      severity: 'medium',
      protocols: ['Visitor notification', 'Escort assistance', 'Log incident']
    },
    {
      category: 'Document Violations',
      count: 12,
      trend: 'decreasing',
      severity: 'medium',
      protocols: ['ID verification', 'Registration update', 'Host notification']
    },
    {
      category: 'Escort Violations',
      count: 5,
      trend: 'decreasing',
      severity: 'low',
      protocols: ['Assign escort', 'Route correction', 'Policy reminder']
    }
  ];

  const responseProtocols = [
    {
      id: '1',
      name: 'Code Red - Security Breach',
      description: 'Immediate response to unauthorized access in restricted areas',
      triggerConditions: ['Unauthorized access to ICU/OR', 'Forced entry detected', 'Multiple violations'],
      responseSteps: [
        'Activate security lockdown',
        'Dispatch security team',
        'Notify facility management',
        'Contact law enforcement if needed',
        'Initiate incident documentation'
      ],
      responseTime: '< 2 minutes',
      authorizedPersonnel: ['Security Chief', 'Facility Manager', 'Admin On-Call']
    },
    {
      id: '2',
      name: 'Code Yellow - Policy Violation',
      description: 'Standard response to visitor policy violations',
      triggerConditions: ['Overstay violations', 'Unauthorized photography', 'Disruptive behavior'],
      responseSteps: [
        'Locate and approach visitor',
        'Explain policy violation',
        'Provide assistance if needed',
        'Escort to appropriate area',
        'Document incident'
      ],
      responseTime: '< 5 minutes',
      authorizedPersonnel: ['Security Officers', 'Charge Nurses', 'Supervisors']
    },
    {
      id: '3',
      name: 'Code Green - Administrative Issue',
      description: 'Response to documentation or registration problems',
      triggerConditions: ['Expired access codes', 'Missing documentation', 'Host unavailable'],
      responseSteps: [
        'Verify visitor identity',
        'Contact host or supervisor',
        'Update registration if needed',
        'Issue temporary access if appropriate',
        'Schedule follow-up if required'
      ],
      responseTime: '< 10 minutes',
      authorizedPersonnel: ['Reception Staff', 'Admin Coordinators', 'Department Supervisors']
    }
  ];

  const securityMetrics = [
    { label: 'Active Alerts', value: 6, change: '+2 from yesterday' },
    { label: 'Resolved Today', value: 18, change: '+15% this week' },
    { label: 'Average Response', value: '3.2 min', change: '-0.8 min improvement' },
    { label: 'Compliance Rate', value: '94.2%', change: '+1.1% this month' }
  ];

  const getSeverityBadge = (severity) => {
    const severityConfig = {
      low: { label: 'Low', className: 'bg-green-100 text-green-800' },
      medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-800' },
      high: { label: 'High', className: 'bg-red-100 text-red-800' },
      critical: { label: 'Critical', className: 'bg-purple-100 text-purple-800' }
    };
    const config = severityConfig[severity];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Active', className: 'bg-red-100 text-red-800', icon: AlertTriangle },
      investigating: { label: 'Investigating', className: 'bg-yellow-100 text-yellow-800', icon: Eye },
      resolved: { label: 'Resolved', className: 'bg-green-100 text-green-800', icon: CheckCircle }
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

  const getTrendBadge = (trend) => {
    if (trend === 'increasing') return <Badge className="bg-red-100 text-red-800">↑ Increasing</Badge>;
    if (trend === 'decreasing') return <Badge className="bg-green-100 text-green-800">↓ Decreasing</Badge>;
    return <Badge className="bg-gray-100 text-gray-800">→ Stable</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Security Violation Dashboard</h3>
          <p className="text-gray-600">Real-time security alerts with incident classification and response protocols</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Reports
          </Button>
          <Button>
            <Bell className="w-4 h-4 mr-2" />
            Test Alarm
          </Button>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {securityMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-gray-600">{metric.label}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="text-xs text-gray-500">{metric.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Security Alerts
          </CardTitle>
          <CardDescription>Active and recent security violations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityAlerts.map((alert) => (
              <div key={alert.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{alert.type}</h4>
                      {getSeverityBadge(alert.severity)}
                      {getStatusBadge(alert.status)}
                    </div>
                    <p className="text-sm text-gray-600">
                      {alert.timestamp} • {alert.location}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {alert.status !== 'resolved' && (
                      <Button size="sm" variant="outline">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Resolve
                      </Button>
                    )}
                    <Button size="sm" variant={alert.status === 'active' ? 'default' : 'outline'}>
                      View Details
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Description</p>
                    <p className="font-medium">{alert.description}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Response</p>
                    <p className="font-medium">{alert.response}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Assigned to: {alert.assignedOfficer}</span>
                  </div>
                  
                  {alert.status === 'active' && (
                    <Badge className="bg-red-50 text-red-800">
                      <Clock className="w-3 h-3 mr-1" />
                      Urgent Response Required
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Classification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Incident Classification
            </CardTitle>
            <CardDescription>Categories of security violations with trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incidentClassification.map((incident, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{incident.category}</h4>
                    <div className="flex items-center gap-2">
                      {getTrendBadge(incident.trend)}
                      <Badge variant="outline">{incident.count} incidents</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span>Severity:</span>
                    {getSeverityBadge(incident.severity)}
                  </div>
                  
                  <div className="text-sm">
                    <p className="text-gray-500 mb-1">Primary Response Protocols:</p>
                    <ul className="list-disc list-inside">
                      {incident.protocols.map((protocol, i) => (
                        <li key={i} className="text-gray-700">{protocol}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Response Protocols */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Response Protocols
            </CardTitle>
            <CardDescription>Standardized response procedures for security incidents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {responseProtocols.map((protocol) => (
                <div
                  key={protocol.id}
                  className="border rounded-lg mb-4 overflow-hidden"
                >
                  <div className="p-3 bg-gray-50 border-b">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{protocol.name}</h4>
                      <Badge variant="outline">Response: {protocol.responseTime}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{protocol.description}</p>
                  </div>
                  
                  <div className="p-3">
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1">Trigger Conditions:</p>
                      <ul className="text-sm space-y-1">
                        {protocol.triggerConditions.map((condition, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500">•</span>
                            <span>{condition}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1">Response Steps:</p>
                      <ol className="text-sm space-y-1 list-decimal list-inside">
                        {protocol.responseSteps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-1">Authorized Personnel:</p>
                      <div className="flex flex-wrap gap-1">
                        {protocol.authorizedPersonnel.map((person, index) => (
                          <Badge key={index} variant="outline">{person}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2 bg-gray-50 border-t flex justify-end">
                    <Button size="sm" variant="outline">View Full Protocol</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Security Violation Map
          </CardTitle>
          <CardDescription>Spatial visualization of recent security incidents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg text-center">
            <div className="w-full h-96 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-white mb-4">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <h4 className="font-medium text-gray-700">Interactive Security Map</h4>
                <p className="text-sm text-gray-500">Showing incident hotspots and security coverage</p>
              </div>
            </div>
            <div className="flex justify-between bg-white p-3 rounded-lg border">
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">High Severity</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm">Medium Severity</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Low Severity</span>
                </div>
              </div>
              <Button size="sm" variant="outline">Toggle Heatmap</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
