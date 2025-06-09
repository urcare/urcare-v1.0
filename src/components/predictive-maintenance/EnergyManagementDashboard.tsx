
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Thermometer,
  Wind,
  DollarSign,
  Leaf,
  BarChart3
} from 'lucide-react';

export const EnergyManagementDashboard = () => {
  const [energySystems] = useState([
    {
      id: 'HVAC-001',
      name: 'HVAC System - Main Building',
      type: 'Climate Control',
      currentConsumption: 245.7,
      optimalConsumption: 198.2,
      efficiency: 80.6,
      costPerHour: 24.57,
      carbonFootprint: 123.5,
      recommendation: 'Reduce temperature setpoint by 2°C',
      potentialSavings: 18.2,
      status: 'optimization_available'
    },
    {
      id: 'LIGHT-002',
      name: 'LED Lighting - All Floors',
      type: 'Lighting',
      currentConsumption: 89.3,
      optimalConsumption: 85.1,
      efficiency: 95.3,
      costPerHour: 8.93,
      carbonFootprint: 44.7,
      recommendation: 'Implement occupancy-based dimming',
      potentialSavings: 4.7,
      status: 'optimized'
    },
    {
      id: 'MED-003',
      name: 'Medical Equipment - ICU',
      type: 'Medical Devices',
      currentConsumption: 156.8,
      optimalConsumption: 142.4,
      efficiency: 90.8,
      costPerHour: 15.68,
      carbonFootprint: 78.4,
      recommendation: 'Schedule non-critical equipment during off-peak hours',
      potentialSavings: 14.4,
      status: 'needs_attention'
    },
    {
      id: 'SERVER-004',
      name: 'Data Center - IT Systems',
      type: 'Computing',
      currentConsumption: 198.5,
      optimalConsumption: 175.3,
      efficiency: 88.3,
      costPerHour: 19.85,
      carbonFootprint: 99.3,
      recommendation: 'Optimize server cooling and consolidate workloads',
      potentialSavings: 23.2,
      status: 'optimization_available'
    }
  ]);

  const [energyMetrics] = useState({
    totalConsumption: 690.3,
    totalCost: 1847.25,
    totalSavings: 342.18,
    carbonReduction: 187.4,
    efficiency: 88.7
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'optimized': return 'text-green-700 border-green-300';
      case 'optimization_available': return 'text-blue-700 border-blue-300';
      case 'needs_attention': return 'text-yellow-700 border-yellow-300';
      default: return 'text-gray-700 border-gray-300';
    }
  };

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 95) return 'text-green-600';
    if (efficiency >= 85) return 'text-blue-600';
    if (efficiency >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Energy Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{energyMetrics.totalConsumption.toFixed(1)} kWh</div>
            <div className="text-sm text-gray-600">Current Usage</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">${energyMetrics.totalSavings.toFixed(0)}</div>
            <div className="text-sm text-gray-600">Monthly Savings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{energyMetrics.efficiency.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Overall Efficiency</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">${energyMetrics.totalCost.toFixed(0)}</div>
            <div className="text-sm text-gray-600">Daily Cost</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{energyMetrics.carbonReduction.toFixed(0)} kg</div>
            <div className="text-sm text-gray-600">CO₂ Reduced</div>
          </CardContent>
        </Card>
      </div>

      {/* Energy Optimization Recommendations */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Lightbulb className="h-5 w-5" />
            AI Energy Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-700">
              <TrendingDown className="h-4 w-4" />
              <span>Potential monthly savings of $1,247 with recommended optimizations</span>
            </div>
            <div className="flex items-center gap-2 text-blue-700">
              <Leaf className="h-4 w-4" />
              <span>Reduce carbon footprint by 425 kg CO₂ per month</span>
            </div>
            <div className="flex items-center gap-2 text-blue-700">
              <Zap className="h-4 w-4" />
              <span>Improve overall energy efficiency to 94.2% with system optimizations</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Energy Systems */}
      <div className="space-y-4">
        {energySystems.map((system) => (
          <Card key={system.id} className={`border-l-4 ${system.status === 'optimized' ? 'border-l-green-500' : system.status === 'optimization_available' ? 'border-l-blue-500' : 'border-l-yellow-500'}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="h-6 w-6 text-blue-600" />
                  <div>
                    <CardTitle className="text-lg">{system.name}</CardTitle>
                    <p className="text-sm text-gray-600">{system.id} • {system.type}</p>
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(system.status)}>
                  {system.status === 'optimized' ? 'Optimized' : system.status === 'optimization_available' ? 'Can Optimize' : 'Needs Attention'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Current Usage</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {system.currentConsumption.toFixed(1)} kWh
                  </div>
                  <div className="text-xs text-gray-500">
                    Optimal: {system.optimalConsumption.toFixed(1)} kWh
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Efficiency</div>
                  <div className={`text-2xl font-bold ${getEfficiencyColor(system.efficiency)}`}>
                    {system.efficiency.toFixed(1)}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${system.efficiency >= 95 ? 'bg-green-600' : system.efficiency >= 85 ? 'bg-blue-600' : system.efficiency >= 75 ? 'bg-yellow-600' : 'bg-red-600'}`}
                      style={{ width: `${system.efficiency}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Cost per Hour
                  </div>
                  <div className="text-lg font-semibold text-orange-600">
                    ${system.costPerHour.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Potential savings: ${system.potentialSavings.toFixed(1)}/hour
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center gap-1">
                    <Leaf className="h-4 w-4" />
                    Carbon Footprint
                  </div>
                  <div className="text-lg font-semibold text-green-600">
                    {system.carbonFootprint.toFixed(1)} kg CO₂
                  </div>
                  <div className="text-xs text-gray-500">Per day</div>
                </div>
              </div>

              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm font-medium text-blue-800 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  AI Recommendation
                </div>
                <div className="text-sm text-blue-700 mt-1">
                  {system.recommendation}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  Estimated savings: ${system.potentialSavings.toFixed(1)} per hour
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm">
                  <Zap className="h-4 w-4 mr-2" />
                  Apply Optimization
                </Button>
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" size="sm">
                  <Thermometer className="h-4 w-4 mr-2" />
                  System Controls
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Energy Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Energy Consumption Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-lg font-semibold flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-green-600" />
                This Week
              </div>
              <div className="text-sm text-gray-600 mb-2">vs Last Week</div>
              <div className="space-y-1">
                <div className="text-sm">Consumption: <span className="font-semibold text-green-600">-12.4%</span></div>
                <div className="text-sm">Cost: <span className="font-semibold text-green-600">-$234</span></div>
                <div className="text-sm">Efficiency: <span className="font-semibold text-blue-600">+3.2%</span></div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-lg font-semibold flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-green-600" />
                This Month
              </div>
              <div className="text-sm text-gray-600 mb-2">vs Last Month</div>
              <div className="space-y-1">
                <div className="text-sm">Consumption: <span className="font-semibold text-green-600">-8.7%</span></div>
                <div className="text-sm">Cost: <span className="font-semibold text-green-600">-$1,247</span></div>
                <div className="text-sm">Efficiency: <span className="font-semibold text-blue-600">+5.8%</span></div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Projection
              </div>
              <div className="text-sm text-gray-600 mb-2">Next Month</div>
              <div className="space-y-1">
                <div className="text-sm">Expected savings: <span className="font-semibold text-green-600">$1,547</span></div>
                <div className="text-sm">Efficiency target: <span className="font-semibold text-blue-600">92.5%</span></div>
                <div className="text-sm">CO₂ reduction: <span className="font-semibold text-green-600">267 kg</span></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
