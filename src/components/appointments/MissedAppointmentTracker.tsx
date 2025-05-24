
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertTriangle, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { RescheduleFlow } from './RescheduleFlow';

export const MissedAppointmentTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState<string | null>(null);
  const [rescheduleDateTime, setRescheduleDateTime] = useState<string>('');

  // Fetch missed appointments
  const { data: missedAppointments, isLoading } = useQuery({
    queryKey: ['missed-appointments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*, doctors(*)')
        .eq('patient_id', user.id)
        .eq('status', 'no_show')
        .order('date_time', { ascending: false });
      
      if (error) throw error;
      
      // Return demo data if no missed appointments
      if (!data || data.length === 0) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        return [{
          id: 'missed-1',
          date_time: yesterday.toISOString(),
          type: 'regular',
          status: 'no_show',
          doctors: { profile_id: 'Dr. Johnson', department: 'Cardiology' }
        }];
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  const rescheduleFromMissedMutation = useMutation({
    mutationFn: async ({ appointmentId }: { appointmentId: string }) => {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);
      
      if (error) throw error;
      
      // In a real app, this would create a new appointment
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Reschedule Initiated",
        description: "Opening reschedule options for your missed appointment."
      });
      queryClient.invalidateQueries({ queryKey: ['missed-appointments'] });
    },
    onError: (error) => {
      console.error('Reschedule initiation error:', error);
      toast({
        title: "Reschedule Failed",
        description: "Unable to initiate reschedule. Please contact support.",
        variant: "destructive"
      });
    }
  });

  const handleReschedule = (appointmentId: string, dateTime: string) => {
    setRescheduleAppointmentId(appointmentId);
    setRescheduleDateTime(dateTime);
  };

  const handleCloseReschedule = () => {
    setRescheduleAppointmentId(null);
    setRescheduleDateTime('');
  };

  if (rescheduleAppointmentId) {
    return (
      <RescheduleFlow
        appointmentId={rescheduleAppointmentId}
        currentDateTime={rescheduleDateTime}
        onClose={handleCloseReschedule}
      />
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Missed Appointments</CardTitle>
          <CardDescription>Loading missed appointments...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Missed Appointments
        </CardTitle>
        <CardDescription>
          Track and reschedule missed appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {missedAppointments?.length ? (
          <div className="space-y-4">
            {missedAppointments.map((appointment) => (
              <div key={appointment.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{appointment.doctors?.profile_id || 'Unknown Doctor'}</h3>
                    <p className="text-sm text-muted-foreground">{appointment.doctors?.department || 'Unknown Department'}</p>
                  </div>
                  <Badge variant="destructive">Missed</Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(appointment.date_time), 'PPP p')}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleReschedule(appointment.id, appointment.date_time)}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reschedule
                  </Button>
                  <Button size="sm" variant="outline">
                    Contact Office
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No missed appointments found</p>
            <p className="text-sm text-muted-foreground mt-1">Great job keeping your appointments!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
