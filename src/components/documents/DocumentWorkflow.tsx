
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Workflow, 
  FileText, 
  Upload, 
  Download,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  assignee: string;
  dueDate: string;
  description: string;
}

interface DocumentWorkflowItem {
  id: string;
  name: string;
  type: string;
  status: 'draft' | 'in-review' | 'approved' | 'rejected';
  currentStep: number;
  totalSteps: number;
  assignedTo: string;
  dueDate: string;
  progress: number;
  steps: WorkflowStep[];
}

export const DocumentWorkflow = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const workflows: DocumentWorkflowItem[] = [
    {
      id: 'wf-1',
      name: 'Patient Consent Form - John Doe',
      type: 'Consent Form',
      status: 'in-review',
      currentStep: 2,
      totalSteps: 4,
      assignedTo: 'Dr. Smith',
      dueDate: '2024-01-25',
      progress: 50,
      steps: [
        { id: 's1', name: 'Document Creation', status: 'completed', assignee: 'Admin', dueDate: '2024-01-20', description: 'Initial document created' },
        { id: 's2', name: 'Medical Review', status: 'in-progress', assignee: 'Dr. Smith', dueDate: '2024-01-22', description: 'Medical content review' },
        { id: 's3', name: 'Legal Review', status: 'pending', assignee: 'Legal Team', dueDate: '2024-01-24', description: 'Legal compliance check' },
        { id: 's4', name: 'Final Approval', status: 'pending', assignee: 'Chief Medical Officer', dueDate: '2024-01-25', description: 'Final approval and signing' }
      ]
    },
    {
      id: 'wf-2',
      name: 'Discharge Summary - Jane Smith',
      type: 'Discharge Summary',
      status: 'in-review',
      currentStep: 3,
      totalSteps: 3,
      assignedTo: 'Nurse Johnson',
      dueDate: '2024-01-23',
      progress: 75,
      steps: [
        { id: 's1', name: 'Clinical Notes', status: 'completed', assignee: 'Dr. Williams', dueDate: '2024-01-21', description: 'Clinical notes compilation' },
        { id: 's2', name: 'Medication Review', status: 'completed', assignee: 'Pharmacist', dueDate: '2024-01-22', description: 'Medication reconciliation' },
        { id: 's3', name: 'Nursing Documentation', status: 'in-progress', assignee: 'Nurse Johnson', dueDate: '2024-01-23', description: 'Nursing care summary' }
      ]
    }
  ];

  const batchOperations = [
    { id: 'batch-1', name: 'Weekly Discharge Summaries', documents: 15, progress: 80, status: 'processing' },
    { id: 'batch-2', name: 'Insurance Claims Review', documents: 23, progress: 45, status: 'processing' },
    { id: 'batch-3', name: 'Consent Form Updates', documents: 8, progress: 100, status: 'completed' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'in-review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Play;
      case 'pending': return Clock;
      case 'failed': return XCircle;
      default: return FileText;
    }
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    if (draggedItem) {
      console.log(`Moving workflow ${draggedItem} to ${targetStatus}`);
      setDraggedItem(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Document Workflow Management</h2>
          <p className="text-gray-600">Manage document workflows with drag-and-drop functionality and batch processing</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Bulk Upload
          </Button>
          <Button className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            New Workflow
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Workflows</TabsTrigger>
          <TabsTrigger value="batch">Batch Processing</TabsTrigger>
          <TabsTrigger value="templates">Workflow Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Workflow Columns */}
            {['draft', 'in-review', 'approved', 'rejected'].map((status) => (
              <div
                key={status}
                className="space-y-4"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status)}
              >
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-medium capitalize">{status.replace('-', ' ')}</h3>
                  <Badge variant="outline">
                    {workflows.filter(w => w.status === status).length}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {workflows
                    .filter(workflow => workflow.status === status)
                    .map(workflow => (
                      <Card
                        key={workflow.id}
                        className="cursor-move hover:shadow-md transition-shadow"
                        draggable
                        onDragStart={(e) => handleDragStart(e, workflow.id)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">{workflow.name}</h4>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs text-gray-600">
                                <span>{workflow.type}</span>
                                <span>Due: {workflow.dueDate}</span>
                              </div>
                              
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span>Progress</span>
                                  <span>{workflow.progress}%</span>
                                </div>
                                <Progress value={workflow.progress} className="h-2" />
                              </div>
                              
                              <div className="flex items-center justify-between text-xs">
                                <span>Step {workflow.currentStep} of {workflow.totalSteps}</span>
                                <span className="text-gray-600">@{workflow.assignedTo}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" className="flex-1">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  }
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="batch">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Batch Processing Dashboard</CardTitle>
                <CardDescription>Monitor and manage bulk document processing operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {batchOperations.map(batch => (
                  <div key={batch.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {batch.status === 'processing' ? (
                          <Play className="h-5 w-5 text-blue-600" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        <div>
                          <h4 className="font-medium">{batch.name}</h4>
                          <p className="text-sm text-gray-600">{batch.documents} documents</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="w-32">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{batch.progress}%</span>
                          </div>
                          <Progress value={batch.progress} className="h-2" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          {batch.status === 'processing' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Patient Consent Workflow', steps: 4, usage: 45 },
              { name: 'Discharge Summary Process', steps: 3, usage: 32 },
              { name: 'Insurance Claim Review', steps: 5, usage: 28 },
              { name: 'Medical Record Request', steps: 3, usage: 15 }
            ].map((template, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Workflow className="h-8 w-8 text-blue-600" />
                      <Badge variant="outline">{template.steps} steps</Badge>
                    </div>
                    <div>
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-gray-600">Used {template.usage} times this month</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="flex-1">Use Template</Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
