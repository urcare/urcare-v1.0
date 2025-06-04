
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Monitor, 
  Clock, 
  Battery, 
  TrendingUp,
  Moon,
  Sun,
  Activity,
  Heart
} from 'lucide-react';

interface SleepData {
  id: string;
  patientId: string;
  patientName: string;
  sleepQuality: number;
  sleepDuration: number;
  energyLevel: number;
  restfulness: number;
  sleepEfficiency: number;
  bedtime: string;
  wakeTime: string;
  recommendations: string[];
  patterns: string[];
  lastUpdate: string;
  trend: 'improving' | 'stable' | 'declining';
}

const mockSleepData: SleepData[] = [
  {
    id: 'SD001',
    patientId: 'P2847',
    patientName: 'Sarah Johnson',
    sleepQuality: 72,
    sleepDuration: 6.5,
    energyLevel: 68,
    restfulness: 75,
    sleepEfficiency: 82,
    bedtime: '23:30',
    wakeTime: '06:00',
    recommendations: ['consistent bedtime', 'reduce screen time', 'meditation before sleep'],
    patterns: ['weekend sleep-in', 'caffeine sensitivity', 'stress-related insomnia'],
    lastUpdate: '2024-01-20 08:00',
    trend: 'stable'
  },
  {
    id: 'SD002',
    patientId: 'P1932',
    patientName: 'Michael Chen',
    sleepQuality: 85,
    sleepDuration: 7.8,
    energyLevel: 87,
    restfulness: 89,
    sleepEfficiency: 91,
    bedtime: '22:15',
    wakeTime: '06:00',
    recommendations: ['maintain current routine', 'optimize room temperature'],
    patterns: ['consistent schedule', 'good sleep hygiene', 'regular exercise'],
    lastUpdate: '2024-01-20 07:45',
    trend: 'improving'
  },
  {
    id: 'SD003',
    patientId: 'P3156',
    patientName: 'Emma Davis',
    sleepQuality: 45,
    sleepDuration: 5.2,
    energyLevel: 34,
    restfulness: 42,
    sleepEfficiency: 58,
    bedtime: '01:15',
    wakeTime: '06:30',
    recommendations: ['sleep clinic referral', 'sleep hygiene education', 'stress management'],
    patterns: ['irregular schedule', 'frequent awakening', 'anxiety-related insomnia'],
    lastUpdate: '2024-01-20 09:30',
    trend: 'declining'
  }
];

