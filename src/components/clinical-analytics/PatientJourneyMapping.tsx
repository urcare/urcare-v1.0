
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Clock, 
  User, 
  ArrowRight,
  Bed,
  Stethoscope,
  FileText,
  Home
} from 'lucide-react';

interface JourneyStep {
  id: string;
  location: string;
  activity: string;
  startTime: string;
  duration: number;
  status: 'completed' | 'current' | 'scheduled';
  provider?: string;
  notes?: string;
}

interface PatientJourney {
  patientId: string;
  patientName: string;
  admissionDate: string;
  diagnosis: string;
  currentLocation: string;
  steps: JourneyStep[];
  estimatedDischarge: string;
}

const mockJourneys: PatientJourney[] = [
  {
    patientId: 'P001',
    patientName: 'John Smith',
    admissionDate: '2024-01-15',
    diagnosis: 'Acute Myocardial Infarction',
    currentLocation: 'Cardiac ICU',
    estimatedDischarge: '2024-01-22',
    steps: [
      {
        id: '1',
        location: 'Emergency Department',
        activity: 'Initial Assessment',
        startTime: '08:30',
        duration: 45,
        status: 'completed',
        provider: 'Dr. Johnson',
        notes: 'Chest pain evaluation, ECG completed'
      },
      {
        id: '2',
        location: 'Cardiac Cath Lab',
        activity: 'Emergency PCI',
        startTime: '09:45',
        duration: 120,
        status: 'completed',
        provider: 'Dr. Wilson',
        notes: 'Successful stent placement'
      },
      {
        id: '3',
        location: 'Cardiac ICU',
        activity: 'Post-procedure Monitoring',
        startTime: '12:15',
        duration: 1440,
        status: 'current',
        provider: 'ICU Team',
        notes: 'Stable condition, monitoring cardiac enzymes'
      },
      {
        id: '4',
        location: 'Cardiac Step-down',
        activity: 'Recovery Phase',
        startTime: '12:15',
        duration: 2880,
        status: 'scheduled',
        provider: 'Dr. Chen',
        notes: 'Cardiac rehabilitation planning'
      },
      {
        id: '5',
        location: 'Discharge',
        activity: 'Discharge Planning',
        startTime: '10:00',
        duration: 60,
        status: 'scheduled',
        provider: 'Discharge Team',
        notes: 'Home care instructions, follow-up appointments'
      }
    ]
  },
  {
    patientId: 'P002',
    patientName: 'Sarah Davis',
    admissionDate: '2024-01-16',
    diagnosis: 'Pneumonia',
    currentLocation: 'Medical Ward',
    estimatedDischarge: '2024-01-20',
    steps: [
      {
        id: '1',
        location: 'Emergency Department',
        activity: 'Triage & Assessment',
        startTime: '14:20',
        duration: 60,
        status: 'completed',
        provider: 'Dr. Brown',
        notes: 'Respiratory distress, chest X-ray ordered'
      },
      {
        id: '2',
        location: 'Radiology',
        activity: 'Chest X-ray',
        startTime: '15:30',
        duration: 30,
        status: 'completed',
        provider: 'Radiology Tech',
        notes: 'Bilateral infiltrates confirmed'
      },
      {
        id: '3',
        location: 'Medical Ward',
        activity: 'Antibiotic Treatment',
        startTime: '16:15',
        duration: 4320,
        status: 'current',
        provider: 'Dr. Martinez',
        notes: 'IV antibiotics, oxygen support'
      },
      {
        id: '4',
        location: 'Discharge',
        activity: 'Discharge Planning',
        startTime: '11:00',
        duration: 45,
        status: 'scheduled',
        provider: 'Discharge Team',
        notes: 'Oral antibiotics, outpatient follow-up'
      }
    ]
  }
];

