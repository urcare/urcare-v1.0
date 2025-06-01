
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, AlertTriangle, TrendingUp, Clock, User, Activity } from 'lucide-react';

export const StaffLoadMonitor = () => {
  const [selectedShift, setSelectedShift] = useState('current');

  const staffMembers = [
    {
      id: 1,
      name: 'Nurse Johnson',
      shift: 'Day',
      patientsAssigned: 6,
      maxCapacity: 8,
      currentTasks: 12,
      completedTasks: 8,
      hoursWorked: 6.5,
      scheduledHours: 8,
      workloadLevel: 'high',
      efficiency: 85,
      specialties: ['ICU', 'Post-Op'],
      status: 'active'
    },
    {
      id: 2,
      name: 'Nurse Wilson',
      shift: 'Day',
      patientsAssigned: 5,
      maxCapacity: 7,
      currentTasks: 8,
      completedTasks: 12,
      hoursWorked: 6.5,
      scheduledHours: 8,
      workloadLevel: 'optimal',
      efficiency: 92,
      specialties: ['General', 'Pediatrics'],
      status: 'active'
    },
    {
      id: 3,
      name: 'Nurse Davis',
      shift: 'Day',
      patientsAssigned: 8,
      maxCapacity: 8,
      currentTasks: 15,
      completedTasks: 6,
      hoursWorked: 6.5,
      scheduledHours: 8,
      workloadLevel: 'overloaded',
      efficiency: 78,
      specialties: ['General', 'Geriatrics'],
      status: 'active'
    },
    {
      id: 4,
      name: 'Nurse Taylor',
      shift: 'Evening',
      patientsAssigned: 4,
      maxCapacity: 6,
      currentTasks: 6,
      completedTasks: 10,
      hoursWorked: 2,
      scheduledHours: 8,
      workloadLevel: 'low',
      efficiency: 88,
      specialties: ['General'],
      status: 'starting_soon'
    }
  ];

  const getWorkloadColor = (level: string) => {
    switch (level) {
      case 'overloaded': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'optimal': return 'bg-green-100 text-green-800 border-green-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getWorkloadPercentage = (staff: any) => {
    return Math.round((staff.patientsAssigned / staff.maxCapacity) * 100);
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 80) return 'text-yellow-600';
    if (efficiency >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const overloadedStaff = staffMembers.filter(s => s.workloadLevel === 'overloaded');
  const totalPatients = staffMembers.reduce((sum, staff) => sum + staff.patientsAssigned, 0);
  const avgEfficiency = Math.round(staffMembers.reduce((sum, staff) => sum + staff.efficiency, 0) / staffMembers.length);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6 text-cyan-600" />
          Staff Load Monitor
        </h2>
        <div className="flex gap-4">
          <Select value={selectedShift} onValueChange={setSelectedShift}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Shift</SelectItem>
              <SelectItem value="day">Day Shift</SelectItem>
              <SelectItem value="evening">Evening Shift</SelectItem>
              <SelectItem value="night">Night Shift</SelectItem>
            </SelectContent>
          </Select>
          {overloadedStaff.length > 0 && (
            <Button className="bg-red-600 hover:bg-red-700">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Overload Alert ({overloadedStaff.length})
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{staffMembers.length}</div>
            <p className="text-sm text-blue-800">Active Staff</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{totalPatients}</div>
            <p className="text-sm text-green-800">Total Patients</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{avgEfficiency}%</div>
            <p className="text-sm text-yellow-800">Avg Efficiency</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{overloadedStaff.length}</div>
            <p className="text-sm text-red-800">Overloaded</p>
          </CardContent>
        </Card>
      </div>

      {overloadedStaff.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Staff Overload Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overloadedStaff.map(staff => (
                <div key={staff.id} className="bg-white border border-red-300 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-red-900">{staff.name}</h4>
                      <p className="text-sm text-red-700">
                        {staff.patientsAssigned}/{staff.maxCapacity} patients • {staff.currentTasks} active tasks
                      </p>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Redistribute Load
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {staffMembers.map(staff => (
          <Card key={staff.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {staff.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{staff.shift} Shift</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getWorkloadColor(staff.workloadLevel)}>
                    {staff.workloadLevel.toUpperCase()}
                  </Badge>
                  <Badge className={staff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {staff.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Patient Load</span>
                    <span>{staff.patientsAssigned}/{staff.maxCapacity} ({getWorkloadPercentage(staff)}%)</span>
                  </div>
                  <Progress 
                    value={getWorkloadPercentage(staff)} 
                    className={`h-2 ${
                      staff.workloadLevel === 'overloaded' ? '[&>div]:bg-red-500' :
                      staff.workloadLevel === 'high' ? '[&>div]:bg-orange-500' :
                      staff.workloadLevel === 'optimal' ? '[&>div]:bg-green-500' :
                      '[&>div]:bg-blue-500'
                    }`}
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Hours Worked</span>
                    <span>{staff.hoursWorked}/{staff.scheduledHours} hrs</span>
                  </div>
                  <Progress 
                    value={(staff.hoursWorked / staff.scheduledHours) * 100} 
                    className="h-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-lg font-bold text-gray-800">{staff.currentTasks}</div>
                    <p className="text-gray-600">Active Tasks</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-lg font-bold text-gray-800">{staff.completedTasks}</div>
                    <p className="text-gray-600">Completed</p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Efficiency</span>
                    <span className={`text-sm font-bold ${getEfficiencyColor(staff.efficiency)}`}>
                      {staff.efficiency}%
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {staff.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Activity className="h-4 w-4 mr-2" />
                  View Tasks
                </Button>
                <Button size="sm" variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule Break
                </Button>
                {staff.workloadLevel === 'overloaded' && (
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Reassign Tasks
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Workload Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">1:5.5</div>
              <p className="text-sm text-green-800">Nurse:Patient Ratio</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">45 min</div>
              <p className="text-sm text-blue-800">Avg Task Time</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-xl font-bold text-yellow-600">3.2 hrs</div>
              <p className="text-sm text-yellow-800">Time to Break</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-xl font-bold text-purple-600">94%</div>
              <p className="text-sm text-purple-800">Schedule Adherence</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
