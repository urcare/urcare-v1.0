
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Pill,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity,
  Thermometer,
  Heart
} from 'lucide-react';

export const ChemotherapyManagement = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [sideEffectSeverity, setSideEffectSeverity] = useState({
    nausea: 2,
    fatigue: 3,
    neuropathy: 1,
    mucositis: 2,
    neutropenia: 1
  });

  const chemotherapySchedules = [
    {
      id: 1,
      patientName: 'Sarah Johnson',
      protocol: 'AC-T Protocol',
      cycle: '2 of 8',
      nextSession: '2024-01-25 09:00',
      drugs: ['Doxorubicin', 'Cyclophosphamide'],
      duration: '4 hours',
      premedications: ['Ondansetron', 'Dexamethasone'],
      status: 'scheduled'
    },
    {
      id: 2,
      patientName: 'Michael Chen',
      protocol: 'Carboplatin + Pemetrexed',
      cycle: '3 of 6',
      nextSession: '2024-01-26 10:30',
      drugs: ['Carboplatin', 'Pemetrexed'],
      duration: '3 hours',
      premedications: ['Ondansetron', 'Famotidine'],
      status: 'in-progress'
    },
    {
      id: 3,
      patientName: 'Maria Rodriguez',
      protocol: 'FOLFOX',
      cycle: '4 of 12',
      nextSession: '2024-01-27 08:00',
      drugs: ['5-FU', 'Leucovorin', 'Oxaliplatin'],
      duration: '6 hours',
      premedications: ['Ondansetron', 'Dexamethasone'],
      status: 'scheduled'
    }
  ];

  const sideEffectMonitoring = [
    {
      id: 1,
      patientName: 'Sarah Johnson',
      lastAssessment: '2024-01-22',
      sideEffects: {
        nausea: { severity: 2, trend: 'stable' },
        fatigue: { severity: 3, trend: 'improving' },
        neuropathy: { severity: 1, trend: 'stable' },
        neutropenia: { severity: 0, trend: 'stable' }
      },
      interventions: ['Anti-emetic protocol', 'Energy conservation'],
      nextAssessment: '2024-01-25'
    },
    {
      id: 2,
      patientName: 'Michael Chen',
      lastAssessment: '2024-01-23',
      sideEffects: {
        nausea: { severity: 1, trend: 'improving' },
        fatigue: { severity: 4, trend: 'worsening' },
        mucositis: { severity: 2, trend: 'stable' },
        neutropenia: { severity: 2, trend: 'monitoring' }
      },
      interventions: ['CBC monitoring', 'Mouth care protocol'],
      nextAssessment: '2024-01-26'
    }
  ];

  const administrationTracking = [
    {
      date: '2024-01-22',
      patient: 'Sarah Johnson',
      drugs: ['Doxorubicin 60mg/m²', 'Cyclophosphamide 600mg/m²'],
      startTime: '09:00',
      endTime: '13:30',
      nurse: 'RN Jennifer Adams',
      complications: 'None',
      status: 'completed'
    },
    {
      date: '2024-01-23',
      patient: 'Michael Chen',
      drugs: ['Carboplatin AUC 6', 'Pemetrexed 500mg/m²'],
      startTime: '10:30',
      endTime: '14:00',
      nurse: 'RN Maria Santos',
      complications: 'Mild infusion reaction - resolved',
      status: 'completed'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 0: return 'bg-green-100 text-green-800';
      case 1: return 'bg-yellow-100 text-yellow-800';
      case 2: return 'bg-orange-100 text-orange-800';
      case 3: return 'bg-red-100 text-red-800';
      case 4: return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'improving': return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'worsening': return <AlertTriangle className="h-3 w-3 text-red-500" />;
      case 'stable': return <Activity className="h-3 w-3 text-blue-500" />;
      default: return <Clock className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Chemotherapy Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Chemotherapy Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chemotherapySchedules.map((schedule) => (
              <Card key={schedule.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <h3 className="font-medium">{schedule.patientName}</h3>
                      <p className="text-sm text-gray-600">{schedule.protocol}</p>
                      <p className="text-sm text-gray-600">Cycle {schedule.cycle}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{schedule.nextSession}</span>
                      </div>
                      <p className="text-sm text-gray-600">Duration: {schedule.duration}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Drugs:</h4>
                      <div className="space-y-1">
                        {schedule.drugs.map((drug, index) => (
                          <Badge key={index} variant="outline" className="text-xs mr-1">
                            {drug}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(schedule.status)}>
                        {schedule.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Side Effect Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5" />
            Side Effect Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sideEffectMonitoring.map((patient) => (
              <Card key={patient.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{patient.patientName}</CardTitle>
                  <p className="text-sm text-gray-600">Last assessment: {patient.lastAssessment}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Side Effects (CTCAE Grading):</h4>
                      <div className="space-y-3">
                        {Object.entries(patient.sideEffects).map(([effect, data]) => (
                          <div key={effect} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm capitalize">{effect}</span>
                              {getTrendIcon(data.trend)}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getSeverityColor(data.severity)}>
                                Grade {data.severity}
                              </Badge>
                              <span className="text-xs text-gray-500">{data.trend}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Active Interventions:</h4>
                      <div className="space-y-2">
                        {patient.interventions.map((intervention, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{intervention}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">Next assessment: {patient.nextAssessment}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Administration Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Recent Administration Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {administrationTracking.map((record, index) => (
              <Card key={index} className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <h3 className="font-medium">{record.patient}</h3>
                      <p className="text-sm text-gray-600">{record.date}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Drugs:</h4>
                      <div className="space-y-1">
                        {record.drugs.map((drug, drugIndex) => (
                          <p key={drugIndex} className="text-xs text-gray-600">{drug}</p>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm"><strong>Start:</strong> {record.startTime}</p>
                      <p className="text-sm"><strong>End:</strong> {record.endTime}</p>
                      <p className="text-sm"><strong>Nurse:</strong> {record.nurse}</p>
                    </div>
                    <div>
                      <p className="text-sm"><strong>Complications:</strong></p>
                      <p className="text-sm text-gray-600">{record.complications}</p>
                    </div>
                    <div className="flex items-center">
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chemotherapy Summary Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Chemotherapy Management Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {chemotherapySchedules.length}
              </div>
              <div className="text-sm text-gray-600">Scheduled Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {administrationTracking.filter(record => record.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {chemotherapySchedules.filter(schedule => schedule.status === 'in-progress').length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {sideEffectMonitoring.reduce((count, patient) => 
                  count + Object.values(patient.sideEffects).filter(effect => effect.severity >= 3).length, 0
                )}
              </div>
              <div className="text-sm text-gray-600">High-Grade Side Effects</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
