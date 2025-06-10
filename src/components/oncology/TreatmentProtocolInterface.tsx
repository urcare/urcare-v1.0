
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity,
  Users,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  Zap
} from 'lucide-react';

export const TreatmentProtocolInterface = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [protocolProgress, setProtocolProgress] = useState({
    diagnosis: 100,
    staging: 85,
    treatmentPlan: 75,
    multidisciplinary: 90,
    patientConsent: 80,
    implementation: 60
  });

  const treatmentProtocols = [
    {
      id: 'breast-cancer-her2',
      name: 'Breast Cancer HER2+ Protocol',
      version: '2024.1',
      evidence: 'Level A',
      guidelines: 'NCCN 2024',
      phases: ['Neoadjuvant', 'Surgery', 'Adjuvant', 'Maintenance'],
      duration: '12 months',
      successRate: 92
    },
    {
      id: 'lung-nsclc-egfr',
      name: 'NSCLC EGFR+ Treatment',
      version: '2024.2',
      evidence: 'Level A',
      guidelines: 'ESMO 2024',
      phases: ['First-line TKI', 'Monitoring', 'Resistance Testing', 'Second-line'],
      duration: '18-24 months',
      successRate: 88
    },
    {
      id: 'colorectal-msi',
      name: 'Colorectal MSI-H Protocol',
      version: '2024.1',
      evidence: 'Level B',
      guidelines: 'ASCO 2024',
      phases: ['Immunotherapy', 'Assessment', 'Maintenance', 'Surveillance'],
      duration: '24 months',
      successRate: 85
    }
  ];

  const activePatients = [
    {
      id: 1,
      name: 'Sarah Johnson',
      age: 54,
      diagnosis: 'Breast Cancer Stage IIIA',
      protocol: 'Breast Cancer HER2+ Protocol',
      currentPhase: 'Neoadjuvant',
      startDate: '2024-01-15',
      progress: 45,
      nextAppointment: '2024-01-25',
      riskLevel: 'moderate'
    },
    {
      id: 2,
      name: 'Michael Chen',
      age: 67,
      diagnosis: 'NSCLC Stage IV',
      protocol: 'NSCLC EGFR+ Treatment',
      currentPhase: 'First-line TKI',
      startDate: '2024-01-08',
      progress: 30,
      nextAppointment: '2024-01-30',
      riskLevel: 'high'
    },
    {
      id: 3,
      name: 'Maria Rodriguez',
      age: 62,
      diagnosis: 'Colorectal Cancer Stage III',
      protocol: 'Colorectal MSI-H Protocol',
      currentPhase: 'Immunotherapy',
      startDate: '2024-01-20',
      progress: 25,
      nextAppointment: '2024-02-05',
      riskLevel: 'low'
    }
  ];

  const multidisciplinaryTeam = [
    { role: 'Medical Oncologist', name: 'Dr. Jennifer Smith', availability: 'Available' },
    { role: 'Radiation Oncologist', name: 'Dr. Robert Kumar', availability: 'Available' },
    { role: 'Surgical Oncologist', name: 'Dr. Lisa Wang', availability: 'In Surgery' },
    { role: 'Pathologist', name: 'Dr. Mark Johnson', availability: 'Available' },
    { role: 'Radiologist', name: 'Dr. Emily Brown', availability: 'Available' },
    { role: 'Pharmacist', name: 'Dr. David Lee', availability: 'Available' }
  ];

  const getRiskColor = (level) => {
    switch(level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (status) => {
    switch(status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'In Surgery': return 'bg-orange-100 text-orange-800';
      case 'Unavailable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateProtocolProgress = (area) => {
    const newProgress = Math.min(100, protocolProgress[area] + 15);
    setProtocolProgress(prev => ({
      ...prev,
      [area]: newProgress
    }));
  };

  return (
    <div className="space-y-6">
      {/* Evidence-Based Treatment Protocols */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Evidence-Based Treatment Protocols
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {treatmentProtocols.map((protocol) => (
              <Card key={protocol.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-medium">{protocol.name}</h3>
                      <p className="text-sm text-gray-600">Version {protocol.version}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Badge className="bg-blue-100 text-blue-800">
                          {protocol.evidence}
                        </Badge>
                        <span className="text-sm text-gray-600">{protocol.guidelines}</span>
                      </div>
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span>{protocol.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Success Rate:</span>
                          <span className="font-medium text-green-600">{protocol.successRate}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Treatment Phases:</h4>
                      <div className="flex flex-wrap gap-1">
                        {protocol.phases.map((phase, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {phase}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Patient Protocols */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Active Patient Treatment Plans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activePatients.map((patient) => (
              <Card 
                key={patient.id}
                className={`cursor-pointer transition-all hover:shadow-md ${selectedPatient?.id === patient.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedPatient(patient)}
              >
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <h3 className="font-medium">{patient.name}</h3>
                      <p className="text-sm text-gray-600">Age: {patient.age}</p>
                      <p className="text-sm text-gray-600">{patient.diagnosis}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{patient.protocol}</p>
                      <p className="text-sm text-gray-600">Current: {patient.currentPhase}</p>
                      <p className="text-sm text-gray-600">Started: {patient.startDate}</p>
                    </div>
                    <div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Progress</span>
                          <span className="text-sm font-medium">{patient.progress}%</span>
                        </div>
                        <Progress value={patient.progress} className="h-2" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Next: {patient.nextAppointment}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className={getRiskColor(patient.riskLevel)}>
                        {patient.riskLevel} risk
                      </Badge>
                      <Button size="sm" variant="outline">
                        View Plan
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Protocol Development Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Protocol Development Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(protocolProgress).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{value}%</span>
                      {value === 100 ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : value >= 75 ? (
                        <Zap className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <Progress value={value} className="h-2" />
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => updateProtocolProgress(key)}
                  >
                    Update Progress
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Multidisciplinary Team Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {multidisciplinaryTeam.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-gray-600">{member.role}</div>
                  </div>
                  <Badge className={getAvailabilityColor(member.availability)}>
                    {member.availability}
                  </Badge>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4">
              Schedule Team Meeting
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Treatment Protocol Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Treatment Protocol Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(Object.values(protocolProgress).reduce((a, b) => a + b, 0) / Object.values(protocolProgress).length)}%
              </div>
              <div className="text-sm text-gray-600">Overall Protocol Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {activePatients.length}
              </div>
              <div className="text-sm text-gray-600">Active Treatments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {treatmentProtocols.length}
              </div>
              <div className="text-sm text-gray-600">Available Protocols</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {multidisciplinaryTeam.filter(member => member.availability === 'Available').length}
              </div>
              <div className="text-sm text-gray-600">Available Specialists</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
