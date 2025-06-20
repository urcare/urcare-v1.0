
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, Users, Calendar, Bell, Shield, Heart, Plus, Settings } from 'lucide-react';

export const FamilyCareHub = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Family Care Hub</h1>
        <p className="text-muted-foreground">Manage and coordinate healthcare for your family members</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button size="lg" className="h-20 flex-col gap-2">
          <UserPlus className="w-6 h-6" />
          Add Family Member
        </Button>
        <Button size="lg" variant="outline" className="h-20 flex-col gap-2">
          <Calendar className="w-6 h-6" />
          Family Calendar
        </Button>
        <Button size="lg" variant="outline" className="h-20 flex-col gap-2">
          <Bell className="w-6 h-6" />
          Set Reminders
        </Button>
        <Button size="lg" variant="outline" className="h-20 flex-col gap-2">
          <Shield className="w-6 h-6" />
          Emergency Info
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Family Members</CardTitle>
            <CardDescription>Healthcare profiles for your family</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-blue-500 text-white text-lg">SJ</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Sarah Johnson (You)</h3>
                <p className="text-sm text-muted-foreground">Primary Account Holder</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-green-500" />
                    Health Score: 85
                  </span>
                  <span className="text-blue-600">2 upcoming appointments</span>
                </div>
              </div>
              <Button size="sm" variant="outline">
                View Profile
              </Button>
            </div>

            <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-green-500 text-white text-lg">MJ</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Michael Johnson</h3>
                <p className="text-sm text-muted-foreground">Spouse • Age 36</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-yellow-500" />
                    Health Score: 78
                  </span>
                  <span className="text-yellow-600">Medication reminder due</span>
                </div>
              </div>
              <Button size="sm" variant="outline">
                View Profile
              </Button>
            </div>

            <div className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-purple-500 text-white text-lg">EJ</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Emma Johnson</h3>
                <p className="text-sm text-muted-foreground">Daughter • Age 8</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-green-500" />
                    Health Score: 92
                  </span>
                  <span className="text-green-600">Pediatric checkup next week</span>
                </div>
              </div>
              <Button size="sm" variant="outline">
                View Profile
              </Button>
            </div>

            <Button variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Family Member
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Family Alerts</CardTitle>
            <CardDescription>Important notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
              <Bell className="w-5 h-5 text-yellow-600" />
              <div className="flex-1">
                <p className="font-medium text-sm">Michael's medication reminder</p>
                <p className="text-xs text-muted-foreground">Blood pressure medication due in 1 hour</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-sm">Emma's pediatric checkup</p>
                <p className="text-xs text-muted-foreground">Scheduled for next Tuesday at 3:00 PM</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <Shield className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="font-medium text-sm">Emergency contacts updated</p>
                <p className="text-xs text-muted-foreground">All family emergency info is current</p>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full">
              <Settings className="w-4 h-4 mr-2" />
              Manage Notifications
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
