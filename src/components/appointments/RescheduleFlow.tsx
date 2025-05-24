
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface RescheduleFlowProps {
  appointmentId: string;
  currentDateTime: string;
  onClose: () => void;
}

export const RescheduleFlow = ({ appointmentId, currentDateTime, onClose }: RescheduleFlowProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Generate available time slots for selected date
  const generateTimeSlots = (date: Date) => {
    const slots = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute of [0, 30]) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    
    return slots;
  };

  const availableSlots = selectedDate ? generateTimeSlots(selectedDate) : [];

  const rescheduleMutation = useMutation({
    mutationFn: async ({ newDateTime }: { newDateTime: string }) => {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          date_time: newDateTime,
          status: 'scheduled'
        })
        .eq('id', appointmentId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Appointment Rescheduled",
        description: "Your appointment has been successfully rescheduled."
      });
      queryClient.invalidateQueries({ queryKey: ['user-appointments'] });
      onClose();
    },
    onError: (error) => {
      console.error('Reschedule error:', error);
      toast({
        title: "Reschedule Failed",
        description: "Unable to reschedule appointment. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleReschedule = () => {
    if (!selectedDate || !selectedTimeSlot) {
      toast({
        title: "Missing Information",
        description: "Please select both a date and time slot.",
        variant: "destructive"
      });
      return;
    }

    const [hours, minutes] = selectedTimeSlot.split(':');
    const newDateTime = new Date(selectedDate);
    newDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    rescheduleMutation.mutate({ newDateTime: newDateTime.toISOString() });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Reschedule Appointment
        </CardTitle>
        <CardDescription>
          Current appointment: {format(new Date(currentDateTime), 'PPP p')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-4">Select New Date</h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
            className="rounded-md border"
          />
        </div>

        {selectedDate && (
          <div>
            <h3 className="font-medium mb-4">Available Time Slots</h3>
            <div className="grid grid-cols-4 gap-2">
              {availableSlots.map((slot) => (
                <Button
                  key={slot}
                  variant={selectedTimeSlot === slot ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTimeSlot(slot)}
                  className="w-full"
                >
                  {slot}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleReschedule}
            disabled={!selectedDate || !selectedTimeSlot || rescheduleMutation.isPending}
          >
            {rescheduleMutation.isPending ? 'Rescheduling...' : 'Confirm Reschedule'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
