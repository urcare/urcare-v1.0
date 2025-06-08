
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Workflow,
  Thermometer,
  FileText,
  Camera,
  QrCode,
  Search
} from 'lucide-react';

export const TissueTracking = () => {
  const [selectedSpecimen, setSelectedSpecimen] = useState('SPEC001');

  const specimens = [
    {
      id: 'SPEC001',
      patient: 'John Doe',
      type: 'Lung Biopsy',
      status: 'Processing',
      priority: 'STAT',
      received: '2024-01-08 14:30',
      currentStep: 'Sectioning',
      progress: 45,
      location: 'Processing Lab A',
      temperature: '-20°C',
      blocks: 3,
      slides: 15
    },
    {
      id: 'SPEC002',
      patient: 'Jane Smith',
      type: 'Breast Core',
      status: 'Staining',
      priority: 'Urgent',
      received: '2024-01-08 13:45',
      currentStep: 'H&E Staining',
      progress: 75,
      location: 'Staining Station 2',
      temperature: 'Room Temp',
      blocks: 2,
      slides: 8
    },
    {
      id: 'SPEC003',
      patient: 'Mike Wilson',
      type: 'Colon Resection',
      status: 'Ready',
      priority: 'Routine',
      received: '2024-01-08 12:00',
      currentStep: 'Ready for Review',
      progress: 100,
      location: 'Pathologist Desk',
      temperature: 'Room Temp',
      blocks: 8,
      slides: 32
    }
  ];

  const processingSteps = [
    { name: 'Accessioning', completed: true, time: '14:30' },
    { name: 'Grossing', completed: true, time: '15:15' },
    { name: 'Processing', completed: true, time: '16:00' },
    { name: 'Embedding', completed: true, time: '09:30' },
    { name: 'Sectioning', completed: false, current: true, time: 'In Progress' },
    { name: 'Staining', completed: false, time: 'Pending' },
    { name: 'Coverslipping', completed: false, time: 'Pending' },
    { name: 'Review', completed: false, time: 'Pending' }
  ];

  const qualityIndicators = [
    { metric: 'Fixation Time', value: '6.5 hrs', status: 'Optimal', color: 'green' },
    { metric: 'Processing Temperature', value: '60°C', status: 'Normal', color: 'green' },
    { metric: 'Section Thickness', value: '4 μm', status: 'Standard', color: 'green' },
    { metric: 'Staining Quality', value: 'Excellent', status: 'Passed', color: 'green' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Tissue Tracking</h3>
          <p className="text-gray-600">Specimen journey visualization and quality monitoring</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            Scan Specimen
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Specimens
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Specimen List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Active Specimens</CardTitle>
              <CardDescription className="text-xs">Specimens currently in processing</CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                {specimens.map((specimen) => (
                  <div
                    key={specimen.id}
                    className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                      selectedSpecimen === specimen.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedSpecimen(specimen.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className={`text-xs ${
                        specimen.priority === 'STAT' ? 'border-red-500 text-red-700' :
                        specimen.priority === 'Urgent' ? 'border-orange-500 text-orange-700' :
                        'border-blue-500 text-blue-700'
                      }`}>
                        {specimen.priority}
                      </Badge>
                      <span className="text-xs text-gray-500">{specimen.id}</span>
                    </div>
                    <h5 className="font-medium text-sm text-gray-900">{specimen.patient}</h5>
                    <p className="text-xs text-gray-600">{specimen.type}</p>
                    <p className="text-xs text-gray-500 mt-1">{specimen.currentStep}</p>
                    <div className="mt-2">
                      <Progress value={specimen.progress} className="h-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">23</p>
                <p className="text-xs text-gray-600">Active Specimens</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center p-2 border rounded">
                  <p className="font-medium">8</p>
                  <p className="text-gray-600">STAT</p>
                </div>
                <div className="text-center p-2 border rounded">
                  <p className="font-medium">15</p>
                  <p className="text-gray-600">Routine</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Processing Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Processing Timeline - {selectedSpecimen}</CardTitle>
              <CardDescription>Detailed specimen journey with timestamps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processingSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-green-500 text-white' :
                      step.current ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : step.current ? (
                        <Clock className="h-4 w-4" />
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
                      <Badge className="bg-blue-500">In Progress</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Location */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Current Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Processing Lab A</p>
                      <p className="text-sm text-gray-600">Sectioning Station 3</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Thermometer className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">-20°C</p>
                      <p className="text-sm text-gray-600">Storage Temperature</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">3 Blocks, 15 Slides</p>
                      <p className="text-sm text-gray-600">Prepared Materials</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quality Indicators */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quality Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {qualityIndicators.map((indicator, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{indicator.metric}</p>
                        <p className="text-xs text-gray-600">{indicator.value}</p>
                      </div>
                      <Badge variant="outline" className={`text-xs ${
                        indicator.color === 'green' ? 'border-green-500 text-green-700' : 'border-gray-500 text-gray-700'
                      }`}>
                        {indicator.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chain of Custody */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Chain of Custody</CardTitle>
              <CardDescription className="text-xs">Complete audit trail of specimen handling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 border-l-4 border-l-green-500 bg-green-50">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Specimen Received</p>
                      <p className="text-xs text-gray-600">Accessioning - Lab Tech: Sarah Johnson</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">14:30</span>
                </div>
                <div className="flex items-center justify-between p-2 border-l-4 border-l-green-500 bg-green-50">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Grossing Complete</p>
                      <p className="text-xs text-gray-600">Pathologist Assistant: Dr. Mike Davis</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">15:15</span>
                </div>
                <div className="flex items-center justify-between p-2 border-l-4 border-l-blue-500 bg-blue-50">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Currently Sectioning</p>
                      <p className="text-xs text-gray-600">Histotech: Jennifer Lee</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">In Progress</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
