
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, ComposedChart, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, Target } from 'lucide-react';

interface OutcomeTrendChartsProps {
  timeframe: string;
}

const mortalityTrendData = [
  { month: 'Jan', mortality: 2.3, benchmark: 2.8, surgicalMortality: 1.8, medicalMortality: 2.7 },
  { month: 'Feb', mortality: 2.1, benchmark: 2.8, surgicalMortality: 1.6, medicalMortality: 2.5 },
  { month: 'Mar', mortality: 2.4, benchmark: 2.8, surgicalMortality: 1.9, medicalMortality: 2.8 },
  { month: 'Apr', mortality: 2.0, benchmark: 2.8, surgicalMortality: 1.5, medicalMortality: 2.4 },
  { month: 'May', mortality: 1.9, benchmark: 2.8, surgicalMortality: 1.4, medicalMortality: 2.3 },
  { month: 'Jun', mortality: 2.1, benchmark: 2.8, surgicalMortality: 1.6, medicalMortality: 2.5 }
];

const readmissionTrendData = [
  { month: 'Jan', readmission: 9.2, benchmark: 12.0, cardiology: 11.5, orthopedics: 7.8, neurology: 8.9 },
  { month: 'Feb', readmission: 8.8, benchmark: 12.0, cardiology: 10.2, orthopedics: 7.1, neurology: 9.1 },
  { month: 'Mar', readmission: 9.1, benchmark: 12.0, cardiology: 11.0, orthopedics: 7.5, neurology: 8.7 },
  { month: 'Apr', readmission: 8.5, benchmark: 12.0, cardiology: 9.8, orthopedics: 6.9, neurology: 8.2 },
  { month: 'May', readmission: 8.2, benchmark: 12.0, cardiology: 9.5, orthopedics: 6.7, neurology: 8.0 },
  { month: 'Jun', readmission: 8.5, benchmark: 12.0, cardiology: 9.9, orthopedics: 7.0, neurology: 8.3 }
];

const infectionRateData = [
  { month: 'Jan', rate: 1.4, benchmark: 2.1, surgical: 2.1, icu: 3.2, general: 0.8 },
  { month: 'Feb', rate: 1.3, benchmark: 2.1, surgical: 1.9, icu: 3.0, general: 0.7 },
  { month: 'Mar', rate: 1.5, benchmark: 2.1, surgical: 2.3, icu: 3.4, general: 0.9 },
  { month: 'Apr', rate: 1.2, benchmark: 2.1, surgical: 1.8, icu: 2.8, general: 0.6 },
  { month: 'May', rate: 1.1, benchmark: 2.1, surgical: 1.6, icu: 2.5, general: 0.5 },
  { month: 'Jun', rate: 1.2, benchmark: 2.1, surgical: 1.8, icu: 2.7, general: 0.6 }
];

export const OutcomeTrendCharts = ({ timeframe }: OutcomeTrendChartsProps) => {
  const [selectedChart, setSelectedChart] = useState('mortality');

  const chartConfig = {
    mortality: {
      label: "Mortality Rate",
      color: "#ef4444",
    },
    benchmark: {
      label: "Benchmark",
      color: "#94a3b8",
    },
    readmission: {
      label: "Readmission Rate",
      color: "#f59e0b",
    },
    rate: {
      label: "Infection Rate",
      color: "#10b981",
    },
  };

  const charts = [
    {
      id: 'mortality',
      title: 'Mortality Rate Trends',
      description: 'Risk-adjusted mortality rates by department',
      data: mortalityTrendData,
      primaryMetric: 'mortality',
      icon: TrendingDown,
      color: 'red'
    },
    {
      id: 'readmission',
      title: '30-Day Readmission Rates',
      description: 'Readmission rates by specialty',
      data: readmissionTrendData,
      primaryMetric: 'readmission',
      icon: TrendingUp,
      color: 'orange'
    },
    {
      id: 'infection',
      title: 'Healthcare-Associated Infections',
      description: 'Infection rates by unit type',
      data: infectionRateData,
      primaryMetric: 'rate',
      icon: Target,
      color: 'green'
    }
  ];

  const selectedChartData = charts.find(chart => chart.id === selectedChart);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {charts.map((chart) => (
          <Button
            key={chart.id}
            variant={selectedChart === chart.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedChart(chart.id)}
            className="flex items-center gap-2"
          >
            <chart.icon className="h-4 w-4" />
            {chart.title}
          </Button>
        ))}
      </div>

      {selectedChartData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <selectedChartData.icon className="h-5 w-5" />
                  {selectedChartData.title}
                </CardTitle>
                <CardDescription>{selectedChartData.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={selectedChartData.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone" 
                        dataKey="benchmark" 
                        stroke="#94a3b8" 
                        fill="#94a3b8" 
                        fillOpacity={0.2}
                        strokeDasharray="5 5"
                      />
                      <Line 
                        type="monotone" 
                        dataKey={selectedChartData.primaryMetric} 
                        stroke={chartConfig[selectedChartData.primaryMetric as keyof typeof chartConfig].color} 
                        strokeWidth={3}
                        dot={{ r: 6 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Improving Trend</span>
                  </div>
                  <p className="text-sm text-green-700">
                    {selectedChart === 'mortality' && 'Mortality rates consistently below benchmark'}
                    {selectedChart === 'readmission' && 'Readmission rates trending downward'}
                    {selectedChart === 'infection' && 'Infection rates well below national average'}
                  </p>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Target Achievement</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    {selectedChart === 'mortality' && '95% of months below benchmark target'}
                    {selectedChart === 'readmission' && 'Consistently meeting CMS benchmarks'}
                    {selectedChart === 'infection' && 'Exceeding infection prevention goals'}
                  </p>
                </div>

                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-800">Forecast</span>
                  </div>
                  <p className="text-sm text-purple-700">
                    ML models predict continued improvement over next quarter
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Department Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedChart === 'mortality' && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Surgical</span>
                        <Badge variant="secondary">1.6%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Medical</span>
                        <Badge variant="secondary">2.5%</Badge>
                      </div>
                    </>
                  )}
                  {selectedChart === 'readmission' && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Cardiology</span>
                        <Badge variant="secondary">9.9%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Orthopedics</span>
                        <Badge variant="secondary">7.0%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Neurology</span>
                        <Badge variant="secondary">8.3%</Badge>
                      </div>
                    </>
                  )}
                  {selectedChart === 'infection' && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">ICU</span>
                        <Badge variant="secondary">2.7%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Surgical</span>
                        <Badge variant="secondary">1.8%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">General</span>
                        <Badge variant="secondary">0.6%</Badge>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
