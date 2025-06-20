
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, MapPin, Phone, Video, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface AppointmentWithDetails {
  id: string;
  date_time: string;
  type: string;
  status: string;
  reason?: string;
  notes?: string;
  duration_minutes: number;
  doctor_profile?: {
    full_name: string;
    phone?: string;
  } | null;
  patient_profile?: {
    full_name: string;
    phone?: string;
  } | null;
}

export const AppointmentsList = () => {
  const { user, profile } = useAuth();

  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ['appointments', user?.id],
    queryFn: async () => {
      if (!user) return [];

      console.log('Fetching appointments for user:', user.id, 'with role:', profile?.role);

      let query = supabase
        .from('appointments')
        .select('*');

      // Filter based on user role
      if (profile?.role === 'patient') {
        query = query.eq('patient_id', user.id);
      } else if (profile?.role === 'doctor') {
        query = query.eq('doctor_id', user.id);
      }

      query = query.order('date_time', { ascending: true });

      const { data: appointmentsData, error: appointmentsError } = await query;
      
      if (appointmentsError) {
        console.error('Error fetching appointments:', appointmentsError);
        throw appointmentsError;
      }

      console.log('Raw appointments data:', appointmentsData);

      if (!appointmentsData || appointmentsData.length === 0) {
        return [];
      }

      // Get unique user IDs to fetch profiles
      const userIds = new Set<string>();
      appointmentsData.forEach(apt => {
        if (apt.doctor_id) userIds.add(apt.doctor_id);
        if (apt.patient_id) userIds.add(apt.patient_id);
      });

      // Fetch user profiles
      const { data: userProfiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, full_name, phone')
        .in('id', Array.from(userIds));

      if (profilesError) {
        console.error('Error fetching user profiles:', profilesError);
      }

      console.log('User profiles:', userProfiles);

      // Combine appointments with profile data
      const appointmentsWithDetails: AppointmentWithDetails[] = appointmentsData.map(appointment => {
        const doctorProfile = userProfiles?.find(p => p.id === appointment.doctor_id);
        const patientProfile = userProfiles?.find(p => p.id === appointment.patient_id);

        return {
          id: appointment.id,
          date_time: appointment.date_time,
          type: appointment.type,
          status: appointment.status,
          reason: appointment.reason,
          notes: appointment.notes,
          duration_minutes: appointment.duration_minutes,
          doctor_profile: doctorProfile ? {
            full_name: doctorProfile.full_name || 'Unknown Doctor',
            phone: doctorProfile.phone || undefined
          } : null,
          patient_profile: patientProfile ? {
            full_name: patientProfile.full_name || 'Unknown Patient',
            phone: patientProfile.phone || undefined
          } : null
        };
      });

      console.log('Appointments with details:', appointmentsWithDetails);
      return appointmentsWithDetails;
    },
    enabled: !!user && !!profile
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no_show': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'teleconsult': return <Video className="h-4 w-4" />;
      case 'emergency': return <AlertCircle className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);

      if (error) throw error;

      toast.success('Appointment cancelled successfully');
      // Refetch appointments
      window.location.reload();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Appointments</h3>
          <p className="text-gray-600">Please try refreshing the page</p>
        </CardContent>
      </Card>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Appointments</h3>
          <p className="text-gray-500">You don't have any appointments scheduled</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {profile?.role === 'patient' ? 'My Appointments' : 'Patient Appointments'}
        </h2>
        <Badge variant="outline" className="text-sm">
          {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {appointments.map((appointment) => (
        <Card key={appointment.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  {getTypeIcon(appointment.type)}
                  <div>
                    <h3 className="font-semibold text-lg">
                      {profile?.role === 'patient' 
                        ? `Dr. ${appointment.doctor_profile?.full_name || 'Unknown Doctor'}`
                        : appointment.patient_profile?.full_name || 'Unknown Patient'
                      }
                    </h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {appointment.type.replace('_', ' ')} appointment
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(appointment.date_time).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {new Date(appointment.date_time).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                      {appointment.duration_minutes && ` (${appointment.duration_minutes} min)`}
                    </span>
                  </div>
                  {(profile?.role === 'patient' ? appointment.doctor_profile?.phone : appointment.patient_profile?.phone) && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>
                        {profile?.role === 'patient' 
                          ? appointment.doctor_profile?.phone 
                          : appointment.patient_profile?.phone
                        }
                      </span>
                    </div>
                  )}
                </div>

                {appointment.reason && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm">
                      <span className="font-medium">Reason:</span> {appointment.reason}
                    </p>
                  </div>
                )}

                {appointment.notes && (
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-sm">
                      <span className="font-medium">Notes:</span> {appointment.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end gap-3">
                <Badge className={getStatusColor(appointment.status)} variant="secondary">
                  {appointment.status.replace('_', ' ').toUpperCase()}
                </Badge>

                {appointment.status === 'scheduled' && (
                  <div className="flex gap-2">
                    {appointment.type === 'teleconsult' && (
                      <Button size="sm" variant="outline">
                        <Video className="h-4 w-4 mr-1" />
                        Join Call
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleCancelAppointment(appointment.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
