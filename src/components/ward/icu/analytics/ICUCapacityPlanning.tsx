
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PieChart, Bed, TrendingUp, AlertTriangle, Users, Calendar } from 'lucide-react';

interface CapacityData {
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  reservedBeds: number;
  maintenanceBeds: number;
  currentOccupancy: number;
  targetOccupancy: number;
  predictedAdmissions: {
    next4Hours: number;
    next8Hours: number;
    next24Hours: number;
  };
  predictedDischarges: {
    next4Hours: number;
    next8Hours: number;
    next24Hours: number;
  };
  specialtyBreakdown: {
    medical: number;
    surgical: number;
    cardiac: number;
    neuro: number;
    trauma: number;
  };
  alerts: {
    type: 'capacity_warning' | 'high_utilization' | 'staffing_constraint' | 'equipment_shortage';
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    timeTriggered: Date;
  }[];
  recommendations: string[];
}

const mockCapacityData: CapacityData = {
  totalBeds: 24,
  occupiedBeds: 20,
  availableBeds: 2,
  reservedBeds: 1,
  maintenanceBeds: 1,
  currentOccupancy: 83,
  targetOccupancy: 85,
  predictedAdmissions: {
    next4Hours: 2,
    next8Hours: 4,
    next24Hours: 8
  },
  predictedDischarges: {
    next4Hours: 1,
    next8Hours: 3,
    next24Hours: 6
  },
  specialtyBreakdown: {
    medical: 8,
    surgical: 6,
    cardiac: 3,
    neuro: 2,
    trauma: 1
  },
  alerts: [
    {
      type: 'capacity_warning',
      message: 'ICU approaching capacity limit - only 2 beds available',
      severity: 'high',
      timeTriggered: new Date(Date.now() - 15 * 60 * 1000)
    },
    {
      type: 'high_utilization',
      message: 'Utilization above 80% - consider preparing surge capacity',
      severity: 'medium',
      timeTriggered: new Date(Date.now() - 45 * 60 * 1000)
    }
  ],
  recommendations: [
    'Expedite discharge planning for stable patients',
    'Contact float pool for additional nursing staff',
    'Prepare surge capacity in step-down unit',
    'Review pending elective surgeries',
    'Coordinate with emergency department for admission flow'
  ]
};

