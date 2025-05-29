
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Timer, AlertTriangle, Activity, CheckCircle, Zap, Clock } from 'lucide-react';

interface DeteriorationAlert {
  patientId: string;
  patientName: string;
  room: string;
  alertStartTime: Date;
  timeElapsed: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  deteriorationScore: number;
  interventionsNeeded: string[];
  completedInterventions: string[];
  vitals: {
    heartRate: number;
    bloodPressure: { systolic: number; diastolic: number };
    oxygenSaturation: number;
    temperature: number;
    respiratoryRate: number;
  };
  trends: {
    heartRate: 'stable' | 'increasing' | 'decreasing';
    bloodPressure: 'stable' | 'increasing' | 'decreasing';
    oxygenSaturation: 'stable' | 'increasing' | 'decreasing';
  };
  nextScheduledCheck: Date;
  responseTeam: string[];
}

const mockAlerts: DeteriorationAlert[] = [
  {
    patientId: 'ICU001',
    patientName: 'Sarah Johnson',
    room: 'ICU-A1',
    alertStartTime: new Date(Date.now() - 1800000), // 30 minutes ago
    timeElapsed: 30,
    riskLevel: 'critical',
    deteriorationScore: 85,
    interventionsNeeded: [
      'Increase oxygen therapy',
      'Administer bronchodilator',
      'Consider intubation',
      'Blood gas analysis',
      'Chest X-ray'
    ],
    completedInterventions: [
      'Increased O2 to 15L',
      'Albuterol nebulizer given'
    ],
    vitals: {
      heartRate: 125,
      bloodPressure: { systolic: 90, diastolic: 60 },
      oxygenSaturation: 88,
      temperature: 38.9,
      respiratoryRate: 28
    },
    trends: {
      heartRate: 'increasing',
      bloodPressure: 'decreasing',
      oxygenSaturation: 'decreasing'
    },
    nextScheduledCheck: new Date(Date.now() + 600000), // 10 minutes
    responseTeam: ['Dr. Wilson', 'Nurse Smith', 'Respiratory Therapist']
  },
  {
    patientId: 'ICU003',
    patientName: 'Emma Davis',
    room: 'ICU-C1',
    alertStartTime: new Date(Date.now() - 900000), // 15 minutes ago
    timeElapsed: 15,
    riskLevel: 'moderate',
    deteriorationScore: 65,
    interventionsNeeded: [
      'Increase monitoring frequency',
      'Pain assessment',
      'Blood pressure medication',
      'IV fluid bolus'
    ],
    completedInterventions: [
      'Vitals q15min',
      'Pain scale assessed'
    ],
    vitals: {
      heartRate: 105,
      bloodPressure: { systolic: 140, diastolic: 95 },
      oxygenSaturation: 92,
      temperature: 38.1,
      respiratoryRate: 22
    },
    trends: {
      heartRate: 'stable',
      bloodPressure: 'increasing',
      oxygenSaturation: 'stable'
    },
    nextScheduledCheck: new Date(Date.now() + 900000), // 15 minutes
    responseTeam: ['Dr. Chen', 'Nurse Johnson']
  }
];

