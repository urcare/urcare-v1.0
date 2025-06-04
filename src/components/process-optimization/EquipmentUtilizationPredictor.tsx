
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Wrench, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  TrendingUp,
  Settings,
  Tool
} from 'lucide-react';

interface EquipmentData {
  id: string;
  equipmentName: string;
  department: string;
  currentUtilization: number;
  predictedUtilization: number;
  maintenanceSchedule: string;
  lastMaintenance: string;
  availabilityForecast: number;
  replacementDue: string;
  status: 'optimal' | 'maintenance_due' | 'replacement_needed';
  maintenanceType: string;
}

const mockEquipment: EquipmentData[] = [
  {
    id: 'EQ001',
    equipmentName: 'MRI Scanner #1',
    department: 'Radiology',
    currentUtilization: 92,
    predictedUtilization: 95,
    maintenanceSchedule: '2024-02-15',
    lastMaintenance: '2024-01-15',
    availabilityForecast: 94,
    replacementDue: '2026-08-15',
    status: 'optimal',
    maintenanceType: 'Routine'
  },
  {
    id: 'EQ002',
    equipmentName: 'CT Scanner #2',
    department: 'Emergency',
    currentUtilization: 88,
    predictedUtilization: 91,
    maintenanceSchedule: '2024-01-28',
    lastMaintenance: '2023-12-28',
    availabilityForecast: 87,
    replacementDue: '2025-12-01',
    status: 'maintenance_due',
    maintenanceType: 'Preventive'
  },
  {
    id: 'EQ003',
    equipmentName: 'Ventilator #5',
    department: 'ICU',
    currentUtilization: 76,
    predictedUtilization: 82,
    maintenanceSchedule: '2024-02-01',
    lastMaintenance: '2024-01-01',
    availabilityForecast: 78,
    replacementDue: '2024-06-15',
    status: 'replacement_needed',
    maintenanceType: 'Critical'
  }
];

