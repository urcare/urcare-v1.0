
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Bell, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  Send,
  User,
  Calendar
} from 'lucide-react';

export const CriticalValueAlerts = () => {
  const [selectedAlert, setSelectedAlert] = useState(null);

  const criticalAlerts = [
    {
      id: 'CV001',
      patient: 'John Smith',
      mrn: 'MRN123456',
      test: 'Troponin I',
      value: '25.8 ng/mL',
      reference: '< 0.04 ng/mL',
      severity: 'critical',
      timestamp: '2024-01-21 09:15:30',
      status: 'pending',
      notificationsSent: ['SMS', 'Email'],
      assignedTo: 'Dr. Sarah Johnson',
      location: 'ICU Bed 12',
      escalationLevel: 1
    },
    {
      id: 'CV002',
      patient: 'Mary Johnson',
      mrn: 'MRN789012',
      test: 'Potassium',
      value: '6.8 mmol/L',
      reference: '3.5-5.1 mmol/L',
      severity: 'high',
      timestamp: '2024-01-21 08:45:15',
      status: 'acknowledged',
      notificationsSent: ['SMS', 'In-App'],
      assignedTo: 'Dr. Michael Chen',
      location: 'Ward A Room 205',
      escalationLevel: 0
    },
    {
      id: 'CV003',
      patient: 'Robert Davis',
      mrn: 'MRN345678',
      test: 'Glucose',
      value: '28 mmol/L',
      reference: '3.9-5.5 mmol/L',
      severity: 'critical',
      timestamp: '2024-01-21 07:30:45',
      status: 'resolved',
      notificationsSent: ['SMS', 'Email', 'Phone'],
      assignedTo: 'Dr. Lisa Wang',
      location: 'Emergency Room',
      escalationLevel: 2
    }
  ];

  const escalationRules = [
    {
      test: 'Troponin I',
      criticalValue: '> 0.04 ng/mL',
      notifications: ['SMS', 'Email', 'In-App'],
      escalationTime: 15,
      recipients: ['Attending Physician', 'Cardiology', 'ICU Charge Nurse'],
      autoEscalate: true
    },
    {
      test: 'Potassium',
      criticalValue: '< 2.5 or > 6.0 mmol/L',
      notifications: ['SMS', 'In-App'],
      escalationTime: 10,
      recipients: ['Primary Physician', 'Nephrology'],
      autoEscalate: true
    },
    {
      test: 'Glucose',
      criticalValue: '< 2.8 or > 25 mmol/L',
      notifications: ['SMS', 'Email', 'Phone'],
      escalationTime: 5,
      recipients: ['Emergency Physician', 'Endocrinology'],
      autoEscalate: true
    }
  ];

  const performanceMetrics = {
    totalAlerts: 156,
    pendingAlerts: 12,
    acknowledgedToday: 89,
    averageResponseTime: '4.2 minutes',
    escalationRate: '8.5%',
    resolutionRate: '96.8%'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Critical Value Alerts</h2>
          <p className="text-gray-600">Monitor and manage critical laboratory results</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Alert Rules
          </Button>
          <Button className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Test Notification
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-900">{performanceMetrics.totalAlerts}</p>
            <p className="text-sm text-red-700">Total Alerts</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-900">{performanceMetrics.pendingAlerts}</p>
            <p className="text-sm text-yellow-700">Pending</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">{performanceMetrics.acknowledgedToday}</p>
            <p className="text-sm text-green-700">Acknowledged Today</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{performanceMetrics.averageResponseTime}</p>
            <p className="text-sm text-blue-700">Avg Response</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <Send className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">{performanceMetrics.escalationRate}</p>
            <p className="text-sm text-purple-700">Escalation Rate</p>
          </CardContent>
        </Card>
        <Card className="border-indigo-200 bg-indigo-50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-indigo-900">{performanceMetrics.resolutionRate}</p>
            <p className="text-sm text-indigo-700">Resolution Rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active-alerts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active-alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="escalation-rules">Escalation Rules</TabsTrigger>
          <TabsTrigger value="notification-logs">Notification Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="active-alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Critical Value Alerts</CardTitle>
              <CardDescription>Current critical results requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {criticalAlerts.map((alert, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${
                    alert.severity === 'critical' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className={`h-5 w-5 ${
                          alert.severity === 'critical' ? 'text-red-600' : 'text-yellow-600'
                        }`} />
                        <div>
                          <h4 className="font-semibold text-gray-900">{alert.patient}</h4>
                          <p className="text-sm text-gray-600">{alert.mrn} • {alert.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${
                          alert.status === 'pending' ? 'bg-red-500' :
                          alert.status === 'acknowledged' ? 'bg-yellow-500' : 'bg-green-500'
                        } text-white`}>
                          {alert.status}
                        </Badge>
                        <Badge variant="outline" className={`${
                          alert.severity === 'critical' ? 'border-red-500 text-red-700' : 'border-yellow-500 text-yellow-700'
                        }`}>
                          {alert.severity}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Test</p>
                        <p className="text-lg font-bold text-gray-900">{alert.test}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Result</p>
                        <p className={`text-lg font-bold ${
                          alert.severity === 'critical' ? 'text-red-600' : 'text-yellow-600'
                        }`}>{alert.value}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Reference</p>
                        <p className="text-sm text-gray-600">{alert.reference}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Assigned To</p>
                        <p className="text-sm text-gray-900">{alert.assignedTo}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{alert.timestamp}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {alert.notificationsSent.map((method, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {method === 'SMS' && <Phone className="h-3 w-3 mr-1" />}
                              {method === 'Email' && <Mail className="h-3 w-3 mr-1" />}
                              {method === 'In-App' && <Bell className="h-3 w-3 mr-1" />}
                              {method}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {alert.status === 'pending' && (
                          <>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              Acknowledge
                            </Button>
                            <Button size="sm">
                              <Send className="h-4 w-4 mr-1" />
                              Escalate
                            </Button>
                          </>
                        )}
                        {alert.status === 'acknowledged' && (
                          <Button size="sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escalation-rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Escalation Rules Configuration</CardTitle>
              <CardDescription>Automated notification and escalation protocols</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {escalationRules.map((rule, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{rule.test}</h4>
                      <Badge variant="outline" className={rule.autoEscalate ? 'border-green-500 text-green-700' : 'border-gray-500'}>
                        {rule.autoEscalate ? 'Auto-Escalate' : 'Manual'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Critical Value</p>
                        <p className="text-sm text-gray-900">{rule.criticalValue}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Escalation Time</p>
                        <p className="text-sm text-gray-900">{rule.escalationTime} minutes</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Notification Methods</p>
                        <div className="flex gap-1">
                          {rule.notifications.map((method, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {method}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Recipients</p>
                      <div className="flex flex-wrap gap-1">
                        {rule.recipients.map((recipient, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            <User className="h-3 w-3 mr-1" />
                            {recipient}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notification-logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>Log of all critical value notifications sent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: '09:15:30', patient: 'John Smith', test: 'Troponin I', method: 'SMS', status: 'delivered', recipient: 'Dr. Sarah Johnson' },
                  { time: '09:15:35', patient: 'John Smith', test: 'Troponin I', method: 'Email', status: 'delivered', recipient: 'Dr. Sarah Johnson' },
                  { time: '08:45:20', patient: 'Mary Johnson', test: 'Potassium', method: 'SMS', status: 'delivered', recipient: 'Dr. Michael Chen' },
                  { time: '07:30:50', patient: 'Robert Davis', test: 'Glucose', method: 'Phone', status: 'answered', recipient: 'Dr. Lisa Wang' },
                ].map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">{log.time}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{log.patient} - {log.test}</p>
                        <p className="text-xs text-gray-600">to {log.recipient}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {log.method === 'SMS' && <Phone className="h-3 w-3 mr-1" />}
                        {log.method === 'Email' && <Mail className="h-3 w-3 mr-1" />}
                        {log.method === 'Phone' && <Phone className="h-3 w-3 mr-1" />}
                        {log.method}
                      </Badge>
                      <Badge className={`text-xs ${
                        log.status === 'delivered' || log.status === 'answered' ? 'bg-green-500' : 'bg-red-500'
                      } text-white`}>
                        {log.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
