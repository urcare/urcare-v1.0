
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun, Volume2, VolumeX, Bell, Clock, User, AlertTriangle } from 'lucide-react';

interface NightShiftViewProps {
  nightMode: boolean;
}

export const NightShiftView = ({ nightMode }: NightShiftViewProps) => {
  const [silentMode, setSilentMode] = useState(true);
  const [dimmedDisplay, setDimmedDisplay] = useState(true);
  const [selectedView, setSelectedView] = useState('minimal');

  const nightPatients = [
    {
      id: 1,
      patient: 'John Doe',
      room: '301A',
      condition: 'Post-op monitoring',
      lastCheck: '02:00',
      nextCheck: '04:00',
      vitals: { temp: 98.6, bp: '120/80', hr: 72, spo2: 98 },
      alerts: [],
      sleepStatus: 'sleeping',
      medications: ['Pain relief due 04:00']
    },
    {
      id: 2,
      patient: 'Jane Smith',
      room: '302B',
      condition: 'Cardiac monitoring',
      lastCheck: '02:30',
      nextCheck: '03:30',
      vitals: { temp: 99.1, bp: '135/85', hr: 88, spo2: 96 },
      alerts: ['HR elevated'],
      sleepStatus: 'restless',
      medications: []
    },
    {
      id: 3,
      patient: 'Mike Brown',
      room: '303A',
      condition: 'Recovery',
      lastCheck: '01:45',
      nextCheck: '05:45',
      vitals: { temp: 98.2, bp: '118/75', hr: 65, spo2: 99 },
      alerts: [],
      sleepStatus: 'deep_sleep',
      medications: ['Antibiotic due 06:00']
    }
  ];

  const getSleepStatusColor = (status: string) => {
    switch (status) {
      case 'sleeping': return 'bg-green-100 text-green-800 border-green-200';
      case 'deep_sleep': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'restless': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'awake': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSleepIcon = (status: string) => {
    switch (status) {
      case 'sleeping':
      case 'deep_sleep':
        return <Moon className="h-4 w-4" />;
      case 'restless':
        return <AlertTriangle className="h-4 w-4" />;
      case 'awake':
        return <Sun className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className={`space-y-6 ${nightMode || dimmedDisplay ? 'bg-gray-900 text-white rounded-lg p-6' : ''}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Moon className="h-6 w-6 text-purple-600" />
          Night Shift Special View
        </h2>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <VolumeX className="h-4 w-4" />
            <Switch checked={silentMode} onCheckedChange={setSilentMode} />
            <span className="text-sm">Silent Mode</span>
          </div>
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <Switch checked={dimmedDisplay} onCheckedChange={setDimmedDisplay} />
            <span className="text-sm">Dimmed Display</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          variant={selectedView === 'minimal' ? 'default' : 'outline'}
          onClick={() => setSelectedView('minimal')}
          className="flex items-center gap-2"
        >
          <Moon className="h-4 w-4" />
          Minimal View
        </Button>
        <Button
          variant={selectedView === 'summary' ? 'default' : 'outline'}
          onClick={() => setSelectedView('summary')}
          className="flex items-center gap-2"
        >
          <Clock className="h-4 w-4" />
          Summary View
        </Button>
        <Button
          variant={selectedView === 'alerts' ? 'default' : 'outline'}
          onClick={() => setSelectedView('alerts')}
          className="flex items-center gap-2"
        >
          <Bell className="h-4 w-4" />
          Alerts Only
        </Button>
      </div>

      {selectedView === 'minimal' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nightPatients.map(patient => (
            <Card key={patient.id} className={`${
              dimmedDisplay ? 'bg-gray-800 border-gray-700' : ''
            } ${patient.alerts.length > 0 ? 'border-yellow-500' : ''}`}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{patient.room}</h3>
                    <Badge className={getSleepStatusColor(patient.sleepStatus)}>
                      {getSleepIcon(patient.sleepStatus)}
                      <span className="ml-1">{patient.sleepStatus.replace('_', ' ')}</span>
                    </Badge>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <p className={dimmedDisplay ? 'text-gray-300' : 'text-gray-600'}>
                      {patient.patient}
                    </p>
                    <p className={dimmedDisplay ? 'text-gray-400' : 'text-gray-500'}>
                      Next check: {patient.nextCheck}
                    </p>
                  </div>

                  {patient.alerts.length > 0 && (
                    <div className="space-y-1">
                      {patient.alerts.map((alert, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-yellow-600">
                          <AlertTriangle className="h-3 w-3" />
                          {alert}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between text-xs">
                    <span>HR: {patient.vitals.hr}</span>
                    <span>SpO2: {patient.vitals.spo2}%</span>
                    <span>BP: {patient.vitals.bp}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedView === 'summary' && (
        <div className="space-y-4">
          <Card className={dimmedDisplay ? 'bg-gray-800 border-gray-700' : ''}>
            <CardHeader>
              <CardTitle className="text-lg">Night Shift Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className={`p-4 ${dimmedDisplay ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg`}>
                  <div className="text-2xl font-bold text-blue-600">
                    {nightPatients.filter(p => p.sleepStatus === 'sleeping' || p.sleepStatus === 'deep_sleep').length}
                  </div>
                  <p className={`text-sm ${dimmedDisplay ? 'text-gray-300' : 'text-blue-800'}`}>Patients Sleeping</p>
                </div>
                <div className={`p-4 ${dimmedDisplay ? 'bg-gray-700' : 'bg-yellow-50'} rounded-lg`}>
                  <div className="text-2xl font-bold text-yellow-600">
                    {nightPatients.filter(p => p.alerts.length > 0).length}
                  </div>
                  <p className={`text-sm ${dimmedDisplay ? 'text-gray-300' : 'text-yellow-800'}`}>Active Alerts</p>
                </div>
                <div className={`p-4 ${dimmedDisplay ? 'bg-gray-700' : 'bg-green-50'} rounded-lg`}>
                  <div className="text-2xl font-bold text-green-600">
                    {nightPatients.filter(p => p.medications.length > 0).length}
                  </div>
                  <p className={`text-sm ${dimmedDisplay ? 'text-gray-300' : 'text-green-800'}`}>Upcoming Meds</p>
                </div>
                <div className={`p-4 ${dimmedDisplay ? 'bg-gray-700' : 'bg-purple-50'} rounded-lg`}>
                  <div className="text-2xl font-bold text-purple-600">6</div>
                  <p className={`text-sm ${dimmedDisplay ? 'text-gray-300' : 'text-purple-800'}`}>Hours Until Day Shift</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            {nightPatients.map(patient => (
              <Card key={patient.id} className={dimmedDisplay ? 'bg-gray-800 border-gray-700' : ''}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <h3 className="font-medium">{patient.patient}</h3>
                      <p className={`text-sm ${dimmedDisplay ? 'text-gray-400' : 'text-gray-500'}`}>
                        {patient.room} | {patient.condition}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Sleep Status</p>
                      <Badge className={getSleepStatusColor(patient.sleepStatus)}>
                        {getSleepIcon(patient.sleepStatus)}
                        <span className="ml-1">{patient.sleepStatus.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Vitals</p>
                      <div className="text-sm space-y-1">
                        <p>HR: {patient.vitals.hr} | SpO2: {patient.vitals.spo2}%</p>
                        <p>BP: {patient.vitals.bp} | Temp: {patient.vitals.temp}°F</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Next Check</p>
                      <p className={`text-sm ${dimmedDisplay ? 'text-gray-300' : 'text-gray-600'}`}>
                        {patient.nextCheck}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedView === 'alerts' && (
        <div className="space-y-4">
          <Card className={`${dimmedDisplay ? 'bg-gray-800 border-gray-700' : ''} border-yellow-200 bg-yellow-50`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-5 w-5" />
                Active Night Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nightPatients.filter(p => p.alerts.length > 0).length === 0 ? (
                <p className={`text-center ${dimmedDisplay ? 'text-gray-400' : 'text-gray-500'}`}>
                  No active alerts - All patients stable
                </p>
              ) : (
                <div className="space-y-3">
                  {nightPatients.filter(p => p.alerts.length > 0).map(patient => (
                    <div key={patient.id} className="border-l-4 border-yellow-500 pl-4">
                      <h4 className="font-medium">{patient.patient} - {patient.room}</h4>
                      {patient.alerts.map((alert, index) => (
                        <p key={index} className="text-sm text-yellow-700">
                          <AlertTriangle className="h-3 w-3 inline mr-1" />
                          {alert}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <Card className={dimmedDisplay ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader>
          <CardTitle>Night Shift Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className={`${silentMode ? 'opacity-50' : ''} flex items-center gap-2`}
              disabled={silentMode}
            >
              {silentMode ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              Audio Alerts
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Emergency Call
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Round Timer
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Handoff Notes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
