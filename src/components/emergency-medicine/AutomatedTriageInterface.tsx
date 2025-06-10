
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  UserCheck,
  Clock,
  AlertTriangle,
  Heart,
  Thermometer,
  Activity,
  User,
  CheckCircle,
  ArrowRight,
  Timer
} from 'lucide-react';

export const AutomatedTriageInterface = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [triageProgress, setTriageProgress] = useState(75);

  const triageQueue = [
    {
      id: 1,
      name: 'John Martinez',
      age: 45,
      chiefComplaint: 'Chest pain, shortness of breath',
      arrivalTime: '14:32',
      vitalSigns: { bp: '180/95', hr: 95, temp: 98.6, spo2: 92 },
      esiLevel: 2,
      waitTime: 8,
      status: 'pending'
    },
    {
      id: 2,
      name: 'Sarah Williams',
      age: 32,
      chiefComplaint: 'Severe abdominal pain',
      arrivalTime: '14:45',
      vitalSigns: { bp: '140/85', hr: 88, temp: 99.2, spo2: 98 },
      esiLevel: 3,
      waitTime: 15,
      status: 'in-progress'
    },
    {
      id: 3,
      name: 'Robert Chen',
      age: 28,
      chiefComplaint: 'Minor laceration to hand',
      arrivalTime: '15:10',
      vitalSigns: { bp: '120/78', hr: 72, temp: 98.4, spo2: 99 },
      esiLevel: 4,
      waitTime: 25,
      status: 'waiting'
    },
    {
      id: 4,
      name: 'Maria Rodriguez',
      age: 67,
      chiefComplaint: 'Difficulty breathing, chest tightness',
      arrivalTime: '15:20',
      vitalSigns: { bp: '160/90', hr: 102, temp: 99.8, spo2: 89 },
      esiLevel: 1,
      waitTime: 2,
      status: 'critical'
    }
  ];

  const esiLevels = {
    1: { label: 'Resuscitation', color: 'bg-red-800 text-white', timeTarget: 'Immediate' },
    2: { label: 'Emergent', color: 'bg-red-600 text-white', timeTarget: '<15 min' },
    3: { label: 'Urgent', color: 'bg-yellow-500 text-white', timeTarget: '<30 min' },
    4: { label: 'Less Urgent', color: 'bg-green-500 text-white', timeTarget: '<60 min' },
    5: { label: 'Non-Urgent', color: 'bg-blue-500 text-white', timeTarget: '<120 min' }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'waiting': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const processNextTriage = () => {
    setTriageProgress(prev => Math.min(100, prev + 10));
  };

  return (
    <div className="space-y-6">
      {/* Triage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{triageQueue.length}</div>
                <div className="text-sm text-gray-600">Patients in Queue</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {triageQueue.filter(p => p.esiLevel <= 2).length}
                </div>
                <div className="text-sm text-gray-600">Critical/Emergent</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(triageQueue.reduce((acc, p) => acc + p.waitTime, 0) / triageQueue.length)}m
                </div>
                <div className="text-sm text-gray-600">Avg Wait Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{triageProgress}%</div>
                <div className="text-sm text-gray-600">Processing Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automated Triage Process */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Automated ESI Triage Process
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Processing Rate</span>
              <span className="text-sm text-gray-600">{triageProgress}% Complete</span>
            </div>
            <Progress value={triageProgress} className="h-2" />
            <div className="flex gap-2">
              <Button onClick={processNextTriage} className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Process Next Patient
              </Button>
              <Button variant="outline">View Triage Protocols</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Triage Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient Triage Queue</CardTitle>
            <p className="text-sm text-gray-600">Sorted by ESI level and arrival time</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {triageQueue
                .sort((a, b) => a.esiLevel - b.esiLevel || a.waitTime - b.waitTime)
                .map((patient) => (
                <Card 
                  key={patient.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedPatient?.id === patient.id ? 'ring-2 ring-blue-500' : ''
                  } ${getStatusColor(patient.status)}`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{patient.name}</h3>
                          <p className="text-sm text-gray-600">Age: {patient.age}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={esiLevels[patient.esiLevel].color}>
                            ESI {patient.esiLevel}
                          </Badge>
                          <div className="text-xs text-gray-500 mt-1">
                            {esiLevels[patient.esiLevel].timeTarget}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm"><strong>Chief Complaint:</strong> {patient.chiefComplaint}</p>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Arrival: {patient.arrivalTime}</span>
                          <span>Wait: {patient.waitTime} min</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-medium">BP</div>
                          <div>{patient.vitalSigns.bp}</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">HR</div>
                          <div>{patient.vitalSigns.hr}</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">Temp</div>
                          <div>{patient.vitalSigns.temp}°F</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">SpO2</div>
                          <div>{patient.vitalSigns.spo2}%</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ESI Level Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>ESI Triage Guidelines</CardTitle>
            <p className="text-sm text-gray-600">Emergency Severity Index classification</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(esiLevels).map(([level, info]) => (
                <div key={level} className="flex items-center gap-3 p-3 rounded-lg border">
                  <Badge className={info.color}>
                    Level {level}
                  </Badge>
                  <div className="flex-1">
                    <div className="font-medium">{info.label}</div>
                    <div className="text-sm text-gray-600">Target: {info.timeTarget}</div>
                  </div>
                </div>
              ))}
            </div>

            {selectedPatient && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">Selected Patient Details</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Patient:</strong> {selectedPatient.name}</div>
                  <div><strong>ESI Level:</strong> {selectedPatient.esiLevel} - {esiLevels[selectedPatient.esiLevel].label}</div>
                  <div><strong>Status:</strong> {selectedPatient.status}</div>
                  <div><strong>Wait Time:</strong> {selectedPatient.waitTime} minutes</div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm">Start Assessment</Button>
                  <Button size="sm" variant="outline">View History</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
