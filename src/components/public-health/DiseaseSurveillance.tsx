
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Search,
  Calendar,
  MapPin,
  BarChart3,
  Bell
} from 'lucide-react';

export const DiseaseSurveillance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('7days');

  const surveillanceData = [
    {
      disease: 'Influenza A',
      currentCases: 156,
      weeklyChange: +12,
      alertStatus: 'warning',
      lastUpdated: '2024-01-20 15:30',
      trend: 'increasing',
      threshold: 140,
      riskLevel: 'medium'
    },
    {
      disease: 'COVID-19',
      currentCases: 89,
      weeklyChange: -8,
      alertStatus: 'normal',
      lastUpdated: '2024-01-20 14:45',
      trend: 'decreasing',
      threshold: 120,
      riskLevel: 'low'
    },
    {
      disease: 'Norovirus',
      currentCases: 45,
      weeklyChange: +18,
      alertStatus: 'alert',
      lastUpdated: '2024-01-20 16:15',
      trend: 'increasing',
      threshold: 30,
      riskLevel: 'high'
    },
    {
      disease: 'Strep Throat',
      currentCases: 78,
      weeklyChange: +3,
      alertStatus: 'normal',
      lastUpdated: '2024-01-20 13:20',
      trend: 'stable',
      threshold: 100,
      riskLevel: 'low'
    }
  ];

  const recentAlerts = [
    {
      time: '14:30',
      disease: 'Influenza A',
      type: 'Threshold Warning',
      message: 'Cases approaching outbreak threshold',
      severity: 'warning'
    },
    {
      time: '12:15',
      disease: 'Norovirus',
      type: 'Outbreak Alert',
      message: 'Cluster detected in university area',
      severity: 'high'
    },
    {
      time: '09:45',
      disease: 'Multiple',
      type: 'System Alert',
      message: 'Reporting delays from 3 facilities',
      severity: 'medium'
    }
  ];

  const monitoringMetrics = {
    totalDiseases: 24,
    activeAlerts: 6,
    thresholdBreaches: 2,
    reportingFacilities: 187,
    dataQuality: 94.5,
    systemUptime: 99.8
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Disease Surveillance</h2>
          <p className="text-gray-600">Real-time monitoring and automated alert generation</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Alert Settings
          </Button>
          <Button className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            View Analytics
          </Button>
        </div>
      </div>

      {/* Surveillance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{monitoringMetrics.totalDiseases}</p>
            <p className="text-sm text-blue-700">Monitored Diseases</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-900">{monitoringMetrics.activeAlerts}</p>
            <p className="text-sm text-red-700">Active Alerts</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-900">{monitoringMetrics.thresholdBreaches}</p>
            <p className="text-sm text-yellow-700">Threshold Breaches</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">{monitoringMetrics.reportingFacilities}</p>
            <p className="text-sm text-green-700">Reporting Facilities</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">{monitoringMetrics.dataQuality}%</p>
            <p className="text-sm text-purple-700">Data Quality</p>
          </CardContent>
        </Card>
        <Card className="border-indigo-200 bg-indigo-50">
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-indigo-900">{monitoringMetrics.systemUptime}%</p>
            <p className="text-sm text-indigo-700">System Uptime</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Disease Monitoring */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Disease Monitoring</CardTitle>
              <CardDescription>Current surveillance status and trends</CardDescription>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search diseases..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 Hours</SelectItem>
                    <SelectItem value="7days">7 Days</SelectItem>
                    <SelectItem value="30days">30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {surveillanceData.map((disease, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{disease.disease}</h4>
                      <Badge className={`${
                        disease.alertStatus === 'alert' ? 'bg-red-500' :
                        disease.alertStatus === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                      } text-white`}>
                        {disease.alertStatus}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Current Cases</p>
                        <p className="font-bold text-gray-900">{disease.currentCases}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Weekly Change</p>
                        <p className={`font-bold ${disease.weeklyChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {disease.weeklyChange >= 0 ? '+' : ''}{disease.weeklyChange}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Threshold</p>
                        <p className="font-bold text-gray-900">{disease.threshold}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Risk Level</p>
                        <p className={`font-bold ${
                          disease.riskLevel === 'high' ? 'text-red-600' :
                          disease.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {disease.riskLevel}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Cases vs Threshold</span>
                        <span>{Math.round((disease.currentCases / disease.threshold) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(disease.currentCases / disease.threshold) * 100} 
                        className="h-2"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Last updated: {disease.lastUpdated}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Latest surveillance system notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAlerts.map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${
                  alert.severity === 'high' ? 'border-l-red-500 bg-red-50' :
                  alert.severity === 'warning' ? 'border-l-yellow-500 bg-yellow-50' : 'border-l-blue-500 bg-blue-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-600">{alert.time}</span>
                        <Badge variant="outline" className="text-xs">
                          {alert.disease}
                        </Badge>
                      </div>
                      <h5 className="font-medium text-gray-900 text-sm">{alert.type}</h5>
                      <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                    </div>
                    <AlertTriangle className={`h-4 w-4 ml-2 ${
                      alert.severity === 'high' ? 'text-red-600' :
                      alert.severity === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
