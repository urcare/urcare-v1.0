
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  Activity, 
  AlertTriangle, 
  TrendingDown, 
  Clock, 
  Heart,
  Thermometer,
  Wind,
  Droplets
} from 'lucide-react';

interface VitalPattern {
  id: string;
  patientName: string;
  room: string;
  vitalType: 'heart_rate' | 'blood_pressure' | 'temperature' | 'respiratory_rate' | 'oxygen_saturation';
  currentValue: number;
  normalRange: string;
  trendDirection: 'improving' | 'stable' | 'declining' | 'critical';
  degradationScore: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  timeToIntervention: number; // minutes
  patternData: Array<{ time: string; value: number; predicted?: boolean }>;
  interventionRecommendations: string[];
  lastUpdated: string;
}

const mockVitalPatterns: VitalPattern[] = [
  {
    id: 'VP001',
    patientName: 'John Martinez',
    room: 'ICU-302',
    vitalType: 'heart_rate',
    currentValue: 125,
    normalRange: '60-100 bpm',
    trendDirection: 'declining',
    degradationScore: 85,
    riskLevel: 'critical',
    timeToIntervention: 15,
    patternData: [
      { time: '08:00', value: 82 },
      { time: '09:00', value: 88 },
      { time: '10:00', value: 95 },
      { time: '11:00', value: 108 },
      { time: '12:00', value: 115 },
      { time: '13:00', value: 125 },
      { time: '14:00', value: 135, predicted: true },
      { time: '15:00', value: 142, predicted: true }
    ],
    interventionRecommendations: [
      'Immediate physician notification',
      'Cardiac monitoring enhancement',
      'Beta-blocker consideration',
      'Fluid status assessment'
    ],
    lastUpdated: '2 minutes ago'
  },
  {
    id: 'VP002',
    patientName: 'Sarah Thompson',
    room: 'Ward-205',
    vitalType: 'blood_pressure',
    currentValue: 85,
    normalRange: '90-140 mmHg',
    trendDirection: 'declining',
    degradationScore: 72,
    riskLevel: 'high',
    timeToIntervention: 30,
    patternData: [
      { time: '08:00', value: 120 },
      { time: '10:00', value: 115 },
      { time: '12:00', value: 105 },
      { time: '14:00', value: 95 },
      { time: '16:00', value: 85 },
      { time: '18:00', value: 78, predicted: true },
      { time: '20:00', value: 72, predicted: true }
    ],
    interventionRecommendations: [
      'Fluid bolus consideration',
      'Vasopressor assessment',
      'Sepsis workup',
      'Hourly vital monitoring'
    ],
    lastUpdated: '5 minutes ago'
  }
];

export const VitalSignDegradationMonitor = () => {
  const [vitalPatterns] = useState<VitalPattern[]>(mockVitalPatterns);
  const [selectedPattern, setSelectedPattern] = useState<VitalPattern | null>(null);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'critical':
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'improving':
        return <Activity className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getVitalIcon = (type: string) => {
    switch (type) {
      case 'heart_rate': return Heart;
      case 'blood_pressure': return Activity;
      case 'temperature': return Thermometer;
      case 'respiratory_rate': return Wind;
      case 'oxygen_saturation': return Droplets;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Vital Sign Degradation Monitor
          </CardTitle>
          <CardDescription>
            AI-powered pattern recognition with trend predictions and intervention timelines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">2</p>
                    <p className="text-sm text-gray-600">Critical Patterns</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">5</p>
                    <p className="text-sm text-gray-600">Declining Trends</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-yellow-200 bg-yellow-50">
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">15min</p>
                    <p className="text-sm text-gray-600">Fastest Alert</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Activity className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">42</p>
                    <p className="text-sm text-gray-600">Monitored Patients</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Active Degradation Patterns</h3>
              {vitalPatterns.sort((a, b) => {
                const riskOrder = { critical: 4, high: 3, moderate: 2, low: 1 };
                return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
              }).map((pattern) => {
                const VitalIcon = getVitalIcon(pattern.vitalType);
                return (
                  <Card 
                    key={pattern.id} 
                    className={`cursor-pointer transition-colors ${selectedPattern?.id === pattern.id ? 'ring-2 ring-blue-500' : ''} border-l-4 ${pattern.riskLevel === 'critical' ? 'border-l-red-600' : pattern.riskLevel === 'high' ? 'border-l-red-400' : 'border-l-yellow-400'}`}
                    onClick={() => setSelectedPattern(pattern)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{pattern.patientName}</h4>
                            {getTrendIcon(pattern.trendDirection)}
                          </div>
                          <p className="text-sm text-gray-600">{pattern.room}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <VitalIcon className="h-3 w-3" />
                            <span>{pattern.vitalType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getRiskColor(pattern.riskLevel)}>
                            {pattern.riskLevel.toUpperCase()}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{pattern.lastUpdated}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Current: <strong>{pattern.currentValue}</strong></span>
                          <span>Normal: {pattern.normalRange}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Degradation Score</span>
                          <span className="text-sm font-bold">{pattern.degradationScore}/100</span>
                        </div>
                        <Progress value={pattern.degradationScore} className="h-2" />
                        
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-orange-500" />
                            <span>Intervention in {pattern.timeToIntervention}min</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div>
              {selectedPattern ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {React.createElement(getVitalIcon(selectedPattern.vitalType), { className: "h-5 w-5" })}
                      {selectedPattern.patientName} - Vital Trend Analysis
                    </CardTitle>
                    <CardDescription>
                      {selectedPattern.vitalType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Pattern
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={selectedPattern.patternData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#8884d8" 
                              strokeWidth={2}
                              dot={(props) => {
                                const { payload } = props;
                                return (
                                  <circle 
                                    {...props} 
                                    fill={payload.predicted ? "#ff7300" : "#8884d8"}
                                    r={4}
                                  />
                                );
                              }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Current Status</h4>
                          <div className="space-y-1 text-sm">
                            <p>Value: <strong>{selectedPattern.currentValue}</strong></p>
                            <p>Normal Range: {selectedPattern.normalRange}</p>
                            <p>Trend: <span className="capitalize">{selectedPattern.trendDirection}</span></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Risk Assessment</h4>
                          <div className="space-y-1 text-sm">
                            <p>Score: <strong>{selectedPattern.degradationScore}/100</strong></p>
                            <p>Risk Level: <span className="capitalize">{selectedPattern.riskLevel}</span></p>
                            <p>Time to Intervention: <strong>{selectedPattern.timeToIntervention}min</strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">AI Recommendations</h4>
                        <ul className="space-y-1">
                          {selectedPattern.interventionRecommendations.map((rec, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <AlertTriangle className="h-3 w-3 text-orange-500" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex gap-2">
                        {selectedPattern.riskLevel === 'critical' && (
                          <Button size="sm" variant="destructive">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Immediate Alert
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Clock className="h-4 w-4 mr-1" />
                          Set Reminder
                        </Button>
                        <Button size="sm" variant="outline">
                          <Activity className="h-4 w-4 mr-1" />
                          View Full History
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a vital pattern to view detailed analysis</p>
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
