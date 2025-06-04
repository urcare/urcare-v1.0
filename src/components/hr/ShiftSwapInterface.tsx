
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Users,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  ArrowRightLeft
} from 'lucide-react';

export const ShiftSwapInterface = () => {
  const [selectedShift, setSelectedShift] = useState(null);
  const [viewMode, setViewMode] = useState('requests');

  const swapRequests = [
    {
      id: '1',
      requester: 'Dr. Sarah Wilson',
      requesterDept: 'ICU',
      originalShift: {
        date: '2024-06-08',
        time: '14:00 - 22:00',
        type: 'Evening Shift'
      },
      desiredShift: {
        date: '2024-06-10',
        time: '06:00 - 14:00',
        type: 'Morning Shift'
      },
      reason: 'Family emergency - need to attend important event',
      status: 'pending',
      urgency: 'high',
      potentialMatches: [
        { name: 'Dr. Mike Johnson', compatibility: 95, availability: 'available' },
        { name: 'Dr. Lisa Brown', compatibility: 88, availability: 'conditional' }
      ],
      requestedAt: '2024-06-04 09:30'
    },
    {
      id: '2',
      requester: 'Nurse John Smith',
      requesterDept: 'Emergency',
      originalShift: {
        date: '2024-06-06',
        time: '22:00 - 06:00',
        type: 'Night Shift'
      },
      desiredShift: {
        date: '2024-06-07',
        time: '14:00 - 22:00',
        type: 'Evening Shift'
      },
      reason: 'Schedule conflict with continuing education course',
      status: 'approved',
      urgency: 'medium',
      potentialMatches: [
        { name: 'Nurse Maria Garcia', compatibility: 92, availability: 'available' }
      ],
      requestedAt: '2024-06-03 15:45'
    },
    {
      id: '3',
      requester: 'Dr. Tom Wilson',
      requesterDept: 'Surgery',
      originalShift: {
        date: '2024-06-09',
        time: '06:00 - 14:00',
        type: 'Morning Shift'
      },
      desiredShift: {
        date: '2024-06-11',
        time: '14:00 - 22:00',
        type: 'Evening Shift'
      },
      reason: 'Personal appointment',
      status: 'rejected',
      urgency: 'low',
      potentialMatches: [],
      requestedAt: '2024-06-02 11:20'
    }
  ];

  const upcomingShifts = [
    {
      id: '1',
      date: '2024-06-05',
      shifts: [
        { time: '06:00-14:00', staff: 'Dr. Sarah Wilson', department: 'ICU', swappable: true },
        { time: '14:00-22:00', staff: 'Dr. Mike Johnson', department: 'ICU', swappable: true },
        { time: '22:00-06:00', staff: 'Nurse Lisa Brown', department: 'ICU', swappable: false }
      ]
    },
    {
      id: '2',
      date: '2024-06-06',
      shifts: [
        { time: '06:00-14:00', staff: 'Nurse John Smith', department: 'Emergency', swappable: true },
        { time: '14:00-22:00', staff: 'Dr. Tom Wilson', department: 'Emergency', swappable: true },
        { time: '22:00-06:00', staff: 'Nurse Maria Garcia', department: 'Emergency', swappable: true }
      ]
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { label: 'Approved', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800', icon: XCircle },
      completed: { label: 'Completed', className: 'bg-blue-100 text-blue-800', icon: CheckCircle }
    };
    const config = statusConfig[status];
    const IconComponent = config.icon;
    return (
      <Badge className={config.className}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getUrgencyBadge = (urgency) => {
    const urgencyConfig = {
      high: { label: 'High', className: 'bg-red-100 text-red-800' },
      medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-800' },
      low: { label: 'Low', className: 'bg-green-100 text-green-800' }
    };
    const config = urgencyConfig[urgency];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Shift Swap Management</h3>
          <p className="text-gray-600">Manage shift exchange requests with automated matching</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            View Calendar
          </Button>
          <Button>
            <RefreshCw className="w-4 h-4 mr-2" />
            Request Swap
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
        <button
          onClick={() => setViewMode('requests')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            viewMode === 'requests' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Swap Requests
        </button>
        <button
          onClick={() => setViewMode('calendar')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            viewMode === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Shift Calendar
        </button>
        <button
          onClick={() => setViewMode('analytics')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            viewMode === 'analytics' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Swap Requests View */}
      {viewMode === 'requests' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5" />
              Active Swap Requests
            </CardTitle>
            <CardDescription>Review and manage shift exchange requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {swapRequests.map((request) => (
                <div key={request.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{request.requester}</h4>
                        <Badge variant="outline">{request.requesterDept}</Badge>
                        {getStatusBadge(request.status)}
                        {getUrgencyBadge(request.urgency)}
                      </div>
                      <p className="text-sm text-gray-600">{request.reason}</p>
                    </div>
                    
                    <span className="text-xs text-gray-500">{request.requestedAt}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <h5 className="font-medium text-red-800 mb-2">Current Shift</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Date:</span>
                          <span className="font-medium">{request.originalShift.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time:</span>
                          <span className="font-medium">{request.originalShift.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span className="font-medium">{request.originalShift.type}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h5 className="font-medium text-green-800 mb-2">Desired Shift</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Date:</span>
                          <span className="font-medium">{request.desiredShift.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time:</span>
                          <span className="font-medium">{request.desiredShift.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span className="font-medium">{request.desiredShift.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {request.potentialMatches.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-medium mb-2">Potential Matches</h5>
                      <div className="space-y-2">
                        {request.potentialMatches.map((match, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-600" />
                              <span className="font-medium">{match.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {match.compatibility}% match
                              </Badge>
                            </div>
                            <Badge className={
                              match.availability === 'available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }>
                              {match.availability}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {request.status === 'pending' && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline">
                      <Users className="w-4 h-4 mr-1" />
                      Find Matches
                    </Button>
                    <Button size="sm" variant="outline">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Check Conflicts
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Shift Calendar
            </CardTitle>
            <CardDescription>Visual overview of shifts available for swapping</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingShifts.map((day) => (
                <div key={day.id} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">{day.date}</h4>
                  <div className="space-y-2">
                    {day.shifts.map((shift, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          shift.swappable ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-gray-600" />
                          <div>
                            <div className="font-medium">{shift.time}</div>
                            <div className="text-sm text-gray-600">{shift.staff} • {shift.department}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {shift.swappable ? (
                            <>
                              <Badge className="bg-green-100 text-green-800">Swappable</Badge>
                              <Button size="sm" variant="outline">
                                Request Swap
                              </Button>
                            </>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800">Fixed</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics View */}
      {viewMode === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Swap Request Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span>Total Requests This Month</span>
                  <span className="font-bold text-blue-700">24</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span>Approved Requests</span>
                  <span className="font-bold text-green-700">18 (75%)</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span>Pending Requests</span>
                  <span className="font-bold text-yellow-700">4</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span>Rejected Requests</span>
                  <span className="font-bold text-red-700">2</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Department Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { dept: 'ICU', requests: 8, success: 85 },
                  { dept: 'Emergency', requests: 6, success: 75 },
                  { dept: 'Surgery', requests: 5, success: 90 },
                  { dept: 'General Ward', requests: 5, success: 60 }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.dept}</span>
                      <span>{item.requests} requests • {item.success}% success</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${item.success}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
