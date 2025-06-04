
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  RefreshCw, 
  AlertCircle, 
  Clock, 
  User,
  CheckCircle,
  Bell,
  ArrowRight,
  Calendar,
  Zap
} from 'lucide-react';

interface MissedTask {
  id: string;
  taskName: string;
  originalAssignee: string;
  department: string;
  originalDueDate: string;
  daysOverdue: number;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  impactLevel: 'critical' | 'high' | 'medium' | 'low';
  autoRescheduleEligible: boolean;
  suggestedNewAssignee?: string;
  suggestedNewDate?: string;
  recoveryStrategy: string;
  workloadAdjustment: string;
  patientImpact: boolean;
}

const mockMissedTasks: MissedTask[] = [
  {
    id: 'MT001',
    taskName: 'Post-operative Wound Check',
    originalAssignee: 'Nurse Sarah Johnson',
    department: 'Surgery',
    originalDueDate: '2024-01-12 14:00',
    daysOverdue: 3,
    priority: 'urgent',
    impactLevel: 'high',
    autoRescheduleEligible: true,
    suggestedNewAssignee: 'Nurse Michael Brown',
    suggestedNewDate: '2024-01-16 10:00',
    recoveryStrategy: 'Immediate reassignment with priority escalation',
    workloadAdjustment: 'Redistribute 2 lower priority tasks',
    patientImpact: true
  },
  {
    id: 'MT002',
    taskName: 'Medication Review',
    originalAssignee: 'Dr. Lisa Chen',
    department: 'Internal Medicine',
    originalDueDate: '2024-01-13 09:00',
    daysOverdue: 2,
    priority: 'high',
    impactLevel: 'medium',
    autoRescheduleEligible: true,
    suggestedNewAssignee: 'Dr. Lisa Chen',
    suggestedNewDate: '2024-01-16 15:30',
    recoveryStrategy: 'Reschedule with extended time allocation',
    workloadAdjustment: 'Defer non-urgent appointments',
    patientImpact: false
  }
];

export const MissedTaskRecoverySystem = () => {
  const [missedTasks] = useState<MissedTask[]>(mockMissedTasks);
  const [selectedTask, setSelectedTask] = useState<MissedTask | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'normal': return 'bg-blue-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getOverdueColor = (days: number) => {
    if (days >= 3) return 'text-red-600';
    if (days >= 2) return 'text-orange-600';
    return 'text-yellow-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Missed Task Recovery System
          </CardTitle>
          <CardDescription>
            Automatic rescheduling with priority adjustment and staff notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">{missedTasks.length}</p>
                    <p className="text-sm text-gray-600">Missed Tasks</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <Zap className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">{missedTasks.filter(t => t.autoRescheduleEligible).length}</p>
                    <p className="text-sm text-gray-600">Auto-Recoverable</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <Bell className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{missedTasks.filter(t => t.patientImpact).length}</p>
                    <p className="text-sm text-gray-600">Patient Impact</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">76%</p>
                    <p className="text-sm text-gray-600">Recovery Rate</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tasks Requiring Recovery</h3>
              {missedTasks.map((task) => (
                <Card 
                  key={task.id} 
                  className={`cursor-pointer transition-colors ${selectedTask?.id === task.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-red-400`}
                  onClick={() => setSelectedTask(task)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold mb-1">{task.taskName}</h4>
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-gray-500" />
                          <p className="text-sm text-gray-600">{task.originalAssignee}</p>
                        </div>
                        <p className="text-sm font-medium text-blue-600">{task.department}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority.toUpperCase()}
                        </Badge>
                        <Badge className={getImpactColor(task.impactLevel)}>
                          {task.impactLevel.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Original Due:</span>
                          <p className="font-medium">{task.originalDueDate}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Days Overdue:</span>
                          <p className={`font-bold ${getOverdueColor(task.daysOverdue)}`}>{task.daysOverdue}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          {task.autoRescheduleEligible && (
                            <Badge variant="outline" className="text-xs">
                              <Zap className="h-3 w-3 mr-1" />
                              Auto-Recovery
                            </Badge>
                          )}
                          {task.patientImpact && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Patient Impact
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {task.suggestedNewDate && (
                        <div className="bg-green-50 p-2 rounded text-sm">
                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-3 w-3 text-green-600" />
                            <span className="text-green-700">
                              Suggested: {task.suggestedNewDate}
                              {task.suggestedNewAssignee && task.suggestedNewAssignee !== task.originalAssignee && 
                                ` → ${task.suggestedNewAssignee}`
                              }
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedTask ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedTask.taskName}</CardTitle>
                    <CardDescription>{selectedTask.department} - {selectedTask.daysOverdue} days overdue</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Original Assignment</h4>
                          <div className="space-y-1 text-sm">
                            <p>Assignee: <strong>{selectedTask.originalAssignee}</strong></p>
                            <p>Due Date: <strong>{selectedTask.originalDueDate}</strong></p>
                            <p>Priority: <strong>{selectedTask.priority}</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Impact Assessment</h4>
                          <div className="space-y-1 text-sm">
                            <p>Impact Level: <strong>{selectedTask.impactLevel}</strong></p>
                            <p>Days Overdue: <strong className={getOverdueColor(selectedTask.daysOverdue)}>
                              {selectedTask.daysOverdue}
                            </strong></p>
                            <p>Patient Impact: <strong>{selectedTask.patientImpact ? 'Yes' : 'No'}</strong></p>
                          </div>
                        </div>
                      </div>
                      
                      {selectedTask.suggestedNewAssignee && selectedTask.suggestedNewDate && (
                        <div>
                          <h4 className="font-medium mb-2">AI Recovery Suggestion</h4>
                          <div className="bg-blue-50 p-3 rounded space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <User className="h-4 w-4 text-blue-600" />
                              <span>New Assignee: <strong>{selectedTask.suggestedNewAssignee}</strong></span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-blue-600" />
                              <span>New Date: <strong>{selectedTask.suggestedNewDate}</strong></span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-medium mb-2">Recovery Strategy</h4>
                        <p className="text-sm bg-yellow-50 p-3 rounded">{selectedTask.recoveryStrategy}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Workload Adjustment</h4>
                        <p className="text-sm bg-purple-50 p-3 rounded">{selectedTask.workloadAdjustment}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Automation Status</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={selectedTask.autoRescheduleEligible ? "default" : "secondary"}>
                            {selectedTask.autoRescheduleEligible ? "Auto-Recovery Eligible" : "Manual Recovery Required"}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Recommended Actions</h4>
                        <div className="text-sm bg-green-50 p-3 rounded space-y-1">
                          <p>• Immediately reassign to available staff member</p>
                          <p>• Notify patient of rescheduled appointment</p>
                          <p>• Update care team about timeline changes</p>
                          <p>• Monitor for cascade effects on related tasks</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Auto-Recover
                        </Button>
                        <Button variant="outline">
                          <User className="h-4 w-4 mr-1" />
                          Reassign
                        </Button>
                        <Button variant="outline">
                          <Bell className="h-4 w-4 mr-1" />
                          Notify Team
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a missed task to view recovery options and automated solutions</p>
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
