
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, AlertTriangle, Play, Pause, Square } from 'lucide-react';

export const IntraoperativeDocumentation = () => {
  const [activeCase, setActiveCase] = useState('case-1');
  const [isRecording, setIsRecording] = useState(false);

  const activeCases = [
    {
      id: 'case-1',
      patient: 'John Smith',
      procedure: 'Laparoscopic Cholecystectomy',
      surgeon: 'Dr. Sarah Johnson',
      startTime: '08:00',
      currentTime: '09:30',
      status: 'in-progress'
    },
    {
      id: 'case-2',
      patient: 'Robert Wilson',
      procedure: 'Emergency Appendectomy',
      surgeon: 'Dr. Emily Davis',
      startTime: '14:00',
      currentTime: '14:45',
      status: 'in-progress'
    }
  ];

  const procedureSteps = [
    { step: 1, description: 'Patient positioning and draping', completed: true, timestamp: '08:15' },
    { step: 2, description: 'Trocar placement', completed: true, timestamp: '08:25' },
    { step: 3, description: 'Pneumoperitoneum established', completed: true, timestamp: '08:30' },
    { step: 4, description: 'Laparoscopic inspection', completed: true, timestamp: '08:35' },
    { step: 5, description: 'Calot\'s triangle dissection', completed: false, timestamp: null },
    { step: 6, description: 'Cystic artery identification', completed: false, timestamp: null },
    { step: 7, description: 'Gallbladder dissection', completed: false, timestamp: null },
    { step: 8, description: 'Specimen removal', completed: false, timestamp: null }
  ];

  const complications = [
    { type: 'Bleeding', severity: 'minor', time: '09:15', resolved: true },
    { type: 'Adhesions', severity: 'moderate', time: '09:25', resolved: false }
  ];

  const supplies = [
    { item: '5mm Trocar', quantity: 3, used: 3 },
    { item: '12mm Trocar', quantity: 1, used: 1 },
    { item: 'Clip Appliers', quantity: 2, used: 1 },
    { item: 'Electrocautery', quantity: 1, used: 1 },
    { item: 'Specimen Bag', quantity: 1, used: 0 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Intraoperative Documentation</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsRecording(!isRecording)}
            className={isRecording ? 'text-red-600' : ''}
          >
            {isRecording ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isRecording ? 'Pause' : 'Start'} Recording
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Square className="h-4 w-4 mr-2" />
            Complete Case
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeCases.map((case_) => (
                <div 
                  key={case_.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    activeCase === case_.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveCase(case_.id)}
                >
                  <h3 className="font-semibold text-sm">{case_.patient}</h3>
                  <p className="text-xs text-gray-600">{case_.procedure}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Clock className="h-3 w-3" />
                    {case_.startTime} - {case_.currentTime}
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
              Procedure Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {procedureSteps.map((step) => (
                <div key={step.step} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <span className={step.completed ? 'line-through text-gray-500' : ''}>
                      {step.description}
                    </span>
                    {step.timestamp && (
                      <div className="text-xs text-gray-500 mt-1">{step.timestamp}</div>
                    )}
                  </div>
                  {!step.completed && (
                    <Button variant="outline" className="h-8 px-2 text-xs">
                      Mark Complete
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Supply Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {supplies.map((supply, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <div>
                    <div className="font-medium">{supply.item}</div>
                    <div className="text-gray-500">Used: {supply.used}/{supply.quantity}</div>
                  </div>
                  <Button variant="outline" className="h-6 px-2 text-xs">
                    +1
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Complications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {complications.map((comp, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{comp.type}</div>
                    <div className="text-sm text-gray-600">
                      {comp.severity} severity at {comp.time}
                    </div>
                  </div>
                  <Badge className={comp.resolved ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                    {comp.resolved ? 'Resolved' : 'Ongoing'}
                  </Badge>
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
            <CardTitle>Case Timing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Start Time:</span>
                <span className="font-medium">08:00</span>
              </div>
              <div className="flex justify-between">
                <span>Current Time:</span>
                <span className="font-medium">09:30</span>
              </div>
              <div className="flex justify-between">
                <span>Elapsed Time:</span>
                <span className="font-medium text-blue-600">1h 30m</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Remaining:</span>
                <span className="font-medium text-orange-600">30m</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
