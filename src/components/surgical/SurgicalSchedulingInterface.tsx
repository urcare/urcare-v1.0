
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, MapPin, AlertTriangle, Plus } from 'lucide-react';

export const SurgicalSchedulingInterface = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const operatingRooms = [
    { id: 'OR-1', name: 'OR 1', specialty: 'General Surgery', status: 'occupied' },
    { id: 'OR-2', name: 'OR 2', specialty: 'Orthopedic', status: 'available' },
    { id: 'OR-3', name: 'OR 3', specialty: 'Cardiac', status: 'maintenance' },
    { id: 'OR-4', name: 'OR 4', specialty: 'Neurosurgery', status: 'occupied' },
    { id: 'OR-5', name: 'OR 5', specialty: 'General Surgery', status: 'available' }
  ];

  const scheduledSurgeries = [
    {
      id: 1,
      procedure: 'Laparoscopic Cholecystectomy',
      surgeon: 'Dr. Sarah Johnson',
      patient: 'John Smith',
      startTime: '08:00',
      duration: 90,
      room: 'OR-1',
      status: 'in-progress',
      urgency: 'elective'
    },
    {
      id: 2,
      procedure: 'Total Knee Replacement',
      surgeon: 'Dr. Michael Chen',
      patient: 'Maria Garcia',
      startTime: '10:30',
      duration: 120,
      room: 'OR-2',
      status: 'scheduled',
      urgency: 'elective'
    },
    {
      id: 3,
      procedure: 'Emergency Appendectomy',
      surgeon: 'Dr. Emily Davis',
      patient: 'Robert Wilson',
      startTime: '14:00',
      duration: 60,
      room: 'OR-4',
      status: 'urgent',
      urgency: 'emergency'
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'occupied': return 'bg-red-100 text-red-800 border-red-200';
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'emergency': return 'bg-red-600 text-white';
      case 'urgent': return 'bg-orange-500 text-white';
      case 'elective': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Surgical Scheduling</h2>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded-md"
          />
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Surgery
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Operating Room Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {operatingRooms.map((room) => (
                <div key={room.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{room.name}</h3>
                    <p className="text-sm text-gray-600">{room.specialty}</p>
                  </div>
                  <Badge className={getStatusColor(room.status)}>
                    {room.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduledSurgeries.map((surgery) => (
                <Card key={surgery.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">{surgery.procedure}</h3>
                        <Badge className={getUrgencyColor(surgery.urgency)}>
                          {surgery.urgency}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {surgery.surgeon}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {surgery.startTime} ({surgery.duration}min)
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {surgery.room}
                        </div>
                        <div>
                          Patient: {surgery.patient}
                        </div>
                      </div>
                      {surgery.status === 'urgent' && (
                        <div className="flex items-center gap-1 text-orange-600 text-sm">
                          <AlertTriangle className="h-3 w-3" />
                          Requires immediate attention
                        </div>
                      )}
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
          <CardTitle>OR Utilization Optimization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800">Today's Utilization</h3>
              <div className="text-2xl font-bold text-blue-600">87%</div>
              <p className="text-sm text-blue-600">Target: 85%</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800">On-Time Starts</h3>
              <div className="text-2xl font-bold text-green-600">92%</div>
              <p className="text-sm text-green-600">Target: 90%</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-800">Avg. Turnover</h3>
              <div className="text-2xl font-bold text-orange-600">28 min</div>
              <p className="text-sm text-orange-600">Target: 30 min</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
