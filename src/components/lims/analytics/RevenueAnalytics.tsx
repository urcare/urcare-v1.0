
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  BarChart3,
  Download,
  Calculator,
  Target
} from 'lucide-react';

export const RevenueAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedView, setSelectedView] = useState('summary');

  const revenueMetrics = {
    totalRevenue: 485600,
    monthlyGrowth: 3.9,
    revenuePerTest: 38.65,
    profitMargin: 22.8,
    topPayerMix: 'Insurance (65%)',
    avgReimbursement: 42.50
  };

  const departmentRevenue = [
    {
      department: 'Chemistry',
      revenue: 176616,
      percentage: 36.4,
      growth: 4.2,
      profitMargin: 24.5,
      testsCount: 4567
    },
    {
      department: 'Microbiology',
      revenue: 98340,
      percentage: 20.3,
      growth: 8.7,
      profitMargin: 28.2,
      testsCount: 1756
    },
    {
      department: 'Molecular',
      revenue: 89433,
      percentage: 18.4,
      growth: 15.6,
      profitMargin: 35.8,
      testsCount: 987
    },
    {
      department: 'Immunology',
      revenue: 72800,
      percentage: 15.0,
      growth: 2.8,
      profitMargin: 18.9,
      testsCount: 1823
    },
    {
      department: 'Hematology',
      revenue: 34680,
      percentage: 7.1,
      growth: 1.2,
      profitMargin: 15.4,
      testsCount: 2890
    },
    {
      department: 'Pathology',
      revenue: 13731,
      percentage: 2.8,
      growth: 6.4,
      profitMargin: 32.1,
      testsCount: 544
    }
  ];

  const payerMixAnalysis = [
    { payer: 'Commercial Insurance', percentage: 45.2, revenue: 219492, avgReimbursement: 52.80 },
    { payer: 'Medicare', percentage: 28.7, revenue: 139367, avgReimbursement: 35.20 },
    { payer: 'Medicaid', percentage: 15.8, revenue: 76725, avgReimbursement: 28.90 },
    { payer: 'Self-Pay', percentage: 7.3, revenue: 35449, avgReimbursement: 95.60 },
    { payer: 'Other', percentage: 3.0, revenue: 14567, avgReimbursement: 42.30 }
  ];

  const costAnalysis = {
    directCosts: {
      reagents: 185400,
      supplies: 67200,
      maintenance: 34500,
      total: 287100
    },
    indirectCosts: {
      labor: 156800,
      overhead: 89400,
      utilities: 23400,
      total: 269600
    },
    totalCosts: 556700,
    grossProfit: 485600 - 556700
  };

  const topRevenueTests = [
    { test: 'Comprehensive Metabolic Panel', revenue: 45600, count: 876, avgPrice: 52.05 },
    { test: 'Lipid Panel Complete', revenue: 38970, count: 654, avgPrice: 59.60 },
    { test: 'Thyroid Function Panel', revenue: 34560, count: 543, avgPrice: 63.65 },
    { test: 'Hepatitis Panel', revenue: 28340, count: 234, avgPrice: 121.11 },
    { test: 'Cardiac Biomarkers', revenue: 25670, count: 189, avgPrice: 135.82 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Revenue Analytics</h3>
          <p className="text-gray-600">Financial performance analysis and profitability insights</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-green-900">${revenueMetrics.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-green-700">Total Revenue</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-blue-900">{revenueMetrics.monthlyGrowth}%</p>
            <p className="text-xs text-blue-700">Monthly Growth</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <Calculator className="h-6 w-6 text-purple-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-purple-900">${revenueMetrics.revenuePerTest}</p>
            <p className="text-xs text-purple-700">Revenue/Test</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 text-orange-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-orange-900">{revenueMetrics.profitMargin}%</p>
            <p className="text-xs text-orange-700">Profit Margin</p>
          </CardContent>
        </Card>
        <Card className="border-indigo-200 bg-indigo-50">
          <CardContent className="p-4 text-center">
            <PieChart className="h-6 w-6 text-indigo-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-indigo-900">{revenueMetrics.topPayerMix}</p>
            <p className="text-xs text-indigo-700">Top Payer</p>
          </CardContent>
        </Card>
        <Card className="border-teal-200 bg-teal-50">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 text-teal-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-teal-900">${revenueMetrics.avgReimbursement}</p>
            <p className="text-xs text-teal-700">Avg Reimbursement</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Revenue Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Department Revenue Breakdown</CardTitle>
            <CardDescription>Revenue analysis by laboratory department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentRevenue.map((dept, index) => (
                <div key={index} className="p-3 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{dept.department}</h5>
                    <Badge variant="outline" className="text-green-700 border-green-500">
                      +{dept.growth}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Revenue</p>
                      <p className="font-bold text-gray-900">${dept.revenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Share</p>
                      <p className="font-bold text-gray-900">{dept.percentage}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Margin</p>
                      <p className="font-bold text-gray-900">{dept.profitMargin}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payer Mix Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Payer Mix Analysis</CardTitle>
            <CardDescription>Revenue distribution by payer type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payerMixAnalysis.map((payer, index) => (
                <div key={index} className="p-3 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{payer.payer}</h5>
                    <span className="text-sm font-medium">{payer.percentage}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Revenue</p>
                      <p className="font-bold text-gray-900">${payer.revenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Avg Reimbursement</p>
                      <p className="font-bold text-gray-900">${payer.avgReimbursement}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Analysis</CardTitle>
            <CardDescription>Detailed cost breakdown and profitability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-medium text-red-900 mb-3">Direct Costs</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Reagents</span>
                    <span className="font-medium">${costAnalysis.directCosts.reagents.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Supplies</span>
                    <span className="font-medium">${costAnalysis.directCosts.supplies.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maintenance</span>
                    <span className="font-medium">${costAnalysis.directCosts.maintenance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold">
                    <span>Total Direct</span>
                    <span>${costAnalysis.directCosts.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-3">Indirect Costs</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Labor</span>
                    <span className="font-medium">${costAnalysis.indirectCosts.labor.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overhead</span>
                    <span className="font-medium">${costAnalysis.indirectCosts.overhead.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Utilities</span>
                    <span className="font-medium">${costAnalysis.indirectCosts.utilities.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold">
                    <span>Total Indirect</span>
                    <span>${costAnalysis.indirectCosts.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Revenue Tests */}
        <Card>
          <CardHeader>
            <CardTitle>Top Revenue Generating Tests</CardTitle>
            <CardDescription>Highest revenue tests with pricing analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topRevenueTests.map((test, index) => (
                <div key={index} className="p-3 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{test.test}</h5>
                    <span className="text-sm font-medium text-green-600">${test.revenue.toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Count</p>
                      <p className="font-medium">{test.count} tests</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Avg Price</p>
                      <p className="font-medium">${test.avgPrice}</p>
                    </div>
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
