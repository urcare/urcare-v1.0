
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  Map, 
  Activity,
  Zap,
  TrendingUp,
  Shield,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const GlobalTrafficManagement = () => {
  const [selectedRegion, setSelectedRegion] = useState('us-east-1');

  const regions = [
    {
      id: 'us-east-1',
      name: 'US East (N. Virginia)',
      traffic: 45.2,
      latency: 23,
      status: 'healthy',
      cacheHitRate: 94.5,
      bandwidth: 2.4,
      cost: 156.80
    },
    {
      id: 'eu-west-1',
      name: 'EU West (Ireland)',
      traffic: 28.7,
      latency: 34,
      status: 'healthy',
      cacheHitRate: 91.2,
      bandwidth: 1.8,
      cost: 123.40
    },
    {
      id: 'ap-southeast-1',
      name: 'Asia Pacific (Singapore)',
      traffic: 18.3,
      latency: 89,
      status: 'warning',
      cacheHitRate: 87.3,
      bandwidth: 1.2,
      cost: 98.60
    },
    {
      id: 'us-west-2',
      name: 'US West (Oregon)',
      traffic: 7.8,
      latency: 28,
      status: 'healthy',
      cacheHitRate: 93.1,
      bandwidth: 0.6,
      cost: 67.20
    }
  ];

  const cdnNodes = [
    { city: 'New York', country: 'US', requests: 12500, latency: 18, status: 'healthy' },
    { city: 'London', country: 'UK', requests: 9800, latency: 24, status: 'healthy' },
    { city: 'Tokyo', country: 'JP', requests: 8200, latency: 45, status: 'healthy' },
    { city: 'Singapore', country: 'SG', requests: 6700, latency: 67, status: 'warning' },
    { city: 'Frankfurt', country: 'DE', requests: 5400, latency: 21, status: 'healthy' },
    { city: 'Sydney', country: 'AU', requests: 3200, latency: 89, status: 'warning' }
  ];

  const trafficRouting = [
    { source: 'North America', target: 'us-east-1', percentage: 65, latency: 23 },
    { source: 'North America', target: 'us-west-2', percentage: 35, latency: 28 },
    { source: 'Europe', target: 'eu-west-1', percentage: 85, latency: 34 },
    { source: 'Europe', target: 'us-east-1', percentage: 15, latency: 89 },
    { source: 'Asia Pacific', target: 'ap-southeast-1', percentage: 70, latency: 45 },
    { source: 'Asia Pacific', target: 'us-west-2', percentage: 30, latency: 156 }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': 
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': 
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': 
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: 
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Global Traffic Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">6.2TB</div>
              <div className="text-sm text-gray-600">Global Bandwidth</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">92.1%</div>
              <div className="text-sm text-gray-600">Cache Hit Rate</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">34ms</div>
              <div className="text-sm text-gray-600">Global Avg Latency</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">$446.00</div>
              <div className="text-sm text-gray-600">Daily CDN Cost</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              Regional Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {regions.map((region) => (
                <Card 
                  key={region.id} 
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedRegion === region.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedRegion(region.id)}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">{region.name}</h4>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(region.status)}
                        <Badge className={getStatusColor(region.status)}>
                          {region.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Traffic Share</div>
                        <div className="text-gray-600">{region.traffic}%</div>
                      </div>
                      <div>
                        <div className="font-medium">Latency</div>
                        <div className="text-gray-600">{region.latency}ms</div>
                      </div>
                      <div>
                        <div className="font-medium">Cache Hit Rate</div>
                        <div className="text-gray-600">{region.cacheHitRate}%</div>
                      </div>
                      <div>
                        <div className="font-medium">Bandwidth</div>
                        <div className="text-gray-600">{region.bandwidth}GB/s</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Capacity Usage</span>
                        <span>{region.traffic}%</span>
                      </div>
                      <Progress 
                        value={region.traffic} 
                        className={`h-2 ${
                          region.traffic > 80 ? '[&>div]:bg-red-500' :
                          region.traffic > 60 ? '[&>div]:bg-yellow-500' :
                          '[&>div]:bg-green-500'
                        }`}
                      />
                    </div>

                    <div className="text-xs text-gray-500">
                      Daily cost: ${region.cost}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CDN Edge Nodes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cdnNodes.map((node, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">{node.city}</div>
                      <div className="text-sm text-gray-600">{node.country}</div>
                    </div>
                    {getStatusIcon(node.status)}
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium">{node.requests.toLocaleString()} req/min</div>
                    <div className="text-sm text-gray-600">{node.latency}ms latency</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Routing Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficRouting.map((route, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{route.source} → {route.target}</div>
                    <div className="text-sm text-gray-600">{route.percentage}%</div>
                  </div>
                  
                  <Progress value={route.percentage} className="h-2" />
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Latency: {route.latency}ms</span>
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Failover Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Primary Failover Rules</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Health Check Interval:</span>
                  <span className="font-medium">30 seconds</span>
                </div>
                <div className="flex justify-between">
                  <span>Failure Threshold:</span>
                  <span className="font-medium">3 consecutive failures</span>
                </div>
                <div className="flex justify-between">
                  <span>Failover Time:</span>
                  <span className="font-medium">&lt; 60 seconds</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Regional Failover Priority</h4>
              <div className="space-y-2">
                <div className="p-2 border rounded flex justify-between items-center">
                  <span>US East → US West</span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="p-2 border rounded flex justify-between items-center">
                  <span>EU West → US East</span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="p-2 border rounded flex justify-between items-center">
                  <span>AP Southeast → US West</span>
                  <Badge variant="outline">Active</Badge>
                </div>
              </div>
            </div>

            <Button className="w-full">Test Failover Scenario</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
