import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Server, 
  Database, 
  Globe, 
  Cpu, 
  HardDrive, 
  Wifi, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface Metric {
  name: string;
  value: string | number;
  status: 'good' | 'warning' | 'error';
  trend: 'up' | 'down' | 'stable';
  change: string;
}

interface ServerMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'error';
  threshold: number;
}

const Performance: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [serverMetrics, setServerMetrics] = useState<ServerMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      loadMetrics();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const loadMetrics = () => {
    // Mock data - replace with actual API calls
    setMetrics([
      {
        name: 'Response Time',
        value: '245ms',
        status: 'good',
        trend: 'down',
        change: '-12ms'
      },
      {
        name: 'Uptime',
        value: '99.9%',
        status: 'good',
        trend: 'stable',
        change: '0%'
      },
      {
        name: 'Error Rate',
        value: '0.1%',
        status: 'good',
        trend: 'down',
        change: '-0.05%'
      },
      {
        name: 'Active Users',
        value: '1,234',
        status: 'good',
        trend: 'up',
        change: '+45'
      },
      {
        name: 'API Calls/min',
        value: '2,456',
        status: 'warning',
        trend: 'up',
        change: '+234'
      },
      {
        name: 'Database Queries',
        value: '5,678',
        status: 'good',
        trend: 'up',
        change: '+123'
      }
    ]);

    setServerMetrics([
      {
        name: 'CPU Usage',
        value: 45,
        unit: '%',
        status: 'good',
        threshold: 80
      },
      {
        name: 'Memory Usage',
        value: 67,
        unit: '%',
        status: 'warning',
        threshold: 75
      },
      {
        name: 'Disk Usage',
        value: 23,
        unit: '%',
        status: 'good',
        threshold: 85
      },
      {
        name: 'Network I/O',
        value: 156,
        unit: 'MB/s',
        status: 'good',
        threshold: 500
      }
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100';
      case 'warning': return 'bg-yellow-100';
      case 'error': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`text-lg transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Loading performance data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Performance Monitoring
            </h1>
            <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Real-time monitoring of server and application performance
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              All Systems Operational
            </Badge>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
              }`}
            >
              {isDarkMode ? 'Light' : 'Dark'} Mode
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.slice(0, 4).map((metric, index) => (
            <Card key={index} className={`transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {metric.name}
                    </p>
                    <p className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {metric.value}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(metric.trend)}
                    <span className={`text-sm ${getStatusColor(metric.status)}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Server Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className={`transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <Server className="w-5 h-5" />
                <span>Server Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serverMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {metric.name}
                      </span>
                      <span className={`text-sm font-semibold transition-colors duration-300 ${getStatusColor(metric.status)}`}>
                        {metric.value}{metric.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          metric.status === 'good' ? 'bg-green-500' :
                          metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(metric.value, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        0{metric.unit}
                      </span>
                      <span className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {metric.threshold}{metric.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className={`transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <Database className="w-5 h-5" />
                <span>Database Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-800">Connection Pool</span>
                  </div>
                  <span className="text-sm font-semibold text-green-800">Healthy</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-800">Query Performance</span>
                  </div>
                  <span className="text-sm font-semibold text-green-800">Optimal</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-800">Cache Hit Rate</span>
                  </div>
                  <span className="text-sm font-semibold text-yellow-800">85%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className={`transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <Globe className="w-5 h-5" />
                <span>Network Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Bandwidth Usage
                  </span>
                  <span className={`text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    156 MB/s
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Latency
                  </span>
                  <span className={`text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    12ms
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Packet Loss
                  </span>
                  <span className={`text-sm font-semibold text-green-600`}>
                    0.01%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <Activity className="w-5 h-5" />
                <span>Application Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Memory Usage
                  </span>
                  <span className={`text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    2.4 GB
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    CPU Usage
                  </span>
                  <span className={`text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    45%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Active Connections
                  </span>
                  <span className={`text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    1,234
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Performance;
