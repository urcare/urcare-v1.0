import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Server, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Globe,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Clock,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

interface ServerInfo {
  name: string;
  url: string;
  status: 'online' | 'offline' | 'degraded';
  responseTime: number;
  uptime: string;
  lastChecked: string;
  region: string;
  version: string;
  resources: {
    cpu: number;
    memory: number;
    disk: number;
  };
}

interface ServerStatusProps {
  onRefresh?: () => void;
}

const ServerStatus: React.FC<ServerStatusProps> = ({ onRefresh }) => {
  const [servers, setServers] = useState<ServerInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<string>('');

  // Mock server data - replace with actual API calls
  const mockServers: ServerInfo[] = [
    {
      name: 'Main API Server',
      url: 'https://urcare-server.vercel.app',
      status: 'online',
      responseTime: 245,
      uptime: '99.9%',
      lastChecked: new Date().toISOString(),
      region: 'us-east-1',
      version: 'v1.2.3',
      resources: {
        cpu: 45,
        memory: 67,
        disk: 23
      }
    },
    {
      name: 'Database Server',
      url: 'https://lvnkpserdydhnqbigfbz.supabase.co',
      status: 'online',
      responseTime: 89,
      uptime: '99.8%',
      lastChecked: new Date().toISOString(),
      region: 'us-west-2',
      version: 'v2.1.0',
      resources: {
        cpu: 23,
        memory: 45,
        disk: 67
      }
    },
    {
      name: 'CDN Server',
      url: 'https://cdn.urcare.com',
      status: 'degraded',
      responseTime: 1200,
      uptime: '98.5%',
      lastChecked: new Date().toISOString(),
      region: 'eu-west-1',
      version: 'v1.0.5',
      resources: {
        cpu: 78,
        memory: 89,
        disk: 34
      }
    },
    {
      name: 'WebSocket Server',
      url: 'wss://ws.urcare.com',
      status: 'offline',
      responseTime: 0,
      uptime: '0%',
      lastChecked: new Date().toISOString(),
      region: 'ap-south-1',
      version: 'v1.1.2',
      resources: {
        cpu: 0,
        memory: 0,
        disk: 0
      }
    }
  ];

  // Check server status
  const checkServerStatus = async (server: ServerInfo): Promise<ServerInfo> => {
    try {
      const startTime = Date.now();
      const response = await fetch(server.url, { 
        method: 'HEAD',
        mode: 'no-cors' // For CORS issues
      });
      const responseTime = Date.now() - startTime;
      
      return {
        ...server,
        status: responseTime < 1000 ? 'online' : 'degraded',
        responseTime,
        lastChecked: new Date().toISOString()
      };
    } catch (error) {
      return {
        ...server,
        status: 'offline',
        responseTime: 0,
        lastChecked: new Date().toISOString()
      };
    }
  };

  // Load server status
  const loadServerStatus = async () => {
    setIsLoading(true);
    try {
      // Check each server status
      const updatedServers = await Promise.all(
        mockServers.map(server => checkServerStatus(server))
      );
      
      setServers(updatedServers);
      setLastRefresh(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error checking server status:', error);
      toast.error('Failed to check server status');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadServerStatus();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Refresh handler
  const handleRefresh = () => {
    loadServerStatus();
    if (onRefresh) onRefresh();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'offline':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getResponseTimeColor = (responseTime: number) => {
    if (responseTime < 200) return 'text-green-600';
    if (responseTime < 500) return 'text-yellow-600';
    return 'text-red-600';
  };

  const overallStatus = servers.length > 0 
    ? servers.every(s => s.status === 'online') 
      ? 'online' 
      : servers.some(s => s.status === 'offline') 
        ? 'offline' 
        : 'degraded'
    : 'unknown';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Server className="w-6 h-6" />
            Server Status
          </h2>
          <p className="text-gray-600">Monitor server health and performance</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Last updated: {lastRefresh || 'Never'}
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getStatusIcon(overallStatus)}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Overall Status</h3>
                <p className="text-sm text-gray-600">
                  {servers.length} servers monitored
                </p>
              </div>
            </div>
            <Badge className={getStatusColor(overallStatus)}>
              {overallStatus.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Server List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {servers.map((server, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(server.status)}
                  <div>
                    <CardTitle className="text-lg">{server.name}</CardTitle>
                    <p className="text-sm text-gray-600">{server.url}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(server.status)}>
                  {server.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Response Time</p>
                  <p className={`font-semibold ${getResponseTimeColor(server.responseTime)}`}>
                    {server.responseTime}ms
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Uptime</p>
                  <p className="font-semibold text-gray-900">{server.uptime}</p>
                </div>
                <div>
                  <p className="text-gray-600">Region</p>
                  <p className="font-semibold text-gray-900">{server.region}</p>
                </div>
                <div>
                  <p className="text-gray-600">Version</p>
                  <p className="font-semibold text-gray-900">{server.version}</p>
                </div>
              </div>

              {/* Resource Usage */}
              {server.status !== 'offline' && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Resource Usage</h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-blue-600" />
                        <span>CPU</span>
                      </div>
                      <span className="font-medium">{server.resources.cpu}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${server.resources.cpu}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-green-600" />
                        <span>Memory</span>
                      </div>
                      <span className="font-medium">{server.resources.memory}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${server.resources.memory}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-orange-600" />
                        <span>Disk</span>
                      </div>
                      <span className="font-medium">{server.resources.disk}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${server.resources.disk}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Last Checked */}
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Last checked: {new Date(server.lastChecked).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              onClick={() => window.open('https://vercel.com/dashboard', '_blank')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              Vercel Dashboard
            </Button>
            <Button
              onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Database className="w-4 h-4" />
              Supabase Dashboard
            </Button>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Check All Servers
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServerStatus;


