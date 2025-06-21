
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Calendar as CalendarIcon, Clock, User, Stethoscope } from 'lucide-react';
import { format, addDays, startOfDay } from 'date-fns';

interface Doctor {
  id: string;
  full_name: string;
  department: string;
  specialization: string;
}

interface Department {
  id: string;
  name: string;
  description: string;
}

interface AppointmentSlot {
  id: string;
  doctor_id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export const BookingInterface = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [reason, setReason] = useState('');
  const [bookingStep, setBookingStep] = useState<'department' | 'doctor' | 'datetime' | 'confirm'>('department');

  // Fetch departments
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as Department[];
    }
  });

  // Fetch doctors by department
  const { data: doctors } = useQuery({
    queryKey: ['doctors', selectedDepartment],
    queryFn: async () => {
      if (!selectedDepartment) return [];
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('role', 'doctor')
        .eq('department', selectedDepartment)
        .order('full_name');
      
      if (error) throw error;
      return data as Doctor[];
    },
    enabled: !!selectedDepartment
  });

  // Fetch available slots for selected doctor and date
  const { data: availableSlots } = useQuery({
    queryKey: ['appointment_slots', selectedDoctor, selectedDate],
    queryFn: async () => {
      if (!selectedDoctor || !selectedDate) return [];
      
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('appointment_slots')
        .select('*')
        .eq('doctor_id', selectedDoctor)
        .eq('slot_date', dateStr)
        .eq('is_available', true)
        .order('start_time');
      
      if (error) throw error;
      return data as AppointmentSlot[];
    },
    enabled: !!selectedDoctor && !!selectedDate
  });

  // Book appointment mutation
  const bookAppointmentMutation = useMutation({
    mutationFn: async () => {
      if (!user || !selectedSlot || !selectedDoctor) {
        throw new Error('Missing required booking information');
      }

      const slot = availableSlots?.find(s => s.id === selectedSlot);
      if (!slot) throw new Error('Selected slot not found');

      // Create appointment
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          patient_id: user.id,
          doctor_id: selectedDoctor,
          slot_id: selectedSlot,
          date_time: `${slot.slot_date}T${slot.start_time}`,
          type: 'regular',
          status: 'scheduled',
          reason: reason || null,
          department: selectedDepartment,
          duration_minutes: 30
        })
        .select()
        .single();

      if (appointmentError) throw appointmentError;

      // Update slot availability
      const { error: slotError } = await supabase
        .from('appointment_slots')
        .update({ 
          is_available: false,
          current_appointments: 1 
        })
        .eq('id', selectedSlot);

      if (slotError) throw slotError;

      return appointment;
    },
    onSuccess: () => {
      toast.success('Appointment booked successfully!', {
        description: 'You will receive a confirmation shortly.'
      });
      
      // Reset form
      setSelectedDepartment('');
      setSelectedDoctor('');
      setSelectedDate(new Date());
      setSelectedSlot('');
      setReason('');
      setBookingStep('department');
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment_slots'] });
    },
    onError: (error: any) => {
      toast.error('Booking failed', {
        description: error.message
      });
    }
  });

  const handleBooking = () => {
    bookAppointmentMutation.mutate();
  };

  const canProceedToNext = () => {
    switch (bookingStep) {
      case 'department': return selectedDepartment;
      case 'doctor': return selectedDoctor;
      case 'datetime': return selectedDate && selectedSlot;
      case 'confirm': return true;
      default: return false;
    }
  };

  const selectedDoctorInfo = doctors?.find(d => d.id === selectedDoctor);
  const selectedSlotInfo = availableSlots?.find(s => s.id === selectedSlot);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <CalendarIcon className="h-6 w-6" />
            Book New Appointment
          </CardTitle>
          <CardDescription>
            Schedule your appointment in a few simple steps
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {['department', 'doctor', 'datetime', 'confirm'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${bookingStep === step ? 'bg-primary text-primary-foreground' : 
                    ['department', 'doctor', 'datetime', 'confirm'].indexOf(bookingStep) > index 
                      ? 'bg-green-500 text-white' 
                      : 'bg-muted text-muted-foreground'}
                `}>
                  {index + 1}
                </div>
                {index < 3 && <div className="w-16 h-0.5 bg-muted mx-2" />}
              </div>
            ))}
          </div>

          {/* Step 1: Select Department */}
          {bookingStep === 'department' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Department</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departments?.map((dept) => (
                  <Card 
                    key={dept.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedDepartment === dept.name ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedDepartment(dept.name)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Stethoscope className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h4 className="font-medium">{dept.name}</h4>
                          <p className="text-sm text-muted-foreground">{dept.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Doctor */}
          {bookingStep === 'doctor' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Doctor</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctors?.map((doctor) => (
                  <Card 
                    key={doctor.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedDoctor === doctor.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedDoctor(doctor.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h4 className="font-medium">Dr. {doctor.full_name}</h4>
                          <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                          <Badge variant="outline" className="mt-2">{doctor.department}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Select Date & Time */}
          {bookingStep === 'datetime' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Select Date & Time</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Choose Date</h4>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < startOfDay(new Date()) || date > addDays(new Date(), 30)}
                    className="rounded-md border"
                  />
                </div>
                <div>
                  <h4 className="font-medium mb-3">Available Time Slots</h4>
                  {selectedDate && (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {availableSlots?.length === 0 ? (
                        <p className="text-muted-foreground">No available slots for this date</p>
                      ) : (
                        availableSlots?.map((slot) => (
                          <Button
                            key={slot.id}
                            variant={selectedSlot === slot.id ? "default" : "outline"}
                            className="w-full justify-start"
                            onClick={() => setSelectedSlot(slot.id)}
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            {slot.start_time} - {slot.end_time}
                          </Button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {bookingStep === 'confirm' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Confirm Booking</h3>
              
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Department:</span>
                  <span>{selectedDepartment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Doctor:</span>
                  <span>Dr. {selectedDoctorInfo?.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span>{selectedDate && format(selectedDate, 'PPP')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Time:</span>
                  <span>{selectedSlotInfo?.start_time} - {selectedSlotInfo?.end_time}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Reason for Visit (Optional)</label>
                <Textarea
                  placeholder="Briefly describe your symptoms or reason for the appointment..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => {
                const steps = ['department', 'doctor', 'datetime', 'confirm'] as const;
                const currentIndex = steps.indexOf(bookingStep);
                if (currentIndex > 0) {
                  setBookingStep(steps[currentIndex - 1]);
                }
              }}
              disabled={bookingStep === 'department'}
            >
              Previous
            </Button>
            
            {bookingStep === 'confirm' ? (
              <Button 
                onClick={handleBooking}
                disabled={bookAppointmentMutation.isPending}
              >
                {bookAppointmentMutation.isPending ? 'Booking...' : 'Confirm Booking'}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  const steps = ['department', 'doctor', 'datetime', 'confirm'] as const;
                  const currentIndex = steps.indexOf(bookingStep);
                  if (currentIndex < steps.length - 1) {
                    setBookingStep(steps[currentIndex + 1]);
                  }
                }}
                disabled={!canProceedToNext()}
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
