
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ClipboardCheck, User, FileText, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: 'documentation' | 'clinical' | 'equipment' | 'medications' | 'family';
  item: string;
  completed: boolean;
  required: boolean;
  assignedTo: string;
  completedBy?: string;
  completedAt?: string;
  notes?: string;
}

interface AdmissionChecklist {
  patientId: string;
  patientName: string;
  admissionTime: string;
  assignedNurse: string;
  items: ChecklistItem[];
  overallProgress: number;
  estimatedCompletion: string;
  priority: 'routine' | 'urgent' | 'emergency';
}

const mockChecklist: AdmissionChecklist = {
  patientId: 'ICU001',
  patientName: 'Sarah Johnson',
  admissionTime: '2024-01-22 10:30 AM',
  assignedNurse: 'Jennifer Smith',
  estimatedCompletion: '2024-01-22 12:00 PM',
  priority: 'urgent',
  overallProgress: 65,
  items: [
    {
      id: 'DOC001',
      category: 'documentation',
      item: 'Admission orders entered',
      completed: true,
      required: true,
      assignedTo: 'Dr. Martinez',
      completedBy: 'Dr. Martinez',
      completedAt: '10:35 AM'
    },
    {
      id: 'DOC002',
      category: 'documentation',
      item: 'Insurance verification',
      completed: true,
      required: true,
      assignedTo: 'Admin Staff',
      completedBy: 'Sarah Connor',
      completedAt: '10:40 AM'
    },
    {
      id: 'CLIN001',
      category: 'clinical',
      item: 'Initial assessment completed',
      completed: true,
      required: true,
      assignedTo: 'Nurse Smith',
      completedBy: 'Jennifer Smith',
      completedAt: '10:45 AM'
    },
    {
      id: 'CLIN002',
      category: 'clinical',
      item: 'Vital signs monitoring setup',
      completed: true,
      required: true,
      assignedTo: 'Nurse Smith',
      completedBy: 'Jennifer Smith',
      completedAt: '10:50 AM'
    },
    {
      id: 'EQUIP001',
      category: 'equipment',
      item: 'Bed assignment and setup',
      completed: true,
      required: true,
      assignedTo: 'Ward Clerk',
      completedBy: 'Mike Johnson',
      completedAt: '10:35 AM'
    },
    {
      id: 'EQUIP002',
      category: 'equipment',
      item: 'IV access established',
      completed: false,
      required: true,
      assignedTo: 'Nurse Smith'
    },
    {
      id: 'MED001',
      category: 'medications',
      item: 'Medication reconciliation',
      completed: false,
      required: true,
      assignedTo: 'Pharmacist'
    },
    {
      id: 'MED002',
      category: 'medications',
      item: 'Allergy verification',
      completed: true,
      required: true,
      assignedTo: 'Nurse Smith',
      completedBy: 'Jennifer Smith',
      completedAt: '10:45 AM'
    },
    {
      id: 'FAM001',
      category: 'family',
      item: 'Emergency contact updated',
      completed: false,
      required: false,
      assignedTo: 'Admin Staff'
    },
    {
      id: 'FAM002',
      category: 'family',
      item: 'Family notification sent',
      completed: false,
      required: false,
      assignedTo: 'Social Worker'
    }
  ]
};

export const ICUAdmissionChecklist = () => {
  const [checklist, setChecklist] = useState<AdmissionChecklist>(mockChecklist);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'documentation': return <FileText className="h-4 w-4" />;
      case 'clinical': return <Activity className="h-4 w-4" />;
      case 'equipment': return <AlertTriangle className="h-4 w-4" />;
      case 'medications': return <CheckCircle className="h-4 w-4" />;
      case 'family': return <User className="h-4 w-4" />;
      default: return <ClipboardCheck className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'documentation': return 'bg-blue-500';
      case 'clinical': return 'bg-green-500';
      case 'equipment': return 'bg-orange-500';
      case 'medications': return 'bg-purple-500';
      case 'family': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'bg-red-600 text-white';
      case 'urgent': return 'bg-orange-500 text-white';
      case 'routine': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const toggleItem = (itemId: string) => {
    setChecklist(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const newCompleted = !item.completed;
          return {
            ...item,
            completed: newCompleted,
            completedBy: newCompleted ? 'Current User' : undefined,
            completedAt: newCompleted ? new Date().toLocaleTimeString() : undefined
          };
        }
        return item;
      })
    }));
  };

  const categorizedItems = checklist.items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  const completedRequiredItems = checklist.items.filter(item => item.required && item.completed).length;
  const totalRequiredItems = checklist.items.filter(item => item.required).length;
  const requiredProgress = (completedRequiredItems / totalRequiredItems) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            ICU Admission Auto-Checklist
          </CardTitle>
          <CardDescription>
            Automated workflow checklist for ICU admissions with task tracking and assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-lg">{checklist.patientName}</h3>
                <Badge variant="outline">{checklist.patientId}</Badge>
                <Badge className={getPriorityColor(checklist.priority)}>
                  {checklist.priority.toUpperCase()}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Admitted: {checklist.admissionTime}</p>
                <p className="text-sm text-gray-500">Est. Completion: {checklist.estimatedCompletion}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Overall Progress</span>
                </div>
                <Progress value={checklist.overallProgress} className="h-3 mb-2" />
                <p className="text-sm text-gray-600">{checklist.overallProgress}% Complete</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="font-medium">Required Items</span>
                </div>
                <Progress value={requiredProgress} className="h-3 mb-2" />
                <p className="text-sm text-gray-600">{completedRequiredItems}/{totalRequiredItems} Required</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Assigned Nurse</span>
                </div>
                <p className="font-medium">{checklist.assignedNurse}</p>
                <p className="text-sm text-gray-600">Primary coordinator</p>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            {Object.entries(categorizedItems).map(([category, items]) => (
              <Card key={category}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className={`p-2 rounded-lg ${getCategoryColor(category)} text-white`}>
                      {getCategoryIcon(category)}
                    </div>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                    <Badge variant="outline">
                      {items.filter(item => item.completed).length}/{items.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        <Checkbox
                          checked={item.completed}
                          onCheckedChange={() => toggleItem(item.id)}
                          className="data-[state=checked]:bg-green-600"
                        />
                        <div className="flex-1">
                          <p className={`font-medium ${item.completed ? 'line-through text-gray-500' : ''}`}>
                            {item.item}
                            {item.required && <span className="text-red-500 ml-1">*</span>}
                          </p>
                          <p className="text-sm text-gray-600">Assigned to: {item.assignedTo}</p>
                          {item.completed && item.completedBy && (
                            <p className="text-xs text-green-600">
                              Completed by {item.completedBy} at {item.completedAt}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                        {item.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <div className="h-5 w-5 border-2 border-gray-300 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <Button>
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Complete Admission
            </Button>
            <Button variant="outline">
              Generate Report
            </Button>
            <Button variant="outline">
              Send Updates
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
