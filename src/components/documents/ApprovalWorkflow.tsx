
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  ArrowRight, 
  Eye, 
  MessageSquare,
  AlertTriangle,
  FileCheck,
  Route,
  Calendar
} from 'lucide-react';

interface ApprovalStep {
  id: string;
  name: string;
  approver: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  timestamp?: string;
  comments?: string;
  deadline: string;
  isParallel: boolean;
}

interface ApprovalWorkflowItem {
  id: string;
  documentName: string;
  documentType: string;
  status: 'pending' | 'in-progress' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedBy: string;
  submittedAt: string;
  currentStep: number;
  totalSteps: number;
  progress: number;
  estimatedCompletion: string;
  steps: ApprovalStep[];
}

export const ApprovalWorkflow = () => {
  const [activeTab, setActiveTab] = useState('pending');

  const approvalWorkflows: ApprovalWorkflowItem[] = [
    {
      id: 'aw-1',
      documentName: 'Treatment Protocol Update - Cardiology',
      documentType: 'Medical Protocol',
      status: 'in-progress',
      priority: 'high',
      submittedBy: 'Dr. Johnson',
      submittedAt: '2024-01-22 09:00',
      currentStep: 2,
      totalSteps: 4,
      progress: 50,
      estimatedCompletion: '2024-01-25',
      steps: [
        {
          id: 's1',
          name: 'Medical Review',
          approver: 'Dr. Smith',
          role: 'Senior Physician',
          status: 'approved',
          timestamp: '2024-01-22 11:30',
          comments: 'Medically sound protocol',
          deadline: '2024-01-23',
          isParallel: false
        },
        {
          id: 's2',
          name: 'Safety Review',
          approver: 'Safety Committee',
          role: 'Safety Officer',
          status: 'pending',
          deadline: '2024-01-24',
          isParallel: false
        },
        {
          id: 's3',
          name: 'Legal Compliance',
          approver: 'Legal Team',
          role: 'Legal Advisor',
          status: 'pending',
          deadline: '2024-01-24',
          isParallel: true
        },
        {
          id: 's4',
          name: 'Final Approval',
          approver: 'Chief Medical Officer',
          role: 'CMO',
          status: 'pending',
          deadline: '2024-01-25',
          isParallel: false
        }
      ]
    },
    {
      id: 'aw-2',
      documentName: 'Emergency Procedure Update',
      documentType: 'Emergency Protocol',
      status: 'pending',
      priority: 'urgent',
      submittedBy: 'Emergency Dept',
      submittedAt: '2024-01-23 14:00',
      currentStep: 1,
      totalSteps: 3,
      progress: 0,
      estimatedCompletion: '2024-01-24',
      steps: [
        {
          id: 's1',
          name: 'Emergency Review',
          approver: 'Dr. Williams',
          role: 'Emergency Director',
          status: 'pending',
          deadline: '2024-01-23 18:00',
          isParallel: false
        },
        {
          id: 's2',
          name: 'Risk Assessment',
          approver: 'Risk Management',
          role: 'Risk Manager',
          status: 'pending',
          deadline: '2024-01-24 10:00',
          isParallel: false
        },
        {
          id: 's3',
          name: 'Implementation Approval',
          approver: 'Operations Director',
          role: 'Operations',
          status: 'pending',
          deadline: '2024-01-24 16:00',
          isParallel: false
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'skipped': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      case 'pending': return Clock;
      case 'skipped': return ArrowRight;
      default: return Clock;
    }
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Approval Workflow Management</h2>
          <p className="text-gray-600">Track approval status and manage routing workflows</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            Workflow Designer
          </Button>
          <Button className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Submit for Approval
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
          <TabsTrigger value="routing">Routing Visualization</TabsTrigger>
          <TabsTrigger value="templates">Approval Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="space-y-4">
            {approvalWorkflows.map(workflow => (
              <Card key={workflow.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{workflow.documentName}</h3>
                          <Badge className={getPriorityColor(workflow.priority)}>
                            {workflow.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{workflow.documentType}</p>
                      </div>
                      <Badge className={getStatusColor(workflow.status)}>
                        {workflow.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{workflow.progress}%</span>
                        </div>
                        <Progress value={workflow.progress} className="h-2" />
                        <p className="text-xs text-gray-500">
                          Step {workflow.currentStep} of {workflow.totalSteps}
                        </p>
                      </div>
                      <div className="text-sm space-y-1">
                        <p className="text-gray-600">Submitted: {workflow.submittedAt}</p>
                        <p className="text-gray-600">By: {workflow.submittedBy}</p>
                        <p className="text-gray-600">Est. completion: {workflow.estimatedCompletion}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          Comment
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Approval Steps</h4>
                      <div className="space-y-2">
                        {workflow.steps.map((step, index) => {
                          const StatusIcon = getStatusIcon(step.status);
                          const overdue = step.status === 'pending' && isOverdue(step.deadline);
                          
                          return (
                            <div key={step.id} className="flex items-center gap-4 p-3 border rounded">
                              <div className="flex items-center gap-3 flex-1">
                                <div className="flex items-center gap-2">
                                  <StatusIcon className={`h-4 w-4 ${
                                    step.status === 'approved' ? 'text-green-600' :
                                    step.status === 'rejected' ? 'text-red-600' :
                                    overdue ? 'text-red-600' : 'text-yellow-600'
                                  }`} />
                                  <span className="text-sm font-medium">{step.name}</span>
                                  {step.isParallel && (
                                    <Badge variant="outline" className="text-xs">Parallel</Badge>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs">
                                      {step.approver.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-xs font-medium">{step.approver}</p>
                                    <p className="text-xs text-gray-500">{step.role}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className="flex items-center gap-2">
                                  <Badge className={getStatusColor(step.status)}>
                                    {step.status}
                                  </Badge>
                                  {overdue && (
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  Due: {step.deadline}
                                </p>
                                {step.timestamp && (
                                  <p className="text-xs text-gray-500">
                                    {step.status === 'approved' ? 'Approved' : 'Rejected'}: {step.timestamp}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {workflow.steps.some(step => step.comments) && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Comments</h4>
                        {workflow.steps
                          .filter(step => step.comments)
                          .map(step => (
                            <div key={step.id} className="p-3 bg-gray-50 rounded text-sm">
                              <p><strong>{step.approver}:</strong> {step.comments}</p>
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="routing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                Approval Routing Visualization
              </CardTitle>
              <CardDescription>Visual representation of approval workflows and dependencies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <Route className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600">Interactive workflow diagram would be displayed here</p>
                  <p className="text-sm text-gray-500">Showing parallel paths, dependencies, and current status</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Workflow Rules</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span>Medical documents require physician approval first</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Emergency protocols can skip non-critical steps</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span>High priority items auto-escalate after 24h</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Current Bottlenecks</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                        <span>Legal Review</span>
                        <Badge className="bg-red-100 text-red-800">3 pending</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                        <span>Safety Committee</span>
                        <Badge className="bg-yellow-100 text-yellow-800">2 pending</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Standard Medical Protocol', steps: 4, avgTime: '3 days', usage: 45 },
              { name: 'Emergency Procedure', steps: 3, avgTime: '8 hours', usage: 12 },
              { name: 'Policy Update', steps: 5, avgTime: '5 days', usage: 23 },
              { name: 'Research Protocol', steps: 6, avgTime: '7 days', usage: 18 }
            ].map((template, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <FileCheck className="h-8 w-8 text-blue-600" />
                      <Badge variant="outline">{template.steps} steps</Badge>
                    </div>
                    <div>
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-gray-600">Avg time: {template.avgTime}</p>
                      <p className="text-sm text-gray-600">Used {template.usage} times</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="flex-1">Use Template</Button>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Approvals</p>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-sm text-red-600">3 overdue</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Approval Time</p>
                    <p className="text-2xl font-bold">2.3</p>
                    <p className="text-sm text-green-600">days (-0.5)</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Approval Rate</p>
                    <p className="text-2xl font-bold">94.2%</p>
                    <p className="text-sm text-green-600">+2.1%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Workflows</p>
                    <p className="text-2xl font-bold">27</p>
                    <p className="text-sm text-blue-600">8 high priority</p>
                  </div>
                  <Route className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
