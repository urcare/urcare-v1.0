
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Users, 
  Clock, 
  Star,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  UserCheck
} from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  workload: number;
  skillRating: number;
  preferredShifts: string[];
  currentShift: string;
  hoursWorked: number;
  maxHours: number;
  efficiency: number;
  satisfaction: number;
  status: 'optimal' | 'overloaded' | 'underutilized';
}

const mockStaff: StaffMember[] = [
  {
    id: 'STAFF001',
    name: 'Dr. Sarah Johnson',
    role: 'Physician',
    department: 'Emergency',
    workload: 85,
    skillRating: 95,
    preferredShifts: ['Day', 'Evening'],
    currentShift: 'Day',
    hoursWorked: 48,
    maxHours: 60,
    efficiency: 92,
    satisfaction: 88,
    status: 'optimal'
  },
  {
    id: 'STAFF002',
    name: 'Nurse Maria Garcia',
    role: 'Registered Nurse',
    department: 'ICU',
    workload: 95,
    skillRating: 87,
    preferredShifts: ['Night'],
    currentShift: 'Night',
    hoursWorked: 56,
    maxHours: 60,
    efficiency: 89,
    satisfaction: 75,
    status: 'overloaded'
  },
  {
    id: 'STAFF003',
    name: 'Tech Mike Wilson',
    role: 'Technician',
    department: 'Radiology',
    workload: 65,
    skillRating: 82,
    preferredShifts: ['Day', 'Evening'],
    currentShift: 'Day',
    hoursWorked: 32,
    maxHours: 50,
    efficiency: 78,
    satisfaction: 92,
    status: 'underutilized'
  }
];

