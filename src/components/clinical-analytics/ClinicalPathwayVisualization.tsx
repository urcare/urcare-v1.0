
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Users,
  MapPin
} from 'lucide-react';

interface PathwayStep {
  id: string;
  name: string;
  duration: number;
  compliance: number;
  status: 'completed' | 'in-progress' | 'delayed' | 'not-started';
  patients: number;
}

interface ClinicalPathway {
  id: string;
  name: string;
  description: string;
  totalPatients: number;
  avgDuration: number;
  completionRate: number;
  steps: PathwayStep[];
}

const mockPathways: ClinicalPathway[] = [
  {
    id: 'stroke',
    name: 'Acute Stroke Care',
    description: 'Evidence-based stroke care pathway',
    totalPatients: 45,
    avgDuration: 8.2,
    completionRate: 92,
    steps: [
      { id: '1', name: 'ED Arrival & Triage', duration: 15, compliance: 98, status: 'completed', patients: 45 },
      { id: '2', name: 'CT Scan', duration: 25, compliance: 95, status: 'completed', patients: 43 },
      { id: '3', name: 'Neurologist Consult', duration: 45, compliance: 89, status: 'in-progress', patients: 38 },
      { id: '4', name: 'Treatment Decision', duration: 60, compliance: 92, status: 'in-progress', patients: 35 },
      { id: '5', name: 'thrombolysis/Intervention', duration: 90, compliance: 87, status: 'not-started', patients: 32 },
      { id: '6', name: 'ICU Monitoring', duration: 480, compliance: 94, status: 'not-started', patients: 30 }
    ]
  },
  {
    id: 'sepsis',
    name: 'Sepsis Management',
    description: 'Sepsis-3 protocol implementation',
    totalPatients: 32,
    avgDuration: 6.5,
    completionRate: 88,
    steps: [
      { id: '1', name: 'Screening & Recognition', duration: 10, compliance: 96, status: 'completed', patients: 32 },
      { id: '2', name: 'Blood Cultures', duration: 30, compliance: 91, status: 'completed', patients: 31 },
      { id: '3', name: 'Antibiotic Administration', duration: 60, compliance: 85, status: 'in-progress', patients: 28 },
      { id: '4', name: 'Fluid Resuscitation', duration: 120, compliance: 89, status: 'in-progress', patients: 26 },
      { id: '5', name: 'Lactate Monitoring', duration: 180, compliance: 92, status: 'delayed', patients: 24 },
      { id: '6', name: 'Vasopressor Support', duration: 360, compliance: 88, status: 'not-started', patients: 18 }
    ]
  }
];

export const ClinicalPathwayVisualization = () => {
  const [selectedPathway, setSelectedPathway] = useState<ClinicalPathway>(mockPathways[0]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'delayed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'delayed':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 95) return 'text-green-600';
    if (compliance >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-purple-600" />
          Clinical Pathway Visualization
        </CardTitle>
        <CardDescription>Real-time pathway compliance and patient flow tracking</CardDescription>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {mockPathways.map((pathway) => (
            <Button
              key={pathway.id}
              variant={selectedPathway.id === pathway.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPathway(pathway)}
            >
              {pathway.name}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-800">Active Patients</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{selectedPathway.totalPatients}</p>
            <p className="text-sm text-blue-700">Currently in pathway</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">Avg Duration</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{selectedPathway.avgDuration}h</p>
            <p className="text-sm text-green-700">Average completion time</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-purple-800">Completion Rate</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{selectedPathway.completionRate}%</p>
            <p className="text-sm text-purple-700">Protocol adherence</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Pathway Steps</h3>
          
          <div className="relative">
            {selectedPathway.steps.map((step, index) => (
              <div key={step.id} className="relative">
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex flex-col items-center">
                      {getStatusIcon(step.status)}
                      {index < selectedPathway.steps.length - 1 && (
                        <div className={`w-0.5 h-8 mt-2 ${getStatusColor(step.status)}`}></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{step.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {step.patients} patients
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                        <span>Target: {step.duration} min</span>
                        <span className={`font-medium ${getComplianceColor(step.compliance)}`}>
                          {step.compliance}% compliance
                        </span>
                      </div>
                      
                      <Progress value={step.compliance} className="h-1.5" />
                    </div>
                  </div>
                  
                  {index < selectedPathway.steps.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  )}
                </div>
                
                {index < selectedPathway.steps.length - 1 && (
                  <div className="h-2"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Pathway Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 mb-1">Bottlenecks:</p>
              <p className="font-medium">Antibiotic administration timing needs improvement</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Recommendations:</p>
              <p className="font-medium">Implement automated alerts for time-sensitive steps</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
