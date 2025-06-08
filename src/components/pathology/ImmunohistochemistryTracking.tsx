
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TestTube, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Settings,
  FileText,
  Eye,
  RefreshCw,
  Thermometer,
  Timer,
  Beaker
} from 'lucide-react';

export const ImmunohistochemistryTracking = () => {
  const [selectedStain, setSelectedStain] = useState('IHC001');

  const ihdBatches = [
    {
      id: 'IHC001',
      antibody: 'TTF-1',
      specimens: ['SPEC001', 'SPEC003', 'SPEC007'],
      status: 'Staining',
      progress: 65,
      startTime: '09:30',
      estimatedCompletion: '11:45',
      technician: 'Sarah Johnson',
      protocol: 'TTF-1 Standard',
      temperature: '37°C',
      priority: 'Routine'
    },
    {
      id: 'IHC002',
      antibody: 'CK7',
      specimens: ['SPEC002', 'SPEC005'],
      status: 'Incubation',
      progress: 30,
      startTime: '10:15',
      estimatedCompletion: '12:30',
      technician: 'Mike Davis',
      protocol: 'CK7 Enhanced',
      temperature: '37°C',
      priority: 'STAT'
    },
    {
      id: 'IHC003',
      antibody: 'Ki-67',
      specimens: ['SPEC004', 'SPEC006', 'SPEC008', 'SPEC009'],
      status: 'Quality Control',
      progress: 90,
      startTime: '08:00',
      estimatedCompletion: '10:30',
      technician: 'Jennifer Lee',
      protocol: 'Ki-67 Proliferation',
      temperature: 'Room Temp',
      priority: 'Urgent'
    }
  ];

  const protocols = [
    {
      name: 'TTF-1 Standard',
      antibody: 'TTF-1',
      clone: '8G7G3/1',
      dilution: '1:100',
      incubationTime: '60 min',
      retrievalMethod: 'Citrate pH 6.0',
      steps: 8
    },
    {
      name: 'CK7 Enhanced',
      antibody: 'CK7',
      clone: 'OV-TL 12/30',
      dilution: '1:200',
      incubationTime: '45 min',
      retrievalMethod: 'EDTA pH 8.0',
      steps: 9
    },
    {
      name: 'Ki-67 Proliferation',
      antibody: 'Ki-67',
      clone: 'MIB-1',
      dilution: '1:150',
      incubationTime: '30 min',
      retrievalMethod: 'Citrate pH 6.0',
      steps: 7
    }
  ];

  const stainingSteps = [
    { name: 'Deparaffinization', completed: true, time: '5 min' },
    { name: 'Antigen Retrieval', completed: true, time: '20 min' },
    { name: 'Primary Antibody', completed: true, time: '60 min' },
    { name: 'Secondary Antibody', completed: false, current: true, time: '30 min' },
    { name: 'Detection', completed: false, time: '15 min' },
    { name: 'Counterstaining', completed: false, time: '5 min' },
    { name: 'Dehydration', completed: false, time: '10 min' },
    { name: 'Mounting', completed: false, time: '5 min' }
  ];

  const qualityControls = [
    { type: 'Positive Control', tissue: 'Lung', result: 'Strong Nuclear', status: 'Pass' },
    { type: 'Negative Control', tissue: 'Tonsil', result: 'No Staining', status: 'Pass' },
    { type: 'Internal Control', tissue: 'Adjacent Normal', result: 'Appropriate', status: 'Pass' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Immunohistochemistry Tracking</h3>
          <p className="text-gray-600">Staining protocols, quality control, and result interpretation</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Protocols
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            QC Report
          </Button>
          <Button className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Start Batch
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Active Batches */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Active IHC Batches</CardTitle>
              <CardDescription className="text-xs">Current staining runs</CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                {ihdBatches.map((batch) => (
                  <div
                    key={batch.id}
                    className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                      selectedStain === batch.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedStain(batch.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className={`text-xs ${
                        batch.priority === 'STAT' ? 'border-red-500 text-red-700' :
                        batch.priority === 'Urgent' ? 'border-orange-500 text-orange-700' :
                        'border-blue-500 text-blue-700'
                      }`}>
                        {batch.priority}
                      </Badge>
                      <span className="text-xs text-gray-500">{batch.startTime}</span>
                    </div>
                    <h5 className="font-medium text-sm text-gray-900">{batch.antibody}</h5>
                    <p className="text-xs text-gray-600">{batch.specimens.length} specimens</p>
                    <p className="text-xs text-gray-500">{batch.technician}</p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>{batch.status}</span>
                        <span>{batch.progress}%</span>
                      </div>
                      <Progress value={batch.progress} className="h-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Protocols</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                {protocols.map((protocol, index) => (
                  <div key={index} className="p-2 border rounded hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm font-medium text-gray-900">{protocol.name}</p>
                    <p className="text-xs text-gray-600">{protocol.antibody} • {protocol.clone}</p>
                    <p className="text-xs text-gray-500">{protocol.dilution} • {protocol.incubationTime}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Staining Progress */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staining Progress - {selectedStain}</CardTitle>
              <CardDescription>Real-time tracking of immunohistochemistry protocol</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stainingSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-green-500 text-white' :
                      step.current ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : step.current ? (
                        <Timer className="h-4 w-4" />
                      ) : (
                        <div className="w-2 h-2 bg-current rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h5 className={`font-medium ${
                        step.current ? 'text-blue-900' : step.completed ? 'text-green-900' : 'text-gray-600'
                      }`}>
                        {step.name}
                      </h5>
                      <p className="text-sm text-gray-500">{step.time}</p>
                    </div>
                    {step.current && (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
                        <Badge className="bg-blue-500">Running</Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Protocol Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Protocol Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <TestTube className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">TTF-1 (8G7G3/1)</p>
                      <p className="text-sm text-gray-600">Primary Antibody</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Dilution</span>
                      <span className="font-medium">1:100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Incubation</span>
                      <span className="font-medium">60 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Retrieval</span>
                      <span className="font-medium">Citrate pH 6.0</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Environmental Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Environmental Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Thermometer className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">37°C</p>
                      <p className="text-sm text-gray-600">Incubation Temperature</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">11:45 AM</p>
                      <p className="text-sm text-gray-600">Estimated Completion</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Beaker className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">Batch #245</p>
                      <p className="text-sm text-gray-600">Reagent Lot</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quality Control */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quality Controls</CardTitle>
              <CardDescription className="text-xs">Validation results</CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-3">
                {qualityControls.map((qc, index) => (
                  <div key={index} className="border rounded p-2">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium">{qc.type}</p>
                      <Badge variant="outline" className="text-xs border-green-500 text-green-700">
                        {qc.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{qc.tissue}</p>
                    <p className="text-xs text-gray-500">{qc.result}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Specimen List</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                {['SPEC001', 'SPEC003', 'SPEC007'].map((specimen, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span>{specimen}</span>
                    <Badge variant="outline" className="border-blue-500 text-blue-700">
                      Processing
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <Button size="sm" className="w-full flex items-center gap-2">
                <Eye className="h-3 w-3" />
                View Results
              </Button>
              <Button size="sm" variant="outline" className="w-full flex items-center gap-2">
                <FileText className="h-3 w-3" />
                QC Report
              </Button>
              <Button size="sm" variant="outline" className="w-full flex items-center gap-2">
                <RefreshCw className="h-3 w-3" />
                Repeat Stain
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
