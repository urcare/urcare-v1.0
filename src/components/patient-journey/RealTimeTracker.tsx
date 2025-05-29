
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Activity, Clock, MapPin, User, AlertCircle, CheckCircle } from 'lucide-react';

interface PatientStatus {
  id: string;
  name: string;
  currentStage: string;
  location: string;
  progress: number;
  estimatedTime: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  lastUpdate: string;
  nextStep: string;
}

const mockPatients: PatientStatus[] = [
  {
    id: 'P001',
    name: 'John Smith',
    currentStage: 'Registration',
    location: 'Reception Area',
    progress: 25,
    estimatedTime: '15 min',
    priority: 'medium',
    lastUpdate: '2 min ago',
    nextStep: 'Vitals Check'
  },
  {
    id: 'P002',
    name: 'Sarah Johnson',
    currentStage: 'Doctor Consultation',
    location: 'Room 203',
    progress: 75,
    estimatedTime: '20 min',
    priority: 'high',
    lastUpdate: '1 min ago',
    nextStep: 'Lab Tests'
  },
  {
    id: 'P003',
    name: 'Mike Davis',
    currentStage: 'Lab Tests',
    location: 'Lab Section B',
    progress: 50,
    estimatedTime: '30 min',
    priority: 'low',
    lastUpdate: '5 min ago',
    nextStep: 'Results Review'
  }
];

const journeyStages = [
  'Registration',
  'Vitals Check',
  'Doctor Consultation',
  'Lab Tests',
  'Results Review',
  'Treatment',
  'Discharge'
];

export const RealTimeTracker = () => {
  const [patients, setPatients] = useState<PatientStatus[]>(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setPatients(prev => prev.map(patient => ({
        ...patient,
        progress: Math.min(patient.progress + Math.random() * 5, 100),
        lastUpdate: 'Just now'
      })));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    return priority === 'critical' || priority === 'high' 
      ? <AlertCircle className="h-4 w-4" />
      : <CheckCircle className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-Time Patient Journey Tracker
          </CardTitle>
          <CardDescription>
            Live tracking of patient progress through care journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {patients.map((patient) => (
              <div 
                key={patient.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPatient === patient.id ? 'border-blue-500 bg-blue-50' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedPatient(patient.id === selectedPatient ? null : patient.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(patient.priority)}`} />
                    <h3 className="font-semibold">{patient.name}</h3>
                    <Badge variant="outline">{patient.id}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(patient.priority)}
                    <Badge variant={patient.priority === 'critical' ? 'destructive' : 'secondary'}>
                      {patient.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{patient.currentStage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{patient.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">ETA: {patient.estimatedTime}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Journey Progress</span>
                    <span>{Math.round(patient.progress)}%</span>
                  </div>
                  <Progress value={patient.progress} className="h-2" />
                </div>

                <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                  <span>Last update: {patient.lastUpdate}</span>
                  <span>Next: {patient.nextStep}</span>
                </div>

                {selectedPatient === patient.id && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Journey Timeline</h4>
                    <div className="space-y-2">
                      {journeyStages.map((stage, index) => {
                        const isCompleted = index < journeyStages.indexOf(patient.currentStage);
                        const isCurrent = stage === patient.currentStage;
                        
                        return (
                          <div key={stage} className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              isCompleted ? 'bg-green-500' : 
                              isCurrent ? 'bg-blue-500' : 'bg-gray-300'
                            }`} />
                            <span className={`text-sm ${
                              isCompleted ? 'text-green-700' :
                              isCurrent ? 'text-blue-700 font-medium' : 'text-gray-500'
                            }`}>
                              {stage}
                            </span>
                            {isCurrent && (
                              <Badge variant="secondary" className="ml-auto">
                                Current
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
            <Button variant="outline" size="sm">
              <Activity className="h-4 w-4 mr-2" />
              Update Status
            </Button>
            <Button variant="outline" size="sm">
              <AlertCircle className="h-4 w-4 mr-2" />
              Mark Priority
            </Button>
            <Button variant="outline" size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Stage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
