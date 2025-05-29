
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Phone, Clock, Activity, Heart, TrendingDown } from 'lucide-react';

interface VitalAlert {
  patientId: string;
  patientName: string;
  room: string;
  vitalType: 'heart_rate' | 'blood_pressure' | 'oxygen_sat' | 'temperature';
  currentValue: number | string;
  thresholdValue: number | string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timeDetected: Date;
  escalationLevel: number;
  notificationsSent: string[];
  responseRequired: boolean;
  acknowledged: boolean;
  responseTime?: Date;
}

const mockVitalAlerts: VitalAlert[] = [
  {
    patientId: 'ICU001',
    patientName: 'Sarah Johnson',
    room: 'ICU-A1',
    vitalType: 'oxygen_sat',
    currentValue: 85,
    thresholdValue: 90,
    severity: 'critical',
    timeDetected: new Date(Date.now() - 300000),
    escalationLevel: 3,
    notificationsSent: ['Nurse Smith', 'Dr. Wilson', 'ICU Supervisor'],
    responseRequired: true,
    acknowledged: false
  },
  {
    patientId: 'ICU003',
    patientName: 'Michael Chen',
    room: 'ICU-B2',
    vitalType: 'heart_rate',
    currentValue: 45,
    thresholdValue: 60,
    severity: 'high',
    timeDetected: new Date(Date.now() - 120000),
    escalationLevel: 2,
    notificationsSent: ['Nurse Davis', 'Dr. Martinez'],
    responseRequired: true,
    acknowledged: true,
    responseTime: new Date(Date.now() - 60000)
  }
];

export const VitalDropNotifier = () => {
  const [alerts, setAlerts] = useState<VitalAlert[]>(mockVitalAlerts);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white animate-pulse';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getVitalIcon = (type: string) => {
    switch (type) {
      case 'heart_rate': return <Heart className="h-5 w-5" />;
      case 'oxygen_sat': return <Activity className="h-5 w-5" />;
      default: return <TrendingDown className="h-5 w-5" />;
    }
  };

  const formatTimeSince = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    return `${minutes} min ago`;
  };

  const handleAcknowledge = (patientId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.patientId === patientId 
        ? { ...alert, acknowledged: true, responseTime: new Date() }
        : alert
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Vital Drop Auto-Notifier
          </CardTitle>
          <CardDescription>
            Automated escalation system for critical vital sign changes with real-time notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">2</p>
                  <p className="text-sm text-gray-600">Active Alerts</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-2">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">1</p>
                  <p className="text-sm text-gray-600">Pending Response</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Phone className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">7</p>
                  <p className="text-sm text-gray-600">Notifications Sent</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <Activity className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">2.3</p>
                  <p className="text-sm text-gray-600">Avg Response (min)</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.patientId} className={`border-l-4 ${alert.severity === 'critical' ? 'border-l-red-600' : 'border-l-yellow-500'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getVitalIcon(alert.vitalType)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{alert.patientName}</h3>
                        <p className="text-sm text-gray-600">{alert.room} • {alert.vitalType.replace('_', ' ').toUpperCase()}</p>
                      </div>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()} ALERT
                      </Badge>
                      {alert.acknowledged && (
                        <Badge className="bg-green-500 text-white">
                          ACKNOWLEDGED
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Detected: {formatTimeSince(alert.timeDetected)}</p>
                      {alert.responseTime && (
                        <p className="text-sm text-green-600">Response: {formatTimeSince(alert.responseTime)}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Vital Reading</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Current:</span>
                          <span className="font-bold text-red-600">{alert.currentValue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Threshold:</span>
                          <span className="font-medium">{alert.thresholdValue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Deviation:</span>
                          <span className="font-bold text-red-600">
                            {typeof alert.currentValue === 'number' && typeof alert.thresholdValue === 'number' 
                              ? `${Math.abs(alert.currentValue - alert.thresholdValue)}` 
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Escalation Status</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Level {alert.escalationLevel}/4</span>
                            <span className="text-sm">{alert.escalationLevel * 25}%</span>
                          </div>
                          <Progress value={alert.escalationLevel * 25} className="h-2" />
                        </div>
                        <div className="text-sm">
                          <p><strong>Notifications:</strong> {alert.notificationsSent.length}</p>
                          <p><strong>Response Required:</strong> {alert.responseRequired ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Notifications Sent</h4>
                      <div className="space-y-2">
                        {alert.notificationsSent.map((recipient, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 text-blue-600" />
                            <span>{recipient}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  <div className="flex gap-2">
                    {!alert.acknowledged && (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleAcknowledge(alert.patientId)}
                      >
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Acknowledge Alert
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-1" />
                      Call Team
                    </Button>
                    <Button size="sm" variant="outline">
                      View Trends
                    </Button>
                    <Button size="sm" variant="outline">
                      Emergency Protocol
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
