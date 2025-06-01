
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, User, Phone, Bell, CheckCircle } from 'lucide-react';

export const EscalationAlerts = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      patient: 'John Doe',
      room: '301A',
      task: 'Medication Administration',
      assignedTo: 'Nurse Johnson',
      originalDue: '09:00',
      currentTime: '09:45',
      delayMinutes: 45,
      priority: 'critical',
      escalationLevel: 'supervisor',
      reason: 'Medication overdue - patient requires immediate attention',
      status: 'active'
    },
    {
      id: 2,
      patient: 'Sarah Wilson',
      room: '304B',
      task: 'Vital Signs Check',
      assignedTo: 'Nurse Davis',
      originalDue: '08:30',
      currentTime: '09:45',
      delayMinutes: 75,
      priority: 'high',
      escalationLevel: 'charge_nurse',
      reason: 'Post-operative monitoring delayed',
      status: 'acknowledged'
    },
    {
      id: 3,
      patient: 'Mike Brown',
      room: '303A',
      task: 'Blood Draw',
      assignedTo: 'Nurse Wilson',
      originalDue: '10:00',
      currentTime: '09:45',
      delayMinutes: 30,
      priority: 'medium',
      escalationLevel: 'team_lead',
      reason: 'Lab results needed for physician rounds',
      status: 'resolved'
    }
  ]);

  const getEscalationColor = (level: string) => {
    switch (level) {
      case 'supervisor': return 'bg-red-100 text-red-800 border-red-200';
      case 'charge_nurse': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'team_lead': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'acknowledged': return <Bell className="h-4 w-4 text-yellow-600" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const acknowledgeAlert = (alertId: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'acknowledged' }
        : alert
    ));
  };

  const resolveAlert = (alertId: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'resolved' }
        : alert
    ));
  };

  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const acknowledgedAlerts = alerts.filter(alert => alert.status === 'acknowledged');
  const resolvedAlerts = alerts.filter(alert => alert.status === 'resolved');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          Escalation Alerts
        </h2>
        <div className="flex gap-2">
          <Button className="bg-red-600 hover:bg-red-700">
            <Phone className="h-4 w-4 mr-2" />
            Contact Supervisor
          </Button>
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Send Notifications
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{activeAlerts.length}</div>
            <p className="text-sm text-red-800">Active Alerts</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{acknowledgedAlerts.length}</div>
            <p className="text-sm text-yellow-800">Acknowledged</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{resolvedAlerts.length}</div>
            <p className="text-sm text-green-800">Resolved Today</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(alerts.reduce((sum, alert) => sum + alert.delayMinutes, 0) / alerts.length)}
            </div>
            <p className="text-sm text-blue-800">Avg Delay (min)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Active Alerts ({activeAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeAlerts.map(alert => (
              <div key={alert.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-red-900">{alert.task}</h4>
                    <p className="text-sm text-red-700">{alert.patient} - {alert.room}</p>
                  </div>
                  <Badge className={getEscalationColor(alert.escalationLevel)}>
                    {alert.escalationLevel.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{alert.assignedTo}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Due: {alert.originalDue}</span>
                    </div>
                    <div className="text-red-600 font-medium">
                      {alert.delayMinutes} min overdue
                    </div>
                  </div>
                  <p className="text-sm text-red-800 bg-red-100 p-2 rounded">
                    {alert.reason}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    Acknowledge
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => resolveAlert(alert.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Resolve
                  </Button>
                  <Button size="sm" variant="outline">
                    Reassign
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Acknowledged & Resolved Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-yellow-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {acknowledgedAlerts.concat(resolvedAlerts).map(alert => (
              <div key={alert.id} className={`border rounded-lg p-4 ${
                alert.status === 'acknowledged' ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{alert.task}</h4>
                    <p className="text-sm text-gray-600">{alert.patient} - {alert.room}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(alert.status)}
                    <Badge className={
                      alert.status === 'acknowledged' 
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        : 'bg-green-100 text-green-800 border-green-200'
                    }>
                      {alert.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{alert.assignedTo}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{alert.delayMinutes} min delay</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Escalation Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-gray-800">15 min</div>
              <p className="text-sm text-gray-600">Team Lead Alert</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-gray-800">30 min</div>
              <p className="text-sm text-gray-600">Charge Nurse Alert</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-gray-800">60 min</div>
              <p className="text-sm text-gray-600">Supervisor Alert</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-gray-800">90%</div>
              <p className="text-sm text-gray-600">Resolution Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
