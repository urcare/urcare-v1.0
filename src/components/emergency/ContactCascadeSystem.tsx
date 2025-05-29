
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Phone, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface Contact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  priority: number;
  responseTime: number; // seconds to wait for response
  backupMethods: string[];
  availability: {
    timezone: string;
    preferredHours: string;
  };
}

interface CascadeStatus {
  contactId: string;
  status: 'pending' | 'attempting' | 'responded' | 'failed' | 'timeout';
  attemptedAt?: Date;
  respondedAt?: Date;
  method: string;
  response?: string;
}

export const ContactCascadeSystem = () => {
  const [contacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Jane Smith',
      relationship: 'Spouse',
      phone: '+1-555-0123',
      email: 'jane@example.com',
      priority: 1,
      responseTime: 60,
      backupMethods: ['SMS', 'Email', 'Voice Call'],
      availability: { timezone: 'EST', preferredHours: 'Any' }
    },
    {
      id: '2',
      name: 'Dr. Sarah Johnson',
      relationship: 'Primary Doctor',
      phone: '+1-555-0456',
      email: 'dr.johnson@hospital.com',
      priority: 2,
      responseTime: 120,
      backupMethods: ['Hospital Pager', 'Emergency Line'],
      availability: { timezone: 'EST', preferredHours: '9AM-5PM' }
    },
    {
      id: '3',
      name: 'Robert Smith',
      relationship: 'Brother',
      phone: '+1-555-0789',
      email: 'robert@example.com',
      priority: 3,
      responseTime: 180,
      backupMethods: ['SMS', 'Email'],
      availability: { timezone: 'PST', preferredHours: '8AM-10PM' }
    },
    {
      id: '4',
      name: 'Emergency Services',
      relationship: 'Emergency Response',
      phone: '911',
      email: 'emergency@city.gov',
      priority: 4,
      responseTime: 30,
      backupMethods: ['Direct Call'],
      availability: { timezone: 'Local', preferredHours: '24/7' }
    }
  ]);

  const [cascadeStatus, setCascadeStatus] = useState<CascadeStatus[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && isActive) {
      proceedToNextContact();
    }
  }, [countdown, isActive]);

  const initiateCascade = () => {
    setIsActive(true);
    setCurrentPhase(0);
    setCascadeStatus(contacts.map(contact => ({
      contactId: contact.id,
      status: 'pending',
      method: 'SMS'
    })));
    
    // Start with first contact
    contactPerson(contacts[0]);
    toast.warning('Emergency cascade initiated!');
  };

  const contactPerson = (contact: Contact) => {
    const statusIndex = cascadeStatus.findIndex(s => s.contactId === contact.id);
    
    setCascadeStatus(prev => {
      const newStatus = [...prev];
      newStatus[statusIndex] = {
        ...newStatus[statusIndex],
        status: 'attempting',
        attemptedAt: new Date(),
        method: contact.backupMethods[0]
      };
      return newStatus;
    });

    setCountdown(contact.responseTime);
    
    toast.info(`Contacting ${contact.name} (${contact.relationship})`);
    
    // Simulate contact attempt
    setTimeout(() => {
      // Random response simulation
      const responded = Math.random() > 0.3; // 70% chance of response
      
      if (responded) {
        markAsResponded(contact.id);
      }
    }, Math.random() * 10000 + 5000); // 5-15 seconds
  };

  const markAsResponded = (contactId: string) => {
    setCascadeStatus(prev => prev.map(status => 
      status.contactId === contactId 
        ? { 
            ...status, 
            status: 'responded', 
            respondedAt: new Date(),
            response: 'Acknowledged emergency - en route'
          }
        : status
    ));
    
    const contact = contacts.find(c => c.id === contactId);
    toast.success(`${contact?.name} responded to emergency!`);
    
    setIsActive(false);
    setCountdown(0);
  };

  const proceedToNextContact = () => {
    const currentContact = contacts[currentPhase];
    
    // Mark current as timeout/failed
    setCascadeStatus(prev => prev.map(status => 
      status.contactId === currentContact.id 
        ? { ...status, status: 'timeout' }
        : status
    ));

    toast.warning(`${currentContact.name} did not respond, trying next contact...`);

    // Move to next contact
    const nextPhase = currentPhase + 1;
    if (nextPhase < contacts.length) {
      setCurrentPhase(nextPhase);
      contactPerson(contacts[nextPhase]);
    } else {
      // All contacts exhausted
      setIsActive(false);
      toast.error('All emergency contacts exhausted. Consider calling emergency services directly.');
    }
  };

  const stopCascade = () => {
    setIsActive(false);
    setCountdown(0);
    
    setCascadeStatus(prev => prev.map(status => 
      status.status === 'attempting' 
        ? { ...status, status: 'failed' }
        : status
    ));
    
    toast.success('Emergency cascade stopped');
  };

  const getStatusIcon = (status: CascadeStatus['status']) => {
    switch (status) {
      case 'responded': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
      case 'timeout': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'attempting': return <Clock className="h-4 w-4 text-yellow-600 animate-spin" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: CascadeStatus['status']) => {
    switch (status) {
      case 'responded': return 'bg-green-100 text-green-800';
      case 'failed':
      case 'timeout': return 'bg-red-100 text-red-800';
      case 'attempting': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card className={`${isActive ? 'border-red-500 bg-red-50' : 'border-blue-200'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Emergency Contact Cascade System
            {isActive && <Badge className="bg-red-100 text-red-800 animate-pulse">ACTIVE</Badge>}
          </CardTitle>
          <CardDescription>
            Automated sequential emergency contact system with escalation protocols
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isActive && countdown > 0 && (
            <div className="p-4 bg-yellow-100 rounded border border-yellow-300">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Waiting for response...</span>
                <span className="text-lg font-bold">{countdown}s</span>
              </div>
              <Progress 
                value={(contacts[currentPhase]?.responseTime - countdown) / contacts[currentPhase]?.responseTime * 100} 
                className="h-2"
              />
            </div>
          )}

          <div className="flex gap-2">
            {!isActive ? (
              <Button 
                onClick={initiateCascade}
                className="bg-red-600 hover:bg-red-700"
                size="lg"
              >
                <AlertTriangle className="h-5 w-5 mr-2" />
                Initiate Emergency Cascade
              </Button>
            ) : (
              <Button 
                onClick={stopCascade}
                variant="outline"
                className="border-red-300 text-red-600"
              >
                Stop Cascade
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {contacts.map((contact, index) => {
          const status = cascadeStatus.find(s => s.contactId === contact.id);
          const isCurrentContact = isActive && currentPhase === index;
          
          return (
            <Card 
              key={contact.id} 
              className={`${isCurrentContact ? 'border-blue-500 bg-blue-50' : ''} ${status?.status === 'responded' ? 'border-green-500 bg-green-50' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Priority {contact.priority}
                      </Badge>
                      {status && getStatusIcon(status.status)}
                    </div>
                    
                    <div>
                      <h4 className="font-medium">{contact.name}</h4>
                      <p className="text-sm text-gray-600">{contact.relationship}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="font-mono text-sm">{contact.phone}</span>
                    </div>
                    {status && (
                      <Badge className={`text-xs mt-1 ${getStatusColor(status.status)}`}>
                        {status.status}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Contact Methods:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {contact.backupMethods.map((method, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {method}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium">Response Window:</p>
                    <p className="text-gray-600">{contact.responseTime}s timeout</p>
                    <p className="text-gray-600">{contact.availability.preferredHours}</p>
                  </div>
                </div>

                {status?.status === 'responded' && status.response && (
                  <div className="mt-3 p-2 bg-green-100 rounded border border-green-200">
                    <p className="text-sm text-green-800">
                      <strong>Response:</strong> {status.response}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Responded at: {status.respondedAt?.toLocaleTimeString()}
                    </p>
                  </div>
                )}

                {status?.status === 'timeout' && (
                  <div className="mt-3 p-2 bg-red-100 rounded border border-red-200">
                    <p className="text-sm text-red-800">
                      No response received within {contact.responseTime} seconds
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">How Cascade Works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="text-sm text-blue-700 space-y-2">
            <li>1. <strong>Sequential Contact:</strong> Contacts are reached in priority order</li>
            <li>2. <strong>Multiple Methods:</strong> Each contact is tried via multiple communication channels</li>
            <li>3. <strong>Response Timeout:</strong> If no response within time limit, proceeds to next contact</li>
            <li>4. <strong>Automatic Escalation:</strong> System automatically escalates to emergency services if needed</li>
            <li>5. <strong>Real-time Updates:</strong> All attempts and responses are logged with timestamps</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};
