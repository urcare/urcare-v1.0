
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Stethoscope, Brain, Bell, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { ThemeWrapper } from '@/components/ThemeWrapper';

export const Dashboard = () => {
  return (
    <ThemeWrapper>
      <div className="min-h-screen bg-background text-foreground p-6">
        <div className="container mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Medical Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Monitor patient care, AI insights, and system performance in real-time
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card text-card-foreground border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Total Patients</p>
                    <p className="text-3xl text-foreground font-semibold">1,247</p>
                    <div className="flex items-center gap-1 mt-2">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-green-600 dark:text-green-400">+12% this month</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card text-card-foreground border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">AI Diagnoses Today</p>
                    <p className="text-3xl text-foreground font-semibold">89</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Brain className="w-4 h-4 text-secondary" />
                      <span className="text-sm text-secondary">Processing 3 cases</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-secondary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card text-card-foreground border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Active Consultations</p>
                    <p className="text-3xl text-foreground font-semibold">24</p>
                    <div className="flex items-center gap-1 mt-2">
                      <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                      <span className="text-sm text-green-600 dark:text-green-400">8 doctors online</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-accent-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card text-card-foreground border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Urgent Cases</p>
                    <p className="text-3xl text-foreground font-semibold">3</p>
                    <div className="flex items-center gap-1 mt-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-sm text-yellow-600 dark:text-yellow-400">Needs attention</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-yellow-600 dark:bg-yellow-500 rounded-xl flex items-center justify-center">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent AI Diagnoses */}
            <div className="lg:col-span-2">
              <Card className="bg-card text-card-foreground border-border">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Brain className="w-5 h-5 text-secondary" />
                    Recent AI Diagnoses
                  </CardTitle>
                  <CardDescription>
                    Latest AI-powered patient assessments and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                        <div>
                          <p className="font-medium text-foreground">Patient #1023 - Respiratory Assessment</p>
                          <p className="text-sm text-muted-foreground">Confidence: 94% • Reviewed by Dr. Smith</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>2 mins ago</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-600 dark:bg-yellow-400 rounded-full"></div>
                        <div>
                          <p className="font-medium text-foreground">Patient #0987 - Cardiac Screening</p>
                          <p className="text-sm text-muted-foreground">Confidence: 87% • Pending review</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>15 mins ago</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                        <div>
                          <p className="font-medium text-foreground">Patient #0856 - Dermatology Consultation</p>
                          <p className="text-sm text-muted-foreground">Confidence: 91% • Reviewed by Dr. Johnson</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>1 hour ago</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Status */}
            <div className="space-y-6">
              <Card className="bg-card text-card-foreground border-border">
                <CardHeader>
                  <CardTitle className="text-xl">System Status</CardTitle>
                  <CardDescription>Real-time platform health monitoring</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">AI Processing Engine</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                        <span className="text-sm text-green-600 dark:text-green-400">Operational</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">Database</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                        <span className="text-sm text-green-600 dark:text-green-400">Healthy</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">Patient Portal</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                        <span className="text-sm text-green-600 dark:text-green-400">Online</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">Integration APIs</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-600 dark:bg-yellow-400 rounded-full"></div>
                        <span className="text-sm text-yellow-600 dark:text-yellow-400">Maintenance</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card text-card-foreground border-border">
                <CardHeader>
                  <CardTitle className="text-xl">Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <button className="w-full text-left px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    View Pending Cases
                  </button>
                  <button className="w-full text-left px-4 py-2 bg-background hover:bg-accent hover:text-accent-foreground border border-border rounded-lg transition-colors">
                    Generate Reports
                  </button>
                  <button className="w-full text-left px-4 py-2 bg-background hover:bg-accent hover:text-accent-foreground border border-border rounded-lg transition-colors">
                    System Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 bg-background hover:bg-accent hover:text-accent-foreground border border-border rounded-lg transition-colors">
                    User Management
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ThemeWrapper>
  );
};
