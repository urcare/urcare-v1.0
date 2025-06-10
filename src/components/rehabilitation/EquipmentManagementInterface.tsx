
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Settings, Calendar, AlertTriangle, CheckCircle, Clock, Wrench, Plus } from 'lucide-react';

export const EquipmentManagementInterface = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const equipment = [
    {
      id: 1,
      name: 'Parallel Bars - Station 1',
      category: 'Mobility Training',
      status: 'available',
      location: 'PT Room 1',
      lastMaintenance: '2024-01-01',
      nextMaintenance: '2024-02-01',
      utilization: 85,
      condition: 'excellent'
    },
    {
      id: 2,
      name: 'Electric Stimulation Unit',
      category: 'Therapeutic Equipment',
      status: 'in-use',
      location: 'PT Room 2',
      lastMaintenance: '2023-12-15',
      nextMaintenance: '2024-01-15',
      utilization: 92,
      condition: 'good'
    },
    {
      id: 3,
      name: 'Standing Frame - Adult',
      category: 'Mobility Training',
      status: 'maintenance',
      location: 'Equipment Storage',
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-02-10',
      utilization: 75,
      condition: 'fair'
    },
    {
      id: 4,
      name: 'Therapeutic Exercise Bike',
      category: 'Cardio Equipment',
      status: 'available',
      location: 'Cardio Room',
      lastMaintenance: '2024-01-05',
      nextMaintenance: '2024-02-05',
      utilization: 68,
      condition: 'excellent'
    },
    {
      id: 5,
      name: 'Upper Body Ergometer',
      category: 'Cardio Equipment',
      status: 'scheduled',
      location: 'PT Room 3',
      lastMaintenance: '2023-12-20',
      nextMaintenance: '2024-01-20',
      utilization: 78,
      condition: 'good'
    }
  ];

  const maintenanceSchedule = [
    {
      id: 1,
      equipment: 'Electric Stimulation Unit',
      type: 'Preventive Maintenance',
      scheduled: '2024-01-15',
      technician: 'John Davis',
      duration: 2,
      priority: 'high'
    },
    {
      id: 2,
      equipment: 'Upper Body Ergometer',
      type: 'Calibration Check',
      scheduled: '2024-01-20',
      technician: 'Sarah Wilson',
      duration: 1,
      priority: 'medium'
    },
    {
      id: 3,
      equipment: 'Parallel Bars - Station 2',
      type: 'Safety Inspection',
      scheduled: '2024-01-25',
      technician: 'Mike Chen',
      duration: 1,
      priority: 'low'
    }
  ];

  const equipmentCategories = [
    'Mobility Training',
    'Therapeutic Equipment',
    'Cardio Equipment',
    'Strength Training',
    'Balance Training'
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'available': return 'bg-green-500 text-white';
      case 'in-use': return 'bg-blue-500 text-white';
      case 'maintenance': return 'bg-red-500 text-white';
      case 'scheduled': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getConditionColor = (condition: string) => {
    switch(condition) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const filteredEquipment = selectedCategory === 'all' 
    ? equipment 
    : equipment.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Equipment Management</h2>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Categories</option>
            {equipmentCategories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Wrench className="h-4 w-4 mr-2" />
            Maintenance Log
          </Button>
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Equipment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Equipment Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredEquipment.map((item) => (
                <Card key={item.id} className="border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.category}</p>
                          <p className="text-sm text-gray-600">{item.location}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                          <Badge className={getConditionColor(item.condition)} variant="outline">
                            {item.condition}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Utilization</span>
                          <span>{item.utilization}%</span>
                        </div>
                        <Progress value={item.utilization} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div>
                          <span>Last Maintenance:</span>
                          <div>{item.lastMaintenance}</div>
                        </div>
                        <div>
                          <span>Next Maintenance:</span>
                          <div>{item.nextMaintenance}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Maintenance Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceSchedule.map((maintenance) => (
                <Card key={maintenance.id} className="border-l-4 border-l-orange-500">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{maintenance.equipment}</h3>
                          <p className="text-sm text-gray-600">{maintenance.type}</p>
                        </div>
                        <Badge className={getPriorityColor(maintenance.priority)}>
                          {maintenance.priority}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {maintenance.scheduled}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {maintenance.duration}h
                        </div>
                        <div className="col-span-2">
                          <span>Technician: {maintenance.technician}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Equipment Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-800">Available Equipment</h3>
              </div>
              <div className="text-2xl font-bold text-green-600">18</div>
              <p className="text-sm text-green-600">Ready for use</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">In Use</h3>
              </div>
              <div className="text-2xl font-bold text-blue-600">8</div>
              <p className="text-sm text-blue-600">Currently active</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold text-red-800">Maintenance Needed</h3>
              </div>
              <div className="text-2xl font-bold text-red-600">3</div>
              <p className="text-sm text-red-600">Requires attention</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold text-orange-800">Avg. Utilization</h3>
              </div>
              <div className="text-2xl font-bold text-orange-600">78%</div>
              <p className="text-sm text-orange-600">This month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
