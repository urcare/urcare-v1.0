
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, AlertTriangle, CheckCircle, Timer, TrendingUp } from 'lucide-react';

interface SLAMetric {
  id: string;
  patientId: string;
  patientName: string;
  metric: string;
  targetTime: number; // in minutes
  elapsedTime: number;
  status: 'on-track' | 'warning' | 'breached';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startTime: string;
  description: string;
}

const mockSLAMetrics: SLAMetric[] = [
  {
    id: 'SLA001',
    patientId: 'P001',
    patientName: 'John Smith',
    metric: 'Admission to First Assessment',
    targetTime: 30,
    elapsedTime: 25,
    status: 'on-track',
    priority: 'high',
    startTime: '2024-01-22 09:00',
    description: 'Time from admission to initial clinical assessment'
  },
  {
    id: 'SLA002',
    patientId: 'P002',
    patientName: 'Mary Wilson',
    metric: 'Lab Results Turnaround',
    targetTime: 60,
    elapsedTime: 75,
    status: 'breached',
    priority: 'critical',
    startTime: '2024-01-22 08:30',
    description: 'Time from lab order to results availability'
  },
  {
    id: 'SLA003',
    patientId: 'P003',
    patientName: 'Robert Johnson',
    metric: 'Medication Administration',
    targetTime: 15,
    elapsedTime: 12,
    status: 'warning',
    priority: 'medium',
    startTime: '2024-01-22 10:15',
    description: 'Time from prescription to medication delivery'
  }
];

export const PatientSLAEngine = () => {
  const [metrics, setMetrics] = useState<SLAMetric[]>(mockSLAMetrics);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'breached': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const calculateProgress = (elapsed: number, target: number) => {
    return Math.min((elapsed / target) * 100, 100);
  };

  const getProgressColor = (progress: number) => {
    if (progress <= 75) return 'bg-green-500';
    if (progress <= 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Patient-Level SLA Engine
          </CardTitle>
          <CardDescription>
            Real-time tracking of service level agreements for patient care milestones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">24</p>
                    <p className="text-sm text-gray-600">On Track</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">8</p>
                    <p className="text-sm text-gray-600">Warning</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Timer className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">3</p>
                    <p className="text-sm text-gray-600">Breached</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">87%</p>
                    <p className="text-sm text-gray-600">Compliance</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            {metrics.map((metric) => (
              <Card key={metric.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{metric.patientName}</h3>
                      <Badge variant="outline">{metric.patientId}</Badge>
                      <Badge className={getPriorityColor(metric.priority)}>
                        {metric.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{metric.metric}</span>
                      <span className="text-sm text-gray-600">
                        {metric.elapsedTime}/{metric.targetTime} min
                      </span>
                    </div>
                    <Progress 
                      value={calculateProgress(metric.elapsedTime, metric.targetTime)}
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        <strong>Started:</strong> {metric.startTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        <strong>Elapsed:</strong> {metric.elapsedTime} minutes
                      </span>
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">{metric.description}</p>
                  </div>

                  {metric.status === 'breached' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="destructive">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Escalate
                      </Button>
                      <Button size="sm" variant="outline">
                        Add Note
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
