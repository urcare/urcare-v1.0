
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building,
  Users,
  Bed,
  MapPin,
  TrendingUp,
  TrendingDown,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export const SpaceUtilizationInterface = () => {
  const [spaceAreas] = useState([
    {
      id: 'ICU-001',
      name: 'Intensive Care Unit',
      type: 'Critical Care',
      totalCapacity: 24,
      currentOccupancy: 18,
      utilizationRate: 75.0,
      predictedPeak: 22,
      peakTime: '14:00',
      trend: 'increasing',
      avgTurnover: 4.2,
      bottlenecks: ['Bed 12 - Equipment maintenance', 'Bed 7 - Deep cleaning'],
      recommendations: ['Prepare overflow capacity', 'Schedule maintenance during off-peak']
    },
    {
      id: 'ER-002',
      name: 'Emergency Department',
      type: 'Emergency',
      totalCapacity: 36,
      currentOccupancy: 28,
      utilizationRate: 77.8,
      predictedPeak: 34,
      peakTime: '18:30',
      trend: 'critical',
      avgTurnover: 6.8,
      bottlenecks: ['Triage backlog', 'Radiology queue', 'Lab processing delays'],
      recommendations: ['Add triage nurse', 'Fast-track minor cases', 'Coordinate with lab']
    },
    {
      id: 'OR-003',
      name: 'Operating Rooms',
      type: 'Surgical',
      totalCapacity: 12,
      currentOccupancy: 8,
      utilizationRate: 66.7,
      predictedPeak: 11,
      peakTime: '10:00',
      trend: 'stable',
      avgTurnover: 2.3,
      bottlenecks: ['OR 3 - Extended procedure', 'OR 7 - Equipment setup'],
      recommendations: ['Optimize scheduling gaps', 'Prepare equipment in advance']
    },
    {
      id: 'WARD-004',
      name: 'General Ward - Floor 3',
      type: 'Inpatient',
      totalCapacity: 48,
      currentOccupancy: 42,
      utilizationRate: 87.5,
      predictedPeak: 46,
      peakTime: '16:00',
      trend: 'high',
      avgTurnover: 1.8,
      bottlenecks: ['Discharge delays', 'Housekeeping backlog'],
      recommendations: ['Expedite discharge process', 'Add housekeeping staff']
    }
  ]);

  const [utilizationMetrics] = useState({
    overallUtilization: 76.8,
    occupancyTrend: 'increasing',
    bottleneckAreas: 3,
    efficiencyScore: 84.2,
    capacityStress: 'moderate'
  });

  const getUtilizationColor = (rate) => {
    if (rate >= 90) return 'text-red-600';
    if (rate >= 80) return 'text-yellow-600';
    if (rate >= 60) return 'text-green-600';
    return 'text-blue-600';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-orange-600" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high': return <TrendingUp className="h-4 w-4 text-red-600" />;
      case 'stable': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <TrendingDown className="h-4 w-4 text-blue-600" />;
    }
  };

  const getCapacityStatus = (utilizationRate) => {
    if (utilizationRate >= 90) return { status: 'Critical', color: 'text-red-700 border-red-300' };
    if (utilizationRate >= 80) return { status: 'High', color: 'text-yellow-700 border-yellow-300' };
    if (utilizationRate >= 60) return { status: 'Normal', color: 'text-green-700 border-green-300' };
    return { status: 'Low', color: 'text-blue-700 border-blue-300' };
  };

  return (
    <div className="space-y-6">
      {/* Space Utilization Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{utilizationMetrics.overallUtilization.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Overall Utilization</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{utilizationMetrics.bottleneckAreas}</div>
            <div className="text-sm text-gray-600">Bottleneck Areas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{utilizationMetrics.efficiencyScore.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Efficiency Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">186</div>
            <div className="text-sm text-gray-600">Total Beds</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-cyan-600">143</div>
            <div className="text-sm text-gray-600">Currently Occupied</div>
          </CardContent>
        </Card>
      </div>

      {/* Capacity Alerts */}
      {utilizationMetrics.capacityStress === 'high' && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              High Capacity Stress Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-700">
                <Building className="h-4 w-4" />
                <span>Emergency Department nearing capacity - peak expected at 18:30</span>
              </div>
              <div className="flex items-center gap-2 text-red-700">
                <Bed className="h-4 w-4" />
                <span>General Ward occupancy at 87.5% - discharge coordination needed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Space Areas */}
      <div className="space-y-4">
        {spaceAreas.map((area) => {
          const capacityStatus = getCapacityStatus(area.utilizationRate);
          return (
            <Card key={area.id} className={`border-l-4 ${area.utilizationRate >= 90 ? 'border-l-red-500' : area.utilizationRate >= 80 ? 'border-l-yellow-500' : 'border-l-green-500'}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building className="h-6 w-6 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">{area.name}</CardTitle>
                      <p className="text-sm text-gray-600">{area.id} • {area.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(area.trend)}
                    <Badge variant="outline" className={capacityStatus.color}>
                      {capacityStatus.status} Capacity
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Current Occupancy</div>
                    <div className={`text-2xl font-bold ${getUtilizationColor(area.utilizationRate)}`}>
                      {area.currentOccupancy}/{area.totalCapacity}
                    </div>
                    <div className="text-sm text-gray-500">
                      {area.utilizationRate.toFixed(1)}% utilization
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${area.utilizationRate >= 90 ? 'bg-red-600' : area.utilizationRate >= 80 ? 'bg-yellow-600' : 'bg-green-600'}`}
                        style={{ width: `${area.utilizationRate}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      Predicted Peak
                    </div>
                    <div className="text-lg font-semibold text-orange-600">
                      {area.predictedPeak}/{area.totalCapacity}
                    </div>
                    <div className="text-xs text-gray-500">
                      Expected at {area.peakTime}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Avg Turnover
                    </div>
                    <div className="text-lg font-semibold text-blue-600">
                      {area.avgTurnover.toFixed(1)} hrs
                    </div>
                    <div className="text-xs text-gray-500">Per bed/room</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Available Capacity</div>
                    <div className="text-lg font-semibold text-green-600">
                      {area.totalCapacity - area.currentOccupancy}
                    </div>
                    <div className="text-xs text-gray-500">
                      {((area.totalCapacity - area.currentOccupancy) / area.totalCapacity * 100).toFixed(1)}% free
                    </div>
                  </div>
                </div>

                {/* Bottlenecks */}
                {area.bottlenecks.length > 0 && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-sm font-medium text-yellow-800 flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      Current Bottlenecks
                    </div>
                    <div className="space-y-1">
                      {area.bottlenecks.map((bottleneck, index) => (
                        <div key={index} className="text-xs text-yellow-700">
                          • {bottleneck}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Recommendations */}
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm font-medium text-blue-800 flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4" />
                    AI Optimization Recommendations
                  </div>
                  <div className="space-y-1">
                    {area.recommendations.map((recommendation, index) => (
                      <div key={index} className="text-xs text-blue-700">
                        • {recommendation}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Optimize Schedule
                  </Button>
                  <Button variant="outline" size="sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    View Layout
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Staff Allocation
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Capacity Planning */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Capacity Planning & Forecasting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Next 24 Hours
              </div>
              <div className="text-sm text-gray-600 mb-2">Predicted demand</div>
              <div className="space-y-1">
                <div className="text-sm">Peak capacity: <span className="font-semibold text-orange-600">89.4%</span></div>
                <div className="text-sm">Peak time: <span className="font-semibold">18:30 - 20:00</span></div>
                <div className="text-sm">Overflow risk: <span className="font-semibold text-yellow-600">Moderate</span></div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                This Week
              </div>
              <div className="text-sm text-gray-600 mb-2">Weekly projection</div>
              <div className="space-y-1">
                <div className="text-sm">Avg utilization: <span className="font-semibold text-green-600">78.2%</span></div>
                <div className="text-sm">Busiest day: <span className="font-semibold">Wednesday</span></div>
                <div className="text-sm">Capacity stress: <span className="font-semibold text-green-600">Low</span></div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Long-term Trends
              </div>
              <div className="text-sm text-gray-600 mb-2">30-day outlook</div>
              <div className="space-y-1">
                <div className="text-sm">Growth trend: <span className="font-semibold text-blue-600">+2.3%</span></div>
                <div className="text-sm">Seasonal factor: <span className="font-semibold">Summer surge</span></div>
                <div className="text-sm">Expansion needed: <span className="font-semibold text-orange-600">Q4 2024</span></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
