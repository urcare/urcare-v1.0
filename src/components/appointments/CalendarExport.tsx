
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Download, Share2 } from 'lucide-react';
import { format } from 'date-fns';

interface CalendarExportProps {
  appointment: {
    id: string;
    date_time: string;
    doctors?: { profile_id: string; department: string };
    type: string;
  };
}

export const CalendarExport = ({ appointment }: CalendarExportProps) => {
  const { toast } = useToast();

  const generateICSContent = () => {
    const startDate = new Date(appointment.date_time);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration
    
    const formatICSDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Healthcare App//Appointment//EN',
      'BEGIN:VEVENT',
      `UID:${appointment.id}@healthcareapp.com`,
      `DTSTART:${formatICSDate(startDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      `SUMMARY:Medical Appointment - ${appointment.doctors?.profile_id || 'Doctor'}`,
      `DESCRIPTION:Appointment with ${appointment.doctors?.profile_id || 'Doctor'} in ${appointment.doctors?.department || 'General'} department. Type: ${appointment.type}`,
      `LOCATION:Healthcare Clinic`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      'DESCRIPTION:Appointment reminder',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    return icsContent;
  };

  const downloadICS = () => {
    const icsContent = generateICSContent();
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `appointment-${format(new Date(appointment.date_time), 'yyyy-MM-dd')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Calendar Event Downloaded",
      description: "You can now import this into your calendar app."
    });
  };

  const exportToGoogleCalendar = () => {
    const startDate = new Date(appointment.date_time);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    
    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const googleUrl = new URL('https://calendar.google.com/calendar/render');
    googleUrl.searchParams.set('action', 'TEMPLATE');
    googleUrl.searchParams.set('text', `Medical Appointment - ${appointment.doctors?.profile_id || 'Doctor'}`);
    googleUrl.searchParams.set('dates', `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`);
    googleUrl.searchParams.set('details', `Appointment with ${appointment.doctors?.profile_id || 'Doctor'} in ${appointment.doctors?.department || 'General'} department. Type: ${appointment.type}`);
    googleUrl.searchParams.set('location', 'Healthcare Clinic');
    googleUrl.searchParams.set('trp', 'false');

    window.open(googleUrl.toString(), '_blank');

    toast({
      title: "Opening Google Calendar",
      description: "Your appointment is being added to Google Calendar."
    });
  };

  const exportToAppleCalendar = () => {
    downloadICS(); // Apple Calendar uses ICS files
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Export to Calendar
        </CardTitle>
        <CardDescription>
          Add this appointment to your calendar app
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={exportToGoogleCalendar}
          variant="outline" 
          className="w-full justify-start"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Add to Google Calendar
        </Button>
        
        <Button 
          onClick={exportToAppleCalendar}
          variant="outline" 
          className="w-full justify-start"
        >
          <Download className="h-4 w-4 mr-2" />
          Download for Apple Calendar
        </Button>
        
        <Button 
          onClick={downloadICS}
          variant="outline" 
          className="w-full justify-start"
        >
          <Download className="h-4 w-4 mr-2" />
          Download ICS File
        </Button>
      </CardContent>
    </Card>
  );
};
