
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { ClipboardCheck, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  required: boolean;
  assignedTo: string;
  notes?: string;
  completedAt?: string;
  completedBy?: string;
}

interface PatientChecklist {
  patientId: string;
  patientName: string;
  bedNumber: string;
  targetDischargeDate: string;
  items: ChecklistItem[];
  overallProgress: number;
}

const mockChecklists: PatientChecklist[] = [
  {
    patientId: 'W003',
    patientName: 'Mike Davis',
    bedNumber: 'A-105',
    targetDischargeDate: '2024-01-22',
    overallProgress: 75,
    items: [
      {
        id: 'med-reconciliation',
        task: 'Medication Reconciliation',
        completed: true,
        required: true,
        assignedTo: 'Pharmacist',
        completedAt: '2024-01-21 09:30',
        completedBy: 'Dr. Smith'
      },
      {
        id: 'discharge-summary',
        task: 'Discharge Summary Completed',
        completed: true,
        required: true,
        assignedTo: 'Attending Physician',
        completedAt: '2024-01-21 10:15',
        completedBy: 'Dr. Johnson'
      },
      {
        id: 'patient-education',
        task: 'Patient Education Provided',
        completed: false,
        required: true,
        assignedTo: 'Nurse',
        notes: 'Scheduled for 2:00 PM today'
      },
      {
        id: 'transport-arranged',
        task: 'Transport Arrangements',
        completed: false,
        required: true,
        assignedTo: 'Social Worker'
      },
      {
        id: 'follow-up-scheduled',
        task: 'Follow-up Appointments Scheduled',
        completed: true,
        required: true,
        assignedTo: 'Discharge Coordinator',
        completedAt: '2024-01-21 11:00',
        completedBy: 'Jane Wilson'
      },
      {
        id: 'equipment-returned',
        task: 'Hospital Equipment Returned',
        completed: false,
        required: false,
        assignedTo: 'Ward Staff'
      }
    ]
  }
];

export const PreDischargeChecklist = () => {
  const [checklists, setChecklists] = useState<PatientChecklist[]>(mockChecklists);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  const handleItemToggle = (patientId: string, itemId: string) => {
    setChecklists(prev => prev.map(checklist => {
      if (checklist.patientId === patientId) {
        const updatedItems = checklist.items.map(item => {
          if (item.id === itemId) {
            const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
            return {
              ...item,
              completed: !item.completed,
              completedAt: !item.completed ? now : undefined,
              completedBy: !item.completed ? 'Current User' : undefined
            };
          }
          return item;
        });
        
        const completedCount = updatedItems.filter(item => item.completed).length;
        const progress = Math.round((completedCount / updatedItems.length) * 100);
        
        return {
          ...checklist,
          items: updatedItems,
          overallProgress: progress
        };
      }
      return checklist;
    }));
  };

  const addNote = (patientId: string, itemId: string, note: string) => {
    setChecklists(prev => prev.map(checklist => {
      if (checklist.patientId === patientId) {
        return {
          ...checklist,
          items: checklist.items.map(item => 
            item.id === itemId ? { ...item, notes: note } : item
          )
        };
      }
      return checklist;
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Pre-Discharge Checklist System
          </CardTitle>
          <CardDescription>
            Ensure all discharge requirements are completed before patient release
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {checklists.map((checklist) => (
              <Card key={checklist.patientId} className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{checklist.patientName}</CardTitle>
                      <CardDescription>
                        Bed {checklist.bedNumber} • Target Discharge: {checklist.targetDischargeDate}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge variant={checklist.overallProgress === 100 ? "default" : "secondary"}>
                        {checklist.overallProgress}% Complete
                      </Badge>
                      <Progress value={checklist.overallProgress} className="w-32 mt-2" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {checklist.items.map((item) => (
                      <div 
                        key={item.id} 
                        className={`p-4 border rounded-lg ${item.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id={`${checklist.patientId}-${item.id}`}
                            checked={item.completed}
                            onCheckedChange={() => handleItemToggle(checklist.patientId, item.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <label
                                htmlFor={`${checklist.patientId}-${item.id}`}
                                className={`font-medium cursor-pointer ${item.completed ? 'line-through text-gray-500' : ''}`}
                              >
                                {item.task}
                              </label>
                              <div className="flex items-center gap-2">
                                {item.required && (
                                  <Badge variant="destructive" className="text-xs">Required</Badge>
                                )}
                                {item.completed ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                                )}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>Assigned to: {item.assignedTo}</span>
                              </div>
                              {item.completedAt && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>Completed: {item.completedAt} by {item.completedBy}</span>
                                </div>
                              )}
                            </div>

                            {item.notes && (
                              <div className="mb-2 p-2 bg-blue-50 rounded text-sm">
                                <strong>Notes:</strong> {item.notes}
                              </div>
                            )}

                            {!item.completed && (
                              <div className="mt-2">
                                <Textarea
                                  placeholder="Add notes for this task..."
                                  value={item.notes || ''}
                                  onChange={(e) => addNote(checklist.patientId, item.id, e.target.value)}
                                  className="text-sm"
                                  rows={2}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      {checklist.items.filter(item => item.completed).length} of {checklist.items.length} tasks completed
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Add Task
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={checklist.overallProgress < 100}
                      >
                        Generate Report
                      </Button>
                      <Button 
                        size="sm"
                        disabled={checklist.items.filter(item => item.required && !item.completed).length > 0}
                        className={checklist.overallProgress === 100 ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        {checklist.overallProgress === 100 ? 'Approve Discharge' : 'Pending Required Tasks'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Discharge Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-gray-500">Ready for Discharge</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <AlertCircle className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
              <p className="text-2xl font-bold">5</p>
              <p className="text-sm text-gray-500">Pending Tasks</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <ClipboardCheck className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-gray-500">Discharged Today</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Clock className="h-8 w-8 mx-auto text-purple-500 mb-2" />
              <p className="text-2xl font-bold">2.5h</p>
              <p className="text-sm text-gray-500">Avg Discharge Time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
