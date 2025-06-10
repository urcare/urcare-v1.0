
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Zap, AlertTriangle, CheckCircle, Search } from 'lucide-react';

export const SurgicalInstrumentTracking = () => {
  const [selectedSet, setSelectedSet] = useState('set-1');

  const instrumentSets = [
    {
      id: 'set-1',
      name: 'Laparoscopic Set A',
      rfid: 'RFID-001',
      status: 'ready',
      location: 'OR-1',
      lastSterilized: '2024-01-15 06:00',
      sterilizationMethod: 'Steam',
      expiryDate: '2024-01-22'
    },
    {
      id: 'set-2',
      name: 'General Surgery Basic',
      rfid: 'RFID-002',
      status: 'in-use',
      location: 'OR-2',
      lastSterilized: '2024-01-14 20:00',
      sterilizationMethod: 'Steam',
      expiryDate: '2024-01-21'
    },
    {
      id: 'set-3',
      name: 'Orthopedic Set B',
      rfid: 'RFID-003',
      status: 'sterilizing',
      location: 'Sterilization Unit 1',
      lastSterilized: null,
      sterilizationMethod: 'Steam',
      expiryDate: null
    },
    {
      id: 'set-4',
      name: 'Cardiac Surgery Set',
      rfid: 'RFID-004',
      status: 'expired',
      location: 'Storage Room',
      lastSterilized: '2024-01-08 14:00',
      sterilizationMethod: 'Steam',
      expiryDate: '2024-01-15'
    }
  ];

  const instruments = [
    { name: '5mm Grasper', rfid: 'INST-001', status: 'clean', condition: 'good' },
    { name: '5mm Scissors', rfid: 'INST-002', status: 'clean', condition: 'good' },
    { name: '12mm Trocar', rfid: 'INST-003', status: 'clean', condition: 'good' },
    { name: 'Clip Applier', rfid: 'INST-004', status: 'clean', condition: 'worn' },
    { name: 'Camera', rfid: 'INST-005', status: 'clean', condition: 'good' },
    { name: 'Light Cable', rfid: 'INST-006', status: 'clean', condition: 'good' }
  ];

  const sterilizationCycles = [
    {
      id: 'cycle-001',
      type: 'Steam',
      temperature: '134°C',
      pressure: '2.1 bar',
      duration: '18 min',
      status: 'completed',
      startTime: '06:00',
      endTime: '06:25'
    },
    {
      id: 'cycle-002',
      type: 'Steam',
      temperature: '134°C',
      pressure: '2.1 bar',
      duration: '18 min',
      status: 'in-progress',
      startTime: '08:30',
      endTime: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ready': return 'bg-green-500 text-white';
      case 'in-use': return 'bg-blue-500 text-white';
      case 'sterilizing': return 'bg-yellow-500 text-white';
      case 'expired': return 'bg-red-500 text-white';
      case 'maintenance': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getConditionColor = (condition: string) => {
    switch(condition) {
      case 'good': return 'text-green-600';
      case 'worn': return 'text-yellow-600';
      case 'damaged': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Surgical Instrument Tracking</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Scan RFID
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Package className="h-4 w-4 mr-2" />
            New Set
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Instrument Sets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {instrumentSets.map((set) => (
                <div 
                  key={set.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedSet === set.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedSet(set.id)}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-sm">{set.name}</h3>
                      <Badge className={getStatusColor(set.status)}>
                        {set.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600">
                      <div>RFID: {set.rfid}</div>
                      <div>Location: {set.location}</div>
                      {set.expiryDate && (
                        <div>Expires: {set.expiryDate}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Set Contents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {instruments.map((instrument, index) => (
                <div key={index} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <div className="font-medium text-sm">{instrument.name}</div>
                    <div className="text-xs text-gray-600">{instrument.rfid}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">
                      {instrument.status}
                    </Badge>
                    <div className={`text-xs mt-1 ${getConditionColor(instrument.condition)}`}>
                      {instrument.condition}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Sterilization Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sterilizationCycles.map((cycle) => (
                <div key={cycle.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">{cycle.type} Cycle</div>
                    <Badge className={cycle.status === 'completed' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}>
                      {cycle.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Temperature: {cycle.temperature}</div>
                    <div>Pressure: {cycle.pressure}</div>
                    <div>Duration: {cycle.duration}</div>
                    <div>Start: {cycle.startTime}</div>
                    {cycle.endTime && <div>End: {cycle.endTime}</div>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Sets:</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span>Ready for Use:</span>
                <span className="font-medium text-green-600">18</span>
              </div>
              <div className="flex justify-between">
                <span>In Use:</span>
                <span className="font-medium text-blue-600">4</span>
              </div>
              <div className="flex justify-between">
                <span>Sterilizing:</span>
                <span className="font-medium text-yellow-600">1</span>
              </div>
              <div className="flex justify-between">
                <span>Expired/Maintenance:</span>
                <span className="font-medium text-red-600">1</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-2 bg-red-50 border border-red-200 rounded">
                <div className="text-sm font-medium text-red-800">Set Expired</div>
                <div className="text-xs text-red-600">Cardiac Surgery Set expired 3 days ago</div>
              </div>
              <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                <div className="text-sm font-medium text-yellow-800">Maintenance Due</div>
                <div className="text-xs text-yellow-600">Clip Applier showing wear signs</div>
              </div>
              <div className="p-2 bg-orange-50 border border-orange-200 rounded">
                <div className="text-sm font-medium text-orange-800">Low Stock</div>
                <div className="text-xs text-orange-600">Only 2 laparoscopic sets available</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>RFID Scanner Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Scanner Online</span>
              </div>
              <div className="text-sm text-gray-600">
                <div>Last Scan: 2 minutes ago</div>
                <div>Battery: 87%</div>
                <div>Range: 5 meters</div>
              </div>
              <Button variant="outline" className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Test Scanner
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
