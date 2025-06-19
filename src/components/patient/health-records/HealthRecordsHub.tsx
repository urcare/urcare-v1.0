
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Upload, Search, Calendar } from 'lucide-react';

export const HealthRecordsHub = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Health Records Hub</h1>
        <p className="text-muted-foreground">Manage your medical documents and health timeline</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <Upload className="w-8 h-8 mx-auto text-primary mb-2" />
            <CardTitle className="text-lg">Upload Documents</CardTitle>
            <CardDescription>Add new medical records</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <Search className="w-8 h-8 mx-auto text-secondary mb-2" />
            <CardTitle className="text-lg">Search Records</CardTitle>
            <CardDescription>Find specific documents</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <Calendar className="w-8 h-8 mx-auto text-accent mb-2" />
            <CardTitle className="text-lg">Timeline View</CardTitle>
            <CardDescription>Health journey overview</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <FileText className="w-8 h-8 mx-auto text-warning mb-2" />
            <CardTitle className="text-lg">Reports</CardTitle>
            <CardDescription>Generated summaries</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
          <CardDescription>Your latest health records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-background-secondary rounded-lg">
              <FileText className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium">Blood Test Results</p>
                <p className="text-sm text-muted-foreground">Dr. Smith • 2 days ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-background-secondary rounded-lg">
              <FileText className="w-5 h-5 text-secondary" />
              <div className="flex-1">
                <p className="font-medium">Prescription - Lisinopril</p>
                <p className="text-sm text-muted-foreground">Dr. Johnson • 1 week ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-background-secondary rounded-lg">
              <FileText className="w-5 h-5 text-accent" />
              <div className="flex-1">
                <p className="font-medium">X-Ray Report</p>
                <p className="text-sm text-muted-foreground">City Hospital • 2 weeks ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
