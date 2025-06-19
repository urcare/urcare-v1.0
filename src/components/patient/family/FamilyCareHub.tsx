
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Shield, Calendar, AlertTriangle, Heart } from 'lucide-react';

export const FamilyCareHub = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Family Care Hub</h1>
        <p className="text-muted-foreground">Manage health for your entire family in one place</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button size="lg" className="h-20 flex-col gap-2">
          <UserPlus className="w-6 h-6" />
          Add Family Member
        </Button>
        <Button size="lg" variant="outline" className="h-20 flex-col gap-2">
          <Shield className="w-6 h-6" />
          Guardian Mode
        </Button>
        <Button size="lg" variant="outline" className="h-20 flex-col gap-2">
          <Calendar className="w-6 h-6" />
          Family Calendar
        </Button>
        <Button size="lg" variant="outline" className="h-20 flex-col gap-2">
          <AlertTriangle className="w-6 h-6" />
          Emergency Contacts
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Family Members</CardTitle>
            <CardDescription>Manage health profiles for your family</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Sarah Johnson (You)</h3>
                <p className="text-sm text-muted-foreground">Primary Account • Age 34</p>
                <div className="flex items-center gap-2 mt-1">
                  <Heart className="w-4 h-4 text-success" />
                  <span className="text-sm text-success">Health Score: 92/100</span>
                </div>
              </div>
              <Button size="sm" variant="outline">View Profile</Button>
            </div>

            <div className="flex items-center gap-4 p-4 bg-background-secondary rounded-lg">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Emma Johnson</h3>
                <p className="text-sm text-muted-foreground">Daughter • Age 8</p>
                <div className="flex items-center gap-2 mt-1">
                  <Heart className="w-4 h-4 text-success" />
                  <span className="text-sm text-success">Vaccination up-to-date</span>
                </div>
              </div>
              <Button size="sm" variant="outline">Manage</Button>
            </div>

            <div className="flex items-center gap-4 p-4 bg-background-secondary rounded-lg">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Robert Johnson</h3>
                <p className="text-sm text-muted-foreground">Father • Age 68</p>
                <div className="flex items-center gap-2 mt-1">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <span className="text-sm text-warning">Medication reminder due</span>
                </div>
              </div>
              <Button size="sm" variant="outline">Care Plan</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Family Health Overview</CardTitle>
            <CardDescription>Quick insights and alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-success/10 rounded-lg">
              <h3 className="font-semibold text-success mb-2">All Clear</h3>
              <p className="text-sm text-muted-foreground">No urgent health issues detected for any family member</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Upcoming for Family</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-background-secondary rounded">
                  <span className="text-sm">Emma's Pediatric Checkup</span>
                  <span className="text-sm text-muted-foreground">Tomorrow</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-background-secondary rounded">
                  <span className="text-sm">Dad's Blood Pressure Medication</span>
                  <span className="text-sm text-warning">Overdue</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-background-secondary rounded">
                  <span className="text-sm">Family Flu Vaccination</span>
                  <span className="text-sm text-muted-foreground">Next week</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
