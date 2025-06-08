
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wind, 
  AlertTriangle, 
  Activity, 
  Gauge,
  TrendingUp,
  TrendingDown,
  Settings,
  Eye
} from 'lucide-react';

export const VentilatorMonitoring = () => {
  const [selectedVentilator, setSelectedVentilator] = useState('vent-1');

  const ventilators = [
    {
      id: 'vent-1',
      location: 'ICU - Bed 5',
      patient: 'Mary Johnson',
      mode: 'SIMV',
      tidalVolume: { current: 450, set: 450, normal: true },
      respiratoryRate: { current: 16, set: 16, normal: true },
      peep: { current: 5, set: 5, normal: true },
      fio2: { current: 40, set: 40, normal: true },
      pressure: { peak: 25, plateau: 20, mean: 12, normal: true },
      compliance: 35,
      resistance: 8,
      status: 'normal',
      alerts: [],
      lastUpdate: '15 seconds ago'
    },
    {
      id: 'vent-2',
      location: 'ICU - Bed 3',
      patient: 'Robert Wilson',
      mode: 'AC/VC',
      tidalVolume: { current: 520, set: 500, normal: false },
      respiratoryRate: { current: 22, set: 18, normal: false },
      peep: { current: 8, set: 8, normal: true },
      fio2: { current: 60, set: 60, normal: false },
      pressure: { peak: 35, plateau: 28, mean: 15, normal: false },
      compliance: 28,
      resistance: 12,
      status: 'warning',
      alerts: ['High airway pressure', 'Increased work of breathing'],
      lastUpdate: '30 seconds ago'
    },
    {
      id: 'vent-3',
      location: 'ICU - Bed 1',
      patient: 'Jennifer Lee',
      mode: 'PSV',
      tidalVolume: { current: 380, set: 400, normal: true },
      respiratoryRate: { current: 14, set: 14, normal: true },
      peep: { current: 5, set: 5, normal: true },
      fio2: { current: 30, set: 30, normal: true },
      pressure: { peak: 18, plateau: 15, mean: 8, normal: true },
      compliance: 42,
      resistance: 6,
      status: 'normal',
      alerts: [],
      lastUpdate: '45 seconds ago'
    }
  ];

  const selectedVentData = ventilators.find(v => v.id === selectedVentilator);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'warning': return 'border-orange-500 bg-orange-50';
      case 'normal': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Ventilator Monitoring</h3>
          <p className="text-gray-600">Real-time respiratory support monitoring and clinical decision support</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Alarm Settings
          </Button>
          <Button className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            View Waveforms
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ventilator List */}
        <Card>
          <CardHeader>
            <CardTitle>Active Ventilators</CardTitle>
            <CardDescription>Patients on mechanical ventilation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ventilators.map((vent) => (
                <div
                  key={vent.id}
                  className={`p-3 border-l-4 rounded cursor-pointer transition-colors ${
                    getStatusColor(vent.status)
                  } ${selectedVentilator === vent.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedVentilator(vent.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900">{vent.location}</h5>
                      <p className="text-sm text-gray-700">{vent.patient}</p>
                      <p className="text-sm text-gray-600">Mode: {vent.mode}</p>
                      <p className="text-xs text-gray-500">{vent.lastUpdate}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={`${
                        vent.status === 'critical' ? 'border-red-500 text-red-700' :
                        vent.status === 'warning' ? 'border-orange-500 text-orange-700' :
                        'border-green-500 text-green-700'
                      }`}>
                        {vent.status}
                      </Badge>
                      {vent.alerts.length > 0 && (
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-1 ml-auto" />
                      )}
                    </div>
                  </div>
                  {vent.alerts.length > 0 && (
                    <div className="mt-2">
                      {vent.alerts.slice(0, 2).map((alert, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-red-500 text-red-700 mr-1 mb-1">
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

        {/* Detailed Ventilator Parameters */}
        <div className="lg:col-span-2 space-y-4">
          {selectedVentData && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wind className="h-5 w-5" />
                    {selectedVentData.location} - {selectedVentData.patient}
                  </CardTitle>
                  <CardDescription>Ventilation Mode: {selectedVentData.mode}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`p-4 border rounded-lg ${
                      selectedVentData.tidalVolume.normal ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className={`h-5 w-5 ${
                          selectedVentData.tidalVolume.normal ? 'text-green-600' : 'text-red-600'
                        }`} />
                        <span className="text-sm font-medium">Tidal Volume</span>
                      </div>
                      <p className="text-2xl font-bold">{selectedVentData.tidalVolume.current}</p>
                      <p className="text-sm text-gray-600">ml (Set: {selectedVentData.tidalVolume.set})</p>
                    </div>

                    <div className={`p-4 border rounded-lg ${
                      selectedVentData.respiratoryRate.normal ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Wind className={`h-5 w-5 ${
                          selectedVentData.respiratoryRate.normal ? 'text-green-600' : 'text-red-600'
                        }`} />
                        <span className="text-sm font-medium">Resp Rate</span>
                      </div>
                      <p className="text-2xl font-bold">{selectedVentData.respiratoryRate.current}</p>
                      <p className="text-sm text-gray-600">bpm (Set: {selectedVentData.respiratoryRate.set})</p>
                    </div>

                    <div className={`p-4 border rounded-lg ${
                      selectedVentData.peep.normal ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Gauge className={`h-5 w-5 ${
                          selectedVentData.peep.normal ? 'text-green-600' : 'text-red-600'
                        }`} />
                        <span className="text-sm font-medium">PEEP</span>
                      </div>
                      <p className="text-2xl font-bold">{selectedVentData.peep.current}</p>
                      <p className="text-sm text-gray-600">cmH2O (Set: {selectedVentData.peep.set})</p>
                    </div>

                    <div className={`p-4 border rounded-lg ${
                      selectedVentData.fio2.normal ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className={`h-5 w-5 ${
                          selectedVentData.fio2.normal ? 'text-green-600' : 'text-red-600'
                        }`} />
                        <span className="text-sm font-medium">FiO2</span>
                      </div>
                      <p className="text-2xl font-bold">{selectedVentData.fio2.current}</p>
                      <p className="text-sm text-gray-600">% (Set: {selectedVentData.fio2.set})</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pressure Parameters */}
              <Card>
                <CardHeader>
                  <CardTitle>Airway Pressures</CardTitle>
                  <CardDescription>Real-time pressure monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className={`p-4 border rounded-lg ${
                      selectedVentData.pressure.normal ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                      <p className="text-sm text-gray-600">Peak Pressure</p>
                      <p className="text-xl font-bold">{selectedVentData.pressure.peak}</p>
                      <p className="text-sm text-gray-600">cmH2O</p>
                    </div>
                    <div className={`p-4 border rounded-lg ${
                      selectedVentData.pressure.normal ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                      <p className="text-sm text-gray-600">Plateau Pressure</p>
                      <p className="text-xl font-bold">{selectedVentData.pressure.plateau}</p>
                      <p className="text-sm text-gray-600">cmH2O</p>
                    </div>
                    <div className={`p-4 border rounded-lg ${
                      selectedVentData.pressure.normal ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                      <p className="text-sm text-gray-600">Mean Pressure</p>
                      <p className="text-xl font-bold">{selectedVentData.pressure.mean}</p>
                      <p className="text-sm text-gray-600">cmH2O</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lung Mechanics */}
              <Card>
                <CardHeader>
                  <CardTitle>Lung Mechanics</CardTitle>
                  <CardDescription>Respiratory system characteristics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg bg-blue-50">
                      <p className="text-sm text-gray-600">Compliance</p>
                      <p className="text-xl font-bold">{selectedVentData.compliance}</p>
                      <p className="text-sm text-gray-600">ml/cmH2O</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-purple-50">
                      <p className="text-sm text-gray-600">Resistance</p>
                      <p className="text-xl font-bold">{selectedVentData.resistance}</p>
                      <p className="text-sm text-gray-600">cmH2O/L/s</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Waveform Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>Respiratory Waveforms</CardTitle>
                  <CardDescription>Real-time pressure, flow, and volume curves</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Real-time waveforms would be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts Section */}
              {selectedVentData.alerts.length > 0 && (
                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-red-800 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Active Alarms
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedVentData.alerts.map((alert, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-red-100 rounded">
                          <span className="text-red-800 font-medium">{alert}</span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="text-red-700 border-red-700">
                              Silence
                            </Button>
                            <Button size="sm" className="bg-red-600 hover:bg-red-700">
                              Acknowledge
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
