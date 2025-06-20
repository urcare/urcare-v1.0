
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill, Clock, Bell, Plus, Search, Calendar } from 'lucide-react';

export const MedicationHub = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Medication Hub</h1>
        <p className="text-muted-foreground">Manage your prescriptions, reminders, and medication schedule</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button size="lg" className="h-20 flex-col gap-2">
          <Plus className="w-6 h-6" />
          Add Medication
        </Button>
        <Button size="lg" variant="outline" className="h-20 flex-col gap-2">
          <Bell className="w-6 h-6" />
          Set Reminder
        </Button>
        <Button size="lg" variant="outline" className="h-20 flex-col gap-2">
          <Search className="w-6 h-6" />
          Drug Database
        </Button>
        <Button size="lg" variant="outline" className="h-20 flex-col gap-2">
          <Calendar className="w-6 h-6" />
          Schedule
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Medications</CardTitle>
            <CardDescription>Your active prescriptions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Lisinopril 10mg</h3>
                <p className="text-sm text-muted-foreground">Take once daily with food</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    8:00 AM daily
                  </span>
                  <span className="text-green-600">✓ Taken today</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Metformin 500mg</h3>
                <p className="text-sm text-muted-foreground">Take twice daily with meals</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    8:00 AM & 6:00 PM
                  </span>
                  <span className="text-yellow-600">⏰ Due at 6:00 PM</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medication Reminders</CardTitle>
            <CardDescription>Upcoming doses and alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
              <Bell className="w-5 h-5 text-yellow-600" />
              <div className="flex-1">
                <p className="font-medium">Metformin due in 2 hours</p>
                <p className="text-sm text-muted-foreground">500mg with dinner</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <Bell className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium">Lisinopril tomorrow at 8:00 AM</p>
                <p className="text-sm text-muted-foreground">10mg with breakfast</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
              <Bell className="w-5 h-5 text-purple-600" />
              <div className="flex-1">
                <p className="font-medium">Prescription refill needed</p>
                <p className="text-sm text-muted-foreground">Lisinopril - 5 days remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
