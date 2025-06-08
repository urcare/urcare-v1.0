
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  Wrench, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  FileText,
  BarChart3,
  Activity
} from 'lucide-react';

export const EquipmentManagement = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const equipment = [
    {
      id: 'EQ001',
      name: 'Chemistry Analyzer Pro 5000',
      department: 'Chemistry',
      manufacturer: 'LabTech Systems',
      model: 'ChemMax Pro 5000',
      serialNumber: 'CM5000-2023-001',
      status: 'operational',
      uptime: 99.2,
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-02-15',
      maintenanceType: 'Preventive',
      serviceHistory: 15,
      calibrationStatus: 'current',
      utilizationRate: 85
    },
    {
      id: 'EQ002',
      name: 'Hematology Analyzer Elite',
      department: 'Hematology',
      manufacturer: 'BloodTech Inc',
      model: 'HemaCount Elite',
      serialNumber: 'HCE-2023-002',
      status: 'warning',
      uptime: 97.8,
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-01-25',
      maintenanceType: 'Corrective',
      serviceHistory: 22,
      calibrationStatus: 'overdue',
      utilizationRate: 92
    },
    {
      id: 'EQ003',
      name: 'Immunoassay System 2000',
      department: 'Immunology',
      manufacturer: 'ImmunoLab Corp',
      model: 'ImmunoLite 2000',
      serialNumber: 'IL2000-2023-003',
      status: 'operational',
      uptime: 98.9,
      lastMaintenance: '2024-01-18',
      nextMaintenance: '2024-02-18',
      maintenanceType: 'Preventive',
      serviceHistory: 8,
      calibrationStatus: 'current',
      utilizationRate: 78
    },
    {
      id: 'EQ004',
      name: 'Microbiology Incubator Pro',
      department: 'Microbiology',
      manufacturer: 'BioGrow Systems',
      model: 'BioGrow Pro 300',
      serialNumber: 'BGP300-2023-004',
      status: 'maintenance',
      uptime: 0,
      lastMaintenance: '2024-01-20',
      nextMaintenance: '2024-02-20',
      maintenanceType: 'Emergency',
      serviceHistory: 12,
      calibrationStatus: 'pending',
      utilizationRate: 0
    }
  ];

  const maintenanceSchedule = [
    {
      equipment: 'Hematology Analyzer Elite',
      type: 'Calibration',
      scheduled: '2024-01-21',
      technician: 'Mike Chen',
      priority: 'high',
      estimatedDuration: '2 hours'
    },
    {
      equipment: 'Chemistry Analyzer Pro 5000',
      type: 'Preventive Maintenance',
      scheduled: '2024-01-25',
      technician: 'Sarah Johnson',
      priority: 'medium',
      estimatedDuration: '4 hours'
    },
    {
      equipment: 'Centrifuge Unit 5',
      type: 'Cleaning & Inspection',
      scheduled: '2024-01-22',
      technician: 'David Kim',
      priority: 'low',
      estimatedDuration: '1 hour'
    },
    {
      equipment: 'PCR Machine Alpha',
      type: 'Software Update',
      scheduled: '2024-01-23',
      technician: 'Lisa Park',
      priority: 'medium',
      estimatedDuration: '30 minutes'
    }
  ];

  const serviceHistory = [
    {
      date: '2024-01-20',
      equipment: 'Microbiology Incubator Pro',
      type: 'Emergency Repair',
      technician: 'External Service',
      issue: 'Temperature control malfunction',
      resolution: 'Replaced faulty sensor and recalibrated',
      downtime: '8 hours',
      cost: '$850'
    },
    {
      date: '2024-01-18',
      equipment: 'Immunoassay System 2000',
      type: 'Preventive Maintenance',
      technician: 'Mike Chen',
      issue: 'Routine maintenance',
      resolution: 'Cleaned optical components and updated software',
      downtime: '2 hours',
      cost: '$200'
    },
    {
      date: '2024-01-15',
      equipment: 'Chemistry Analyzer Pro 5000',
      type: 'Calibration',
      technician: 'Sarah Johnson',
      issue: 'Monthly calibration',
      resolution: 'Standard calibration procedure completed',
      downtime: '1 hour',
      cost: '$100'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Equipment Management</h2>
          <p className="text-gray-600">Monitor and maintain laboratory equipment</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="chemistry">Chemistry</SelectItem>
              <SelectItem value="hematology">Hematology</SelectItem>
              <SelectItem value="microbiology">Microbiology</SelectItem>
              <SelectItem value="immunology">Immunology</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Maintenance
          </Button>
          <Button className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Service Request
          </Button>
        </div>
      </div>

      {/* Equipment Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">18</p>
            <p className="text-sm text-green-700">Operational</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-900">3</p>
            <p className="text-sm text-yellow-700">Warning</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <Wrench className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-900">2</p>
            <p className="text-sm text-red-700">Under Maintenance</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">87%</p>
            <p className="text-sm text-blue-700">Avg Utilization</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equipment List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Equipment Status</CardTitle>
              <CardDescription>Current status and performance of all laboratory equipment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {equipment.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.department} • {item.model}</p>
                        <p className="text-xs text-gray-500">S/N: {item.serialNumber}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${
                          item.status === 'operational' ? 'bg-green-500' :
                          item.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        } text-white`}>
                          {item.status}
                        </Badge>
                        <Badge className={`${
                          item.calibrationStatus === 'current' ? 'bg-green-500' :
                          item.calibrationStatus === 'overdue' ? 'bg-red-500' : 'bg-gray-500'
                        } text-white`}>
                          {item.calibrationStatus}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Uptime</p>
                        <p className="font-medium">{item.uptime}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Utilization</p>
                        <p className="font-medium">{item.utilizationRate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Last Service</p>
                        <p className="font-medium">{item.lastMaintenance}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Next Service</p>
                        <p className="font-medium">{item.nextMaintenance}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Uptime</span>
                        <span>{item.uptime}%</span>
                      </div>
                      <Progress value={item.uptime} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">Service History: {item.serviceHistory} records</span>
                        <span className="text-gray-600">Type: {item.maintenanceType}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <FileText className="h-3 w-3 mr-1" />
                          History
                        </Button>
                        <Button size="sm">
                          <Settings className="h-3 w-3 mr-1" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Maintenance Schedule & Service History */}
        <div className="space-y-6">
          {/* Maintenance Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Schedule</CardTitle>
              <CardDescription>Upcoming maintenance and calibrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {maintenanceSchedule.map((task, index) => (
                  <div key={index} className={`p-3 border-l-4 rounded ${
                    task.priority === 'high' ? 'border-l-red-500 bg-red-50' :
                    task.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50' : 'border-l-blue-500 bg-blue-50'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-medium text-sm">{task.type}</h5>
                      <Badge variant="outline" className={`text-xs ${
                        task.priority === 'high' ? 'border-red-500 text-red-700' :
                        task.priority === 'medium' ? 'border-yellow-500 text-yellow-700' : 'border-blue-500 text-blue-700'
                      }`}>
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-900">{task.equipment}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{task.scheduled}</span>
                      <User className="h-3 w-3" />
                      <span>{task.technician}</span>
                      <Clock className="h-3 w-3" />
                      <span>{task.estimatedDuration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Service History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Service History</CardTitle>
              <CardDescription>Latest maintenance and repair activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {serviceHistory.map((service, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{service.type}</span>
                      <span className="text-xs text-gray-500">{service.date}</span>
                    </div>
                    <p className="text-sm text-gray-900">{service.equipment}</p>
                    <p className="text-sm text-gray-600">{service.issue}</p>
                    <p className="text-xs text-gray-500 mt-1">{service.resolution}</p>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-gray-500">Downtime: {service.downtime}</span>
                      <span className="font-medium">{service.cost}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Wrench className="h-4 w-4 mr-2" />
                Request Service
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Calibration
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Activity className="h-4 w-4 mr-2" />
                Performance Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
