
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export const PostOperativeCare = () => {
  const [selectedPatient, setSelectedPatient] = useState('patient-1');

  const postOpPatients = [
    {
      id: 'patient-1',
      name: 'John Smith',
      procedure: 'Laparoscopic Cholecystectomy',
      completedTime: '11:30',
      location: 'PACU Bed 3',
      status: 'stable',
      painScore: 3,
      consciousness: 'alert',
      recovery: 75
    },
    {
      id: 'patient-2',
      name: 'Maria Garcia',
      procedure: 'Total Knee Replacement',
      completedTime: '15:45',
      location: 'PACU Bed 1',
      status: 'monitoring',
      painScore: 6,
      consciousness: 'drowsy',
      recovery: 45
    }
  ];

  const vitalSigns = [
    { parameter: 'Blood Pressure', value: '125/78 mmHg', status: 'normal', trend: 'stable' },
    { parameter: 'Heart Rate', value: '82 bpm', status: 'normal', trend: 'stable' },
    { parameter: 'Respiratory Rate', value: '16/min', status: 'normal', trend: 'stable' },
    { parameter: 'Temperature', value: '98.6°F', status: 'normal', trend: 'stable' },
    { parameter: 'Oxygen Saturation', value: '98%', status: 'normal', trend: 'stable' }
  ];

  const complications = [
    { type: 'Nausea', severity: 'mild', time: '12:15', intervention: 'Ondansetron 4mg IV', resolved: true },
    { type: 'Pain', severity: 'moderate', time: '12:30', intervention: 'Morphine 2mg IV', resolved: false }
  ];

  const dischargeChecklist = [
    { item: 'Stable vital signs for 2 hours', completed: true },
    { item: 'Pain controlled (≤4/10)', completed: false },
    { item: 'Nausea/vomiting resolved', completed: true },
    { item: 'Able to ambulate', completed: false },
    { item: 'Voided spontaneously', completed: false },
    { item: 'Discharge instructions given', completed: false },
    { item: 'Follow-up scheduled', completed: false }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'stable': return 'bg-green-500 text-white';
      case 'monitoring': return 'bg-yellow-500 text-white';
      case 'concern': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getVitalStatus = (status: string) => {
    switch(status) {
      case 'normal': return 'text-green-600';
      case 'borderline': return 'text-yellow-600';
      case 'abnormal': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Post-Operative Care</h2>
        <Button className="bg-green-600 hover:bg-green-700">
          <CheckCircle className="h-4 w-4 mr-2" />
          Discharge Patient
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recovery Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {postOpPatients.map((patient) => (
                <div 
                  key={patient.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPatient === patient.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPatient(patient.id)}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-sm">{patient.name}</h3>
                      <Badge className={getStatusColor(patient.status)}>
                        {patient.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{patient.procedure}</p>
                    <div className="text-xs text-gray-500">
                      {patient.location} • Completed: {patient.completedTime}
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={patient.recovery} className="flex-1 h-2" />
                      <span className="text-xs text-gray-600">{patient.recovery}%</span>
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
              <Activity className="h-5 w-5" />
              Vital Signs Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vitalSigns.map((vital, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{vital.parameter}</div>
                    <div className={`text-lg font-bold ${getVitalStatus(vital.status)}`}>
                      {vital.value}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={getVitalStatus(vital.status)}>
                      {vital.status}
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">{vital.trend}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pain Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">3/10</div>
                <div className="text-sm text-gray-600">Current Pain Score</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Last Assessment:</span>
                  <span>12:45</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Next Due:</span>
                  <span>13:45</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Record Pain Score
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Post-Op Complications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {complications.map((comp, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">{comp.type}</div>
                    <Badge className={comp.resolved ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                      {comp.resolved ? 'Resolved' : 'Active'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>Severity: {comp.severity}</div>
                    <div>Time: {comp.time}</div>
                    <div>Intervention: {comp.intervention}</div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                + Add Complication
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Discharge Readiness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dischargeChecklist.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                  }`}>
                    {item.completed && <CheckCircle className="h-3 w-3 text-white" />}
                  </div>
                  <span className={item.completed ? 'line-through text-gray-500' : ''}>
                    {item.item}
                  </span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>Completion:</span>
                  <span className="font-medium">
                    {dischargeChecklist.filter(item => item.completed).length}/
                    {dischargeChecklist.length}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
