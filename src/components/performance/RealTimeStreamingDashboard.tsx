
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Wifi, 
  Users, 
  Zap,
  Signal,
  Clock,
  TrendingUp
} from 'lucide-react';

interface StreamingStats {
  activeConnections: number;
  totalMessages: number;
  messagesPerSecond: number;
  bandwidth: number;
  latency: number;
  uptime: number;
}

interface ConnectionData {
  id: string;
  user: string;
  status: 'connected' | 'disconnected' | 'reconnecting';
  latency: number;
  lastSeen: Date;
}

export const RealTimeStreamingDashboard = () => {
  const [stats, setStats] = useState<StreamingStats>({
    activeConnections: 1247,
    totalMessages: 89456,
    messagesPerSecond: 156,
    bandwidth: 2.4, // MB/s
    latency: 23, // ms
    uptime: 99.7
  });

  const [connections, setConnections] = useState<ConnectionData[]>([
    {
      id: '1',
      user: 'Dr. Smith',
      status: 'connected',
      latency: 18,
      lastSeen: new Date()
    },
    {
      id: '2',
      user: 'Nurse Johnson',
      status: 'connected',
      latency: 25,
      lastSeen: new Date()
    },
    {
      id: '3',
      user: 'Admin User',
      status: 'reconnecting',
      latency: 0,
      lastSeen: new Date(Date.now() - 30000)
    }
  ]);

  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeConnections: prev.activeConnections + Math.floor(Math.random() * 10 - 5),
        totalMessages: prev.totalMessages + Math.floor(Math.random() * 50),
        messagesPerSecond: Math.floor(Math.random() * 200) + 100,
        latency: Math.floor(Math.random() * 20) + 15
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const optimizeStreaming = async () => {
    setIsOptimizing(true);
    
    // Simulate optimization
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setStats(prev => ({
      ...prev,
      latency: Math.max(10, prev.latency - 5),
      bandwidth: prev.bandwidth * 1.1
    }));
    
    setIsOptimizing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'disconnected': return 'bg-red-100 text-red-800';
      case 'reconnecting': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const features = [
    'WebSocket connection pooling',
    'Automatic reconnection handling',
    'Message compression and batching',
    'Load balancing across servers',
    'Real-time latency monitoring',
    'Bandwidth optimization'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Real-time Streaming
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Active Connections</span>
            </div>
            <div className="text-2xl font-bold">{stats.activeConnections}</div>
            <div className="text-sm text-gray-600">users online</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Signal className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Latency</span>
            </div>
            <div className="text-2xl font-bold">{stats.latency}ms</div>
            <div className="text-sm text-gray-600">average</div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span>Messages/sec</span>
              <span className="font-medium">{stats.messagesPerSecond}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Bandwidth</span>
              <span className="font-medium">{stats.bandwidth.toFixed(1)} MB/s</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span>Total Messages</span>
              <span className="font-medium">{stats.totalMessages.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Uptime</span>
              <span className="font-medium">{stats.uptime}%</span>
            </div>
          </div>
        </div>

        {/* Uptime Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>System Uptime</span>
            <span>{stats.uptime}%</span>
          </div>
          <Progress value={stats.uptime} className="h-2" />
        </div>

        {/* Active Connections */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Recent Connections</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {connections.map((connection) => (
              <div key={connection.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    connection.status === 'connected' ? 'bg-green-500' :
                    connection.status === 'reconnecting' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span>{connection.user}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(connection.status)}>
                    {connection.status}
                  </Badge>
                  {connection.status === 'connected' && (
                    <span className="text-xs text-gray-500">{connection.latency}ms</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Optimization Features</h4>
          <div className="grid grid-cols-1 gap-1 text-xs">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Zap className="h-3 w-3 text-green-500" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={optimizeStreaming}
            disabled={isOptimizing}
            className="flex-1"
            size="sm"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            {isOptimizing ? 'Optimizing...' : 'Optimize'}
          </Button>
        </div>

        {/* Performance Status */}
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Wifi className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Streaming Healthy</span>
          </div>
          <div className="text-xs text-green-700">
            All systems operational with {stats.latency}ms average latency
          </div>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• WebSocket connection pooling and optimization</p>
          <p>• Automatic failover and reconnection handling</p>
          <p>• Real-time performance monitoring</p>
        </div>
      </CardContent>
    </Card>
  );
};
