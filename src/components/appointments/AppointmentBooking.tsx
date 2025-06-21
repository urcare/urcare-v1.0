
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { BookingInterface } from './BookingInterface';
import { DoctorAvailabilityManager } from './DoctorAvailabilityManager';
import { AppointmentsList } from './AppointmentsList';
import { QRCheckIn } from './QRCheckIn';
import { Calendar, Clock, QrCode, Settings } from 'lucide-react';

export const AppointmentBooking = () => {
  const { profile } = useAuth();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Appointment Management</h1>
        <p className="text-muted-foreground">
          {profile?.role === 'patient' 
            ? 'Book appointments and manage your healthcare schedule'
            : 'Manage your availability and patient appointments'
          }
        </p>
      </div>

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {profile?.role === 'patient' ? 'My Appointments' : 'Patient Appointments'}
          </TabsTrigger>
          
          {profile?.role === 'patient' && (
            <>
              <TabsTrigger value="booking" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Book New
              </TabsTrigger>
              <TabsTrigger value="checkin" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                Check-In
              </TabsTrigger>
            </>
          )}
          
          {profile?.role === 'doctor' && (
            <TabsTrigger value="availability" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Manage Schedule
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="appointments" className="space-y-6">
          <AppointmentsList />
        </TabsContent>

        {profile?.role === 'patient' && (
          <>
            <TabsContent value="booking" className="space-y-6">
              <BookingInterface />
            </TabsContent>

            <TabsContent value="checkin" className="space-y-6">
              <QRCheckIn />
            </TabsContent>
          </>
        )}

        {profile?.role === 'doctor' && (
          <TabsContent value="availability" className="space-y-6">
            <DoctorAvailabilityManager />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
