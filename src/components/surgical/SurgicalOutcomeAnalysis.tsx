
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, AlertTriangle, Award, Calendar, Filter } from 'lucide-react';

export const SurgicalOutcomeAnalysis = () => {
  const [timeFrame, setTimeFrame] = useState('month');

  const qualityMetrics = [
    { metric: 'Surgical Site Infection Rate', value: '2.1%', target: '<3%', status: 'good', trend: 'down' },
    { metric: 'Unplanned Reoperation Rate', value: '1.8%', target: '<2%', status: 'good', trend: 'stable' },
    { metric: 'Readmission Rate (30-day)', value: '5.2%', target: '<6%', status: 'good', trend: 'down' },
    { metric: 'Average Length of Stay', value: '3.2 days', target: '<4 days', status: 'good', trend: 'down' },
    { metric: 'Mortality Rate', value: '0.8%', target: '<1%', status: 'good', trend: 'stable' },
    { metric: 'Patient Satisfaction', value: '4.6/5', target: '>4.5/5', status: 'good', trend: 'up' }
  ];

  const complications = [
    { type: 'Bleeding', count: 8, percentage: '3.2%', severity: 'minor' },
    { type: 'Infection', count: 5, percentage: '2.0%', severity: 'moderate' },
    { type: 'Wound Dehiscence', count: 3, percentage: '1.2%', severity: 'moderate' },
    { type: 'Organ Injury', count: 2, percentage: '0.8%', severity: 'major' },
    { type: 'Thromboembolism', count: 1, percentage: '0.4%', severity: 'major' }
  ];

  const surgeonPerformance = [
    { surgeon: 'Dr. Sarah Johnson', cases: 45, complicationRate: '2.2%', satisfaction: 4.8, avgTime: '95 min' },
    { surgeon: 'Dr. Michael Chen', cases: 38, complicationRate: '1.8%', satisfaction: 4.7, avgTime: '110 min' },
    { surgeon: 'Dr. Emily Davis', cases: 42, complicationRate: '3.1%', satisfaction: 4.6, avgTime: '88 min' },
    { surgeon: 'Dr. Robert Kim', cases: 35, complicationRate: '2.5%', satisfaction: 4.5, avgTime: '102 min' }
  ];

  const benchmarkData = [
    { category: 'Laparoscopic Surgery', ourRate: '2.1%', nationalAvg: '3.2%', benchmark: 'Above Average' },
    { category: 'Orthopedic Surgery', ourRate: '1.8%', nationalAvg: '2.5%', benchmark: 'Above Average' },
    { category: 'Cardiac Surgery', ourRate: '4.2%', nationalAvg: '4.8%', benchmark: 'Average' },
    { category: 'Neurosurgery', ourRate: '3.5%', nationalAvg: '3.1%', benchmark: 'Below Average' }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'good': return 'bg-green-500 text-white';
      case 'warning': return 'bg-yellow-500 text-white';
      case 'poor': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />;
      case 'stable': return <div className="w-3 h-0.5 bg-gray-400"></div>;
      default: return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'minor': return 'bg-yellow-100 text-yellow-800';
      case 'moderate': return 'bg-orange-100 text-orange-800';
      case 'major': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBenchmarkColor = (benchmark: string) => {
    switch(benchmark) {
      case 'Above Average': return 'bg-green-100 text-green-800';
      case 'Average': return 'bg-blue-100 text-blue-800';
      case 'Below Average': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Surgical Outcome Analysis</h2>
        <div className="flex gap-2">
          <select 
            value={timeFrame} 
            onChange={(e) => setTimeFrame(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Total Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">247</div>
            <p className="text-sm text-gray-600">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">96.8%</div>
            <p className="text-sm text-gray-600">Above target 95%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Complications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">19</div>
            <p className="text-sm text-gray-600">7.7% complication rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="metrics">Quality Metrics</TabsTrigger>
          <TabsTrigger value="complications">Complications</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {qualityMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-sm">{metric.metric}</h3>
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xl font-bold">{metric.value}</div>
                      <div className="text-sm text-gray-600">Target: {metric.target}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(metric.trend)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="complications">
          <Card>
            <CardHeader>
              <CardTitle>Complication Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complications.map((comp, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{comp.type}</div>
                      <div className="text-sm text-gray-600">{comp.count} cases ({comp.percentage})</div>
                    </div>
                    <Badge className={getSeverityColor(comp.severity)}>
                      {comp.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Surgeon Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Surgeon</th>
                      <th className="text-left p-2">Cases</th>
                      <th className="text-left p-2">Complication Rate</th>
                      <th className="text-left p-2">Satisfaction</th>
                      <th className="text-left p-2">Avg Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {surgeonPerformance.map((surgeon, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{surgeon.surgeon}</td>
                        <td className="p-2">{surgeon.cases}</td>
                        <td className="p-2">{surgeon.complicationRate}</td>
                        <td className="p-2">{surgeon.satisfaction}</td>
                        <td className="p-2">{surgeon.avgTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benchmarks">
          <Card>
            <CardHeader>
              <CardTitle>Benchmark Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {benchmarkData.map((data, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{data.category}</div>
                      <div className="text-sm text-gray-600">
                        Our Rate: {data.ourRate} | National: {data.nationalAvg}
                      </div>
                    </div>
                    <Badge className={getBenchmarkColor(data.benchmark)}>
                      {data.benchmark}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
