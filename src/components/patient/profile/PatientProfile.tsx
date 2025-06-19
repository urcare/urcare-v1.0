
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Settings, Shield, Bell, Download, Trash2, Edit, Camera } from 'lucide-react';

export const PatientProfile = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Profile & Settings</h1>
        <p className="text-muted-foreground">Manage your account, privacy, and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-white" />
            </div>
            <CardTitle>Sarah Johnson</CardTitle>
            <CardDescription>Patient ID: PID-123456</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              <Camera className="w-4 h-4 mr-2" />
              Update Photo
            </Button>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Age:</span>
                <span>34 years</span>
              </div>
              <div className="flex justify-between">
                <span>Gender:</span>
                <span>Female</span>
              </div>
              <div className="flex justify-between">
                <span>Blood Type:</span>
                <span>O+</span>
              </div>
              <div className="flex justify-between">
                <span>Member Since:</span>
                <span>Jan 2023</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your personal information and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Edit className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div><strong>Email:</strong> sarah.johnson@email.com</div>
                    <div><strong>Phone:</strong> +1 (555) 123-4567</div>
                    <div><strong>Address:</strong> 123 Main St, City, State</div>
                  </div>
                  <Button size="sm" variant="outline" className="mt-3">
                    Edit Information
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Privacy & Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>Two-Factor Authentication: Enabled</div>
                    <div>Data Sharing: Limited</div>
                    <div>Last Login: Today, 9:30 AM</div>
                  </div>
                  <Button size="sm" variant="outline" className="mt-3">
                    Security Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>Appointment Reminders: On</div>
                    <div>Medication Alerts: On</div>
                    <div>Health Insights: Weekly</div>
                  </div>
                  <Button size="sm" variant="outline" className="mt-3">
                    Manage Notifications
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    App Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>Theme: Auto (System)</div>
                    <div>Language: English</div>
                    <div>Dashboard Layout: Grid</div>
                  </div>
                  <Button size="sm" variant="outline" className="mt-3">
                    Customize App
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Control your health data and account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Health Data
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacy Report
            </Button>
            <Button variant="destructive" className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
