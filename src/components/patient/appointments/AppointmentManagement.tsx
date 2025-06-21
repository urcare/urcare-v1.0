
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Video, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AppointmentManagement = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 bg-background text-foreground p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Appointment Management</h1>
        <p className="text-muted-foreground">Schedule, manage, and attend your medical appointments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          size="lg" 
          className="h-20 flex-col gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => navigate('/appointments')}
        >
          <Calendar className="w-6 h-6" />
          Book New Appointment
        </Button>
        <Button 
          size="lg" 
          variant="outline" 
          className="h-20 flex-col gap-2 border-border bg-background hover:bg-accent hover:text-accent-foreground"
          onClick={() => navigate('/appointments')}
        >
          <Video className="w-6 h-6" />
          Teleconsult
        </Button>
        <Button 
          size="lg" 
          variant="outline" 
          className="h-20 flex-col gap-2 border-border bg-background hover:bg-accent hover:text-accent-foreground"
          onClick={() => navigate('/appointments')}
        >
          <Clock className="w-6 h-6" />
          View Schedule
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
            <CardDescription className="text-muted-foreground">Common appointment tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/appointments')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              View All Appointments
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/appointments')}
            >
              <Clock className="w-4 h-4 mr-2" />
              Check-In with QR Code
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/appointments')}
            >
              <Video className="w-4 h-4 mr-2" />
              Join Teleconsult
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Help & Support</CardTitle>
            <CardDescription className="text-muted-foreground">Need assistance with appointments?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Call Reception</p>
                <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Hospital Location</p>
                <p className="text-sm text-muted-foreground">123 Medical Center Drive</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