export const SleepEnergyMonitoring = () => {
  const [sleepData] = useState<SleepData[]>(mockSleepData);
  const [selectedPatient, setSelectedPatient] = useState<SleepData | null>(null);

  const getQualityColor = (quality: number) => {
    if (quality >= 80) return 'text-green-600';
    if (quality >= 65) return 'text-blue-600';
    if (quality >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'stable': return 'text-blue-600';
      case 'declining': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return TrendingUp;
      case 'stable': return Activity;
      case 'declining': return TrendingUp;
      default: return Activity;
    }
  };

  const getEfficiencyBadge = (efficiency: number) => {
    if (efficiency >= 85) return 'bg-green-500 text-white';
    if (efficiency >= 75) return 'bg-blue-500 text-white';
    if (efficiency >= 65) return 'bg-yellow-500 text-white';
    return 'bg-red-500 text-white';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Sleep & Energy Monitoring
          </CardTitle>
          <CardDescription>
            Pattern analysis with lifestyle recommendations and wellness tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Moon className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.round(sleepData.reduce((sum, d) => sum + d.sleepQuality, 0) / sleepData.length)}
                    </p>
                    <p className="text-sm text-gray-600">Avg Sleep Quality</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {(sleepData.reduce((sum, d) => sum + d.sleepDuration, 0) / sleepData.length).toFixed(1)}h
                    </p>
                    <p className="text-sm text-gray-600">Avg Duration</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <Battery className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">
                      {Math.round(sleepData.reduce((sum, d) => sum + d.energyLevel, 0) / sleepData.length)}%
                    </p>
                    <p className="text-sm text-gray-600">Avg Energy</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <Activity className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round(sleepData.reduce((sum, d) => sum + d.sleepEfficiency, 0) / sleepData.length)}%
                    </p>
                    <p className="text-sm text-gray-600">Avg Efficiency</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Patient Sleep Analysis</h3>
              {sleepData.map((patient) => {
                const TrendIcon = getTrendIcon(patient.trend);
                return (
                  <Card 
                    key={patient.id} 
                    className={`cursor-pointer transition-colors ${selectedPatient?.id === patient.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-indigo-400`}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold mb-1">{patient.patientName}</h4>
                          <p className="text-sm text-gray-600 mb-1">ID: {patient.patientId}</p>
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              Sleep: {patient.sleepDuration}h
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge className={getEfficiencyBadge(patient.sleepEfficiency)}>
                            {patient.sleepEfficiency}% Efficiency
                          </Badge>
                          <div className="flex items-center gap-1">
                            <TrendIcon className={`h-4 w-4 ${getTrendColor(patient.trend)}`} />
                            <span className={`text-sm font-medium ${getTrendColor(patient.trend)}`}>
                              {patient.trend}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Quality:</span>
                          <span className={`font-medium ml-1 ${getQualityColor(patient.sleepQuality)}`}>
                            {patient.sleepQuality}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Energy:</span>
                          <span className={`font-medium ml-1 ${getQualityColor(patient.energyLevel)}`}>
                            {patient.energyLevel}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Rest:</span>
                          <span className={`font-medium ml-1 ${getQualityColor(patient.restfulness)}`}>
                            {patient.restfulness}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Sleep Quality</span>
                          <span className={`font-bold ${getQualityColor(patient.sleepQuality)}`}>
                            {patient.sleepQuality}%
                          </span>
                        </div>
                        <Progress value={patient.sleepQuality} className="h-2" />
                        
                        <div className="flex justify-between items-center mt-3 text-sm">
                          <div className="flex items-center gap-1 text-gray-500">
                            <Sun className="h-3 w-3" />
                            <span>{patient.bedtime} - {patient.wakeTime}</span>
                          </div>
                          <div className="flex items-center gap-1 text-blue-600">
                            <Clock className="h-3 w-3" />
                            <span>Updated: {patient.lastUpdate.split(' ')[1]}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div>
              {selectedPatient ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedPatient.patientName}</CardTitle>
                    <CardDescription>Detailed sleep analysis and wellness recommendations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Sleep Metrics</h4>
                          <div className="space-y-1 text-sm">
                            <p>Quality: <strong className={getQualityColor(selectedPatient.sleepQuality)}>
                              {selectedPatient.sleepQuality}%
                            </strong></p>
                            <p>Duration: <strong>{selectedPatient.sleepDuration}h</strong></p>
                            <p>Efficiency: <strong>{selectedPatient.sleepEfficiency}%</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Wellness Status</h4>
                          <div className="space-y-1 text-sm">
                            <p>Energy: <strong className={getQualityColor(selectedPatient.energyLevel)}>
                              {selectedPatient.energyLevel}%
                            </strong></p>
                            <p>Restfulness: <strong>{selectedPatient.restfulness}%</strong></p>
                            <p>Trend: <strong className={getTrendColor(selectedPatient.trend)}>
                              {selectedPatient.trend}
                            </strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Sleep Schedule</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-blue-50 p-3 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <Moon className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-blue-800">Bedtime</span>
                            </div>
                            <p className="text-blue-700 text-lg font-bold">{selectedPatient.bedtime}</p>
                          </div>
                          <div className="bg-orange-50 p-3 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <Sun className="h-4 w-4 text-orange-600" />
                              <span className="font-medium text-orange-800">Wake Time</span>
                            </div>
                            <p className="text-orange-700 text-lg font-bold">{selectedPatient.wakeTime}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Identified Patterns</h4>
                        <div className="space-y-2">
                          {selectedPatient.patterns.map((pattern, index) => (
                            <div key={index} className="text-sm bg-purple-50 p-2 rounded">
                              <div className="flex items-start gap-2">
                                <Activity className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                <span className="text-purple-700">{pattern}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Wellness Recommendations</h4>
                        <div className="space-y-2">
                          {selectedPatient.recommendations.map((recommendation, index) => (
                            <div key={index} className="text-sm bg-green-50 p-2 rounded">
                              <div className="flex items-start gap-2">
                                <Heart className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-green-700">{recommendation}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <Clock className="h-4 w-4 mr-1" />
                          Sleep Plan
                        </Button>
                        <Button variant="outline">
                          <Battery className="h-4 w-4 mr-1" />
                          Energy Tips
                        </Button>
                        <Button variant="outline">
                          <Monitor className="h-4 w-4 mr-1" />
                          Track Progress
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a patient to view detailed sleep analysis and wellness recommendations</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
