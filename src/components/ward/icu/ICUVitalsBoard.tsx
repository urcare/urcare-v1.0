
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Monitor, Heart, Activity, Thermometer, Wind, Zap } from 'lucide-react';

interface VitalSigns {
  patientId: string;
  patientName: string;
  room: string;
  heartRate: number;
  bloodPressure: { systolic: number; diastolic: number };
  oxygenSaturation: number;
  temperature: number;
  respiratoryRate: number;
  ecg: string;
  status: 'normal' | 'warning' | 'critical';
  lastUpdate: Date;
}

const mockVitals: VitalSigns[] = [
  {
    patientId: 'ICU001',
    patientName: 'Sarah Johnson',
    room: 'ICU-A1',
    heartRate: 125,
    bloodPressure: { systolic: 90, diastolic: 60 },
    oxygenSaturation: 88,
    temperature: 38.9,
    respiratoryRate: 28,
    ecg: 'Irregular rhythm detected',
    status: 'critical',
    lastUpdate: new Date()
  },
  {
    patientId: 'ICU002',
    patientName: 'Michael Chen',
    room: 'ICU-B3',
    heartRate: 88,
    bloodPressure: { systolic: 110, diastolic: 70 },
    oxygenSaturation: 95,
    temperature: 37.2,
    respiratoryRate: 18,
    ecg: 'Normal sinus rhythm',
    status: 'normal',
    lastUpdate: new Date()
  },
  {
    patientId: 'ICU003',
    patientName: 'Emma Davis',
    room: 'ICU-C2',
    heartRate: 105,
    bloodPressure: { systolic: 140, diastolic: 95 },
    oxygenSaturation: 92,
    temperature: 38.1,
    respiratoryRate: 22,
    ecg: 'Slight tachycardia',
    status: 'warning',
    lastUpdate: new Date()
  }
];

export const ICUVitalsBoard = () => {
  const [vitals, setVitals] = useState<VitalSigns[]>(mockVitals);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setVitals(prev => prev.map(vital => ({
        ...vital,
        heartRate: vital.heartRate + Math.floor(Math.random() * 6) - 3,
        oxygenSaturation: Math.max(85, Math.min(100, vital.oxygenSaturation + Math.floor(Math.random() * 4) - 2)),
        lastUpdate: new Date()
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-600 text-white';
      case 'warning': return 'bg-yellow-500 text-white';
      case 'normal': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getVitalColor = (vital: string, value: number) => {
    switch (vital) {
      case 'heartRate':
        if (value < 60 || value > 100) return 'text-red-600';
        if (value < 70 || value > 90) return 'text-yellow-600';
        return 'text-green-600';
      case 'oxygenSat':
        if (value < 90) return 'text-red-600';
        if (value < 95) return 'text-yellow-600';
        return 'text-green-600';
      case 'temperature':
        if (value < 36 || value > 38) return 'text-red-600';
        if (value < 36.5 || value > 37.5) return 'text-yellow-600';
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              <CardTitle>Real-Time ICU Vitals Board</CardTitle>
              {isLive && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600">LIVE</span>
                </div>
              )}
            </div>
            <Button
              size="sm"
              variant={isLive ? "destructive" : "default"}
              onClick={() => setIsLive(!isLive)}
            >
              {isLive ? 'Stop Live' : 'Start Live'}
            </Button>
          </div>
          <CardDescription>
            Continuous monitoring of critical patient vitals with real-time updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {vitals.map((patient) => (
              <Card key={patient.patientId} className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{patient.patientName}</h3>
                      <Badge variant="outline">{patient.room}</Badge>
                      <Badge className={getStatusColor(patient.status)}>
                        {patient.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Last update: {patient.lastUpdate.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                    <Card className="p-4 text-center">
                      <Heart className={`h-6 w-6 mx-auto mb-2 ${getVitalColor('heartRate', patient.heartRate)}`} />
                      <p className="text-xs text-gray-500 mb-1">Heart Rate</p>
                      <p className={`text-xl font-bold ${getVitalColor('heartRate', patient.heartRate)}`}>
                        {patient.heartRate}
                      </p>
                      <p className="text-xs text-gray-400">bpm</p>
                    </Card>

                    <Card className="p-4 text-center">
                      <Activity className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <p className="text-xs text-gray-500 mb-1">Blood Pressure</p>
                      <p className="text-xl font-bold text-blue-600">
                        {patient.bloodPressure.systolic}/{patient.bloodPressure.diastolic}
                      </p>
                      <p className="text-xs text-gray-400">mmHg</p>
                    </Card>

                    <Card className="p-4 text-center">
                      <Wind className={`h-6 w-6 mx-auto mb-2 ${getVitalColor('oxygenSat', patient.oxygenSaturation)}`} />
                      <p className="text-xs text-gray-500 mb-1">O2 Saturation</p>
                      <p className={`text-xl font-bold ${getVitalColor('oxygenSat', patient.oxygenSaturation)}`}>
                        {patient.oxygenSaturation}
                      </p>
                      <p className="text-xs text-gray-400">%</p>
                    </Card>

                    <Card className="p-4 text-center">
                      <Thermometer className={`h-6 w-6 mx-auto mb-2 ${getVitalColor('temperature', patient.temperature)}`} />
                      <p className="text-xs text-gray-500 mb-1">Temperature</p>
                      <p className={`text-xl font-bold ${getVitalColor('temperature', patient.temperature)}`}>
                        {patient.temperature}
                      </p>
                      <p className="text-xs text-gray-400">°C</p>
                    </Card>

                    <Card className="p-4 text-center">
                      <Activity className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                      <p className="text-xs text-gray-500 mb-1">Respiratory Rate</p>
                      <p className="text-xl font-bold text-purple-600">
                        {patient.respiratoryRate}
                      </p>
                      <p className="text-xs text-gray-400">breaths/min</p>
                    </Card>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium">ECG Status:</span>
                    </div>
                    <p className="text-sm">{patient.ecg}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View History
                    </Button>
                    <Button size="sm" variant="outline">
                      Set Alerts
                    </Button>
                    <Button size="sm" variant="outline">
                      Export Data
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
