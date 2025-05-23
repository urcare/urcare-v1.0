
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'
];

export const DoctorBooking = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Fetch departments
  const { data: departments, isLoading: loadingDepartments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      // In a real app, fetch from database
      return [
        { id: 'cardiology', name: 'Cardiology' },
        { id: 'neurology', name: 'Neurology' },
        { id: 'pediatrics', name: 'Pediatrics' },
        { id: 'dermatology', name: 'Dermatology' },
        { id: 'orthopedics', name: 'Orthopedics' }
      ];
    }
  });

  // Fetch doctors based on selected department
  const { data: doctors, isLoading: loadingDoctors } = useQuery({
    queryKey: ['doctors', selectedDepartment],
    queryFn: async () => {
      if (!selectedDepartment) return [];
      
      // In a real app, fetch doctors from database based on department
      const { data, error } = await supabase
        .from('doctors')
        .select('id, profile_id, profiles(full_name)')
        .eq('department', selectedDepartment);
      
      if (error) throw error;
      
      // Fallback data if the query returns no results
      if (!data || data.length === 0) {
        return [
          { id: 'doc1', name: 'Dr. Smith' },
          { id: 'doc2', name: 'Dr. Johnson' }
        ];
      }
      
      return data.map(doctor => ({
        id: doctor.id,
        name: doctor.profiles?.full_name || 'Unknown Doctor'
      }));
    },
    enabled: !!selectedDepartment
  });

  // Fetch available time slots
  const { data: availableSlots, isLoading: loadingSlots } = useQuery({
    queryKey: ['slots', selectedDoctor, selectedDate],
    queryFn: async () => {
      if (!selectedDoctor || !selectedDate) return timeSlots;
      
      // In a real app, check booked slots in database
      // For now, we'll simulate some slots being taken
      const bookedSlots = ['10:00 AM', '2:00 PM', '3:30 PM'];
      return timeSlots.filter(slot => !bookedSlots.includes(slot));
    },
    enabled: !!selectedDoctor && !!selectedDate
  });

  const handleBookAppointment = async () => {
    if (!user || !selectedDoctor || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Format date and time for database
      const appointmentDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      const isPM = selectedTime.includes('PM');
      let hour = parseInt(hours);
      if (isPM && hour !== 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;
      
      appointmentDateTime.setHours(hour, parseInt(minutes));
      
      // Create appointment in database
      const { data, error } = await supabase.from('appointments').insert({
        doctor_id: selectedDoctor,
        patient_id: user.id, // This might need to be adjusted based on your auth setup
        date_time: appointmentDateTime.toISOString(),
        type: 'regular',
        status: 'scheduled'
      });

      if (error) throw error;
      
      toast({
        title: "Appointment Booked",
        description: `Your appointment is scheduled for ${selectedDate.toLocaleDateString()} at ${selectedTime}`,
      });
      
      // Reset form
      setSelectedTime('');
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error booking your appointment. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Choose Appointment Details</CardTitle>
          <CardDescription>Select department, doctor, date and time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Department selector */}
          <div className="space-y-2">
            <label htmlFor="department" className="text-sm font-medium">Department</label>
            {loadingDepartments ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {departments?.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Doctor selector */}
          <div className="space-y-2">
            <label htmlFor="doctor" className="text-sm font-medium">Doctor</label>
            {selectedDepartment && loadingDoctors ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select 
                value={selectedDoctor} 
                onValueChange={setSelectedDoctor}
                disabled={!selectedDepartment}
              >
                <SelectTrigger id="doctor">
                  <SelectValue placeholder={selectedDepartment ? "Select a doctor" : "Choose department first"} />
                </SelectTrigger>
                <SelectContent>
                  {doctors?.map(doc => (
                    <SelectItem key={doc.id} value={doc.id}>{doc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Time slot selector */}
          <div className="space-y-2">
            <label htmlFor="time" className="text-sm font-medium">Time Slot</label>
            {selectedDoctor && loadingSlots ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select 
                value={selectedTime} 
                onValueChange={setSelectedTime}
                disabled={!selectedDoctor || !selectedDate}
              >
                <SelectTrigger id="time">
                  <SelectValue placeholder={selectedDoctor ? "Select a time" : "Choose doctor first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableSlots?.map(slot => (
                    <SelectItem key={slot} value={slot}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" /> {slot}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <Button 
            className="w-full mt-4" 
            onClick={handleBookAppointment}
            disabled={!selectedDoctor || !selectedDate || !selectedTime}
          >
            Book Appointment
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
          <CardDescription>Choose your preferred appointment date</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            disabled={(date) => {
              // Disable past dates and weekends
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const day = date.getDay();
              
              return date < today || day === 0 || day === 6;
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};
