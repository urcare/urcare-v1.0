
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';

export const AutoScalingDashboard = () => {
  const [cpuThreshold, setCpuThreshold] = useState([70]);
  const [memoryThreshold, setMemoryThreshold] = useState([80]);
  const [minInstances, setMinInstances] = useState([2]);
  const [maxInstances, setMaxInstances] = useState([20]);

  const scalingPolicies = [
    {
      id: 1,
      name: 'Web Server Auto-scaling',
      type: 'Target Tracking',
      metric: 'CPU Utilization',
      threshold: 70,
      currentValue: 45,
      status: 'active',
      instances: { current: 6, min: 2, max: 20 },
      lastScaled: '2 hours ago'
    },
    {
      id: 2,
      name: 'Database Read Replicas',
      type: 'Step Scaling',
      metric: 'Connection Count',
      threshold: 100,
      currentValue: 156,
      status: 'scaling-up',
      instances: { current: 4, min: 1, max: 8 },
      lastScaled: '5 minutes ago'
    },
    {
      id: 3,
      name: 'API Gateway Scaling',
      type: 'Predictive Scaling',
      metric: 'Request Rate',
      threshold: 1000,
      currentValue: 750,
      status: 'scheduled',
      instances: { current: 3, min: 1, max: 15 },
      lastScaled: '30 minutes ago'
    }
  ];

  const scalingHistory = [
    { time: '14:30', action: 'Scale Up', instances: '6 → 8', reason: 'CPU > 80%', cost: '+$2.40/hr' },
    { time: '13:15', action: 'Scale Down', instances: '10 → 6', reason: 'Low Traffic', cost: '-$1.60/hr' },
    { time: '12:00', action: 'Scale Up', instances: '6 → 10', reason: 'Predicted Load', cost: '+$1.60/hr' },
    { time: '10:45', action: 'Scale Down', instances: '8 → 6', reason: 'CPU < 30%', cost: '-$0.80/hr' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'scaling-up': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'scaling-down': return <TrendingDown className="h-4 w-4 text-orange-600" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-purple-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'scaling-up': return 'bg-blue-100 text-blue-800';
      case 'scaling-down': return 'bg-orange-100 text-orange-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Auto-scaling Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">24</div>
              <div className="text-sm text-gray-600">Active Instances</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-gray-600">Scaling Events (24h)</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">$156.80</div>
              <div className="text-sm text-gray-600">Daily Cost</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">89%</div>
              <div className="text-sm text-gray-600">Efficiency Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Scaling Policy Builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">CPU Threshold (%)</label>
              <Slider 
                value={cpuThreshold} 
                onValueChange={setCpuThreshold}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600">
                Scale when CPU exceeds {cpuThreshold[0]}%
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Memory Threshold (%)</label>
              <Slider 
                value={memoryThreshold} 
                onValueChange={setMemoryThreshold}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600">
                Scale when Memory exceeds {memoryThreshold[0]}%
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">Min Instances</label>
                <Slider 
                  value={minInstances} 
                  onValueChange={setMinInstances}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600">
                  {minInstances[0]} instances
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium">Max Instances</label>
                <Slider 
                  value={maxInstances} 
                  onValueChange={setMaxInstances}
                  min={5}
                  max={50}
                  step={1}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600">
                  {maxInstances[0]} instances
                </div>
              </div>
            </div>

            <Button className="w-full">Save Scaling Policy</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Scaling Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scalingPolicies.map((policy) => (
                <Card key={policy.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">{policy.name}</h4>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(policy.status)}
                        <Badge className={getStatusColor(policy.status)}>
                          {policy.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">{policy.metric}</div>
                        <div className="text-gray-600">
                          {policy.currentValue} / {policy.threshold}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">Instances</div>
                        <div className="text-gray-600">
                          {policy.instances.current} ({policy.instances.min}-{policy.instances.max})
                        </div>
                      </div>
                    </div>

                    <Progress 
                      value={(policy.currentValue / policy.threshold) * 100} 
                      className={`h-2 ${
                        policy.currentValue > policy.threshold ? '[&>div]:bg-red-500' :
                        policy.currentValue > policy.threshold * 0.8 ? '[&>div]:bg-yellow-500' :
                        '[&>div]:bg-green-500'
                      }`}
                    />

                    <div className="text-xs text-gray-500">
                      Last scaled: {policy.lastScaled}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Scaling History & Cost Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scalingHistory.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium text-gray-500">{event.time}</div>
                  <div className="flex items-center gap-2">
                    {event.action === 'Scale Up' ? 
                      <TrendingUp className="h-4 w-4 text-blue-600" /> :
                      <TrendingDown className="h-4 w-4 text-orange-600" />
                    }
                    <span className="font-medium">{event.action}</span>
                  </div>
                  <div className="text-sm">{event.instances}</div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-600">{event.reason}</div>
                  <div className={`text-sm font-medium ${
                    event.cost.startsWith('+') ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {event.cost}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
