
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Shield
} from 'lucide-react';

export const SurvivorshipCarePlanning = () => {
  const [selectedSurvivor, setSelectedSurvivor] = useState(null);
  const [wellnessProgress, setWellnessProgress] = useState({
    physicalActivity: 75,
    nutrition: 80,
    mentalHealth: 65,
    socialSupport: 70,
    followUpCompliance: 90,
    selfAdvocacy: 85
  });

  const survivorshipPlans = [
    {
      id: 1,
      patientName: 'Jennifer Martinez',
      cancerType: 'Breast Cancer',
      treatmentCompleted: '2023-08-15',
      survivalTime: '5 months',
      riskLevel: 'low',
      nextAppointment: '2024-02-15',
      plannedVisits: ['Oncology', 'Cardiology', 'Mammography'],
      lateEffects: ['Fatigue', 'Cognitive changes'],
      wellnessGoals: ['Exercise 150min/week', 'Meditation daily']
    },
    {
      id: 2,
      patientName: 'Robert Thompson',
      cancerType: 'Colon Cancer',
      treatmentCompleted: '2022-12-20',
      survivalTime: '13 months',
      riskLevel: 'moderate',
      nextAppointment: '2024-01-30',
      plannedVisits: ['Oncology', 'Gastroenterology', 'CEA levels'],
      lateEffects: ['Neuropathy', 'Bowel changes'],
      wellnessGoals: ['Dietary counseling', 'Physical therapy']
    },
    {
      id: 3,
      patientName: 'Lisa Chen',
      cancerType: 'Lymphoma',
      treatmentCompleted: '2021-06-10',
      survivalTime: '2.5 years',
      riskLevel: 'low',
      nextAppointment: '2024-03-10',
      plannedVisits: ['Oncology', 'PET scan', 'Pulmonary function'],
      lateEffects: ['Lung fibrosis risk', 'Secondary cancer screening'],
      wellnessGoals: ['Smoking cessation support', 'Lung health monitoring']
    }
  ];

  const lateEffectMonitoring = [
    {
      id: 1,
      effectType: 'Cardiotoxicity',
      riskLevel: 'high',
      monitoringProtocol: 'Echocardiogram every 6 months',
      lastAssessment: '2024-01-15',
      nextDue: '2024-07-15',
      status: 'current',
      findings: 'Normal LVEF 60%'
    },
    {
      id: 2,
      effectType: 'Secondary Cancers',
      riskLevel: 'moderate',
      monitoringProtocol: 'Annual screening mammography + colonoscopy',
      lastAssessment: '2023-11-20',
      nextDue: '2024-11-20',
      status: 'upcoming',
      findings: 'No abnormalities detected'
    },
    {
      id: 3,
      effectType: 'Cognitive Changes',
      riskLevel: 'low',
      monitoringProtocol: 'Cognitive assessment annually',
      lastAssessment: '2024-01-10',
      nextDue: '2025-01-10',
      status: 'current',
      findings: 'Mild attention difficulties'
    }
  ];

  const wellnessPrograms = [
    {
      id: 1,
      name: 'Cancer Survivor Fitness Program',
      type: 'Physical Activity',
      duration: '12 weeks',
      participants: 24,
      nextSession: '2024-01-26 10:00',
      instructor: 'Sarah Johnson, Exercise Physiologist'
    },
    {
      id: 2,
      name: 'Mindfulness & Meditation',
      type: 'Mental Health',
      duration: '8 weeks',
      participants: 18,
      nextSession: '2024-01-27 14:00',
      instructor: 'Dr. Michael Brown, Psychologist'
    },
    {
      id: 3,
      name: 'Nutrition for Survivors',
      type: 'Nutrition',
      duration: '6 weeks',
      participants: 15,
      nextSession: '2024-01-28 11:00',
      instructor: 'Lisa Davis, Registered Dietitian'
    }
  ];

  const getRiskColor = (level) => {
    switch(level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'current': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateWellnessProgress = (area) => {
    const newProgress = Math.min(100, wellnessProgress[area] + 10);
    setWellnessProgress(prev => ({
      ...prev,
      [area]: newProgress
    }));
  };

  return (
    <div className="space-y-6">
      {/* Survivorship Care Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Active Survivorship Care Plans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {survivorshipPlans.map((plan) => (
              <Card 
                key={plan.id}
                className={`cursor-pointer transition-all hover:shadow-md ${selectedSurvivor?.id === plan.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedSurvivor(plan)}
              >
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <h3 className="font-medium">{plan.patientName}</h3>
                      <p className="text-sm text-gray-600">{plan.cancerType}</p>
                      <p className="text-sm text-gray-600">Survivor: {plan.survivalTime}</p>
                    </div>
                    <div>
                      <p className="text-sm">Treatment completed: {plan.treatmentCompleted}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span className="text-sm">Next: {plan.nextAppointment}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Planned Visits:</h4>
                      <div className="space-y-1">
                        {plan.plannedVisits.slice(0, 2).map((visit, index) => (
                          <Badge key={index} variant="outline" className="text-xs mr-1">
                            {visit}
                          </Badge>
                        ))}
                        {plan.plannedVisits.length > 2 && (
                          <p className="text-xs text-gray-500">+{plan.plannedVisits.length - 2} more</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={getRiskColor(plan.riskLevel)}>
                        {plan.riskLevel} risk
                      </Badge>
                      <Button size="sm" variant="outline">
                        View Plan
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Late Effects:</h4>
                        <div className="flex flex-wrap gap-1">
                          {plan.lateEffects.map((effect, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {effect}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Wellness Goals:</h4>
                        <div className="space-y-1">
                          {plan.wellnessGoals.map((goal, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span className="text-xs">{goal}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Late Effect Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Late Effect Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lateEffectMonitoring.map((monitoring) => (
              <Card key={monitoring.id}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <h3 className="font-medium">{monitoring.effectType}</h3>
                      <Badge className={getRiskColor(monitoring.riskLevel)}>
                        {monitoring.riskLevel} risk
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Protocol:</p>
                      <p className="text-sm text-gray-600">{monitoring.monitoringProtocol}</p>
                    </div>
                    <div>
                      <p className="text-sm">Last: {monitoring.lastAssessment}</p>
                      <p className="text-sm">Next: {monitoring.nextDue}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Findings:</p>
                      <p className="text-sm text-gray-600">{monitoring.findings}</p>
                    </div>
                    <div className="flex items-center">
                      <Badge className={getStatusColor(monitoring.status)}>
                        {monitoring.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Wellness Programs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Wellness Programs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {wellnessPrograms.map((program) => (
              <Card key={program.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-medium">{program.name}</h3>
                      <Badge variant="outline">{program.type}</Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm">Duration: {program.duration}</p>
                      <p className="text-sm">Participants: {program.participants}</p>
                      <p className="text-sm">Instructor: {program.instructor}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span className="text-sm">Next: {program.nextSession}</span>
                      </div>
                      <Button size="sm" className="w-full">
                        Enroll Patient
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Wellness Progress Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Wellness Progress Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(wellnessProgress).map(([area, progress]) => (
              <div key={area} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium capitalize">
                    {area.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{progress}%</span>
                    {progress >= 80 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : progress >= 60 ? (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => updateWellnessProgress(area)}
                >
                  Update Progress
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Survivorship Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Survivorship Care Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {survivorshipPlans.length}
              </div>
              <div className="text-sm text-gray-600">Active Survivors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {lateEffectMonitoring.filter(item => item.status === 'current').length}
              </div>
              <div className="text-sm text-gray-600">Current Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {wellnessPrograms.reduce((total, program) => total + program.participants, 0)}
              </div>
              <div className="text-sm text-gray-600">Program Participants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(Object.values(wellnessProgress).reduce((a, b) => a + b, 0) / Object.values(wellnessProgress).length)}%
              </div>
              <div className="text-sm text-gray-600">Avg Wellness Score</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
