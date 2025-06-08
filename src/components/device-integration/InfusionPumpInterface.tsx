
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Droplets, 
  AlertTriangle, 
  Play, 
  Pause, 
  Square, 
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const InfusionPumpInterface = () => {
  const [selectedPump, setSelectedPump] = useState('pump-1');

  const infusionPumps = [
    {
      id: 'pump-1',
      location: 'Room 201A - Bed 1',
      patient: 'John Smith',
      medication: 'Normal Saline',
      concentration: '0.9%',
      currentRate: 125,
      programmedRate: 125,
      totalVolume: 1000,
      volumeInfused: 325,
      timeRemaining: '5h 24m',
      status: 'running',
      alerts: [],
      lastUpdate: '30 seconds ago'
    },
    {
      id: 'pump-2',
      location: 'ICU - Bed 3',
      patient: 'Mary Johnson',
      medication: 'Dopamine',
      concentration: '400mg/250ml',
      currentRate: 5.5,
      programmedRate: 5.5,
      totalVolume: 250,
      volumeInfused: 125,
      timeRemaining: '22h 44m',
      status: 'running',
      alerts: ['Low volume warning'],
      lastUpdate: '15 seconds ago'
    },
    {
      id: 'pump-3',
      location: 'Room 305B - Bed 2',
      patient: 'Robert Davis',
      medication: 'Morphine PCA',
      concentration: '1mg/ml',
      currentRate: 0,
      programmedRate: 2,
      totalVolume: 100,
      volumeInfused: 45,
      timeRemaining: 'On demand',
      status: 'alarm',
      alerts: ['Occlusion detected', 'Flow stopped'],
      lastUpdate: '2 minutes ago'
    }
  ];

  const selectedPumpData = infusionPumps.find(p => p.id === selectedPump);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'border-green-500 bg-green-50';
      case 'paused': return 'border-orange-500 bg-orange-50';
      case 'alarm': return 'border-red-500 bg-red-50';
      case 'stopped': return 'border-gray-500 bg-gray-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className="h-4 w-4 text-green-600" />;
      case 'paused': return <Pause className="h-4 w-4 text-orange-600" />;
      case 'alarm': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'stopped': return <Square className="h-4 w-4 text-gray-600" />;
      default: return <Square className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Infusion Pump Monitoring</h3>
          <p className="text-gray-600">Real-time monitoring of medication infusions with safety alerts</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Safety Protocols</Button>
          <Button>Drug Library</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pump List */}
        <Card>
          <CardHeader>
            <CardTitle>Active Pumps</CardTitle>
            <CardDescription>Currently monitored infusion pumps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {infusionPumps.map((pump) => (
                <div
                  key={pump.id}
                  className={`p-3 border-l-4 rounded cursor-pointer transition-colors ${
                    getStatusColor(pump.status)
                  } ${selectedPump === pump.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedPump(pump.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(pump.status)}
                      <span className="font-medium text-gray-900">{pump.location}</span>
                    </div>
                    {pump.alerts.length > 0 && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{pump.patient}</p>
                  <p className="text-sm text-gray-600">{pump.medication}</p>
                  <p className="text-xs text-gray-500">{pump.lastUpdate}</p>
                  {pump.alerts.length > 0 && (
                    <div className="mt-2">
                      {pump.alerts.map((alert, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-red-500 text-red-700 mr-1">
                          {alert}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Pump Information */}
        <div className="lg:col-span-2 space-y-4">
          {selectedPumpData && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="h-5 w-5" />
                    {selectedPumpData.location}
                  </CardTitle>
                  <CardDescription>Patient: {selectedPumpData.patient}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 border rounded-lg bg-blue-50">
                      <p className="text-sm text-gray-600">Medication</p>
                      <p className="font-bold text-gray-900">{selectedPumpData.medication}</p>
                      <p className="text-sm text-gray-600">{selectedPumpData.concentration}</p>
                    </div>
                    <div className="p-3 border rounded-lg bg-green-50">
                      <p className="text-sm text-gray-600">Current Rate</p>
                      <p className="font-bold text-gray-900">{selectedPumpData.currentRate}</p>
                      <p className="text-sm text-gray-600">ml/hr</p>
                    </div>
                    <div className="p-3 border rounded-lg bg-purple-50">
                      <p className="text-sm text-gray-600">Volume Infused</p>
                      <p className="font-bold text-gray-900">{selectedPumpData.volumeInfused} ml</p>
                      <p className="text-sm text-gray-600">of {selectedPumpData.totalVolume} ml</p>
                    </div>
                    <div className="p-3 border rounded-lg bg-orange-50">
                      <p className="text-sm text-gray-600">Time Remaining</p>
                      <p className="font-bold text-gray-900">{selectedPumpData.timeRemaining}</p>
                      <p className="text-sm text-gray-600">estimated</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Bar */}
              <Card>
                <CardHeader>
                  <CardTitle>Infusion Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Volume Progress</span>
                      <span>{Math.round((selectedPumpData.volumeInfused / selectedPumpData.totalVolume) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${(selectedPumpData.volumeInfused / selectedPumpData.totalVolume) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>0 ml</span>
                      <span>{selectedPumpData.volumeInfused} ml infused</span>
                      <span>{selectedPumpData.totalVolume} ml total</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Control Panel */}
              <Card>
                <CardHeader>
                  <CardTitle>Pump Controls</CardTitle>
                  <CardDescription>Safety-verified pump operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Button 
                      variant={selectedPumpData.status === 'running' ? 'default' : 'outline'}
                      className="flex items-center gap-2"
                      disabled={selectedPumpData.status === 'alarm'}
                    >
                      <Play className="h-4 w-4" />
                      Start
                    </Button>
                    <Button 
                      variant={selectedPumpData.status === 'paused' ? 'default' : 'outline'}
                      className="flex items-center gap-2"
                    >
                      <Pause className="h-4 w-4" />
                      Pause
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2 text-red-600 border-red-600"
                    >
                      <Square className="h-4 w-4" />
                      Stop
                    </Button>
                    <div className="ml-auto flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Last update: {selectedPumpData.lastUpdate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts Section */}
              {selectedPumpData.alerts.length > 0 && (
                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-red-800 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Active Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedPumpData.alerts.map((alert, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-red-100 rounded">
                          <span className="text-red-800 font-medium">{alert}</span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="text-red-700 border-red-700">
                              Acknowledge
                            </Button>
                            <Button size="sm" className="bg-red-600 hover:bg-red-700">
                              Resolve
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
