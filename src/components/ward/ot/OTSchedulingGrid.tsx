
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, Plus, Edit } from 'lucide-react';

export const OTSchedulingGrid = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const operatingRooms = ['OT-1', 'OT-2', 'OT-3', 'OT-4', 'OT-5'];

  const surgeons = [
    { id: 1, name: 'Dr. Smith', specialty: 'Cardiothoracic', available: true },
    { id: 2, name: 'Dr. Johnson', specialty: 'Orthopedic', available: true },
    { id: 3, name: 'Dr. Williams', specialty: 'Neurosurgery', available: false },
    { id: 4, name: 'Dr. Brown', specialty: 'General Surgery', available: true },
    { id: 5, name: 'Dr. Davis', specialty: 'Plastic Surgery', available: true }
  ];

  const scheduledSurgeries = [
    { room: 'OT-1', time: '09:00', surgeon: 'Dr. Smith', procedure: 'CABG', patient: 'John Doe', duration: 4 },
    { room: 'OT-2', time: '08:00', surgeon: 'Dr. Johnson', procedure: 'Hip Replacement', patient: 'Jane Smith', duration: 3 },
    { room: 'OT-3', time: '14:00', surgeon: 'Dr. Brown', procedure: 'Appendectomy', patient: 'Mike Wilson', duration: 2 },
  ];

  const getSurgeryForSlot = (room: string, time: string) => {
    return scheduledSurgeries.find(surgery => surgery.room === room && surgery.time === time);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <Label>Date:</Label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-40"
            />
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Surgery
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule New Surgery</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Operating Room</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select OT" />
                  </SelectTrigger>
                  <SelectContent>
                    {operatingRooms.map(room => (
                      <SelectItem key={room} value={room}>{room}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Surgeon</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select surgeon" />
                  </SelectTrigger>
                  <SelectContent>
                    {surgeons.filter(s => s.available).map(surgeon => (
                      <SelectItem key={surgeon.id} value={surgeon.name}>
                        {surgeon.name} - {surgeon.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Time Slot</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Procedure</Label>
                <Input placeholder="Enter procedure name" />
              </div>
              <div>
                <Label>Patient</Label>
                <Input placeholder="Enter patient name" />
              </div>
              <Button className="w-full">Schedule Surgery</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            OT Scheduling Grid - {selectedDate}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-gray-50 text-left">Time</th>
                  {operatingRooms.map(room => (
                    <th key={room} className="border p-2 bg-gray-50 text-center min-w-48">{room}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(time => (
                  <tr key={time}>
                    <td className="border p-2 font-medium bg-gray-50">{time}</td>
                    {operatingRooms.map(room => {
                      const surgery = getSurgeryForSlot(room, time);
                      return (
                        <td key={`${room}-${time}`} className="border p-2">
                          {surgery ? (
                            <div className="bg-blue-50 border border-blue-200 rounded p-2 space-y-1">
                              <div className="font-semibold text-blue-800">{surgery.procedure}</div>
                              <div className="text-sm text-gray-600">{surgery.patient}</div>
                              <div className="text-xs text-blue-600">{surgery.surgeon}</div>
                              <div className="text-xs text-gray-500">{surgery.duration}h duration</div>
                              <Button size="sm" variant="outline" className="w-full">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="h-16 flex items-center justify-center text-gray-300 hover:bg-gray-50 rounded cursor-pointer">
                              <Plus className="h-4 w-4" />
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Surgeon Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {surgeons.map(surgeon => (
              <div key={surgeon.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{surgeon.name}</h3>
                  <Badge variant={surgeon.available ? "default" : "destructive"}>
                    {surgeon.available ? "Available" : "Unavailable"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{surgeon.specialty}</p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Schedule
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Book Slot
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
