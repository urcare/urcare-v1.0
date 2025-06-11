
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Cpu, 
  HardDrive, 
  Zap,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export const ResourceAllocationInterface = () => {
  const [cpuAllocation, setCpuAllocation] = useState([60]);
  const [memoryAllocation, setMemoryAllocation] = useState([70]);
  const [storageAllocation, setStorageAllocation] = useState([50]);
  const [networkAllocation, setNetworkAllocation] = useState([40]);

  const resourcePools = [
    {
      name: 'Production Web Servers',
      cpu: { allocated: 120, used: 89, total: 200 },
      memory: { allocated: 480, used: 356, total: 800 },
      storage: { allocated: 2000, used: 1234, total: 4000 },
      cost: 456.80,
      efficiency: 74
    },
    {
      name: 'Database Cluster',
      cpu: { allocated: 80, used: 67, total: 120 },
      memory: { allocated: 320, used: 289, total: 400 },
      storage: { allocated: 1500, used: 1156, total: 2000 },
      cost: 298.40,
      efficiency: 89
    },
    {
      name: 'Development Environment',
      cpu: { allocated: 40, used: 23, total: 80 },
      memory: { allocated: 160, used: 78, total: 200 },
      storage: { allocated: 500, used: 234, total: 1000 },
      cost: 89.60,
      efficiency: 42
    }
  ];

  const forecastData = [
    { period: 'Next Week', cpu: 92, memory: 78, storage: 65, cost: 1245.60 },
    { period: 'Next Month', cpu: 105, memory: 89, storage: 78, cost: 1456.80 },
    { period: 'Next Quarter', cpu: 128, memory: 112, storage: 95, cost: 1789.20 }
  ];

  const optimizationRecommendations = [
    {
      type: 'cost-saving',
      title: 'Reduce Dev Environment Resources',
      description: 'Development servers are underutilized. Reduce allocation by 40%.',
      impact: 'Save $35.84/day',
      priority: 'medium'
    },
    {
      type: 'performance',
      title: 'Scale Database Memory',
      description: 'Database memory usage is approaching limits. Increase allocation.',
      impact: 'Improve response time by 25%',
      priority: 'high'
    },
    {
      type: 'efficiency',
      title: 'Implement Auto-scaling',
      description: 'Web servers show variable load patterns. Enable auto-scaling.',
      impact: 'Increase efficiency by 15%',
      priority: 'medium'
    }
  ];

  const calculateCost = () => {
    const baseCost = 0.12; // per core hour
    const memoryRate = 0.015; // per GB hour
    const storageRate = 0.001; // per GB hour
    
    return (
      (cpuAllocation[0] * baseCost * 24) +
      (memoryAllocation[0] * memoryRate * 24) +
      (storageAllocation[0] * storageRate * 24)
    ).toFixed(2);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Resource Allocation Interface
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">240</div>
              <div className="text-sm text-gray-600">vCPU Cores</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">960GB</div>
              <div className="text-sm text-gray-600">Memory</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">7TB</div>
              <div className="text-sm text-gray-600">Storage</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">$844.80</div>
              <div className="text-sm text-gray-600">Daily Cost</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resource Allocation Planner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                CPU Cores ({cpuAllocation[0]})
              </label>
              <Slider 
                value={cpuAllocation} 
                onValueChange={setCpuAllocation}
                max={200}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Memory ({memoryAllocation[0]}GB)
              </label>
              <Slider 
                value={memoryAllocation} 
                onValueChange={setMemoryAllocation}
                max={500}
                step={10}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                Storage ({storageAllocation[0]}GB)
              </label>
              <Slider 
                value={storageAllocation} 
                onValueChange={setStorageAllocation}
                max={1000}
                step={25}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Network Bandwidth ({networkAllocation[0]}Gbps)</label>
              <Slider 
                value={networkAllocation} 
                onValueChange={setNetworkAllocation}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Estimated Daily Cost:</span>
                <span className="text-xl font-bold text-blue-600">${calculateCost()}</span>
              </div>
            </div>

            <Button className="w-full">Apply Allocation</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Resource Pools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resourcePools.map((pool, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">{pool.name}</h4>
                      <Badge className={
                        pool.efficiency > 80 ? 'bg-green-100 text-green-800' :
                        pool.efficiency > 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {pool.efficiency}% efficient
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <div className="font-medium">CPU</div>
                        <div className="text-gray-600">
                          {pool.cpu.used}/{pool.cpu.allocated}
                        </div>
                        <Progress 
                          value={(pool.cpu.used / pool.cpu.allocated) * 100} 
                          className="h-1 mt-1"
                        />
                      </div>
                      <div>
                        <div className="font-medium">Memory</div>
                        <div className="text-gray-600">
                          {pool.memory.used}GB/{pool.memory.allocated}GB
                        </div>
                        <Progress 
                          value={(pool.memory.used / pool.memory.allocated) * 100} 
                          className="h-1 mt-1"
                        />
                      </div>
                      <div>
                        <div className="font-medium">Storage</div>
                        <div className="text-gray-600">
                          {pool.storage.used}GB/{pool.storage.allocated}GB
                        </div>
                        <Progress 
                          value={(pool.storage.used / pool.storage.allocated) * 100} 
                          className="h-1 mt-1"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm font-medium">Daily Cost:</span>
                      <span className="text-sm font-bold">${pool.cost}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Usage Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {forecastData.map((forecast, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="font-semibold mb-2">{forecast.period}</div>
                  <div className="grid grid-cols-4 gap-3 text-sm">
                    <div>
                      <div className="text-gray-600">CPU</div>
                      <div className="font-medium">{forecast.cpu}%</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Memory</div>
                      <div className="font-medium">{forecast.memory}%</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Storage</div>
                      <div className="font-medium">{forecast.storage}%</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Cost</div>
                      <div className="font-medium">${forecast.cost}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Optimization Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {optimizationRecommendations.map((rec, index) => (
                <Card key={index} className="p-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-sm">{rec.title}</h4>
                      <Badge className={getPriorityColor(rec.priority)}>
                        {rec.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600">{rec.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-green-600">
                        {rec.impact}
                      </span>
                      <Button size="sm" variant="outline">
                        Apply
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
