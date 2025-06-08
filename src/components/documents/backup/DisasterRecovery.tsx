
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Phone,
  MessageCircle,
  Server,
  Network,
  Database,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface RecoveryPlan {
  id: string;
  name: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  rto: string; // Recovery Time Objective
  rpo: string; // Recovery Point Objective
  status: 'ready' | 'executing' | 'failed' | 'completed';
  lastTested: string;
  systemsCount: number;
}

interface SystemStatus {
  name: string;
  status: 'operational' | 'degraded' | 'offline' | 'recovering';
  uptime: string;
  lastCheck: string;
}

export const DisasterRecovery = () => {
  const [activeIncident, setActiveIncident] = useState<string | null>(null);
  const [recoveryProgress, setRecoveryProgress] = useState(0);

  const recoveryPlans: RecoveryPlan[] = [
    {
      id: 'plan-1',
      name: 'Primary Database Failover',
      priority: 'critical',
      rto: '< 15 minutes',
      rpo: '< 5 minutes',
      status: 'ready',
      lastTested: '2024-01-15',
      systemsCount: 5
    },
    {
      id: 'plan-2',
      name: 'Application Server Recovery',
      priority: 'high',
      rto: '< 30 minutes',
      rpo: '< 15 minutes',
      status: 'ready',
      lastTested: '2024-01-10',
      systemsCount: 8
    },
    {
      id: 'plan-3',
      name: 'Network Infrastructure Recovery',
      priority: 'high',
      rto: '< 1 hour',
      rpo: '< 30 minutes',
      status: 'ready',
      lastTested: '2024-01-08',
      systemsCount: 12
    }
  ];

  const systemStatuses: SystemStatus[] = [
    { name: 'Primary Database', status: 'operational', uptime: '99.98%', lastCheck: '2 min ago' },
    { name: 'Application Servers', status: 'operational', uptime: '99.95%', lastCheck: '1 min ago' },
    { name: 'Load Balancers', status: 'operational', uptime: '99.99%', lastCheck: '30 sec ago' },
    { name: 'Backup Systems', status: 'operational', uptime: '100%', lastCheck: '1 min ago' },
    { name: 'Network Infrastructure', status: 'degraded', uptime: '98.5%', lastCheck: '5 min ago' },
    { name: 'Storage Arrays', status: 'operational', uptime: '99.97%', lastCheck: '2 min ago' }
  ];

  const emergencyContacts = [
    { name: 'John Smith', role: 'IT Director', phone: '+1-555-0101', status: 'available' },
    { name: 'Sarah Johnson', role: 'System Administrator', phone: '+1-555-0102', status: 'available' },
    { name: 'Mike Wilson', role: 'Network Engineer', phone: '+1-555-0103', status: 'on-call' },
    { name: 'Lisa Brown', role: 'Security Officer', phone: '+1-555-0104', status: 'available' }
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
      case 'operational': return 'bg-green-100 text-green-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-red-100 text-red-800';
      case 'recovering': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return CheckCircle;
      case 'degraded': return AlertTriangle;
      case 'offline': return AlertTriangle;
      case 'recovering': return Clock;
      default: return Server;
    }
  };

  const handleExecuteRecoveryPlan = (planId: string) => {
    setActiveIncident(planId);
    setRecoveryProgress(0);
    
    toast.promise(
      new Promise((resolve) => {
        const progressSteps = [0, 25, 50, 75, 100];
        let currentStep = 0;
        
        const updateProgress = () => {
          if (currentStep < progressSteps.length) {
            setRecoveryProgress(progressSteps[currentStep]);
            currentStep++;
            setTimeout(updateProgress, 2000);
          } else {
            setActiveIncident(null);
            setRecoveryProgress(0);
            resolve('Recovery plan executed successfully');
          }
        };
        
        updateProgress();
      }),
      {
        loading: 'Executing recovery plan...',
        success: 'Recovery plan completed successfully',
        error: 'Recovery plan execution failed'
      }
    );
  };

  const handleTestRecoveryPlan = (planId: string) => {
    toast.success('Recovery plan test initiated');
  };

  const handleEmergencyContact = (contact: any, method: 'call' | 'message') => {
    toast.success(`${method === 'call' ? 'Calling' : 'Messaging'} ${contact.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Emergency Alert */}
      {activeIncident && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="flex items-center justify-between">
              <span>Disaster recovery plan is currently executing...</span>
              <div className="flex items-center gap-2">
                <Progress value={recoveryProgress} className="w-32 h-2" />
                <span className="text-sm font-medium">{recoveryProgress}%</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recovery Plans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Recovery Plans
            </CardTitle>
            <CardDescription>Execute disaster recovery procedures</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recoveryPlans.map((plan) => (
              <div key={plan.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{plan.name}</h4>
                  <Badge className={getPriorityColor(plan.priority)}>
                    {plan.priority}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">RTO:</span>
                    <span className="ml-2 font-medium">{plan.rto}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">RPO:</span>
                    <span className="ml-2 font-medium">{plan.rpo}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Systems:</span>
                    <span className="ml-2 font-medium">{plan.systemsCount}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Tested:</span>
                    <span className="ml-2 font-medium">{plan.lastTested}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleExecuteRecoveryPlan(plan.id)}
                    disabled={!!activeIncident}
                    className="flex-1"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    Execute
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTestRecoveryPlan(plan.id)}
                    disabled={!!activeIncident}
                  >
                    Test
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Status Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              System Status
            </CardTitle>
            <CardDescription>Real-time monitoring of critical systems</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {systemStatuses.map((system, index) => {
              const StatusIcon = getStatusIcon(system.status);
              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <StatusIcon className="h-4 w-4" />
                    <div>
                      <p className="font-medium text-sm">{system.name}</p>
                      <p className="text-xs text-gray-600">Uptime: {system.uptime}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(system.status)} variant="secondary">
                      {system.status}
                    </Badge>
                    <p className="text-xs text-gray-600 mt-1">{system.lastCheck}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Emergency Communication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Emergency Communication
          </CardTitle>
          <CardDescription>Contact emergency response team members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div>
                  <h4 className="font-medium">{contact.name}</h4>
                  <p className="text-sm text-gray-600">{contact.role}</p>
                  <p className="text-sm text-gray-600">{contact.phone}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant={contact.status === 'available' ? 'default' : 'secondary'}>
                    {contact.status}
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleEmergencyContact(contact, 'call')}
                    className="flex-1"
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEmergencyContact(contact, 'message')}
                  >
                    <MessageCircle className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
