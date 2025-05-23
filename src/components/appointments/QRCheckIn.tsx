
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import QRCode from 'qrcode.react';

export const QRCheckIn = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [qrValue, setQrValue] = useState<string>('');

  // Fetch user's upcoming appointment
  const { data: appointment, isLoading } = useQuery({
    queryKey: ['upcoming-appointment', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const today = new Date();
      const { data, error } = await supabase
        .from('appointments')
        .select('*, doctors(*)')
        .eq('patient_id', user.id)
        .eq('status', 'scheduled')
        .gte('date_time', today.toISOString())
        .order('date_time', { ascending: true })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  useEffect(() => {
    if (appointment) {
      // Generate a QR code value that includes appointment info
      // In a real app, this could be encrypted or be a token that can be verified
      const qrData = JSON.stringify({
        appointmentId: appointment.id,
        patientId: user?.id,
        timestamp: new Date().getTime()
      });
      
      setQrValue(qrData);
    }
  }, [appointment, user?.id]);

  const handleCheckIn = () => {
    toast({
      title: "Check-In Successful",
      description: "You've successfully checked in for your appointment.",
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading appointment information...</CardTitle>
          <CardDescription>Please wait while we retrieve your appointment details.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Skeleton className="h-64 w-64" />
        </CardContent>
      </Card>
    );
  }

  if (!appointment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Upcoming Appointments</CardTitle>
          <CardDescription>You don't have any scheduled appointments to check in for.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Book an appointment first to use the auto check-in feature.</p>
        </CardContent>
      </Card>
    );
  }

  const appointmentDate = new Date(appointment.date_time);
  const formattedDate = appointmentDate.toLocaleDateString();
  const formattedTime = appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auto Check-In</CardTitle>
        <CardDescription>Check in for your appointment by presenting this QR code at the reception kiosk.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <div className="bg-white p-4 rounded-lg">
          <QRCode 
            value={qrValue} 
            size={200} 
            level="H" 
            includeMargin={true} 
            renderAs="canvas"
          />
        </div>
        <div className="text-center space-y-2">
          <p className="font-medium text-lg">Appointment Details</p>
          <p>Date: {formattedDate}</p>
          <p>Time: {formattedTime}</p>
          <p>Doctor: {appointment.doctors?.profile_id || 'Unknown'}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={handleCheckIn}>Manual Check-In</Button>
      </CardFooter>
    </Card>
  );
};
