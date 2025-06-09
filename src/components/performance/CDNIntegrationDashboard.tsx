
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  MapPin, 
  Zap, 
  TrendingUp,
  RefreshCw,
  Clock,
  HardDrive
} from 'lucide-react';

interface CDNStats {
  totalRequests: number;
  cacheHitRate: number;
  bandwidth: number;
  avgLatency: number;
  dataSaved: number;
  uptime: number;
}

interface CDNRegion {
  id: string;
  name: string;
  location: string;
  status: 'healthy' | 'warning' | 'error';
  latency: number;
  hitRate: number;
  traffic: number;
}

export const CDNIntegrationDashboard = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  const [stats] = useState<CDNStats>({
    totalRequests: 2847293,
    cacheHitRate: 89.4,
    bandwidth: 4.7, // GB/day
    avgLatency: 47, // ms
    dataSaved: 15.6, // GB
    uptime: 99.9
  });

  const [regions] = useState<CDNRegion[]>([
    {
      id: 'us-east',
      name: 'US East',
      location: 'Virginia',
      status: 'healthy',
      latency: 23,
      hitRate: 91.2,
      traffic: 45
    },
    {
      id: 'us-west',
      name: 'US West',
      location: 'California',
      status: 'healthy',
      latency: 28,
      hitRate: 88.7,
      traffic: 32
    },
    {
      id: 'eu-central',
      name: 'EU Central',
      location: 'Frankfurt',
      status: 'warning',
      latency: 52,
      hitRate: 84.3,
      traffic: 23
    },
    {
      id: 'asia-pacific',
      name: 'Asia Pacific',
      location: 'Singapore',
      status: 'healthy',
      latency: 67,
      hitRate: 87.1,
      traffic: 18
    }
  ];

  const optimizeCDN = async () => {
    setIsOptimizing(true);
    
    // Simulate CDN optimization
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsOptimizing(false);
  };

  const purgeCache = async () => {
    setIsPurging(true);
    
    // Simulate cache purge
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsPurging(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRegionFlag = (location: string) => {
    switch (location) {
      case 'Virginia': return '🇺🇸';
      case 'California': return '🇺🇸';
      case 'Frankfurt': return '🇩🇪';
      case 'Singapore': return '🇸🇬';
      default: return '🌐';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          CDN Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Cache Hit Rate</span>
            </div>
            <div className="text-2xl font-bold">{stats.cacheHitRate}%</div>
            <div className="text-sm text-gray-600">{stats.totalRequests.toLocaleString()} requests</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Avg Latency</span>
            </div>
            <div className="text-2xl font-bold">{stats.avgLatency}ms</div>
            <div className="text-sm text-gray-600">global average</div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span>Bandwidth Used</span>
              <span className="font-medium">{stats.bandwidth} GB/day</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Data Saved</span>
              <span className="font-medium">{stats.dataSaved} GB</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span>Uptime</span>
              <span className="font-medium">{stats.uptime}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Hit Rate</span>
              <span className="font-medium">{stats.cacheHitRate}%</span>
            </div>
          </div>
        </div>

        {/* CDN Regions */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Global Edge Locations</h4>
          <div className="space-y-2">
            {regions.map((region) => (
              <div key={region.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getRegionFlag(region.location)}</span>
                    <div>
                      <span className="font-medium text-sm">{region.name}</span>
                      <div className="text-xs text-gray-600">{region.location}</div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(region.status)}>
                    {region.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Latency: </span>
                    <span className="font-medium">{region.latency}ms</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Hit Rate: </span>
                    <span className="font-medium">{region.hitRate}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Traffic: </span>
                    <span className="font-medium">{region.traffic}%</span>
                  </div>
                </div>
                
                <Progress value={region.traffic} className="h-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={optimizeCDN}
            disabled={isOptimizing}
            className="flex-1"
            size="sm"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            {isOptimizing ? 'Optimizing...' : 'Optimize'}
          </Button>
          <Button
            onClick={purgeCache}
            disabled={isPurging}
            variant="outline"
            className="flex-1"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isPurging ? 'animate-spin' : ''}`} />
            {isPurging ? 'Purging...' : 'Purge Cache'}
          </Button>
        </div>

        {/* Performance Benefits */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Performance Benefits</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
            <div>• {stats.dataSaved} GB bandwidth saved</div>
            <div>• {stats.cacheHitRate}% cache efficiency</div>
            <div>• {100 - stats.avgLatency}% faster load times</div>
            <div>• {stats.uptime}% uptime reliability</div>
          </div>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Global edge location network for optimal performance</p>
          <p>• Intelligent cache warming and purging strategies</p>
          <p>• Real-time performance monitoring and optimization</p>
        </div>
      </CardContent>
    </Card>
  );
};
