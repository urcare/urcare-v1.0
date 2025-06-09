
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  Activity,
  Heart,
  Thermometer,
  Droplets,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react';

export const RemoteMonitoringDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState('patient1');
  const [realTimeData, setRealTimeData] = useState({
    heartRate: 72,
    bloodPressure: { systolic: 120, diastolic: 80 },
    temperature: 98.6,
    oxygenSaturation: 98,
    glucoseLevel: 95,
    timestamp: new Date().toLocaleTimeString()
  });

  const monitoredPatients = [
    {
      id: 'patient1',
      name: 'John Smith',
      age: 65,
      condition: 'Diabetes Type 2',
      status: 'stable',
      lastReading: '2 min ago',
      deviceStatus: 'connected',
      alerts: 0
    },
    {
      id: 'patient2',
      name: 'Mary Johnson',
      age: 58,
      condition: 'Hypertension',
      status: 'attention',
      lastReading: '5 min ago',
      deviceStatus: 'connected',
      alerts: 2
    },
    {
      id: 'patient3',
      name: 'Robert Davis',
      age: 72,
      condition: 'Heart Disease',
      status: 'critical',
      lastReading: '1 min ago',
      deviceStatus: 'disconnected',
      alerts: 1
    }
  ];

  const vitalSignsHistory = [
    { time: '00:00', heartRate: 68, bloodPressure: 118, temperature: 98.4, oxygen: 97 },
    { time: '04:00', heartRate: 64, bloodPressure: 115, temperature: 98.2, oxygen: 98 },
    { time: '08:00', heartRate: 72, bloodPressure: 122, temperature: 98.6, oxygen: 98 },
    { time: '12:00', heartRate: 75, bloodPressure: 125, temperature: 98.8, oxygen: 97 },
    { time: '16:00', heartRate: 78, bloodPressure: 128, temperature: 99.1, oxygen: 96 },
    { time: '20:00', heartRate: 74, bloodPressure: 120, temperature: 98.7, oxygen: 98 },
    { time: '24:00', heartRate: 72, bloodPressure: 120, temperature: 98.6, oxygen: 98 }
  ];

  const activeAlerts = [
    {
      id: 1,
      patient: 'Mary Johnson',
      type: 'Blood Pressure',
      severity: 'high',
      message: 'Systolic reading above 140 mmHg',
      time: '5 minutes ago',
      value: '145/92'
    },
    {
      id: 2,
      patient: 'Robert Davis',
      type: 'Device Connectivity',
      severity: 'medium',
      message: 'Heart rate monitor disconnected',
      time: '3 minutes ago',
      value: 'N/A'
    },
    {
      id: 3,
      patient: 'Mary Johnson',
      type: 'Heart Rate',
      severity: 'medium',
      message: 'Elevated heart rate detected',
      time: '8 minutes ago',
      value: '95 BPM'
    }
  ];

  useEffect(() => {
    // Simulate real-time vital signs updates
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        heartRate: Math.max(60, Math.min(100, prev.heartRate + (Math.random() - 0.5) * 4)),
        bloodPressure: {
          systolic: Math.max(110, Math.min(140, prev.bloodPressure.systolic + (Math.random() - 0.5) * 6)),
          diastolic: Math.max(70, Math.min(90, prev.bloodPressure.diastolic + (Math.random() - 0.5) * 4))
        },
        temperature: Math.max(97, Math.min(100, prev.temperature + (Math.random() - 0.5) * 0.2)),
        oxygenSaturation: Math.max(95, Math.min(100, prev.oxygenSaturation + (Math.random() - 0.5) * 1)),
        glucoseLevel: Math.max(80, Math.min(120, prev.glucoseLevel + (Math.random() - 0.5) * 8)),
        timestamp: new Date().toLocaleTimeString()
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable': return 'bg-green-100 text-green-800';
      case 'attention': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Patient Overview</TabsTrigger>
          <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Monitored Patients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monitoredPatients.map((patient) => (
              <Card key={patient.id} className={`cursor-pointer transition-all ${selectedPatient === patient.id ? 'ring-2 ring-blue-500' : ''}`} 
                    onClick={() => setSelectedPatient(patient.id)}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {patient.deviceStatus === 'connected' ? 
                        <Wifi className="h-4 w-4 text-green-600" /> : 
                        <WifiOff className="h-4 w-4 text-red-600" />
                      }
                      {patient.alerts > 0 && (
                        <Badge className="bg-red-100 text-red-800">
                          {patient.alerts} alert{patient.alerts > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Age:</span>
                      <span>{patient.age}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Condition:</span>
                      <span>{patient.condition}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Reading:</span>
                      <span>{patient.lastReading}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Status:</span>
                      <Badge className={getStatusColor(patient.status)}>
                        {patient.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vitals" className="space-y-4">
          {/* Real-time Vital Signs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium">Heart Rate</span>
                </div>
                <div className="text-2xl font-bold text-red-600">{Math.round(realTimeData.heartRate)}</div>
                <div className="text-sm text-gray-600">BPM</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">Blood Pressure</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(realTimeData.bloodPressure.systolic)}/{Math.round(realTimeData.bloodPressure.diastolic)}
                </div>
                <div className="text-sm text-gray-600">mmHg</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium">Temperature</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">{realTimeData.temperature.toFixed(1)}</div>
                <div className="text-sm text-gray-600">°F</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="h-5 w-5 text-cyan-500" />
                  <span className="text-sm font-medium">SpO2</span>
                </div>
                <div className="text-2xl font-bold text-cyan-600">{Math.round(realTimeData.oxygenSaturation)}</div>
                <div className="text-sm text-gray-600">%</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium">Glucose</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">{Math.round(realTimeData.glucoseLevel)}</div>
                <div className="text-sm text-gray-600">mg/dL</div>
              </CardContent>
            </Card>
          </div>

          {/* Vital Signs Chart */}
          <Card>
            <CardHeader>
              <CardTitle>24-Hour Vital Signs Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={vitalSignsHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} name="Heart Rate" />
                  <Line type="monotone" dataKey="bloodPressure" stroke="#3b82f6" strokeWidth={2} name="Systolic BP" />
                  <Line type="monotone" dataKey="oxygen" stroke="#06b6d4" strokeWidth={2} name="SpO2" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {/* Active Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Active Alerts ({activeAlerts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <AlertTriangle className={`h-5 w-5 ${alert.severity === 'high' ? 'text-red-500' : alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'}`} />
                      <div>
                        <div className="font-medium">{alert.patient}</div>
                        <div className="text-sm text-gray-600">{alert.message}</div>
                        <div className="text-xs text-gray-500">{alert.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">{alert.value}</div>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Review
                        </Button>
                        <Button variant="outline" size="sm">
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          {/* Trend Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Health Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={vitalSignsHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="heartRate" stackId="1" stroke="#ef4444" fill="#ef444420" />
                  <Area type="monotone" dataKey="bloodPressure" stackId="2" stroke="#3b82f6" fill="#3b82f620" />
                  <Area type="monotone" dataKey="oxygen" stackId="3" stroke="#06b6d4" fill="#06b6d420" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Trend Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">Heart Rate Trend</div>
                    <div className="text-2xl font-bold">Stable</div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">BP Trend</div>
                    <div className="text-2xl font-bold">Rising</div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">SpO2 Trend</div>
                    <div className="text-2xl font-bold">Stable</div>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
