
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Users, AlertTriangle, CheckCircle, Play, Pause } from 'lucide-react';

export const MaintenanceScheduler = () => {
  const [selectedWindow, setSelectedWindow] = useState<string | null>(null);

  const maintenanceWindows = [
    {
      id: '1',
      title: 'Database Server Patch',
      scheduled: '2024-01-20 02:00 UTC',
      duration: '4 hours',
      type: 'security',
      status: 'scheduled',
      impact: 'high',
      systems: ['Database', 'API Gateway', 'Web Services'],
      stakeholders: ['DBA Team', 'DevOps', 'Support'],
      approvals: 3,
      requiredApprovals: 4
    },
    {
      id: '2',
      title: 'Network Infrastructure Update',
      scheduled: '2024-01-22 01:00 UTC',
      duration: '6 hours',
      type: 'feature',
      status: 'pending-approval',
      impact: 'medium',
      systems: ['Load Balancers', 'Firewalls', 'DNS'],
      stakeholders: ['Network Team', 'Security', 'Operations'],
      approvals: 2,
      requiredApprovals: 3
    },
    {
      id: '3',
      title: 'Application Server Restart',
      scheduled: '2024-01-18 03:30 UTC',
      duration: '1 hour',
      type: 'maintenance',
      status: 'in-progress',
      impact: 'low',
      systems: ['App Servers', 'Cache'],
      stakeholders: ['App Team', 'DevOps'],
      approvals: 2,
      requiredApprovals: 2
    }
  ];

  const maintenanceTemplates = [
    { name: 'Database Maintenance', duration: '2-4 hours', systems: ['Database', 'Cache'] },
    { name: 'Security Patch', duration: '1-3 hours', systems: ['All Systems'] },
    { name: 'Infrastructure Update', duration: '4-8 hours', systems: ['Network', 'Storage'] },
    { name: 'Application Deployment', duration: '30min-2 hours', systems: ['App Servers', 'Load Balancers'] }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'pending-approval': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'security': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'feature': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'maintenance': return <Clock className="h-4 w-4 text-orange-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Maintenance Scheduler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-gray-600">Scheduled Windows</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">1</div>
              <div className="text-sm text-gray-600">Pending Approval</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">1</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">12hrs</div>
              <div className="text-sm text-gray-600">Total Duration</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Maintenance Windows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceWindows.map((window) => (
                <Card 
                  key={window.id} 
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedWindow === window.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedWindow(window.id)}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(window.type)}
                        <h4 className="font-semibold">{window.title}</h4>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(window.status)}>
                          {window.status}
                        </Badge>
                        <Badge className={getImpactColor(window.impact)}>
                          {window.impact} impact
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Scheduled Time</div>
                        <div className="text-gray-600">{window.scheduled}</div>
                      </div>
                      <div>
                        <div className="font-medium">Duration</div>
                        <div className="text-gray-600">{window.duration}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Affected Systems: </span>
                        {window.systems.join(', ')}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Stakeholders: </span>
                        {window.stakeholders.join(', ')}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Approvals</span>
                        <span>{window.approvals}/{window.requiredApprovals}</span>
                      </div>
                      <Progress 
                        value={(window.approvals / window.requiredApprovals) * 100} 
                        className="h-2"
                      />
                    </div>

                    <div className="flex gap-2">
                      {window.status === 'in-progress' ? (
                        <Button size="sm" variant="outline">
                          <Pause className="h-3 w-3 mr-1" />
                          Pause
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          <Play className="h-3 w-3 mr-1" />
                          Execute
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        Edit
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {maintenanceTemplates.map((template, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{template.name}</h4>
                  <Button size="sm" variant="outline">Use Template</Button>
                </div>
                <div className="text-sm text-gray-600">
                  <div>Duration: {template.duration}</div>
                  <div>Systems: {template.systems.join(', ')}</div>
                </div>
              </div>
            ))}

            <Button className="w-full mt-4">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule New Maintenance
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Stakeholder Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Email Notifications</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>24 hours before:</span>
                  <Badge variant="outline">Enabled</Badge>
                </div>
                <div className="flex justify-between">
                  <span>2 hours before:</span>
                  <Badge variant="outline">Enabled</Badge>
                </div>
                <div className="flex justify-between">
                  <span>At start:</span>
                  <Badge variant="outline">Enabled</Badge>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Slack Integration</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>#operations:</span>
                  <Badge variant="outline">Connected</Badge>
                </div>
                <div className="flex justify-between">
                  <span>#dev-team:</span>
                  <Badge variant="outline">Connected</Badge>
                </div>
                <div className="flex justify-between">
                  <span>#alerts:</span>
                  <Badge variant="outline">Connected</Badge>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">SMS Alerts</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Emergency contacts:</span>
                  <Badge variant="outline">5 contacts</Badge>
                </div>
                <div className="flex justify-between">
                  <span>On-call team:</span>
                  <Badge variant="outline">3 contacts</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Management:</span>
                  <Badge variant="outline">2 contacts</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