export const PatientJourneyMapping = () => {
  const [selectedJourney, setSelectedJourney] = useState<PatientJourney>(mockJourneys[0]);

  const getLocationIcon = (location: string) => {
    if (location.includes('Emergency')) return <MapPin className="h-4 w-4 text-red-500" />;
    if (location.includes('ICU')) return <Bed className="h-4 w-4 text-orange-500" />;
    if (location.includes('Ward')) return <Bed className="h-4 w-4 text-blue-500" />;
    if (location.includes('Lab')) return <Stethoscope className="h-4 w-4 text-purple-500" />;
    if (location.includes('Radiology')) return <FileText className="h-4 w-4 text-green-500" />;
    if (location.includes('Discharge')) return <Home className="h-4 w-4 text-gray-500" />;
    return <MapPin className="h-4 w-4 text-gray-500" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'current':
        return 'bg-blue-500';
      case 'scheduled':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 text-white">Completed</Badge>;
      case 'current':
        return <Badge className="bg-blue-500 text-white">Current</Badge>;
      case 'scheduled':
        return <Badge variant="outline">Scheduled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    if (minutes < 1440) return `${Math.round(minutes / 60)}h`;
    return `${Math.round(minutes / 1440)}d`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-6 w-6 text-blue-600" />
          Patient Journey Mapping
        </CardTitle>
        <CardDescription>Real-time patient journey tracking and care coordination</CardDescription>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {mockJourneys.map((journey) => (
            <Button
              key={journey.patientId}
              variant={selectedJourney.patientId === journey.patientId ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedJourney(journey)}
            >
              {journey.patientName}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-blue-700 font-medium">Patient</p>
              <p className="text-lg font-bold text-blue-800">{selectedJourney.patientName}</p>
              <p className="text-sm text-blue-600">ID: {selectedJourney.patientId}</p>
            </div>
            <div>
              <p className="text-sm text-blue-700 font-medium">Diagnosis</p>
              <p className="text-sm font-medium text-blue-800">{selectedJourney.diagnosis}</p>
            </div>
            <div>
              <p className="text-sm text-blue-700 font-medium">Current Location</p>
              <p className="text-sm font-medium text-blue-800">{selectedJourney.currentLocation}</p>
            </div>
            <div>
              <p className="text-sm text-blue-700 font-medium">Est. Discharge</p>
              <p className="text-sm font-medium text-blue-800">
                {new Date(selectedJourney.estimatedDischarge).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Journey Timeline</h3>
          
          <div className="space-y-3">
            {selectedJourney.steps.map((step, index) => (
              <div key={step.id} className="relative">
                <div className="flex items-start gap-4 p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow">
                  <div className="flex flex-col items-center pt-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-200 bg-white">
                      {getLocationIcon(step.location)}
                    </div>
                    {index < selectedJourney.steps.length - 1 && (
                      <div className={`w-0.5 h-12 mt-2 ${getStatusColor(step.status)}`}></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{step.activity}</h4>
                        <p className="text-sm text-gray-600">{step.location}</p>
                      </div>
                      {getStatusBadge(step.status)}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{step.startTime}</span>
                      </div>
                      <span>Duration: {formatDuration(step.duration)}</span>
                      {step.provider && (
                        <span>Provider: {step.provider}</span>
                      )}
                    </div>
                    
                    {step.notes && (
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        {step.notes}
                      </p>
                    )}
                  </div>
                  
                  {index < selectedJourney.steps.length - 1 && step.status === 'completed' && (
                    <ArrowRight className="h-4 w-4 text-green-500 flex-shrink-0 mt-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Journey Progress</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completed Steps</span>
                <span className="font-medium">
                  {selectedJourney.steps.filter(s => s.status === 'completed').length}/{selectedJourney.steps.length}
                </span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(selectedJourney.steps.filter(s => s.status === 'completed').length / selectedJourney.steps.length) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">Care Team Coordination</h4>
            <div className="text-sm space-y-1">
              <p>Active providers: 3</p>
              <p>Pending consultations: 1</p>
              <p>Discharge coordinator assigned</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
