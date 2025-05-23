
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DoctorBooking } from '@/components/appointments/DoctorBooking';
import { AppointmentsList } from '@/components/appointments/AppointmentsList';
import { EmergencyBooking } from '@/components/appointments/EmergencyBooking';
import { TeleconsultInterface } from '@/components/appointments/TeleconsultInterface';
import { FamilyCalendar } from '@/components/appointments/FamilyCalendar';
import { QRCheckIn } from '@/components/appointments/QRCheckIn';
import { PreConsultIntake } from '@/components/appointments/PreConsultIntake';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const AppointmentDashboard = () => {
  const [activeTab, setActiveTab] = useState("booking");
  
  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Appointment Management</CardTitle>
          <CardDescription>
            Schedule appointments, check in, and manage your consultations
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="booking" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-8">
          <TabsTrigger value="booking">Book Now</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
          <TabsTrigger value="checkin">Check-In</TabsTrigger>
          <TabsTrigger value="preconsult">Intake</TabsTrigger>
          <TabsTrigger value="teleconsult">Teleconsult</TabsTrigger>
          <TabsTrigger value="appointments">My Appointments</TabsTrigger>
          <TabsTrigger value="family">Family Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="booking" className="space-y-4">
          <DoctorBooking />
        </TabsContent>

        <TabsContent value="emergency" className="space-y-4">
          <EmergencyBooking />
        </TabsContent>

        <TabsContent value="checkin" className="space-y-4">
          <QRCheckIn />
        </TabsContent>

        <TabsContent value="preconsult" className="space-y-4">
          <PreConsultIntake />
        </TabsContent>

        <TabsContent value="teleconsult" className="space-y-4">
          <TeleconsultInterface />
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <AppointmentsList />
        </TabsContent>

        <TabsContent value="family" className="space-y-4">
          <FamilyCalendar />
        </TabsContent>
      </Tabs>
    </div>
  );
};
