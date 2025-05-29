
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, TrendingUp, Clock, Activity, Thermometer } from 'lucide-react';

interface SepsisAlert {
  patientId: string;
  patientName: string;
  room: string;
  sepsisScore: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'severe';
  qSOFA: number;
  lactateLevel: number;
  whiteBloodCount: number;
  temperature: number;
  bloodPressure: string;
  heartRate: number;
  respiratoryRate: number;
  timeToSepsis: string;
  confidence: number;
  keyIndicators: string[];
  alertTriggered: boolean;
  lastUpdate: Date;
}

const mockSepsisAlerts: SepsisAlert[] = [
  {
    patientId: 'ICU001',
    patientName: 'Sarah Johnson',
    room: 'ICU-A1',
    sepsisScore: 88,
    riskLevel: 'severe',
    qSOFA: 3,
    lactateLevel: 4.2,
    whiteBloodCount: 15000,
    temperature: 39.1,
    bloodPressure: '85/55',
    heartRate: 125,
    respiratoryRate: 28,
    timeToSepsis: '2-4 hours',
    confidence: 94,
    keyIndicators: ['Elevated lactate', 'Hypotension', 'Tachycardia', 'Fever'],
    alertTriggered: true,
    lastUpdate: new Date()
  },
  {
    patientId: 'ICU003',
    patientName: 'Emma Davis',
    room: 'ICU-C2',
    sepsisScore: 65,
    riskLevel: 'high',
    qSOFA: 2,
    lactateLevel: 2.8,
    whiteBloodCount: 12000,
    temperature: 38.4,
    bloodPressure: '95/65',
    heartRate: 110,
    respiratoryRate: 24,
    timeToSepsis: '6-8 hours',
    confidence: 82,
    keyIndicators: ['Rising lactate', 'Mild hypotension', 'Leukocytosis'],
    alertTriggered: false,
    lastUpdate: new Date()
  }
];

export const SepsisAlertEngine = () => {
  const [alerts, setAlerts] = useState<SepsisAlert[]>(mockSepsisAlerts);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'severe': return 'bg-red-600 text-white animate-pulse';
      case 'high': return 'bg-red-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Sepsis Alert Engine
          </CardTitle>
          <CardDescription>
            AI-powered early sepsis detection with qSOFA scoring and biomarker analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">1</p>
                  <p className="text-sm text-gray-600">Severe Risk</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">1</p>
                  <p className="text-sm text-gray-600">High Risk</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Activity className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">3</p>
                  <p className="text-sm text-gray-600">Monitoring</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">18</p>
                  <p className="text-sm text-gray-600">Low Risk</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.patientId} className={`border-l-4 ${alert.riskLevel === 'severe' ? 'border-l-red-600' : alert.riskLevel === 'high' ? 'border-l-red-400' : 'border-l-yellow-400'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{alert.patientName}</h3>
                      <Badge variant="outline">{alert.room}</Badge>
                      <Badge className={getRiskColor(alert.riskLevel)}>
                        {alert.riskLevel.toUpperCase()} RISK
                      </Badge>
                      {alert.alertTriggered && (
                        <Badge className="bg-red-600 text-white animate-pulse">
                          ALERT TRIGGERED
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Updated: {alert.lastUpdate.toLocaleTimeString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Sepsis Score</span>
                          <span className={`text-sm font-bold ${getScoreColor(alert.sepsisScore)}`}>{alert.sepsisScore}%</span>
                        </div>
                        <Progress value={alert.sepsisScore} className="h-3" />
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">AI Confidence</span>
                          <span className="text-sm">{alert.confidence}%</span>
                        </div>
                        <Progress value={alert.confidence} className="h-2" />
                      </div>

                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-blue-800">Time to Sepsis</span>
                        </div>
                        <p className="text-sm text-blue-700">{alert.timeToSepsis}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 border rounded-lg">
                          <p className="text-xs text-gray-500">qSOFA Score</p>
                          <p className="text-lg font-bold text-red-600">{alert.qSOFA}/3</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <p className="text-xs text-gray-500">Lactate</p>
                          <p className="text-lg font-bold">{alert.lactateLevel} mmol/L</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <p className="text-xs text-gray-500">WBC Count</p>
                          <p className="text-lg font-bold">{alert.whiteBloodCount.toLocaleString()}</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <p className="text-xs text-gray-500">Temperature</p>
                          <p className="text-lg font-bold">{alert.temperature}°C</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-1 gap-3">
                        <div className="p-3 border rounded-lg">
                          <p className="text-xs text-gray-500">Blood Pressure</p>
                          <p className="text-lg font-bold">{alert.bloodPressure} mmHg</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <p className="text-xs text-gray-500">Heart Rate</p>
                          <p className="text-lg font-bold">{alert.heartRate} bpm</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <p className="text-xs text-gray-500">Respiratory Rate</p>
                          <p className="text-lg font-bold">{alert.respiratoryRate} /min</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Key Risk Indicators:</h4>
                    <div className="flex flex-wrap gap-2">
                      {alert.keyIndicators.map((indicator, index) => (
                        <Badge key={index} variant="outline" className="text-red-600 border-red-300">
                          {indicator}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {alert.riskLevel === 'severe' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="destructive">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Emergency Protocol
                      </Button>
                      <Button size="sm" variant="outline">
                        Order Lactate
                      </Button>
                      <Button size="sm" variant="outline">
                        Blood Cultures
                      </Button>
                      <Button size="sm" variant="outline">
                        Antibiotics
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
