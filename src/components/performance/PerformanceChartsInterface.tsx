
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Cpu,
  Monitor,
  HardDrive,
  ZoomIn,
  Calendar
} from 'lucide-react';

export const PerformanceChartsInterface = () => {
  const [timeRange, setTimeRange] = useState('1h');
  const [selectedMetrics, setSelectedMetrics] = useState(['cpu', 'memory']);

  // Generate sample data for different time ranges
  const generateData = (range: string) => {
    const points = range === '1h' ? 60 : range === '6h' ? 36 : range === '24h' ? 24 : 7;
    return Array.from({ length: points }, (_, i) => ({
      time: range === '7d' ? `Day ${i + 1}` : `${i}:00`,
      cpu: Math.floor(Math.random() * 40 + 30),
      memory: Math.floor(Math.random() * 30 + 50),
      disk: Math.floor(Math.random() * 20 + 60),
      network: Math.floor(Math.random() * 50 + 25),
      responses: Math.floor(Math.random() * 200 + 100),
      errors: Math.floor(Math.random() * 10 + 1)
    }));
  };

  const [chartData, setChartData] = useState(generateData(timeRange));

  useEffect(() => {
    setChartData(generateData(timeRange));
  }, [timeRange]);

  const timeRanges = [
    { label: '1 Hour', value: '1h' },
    { label: '6 Hours', value: '6h' },
    { label: '24 Hours', value: '24h' },
    { label: '7 Days', value: '7d' }
  ];

  const metrics = [
    { id: 'cpu', label: 'CPU Usage', color: '#3b82f6', icon: Cpu },
    { id: 'memory', label: 'Memory Usage', color: '#10b981', icon: Monitor },
    { id: 'disk', label: 'Disk Usage', color: '#f59e0b', icon: HardDrive },
    { id: 'network', label: 'Network I/O', color: '#8b5cf6', icon: TrendingUp }
  ];

  const responseTimeData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    p50: Math.floor(Math.random() * 100 + 150),
    p90: Math.floor(Math.random() * 200 + 300),
    p95: Math.floor(Math.random() * 300 + 500),
    p99: Math.floor(Math.random() * 500 + 1000)
  }));

  const throughputData = Array.from({ length: 12 }, (_, i) => ({
    time: `${i * 2}:00`,
    requests: Math.floor(Math.random() * 5000 + 2000),
    successful: Math.floor(Math.random() * 4800 + 1900),
    errors: Math.floor(Math.random() * 200 + 50)
  }));

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Charts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">Time Range:</span>
              {timeRanges.map((range) => (
                <Button
                  key={range.value}
                  variant={timeRange === range.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange(range.value)}
                >
                  {range.label}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <ZoomIn className="h-4 w-4" />
              <span className="text-sm font-medium">Metrics:</span>
              {metrics.map((metric) => {
                const IconComponent = metric.icon;
                return (
                  <Badge
                    key={metric.id}
                    variant={selectedMetrics.includes(metric.id) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedMetrics(prev => 
                        prev.includes(metric.id) 
                          ? prev.filter(m => m !== metric.id)
                          : [...prev, metric.id]
                      );
                    }}
                  >
                    <IconComponent className="h-3 w-3 mr-1" />
                    {metric.label}
                  </Badge>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Metrics Chart */}
      <Card>
        <CardHeader>
          <CardTitle>System Resource Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              cpu: { label: 'CPU Usage', color: '#3b82f6' },
              memory: { label: 'Memory Usage', color: '#10b981' },
              disk: { label: 'Disk Usage', color: '#f59e0b' },
              network: { label: 'Network I/O', color: '#8b5cf6' }
            }}
            className="h-80"
          >
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              {selectedMetrics.map((metricId) => {
                const metric = metrics.find(m => m.id === metricId);
                return (
                  <Line
                    key={metricId}
                    type="monotone"
                    dataKey={metricId}
                    stroke={metric?.color}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                );
              })}
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Response Time Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Response Time Percentiles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                p50: { label: '50th percentile', color: '#10b981' },
                p90: { label: '90th percentile', color: '#f59e0b' },
                p95: { label: '95th percentile', color: '#ef4444' },
                p99: { label: '99th percentile', color: '#dc2626' }
              }}
              className="h-64"
            >
              <AreaChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="p99" stackId="1" stroke="#dc2626" fill="#dc2626" fillOpacity={0.3} />
                <Area type="monotone" dataKey="p95" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.4} />
                <Area type="monotone" dataKey="p90" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.5} />
                <Area type="monotone" dataKey="p50" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Request Throughput
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                requests: { label: 'Total Requests', color: '#3b82f6' },
                successful: { label: 'Successful', color: '#10b981' },
                errors: { label: 'Errors', color: '#ef4444' }
              }}
              className="h-64"
            >
              <BarChart data={throughputData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="successful" fill="#10b981" />
                <Bar dataKey="errors" fill="#ef4444" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">245ms</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
              <div className="text-xs text-green-600">↓ 12% from last hour</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">99.7%</div>
              <div className="text-sm text-gray-600">Availability</div>
              <div className="text-xs text-green-600">↑ 0.1% from yesterday</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">2.4K</div>
              <div className="text-sm text-gray-600">Requests/min</div>
              <div className="text-xs text-green-600">↑ 8% from last hour</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">0.03%</div>
              <div className="text-sm text-gray-600">Error Rate</div>
              <div className="text-xs text-red-600">↑ 0.01% from last hour</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
