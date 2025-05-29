
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Droplets, Shield, AlertTriangle, CheckCircle, Thermometer, Wind } from 'lucide-react';

export const OTInfectionControlMonitoring = () => {
  const [selectedRoom, setSelectedRoom] = useState('OT-1');

  const infectionControlData = [
    {
      room: 'OT-1',
      status: 'compliant',
      airQuality: {
        hepaFilters: 'optimal',
        airChanges: 25,
        temperature: 20,
        humidity: 45,
        pressure: 'positive'
      },
      sterilization: {
        instruments: 100,
        surfaces: 98,
        lastDecontamination: '2024-01-15 06:00',
        nextScheduled: '2024-01-15 18:00'
      },
      handHygiene: {
        complianceRate: 92,
        lastAudit: '2024-01-15',
        violations: 2
      },
      traffic: {
        doorOpenings: 12,
        personnel: 6,
        visitors: 0
      }
    },
    {
      room: 'OT-2',
      status: 'warning',
      airQuality: {
        hepaFilters: 'needs_replacement',
        airChanges: 22,
        temperature: 22,
        humidity: 52,
        pressure: 'positive'
      },
      sterilization: {
        instruments: 95,
        surfaces: 88,
        lastDecontamination: '2024-01-15 05:30',
        nextScheduled: '2024-01-15 17:30'
      },
      handHygiene: {
        complianceRate: 85,
        lastAudit: '2024-01-14',
        violations: 5
      },
      traffic: {
        doorOpenings: 18,
        personnel: 8,
        visitors: 2
      }
    },
    {
      room: 'OT-3',
      status: 'critical',
      airQuality: {
        hepaFilters: 'critical',
        airChanges: 18,
        temperature: 24,
        humidity: 58,
        pressure: 'neutral'
      },
      sterilization: {
        instruments: 88,
        surfaces: 82,
        lastDecontamination: '2024-01-14 22:00',
        nextScheduled: '2024-01-15 10:00'
      },
      handHygiene: {
        complianceRate: 78,
        lastAudit: '2024-01-14',
        violations: 8
      },
      traffic: {
        doorOpenings: 25,
        personnel: 10,
        visitors: 3
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  const getProgressColor = (value: number, threshold: number = 90) => {
    if (value >= threshold) return 'bg-green-500';
    if (value >= threshold - 10) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const currentData = infectionControlData.find(data => data.room === selectedRoom);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Droplets className="h-6 w-6 text-cyan-600" />
          OT Infection Control Monitoring
        </h2>
        <div className="flex gap-2">
          <Select value={selectedRoom} onValueChange={setSelectedRoom}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {infectionControlData.map(data => (
                <SelectItem key={data.room} value={data.room}>{data.room}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="bg-cyan-600 hover:bg-cyan-700">
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {infectionControlData.map(data => (
          <Card key={data.room} className={`cursor-pointer transition-all ${selectedRoom === data.room ? 'ring-2 ring-cyan-500' : ''}`} onClick={() => setSelectedRoom(data.room)}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{data.room}</h3>
                <div className="flex items-center gap-1">
                  {getStatusIcon(data.status)}
                  <Badge className={getStatusColor(data.status)}>
                    {data.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Hand Hygiene:</span>
                  <span className={data.handHygiene.complianceRate >= 90 ? 'text-green-600' : 'text-red-600'}>
                    {data.handHygiene.complianceRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sterilization:</span>
                  <span className={data.sterilization.instruments >= 95 ? 'text-green-600' : 'text-red-600'}>
                    {data.sterilization.instruments}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {currentData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="h-5 w-5" />
                Air Quality & Environment - {currentData.room}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Wind className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">HEPA Filters</span>
                    </div>
                    <Badge className={currentData.airQuality.hepaFilters === 'optimal' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {currentData.airQuality.hepaFilters.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="h-4 w-4 text-orange-600" />
                      <span className="font-medium">Temperature</span>
                    </div>
                    <p className="text-lg font-bold">{currentData.airQuality.temperature}°C</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Air Changes/Hour</p>
                    <div className="flex items-center gap-2">
                      <Progress value={Math.min((currentData.airQuality.airChanges / 25) * 100, 100)} className="flex-1" />
                      <span className="text-sm font-medium">{currentData.airQuality.airChanges}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Humidity</p>
                    <div className="flex items-center gap-2">
                      <Progress value={currentData.airQuality.humidity} className="flex-1" />
                      <span className="text-sm font-medium">{currentData.airQuality.humidity}%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Room Pressure</p>
                  <Badge className={currentData.airQuality.pressure === 'positive' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {currentData.airQuality.pressure.toUpperCase()} PRESSURE
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sterilization Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Instrument Sterilization</span>
                    <span className="text-lg font-bold">{currentData.sterilization.instruments}%</span>
                  </div>
                  <Progress 
                    value={currentData.sterilization.instruments} 
                    className={`h-3 [&>div]:${getProgressColor(currentData.sterilization.instruments, 95)}`}
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Surface Sterilization</span>
                    <span className="text-lg font-bold">{currentData.sterilization.surfaces}%</span>
                  </div>
                  <Progress 
                    value={currentData.sterilization.surfaces} 
                    className={`h-3 [&>div]:${getProgressColor(currentData.sterilization.surfaces, 95)}`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Last Decontamination:</p>
                    <p className="font-medium">{currentData.sterilization.lastDecontamination}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Next Scheduled:</p>
                    <p className="font-medium">{currentData.sterilization.nextScheduled}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Hand Hygiene Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Compliance Rate</span>
                    <span className="text-2xl font-bold">{currentData.handHygiene.complianceRate}%</span>
                  </div>
                  <Progress 
                    value={currentData.handHygiene.complianceRate} 
                    className={`h-4 [&>div]:${getProgressColor(currentData.handHygiene.complianceRate, 90)}`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Last Audit:</p>
                    <p className="font-medium">{currentData.handHygiene.lastAudit}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Violations Today:</p>
                    <p className={`font-medium ${currentData.handHygiene.violations > 5 ? 'text-red-600' : 'text-green-600'}`}>
                      {currentData.handHygiene.violations}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Traffic Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{currentData.traffic.doorOpenings}</p>
                    <p className="text-sm text-gray-600">Door Openings</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{currentData.traffic.personnel}</p>
                    <p className="text-sm text-gray-600">Personnel</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{currentData.traffic.visitors}</p>
                    <p className="text-sm text-gray-600">Visitors</p>
                  </div>
                </div>
                <div className="pt-2">
                  <Button size="sm" variant="outline" className="w-full">
                    View Traffic Log
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
