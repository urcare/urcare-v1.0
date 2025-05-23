
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';

export const AppointmentsList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch user appointments
  const { data: appointments, isLoading, refetch } = useQuery({
    queryKey: ['user-appointments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*, doctors(*)')
          .eq('patient_id', user.id)
          .order('date_time', { ascending: true });
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
          // Return demo data if no appointments found
          const today = new Date();
          const tomorrow = new Date();
          tomorrow.setDate(today.getDate() + 1);
          const nextWeek = new Date();
          nextWeek.setDate(today.getDate() + 7);
          
          return [
            {
              id: 'demo-1',
              date_time: tomorrow.toISOString(),
              type: 'regular',
              status: 'scheduled',
              doctors: { profile_id: 'Dr. Johnson', department: 'Cardiology' }
            },
            {
              id: 'demo-2',
              date_time: nextWeek.toISOString(),
              type: 'follow_up',
              status: 'scheduled',
              doctors: { profile_id: 'Dr. Smith', department: 'General Practice' }
            },
            {
              id: 'demo-3',
              date_time: new Date(today.setMonth(today.getMonth() - 1)).toISOString(),
              type: 'regular',
              status: 'completed',
              doctors: { profile_id: 'Dr. Patel', department: 'Dermatology' }
            }
          ];
        }
        
        return data;
      } catch (error) {
        console.error('Error fetching appointments:', error);
        return [];
      }
    },
    enabled: !!user?.id
  });
  
  const handleCancelAppointment = async (id: string) => {
    try {
      // In a real app, this would update the appointment in the database
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been cancelled successfully."
      });
      
      // Refresh the appointments list
      refetch();
      
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast({
        title: "Cancellation Failed",
        description: "There was an error cancelling your appointment.",
        variant: "destructive"
      });
    }
  };
  
  const formatAppointmentDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };
  
  const getAppointmentTypeBadge = (type: string) => {
    switch(type) {
      case 'regular':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Regular</Badge>;
      case 'follow_up':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Follow-up</Badge>;
      case 'emergency':
        return <Badge className="bg-red-500 hover:bg-red-600">Emergency</Badge>;
      case 'consultation':
        return <Badge className="bg-green-500 hover:bg-green-600">Consultation</Badge>;
      case 'teleconsult':
        return <Badge className="bg-sky-500 hover:bg-sky-600">Teleconsult</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };
  
  const getAppointmentStatusBadge = (status: string) => {
    switch(status) {
      case 'scheduled':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Scheduled</Badge>;
      case 'completed':
        return <Badge variant="outline" className="border-green-500 text-green-500">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="border-red-500 text-red-500">Cancelled</Badge>;
      case 'no_show':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">No Show</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Separate appointments by status
  const upcomingAppointments = appointments?.filter(apt => 
    apt.status === 'scheduled' && new Date(apt.date_time) >= new Date()
  );
  
  const pastAppointments = appointments?.filter(apt => 
    apt.status === 'completed' || apt.status === 'no_show' || new Date(apt.date_time) < new Date()
  );
  
  const cancelledAppointments = appointments?.filter(apt => 
    apt.status === 'cancelled'
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Appointments</CardTitle>
          <CardDescription>Loading appointments...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="upcoming" className="space-y-4">
      <TabsList>
        <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments?.length || 0})</TabsTrigger>
        <TabsTrigger value="past">Past ({pastAppointments?.length || 0})</TabsTrigger>
        <TabsTrigger value="cancelled">Cancelled ({cancelledAppointments?.length || 0})</TabsTrigger>
      </TabsList>
      
      <TabsContent value="upcoming" className="space-y-4">
        {upcomingAppointments?.length ? (
          upcomingAppointments.map(appointment => {
            const { date, time } = formatAppointmentDate(appointment.date_time);
            return (
              <Card key={appointment.id} className="overflow-hidden">
                <div className="md:flex">
                  <div className="bg-slate-100 md:w-1/4 p-4 md:p-6 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r">
                    <p className="text-lg font-bold">{date}</p>
                    <div className="flex items-center mt-2">
                      <Clock className="h-4 w-4 mr-1 text-slate-500" />
                      <p>{time}</p>
                    </div>
                  </div>
                  <div className="p-4 md:p-6 md:w-3/4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="font-medium">{appointment.doctors?.profile_id || 'Unknown Doctor'}</h3>
                        <p className="text-muted-foreground text-sm">{appointment.doctors?.department || 'Unknown Department'}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {getAppointmentTypeBadge(appointment.type)}
                          {getAppointmentStatusBadge(appointment.status)}
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 space-x-2">
                        <Button variant="outline">View Details</Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">You don't have any upcoming appointments</p>
            <Button className="mt-4" onClick={() => document.querySelector('[value="booking"]')?.dispatchEvent(new Event('click'))}>
              Book an Appointment
            </Button>
          </Card>
        )}
      </TabsContent>
      
      <TabsContent value="past" className="space-y-4">
        {pastAppointments?.length ? (
          pastAppointments.map(appointment => {
            const { date, time } = formatAppointmentDate(appointment.date_time);
            return (
              <Card key={appointment.id} className="overflow-hidden">
                <div className="md:flex">
                  <div className="bg-slate-100 md:w-1/4 p-4 md:p-6 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r">
                    <p className="text-lg font-bold">{date}</p>
                    <div className="flex items-center mt-2">
                      <Clock className="h-4 w-4 mr-1 text-slate-500" />
                      <p>{time}</p>
                    </div>
                  </div>
                  <div className="p-4 md:p-6 md:w-3/4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="font-medium">{appointment.doctors?.profile_id || 'Unknown Doctor'}</h3>
                        <p className="text-muted-foreground text-sm">{appointment.doctors?.department || 'Unknown Department'}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {getAppointmentTypeBadge(appointment.type)}
                          {getAppointmentStatusBadge(appointment.status)}
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 space-x-2">
                        <Button variant="outline">View Details</Button>
                        <Button variant="secondary">Book Follow-up</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">You don't have any past appointments</p>
          </Card>
        )}
      </TabsContent>
      
      <TabsContent value="cancelled" className="space-y-4">
        {cancelledAppointments?.length ? (
          cancelledAppointments.map(appointment => {
            const { date, time } = formatAppointmentDate(appointment.date_time);
            return (
              <Card key={appointment.id} className="overflow-hidden opacity-75">
                <div className="md:flex">
                  <div className="bg-slate-100 md:w-1/4 p-4 md:p-6 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r">
                    <p className="text-lg font-bold">{date}</p>
                    <div className="flex items-center mt-2">
                      <Clock className="h-4 w-4 mr-1 text-slate-500" />
                      <p>{time}</p>
                    </div>
                  </div>
                  <div className="p-4 md:p-6 md:w-3/4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="font-medium">{appointment.doctors?.profile_id || 'Unknown Doctor'}</h3>
                        <p className="text-muted-foreground text-sm">{appointment.doctors?.department || 'Unknown Department'}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {getAppointmentTypeBadge(appointment.type)}
                          {getAppointmentStatusBadge(appointment.status)}
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <Button>Rebook Appointment</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">You don't have any cancelled appointments</p>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
};
