
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, MapPin, Plus, Filter } from 'lucide-react';

export const TherapySchedulingInterface = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const therapists = [
    { id: 1, name: 'Dr. Sarah Williams', specialty: 'Physical Therapy', availability: 'available', sessions: 6 },
    { id: 2, name: 'Mike Johnson', specialty: 'Occupational Therapy', availability: 'busy', sessions: 8 },
    { id: 3, name: 'Dr. Emily Chen', specialty: 'Speech Therapy', availability: 'available', sessions: 4 },
    { id: 4, name: 'David Brown', specialty: 'Physical Therapy', availability: 'break', sessions: 5 },
    { id: 5, name: 'Lisa Martinez', specialty: 'Respiratory Therapy', availability: 'available', sessions: 3 }
  ];

  const scheduledSessions = [
    {
      id: 1,
      patient: 'John Smith',
      therapist: 'Dr. Sarah Williams',
      therapy: 'Physical Therapy',
      time: '09:00',
      duration: 60,
      room: 'PT Room 1',
      status: 'confirmed',
      priority: 'routine'
    },
    {
      id: 2,
      patient: 'Maria Garcia',
      therapist: 'Mike Johnson',
      therapy: 'Occupational Therapy',
      time: '10:00',
      duration: 45,
      room: 'OT Room 2',
      status: 'in-progress',
      priority: 'high'
    },
    {
      id: 3,
      patient: 'Robert Wilson',
      therapist: 'Dr. Emily Chen',
      therapy: 'Speech Therapy',
      time: '11:30',
      duration: 30,
      room: 'ST Room 1',
      status: 'scheduled',
      priority: 'urgent'
    },
    {
      id: 4,
      patient: 'Anna Thompson',
      therapist: 'David Brown',
      therapy: 'Physical Therapy',
      time: '14:00',
      duration: 60,
      room: 'PT Room 2',
      status: 'confirmed',
      priority: 'routine'
    }
  ];

  const departments = [
    'Physical Therapy',
    'Occupational Therapy',
    'Speech Therapy',
    'Respiratory Therapy'
  ];

  const getAvailabilityColor = (availability: string) => {
    switch(availability) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'busy': return 'bg-red-100 text-red-800 border-red-200';
      case 'break': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'routine': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-500 text-white';
      case 'in-progress': return 'bg-blue-500 text-white';
      case 'scheduled': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Therapy Scheduling</h2>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded-md"
          />
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Session
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Therapist Availability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {therapists.map((therapist) => (
                <div key={therapist.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{therapist.name}</h3>
                    <p className="text-sm text-gray-600">{therapist.specialty}</p>
                    <p className="text-xs text-gray-500">{therapist.sessions} sessions today</p>
                  </div>
                  <Badge className={getAvailabilityColor(therapist.availability)}>
                    {therapist.availability}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduledSessions.map((session) => (
                <Card key={session.id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{session.patient}</h3>
                          <p className="text-sm text-gray-600">{session.therapy}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(session.priority)}>
                            {session.priority}
                          </Badge>
                          <Badge className={getStatusColor(session.status)}>
                            {session.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {session.therapist}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {session.time} ({session.duration}min)
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {session.room}
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
          <CardTitle>Department Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800">Physical Therapy</h3>
              <div className="text-2xl font-bold text-blue-600">92%</div>
              <p className="text-sm text-blue-600">18 sessions today</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800">Occupational Therapy</h3>
              <div className="text-2xl font-bold text-green-600">87%</div>
              <p className="text-sm text-green-600">12 sessions today</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-800">Speech Therapy</h3>
              <div className="text-2xl font-bold text-purple-600">75%</div>
              <p className="text-sm text-purple-600">8 sessions today</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-800">Respiratory Therapy</h3>
              <div className="text-2xl font-bold text-orange-600">68%</div>
              <p className="text-sm text-orange-600">6 sessions today</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