export const StaffSchedulingOptimizer = () => {
  const [staff] = useState<StaffMember[]>(mockStaff);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-500 text-white';
      case 'overloaded': return 'bg-red-500 text-white';
      case 'underutilized': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal': return CheckCircle;
      case 'overloaded': return AlertTriangle;
      case 'underutilized': return Clock;
      default: return Users;
    }
  };

  const getWorkloadColor = (workload: number) => {
    if (workload < 70) return 'text-green-600';
    if (workload < 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Staff Scheduling Optimizer
          </CardTitle>
          <CardDescription>
            Workload balancing with skill matching and preference accommodation
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
                      {staff.filter(s => s.status === 'optimal').length}
                    </p>
                    <p className="text-sm text-gray-600">Optimal Schedule</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {staff.filter(s => s.status === 'overloaded').length}
                    </p>
                    <p className="text-sm text-gray-600">Overloaded</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-yellow-200 bg-yellow-50">
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {staff.filter(s => s.status === 'underutilized').length}
                    </p>
                    <p className="text-sm text-gray-600">Underutilized</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">86%</p>
                    <p className="text-sm text-gray-600">Avg Efficiency</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Staff Workload Overview</h3>
              {staff.map((member) => {
                const StatusIcon = getStatusIcon(member.status);
                return (
                  <Card 
                    key={member.id} 
                    className={`cursor-pointer transition-colors ${selectedStaff?.id === member.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-blue-400`}
                    onClick={() => setSelectedStaff(member)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold mb-1">{member.name}</h4>
                          <p className="text-sm text-gray-600 mb-1">{member.role} • {member.department}</p>
                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-4 w-4" />
                            <span className={`text-sm font-medium ${getWorkloadColor(member.workload)}`}>
                              {member.workload}% Workload
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge className={getStatusColor(member.status)}>
                            {member.status.toUpperCase()}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs">{member.skillRating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Workload</span>
                          <span className={`font-bold ${getWorkloadColor(member.workload)}`}>
                            {member.workload}%
                          </span>
                        </div>
                        <Progress value={member.workload} className="h-2" />
                        
                        <div className="flex justify-between items-center mt-3 text-sm">
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{member.hoursWorked}/{member.maxHours}h</span>
                          </div>
                          <div className="flex items-center gap-1 text-blue-600">
                            <TrendingUp className="h-3 w-3" />
                            <span>{member.efficiency}% efficiency</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div>
              {selectedStaff ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedStaff.name}</CardTitle>
                    <CardDescription>{selectedStaff.role} • {selectedStaff.department}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Workload Metrics</h4>
                          <div className="space-y-1 text-sm">
                            <p>Current Load: <strong className={getWorkloadColor(selectedStaff.workload)}>
                              {selectedStaff.workload}%
                            </strong></p>
                            <p>Hours: <strong>{selectedStaff.hoursWorked}/{selectedStaff.maxHours}</strong></p>
                            <p>Efficiency: <strong>{selectedStaff.efficiency}%</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Performance</h4>
                          <div className="space-y-1 text-sm">
                            <p>Skill Rating: <strong>{selectedStaff.skillRating}/100</strong></p>
                            <p>Satisfaction: <strong>{selectedStaff.satisfaction}%</strong></p>
                            <p>Shift: <strong>{selectedStaff.currentShift}</strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Workload Distribution</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Current Workload</span>
                            <span className={`font-bold ${getWorkloadColor(selectedStaff.workload)}`}>
                              {selectedStaff.workload}%
                            </span>
                          </div>
                          <Progress value={selectedStaff.workload} className="h-2" />
                          <div className="text-xs text-gray-500">
                            Optimal range: 70-85%
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Shift Preferences</h4>
                        <div className="flex gap-2">
                          {selectedStaff.preferredShifts.map((shift) => (
                            <Badge 
                              key={shift} 
                              variant={shift === selectedStaff.currentShift ? "default" : "outline"}
                            >
                              {shift}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Current: <strong>{selectedStaff.currentShift}</strong>
                          {selectedStaff.preferredShifts.includes(selectedStaff.currentShift) 
                            ? ' ✓ Matched preference' 
                            : ' ⚠ Not preferred'}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Optimization Recommendations</h4>
                        <div className="space-y-2">
                          {selectedStaff.status === 'overloaded' && (
                            <div className="text-sm bg-red-50 p-2 rounded">
                              <p className="font-medium text-red-800">Workload Reduction</p>
                              <p className="text-red-700">Consider redistributing tasks or adding support staff</p>
                            </div>
                          )}
                          {selectedStaff.status === 'underutilized' && (
                            <div className="text-sm bg-yellow-50 p-2 rounded">
                              <p className="font-medium text-yellow-800">Capacity Increase</p>
                              <p className="text-yellow-700">Additional responsibilities could be assigned</p>
                            </div>
                          )}
                          {selectedStaff.status === 'optimal' && (
                            <div className="text-sm bg-green-50 p-2 rounded">
                              <p className="font-medium text-green-800">Optimal Schedule</p>
                              <p className="text-green-700">Current workload and scheduling are well-balanced</p>
                            </div>
                          )}
                          <div className="text-sm bg-blue-50 p-2 rounded">
                            <p className="font-medium text-blue-800">Satisfaction Enhancement</p>
                            <p className="text-blue-700">
                              {selectedStaff.preferredShifts.includes(selectedStaff.currentShift)
                                ? 'Continue matching shift preferences'
                                : 'Consider adjusting to preferred shift times'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Skill Matching Analysis</h4>
                        <div className="text-sm bg-purple-50 p-3 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <span>Skill Rating</span>
                            <span className="font-bold">{selectedStaff.skillRating}/100</span>
                          </div>
                          <Progress value={selectedStaff.skillRating} className="h-2 mb-2" />
                          <p className="text-purple-700">
                            {selectedStaff.skillRating >= 90 
                              ? 'Highly skilled - suitable for complex cases'
                              : selectedStaff.skillRating >= 80
                              ? 'Well qualified - can handle most responsibilities'
                              : 'Developing skills - provide additional training opportunities'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <UserCheck className="h-4 w-4 mr-1" />
                          Optimize Schedule
                        </Button>
                        <Button variant="outline">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          View Analytics
                        </Button>
                        <Button variant="outline">
                          <Star className="h-4 w-4 mr-1" />
                          Skills Assessment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a staff member to view detailed scheduling metrics and optimization recommendations</p>
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
