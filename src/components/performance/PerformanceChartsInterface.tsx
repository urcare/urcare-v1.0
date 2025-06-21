
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Clock,
  Download,
  Calendar,
  Filter
} from 'lucide-react';

export const PerformanceChartsInterface = () => {
  const [timeframe, setTimeframe] = useState('24hours');
  const [selectedMetric, setSelectedMetric] = useState('response-time');

  const responseTimeData = [
    { time: '00:00', value: 245, target: 300 },
    { time: '04:00', value: 156, target: 300 },
    { time: '08:00', value: 387, target: 300 },
    { time: '12:00', value: 523, target: 300 },
    { time: '16:00', value: 445, target: 300 },
    { time: '20:00', value: 312, target: 300 },
    { time: '24:00', value: 198, target: 300 }
  ];

  const throughputData = [
    { time: '00:00', requests: 1200, successful: 1165, errors: 35 },
    { time: '04:00', requests: 890, successful: 875, errors: 15 },
    { time: '08:00', requests: 2340, successful: 2298, errors: 42 },
    { time: '12:00', requests: 3450, successful: 3380, errors: 70 },
    { time: '16:00', requests: 2890, successful: 2845, errors: 45 },
    { time: '20:00', requests: 1980, successful: 1955, errors: 25 },
    { time: '24:00', requests: 1340, successful: 1325, errors: 15 }
  ];

  const resourceUsageData = [
    { time: '00:00', cpu: 45, memory: 62, disk: 78 },
    { time: '04:00', cpu: 32, memory: 58, disk: 76 },
    { time: '08:00', cpu: 67, memory: 74, disk: 82 },
    { time: '12:00', cpu: 89, memory: 85, disk: 78 },
    { time: '16:00', cpu: 76, memory: 79, disk: 80 },
    { time: '20:00', cpu: 54, memory: 68, disk: 79 },
    { time: '24:00', cpu: 41, memory: 61, disk: 77 }
  ];

  const errorRateData = [
    { time: '00:00', rate: 2.8, threshold: 5.0 },
    { time: '04:00', rate: 1.2, threshold: 5.0 },
    { time: '08:00', rate: 3.4, threshold: 5.0 },
    { time: '12:00', rate: 4.8, threshold: 5.0 },
    { time: '16:00', rate: 3.9, threshold: 5.0 },
    { time: '20:00', rate: 2.1, threshold: 5.0 },
    { time: '24:00', rate: 1.6, threshold: 5.0 }
  ];

  const getChartData = () => {
    switch (selectedMetric) {
      case 'response-time':
        return responseTimeData;
      case 'throughput':
        return throughputData;
      case 'resource-usage':
        return resourceUsageData;
      case 'error-rate':
        return errorRateData;
      default:
        return responseTimeData;
    }
  };

  const renderChart = () => {
    const data = getChartData();

    switch (selectedMetric) {
      case 'response-time':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} name="Response Time (ms)" />
              <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" name="Target (ms)" />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'throughput':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="successful" stackId="1" stroke="#10b981" fill="#10b981" name="Successful Requests" />
              <Area type="monotone" dataKey="errors" stackId="1" stroke="#ef4444" fill="#ef4444" name="Failed Requests" />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'resource-usage':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} name="CPU %" />
              <Line type="monotone" dataKey="memory" stroke="#10b981" strokeWidth={2} name="Memory %" />
              <Line type="monotone" dataKey="disk" stroke="#f59e0b" strokeWidth={2} name="Disk %" />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'error-rate':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="rate" fill="#ef4444" name="Error Rate %" />
              <Line type="monotone" dataKey="threshold" stroke="#f59e0b" strokeDasharray="5 5" name="Threshold" />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const getMetricTitle = () => {
    switch (selectedMetric) {
      case 'response-time':
        return 'API Response Time';
      case 'throughput':
        return 'Request Throughput';
      case 'resource-usage':
        return 'System Resource Usage';
      case 'error-rate':
        return 'Error Rate Analysis';
      default:
        return 'Performance Metrics';
    }
  };

  const getMetricDescription = () => {
    switch (selectedMetric) {
      case 'response-time':
        return 'Average API response times across all endpoints';
      case 'throughput':
        return 'Total requests processed and success/error breakdown';
      case 'resource-usage':
        return 'CPU, memory, and disk utilization over time';
      case 'error-rate':
        return 'Error rate percentage and threshold monitoring';
      default:
        return 'System performance visualization';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-indigo-50 to-cyan-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-indigo-600" />
            Performance Charts & Analytics
          </CardTitle>
          <CardDescription>
            Visual analysis of system performance metrics and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="response-time">Response Time</SelectItem>
                  <SelectItem value="throughput">Throughput</SelectItem>
                  <SelectItem value="resource-usage">Resource Usage</SelectItem>
                  <SelectItem value="error-rate">Error Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1hour">1 Hour</SelectItem>
                  <SelectItem value="24hours">24 Hours</SelectItem>
                  <SelectItem value="7days">7 Days</SelectItem>
                  <SelectItem value="30days">30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{getMetricTitle()}</CardTitle>
              <CardDescription>{getMetricDescription()}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Live Data
              </Badge>
              <Badge variant="outline">
                Last updated: 30s ago
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderChart()}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Current Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Response Time</span>
                <span className="font-bold text-blue-600">245ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Throughput</span>
                <span className="font-bold text-green-600">1,247 req/min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Error Rate</span>
                <span className="font-bold text-orange-600">2.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">CPU Usage</span>
                <span className="font-bold text-purple-600">67%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">vs. Last Hour</span>
                <span className="font-bold text-green-600">+12%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">vs. Yesterday</span>
                <span className="font-bold text-red-600">-5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">vs. Last Week</span>
                <span className="font-bold text-green-600">+18%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Peak Performance</span>
                <span className="font-bold text-blue-600">3.2k req/min</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Time-based Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Peak Hours</p>
                <p className="font-bold">12:00 PM - 2:00 PM</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Low Activity</p>
                <p className="font-bold">2:00 AM - 6:00 AM</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Best Performance</p>
                <p className="font-bold">Early Morning</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Maintenance Window</p>
                <p className="font-bold">3:00 AM - 4:00 AM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
