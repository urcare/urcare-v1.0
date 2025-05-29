import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Clock, AlertTriangle, CheckCircle, Phone, RefreshCw } from 'lucide-react';

interface MissedAlert {
  alertId: string;
  patientId: string;
  patientName: string;
  room: string;
  alertType: 'vital_sign' | 'medication' | 'procedure' | 'lab_result' | 'equipment';
  severity: 'low' | 'medium' | 'high' | 'critical';
  originalTime: Date;
  message: string;
  assignedTo: string[];
  repeatCount: number;
  lastRepeat: Date;
  acknowledged: boolean;
  responseTime?: Date;
  escalationLevel: number;
  maxEscalation: number;
}

const mockMissedAlerts: MissedAlert[] = [
  {
    alertId: 'ALT001',
    patientId: 'ICU001',
    patientName: 'Sarah Johnson',
    room: 'ICU-A1',
    alertType: 'vital_sign',
    severity: 'critical',
    originalTime: new Date(Date.now() - 900000),
    message: 'O2 saturation dropped to 85% - requires immediate attention',
    assignedTo: ['Nurse Smith', 'Dr. Wilson'],
    repeatCount: 3,
    lastRepeat: new Date(Date.now() - 300000),
    acknowledged: false,
    escalationLevel: 2,
    maxEscalation: 4
  },
  {
    alertId: 'ALT002',
    patientId: 'ICU003',
    patientName: 'Michael Chen',
    room: 'ICU-B2',
    alertType: 'medication',
    severity: 'high',
    originalTime: new Date(Date.now() - 1200000),
    message: 'Pain medication due 20 minutes ago',
    assignedTo: ['Nurse Davis'],
    repeatCount: 2,
    lastRepeat: new Date(Date.now() - 600000),
    acknowledged: true,
    responseTime: new Date(Date.now() - 300000),
    escalationLevel: 1,
    maxEscalation: 3
  },
  {
    alertId: 'ALT003',
    patientId: 'ICU004',
    patientName: 'Emma Wilson',
    room: 'ICU-C1',
    alertType: 'equipment',
    severity: 'medium',
    originalTime: new Date(Date.now() - 600000),
    message: 'Ventilator alarm - check patient connection',
    assignedTo: ['Respiratory Therapist', 'Nurse Johnson'],
    repeatCount: 1,
    lastRepeat: new Date(Date.now() - 300000),
    acknowledged: false,
    escalationLevel: 1,
    maxEscalation: 3
  }
];

export const MissedAlertRepeater = () => {
  const [alerts, setAlerts] = useState<MissedAlert[]>(mockMissedAlerts);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white animate-pulse';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'vital_sign': return <AlertTriangle className="h-5 w-5" />;
      case 'medication': return <Clock className="h-5 w-5" />;
      case 'equipment': return <RefreshCw className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const formatTimeSince = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ago`;
  };

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.alertId === alertId 
        ? { ...alert, acknowledged: true, responseTime: new Date() }
        : alert
    ));
  };

  const handleSnooze = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.alertId === alertId 
        ? { ...alert, lastRepeat: new Date(Date.now() + 600000) }
        : alert
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Missed Alert Repeater System
          </CardTitle>
          <CardDescription>
            Intelligent alert escalation system that prevents critical notifications from being overlooked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">2</p>
                  <p className="text-sm text-gray-600">Unacknowledged</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">6</p>
                  <p className="text-sm text-gray-600">Total Repeats</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Clock className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">8.5</p>
                  <p className="text-sm text-gray-600">Avg Response (min)</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">1</p>
                  <p className="text-sm text-gray-600">Resolved Today</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.alertId} className={`border-l-4 ${alert.severity === 'critical' ? 'border-l-red-600' : alert.severity === 'high' ? 'border-l-red-400' : 'border-l-yellow-400'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getAlertTypeIcon(alert.alertType)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{alert.patientName}</h3>
                        <p className="text-sm text-gray-600">{alert.room} • {alert.alertType.replace('_', ' ').toUpperCase()}</p>
                      </div>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      {alert.acknowledged ? (
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          ACKNOWLEDGED
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500 text-white animate-pulse">
                          UNRESOLVED
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Original: {formatTimeSince(alert.originalTime)}</p>
                      <p className="text-sm text-gray-500">Last Repeat: {formatTimeSince(alert.lastRepeat)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Alert Details</h4>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <strong>Message:</strong>
                          <p className="mt-1 p-2 bg-gray-50 rounded text-gray-700">{alert.message}</p>
                        </div>
                        <div className="text-sm">
                          <strong>Alert ID:</strong> {alert.alertId}
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Escalation Status</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Level {alert.escalationLevel}/{alert.maxEscalation}</span>
                            <span className="text-sm">{Math.round((alert.escalationLevel / alert.maxEscalation) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${alert.escalationLevel >= 3 ? 'bg-red-500' : alert.escalationLevel >= 2 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                              style={{ width: `${(alert.escalationLevel / alert.maxEscalation) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-sm">
                          <p><strong>Repeat Count:</strong> {alert.repeatCount}</p>
                          {alert.responseTime && (
                            <p><strong>Response Time:</strong> {formatTimeSince(alert.responseTime)}</p>
                          )}
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Assigned Staff</h4>
                      <div className="space-y-2">
                        {alert.assignedTo.map((staff, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm p-2 bg-blue-50 rounded">
                            <Phone className="h-3 w-3 text-blue-600" />
                            <span>{staff}</span>
                            {!alert.acknowledged && (
                              <Badge className="bg-yellow-500 text-white ml-auto">
                                Pending
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  <div className="flex gap-2">
                    {!alert.acknowledged ? (
                      <>
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => handleAcknowledge(alert.alertId)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Acknowledge Alert
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleSnooze(alert.alertId)}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          Snooze (10 min)
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Resolved
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-1" />
                      Escalate Now
                    </Button>
                    <Button size="sm" variant="outline">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Repeat Settings
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
