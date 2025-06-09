
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  AlertTriangle,
  Phone,
  Shield,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Heart,
  Bell,
  FileText
} from 'lucide-react';

export const CrisisInterventionInterface = () => {
  const [activeAlerts, setActiveAlerts] = useState([
    {
      id: 1,
      patientName: 'John Smith',
      riskLevel: 'high',
      triggerReason: 'Suicidal ideation expressed during session',
      timestamp: '2024-01-15 14:30',
      status: 'active',
      assignedTo: 'Dr. Sarah Martinez',
      contactAttempts: 2
    },
    {
      id: 2,
      patientName: 'Lisa Anderson',
      riskLevel: 'medium',
      triggerReason: 'Missed two consecutive appointments',
      timestamp: '2024-01-15 09:15',
      status: 'monitoring',
      assignedTo: 'Dr. James Wilson',
      contactAttempts: 1
    }
  ]);

  const emergencyContacts = [
    {
      id: 1,
      type: 'Crisis Hotline',
      name: 'National Suicide Prevention Lifeline',
      number: '988',
      available: '24/7',
      status: 'active'
    },
    {
      id: 2,
      type: 'Emergency Services',
      name: 'Emergency Medical Services',
      number: '911',
      available: '24/7',
      status: 'active'
    },
    {
      id: 3,
      type: 'Mobile Crisis Team',
      name: 'County Mental Health Crisis Team',
      number: '555-CRISIS',
      available: '24/7',
      status: 'active'
    },
    {
      id: 4,
      type: 'Psychiatric Emergency',
      name: 'City Hospital Psychiatric Emergency',
      number: '555-PSYCH',
      available: '24/7',
      status: 'active'
    }
  ];

  const safetyPlans = [
    {
      id: 1,
      patientName: 'John Smith',
      createdDate: '2024-01-10',
      lastUpdated: '2024-01-15',
      warningSigns: ['Feeling hopeless', 'Isolation from friends', 'Sleep problems'],
      copingStrategies: ['Deep breathing exercises', 'Call support person', 'Listen to music'],
      supportContacts: ['Sister - Mary (555-1234)', 'Best friend - Tom (555-5678)'],
      professionalContacts: ['Dr. Martinez (555-9999)', 'Crisis Line (988)'],
      safeEnvironment: ['Remove sharp objects', 'Stay with family member'],
      status: 'active'
    }
  ];

  const riskAssessmentProtocols = [
    {
      category: 'Suicide Risk',
      questions: [
        'Are you having thoughts of hurting yourself?',
        'Have you thought about how you would hurt yourself?',
        'Do you have access to means of self-harm?',
        'Have you made plans to hurt yourself?',
        'Do you intend to act on these thoughts?'
      ]
    },
    {
      category: 'Violence Risk',
      questions: [
        'Are you having thoughts of hurting others?',
        'Have you identified a specific person you want to hurt?',
        'Do you have access to weapons?',
        'Have you made specific plans?',
        'Do you intend to act on these thoughts?'
      ]
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'monitoring': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Crisis Alert Banner */}
      {activeAlerts.some(alert => alert.riskLevel === 'high') && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Critical Crisis Alerts Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-red-700">
                {activeAlerts.filter(alert => alert.riskLevel === 'high').length} high-risk patients require immediate intervention
              </div>
              <Button variant="destructive" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Emergency Protocol
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="alerts" className="w-full">
        <TabsList>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="assessment">Risk Assessment</TabsTrigger>
          <TabsTrigger value="safety">Safety Plans</TabsTrigger>
          <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Crisis Intervention Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeAlerts.map((alert) => (
                  <div key={alert.id} className={`p-4 border rounded-lg ${alert.riskLevel === 'high' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <AlertTriangle className={`h-5 w-5 ${alert.riskLevel === 'high' ? 'text-red-600' : 'text-yellow-600'}`} />
                        <div>
                          <h3 className="font-medium">{alert.patientName}</h3>
                          <div className="text-sm text-gray-600">{alert.timestamp}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRiskColor(alert.riskLevel)}>
                          {alert.riskLevel} risk
                        </Badge>
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Trigger: </span>
                        <span className="text-gray-700">{alert.triggerReason}</span>
                      </div>
                      <div>
                        <span className="font-medium">Assigned to: </span>
                        <span className="text-gray-700">{alert.assignedTo}</span>
                      </div>
                      <div>
                        <span className="font-medium">Contact attempts: </span>
                        <span className="text-gray-700">{alert.contactAttempts}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant={alert.riskLevel === 'high' ? 'destructive' : 'default'} size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Contact Patient
                      </Button>
                      <Button variant="outline" size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        Contact Family
                      </Button>
                      <Button variant="outline" size="sm">
                        <Shield className="h-4 w-4 mr-2" />
                        Safety Plan
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Document
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment Protocol</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {riskAssessmentProtocols.map((protocol, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="font-medium text-lg">{protocol.category}</h3>
                  <div className="space-y-3">
                    {protocol.questions.map((question, qIndex) => (
                      <div key={qIndex} className="flex items-center space-x-3">
                        <Checkbox id={`q-${index}-${qIndex}`} />
                        <Label htmlFor={`q-${index}-${qIndex}`} className="text-sm">
                          {question}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="additional-info">Additional Risk Factors</Label>
                  <Textarea 
                    id="additional-info" 
                    placeholder="Document any additional risk factors, protective factors, or clinical observations..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="risk-level">Overall Risk Level</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="">Select risk level</option>
                      <option value="low">Low Risk</option>
                      <option value="medium">Medium Risk</option>
                      <option value="high">High Risk</option>
                      <option value="critical">Critical Risk</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="assessor">Assessor</Label>
                    <Input id="assessor" placeholder="Clinician name" />
                  </div>
                  <div>
                    <Label htmlFor="assessment-date">Assessment Date</Label>
                    <Input id="assessment-date" type="datetime-local" />
                  </div>
                </div>
                
                <Button className="w-full">Complete Risk Assessment</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety" className="space-y-4">
          <div className="space-y-4">
            {safetyPlans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Safety Plan - {plan.patientName}</span>
                    <Badge className={plan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {plan.status}
                    </Badge>
                  </CardTitle>
                  <div className="text-sm text-gray-600">
                    Created: {plan.createdDate} | Last Updated: {plan.lastUpdated}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          Warning Signs
                        </h4>
                        <ul className="text-sm space-y-1">
                          {plan.warningSigns.map((sign, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <XCircle className="h-3 w-3 text-red-600" />
                              {sign}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Heart className="h-4 w-4 text-blue-600" />
                          Coping Strategies
                        </h4>
                        <ul className="text-sm space-y-1">
                          {plan.copingStrategies.map((strategy, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              {strategy}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Users className="h-4 w-4 text-purple-600" />
                          Support Contacts
                        </h4>
                        <ul className="text-sm space-y-1">
                          {plan.supportContacts.map((contact, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Phone className="h-3 w-3 text-blue-600" />
                              {contact}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-600" />
                          Professional Contacts
                        </h4>
                        <ul className="text-sm space-y-1">
                          {plan.professionalContacts.map((contact, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Phone className="h-3 w-3 text-green-600" />
                              {contact}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Safe Environment Steps</h4>
                        <ul className="text-sm space-y-1">
                          {plan.safeEnvironment.map((step, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-6">
                    <Button variant="outline">Edit Plan</Button>
                    <Button variant="outline">Print Plan</Button>
                    <Button>Share with Patient</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create New Safety Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="patient-name">Patient Name</Label>
                <Input id="patient-name" placeholder="Select patient" />
              </div>
              <Button className="w-full">Start Safety Plan Creation</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Emergency Contact Directory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emergencyContacts.map((contact) => (
                  <Card key={contact.id} className="border-l-4 border-l-red-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{contact.type}</Badge>
                        <Badge className={contact.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {contact.status}
                        </Badge>
                      </div>
                      <h3 className="font-medium mb-1">{contact.name}</h3>
                      <div className="text-2xl font-bold text-red-600 mb-2">{contact.number}</div>
                      <div className="text-sm text-gray-600 mb-3">Available: {contact.available}</div>
                      <Button variant="destructive" size="sm" className="w-full">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
