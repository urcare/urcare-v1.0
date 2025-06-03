
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plane, AlertTriangle, Users, CheckCircle, XCircle } from 'lucide-react';

export const LeaveConflictManager = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const leaveRequests = [
    {
      id: '1',
      employee: 'Dr. Sarah Wilson',
      department: 'ICU',
      type: 'Annual Leave',
      startDate: '2024-06-15',
      endDate: '2024-06-20',
      status: 'pending',
      conflicts: ['Critical ICU coverage gap'],
      alternatives: ['Dr. Mike Johnson available', 'Temporary staff from pool']
    },
    {
      id: '2',
      employee: 'Nurse John Smith',
      department: 'Emergency',
      type: 'Sick Leave',
      startDate: '2024-06-10',
      endDate: '2024-06-12',
      status: 'approved',
      conflicts: [],
      alternatives: []
    },
    {
      id: '3',
      employee: 'Dr. Lisa Davis',
      department: 'Cardiology',
      type: 'Emergency Leave',
      startDate: '2024-06-18',
      endDate: '2024-06-25',
      status: 'pending',
      conflicts: ['No cardiologist coverage', 'Scheduled surgeries affected'],
      alternatives: ['Reschedule non-urgent procedures', 'Contact external consultants']
    }
  ];

  const leaveBalance = [
    { employee: 'Dr. Sarah Wilson', annual: 12, sick: 8, emergency: 3, used: { annual: 8, sick: 2, emergency: 1 } },
    { employee: 'Nurse John Smith', annual: 15, sick: 10, emergency: 3, used: { annual: 5, sick: 4, emergency: 0 } },
    { employee: 'Dr. Lisa Davis', annual: 18, sick: 12, emergency: 5, used: { annual: 10, sick: 1, emergency: 2 } }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Approved', className: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800' }
    };
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leave Conflict Manager</h2>
          <p className="text-gray-600">Intelligent leave management with coverage alternatives</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Leave Calendar
          </Button>
          <Button>
            <Plane className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>

      {/* Leave Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Plane className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">23</div>
                <div className="text-sm text-gray-600">Pending Requests</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">5</div>
                <div className="text-sm text-gray-600">Conflicts Detected</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">12</div>
                <div className="text-sm text-gray-600">Staff On Leave Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">156</div>
                <div className="text-sm text-gray-600">Approved This Month</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conflict Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            High Priority Conflicts
          </CardTitle>
          <CardDescription>Leave requests requiring immediate attention due to coverage issues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaveRequests.filter(req => req.conflicts.length > 0).map((request) => (
              <div key={request.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-red-800">{request.employee}</h4>
                    <p className="text-sm text-red-600">{request.department} • {request.type}</p>
                    <p className="text-sm text-red-600">{request.startDate} to {request.endDate}</p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
                
                <div className="space-y-2 mb-3">
                  <p className="text-sm font-medium text-red-800">Conflicts:</p>
                  <ul className="text-sm text-red-700">
                    {request.conflicts.map((conflict, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3" />
                        {conflict}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2 mb-3">
                  <p className="text-sm font-medium text-red-800">Suggested Alternatives:</p>
                  <div className="flex flex-wrap gap-1">
                    {request.alternatives.map((alt, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-red-300 text-red-700">
                        {alt}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Approve with Coverage
                  </Button>
                  <Button size="sm" variant="outline">
                    Request Alternative Dates
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-300">
                    <XCircle className="w-3 h-3 mr-1" />
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leave Requests Management */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Requests Dashboard</CardTitle>
          <CardDescription>Manage all leave requests with automated conflict detection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaveRequests.map((request) => (
              <div key={request.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Plane className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{request.employee}</h4>
                      <p className="text-sm text-gray-600">{request.department}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">{request.type}</p>
                      <p className="text-sm text-gray-600">{request.startDate} - {request.endDate}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </div>
                
                {request.conflicts.length > 0 && (
                  <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">Coverage Conflicts</span>
                    </div>
                    <ul className="text-sm text-yellow-700 ml-6">
                      {request.conflicts.map((conflict, index) => (
                        <li key={index}>{conflict}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex gap-2">
                  {request.status === 'pending' && (
                    <>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline">
                        Request Changes
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        <XCircle className="w-3 h-3 mr-1" />
                        Decline
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leave Balance Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Balance Overview</CardTitle>
          <CardDescription>Track remaining leave balances and accruals for all staff</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaveBalance.map((staff, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3">{staff.employee}</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Annual Leave</p>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Used: {staff.used.annual}</span>
                      <span>Remaining: {staff.annual - staff.used.annual}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(staff.used.annual / staff.annual) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Sick Leave</p>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Used: {staff.used.sick}</span>
                      <span>Remaining: {staff.sick - staff.used.sick}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${(staff.used.sick / staff.sick) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Emergency Leave</p>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Used: {staff.used.emergency}</span>
                      <span>Remaining: {staff.emergency - staff.used.emergency}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full" 
                        style={{ width: `${(staff.used.emergency / staff.emergency) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leave Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Leave Calendar</CardTitle>
          <CardDescription>Visual overview of approved leaves and coverage planning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="p-3 border rounded-lg">
                <h5 className="font-medium text-center mb-2">{day}</h5>
                <div className="space-y-1">
                  <div className="text-xs p-1 bg-blue-50 border border-blue-200 rounded">
                    Dr. Wilson (Annual)
                  </div>
                  <div className="text-xs p-1 bg-red-50 border border-red-200 rounded">
                    Nurse Smith (Sick)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
