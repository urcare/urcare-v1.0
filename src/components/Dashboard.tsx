
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to UrCare Healthcare Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Patients</CardTitle>
            <CardDescription>Manage patient records</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">124</p>
            <p className="text-sm text-gray-600">Active patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
            <CardDescription>Schedule and manage appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">42</p>
            <p className="text-sm text-gray-600">Today's appointments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>View medical reports</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">18</p>
            <p className="text-sm text-gray-600">Pending reports</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest system activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">• New patient John Doe registered</p>
            <p className="text-sm">• Appointment scheduled for 2:00 PM</p>
            <p className="text-sm">• Lab report completed for patient #123</p>
            <p className="text-sm">• Prescription updated for patient Jane Smith</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
