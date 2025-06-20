
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Video, Phone, MapPin } from 'lucide-react';

export const AppointmentManagement = () => {
  return (
    <div className="space-y-6 bg-background text-foreground p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Appointment Management</h1>
        <p className="text-muted-foreground">Schedule, manage, and attend your medical appointments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button size="lg" className="h-20 flex-col gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Calendar className="w-6 h-6" />
          Book New Appointment
        </Button>
        <Button size="lg" variant="outline" className="h-20 flex-col gap-2 border-border bg-background hover:bg-accent hover:text-accent-foreground">
          <Video className="w-6 h-6" />
          Teleconsult
        </Button>
        <Button size="lg" variant="outline" className="h-20 flex-col gap-2 border-border bg-background hover:bg-accent hover:text-accent-foreground">
          <Clock className="w-6 h-6" />
          Reschedule
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Upcoming Appointments</CardTitle>
            <CardDescription className="text-muted-foreground">Your scheduled visits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Dr. Sarah Johnson</h3>
                <p className="text-sm text-muted-foreground">Cardiology Consultation</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Tomorrow, 2:00 PM
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    City Hospital
                  </span>
                </div>
              </div>
              <Button size="sm" variant="outline" className="border-border bg-background hover:bg-accent hover:text-accent-foreground">
                <Video className="w-4 h-4 mr-2" />
                Join
              </Button>
            </div>

            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Dr. Michael Chen</h3>
                <p className="text-sm text-muted-foreground">General Checkup</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Friday, 10:30 AM
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    Teleconsult
                  </span>
                </div>
              </div>
              <Button size="sm" variant="outline" className="border-border bg-background hover:bg-accent hover:text-accent-foreground">Reschedule</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Visits</CardTitle>
            <CardDescription className="text-muted-foreground">Your appointment history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Dr. Emily Davis</p>
                <p className="text-sm text-muted-foreground">Dermatology • Last week</p>
              </div>
              <Button size="sm" variant="ghost" className="hover:bg-accent hover:text-accent-foreground">View Report</Button>
            </div>
            <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Dr. Robert Wilson</p>
                <p className="text-sm text-muted-foreground">Orthopedics • 2 weeks ago</p>
              </div>
              <Button size="sm" variant="ghost" className="hover:bg-accent hover:text-accent-foreground">View Report</Button>
            </div>
            <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Dr. Lisa Brown</p>
                <p className="text-sm text-muted-foreground">Pediatrics • 3 weeks ago</p>
              </div>
              <Button size="sm" variant="ghost" className="hover:bg-accent hover:text-accent-foreground">View Report</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
