
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { CheckSquare, AlertTriangle, Clock, User, FileText } from 'lucide-react';

export const PreOperativeAssessment = () => {
  const [selectedPatient, setSelectedPatient] = useState('patient-1');

  const patients = [
    {
      id: 'patient-1',
      name: 'John Smith',
      procedure: 'Laparoscopic Cholecystectomy',
      surgery_date: '2024-01-15',
      risk_level: 'low',
      completion: 85
    },
    {
      id: 'patient-2',
      name: 'Maria Garcia',
      procedure: 'Total Knee Replacement',
      surgery_date: '2024-01-15',
      risk_level: 'moderate',
      completion: 60
    },
    {
      id: 'patient-3',
      name: 'Robert Wilson',
      procedure: 'Emergency Appendectomy',
      surgery_date: '2024-01-15',
      risk_level: 'high',
      completion: 40
    }
  ];

  const checklistItems = [
    { id: 1, category: 'History & Physical', item: 'Medical History Review', completed: true, required: true },
    { id: 2, category: 'History & Physical', item: 'Physical Examination', completed: true, required: true },
    { id: 3, category: 'History & Physical', item: 'Medication Review', completed: true, required: true },
    { id: 4, category: 'Laboratory', item: 'Complete Blood Count', completed: true, required: true },
    { id: 5, category: 'Laboratory', item: 'Basic Metabolic Panel', completed: true, required: true },
    { id: 6, category: 'Laboratory', item: 'Coagulation Studies', completed: false, required: true },
    { id: 7, category: 'Imaging', item: 'Chest X-ray', completed: true, required: false },
    { id: 8, category: 'Imaging', item: 'ECG', completed: false, required: true },
    { id: 9, category: 'Clearance', item: 'Anesthesia Clearance', completed: false, required: true },
    { id: 10, category: 'Clearance', item: 'Cardiology Clearance', completed: false, required: false },
    { id: 11, category: 'Consent', item: 'Informed Consent', completed: false, required: true },
    { id: 12, category: 'Consent', item: 'Anesthesia Consent', completed: false, required: true }
  ];

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'low': return 'bg-green-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-white';
      case 'high': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const groupedItems = checklistItems.reduce((groups, item) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
    return groups;
  }, {} as Record<string, typeof checklistItems>);

  const completedRequired = checklistItems.filter(item => item.required && item.completed).length;
  const totalRequired = checklistItems.filter(item => item.required).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pre-Operative Assessment</h2>
        <Button className="bg-green-600 hover:bg-green-700">
          <CheckSquare className="h-4 w-4 mr-2" />
          Complete Assessment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patients for Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patients.map((patient) => (
                <div 
                  key={patient.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPatient === patient.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPatient(patient.id)}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{patient.name}</h3>
                      <Badge className={getRiskColor(patient.risk_level)}>
                        {patient.risk_level} risk
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{patient.procedure}</p>
                    <div className="flex items-center gap-2">
                      <Progress value={patient.completion} className="flex-1" />
                      <span className="text-sm text-gray-600">{patient.completion}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Assessment Checklist
              <Badge variant="outline" className="ml-auto">
                {completedRequired}/{totalRequired} Required Complete
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(groupedItems).map(([category, items]) => (
                <div key={category}>
                  <h3 className="font-semibold text-lg mb-3 text-blue-800">{category}</h3>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
                        <Checkbox 
                          checked={item.completed}
                          className="data-[state=checked]:bg-green-500"
                        />
                        <div className="flex-1">
                          <span className={item.completed ? 'line-through text-gray-500' : ''}>
                            {item.item}
                          </span>
                          {item.required && (
                            <Badge variant="outline" className="ml-2 text-xs">Required</Badge>
                          )}
                        </div>
                        {!item.completed && item.required && (
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Risk Stratification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-semibold text-red-800">ASA Score</h3>
              <div className="text-2xl font-bold text-red-600">II</div>
              <p className="text-sm text-red-600">Mild systemic disease</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-800">Cardiac Risk</h3>
              <div className="text-2xl font-bold text-orange-600">Low</div>
              <p className="text-sm text-orange-600">Goldman Index: 2</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800">Pulmonary Risk</h3>
              <div className="text-2xl font-bold text-blue-600">Low</div>
              <p className="text-sm text-blue-600">No major factors</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
