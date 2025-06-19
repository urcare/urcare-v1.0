
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill, Clock, AlertTriangle, Bell, ShoppingCart, Camera } from 'lucide-react';

export const MedicationHub = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Medication Hub</h1>
        <p className="text-muted-foreground">Track prescriptions, set reminders, and manage your medications</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button size="lg" className="h-20 flex-col gap-2">
          <Camera className="w-6 h-6" />
          Scan Prescription
        </Button>
        <Button size="lg" variant="outline" className="h-20 flex-col gap-2">
          <Bell className="w-6 h-6" />
          Set Reminder
        </Button>
        <Button size="lg" variant="outline" className="h-20 flex-col gap-2">
          <ShoppingCart className="w-6 h-6" />
          Order Refill
        </Button>
        <Button size="lg" variant="outline" className="h-20 flex-col gap-2">
          <Pill className="w-6 h-6" />
          Add Manual
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Medications</CardTitle>
            <CardDescription>Your current prescriptions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-success/10 rounded-lg border border-success/20">
              <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Lisinopril 10mg</h3>
                <p className="text-sm text-muted-foreground">Once daily • Morning</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-success" />
                  <span className="text-sm text-success">Taken today at 8:00 AM</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">28 pills left</p>
                <p className="text-xs text-muted-foreground">Refill in 4 weeks</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-warning/10 rounded-lg border border-warning/20">
              <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Metformin 500mg</h3>
                <p className="text-sm text-muted-foreground">Twice daily • With meals</p>
                <div className="flex items-center gap-2 mt-1">
                  <Bell className="w-4 h-4 text-warning" />
                  <span className="text-sm text-warning">Due in 2 hours</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">15 pills left</p>
                <p className="text-xs text-muted-foreground">Refill needed</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-background-secondary rounded-lg">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Vitamin D3</h3>
                <p className="text-sm text-muted-foreground">Once daily • With breakfast</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Next dose: Tomorrow 8:00 AM</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">45 pills left</p>
                <p className="text-xs text-muted-foreground">Good stock</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medication Insights</CardTitle>
            <CardDescription>AI-powered medication management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <h3 className="font-semibold text-primary mb-2">Adherence Score</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-background rounded-full h-3">
                  <div className="bg-primary h-3 rounded-full w-[92%]"></div>
                </div>
                <span className="text-2xl font-bold text-primary">92%</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Excellent medication compliance this month</p>
            </div>

            <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <h3 className="font-semibold text-destructive">Drug Interaction Alert</h3>
              </div>
              <p className="text-sm text-muted-foreground">No interactions detected with current medications</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Upcoming Refills</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-background-secondary rounded">
                  <span className="text-sm">Metformin 500mg</span>
                  <span className="text-sm text-warning">2 days</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-background-secondary rounded">
                  <span className="text-sm">Lisinopril 10mg</span>
                  <span className="text-sm text-muted-foreground">28 days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
