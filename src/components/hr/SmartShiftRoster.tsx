
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, AlertTriangle, RefreshCw, Plus } from 'lucide-react';

export const SmartShiftRoster = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('weekly');

  const shifts = [
    {
      id: '1',
      name: 'Morning Shift',
      time: '06:00 - 14:00',
      department: 'ICU',
      assigned: ['Dr. Sarah Wilson', 'Nurse John Smith', 'Nurse Mary Johnson'],
      required: 4,
      conflicts: []
    },
    {
      id: '2',
      name: 'Evening Shift',
      time: '14:00 - 22:00',
      department: 'Emergency',
      assigned: ['Dr. Mike Brown', 'Nurse Lisa Davis'],
      required: 3,
      conflicts: ['Understaffed']
    },
    {
      id: '3',
      name: 'Night Shift',
      time: '22:00 - 06:00',
      department: 'General Ward',
      assigned: ['Dr. Tom Wilson'],
      required: 2,
      conflicts: ['Critical understaffing']
    }
  ];

  const staffAvailability = [
    { name: 'Dr. Sarah Wilson', department: 'ICU', skills: ['Critical Care', 'Cardiology'], available: true, preferences: 'Morning' },
    { name: 'Dr. Mike Brown', department: 'Emergency', skills: ['Emergency Medicine', 'Trauma'], available: true, preferences: 'Evening' },
    { name: 'Nurse John Smith', department: 'ICU', skills: ['ICU Care', 'Ventilator'], available: false, reason: 'On Leave' },
    { name: 'Nurse Lisa Davis', department: 'Emergency', skills: ['Emergency Care', 'Triage'], available: true, preferences: 'Any' }
  ];

  const getConflictBadge = (conflicts) => {
    if (conflicts.length === 0) return <Badge className="bg-green-100 text-green-800">No Conflicts</Badge>;
    if (conflicts.includes('Critical understaffing')) return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
    return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Smart Shift Roster</h2>
          <p className="text-gray-600">Intelligent scheduling with conflict detection and alerts</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Auto-Optimize
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Shift
          </Button>
        </div>
      </div>

      {/* Shift Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">24</div>
                <div className="text-sm text-gray-600">Active Shifts Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">3</div>
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
                <div className="text-2xl font-bold text-gray-900">156</div>
                <div className="text-sm text-gray-600">Staff Scheduled</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Shift Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Current Shift Status
          </CardTitle>
          <CardDescription>Real-time shift coverage and conflict alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shifts.map((shift) => (
              <div key={shift.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{shift.name}</h4>
                    <p className="text-sm text-gray-600">{shift.time} • {shift.department}</p>
                  </div>
                  {getConflictBadge(shift.conflicts)}
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Assigned Staff:</p>
                    <div className="flex flex-wrap gap-1">
                      {shift.assigned.map((staff, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {staff}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Coverage</p>
                    <p className={`font-semibold ${shift.assigned.length >= shift.required ? 'text-green-600' : 'text-red-600'}`}>
                      {shift.assigned.length}/{shift.required}
                    </p>
                  </div>
                </div>

                {shift.conflicts.length > 0 && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-800">
                        {shift.conflicts.join(', ')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Staff Availability */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Availability & Skills</CardTitle>
          <CardDescription>Current availability status and skill matching for optimal assignment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {staffAvailability.map((staff, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{staff.name}</h4>
                    <p className="text-sm text-gray-600">{staff.department}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">Skills:</p>
                    <div className="flex gap-1">
                      {staff.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Preference</p>
                    <p className="text-sm font-medium">{staff.preferences}</p>
                  </div>
                  
                  <Badge 
                    className={
                      staff.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }
                  >
                    {staff.available ? 'Available' : staff.reason || 'Unavailable'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shift Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Roster Calendar</CardTitle>
          <CardDescription>Drag-and-drop interface for shift planning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="p-3 border rounded-lg">
                <h5 className="font-medium text-center mb-2">{day}</h5>
                <div className="space-y-2">
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                    Morning: 4/4
                  </div>
                  <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                    Evening: 2/3
                  </div>
                  <div className="p-2 bg-red-50 border border-red-200 rounded text-xs">
                    Night: 1/2
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Coverage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Emergency Coverage Alerts
          </CardTitle>
          <CardDescription>Critical staffing alerts and immediate action required</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="font-medium text-red-800">Critical: ICU Night Shift Understaffed</span>
              </div>
              <p className="text-sm text-red-700">Only 1 nurse assigned, minimum 2 required for patient safety</p>
              <Button size="sm" className="mt-2">
                Find Coverage
              </Button>
            </div>
            
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">Warning: Emergency Department Weekend Gap</span>
              </div>
              <p className="text-sm text-yellow-700">No coverage assigned for Saturday evening shift</p>
              <Button size="sm" variant="outline" className="mt-2">
                Schedule Staff
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
