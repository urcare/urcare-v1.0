
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle,
  Clock,
  Users,
  MessageSquare,
  Shield,
  CheckCircle,
  XCircle,
  Phone
} from 'lucide-react';

export const IncidentResponseDashboard = () => {
  const [incidents, setIncidents] = useState([
    {
      id: 'INC001',
      title: 'Data Breach - Patient Portal',
      classification: 'Critical',
      severity: 'High',
      status: 'Active',
      reportedAt: '2024-01-22 09:30',
      assignedTo: 'Security Team',
      estimatedResolution: '2024-01-23 18:00',
      affectedSystems: ['Patient Portal', 'Database'],
      stakeholders: ['CISO', 'Legal', 'PR Team'],
      progress: 45
    },
    {
      id: 'INC002',
      title: 'Network Intrusion Attempt',
      classification: 'Security',
      severity: 'Medium',
      status: 'Investigating',
      reportedAt: '2024-01-22 14:15',
      assignedTo: 'SOC Team',
      estimatedResolution: '2024-01-22 22:00',
      affectedSystems: ['Firewall', 'Network'],
      stakeholders: ['IT Manager', 'Security'],
      progress: 75
    },
    {
      id: 'INC003',
      title: 'System Outage - EHR',
      classification: 'Operational',
      severity: 'Critical',
      status: 'Resolved',
      reportedAt: '2024-01-21 16:45',
      assignedTo: 'Infrastructure Team',
      estimatedResolution: '2024-01-21 20:30',
      affectedSystems: ['EHR System'],
      stakeholders: ['CTO', 'Operations'],
      progress: 100
    }
  ]);

  const [responseWorkflow, setResponseWorkflow] = useState([
    {
      step: 'Incident Detection',
      status: 'Completed',
      timestamp: '2024-01-22 09:30',
      owner: 'Monitoring System'
    },
    {
      step: 'Initial Assessment',
      status: 'Completed',
      timestamp: '2024-01-22 09:45',
      owner: 'SOC Analyst'
    },
    {
      step: 'Classification & Escalation',
      status: 'Completed',
      timestamp: '2024-01-22 10:00',
      owner: 'Incident Manager'
    },
    {
      step: 'Response Team Assembly',
      status: 'In Progress',
      timestamp: '2024-01-22 10:15',
      owner: 'Security Team Lead'
    },
    {
      step: 'Containment Actions',
      status: 'Pending',
      timestamp: null,
      owner: 'Technical Team'
    },
    {
      step: 'Recovery & Restoration',
      status: 'Pending',
      timestamp: null,
      owner: 'Operations Team'
    }
  ]);

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'Security': return 'bg-purple-100 text-purple-800';
      case 'Operational': return 'bg-blue-100 text-blue-800';
      case 'Compliance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-red-100 text-red-800';
      case 'Investigating': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600';
      case 'In Progress': return 'text-blue-600';
      case 'Pending': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Incident Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">7</div>
            <div className="text-sm text-gray-600">Active Incidents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">23</div>
            <div className="text-sm text-gray-600">Under Investigation</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">145</div>
            <div className="text-sm text-gray-600">Resolved This Month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">2.4h</div>
            <div className="text-sm text-gray-600">Avg Response Time</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Incidents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Active Incident Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {incidents.map((incident) => (
              <div key={incident.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{incident.title}</div>
                    <div className="text-sm text-gray-600">ID: {incident.id} | Reported: {incident.reportedAt}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getClassificationColor(incident.classification)}>
                      {incident.classification}
                    </Badge>
                    <Badge className={getSeverityColor(incident.severity)}>
                      {incident.severity}
                    </Badge>
                    <Badge className={getStatusColor(incident.status)}>
                      {incident.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Affected Systems</div>
                    <div className="flex flex-wrap gap-1">
                      {incident.affectedSystems.map((system, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {system}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Stakeholders</div>
                    <div className="flex flex-wrap gap-1">
                      {incident.stakeholders.map((stakeholder, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {stakeholder}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Assigned To</div>
                    <div className="font-medium">{incident.assignedTo}</div>
                    <div className="text-sm text-gray-600">ETA: {incident.estimatedResolution}</div>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span>Resolution Progress</span>
                    <span>{incident.progress}%</span>
                  </div>
                  <Progress value={incident.progress} className="h-2" />
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Comments (12)
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-3 w-3 mr-1" />
                      Contact Team
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Update
                    </Button>
                    <Button size="sm">
                      Escalate
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Response Workflow */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Incident Response Workflow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Response Steps (INC001)</h3>
              {responseWorkflow.map((step, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    {step.status === 'Completed' ? (
                      <CheckCircle className={`h-5 w-5 ${getStepStatusColor(step.status)}`} />
                    ) : step.status === 'In Progress' ? (
                      <Clock className={`h-5 w-5 ${getStepStatusColor(step.status)}`} />
                    ) : (
                      <XCircle className={`h-5 w-5 ${getStepStatusColor(step.status)}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{step.step}</div>
                    <div className="text-sm text-gray-600">
                      {step.timestamp && `Completed: ${step.timestamp}`} | Owner: {step.owner}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Communication Management</h3>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Stakeholder Notifications</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Executive Team</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex justify-between">
                    <span>Legal Department</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex justify-between">
                    <span>Public Relations</span>
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex justify-between">
                    <span>Regulatory Bodies</span>
                    <XCircle className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-800">Recent Updates</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div>10:30 - Initial containment actions deployed</div>
                  <div>11:15 - Forensic team engaged</div>
                  <div>11:45 - Affected users notified</div>
                  <div>12:30 - Media response prepared</div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Next Actions</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div>• Complete system isolation</div>
                  <div>• Conduct damage assessment</div>
                  <div>• Prepare regulatory notifications</div>
                  <div>• Document lessons learned</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incident Classification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Incident Classification & Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="font-medium mb-3">By Classification</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Security Incidents</span>
                  <span className="font-medium text-purple-600">45%</span>
                </div>
                <div className="flex justify-between">
                  <span>Operational Issues</span>
                  <span className="font-medium text-blue-600">30%</span>
                </div>
                <div className="flex justify-between">
                  <span>Compliance Issues</span>
                  <span className="font-medium text-orange-600">15%</span>
                </div>
                <div className="flex justify-between">
                  <span>Data Breaches</span>
                  <span className="font-medium text-red-600">10%</span>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="font-medium mb-3">Response Times</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Detection to Response</span>
                  <span className="font-medium">12 min</span>
                </div>
                <div className="flex justify-between">
                  <span>Response to Containment</span>
                  <span className="font-medium">1.2 hrs</span>
                </div>
                <div className="flex justify-between">
                  <span>Containment to Resolution</span>
                  <span className="font-medium">8.5 hrs</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Resolution Time</span>
                  <span className="font-medium">9.9 hrs</span>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="font-medium mb-3">This Month</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Incidents</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Severity Score</span>
                  <span className="font-medium">6.2/10</span>
                </div>
                <div className="flex justify-between">
                  <span>First-Call Resolution</span>
                  <span className="font-medium text-green-600">78%</span>
                </div>
                <div className="flex justify-between">
                  <span>SLA Compliance</span>
                  <span className="font-medium text-green-600">94%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