export const RapidDeteriorationTimer = () => {
  const [alerts, setAlerts] = useState<DeteriorationAlert[]>(mockAlerts);

  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts(prev => prev.map(alert => ({
        ...alert,
        timeElapsed: Math.floor((Date.now() - alert.alertStartTime.getTime()) / 60000)
      })));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-600 text-white animate-pulse';
      case 'high': return 'bg-red-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <span className="text-red-600">↗</span>;
      case 'decreasing': return <span className="text-blue-600">↘</span>;
      case 'stable': return <span className="text-green-600">→</span>;
      default: return <span className="text-gray-600">-</span>;
    }
  };

  const getTimeToCheck = (nextCheck: Date) => {
    const minutes = Math.floor((nextCheck.getTime() - Date.now()) / 60000);
    if (minutes <= 0) return 'Overdue';
    return `${minutes} min`;
  };

  const handleCompleteIntervention = (patientId: string, intervention: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.patientId === patientId 
        ? {
            ...alert,
            completedInterventions: [...alert.completedInterventions, intervention],
            interventionsNeeded: alert.interventionsNeeded.filter(i => i !== intervention)
          }
        : alert
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Rapid Deterioration Timer & Interventions
          </CardTitle>
          <CardDescription>
            Real-time monitoring with intervention tracking for patients showing signs of deterioration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">2</p>
                  <p className="text-sm text-gray-600">Active Alerts</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-2">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">22</p>
                  <p className="text-sm text-gray-600">Avg Response (min)</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">4</p>
                  <p className="text-sm text-gray-600">Interventions Done</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Zap className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">7</p>
                  <p className="text-sm text-gray-600">Pending Actions</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            {alerts.map((alert) => (
              <Card key={alert.patientId} className={`border-l-4 ${alert.riskLevel === 'critical' ? 'border-l-red-600' : alert.riskLevel === 'high' ? 'border-l-orange-400' : 'border-l-yellow-400'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{alert.patientName}</h3>
                      <Badge variant="outline">{alert.room}</Badge>
                      <Badge className={getRiskColor(alert.riskLevel)}>
                        {alert.riskLevel.toUpperCase()} RISK
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Timer className="h-4 w-4" />
                        {alert.timeElapsed} min elapsed
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Score: {alert.deteriorationScore}/100</p>
                      <p className="text-sm text-gray-500">Next check: {getTimeToCheck(alert.nextScheduledCheck)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Current Vitals & Trends</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Heart Rate:</span>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{alert.vitals.heartRate} bpm</span>
                            {getTrendIcon(alert.trends.heartRate)}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">BP:</span>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{alert.vitals.bloodPressure.systolic}/{alert.vitals.bloodPressure.diastolic}</span>
                            {getTrendIcon(alert.trends.bloodPressure)}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">O2 Sat:</span>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{alert.vitals.oxygenSaturation}%</span>
                            {getTrendIcon(alert.trends.oxygenSaturation)}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Temp:</span>
                          <span className="font-medium">{alert.vitals.temperature}°C</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Resp Rate:</span>
                          <span className="font-medium">{alert.vitals.respiratoryRate}/min</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Response Team</h4>
                      <div className="space-y-2">
                        {alert.responseTeam.map((member, index) => (
                          <div key={index} className="text-sm p-2 bg-blue-50 rounded flex items-center gap-2">
                            <Activity className="h-3 w-3 text-blue-600" />
                            {member}
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Deterioration Progress</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Risk Score</span>
                            <span className="font-medium">{alert.deteriorationScore}/100</span>
                          </div>
                          <Progress value={alert.deteriorationScore} className="h-3" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Time Elapsed</span>
                            <span className="font-medium">{alert.timeElapsed} min</span>
                          </div>
                          <Progress value={Math.min(100, (alert.timeElapsed / 60) * 100)} className="h-3" />
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 text-red-600">Interventions Needed</h4>
                      <div className="space-y-2">
                        {alert.interventionsNeeded.map((intervention, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">{intervention}</span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleCompleteIntervention(alert.patientId, intervention)}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Done
                            </Button>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3 text-green-600">Completed Interventions</h4>
                      <div className="space-y-2">
                        {alert.completedInterventions.map((intervention, index) => (
                          <div key={index} className="text-sm p-2 bg-green-50 rounded flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            {intervention}
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="default">
                      <Zap className="h-4 w-4 mr-1" />
                      Emergency Response
                    </Button>
                    <Button size="sm" variant="outline">
                      <Timer className="h-4 w-4 mr-1" />
                      Update Timeline
                    </Button>
                    <Button size="sm" variant="outline">
                      Call Team
                    </Button>
                    <Button size="sm" variant="outline">
                      Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
