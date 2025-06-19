
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Stethoscope, Brain, Bell, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto space-medical-3xl">
        {/* Header */}
        <div className="space-medical-lg">
          <h1 className="text-h1 text-foreground">Medical Dashboard</h1>
          <p className="text-body text-muted-foreground">
            Monitor patient care, AI insights, and system performance in real-time
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="medical-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-muted-foreground font-medium">Total Patients</p>
                <p className="text-h2 text-foreground font-semibold">1,247</p>
                <div className="flex items-center gap-1 mt-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-body-sm text-success">+12% this month</span>
                </div>
              </div>
              <div className="w-12 h-12 gradient-medical rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="medical-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-muted-foreground font-medium">AI Diagnoses Today</p>
                <p className="text-h2 text-foreground font-semibold">89</p>
                <div className="flex items-center gap-1 mt-2">
                  <Brain className="w-4 h-4 text-secondary ai-thinking" />
                  <span className="text-body-sm text-secondary">Processing 3 cases</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="medical-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-muted-foreground font-medium">Active Consultations</p>
                <p className="text-h2 text-foreground font-semibold">24</p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="status-online"></div>
                  <span className="text-body-sm text-success">8 doctors online</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="medical-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-muted-foreground font-medium">Urgent Cases</p>
                <p className="text-h2 text-foreground font-semibold">3</p>
                <div className="flex items-center gap-1 mt-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <span className="text-body-sm text-warning">Needs attention</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-warning rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent AI Diagnoses */}
          <div className="lg:col-span-2">
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="text-h3 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-secondary" />
                  Recent AI Diagnoses
                </CardTitle>
                <CardDescription>
                  Latest AI-powered patient assessments and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-medical-md">
                <div className="space-medical-sm">
                  <div className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <div>
                        <p className="text-body font-medium">Patient #1023 - Respiratory Assessment</p>
                        <p className="text-body-sm text-muted-foreground">Confidence: 94% • Reviewed by Dr. Smith</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>2 mins ago</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <div>
                        <p className="text-body font-medium">Patient #0987 - Cardiac Screening</p>
                        <p className="text-body-sm text-muted-foreground">Confidence: 87% • Pending review</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>15 mins ago</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <div>
                        <p className="text-body font-medium">Patient #0856 - Dermatology Consultation</p>
                        <p className="text-body-sm text-muted-foreground">Confidence: 91% • Reviewed by Dr. Johnson</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>1 hour ago</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Status */}
          <div className="space-medical-lg">
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="text-h4">System Status</CardTitle>
                <CardDescription>Real-time platform health monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-medical-md">
                <div className="space-medical-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-body-sm">AI Processing Engine</span>
                    <div className="flex items-center gap-2">
                      <div className="status-online"></div>
                      <span className="text-body-sm text-success">Operational</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-body-sm">Database</span>
                    <div className="flex items-center gap-2">
                      <div className="status-online"></div>
                      <span className="text-body-sm text-success">Healthy</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-body-sm">Patient Portal</span>
                    <div className="flex items-center gap-2">
                      <div className="status-online"></div>
                      <span className="text-body-sm text-success">Online</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-body-sm">Integration APIs</span>
                    <div className="flex items-center gap-2">
                      <div className="status-busy"></div>
                      <span className="text-body-sm text-warning">Maintenance</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="text-h4">Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-medical-sm">
                <button className="btn-medical-secondary w-full justify-start">
                  View Pending Cases
                </button>
                <button className="btn-medical-ghost w-full justify-start">
                  Generate Reports
                </button>
                <button className="btn-medical-ghost w-full justify-start">
                  System Settings
                </button>
                <button className="btn-medical-ghost w-full justify-start">
                  User Management
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
