
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  RefreshCw, 
  Trash2, 
  Clock,
  HardDrive,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface CacheStats {
  totalSize: number;
  usedSize: number;
  hitRate: number;
  missRate: number;
  evictions: number;
  entries: number;
}

interface CacheLayer {
  id: string;
  name: string;
  type: 'memory' | 'redis' | 'database' | 'cdn';
  size: number;
  hitRate: number;
  status: 'healthy' | 'warning' | 'error';
}

export const CacheManagementDashboard = () => {
  const [isClearing, setIsClearing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [stats] = useState<CacheStats>({
    totalSize: 2048, // MB
    usedSize: 1456, // MB
    hitRate: 87.3,
    missRate: 12.7,
    evictions: 234,
    entries: 15847
  });

  const [cacheLayers] = useState<CacheLayer[]>([
    {
      id: 'memory',
      name: 'Memory Cache',
      type: 'memory',
      size: 512,
      hitRate: 94.2,
      status: 'healthy'
    },
    {
      id: 'redis',
      name: 'Redis Cache',
      type: 'redis',
      size: 1024,
      hitRate: 89.1,
      status: 'healthy'
    },
    {
      id: 'database',
      name: 'Database Cache',
      type: 'database',
      size: 256,
      hitRate: 76.4,
      status: 'warning'
    },
    {
      id: 'cdn',
      name: 'CDN Cache',
      type: 'cdn',
      size: 2048,
      hitRate: 91.8,
      status: 'healthy'
    }
  ]);

  const clearCache = async (layerId?: string) => {
    setIsClearing(true);
    
    // Simulate cache clearing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsClearing(false);
  };

  const refreshCache = async () => {
    setIsRefreshing(true);
    
    // Simulate cache refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'memory': return '🧠';
      case 'redis': return '⚡';
      case 'database': return '🗄️';
      case 'cdn': return '🌐';
      default: return '💾';
    }
  };

  const usagePercentage = (stats.usedSize / stats.totalSize) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Cache Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Hit Rate</span>
            </div>
            <div className="text-2xl font-bold">{stats.hitRate}%</div>
            <div className="text-sm text-gray-600">{stats.entries} entries</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Cache Usage</span>
            </div>
            <div className="text-2xl font-bold">{Math.round(usagePercentage)}%</div>
            <div className="text-sm text-gray-600">{stats.usedSize}MB / {stats.totalSize}MB</div>
          </div>
        </div>

        {/* Usage Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Storage Usage</span>
            <span>{stats.usedSize}MB / {stats.totalSize}MB</span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
        </div>

        {/* Cache Layers */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Cache Layers</h4>
          <div className="space-y-2">
            {cacheLayers.map((layer) => (
              <div key={layer.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getTypeIcon(layer.type)}</span>
                    <span className="font-medium text-sm">{layer.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(layer.status)}>
                      {layer.status}
                    </Badge>
                    <Button
                      onClick={() => clearCache(layer.id)}
                      disabled={isClearing}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Hit Rate: </span>
                    <span className="font-medium">{layer.hitRate}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Size: </span>
                    <span className="font-medium">{layer.size}MB</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="p-3 bg-gray-50 rounded-lg space-y-2">
          <h4 className="font-medium text-sm">Performance Metrics</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span>Cache Hits</span>
              <span className="font-medium text-green-600">{stats.hitRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Cache Misses</span>
              <span className="font-medium text-red-600">{stats.missRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Evictions</span>
              <span className="font-medium">{stats.evictions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total Entries</span>
              <span className="font-medium">{stats.entries.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={refreshCache}
            disabled={isRefreshing}
            variant="outline"
            className="flex-1"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button
            onClick={() => clearCache()}
            disabled={isClearing}
            variant="outline"
            className="flex-1"
            size="sm"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isClearing ? 'Clearing...' : 'Clear All'}
          </Button>
        </div>

        {/* Cache Health Warning */}
        {cacheLayers.some(layer => layer.status === 'warning') && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <div className="text-sm">
              <span className="font-medium text-yellow-800">Cache Performance Warning</span>
              <p className="text-yellow-700">Database cache hit rate is below optimal threshold</p>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Multi-layered caching with intelligent invalidation</p>
          <p>• Redis integration for high-performance caching</p>
          <p>• Automatic eviction policies and optimization</p>
        </div>
      </CardContent>
    </Card>
  );
};
