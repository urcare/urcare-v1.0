
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Zap, AlertTriangle, Clock, Phone, Users } from 'lucide-react';

interface EscalationAlert {
  id: string;
  patientName: string;
  room: string;
  alertType: 'vital-signs' | 'deterioration' | 'code-blue' | 'sepsis' | 'medication';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timeTriggered: string;
  responseTime: number;
  escalationLevel: number;
  assignedStaff: string[];
  status: 'active' | 'acknowledged' | 'responding' | 'resolved';
  autoActions: string[];
  nextEscalation: string;
}

const mockAlerts: EscalationAlert[] = [
  {
    id: 'ESC001',
    patientName: 'Jennifer Walsh',
    room: 'ICU-A3',
    alertType: 'code-blue',
    severity: 'critical',
    timeTriggered: '2 min ago',
    responseTime: 0,
    escalationLevel: 3,
    assignedStaff: ['Dr. Smith', 'Nurse Johnson', 'RT Team'],
    status: 'active',
    autoActions: ['Code blue announced', 'Team assembled', 'Equipment prepared'],
    nextEscalation: 'Backup physician in 5 min'
  },
  {
    id: 'ESC002',
    patientName: 'Michael Brown',
    room: 'Ward-B12',
    alertType: 'deterioration',
    severity: 'high',
    timeTriggered: '8 min ago',
    responseTime: 3,
    escalationLevel: 2,
    assignedStaff: ['Dr. Davis', 'Nurse Wilson'],
    status: 'responding',
    autoActions: ['Primary nurse notified', 'Vitals rechecked'],
    nextEscalation: 'ICU consultation in 10 min'
  }
];

export const EmergencyEscalationDashboard = () => {
  const [alerts, setAlerts] = useState<EscalationAlert[]>(mockAlerts);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { className: 'bg-red-100 text-red-800', label: 'Active' },
      acknowledged: { className: 'bg-yellow-100 text-yellow-800', label: 'Acknowledged' },
      responding: { className: 'bg-blue-100 text-blue-800', label: 'Responding' },
      resolved: { className: 'bg-green-100 text-green-800', label: 'Resolved' }
    };
    return <Badge className={config[status].className}>{config[status].label}</Badge>;
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'code-blue': return <Zap className="h-4 w-4" />;
      case 'deterioration': return <AlertTriangle className="h-4 w-4" />;
      case 'vital-signs': return <Clock className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Emergency Escalation Dashboard
          </CardTitle>
          <CardDescription>
            Automated alert triggers, escalation pathways, and response time tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <Zap className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">1</p>
                    <p className="text-sm text-gray-600">Critical Alerts</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">1</p>
                    <p className="text-sm text-gray-600">High Priority</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">2.1</p>
                    <p className="text-sm text-gray-600">Avg Response (min)</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <Users className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">8</p>
                    <p className="text-sm text-gray-600">Staff Available</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            {alerts.sort((a, b) => {
              const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
              return severityOrder[b.severity] - severityOrder[a.severity];
            }).map((alert) => (
              <Card key={alert.id} className={`border-l-4 ${alert.severity === 'critical' ? 'border-l-red-600' : alert.severity === 'high' ? 'border-l-red-400' : alert.severity === 'medium' ? 'border-l-yellow-400' : 'border-l-green-400'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{alert.patientName}</h3>
                      <Badge variant="outline">{alert.room}</Badge>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {getAlertTypeIcon(alert.alertType)}
                        {alert.alertType.toUpperCase()}
                      </Badge>
                      {getStatusBadge(alert.status)}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Triggered: {alert.timeTriggered}</p>
                      <p className="text-sm font-medium">Response time: {alert.responseTime} min</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Escalation Level</span>
                          <span className="text-sm font-bold">{alert.escalationLevel}/5</span>
                        </div>
                        <Progress value={alert.escalationLevel * 20} className="h-3" />
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Assigned Staff:</h4>
                        <div className="flex flex-wrap gap-2">
                          {alert.assignedStaff.map((staff, index) => (
                            <Badge key={index} variant="outline">{staff}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Automated Actions:</h4>
                        <ul className="text-sm space-y-1">
                          {alert.autoActions.map((action, index) => (
                            <li key={index}>✓ {action}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium mb-1">Next Escalation:</h4>
                    <p className="text-sm">{alert.nextEscalation}</p>
                  </div>

                  <div className="flex gap-2">
                    {alert.status === 'active' && (
                      <Button size="sm" variant="destructive">
                        <Phone className="h-4 w-4 mr-1" />
                        Call Team
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      Acknowledge
                    </Button>
                    <Button size="sm" variant="outline">
                      Escalate Now
                    </Button>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
