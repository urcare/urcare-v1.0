
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Server, 
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Globe
} from 'lucide-react';

export const LoadBalancerManagement = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('round-robin');

  const loadBalancers = [
    {
      id: 1,
      name: 'Web-LB-Primary',
      algorithm: 'Round Robin',
      status: 'healthy',
      requests: 15420,
      errors: 12,
      latency: 45,
      targets: 8,
      healthyTargets: 7
    },
    {
      id: 2,
      name: 'API-LB-Gateway',
      algorithm: 'Least Connections',
      status: 'healthy',
      requests: 8934,
      errors: 3,
      latency: 62,
      targets: 6,
      healthyTargets: 6
    },
    {
      id: 3,
      name: 'DB-LB-Cluster',
      algorithm: 'Weighted Round Robin',
      status: 'warning',
      requests: 3245,
      errors: 45,
      latency: 123,
      targets: 4,
      healthyTargets: 3
    }
  ];

  const servers = [
    { id: 1, name: 'web-01', ip: '10.0.1.10', status: 'healthy', cpu: 45, memory: 67, connections: 245 },
    { id: 2, name: 'web-02', ip: '10.0.1.11', status: 'healthy', cpu: 52, memory: 71, connections: 189 },
    { id: 3, name: 'web-03', ip: '10.0.1.12', status: 'healthy', cpu: 38, memory: 59, connections: 312 },
    { id: 4, name: 'web-04', ip: '10.0.1.13', status: 'unhealthy', cpu: 89, memory: 95, connections: 0 },
    { id: 5, name: 'api-01', ip: '10.0.2.10', status: 'healthy', cpu: 34, memory: 42, connections: 156 },
    { id: 6, name: 'api-02', ip: '10.0.2.11', status: 'healthy', cpu: 29, memory: 38, connections: 134 }
  ];

  const algorithms = [
    { id: 'round-robin', name: 'Round Robin', description: 'Equal distribution across servers' },
    { id: 'least-connections', name: 'Least Connections', description: 'Route to server with fewest connections' },
    { id: 'weighted', name: 'Weighted Round Robin', description: 'Route based on server capacity weights' },
    { id: 'ip-hash', name: 'IP Hash', description: 'Route based on client IP hash' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'unhealthy': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'unhealthy': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Load Balancer Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">27,599</div>
              <div className="text-sm text-gray-600">Total Requests/min</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">99.8%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">67ms</div>
              <div className="text-sm text-gray-600">Avg Latency</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">16/18</div>
              <div className="text-sm text-gray-600">Healthy Targets</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Load Balancer Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label className="text-sm font-medium">Load Balancing Algorithm</label>
              <div className="grid grid-cols-1 gap-2">
                {algorithms.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedAlgorithm === algorithm.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedAlgorithm(algorithm.id)}
                  >
                    <div className="font-medium">{algorithm.name}</div>
                    <div className="text-sm text-gray-600">{algorithm.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Health Check Settings</label>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Check Interval:</span>
                  <span className="font-medium">30 seconds</span>
                </div>
                <div className="flex justify-between">
                  <span>Timeout:</span>
                  <span className="font-medium">5 seconds</span>
                </div>
                <div className="flex justify-between">
                  <span>Unhealthy Threshold:</span>
                  <span className="font-medium">3 failures</span>
                </div>
                <div className="flex justify-between">
                  <span>Healthy Threshold:</span>
                  <span className="font-medium">2 successes</span>
                </div>
              </div>
            </div>

            <Button className="w-full">Update Configuration</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Load Balancer Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loadBalancers.map((lb) => (
                <Card key={lb.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">{lb.name}</h4>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(lb.status)}
                        <Badge className={getStatusColor(lb.status)}>
                          {lb.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Algorithm</div>
                        <div className="text-gray-600">{lb.algorithm}</div>
                      </div>
                      <div>
                        <div className="font-medium">Targets</div>
                        <div className="text-gray-600">
                          {lb.healthyTargets}/{lb.targets} healthy
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">Requests/min</div>
                        <div className="text-gray-600">{lb.requests.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="font-medium">Errors</div>
                        <div className="text-gray-600">{lb.errors}</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Latency</span>
                        <span>{lb.latency}ms</span>
                      </div>
                      <Progress 
                        value={Math.min((lb.latency / 200) * 100, 100)} 
                        className={`h-2 ${
                          lb.latency > 100 ? '[&>div]:bg-red-500' :
                          lb.latency > 50 ? '[&>div]:bg-yellow-500' :
                          '[&>div]:bg-green-500'
                        }`}
                      />
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
            <Server className="h-5 w-5" />
            Target Server Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {servers.map((server) => (
              <Card key={server.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{server.name}</h4>
                      <div className="text-sm text-gray-600">{server.ip}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(server.status)}
                      <Badge className={getStatusColor(server.status)}>
                        {server.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>CPU</span>
                        <span>{server.cpu}%</span>
                      </div>
                      <Progress value={server.cpu} className="h-2" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Memory</span>
                        <span>{server.memory}%</span>
                      </div>
                      <Progress value={server.memory} className="h-2" />
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Connections</span>
                      <span className="font-medium">{server.connections}</span>
                    </div>
                  </div>

                  {server.status === 'unhealthy' && (
                    <Button size="sm" variant="outline" className="w-full">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restart Health Check
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
