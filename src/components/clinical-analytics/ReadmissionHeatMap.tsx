
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts';
import { Activity, AlertTriangle, TrendingUp, Filter } from 'lucide-react';

interface ReadmissionHeatMapProps {
  timeframe: string;
}

const departmentReadmissionData = [
  { department: 'Cardiology', rate: 14.2, volume: 245, riskScore: 8.5, color: '#ef4444' },
  { department: 'Orthopedics', rate: 7.1, volume: 189, riskScore: 4.2, color: '#10b981' },
  { department: 'Neurology', rate: 9.8, volume: 156, riskScore: 6.1, color: '#f59e0b' },
  { department: 'General Surgery', rate: 11.5, volume: 298, riskScore: 7.2, color: '#f59e0b' },
  { department: 'ICU', rate: 16.8, volume: 124, riskScore: 9.8, color: '#ef4444' },
  { department: 'Emergency', rate: 6.2, volume: 445, riskScore: 3.8, color: '#10b981' },
  { department: 'Pediatrics', rate: 4.9, volume: 167, riskScore: 2.9, color: '#10b981' },
  { department: 'Oncology', rate: 12.3, volume: 134, riskScore: 7.8, color: '#f59e0b' }
];

const readmissionReasonData = [
  { reason: 'Infection', count: 45, percentage: 28.5 },
  { reason: 'Medication Issues', count: 32, percentage: 20.3 },
  { reason: 'Surgical Complications', count: 28, percentage: 17.7 },
  { reason: 'Disease Progression', count: 24, percentage: 15.2 },
  { reason: 'Poor Discharge Planning', count: 18, percentage: 11.4 },
  { reason: 'Other', count: 11, percentage: 6.9 }
];

const riskFactorData = [
  { factor: 'Age > 65', impact: 2.4, prevalence: 68 },
  { factor: 'Multiple Comorbidities', impact: 3.1, prevalence: 45 },
  { factor: 'Previous Readmissions', impact: 4.2, prevalence: 23 },
  { factor: 'Social Determinants', impact: 2.8, prevalence: 34 },
  { factor: 'Medication Non-adherence', impact: 3.5, prevalence: 29 },
  { factor: 'Inadequate Follow-up', impact: 2.9, prevalence: 31 }
];

export const ReadmissionHeatMap = ({ timeframe }: ReadmissionHeatMapProps) => {
  const [selectedView, setSelectedView] = useState('departments');

  const chartConfig = {
    rate: {
      label: "Readmission Rate",
      color: "#ef4444",
    },
    volume: {
      label: "Patient Volume",
      color: "#3b82f6",
    },
    count: {
      label: "Count",
      color: "#10b981",
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedView === 'departments' ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedView('departments')}
        >
          <Activity className="h-4 w-4 mr-1" />
          By Department
        </Button>
        <Button
          variant={selectedView === 'reasons' ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedView('reasons')}
        >
          <AlertTriangle className="h-4 w-4 mr-1" />
          By Reason
        </Button>
        <Button
          variant={selectedView === 'risk' ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedView('risk')}
        >
          <TrendingUp className="h-4 w-4 mr-1" />
          Risk Factors
        </Button>
      </div>

      {selectedView === 'departments' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Department Readmission Heat Map</CardTitle>
                <CardDescription>Readmission rates vs. patient volume by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={departmentReadmissionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="volume" 
                        name="Patient Volume"
                        type="number"
                        domain={['dataMin - 20', 'dataMax + 20']}
                      />
                      <YAxis 
                        dataKey="rate" 
                        name="Readmission Rate (%)"
                        type="number"
                        domain={['dataMin - 1', 'dataMax + 1']}
                      />
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border rounded-lg shadow-lg">
                                <p className="font-medium">{data.department}</p>
                                <p className="text-sm">Readmission Rate: {data.rate}%</p>
                                <p className="text-sm">Patient Volume: {data.volume}</p>
                                <p className="text-sm">Risk Score: {data.riskScore}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Scatter dataKey="rate" fill="#8884d8">
                        {departmentReadmissionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">High-Risk Departments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {departmentReadmissionData
                    .filter(dept => dept.rate > 12)
                    .sort((a, b) => b.rate - a.rate)
                    .map((dept) => (
                      <div key={dept.department} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{dept.department}</p>
                          <p className="text-xs text-gray-500">{dept.volume} patients</p>
                        </div>
                        <Badge variant="destructive">{dept.rate}%</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Action Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-red-800 text-sm">ICU Review Required</span>
                    </div>
                    <p className="text-xs text-red-700">Immediate intervention needed</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Filter className="h-4 w-4 text-orange-600" />
                      <span className="font-medium text-orange-800 text-sm">Cardiology Monitoring</span>
                    </div>
                    <p className="text-xs text-orange-700">Implement enhanced protocols</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {selectedView === 'reasons' && (
        <Card>
          <CardHeader>
            <CardTitle>Readmission Reasons Analysis</CardTitle>
            <CardDescription>Common causes of 30-day readmissions</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={readmissionReasonData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="reason" type="category" width={120} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {selectedView === 'risk' && (
        <Card>
          <CardHeader>
            <CardTitle>Risk Factor Impact Analysis</CardTitle>
            <CardDescription>Risk factors and their impact on readmission likelihood</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={riskFactorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="prevalence" 
                    name="Prevalence (%)"
                    type="number"
                    domain={[0, 80]}
                  />
                  <YAxis 
                    dataKey="impact" 
                    name="Impact Score"
                    type="number"
                    domain={[0, 5]}
                  />
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-medium">{data.factor}</p>
                            <p className="text-sm">Impact Score: {data.impact}</p>
                            <p className="text-sm">Prevalence: {data.prevalence}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter dataKey="impact" fill="#f59e0b" />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