export const EquipmentUtilizationPredictor = () => {
  const [equipment] = useState<EquipmentData[]>(mockEquipment);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentData | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-500 text-white';
      case 'maintenance_due': return 'bg-yellow-500 text-white';
      case 'replacement_needed': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal': return CheckCircle;
      case 'maintenance_due': return Clock;
      case 'replacement_needed': return AlertTriangle;
      default: return Wrench;
    }
  };

  const getMaintenanceTypeColor = (type: string) => {
    switch (type) {
      case 'Routine': return 'text-blue-600';
      case 'Preventive': return 'text-yellow-600';
      case 'Critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Equipment Utilization Predictor
          </CardTitle>
          <CardDescription>
            Maintenance scheduling with availability forecasting and replacement planning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {equipment.filter(e => e.status === 'optimal').length}
                    </p>
                    <p className="text-sm text-gray-600">Optimal Status</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-yellow-200 bg-yellow-50">
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {equipment.filter(e => e.status === 'maintenance_due').length}
                    </p>
                    <p className="text-sm text-gray-600">Maintenance Due</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {equipment.filter(e => e.status === 'replacement_needed').length}
                    </p>
                    <p className="text-sm text-gray-600">Replacement Needed</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">86%</p>
                    <p className="text-sm text-gray-600">Avg Utilization</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Equipment Status Overview</h3>
              {equipment.map((item) => {
                const StatusIcon = getStatusIcon(item.status);
                return (
                  <Card 
                    key={item.id} 
                    className={`cursor-pointer transition-colors ${selectedEquipment?.id === item.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-orange-400`}
                    onClick={() => setSelectedEquipment(item)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold mb-1">{item.equipmentName}</h4>
                          <p className="text-sm text-gray-600 mb-1">{item.department}</p>
                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {item.currentUtilization}% Utilized
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge className={getStatusColor(item.status)}>
                            {item.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Current Utilization</span>
                          <span className="font-bold">{item.currentUtilization}%</span>
                        </div>
                        <Progress value={item.currentUtilization} className="h-2" />
                        
                        <div className="flex justify-between items-center mt-3 text-sm">
                          <div className="flex items-center gap-1 text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>Next: {item.maintenanceSchedule}</span>
                          </div>
                          <div className={`flex items-center gap-1 ${getMaintenanceTypeColor(item.maintenanceType)}`}>
                            <Tool className="h-3 w-3" />
                            <span>{item.maintenanceType}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div>
              {selectedEquipment ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedEquipment.equipmentName}</CardTitle>
                    <CardDescription>{selectedEquipment.department} Department</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Utilization Metrics</h4>
                          <div className="space-y-1 text-sm">
                            <p>Current: <strong>{selectedEquipment.currentUtilization}%</strong></p>
                            <p>Predicted: <strong>{selectedEquipment.predictedUtilization}%</strong></p>
                            <p>Availability: <strong>{selectedEquipment.availabilityForecast}%</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Maintenance Info</h4>
                          <div className="space-y-1 text-sm">
                            <p>Type: <strong className={getMaintenanceTypeColor(selectedEquipment.maintenanceType)}>
                              {selectedEquipment.maintenanceType}
                            </strong></p>
                            <p>Last: <strong>{selectedEquipment.lastMaintenance}</strong></p>
                            <p>Next: <strong>{selectedEquipment.maintenanceSchedule}</strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Utilization Forecast</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Predicted Utilization</span>
                            <span className="font-bold">{selectedEquipment.predictedUtilization}%</span>
                          </div>
                          <Progress value={selectedEquipment.predictedUtilization} className="h-2" />
                          <div className="flex items-center gap-2 text-sm">
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                            <span>
                              {selectedEquipment.predictedUtilization - selectedEquipment.currentUtilization > 0 ? '+' : ''}
                              {selectedEquipment.predictedUtilization - selectedEquipment.currentUtilization}% change expected
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Availability Forecast</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Expected Availability</span>
                            <span className="font-bold">{selectedEquipment.availabilityForecast}%</span>
                          </div>
                          <Progress value={selectedEquipment.availabilityForecast} className="h-2" />
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Replacement Planning</h4>
                        <div className="text-sm bg-orange-50 p-3 rounded">
                          <p className="font-medium text-orange-800">Replacement Due</p>
                          <p className="text-orange-700">{selectedEquipment.replacementDue}</p>
                          <p className="text-orange-600 mt-1">
                            {selectedEquipment.status === 'replacement_needed' 
                              ? 'Immediate replacement recommended' 
                              : 'Monitor for replacement planning'}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Maintenance Recommendations</h4>
                        <div className="space-y-2">
                          <div className="text-sm bg-blue-50 p-2 rounded">
                            <p className="font-medium text-blue-800">Scheduled Maintenance</p>
                            <p className="text-blue-700">Next {selectedEquipment.maintenanceType.toLowerCase()} maintenance on {selectedEquipment.maintenanceSchedule}</p>
                          </div>
                          {selectedEquipment.status === 'maintenance_due' && (
                            <div className="text-sm bg-yellow-50 p-2 rounded">
                              <p className="font-medium text-yellow-800">Action Required</p>
                              <p className="text-yellow-700">Schedule maintenance to prevent service interruption</p>
                            </div>
                          )}
                          {selectedEquipment.status === 'replacement_needed' && (
                            <div className="text-sm bg-red-50 p-2 rounded">
                              <p className="font-medium text-red-800">Urgent Action</p>
                              <p className="text-red-700">Equipment replacement should be prioritized</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule Maintenance
                        </Button>
                        <Button variant="outline">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          View Analytics
                        </Button>
                        <Button variant="outline">
                          <Settings className="h-4 w-4 mr-1" />
                          Configure Alerts
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select equipment to view detailed utilization metrics and maintenance planning</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
