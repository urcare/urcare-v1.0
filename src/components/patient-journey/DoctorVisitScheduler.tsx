
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Clock, User, Stethoscope } from 'lucide-react';
import { toast } from 'sonner';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  doctorName?: string;
  patientName?: string;
  patientId?: string;
  visitType: 'consultation' | 'follow-up' | 'emergency' | 'rounds';
}

interface DoctorSchedule {
  doctorId: string;
  doctorName: string;
  specialty: string;
  timeSlots: TimeSlot[];
}

const mockSchedule: DoctorSchedule[] = [
  {
    doctorId: 'D001',
    doctorName: 'Dr. Smith',
    specialty: 'Cardiology',
    timeSlots: [
      { id: 'T001', time: '09:00', available: true, visitType: 'consultation' },
      { id: 'T002', time: '09:30', available: false, doctorName: 'Dr. Smith', patientName: 'John Doe', patientId: 'P001', visitType: 'follow-up' },
      { id: 'T003', time: '10:00', available: true, visitType: 'consultation' },
      { id: 'T004', time: '10:30', available: false, doctorName: 'Dr. Smith', patientName: 'Jane Smith', patientId: 'P002', visitType: 'consultation' },
      { id: 'T005', time: '11:00', available: true, visitType: 'rounds' }
    ]
  },
  {
    doctorId: 'D002',
    doctorName: 'Dr. Johnson',
    specialty: 'Neurology',
    timeSlots: [
      { id: 'T006', time: '09:00', available: false, doctorName: 'Dr. Johnson', patientName: 'Mike Davis', patientId: 'P003', visitType: 'consultation' },
      { id: 'T007', time: '09:30', available: true, visitType: 'consultation' },
      { id: 'T008', time: '10:00', available: true, visitType: 'follow-up' },
      { id: 'T009', time: '10:30', available: true, visitType: 'consultation' },
      { id: 'T010', time: '11:00', available: false, doctorName: 'Dr. Johnson', patientName: 'Alice Brown', patientId: 'P004', visitType: 'emergency' }
    ]
  }
];

export const DoctorVisitScheduler = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  const [schedule, setSchedule] = useState<DoctorSchedule[]>(mockSchedule);

  const filteredSchedule = selectedDoctor === 'all' 
    ? schedule 
    : schedule.filter(doc => doc.doctorId === selectedDoctor);

  const handleSlotBooking = (doctorId: string, slotId: string) => {
    setSchedule(prev => prev.map(doctor => 
      doctor.doctorId === doctorId 
        ? {
            ...doctor,
            timeSlots: doctor.timeSlots.map(slot =>
              slot.id === slotId 
                ? { ...slot, available: false, patientName: 'New Patient', patientId: 'P999' }
                : slot
            )
          }
        : doctor
    ));
    
    toast.success('Time slot booked successfully!');
  };

  const getVisitTypeColor = (visitType: string) => {
    switch (visitType) {
      case 'emergency': return 'bg-red-500 text-white';
      case 'consultation': return 'bg-blue-500 text-white';
      case 'follow-up': return 'bg-green-500 text-white';
      case 'rounds': return 'bg-purple-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Doctor Visit Scheduler
          </CardTitle>
          <CardDescription>
            Schedule and manage doctor visits with time slot management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Date</label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Filter by Doctor</label>
                <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Doctors</SelectItem>
                    {schedule.map(doctor => (
                      <SelectItem key={doctor.doctorId} value={doctor.doctorId}>
                        {doctor.doctorName} - {doctor.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {filteredSchedule.map((doctor) => (
                <Card key={doctor.doctorId}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" />
                        <span className="font-semibold">{doctor.doctorName}</span>
                      </div>
                      <Badge variant="outline">{doctor.specialty}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {doctor.timeSlots.map((slot) => (
                        <div 
                          key={slot.id}
                          className={`border rounded-lg p-3 ${
                            slot.available 
                              ? 'border-green-200 bg-green-50 cursor-pointer hover:bg-green-100' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                          onClick={() => slot.available && handleSlotBooking(doctor.doctorId, slot.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span className="text-sm font-medium">{slot.time}</span>
                            </div>
                            <Badge className={getVisitTypeColor(slot.visitType)}>
                              {slot.visitType}
                            </Badge>
                          </div>
                          
                          {slot.available ? (
                            <div className="text-xs text-green-600">Available</div>
                          ) : (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span className="text-xs font-medium">{slot.patientName}</span>
                              </div>
                              <div className="text-xs text-gray-600">ID: {slot.patientId}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Schedule Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Total Slots Today:</span>
                <span className="font-medium">
                  {schedule.reduce((total, doctor) => total + doctor.timeSlots.length, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Available Slots:</span>
                <span className="font-medium text-green-600">
                  {schedule.reduce((total, doctor) => 
                    total + doctor.timeSlots.filter(slot => slot.available).length, 0
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Booked Slots:</span>
                <span className="font-medium text-red-600">
                  {schedule.reduce((total, doctor) => 
                    total + doctor.timeSlots.filter(slot => !slot.available).length, 0
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full" size="sm">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Book Emergency Slot
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                View Weekly Schedule
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                <User className="h-4 w-4 mr-2" />
                Add Walk-in Patient
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
