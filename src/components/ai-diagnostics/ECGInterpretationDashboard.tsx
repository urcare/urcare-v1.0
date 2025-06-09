
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity,
  Heart,
  AlertTriangle,
  TrendingUp,
  Clock,
  Zap,
  Play,
  Pause,
  Download
} from 'lucide-react';

export const ECGInterpretationDashboard = () => {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [currentReading, setCurrentReading] = useState({
    heartRate: 78,
    rhythm: 'Sinus Rhythm',
    intervals: {
      pr: 160,
      qrs: 95,
      qt: 380
    },
    confidence: 96.4
  });

  const [arrhythmiaAlerts] = useState([
    {
      type: 'Atrial Fibrillation',
      severity: 'High',
      time: '14:23:15',
      confidence: 94.7,
      patient: 'Patient #4821'
    },
    {
      type: 'Premature Ventricular Contractions',
      severity: 'Medium',
      time: '14:18:42',
      confidence: 89.2,
      patient: 'Patient #4819'
    },
    {
      type: 'Bradycardia',
      severity: 'Low',
      time: '14:15:30',
      confidence: 92.8,
      patient: 'Patient #4817'
    }
  ]);

  const [trendData] = useState([
    { time: '14:00', heartRate: 72, confidence: 95.2 },
    { time: '14:05', heartRate: 75, confidence: 96.1 },
    { time: '14:10', heartRate: 78, confidence: 94.8 },
    { time: '14:15', heartRate: 76, confidence: 96.4 },
    { time: '14:20', heartRate: 80, confidence: 95.7 },
    { time: '14:25', heartRate: 78, confidence: 96.4 }
  ]);

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        setCurrentReading(prev => ({
          ...prev,
          heartRate: Math.max(60, Math.min(100, prev.heartRate + (Math.random() - 0.5) * 4)),
          confidence: Math.max(90, Math.min(100, prev.confidence + (Math.random() - 0.5) * 2))
        }));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'border-red-300 text-red-700 bg-red-50';
      case 'Medium': return 'border-yellow-300 text-yellow-700 bg-yellow-50';
      case 'Low': return 'border-green-300 text-green-700 bg-green-50';
      default: return 'border-gray-300 text-gray-700 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Monitoring Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{currentReading.heartRate}</div>
                <div className="text-sm text-gray-600">BPM</div>
              </div>
              <Heart className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-medium text-green-600">{currentReading.rhythm}</div>
            <div className="text-sm text-gray-600">Current Rhythm</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{currentReading.confidence}%</div>
            <div className="text-sm text-gray-600">AI Confidence</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={isMonitoring ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
              >
                {isMonitoring ? (
                  <>
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    Start
                  </>
                )}
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ECG Intervals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            ECG Intervals & Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">PR Interval</span>
                  <Badge variant="outline" className="border-green-300 text-green-700">Normal</Badge>
                </div>
                <div className="text-2xl font-bold text-blue-600">{currentReading.intervals.pr}ms</div>
                <div className="text-sm text-gray-600">Normal: 120-200ms</div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">QRS Duration</span>
                  <Badge variant="outline" className="border-green-300 text-green-700">Normal</Badge>
                </div>
                <div className="text-2xl font-bold text-blue-600">{currentReading.intervals.qrs}ms</div>
                <div className="text-sm text-gray-600">Normal: 80-120ms</div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">QT Interval</span>
                  <Badge variant="outline" className="border-green-300 text-green-700">Normal</Badge>
                </div>
                <div className="text-2xl font-bold text-blue-600">{currentReading.intervals.qt}ms</div>
                <div className="text-sm text-gray-600">Normal: 350-450ms</div>
              </div>
            </div>

            {/* ECG Waveform Simulation */}
            <div className="md:col-span-2">
              <div className="p-4 border rounded-lg bg-black text-green-400 h-64 flex items-center justify-center">
                <div className="text-center">
                  <Activity className="h-16 w-16 mx-auto mb-4 animate-pulse" />
                  <div className="text-lg font-mono">Real-time ECG Waveform</div>
                  <div className="text-sm opacity-75">Live monitoring active</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Arrhythmia Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Arrhythmia Detection Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {arrhythmiaAlerts.map((alert, index) => (
              <div key={index} className={`p-4 border rounded-lg ${getSeverityColor(alert.severity)}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium">{alert.type}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                      {alert.severity} Priority
                    </Badge>
                    <Badge variant="outline" className="border-blue-300 text-blue-700">
                      {alert.confidence}% Confidence
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Patient:</span> {alert.patient}
                  </div>
                  <div>
                    <span className="text-gray-600">Time:</span> {alert.time}
                  </div>
                  <div>
                    <Button size="sm">
                      <Zap className="h-3 w-3 mr-1" />
                      Review
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Heart Rate Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-6 gap-4">
              {trendData.map((data, index) => (
                <div key={index} className="text-center p-3 border rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{data.heartRate}</div>
                  <div className="text-xs text-gray-600 mb-1">{data.time}</div>
                  <div className="text-xs text-green-600">{data.confidence}%</div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                AI Trend Analysis: Heart rate showing normal variability with stable rhythm patterns
              </div>
              <Button size="sm" variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                View Historical
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
