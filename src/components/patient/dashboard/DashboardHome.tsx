
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Heart, 
  Calendar, 
  Pill, 
  Camera, 
  Shield, 
  TrendingUp, 
  Bell,
  Activity,
  Stethoscope,
  Users,
  Clock
} from 'lucide-react';

export const DashboardHome = () => {
  return (
    <div className="space-y-6">
      {/* AI Health Twin & Daily Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              AI Health Twin
            </CardTitle>
            <CardDescription>Your personalized health companion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <Heart className="w-12 h-12 text-white animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl font-bold text-primary">85</span>
                  <span className="text-lg text-muted-foreground">/100</span>
                  <TrendingUp className="w-5 h-5 text-success ml-2" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Your health score improved by 8 points this week
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Physical Health</span>
                    <span className="font-medium">88%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div className="bg-success h-2 rounded-full w-[88%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
              <Pill className="w-5 h-5 text-success" />
              <div className="flex-1">
                <p className="text-sm font-medium">Take morning medication</p>
                <p className="text-xs text-muted-foreground">Due in 30 minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
              <Activity className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">30-minute walk</p>
                <p className="text-xs text-muted-foreground">For better sleep</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-lg">
              <Calendar className="w-5 h-5 text-warning" />
              <div className="flex-1">
                <p className="text-sm font-medium">Schedule check-up</p>
                <p className="text-xs text-muted-foreground">Blood work due</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Button
          variant="outline"
          className="h-24 flex-col gap-2 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:bg-primary/20"
        >
          <Stethoscope className="w-6 h-6 text-primary" />
          <span className="text-xs">Symptom Checker</span>
        </Button>

        <Button
          variant="outline"
          className="h-24 flex-col gap-2 bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/20 hover:bg-destructive/20"
        >
          <Shield className="w-6 h-6 text-destructive" />
          <span className="text-xs">Emergency SOS</span>
        </Button>

        <Button
          variant="outline"
          className="h-24 flex-col gap-2 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20 hover:bg-secondary/20"
        >
          <Calendar className="w-6 h-6 text-secondary" />
          <span className="text-xs">Book Appointment</span>
        </Button>

        <Button
          variant="outline"
          className="h-24 flex-col gap-2 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 hover:bg-accent/20"
        >
          <Camera className="w-6 h-6 text-accent" />
          <span className="text-xs">Scan Document</span>
        </Button>

        <Button
          variant="outline"
          className="h-24 flex-col gap-2 bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20 hover:bg-warning/20"
        >
          <Pill className="w-6 h-6 text-warning" />
          <span className="text-xs">Medications</span>
        </Button>

        <Button
          variant="outline"
          className="h-24 flex-col gap-2 bg-gradient-to-br from-success/5 to-success/10 border-success/20 hover:bg-success/20"
        >
          <Users className="w-6 h-6 text-success" />
          <span className="text-xs">Family Switch</span>
        </Button>
      </div>

      {/* Dashboard Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-background-secondary rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Dr. Sarah Johnson</p>
                <p className="text-xs text-muted-foreground">Cardiology • Tomorrow 2:00 PM</p>
              </div>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-3 p-3 bg-background-secondary rounded-lg">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Dr. Michael Chen</p>
                <p className="text-xs text-muted-foreground">General • Friday 10:30 AM</p>
              </div>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Medication Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-warning" />
              Medication Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div>
                <p className="text-sm font-medium">Lisinopril 10mg</p>
                <p className="text-xs text-muted-foreground">Taken at 8:00 AM</p>
              </div>
              <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
              <div>
                <p className="text-sm font-medium">Metformin 500mg</p>
                <p className="text-xs text-muted-foreground">Due in 2 hours</p>
              </div>
              <Bell className="w-5 h-5 text-warning" />
            </div>
          </CardContent>
        </Card>

        {/* Health Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-secondary" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <p className="text-sm font-medium mb-1">Sleep Pattern Alert</p>
              <p className="text-xs text-muted-foreground">
                Your sleep quality has improved 15% this week. Keep up the good work!
              </p>
            </div>
            <div className="p-3 bg-secondary/10 rounded-lg">
              <p className="text-sm font-medium mb-1">Exercise Recommendation</p>
              <p className="text-xs text-muted-foreground">
                Based on your heart rate data, consider adding 10 minutes to your daily walk.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
