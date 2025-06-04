
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, Phone, Clock, Users, Zap } from 'lucide-react';

interface CrisisAlert {
  id: string;
  patientName: string;
  age: number;
  alertLevel: 'low' | 'medium' | 'high' | 'critical';
  crisisType: 'suicidal-ideation' | 'self-harm' | 'psychosis' | 'substance-abuse' | 'violence-risk';
  triggerTime: string;
  lastContact: string;
  riskScore: number;
  aiFlags: string[];
  responseTeam: string[];
  protocolActivated: boolean;
  emergencyContacts: string[];
  status: 'active' | 'responding' | 'stabilized' | 'resolved';
}

const mockCrisisAlerts: CrisisAlert[] = [
  {
    id: 'CA001',
    patientName: 'Alex Thompson',
    age: 22,
    alertLevel: 'critical',
    crisisType: 'suicidal-ideation',
    triggerTime: '15 minutes ago',
    lastContact: '20 minutes ago',
    riskScore: 95,
    aiFlags: ['Keyword detection: suicide', 'Emotional distress patterns', 'Previous attempt history'],
    responseTeam: ['Crisis Counselor', 'Psychiatrist', 'Security'],
    protocolActivated: true,
    emergencyContacts: ['Guardian: Mother', 'Emergency: 911'],
    status: 'responding'
  },
  {
    id: 'CA002',
    patientName: 'Maria Santos',
    age: 35,
    alertLevel: 'medium',
    crisisType: 'self-harm',
    triggerTime: '45 minutes ago',
    lastContact: '1 hour ago',
    riskScore: 68,
    aiFlags: ['Behavioral pattern change', 'Isolation indicators'],
    responseTeam: ['Therapist', 'Nurse'],
    protocolActivated: false,
    emergencyContacts: ['Spouse: Carlos Santos'],
    status: 'active'
  }
];

export const CrisisInterventionSystem = () => {
  const [crisisAlerts, setCrisisAlerts] = useState<CrisisAlert[]>(mockCrisisAlerts);

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { className: 'bg-red-100 text-red-800', label: 'Active Alert' },
      responding: { className: 'bg-blue-100 text-blue-800', label: 'Team Responding' },
      stabilized: { className: 'bg-yellow-100 text-yellow-800', label: 'Stabilized' },
      resolved: { className: 'bg-green-100 text-green-800', label: 'Resolved' }
    };
    return <Badge className={config[status].className}>{config[status].label}</Badge>;
  };

  const getCrisisTypeIcon = (type: string) => {
    switch (type) {
      case 'suicidal-ideation': return <AlertTriangle className="h-4 w-4" />;
      case 'self-harm': return <Shield className="h-4 w-4" />;
      case 'psychosis': return <Zap className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Crisis Intervention System
          </CardTitle>
          <CardDescription>
            Real-time crisis detection with immediate response protocols and emergency alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">1</p>
                    <p className="text-sm text-gray-600">Critical Alerts</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <Shield className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">0</p>
                    <p className="text-sm text-gray-600">High Priority</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-yellow-200 bg-yellow-50">
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">1</p>
                    <p className="text-sm text-gray-600">Medium Priority</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">3</p>
                    <p className="text-sm text-gray-600">Teams Active</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            {crisisAlerts.sort((a, b) => {
              const alertOrder = { critical: 4, high: 3, medium: 2, low: 1 };
              return alertOrder[b.alertLevel] - alertOrder[a.alertLevel];
            }).map((alert) => (
              <Card key={alert.id} className={`border-l-4 ${alert.alertLevel === 'critical' ? 'border-l-red-600' : alert.alertLevel === 'high' ? 'border-l-red-400' : alert.alertLevel === 'medium' ? 'border-l-yellow-400' : 'border-l-green-400'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{alert.patientName}</h3>
                      <Badge variant="outline">Age {alert.age}</Badge>
                      <Badge className={getAlertColor(alert.alertLevel)}>
                        {getCrisisTypeIcon(alert.crisisType)}
                        {alert.alertLevel.toUpperCase()}
                      </Badge>
                      {getStatusBadge(alert.status)}
                      {alert.protocolActivated && (
                        <Badge className="bg-blue-100 text-blue-800">Protocol Active</Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Triggered: {alert.triggerTime}</p>
                      <p className="text-sm font-medium">Last contact: {alert.lastContact}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Crisis Risk Score</span>
                          <span className="text-sm font-bold">{alert.riskScore}/100</span>
                        </div>
                        <Progress value={alert.riskScore} className="h-3" />
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Crisis Type:</h4>
                        <p className="text-sm capitalize">{alert.crisisType.replace('-', ' ')}</p>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2">AI Detection Flags:</h4>
                        <div className="space-y-1">
                          {alert.aiFlags.map((flag, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <AlertTriangle className="h-3 w-3 text-red-500" />
                              <span className="text-sm">{flag}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Response Team:</h4>
                        <div className="flex flex-wrap gap-2">
                          {alert.responseTeam.map((member, index) => (
                            <Badge key={index} variant="outline">{member}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Emergency Contacts:</h4>
                        <div className="space-y-1">
                          {alert.emergencyContacts.map((contact, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Phone className="h-3 w-3 text-blue-500" />
                              <span className="text-sm">{contact}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {alert.alertLevel === 'critical' && alert.status === 'active' && (
                      <Button size="sm" variant="destructive">
                        <Phone className="h-4 w-4 mr-1" />
                        Emergency Call
                      </Button>
                    )}
                    {!alert.protocolActivated && (
                      <Button size="sm" variant="outline">
                        <Shield className="h-4 w-4 mr-1" />
                        Activate Protocol
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Users className="h-4 w-4 mr-1" />
                      Dispatch Team
                    </Button>
                    <Button size="sm" variant="outline">
                      <Clock className="h-4 w-4 mr-1" />
                      Status Update
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
