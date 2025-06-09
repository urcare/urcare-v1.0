
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Stethoscope,
  Activity,
  Eye,
  Ear,
  Heart,
  Thermometer,
  Zap,
  Wifi,
  WifiOff,
  CheckCircle,
  AlertTriangle,
  Camera,
  Upload
} from 'lucide-react';

export const RemoteDiagnosticTools = () => {
  const [selectedDevice, setSelectedDevice] = useState('ecg');

  const connectedDevices = [
    {
      id: 'ecg',
      name: 'Digital ECG Monitor',
      type: 'Cardiac',
      status: 'connected',
      lastReading: '2 min ago',
      batteryLevel: 85,
      dataPoints: 1247,
      icon: Heart
    },
    {
      id: 'spirometer',
      name: 'Digital Spirometer',
      type: 'Pulmonary',
      status: 'connected',
      lastReading: '5 min ago',
      batteryLevel: 92,
      dataPoints: 156,
      icon: Activity
    },
    {
      id: 'dermascope',
      name: 'Digital Dermascope',
      type: 'Dermatology',
      status: 'disconnected',
      lastReading: '1 hour ago',
      batteryLevel: 45,
      dataPoints: 89,
      icon: Eye
    },
    {
      id: 'otoscope',
      name: 'Digital Otoscope',
      type: 'ENT',
      status: 'connected',
      lastReading: '10 min ago',
      batteryLevel: 78,
      dataPoints: 34,
      icon: Ear
    }
  ];

  const diagnosticTests = [
    {
      id: 1,
      patient: 'John Smith',
      test: 'ECG Analysis',
      device: 'Digital ECG Monitor',
      status: 'completed',
      result: 'Normal sinus rhythm',
      confidence: 95,
      timestamp: '2024-06-09 10:30 AM',
      recommendations: ['Continue current medication', 'Follow-up in 3 months']
    },
    {
      id: 2,
      patient: 'Mary Johnson',
      test: 'Pulmonary Function',
      device: 'Digital Spirometer',
      status: 'in-progress',
      result: 'Analyzing...',
      confidence: null,
      timestamp: '2024-06-09 10:45 AM',
      recommendations: []
    },
    {
      id: 3,
      patient: 'Robert Davis',
      test: 'Skin Lesion Analysis',
      device: 'Digital Dermascope',
      status: 'pending',
      result: 'Awaiting device connection',
      confidence: null,
      timestamp: '2024-06-09 11:00 AM',
      recommendations: []
    }
  ];

  const ecgData = [
    { time: 0, voltage: 0 },
    { time: 1, voltage: 0.1 },
    { time: 2, voltage: 0.8 },
    { time: 3, voltage: 0.1 },
    { time: 4, voltage: 0 },
    { time: 5, voltage: -0.2 },
    { time: 6, voltage: 0.3 },
    { time: 7, voltage: 0 },
    { time: 8, voltage: 0 },
    { time: 9, voltage: 0.1 },
    { time: 10, voltage: 0.8 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'disconnected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number | null) => {
    if (!confidence) return 'text-gray-600';
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="devices" className="w-full">
        <TabsList>
          <TabsTrigger value="devices">Connected Devices</TabsTrigger>
          <TabsTrigger value="tests">Active Tests</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-4">
          {/* Connected Devices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {connectedDevices.map((device) => {
              const IconComponent = device.icon;
              return (
                <Card key={device.id} className={`cursor-pointer transition-all ${selectedDevice === device.id ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => setSelectedDevice(device.id)}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                      <div className="flex items-center gap-2">
                        {device.status === 'connected' ? 
                          <Wifi className="h-4 w-4 text-green-600" /> : 
                          <WifiOff className="h-4 w-4 text-red-600" />
                        }
                        <Badge className={getStatusColor(device.status)}>
                          {device.status}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{device.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Type:</span>
                        <span>{device.type}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Last Reading:</span>
                        <span>{device.lastReading}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Battery:</span>
                        <span className={device.batteryLevel > 50 ? 'text-green-600' : device.batteryLevel > 20 ? 'text-yellow-600' : 'text-red-600'}>
                          {device.batteryLevel}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Data Points:</span>
                        <span>{device.dataPoints}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Device Details */}
          {selectedDevice && (
            <Card>
              <CardHeader>
                <CardTitle>Device Data Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDevice === 'ecg' && (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 mb-4">Real-time ECG readings for John Smith</div>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={ecgData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis domain={[-0.5, 1]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="voltage" stroke="#ef4444" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <div className="font-medium">Heart Rate: 72 BPM</div>
                        <div className="text-gray-600">Rhythm: Normal sinus rhythm</div>
                      </div>
                      <Button>
                        <Upload className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                    </div>
                  </div>
                )}

                {selectedDevice === 'spirometer' && (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 mb-4">Pulmonary function test for Mary Johnson</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">3.2L</div>
                        <div className="text-sm text-gray-600">FVC</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">2.8L</div>
                        <div className="text-sm text-gray-600">FEV1</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">87%</div>
                        <div className="text-sm text-gray-600">FEV1/FVC</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">4.2L/s</div>
                        <div className="text-sm text-gray-600">PEF</div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedDevice === 'dermascope' && (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 mb-4">Skin lesion imaging for Robert Davis</div>
                    <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-center">
                        <Camera className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-600">Device disconnected</p>
                        <Button className="mt-2" variant="outline">Reconnect Device</Button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedDevice === 'otoscope' && (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 mb-4">Ear examination imaging</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">Left Ear</p>
                        </div>
                      </div>
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">Right Ear</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          {/* Active Diagnostic Tests */}
          <Card>
            <CardHeader>
              <CardTitle>Active Diagnostic Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {diagnosticTests.filter(test => test.status !== 'completed').map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Stethoscope className="h-8 w-8 text-blue-600" />
                      <div>
                        <div className="font-medium">{test.patient}</div>
                        <div className="text-sm text-gray-600">{test.test}</div>
                        <div className="text-xs text-gray-500">{test.device}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">{test.timestamp}</div>
                        <div className="text-sm">{test.result}</div>
                      </div>
                      <Badge className={getStatusColor(test.status)}>
                        {test.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Monitor
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {/* Test Results */}
          <Card>
            <CardHeader>
              <CardTitle>Completed Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {diagnosticTests.filter(test => test.status === 'completed').map((test) => (
                  <div key={test.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">{test.patient}</div>
                        <div className="text-sm text-gray-600">{test.test}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className={`font-medium ${getConfidenceColor(test.confidence)}`}>
                          {test.confidence}% confidence
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg mb-3">
                      <div className="font-medium text-sm mb-1">Result:</div>
                      <div>{test.result}</div>
                    </div>

                    {test.recommendations.length > 0 && (
                      <div>
                        <div className="font-medium text-sm mb-2">Clinical Recommendations:</div>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {test.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Share Results
                      </Button>
                      <Button variant="outline" size="sm">
                        Schedule Follow-up
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          {/* AI Analysis Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI-Powered Clinical Decision Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-green-600">95%</div>
                          <div className="text-sm text-gray-600">Diagnostic Accuracy</div>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">42</div>
                          <div className="text-sm text-gray-600">Tests Analyzed Today</div>
                        </div>
                        <Activity className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-yellow-600">3</div>
                          <div className="text-sm text-gray-600">Abnormal Results</div>
                        </div>
                        <AlertTriangle className="h-8 w-8 text-yellow-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">AI-Generated Clinical Insights</h3>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-800">Cardiac Analysis</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      ECG pattern analysis suggests normal sinus rhythm with occasional PVCs. 
                      Recommend 24-hour Holter monitoring if symptoms persist.
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">Pulmonary Function</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Spirometry results within normal limits for age and height. 
                      No evidence of obstructive or restrictive patterns.
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Dermatological Assessment</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Lesion characteristics suggest benign seborrheic keratosis. 
                      Recommend clinical correlation and possible biopsy if changes occur.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
