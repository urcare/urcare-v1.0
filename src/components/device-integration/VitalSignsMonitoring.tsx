
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Heart, 
  Thermometer, 
  Gauge, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye,
  Settings
} from 'lucide-react';

export const VitalSignsMonitoring = () => {
  const [selectedPatient, setSelectedPatient] = useState('patient-1');

  const vitalSignsData = [
    {
      id: 'patient-1',
      name: 'John Smith',
      room: '201A',
      heartRate: { value: 78, trend: 'stable', normal: true },
      bloodPressure: { systolic: 120, diastolic: 80, trend: 'stable', normal: true },
      temperature: { value: 98.6, trend: 'up', normal: true },
      oxygenSat: { value: 98, trend: 'stable', normal: true },
      respiratoryRate: { value: 16, trend: 'stable', normal: true },
      status: 'stable',
      lastUpdate: '30 seconds ago'
    },
    {
      id: 'patient-2',
      name: 'Mary Johnson',
      room: 'ICU-3',
      heartRate: { value: 105, trend: 'up', normal: false },
      bloodPressure: { systolic: 145, diastolic: 95, trend: 'up', normal: false },
      temperature: { value: 101.2, trend: 'up', normal: false },
      oxygenSat: { value: 94, trend: 'down', normal: false },
      respiratoryRate: { value: 22, trend: 'up', normal: false },
      status: 'critical',
      lastUpdate: '15 seconds ago'
    },
    {
      id: 'patient-3',
      name: 'Robert Davis',
      room: '305B',
      heartRate: { value: 68, trend: 'stable', normal: true },
      bloodPressure: { systolic: 115, diastolic: 75, trend: 'stable', normal: true },
      temperature: { value: 98.4, trend: 'stable', normal: true },
      oxygenSat: { value: 99, trend: 'stable', normal: true },
      respiratoryRate: { value: 14, trend: 'stable', normal: true },
      status: 'stable',
      lastUpdate: '45 seconds ago'
    }
  ];

  const selectedPatientData = vitalSignsData.find(p => p.id === selectedPatient);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'warning': return 'border-orange-500 bg-orange-50';
      case 'stable': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-blue-500" />;
      default: return <Activity className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Vital Signs Monitoring</h3>
          <p className="text-gray-600">Real-time patient vital signs with automated alerts</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configure Alerts
          </Button>
          <Button className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            View All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <Card>
          <CardHeader>
            <CardTitle>Active Patients</CardTitle>
            <CardDescription>Patients with connected vital signs monitors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vitalSignsData.map((patient) => (
                <div
                  key={patient.id}
                  className={`p-3 border-l-4 rounded cursor-pointer transition-colors ${
                    getStatusColor(patient.status)
                  } ${selectedPatient === patient.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedPatient(patient.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900">{patient.name}</h5>
                      <p className="text-sm text-gray-600">Room {patient.room}</p>
                      <p className="text-xs text-gray-500">{patient.lastUpdate}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={`${
                        patient.status === 'critical' ? 'border-red-500 text-red-700' :
                        patient.status === 'warning' ? 'border-orange-500 text-orange-700' :
                        'border-green-500 text-green-700'
                      }`}>
                        {patient.status}
                      </Badge>
                      {(!patient.heartRate.normal || !patient.bloodPressure.normal) && (
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-1 ml-auto" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Vital Signs */}
        <div className="lg:col-span-2 space-y-4">
          {selectedPatientData && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>{selectedPatientData.name} - Room {selectedPatientData.room}</CardTitle>
                  <CardDescription>Current vital signs and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className={`p-4 border rounded-lg ${
                      selectedPatientData.heartRate.normal ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className={`h-5 w-5 ${
                          selectedPatientData.heartRate.normal ? 'text-green-600' : 'text-red-600'
                        }`} />
                        <span className="text-sm font-medium">Heart Rate</span>
                        {getTrendIcon(selectedPatientData.heartRate.trend)}
                      </div>
                      <p className="text-2xl font-bold">{selectedPatientData.heartRate.value}</p>
                      <p className="text-sm text-gray-600">bpm</p>
                    </div>

                    <div className={`p-4 border rounded-lg ${
                      selectedPatientData.bloodPressure.normal ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Gauge className={`h-5 w-5 ${
                          selectedPatientData.bloodPressure.normal ? 'text-green-600' : 'text-red-600'
                        }`} />
                        <span className="text-sm font-medium">Blood Pressure</span>
                        {getTrendIcon(selectedPatientData.bloodPressure.trend)}
                      </div>
                      <p className="text-2xl font-bold">
                        {selectedPatientData.bloodPressure.systolic}/{selectedPatientData.bloodPressure.diastolic}
                      </p>
                      <p className="text-sm text-gray-600">mmHg</p>
                    </div>

                    <div className={`p-4 border rounded-lg ${
                      selectedPatientData.temperature.normal ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Thermometer className={`h-5 w-5 ${
                          selectedPatientData.temperature.normal ? 'text-green-600' : 'text-red-600'
                        }`} />
                        <span className="text-sm font-medium">Temperature</span>
                        {getTrendIcon(selectedPatientData.temperature.trend)}
                      </div>
                      <p className="text-2xl font-bold">{selectedPatientData.temperature.value}</p>
                      <p className="text-sm text-gray-600">°F</p>
                    </div>

                    <div className={`p-4 border rounded-lg ${
                      selectedPatientData.oxygenSat.normal ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className={`h-5 w-5 ${
                          selectedPatientData.oxygenSat.normal ? 'text-green-600' : 'text-red-600'
                        }`} />
                        <span className="text-sm font-medium">Oxygen Sat</span>
                        {getTrendIcon(selectedPatientData.oxygenSat.trend)}
                      </div>
                      <p className="text-2xl font-bold">{selectedPatientData.oxygenSat.value}</p>
                      <p className="text-sm text-gray-600">%</p>
                    </div>

                    <div className={`p-4 border rounded-lg ${
                      selectedPatientData.respiratoryRate.normal ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className={`h-5 w-5 ${
                          selectedPatientData.respiratoryRate.normal ? 'text-green-600' : 'text-red-600'
                        }`} />
                        <span className="text-sm font-medium">Resp Rate</span>
                        {getTrendIcon(selectedPatientData.respiratoryRate.trend)}
                      </div>
                      <p className="text-2xl font-bold">{selectedPatientData.respiratoryRate.value}</p>
                      <p className="text-sm text-gray-600">breaths/min</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Chart Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>Vital Signs Trends</CardTitle>
                  <CardDescription>24-hour trending data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Trend charts would be displayed here with real-time data</p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