export const ICUCapacityPlanning = () => {
  const [capacityData, setCapacityData] = useState<CapacityData>(mockCapacityData);

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy >= 95) return 'text-red-600';
    if (occupancy >= 85) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const formatTimeSince = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ago`;
  };

  const calculatePredictedOccupancy = (hours: number) => {
    const admissions = hours <= 4 ? capacityData.predictedAdmissions.next4Hours :
                     hours <= 8 ? capacityData.predictedAdmissions.next8Hours :
                     capacityData.predictedAdmissions.next24Hours;
    
    const discharges = hours <= 4 ? capacityData.predictedDischarges.next4Hours :
                      hours <= 8 ? capacityData.predictedDischarges.next8Hours :
                      capacityData.predictedDischarges.next24Hours;
    
    const netChange = admissions - discharges;
    const predictedOccupied = Math.max(0, Math.min(capacityData.totalBeds, capacityData.occupiedBeds + netChange));
    return Math.round((predictedOccupied / capacityData.totalBeds) * 100);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            ICU Capacity Planning Dashboard
          </CardTitle>
          <CardDescription>
            Real-time capacity monitoring with predictive analytics for optimal resource allocation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Bed className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{capacityData.occupiedBeds}/{capacityData.totalBeds}</p>
                  <p className="text-sm text-gray-600">Beds Occupied</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <Bed className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">{capacityData.availableBeds}</p>
                  <p className="text-sm text-gray-600">Available Now</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className={`text-2xl font-bold ${getOccupancyColor(capacityData.currentOccupancy)}`}>
                    {capacityData.currentOccupancy}%
                  </p>
                  <p className="text-sm text-gray-600">Occupancy Rate</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-purple-200 bg-purple-50">
              <div className="flex items-center gap-2">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-600">{calculatePredictedOccupancy(24)}%</p>
                  <p className="text-sm text-gray-600">24h Prediction</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="p-4">
              <h4 className="font-medium mb-4">Current Bed Status</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Occupied</span>
                    <span className="text-sm font-medium">{capacityData.occupiedBeds} beds</span>
                  </div>
                  <Progress value={(capacityData.occupiedBeds / capacityData.totalBeds) * 100} className="h-3" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-2 bg-green-50 rounded">
                    <p className="font-medium text-green-800">Available: {capacityData.availableBeds}</p>
                  </div>
                  <div className="p-2 bg-yellow-50 rounded">
                    <p className="font-medium text-yellow-800">Reserved: {capacityData.reservedBeds}</p>
                  </div>
                  <div className="p-2 bg-red-50 rounded">
                    <p className="font-medium text-red-800">Maintenance: {capacityData.maintenanceBeds}</p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded">
                    <p className="font-medium text-blue-800">Total: {capacityData.totalBeds}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-4">Specialty Breakdown</h4>
              <div className="space-y-3">
                {Object.entries(capacityData.specialtyBreakdown).map(([specialty, count]) => (
                  <div key={specialty} className="flex justify-between items-center">
                    <span className="text-sm capitalize">{specialty}:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(count / capacityData.occupiedBeds) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="p-4">
              <h4 className="font-medium mb-4">Predicted Admissions</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Next 4 hours:</span>
                  <Badge variant="outline">{capacityData.predictedAdmissions.next4Hours}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Next 8 hours:</span>
                  <Badge variant="outline">{capacityData.predictedAdmissions.next8Hours}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Next 24 hours:</span>
                  <Badge variant="outline">{capacityData.predictedAdmissions.next24Hours}</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-4">Predicted Discharges</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Next 4 hours:</span>
                  <Badge variant="outline">{capacityData.predictedDischarges.next4Hours}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Next 8 hours:</span>
                  <Badge variant="outline">{capacityData.predictedDischarges.next8Hours}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Next 24 hours:</span>
                  <Badge variant="outline">{capacityData.predictedDischarges.next24Hours}</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-4">Predicted Occupancy</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">4h forecast:</span>
                  <span className={`font-medium ${getOccupancyColor(calculatePredictedOccupancy(4))}`}>
                    {calculatePredictedOccupancy(4)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">8h forecast:</span>
                  <span className={`font-medium ${getOccupancyColor(calculatePredictedOccupancy(8))}`}>
                    {calculatePredictedOccupancy(8)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">24h forecast:</span>
                  <span className={`font-medium ${getOccupancyColor(calculatePredictedOccupancy(24))}`}>
                    {calculatePredictedOccupancy(24)}%
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="p-4">
              <h4 className="font-medium mb-3">Capacity Alerts</h4>
              <div className="space-y-3">
                {capacityData.alerts.map((alert, index) => (
                  <div key={index} className="p-3 border rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className={`text-sm font-medium ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">{formatTimeSince(alert.timeTriggered)}</span>
                    </div>
                    <p className="text-sm text-gray-700">{alert.message}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-3">Recommendations</h4>
              <div className="space-y-2">
                {capacityData.recommendations.map((rec, index) => (
                  <div key={index} className="text-sm p-2 bg-blue-50 rounded flex items-center gap-2">
                    <Users className="h-3 w-3 text-blue-600" />
                    {rec}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="default">
              <TrendingUp className="h-4 w-4 mr-1" />
              Update Predictions
            </Button>
            <Button size="sm" variant="outline">
              <Bed className="h-4 w-4 mr-1" />
              Manage Bed Allocation
            </Button>
            <Button size="sm" variant="outline">
              <Users className="h-4 w-4 mr-1" />
              Staff Planning
            </Button>
            <Button size="sm" variant="outline">
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
