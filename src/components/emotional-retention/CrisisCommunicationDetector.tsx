
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  Bell, 
  MessageCircle, 
  Clock,
  Phone,
  Heart,
  Brain,
  Shield
} from 'lucide-react';

interface CrisisAlert {
  id: string;
  patientId: string;
  patientName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  triggerType: 'language' | 'behavior' | 'pattern' | 'escalation';
  detectedText: string;
  confidence: number;
  timestamp: string;
  status: 'active' | 'responded' | 'resolved';
  responseTime: number;
  actionTaken: string[];
}

const mockAlerts: CrisisAlert[] = [
  {
    id: 'CA001',
    patientId: 'P3156',
    patientName: 'Emma Davis',
    severity: 'critical',
    triggerType: 'language',
    detectedText: 'I feel like giving up on everything',
    confidence: 94,
    timestamp: '2024-01-20 15:15',
    status: 'active',
    responseTime: 0,
    actionTaken: []
  },
  {
    id: 'CA002',
    patientId: 'P2847',
    patientName: 'Sarah Johnson',
    severity: 'high',
    triggerType: 'pattern',
    detectedText: 'Multiple missed appointments and declining mood scores',
    confidence: 87,
    timestamp: '2024-01-20 14:30',
    status: 'responded',
    responseTime: 12,
    actionTaken: ['counselor contacted', 'follow-up scheduled']
  },
  {
    id: 'CA003',
    patientId: 'P1045',
    patientName: 'Robert Kim',
    severity: 'medium',
    triggerType: 'behavior',
    detectedText: 'Decreased app usage and social withdrawal indicators',
    confidence: 76,
    timestamp: '2024-01-20 13:45',
    status: 'resolved',
    responseTime: 45,
    actionTaken: ['check-in call completed', 'support resources provided']
  }
];

export const CrisisCommunicationDetector = () => {
  const [alerts] = useState<CrisisAlert[]>(mockAlerts);
  const [selectedAlert, setSelectedAlert] = useState<CrisisAlert | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800 border-red-200';
      case 'responded': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'language': return MessageCircle;
      case 'behavior': return Brain;
      case 'pattern': return AlertTriangle;
      case 'escalation': return Bell;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Crisis Communication Detector
          </CardTitle>
          <CardDescription>
            Real-time monitoring with alert generation and immediate response protocols
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {alerts.filter(a => a.status === 'active').length}
                    </p>
                    <p className="text-sm text-gray-600">Active Alerts</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">
                      {alerts.filter(a => a.status === 'responded').length}
                    </p>
                    <p className="text-sm text-gray-600">In Progress</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <Shield className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {alerts.filter(a => a.status === 'resolved').length}
                    </p>
                    <p className="text-sm text-gray-600">Resolved</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Brain className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.round(alerts.reduce((sum, a) => sum + a.confidence, 0) / alerts.length)}%
                    </p>
                    <p className="text-sm text-gray-600">Avg Confidence</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {alerts.filter(alert => alert.status === 'active').length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-red-600">Urgent: Active Crisis Alerts</h3>
              <div className="space-y-3">
                {alerts.filter(alert => alert.status === 'active').map((alert) => (
                  <Alert key={alert.id} className="border-l-4 border-l-red-500 bg-red-50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="flex items-center justify-between">
                      <span>{alert.patientName} - {alert.severity.toUpperCase()} ALERT</span>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </AlertTitle>
                    <AlertDescription>
                      <div className="space-y-2">
                        <p><strong>Detected:</strong> "{alert.detectedText}"</p>
                        <p><strong>Confidence:</strong> {alert.confidence}%</p>
                        <p><strong>Time:</strong> {alert.timestamp}</p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="destructive">
                            <Phone className="h-4 w-4 mr-1" />
                            Emergency Contact
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Immediate Response
                          </Button>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">All Crisis Alerts</h3>
              {alerts.map((alert) => {
                const TriggerIcon = getTriggerIcon(alert.triggerType);
                return (
                  <Card 
                    key={alert.id} 
                    className={`cursor-pointer transition-colors ${selectedAlert?.id === alert.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-red-400`}
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold mb-1">{alert.patientName}</h4>
                          <p className="text-sm text-gray-600 mb-1">ID: {alert.patientId}</p>
                          <div className="flex items-center gap-2">
                            <TriggerIcon className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {alert.triggerType} detection
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(alert.status)}>
                            {alert.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-sm bg-gray-50 p-2 rounded mb-3">
                        <p className="font-medium">Detected Content:</p>
                        <p className="text-gray-700 italic">"{alert.detectedText}"</p>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{alert.timestamp}</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-600">
                          <Brain className="h-3 w-3" />
                          <span>{alert.confidence}% confidence</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div>
              {selectedAlert ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedAlert.patientName}</CardTitle>
                    <CardDescription>Crisis alert details and response protocols</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Alert Details</h4>
                          <div className="space-y-1 text-sm">
                            <p>Severity: <Badge className={getSeverityColor(selectedAlert.severity)}>
                              {selectedAlert.severity}
                            </Badge></p>
                            <p>Type: <strong>{selectedAlert.triggerType}</strong></p>
                            <p>Confidence: <strong>{selectedAlert.confidence}%</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Response Status</h4>
                          <div className="space-y-1 text-sm">
                            <p>Status: <Badge className={getStatusColor(selectedAlert.status)}>
                              {selectedAlert.status}
                            </Badge></p>
                            <p>Response Time: <strong>
                              {selectedAlert.responseTime > 0 ? `${selectedAlert.responseTime} min` : 'Pending'}
                            </strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Detected Content</h4>
                        <div className="text-sm bg-red-50 p-3 rounded border-l-4 border-red-400">
                          <p className="text-red-800 font-medium">Crisis Indicator:</p>
                          <p className="text-red-700 italic">"{selectedAlert.detectedText}"</p>
                        </div>
                      </div>
                      
                      {selectedAlert.actionTaken.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Actions Taken</h4>
                          <div className="space-y-2">
                            {selectedAlert.actionTaken.map((action, index) => (
                              <div key={index} className="text-sm bg-green-50 p-2 rounded">
                                <div className="flex items-start gap-2">
                                  <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-green-700">{action}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-medium mb-2">Response Protocols</h4>
                        <div className="space-y-2">
                          {selectedAlert.severity === 'critical' && (
                            <div className="text-sm bg-red-50 p-2 rounded">
                              <p className="font-medium text-red-800">Immediate Response Required</p>
                              <p className="text-red-700">Contact emergency services and crisis intervention team</p>
                            </div>
                          )}
                          <div className="text-sm bg-blue-50 p-2 rounded">
                            <p className="font-medium text-blue-800">Safety Assessment</p>
                            <p className="text-blue-700">Conduct immediate risk evaluation and safety planning</p>
                          </div>
                          <div className="text-sm bg-green-50 p-2 rounded">
                            <p className="font-medium text-green-800">Follow-up Care</p>
                            <p className="text-green-700">Schedule continuous monitoring and support resources</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {selectedAlert.status === 'active' && (
                          <>
                            <Button variant="destructive">
                              <Phone className="h-4 w-4 mr-1" />
                              Emergency Response
                            </Button>
                            <Button>
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Contact Patient
                            </Button>
                          </>
                        )}
                        <Button variant="outline">
                          <Heart className="h-4 w-4 mr-1" />
                          Safety Plan
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a crisis alert to view detailed information and response protocols</p>
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
