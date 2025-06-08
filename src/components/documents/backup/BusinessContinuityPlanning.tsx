
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  FileText, 
  Users, 
  MessageSquare, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Phone,
  Mail,
  Play,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface ContinuityPlan {
  id: string;
  name: string;
  scenario: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'inactive' | 'draft' | 'testing';
  lastTested: string;
  nextTest: string;
  procedures: number;
  contacts: number;
  rto: string; // Recovery Time Objective
}

interface Contact {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  availability: 'available' | 'busy' | 'unavailable';
  isEmergencyContact: boolean;
}

interface Procedure {
  id: string;
  step: number;
  title: string;
  description: string;
  assignee: string;
  estimatedTime: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  dependencies: string[];
}

export const BusinessContinuityPlanning = () => {
  const [activePlan, setActivePlan] = useState<string>('');
  const [executionProgress, setExecutionProgress] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);

  const continuityPlans: ContinuityPlan[] = [
    {
      id: 'plan-1',
      name: 'Primary Data Center Failure',
      scenario: 'Complete loss of primary data center due to natural disaster',
      priority: 'critical',
      status: 'active',
      lastTested: '2024-01-15',
      nextTest: '2024-04-15',
      procedures: 12,
      contacts: 8,
      rto: '< 4 hours'
    },
    {
      id: 'plan-2',
      name: 'Cyber Security Incident',
      scenario: 'Ransomware attack affecting core systems',
      priority: 'critical',
      status: 'active',
      lastTested: '2024-01-10',
      nextTest: '2024-04-10',
      procedures: 15,
      contacts: 12,
      rto: '< 2 hours'
    },
    {
      id: 'plan-3',
      name: 'Network Infrastructure Failure',
      scenario: 'Loss of primary network connectivity',
      priority: 'high',
      status: 'active',
      lastTested: '2024-01-08',
      nextTest: '2024-04-08',
      procedures: 8,
      contacts: 6,
      rto: '< 1 hour'
    },
    {
      id: 'plan-4',
      name: 'Key Personnel Unavailability',
      scenario: 'Critical staff unable to perform duties',
      priority: 'medium',
      status: 'testing',
      lastTested: '2024-01-05',
      nextTest: '2024-04-05',
      procedures: 6,
      contacts: 10,
      rto: '< 8 hours'
    }
  ];

  const emergencyContacts: Contact[] = [
    {
      id: 'contact-1',
      name: 'John Smith',
      role: 'IT Director',
      department: 'Information Technology',
      phone: '+1-555-0101',
      email: 'john.smith@hospital.com',
      availability: 'available',
      isEmergencyContact: true
    },
    {
      id: 'contact-2',
      name: 'Sarah Johnson',
      role: 'System Administrator',
      department: 'Information Technology',
      phone: '+1-555-0102',
      email: 'sarah.johnson@hospital.com',
      availability: 'available',
      isEmergencyContact: true
    },
    {
      id: 'contact-3',
      name: 'Dr. Williams',
      role: 'Chief Medical Officer',
      department: 'Medical',
      phone: '+1-555-0103',
      email: 'dr.williams@hospital.com',
      availability: 'busy',
      isEmergencyContact: true
    },
    {
      id: 'contact-4',
      name: 'Mike Wilson',
      role: 'Network Engineer',
      department: 'Information Technology',
      phone: '+1-555-0104',
      email: 'mike.wilson@hospital.com',
      availability: 'available',
      isEmergencyContact: false
    }
  ];

  const procedures: Procedure[] = [
    {
      id: 'proc-1',
      step: 1,
      title: 'Activate Emergency Response Team',
      description: 'Contact all emergency response team members via automated notification system',
      assignee: 'John Smith',
      estimatedTime: '15 minutes',
      status: 'pending',
      dependencies: []
    },
    {
      id: 'proc-2',
      step: 2,
      title: 'Assess System Status',
      description: 'Evaluate the extent of the failure and identify affected systems',
      assignee: 'Sarah Johnson',
      estimatedTime: '30 minutes',
      status: 'pending',
      dependencies: ['proc-1']
    },
    {
      id: 'proc-3',
      step: 3,
      title: 'Initiate Failover Procedures',
      description: 'Switch to backup data center and verify system integrity',
      assignee: 'Mike Wilson',
      estimatedTime: '2 hours',
      status: 'pending',
      dependencies: ['proc-2']
    }
  ];

  const communicationTemplates = [
    {
      id: 'temp-1',
      name: 'Emergency Notification',
      type: 'SMS/Email',
      description: 'Initial notification to emergency response team'
    },
    {
      id: 'temp-2',
      name: 'Status Update',
      type: 'Email',
      description: 'Regular status updates during incident response'
    },
    {
      id: 'temp-3',
      name: 'All Clear',
      type: 'SMS/Email',
      description: 'Notification when systems are restored'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-blue-100 text-blue-800';
      case 'testing': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExecutePlan = (planId: string) => {
    setActivePlan(planId);
    setIsExecuting(true);
    setExecutionProgress(0);

    toast.promise(
      new Promise((resolve) => {
        const progressSteps = [0, 20, 40, 60, 80, 100];
        let currentStep = 0;
        
        const updateProgress = () => {
          if (currentStep < progressSteps.length) {
            setExecutionProgress(progressSteps[currentStep]);
            currentStep++;
            setTimeout(updateProgress, 2000);
          } else {
            setIsExecuting(false);
            setActivePlan('');
            setExecutionProgress(0);
            resolve('Business continuity plan executed successfully');
          }
        };
        
        updateProgress();
      }),
      {
        loading: 'Executing business continuity plan...',
        success: 'Plan execution completed successfully',
        error: 'Plan execution failed'
      }
    );
  };

  const handleTestPlan = (planId: string) => {
    toast.success('Business continuity plan test initiated');
  };

  const handleContactPerson = (contact: Contact, method: 'call' | 'email') => {
    toast.success(`${method === 'call' ? 'Calling' : 'Emailing'} ${contact.name}`);
  };

  const handleSendNotification = (templateId: string) => {
    toast.success('Emergency notification sent to all contacts');
  };

  return (
    <div className="space-y-6">
      {/* Execution Status */}
      {isExecuting && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Play className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium">Business Continuity Plan Executing</h3>
                  <p className="text-sm text-gray-600">Following emergency procedures...</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={executionProgress} className="w-32 h-2" />
                <span className="text-sm font-medium">{executionProgress}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continuity Plans */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Business Continuity Plans
              </CardTitle>
              <CardDescription>Emergency response procedures and recovery plans</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {continuityPlans.map((plan) => (
                <div key={plan.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{plan.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(plan.priority)}>
                        {plan.priority}
                      </Badge>
                      <Badge className={getStatusColor(plan.status)}>
                        {plan.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">{plan.scenario}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">RTO:</span>
                      <span className="ml-2 font-medium">{plan.rto}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Procedures:</span>
                      <span className="ml-2 font-medium">{plan.procedures}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Last Tested:</span>
                      <span className="ml-2 font-medium">{plan.lastTested}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Contacts:</span>
                      <span className="ml-2 font-medium">{plan.contacts}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleExecutePlan(plan.id)}
                      disabled={isExecuting}
                      className="flex-1"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Execute Plan
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTestPlan(plan.id)}
                      disabled={isExecuting}
                    >
                      Test
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Emergency Contacts
            </CardTitle>
            <CardDescription>Key personnel for emergency response</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{contact.name}</p>
                    <p className="text-xs text-gray-600">{contact.role}</p>
                  </div>
                  <Badge className={getAvailabilityColor(contact.availability)} variant="secondary">
                    {contact.availability}
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleContactPerson(contact, 'call')}
                    className="flex-1"
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleContactPerson(contact, 'email')}
                    className="flex-1"
                  >
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Procedures and Communication */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emergency Procedures */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Emergency Procedures
            </CardTitle>
            <CardDescription>Step-by-step recovery procedures</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {procedures.map((procedure) => (
              <div key={procedure.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">Step {procedure.step}</span>
                    <span className="text-sm">{procedure.title}</span>
                  </div>
                  <Badge className={getStatusColor(procedure.status)} variant="secondary">
                    {procedure.status.replace('-', ' ')}
                  </Badge>
                </div>
                
                <p className="text-xs text-gray-600">{procedure.description}</p>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Assignee: {procedure.assignee}</span>
                  <span>Est. Time: {procedure.estimatedTime}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Communication Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Communication Templates
            </CardTitle>
            <CardDescription>Pre-configured emergency notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {communicationTemplates.map((template) => (
              <div key={template.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{template.name}</h4>
                  <Badge variant="outline">{template.type}</Badge>
                </div>
                <p className="text-xs text-gray-600">{template.description}</p>
                <Button
                  size="sm"
                  onClick={() => handleSendNotification(template.id)}
                  className="w-full"
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Send Notification
                </Button>
              </div>
            ))}
            
            <div className="pt-4 border-t">
              <h4 className="font-medium text-sm mb-2">Custom Message</h4>
              <Textarea placeholder="Enter emergency message..." className="mb-2" />
              <Button size="sm" className="w-full">
                <MessageSquare className="h-3 w-3 mr-1" />
                Send Custom Message
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
