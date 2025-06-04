
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  Heart,
  Activity,
  User,
  Calendar
} from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  currentWorkload: number;
  maxCapacity: number;
  burnoutRisk: number;
  hoursWorked: number;
  patientsAssigned: number;
  status: 'normal' | 'high_load' | 'overloaded' | 'burnout_risk';
  wellnessScore: number;
  shiftPattern: string;
}

const mockStaff: StaffMember[] = [
  {
    id: 'SM001',
    name: 'Dr. Sarah Mitchell',
    role: 'Attending Physician',
    department: 'Emergency',
    currentWorkload: 95,
    maxCapacity: 100,
    burnoutRisk: 78,
    hoursWorked: 52,
    patientsAssigned: 18,
    status: 'burnout_risk',
    wellnessScore: 42,
    shiftPattern: 'Day Shift'
  },
  {
    id: 'SM002',
    name: 'Nurse Jennifer Liu',
    role: 'Registered Nurse',
    department: 'ICU',
    currentWorkload: 87,
    maxCapacity: 80,
    burnoutRisk: 65,
    hoursWorked: 44,
    patientsAssigned: 8,
    status: 'overloaded',
    wellnessScore: 58,
    shiftPattern: 'Night Shift'
  }
];

export const StaffOverloadDetector = () => {
  const [staff] = useState<StaffMember[]>(mockStaff);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-500 text-white';
      case 'high_load': return 'bg-yellow-500 text-white';
      case 'overloaded': return 'bg-orange-500 text-white';
      case 'burnout_risk': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getWorkloadColor = (workload: number, capacity: number) => {
    const ratio = workload / capacity;
    if (ratio >= 0.9) return 'text-red-600';
    if (ratio >= 0.8) return 'text-orange-600';
    if (ratio >= 0.7) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Staff Overload Detector
          </CardTitle>
          <CardDescription>
            Workload analysis with predictive burnout detection and intelligent resource rebalancing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">{staff.filter(s => s.status === 'burnout_risk' || s.status === 'overloaded').length}</p>
                    <p className="text-sm text-gray-600">At Risk</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">72%</p>
                    <p className="text-sm text-gray-600">Avg Workload</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Heart className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">58</p>
                    <p className="text-sm text-gray-600">Avg Wellness Score</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <Activity className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">89%</p>
                    <p className="text-sm text-gray-600">Efficiency Score</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Staff Workload Monitor</h3>
              {staff.map((member) => (
                <Card 
                  key={member.id} 
                  className={`cursor-pointer transition-colors ${selectedStaff?.id === member.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-red-400`}
                  onClick={() => setSelectedStaff(member)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-gray-500" />
                          <h4 className="font-semibold">{member.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{member.role}</p>
                        <p className="text-sm font-medium text-blue-600">{member.department}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getStatusColor(member.status)}>
                          {member.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Workload</span>
                        <span className={`font-bold ${getWorkloadColor(member.currentWorkload, member.maxCapacity)}`}>
                          {member.currentWorkload}/{member.maxCapacity}
                        </span>
                      </div>
                      <Progress value={(member.currentWorkload / member.maxCapacity) * 100} className="h-2" />
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Burnout Risk</span>
                        <span className="font-bold text-red-600">{member.burnoutRisk}%</span>
                      </div>
                      <Progress value={member.burnoutRisk} className="h-2" />
                      
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{member.hoursWorked}h this week</span>
                        </div>
                        <div className="text-sm text-blue-600">
                          <span>{member.patientsAssigned} patients</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                          <h4 className="font-medium mb-2">Workload Details</h4>
                          <div className="space-y-1 text-sm">
                            <p>Current Load: <strong>{selectedStaff.currentWorkload}/{selectedStaff.maxCapacity}</strong></p>
                            <p>Hours Worked: <strong>{selectedStaff.hoursWorked}h</strong></p>
                            <p>Patients: <strong>{selectedStaff.patientsAssigned}</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Wellness Metrics</h4>
                          <div className="space-y-1 text-sm">
                            <p>Burnout Risk: <strong>{selectedStaff.burnoutRisk}%</strong></p>
                            <p>Wellness Score: <strong>{selectedStaff.wellnessScore}/100</strong></p>
                            <p>Shift: <strong>{selectedStaff.shiftPattern}</strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Risk Analysis</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm p-2 bg-red-50 rounded">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span>High workload exceeding capacity</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm p-2 bg-orange-50 rounded">
                            <Clock className="h-4 w-4 text-orange-600" />
                            <span>Extended working hours this week</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm p-2 bg-yellow-50 rounded">
                            <Heart className="h-4 w-4 text-yellow-600" />
                            <span>Wellness score below optimal range</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">AI Rebalancing Suggestions</h4>
                        <div className="text-sm bg-blue-50 p-3 rounded space-y-1">
                          <p>• Redistribute 3 patients to Dr. Johnson (current load: 65%)</p>
                          <p>• Schedule mandatory 2-day break after current shift</p>
                          <p>• Assign backup coverage for non-critical tasks</p>
                          <p>• Recommend wellness program participation</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Workload Trends (Last 30 Days)</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Week 1</span>
                            <span className="text-green-600">72%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Week 2</span>
                            <span className="text-yellow-600">78%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Week 3</span>
                            <span className="text-orange-600">85%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Week 4 (Current)</span>
                            <span className="text-red-600">95%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <Users className="h-4 w-4 mr-1" />
                          Rebalance Load
                        </Button>
                        <Button variant="outline">
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule Break
                        </Button>
                        <Button variant="outline">
                          <Heart className="h-4 w-4 mr-1" />
                          Wellness Check
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a staff member to view workload analysis and rebalancing options</p>
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
