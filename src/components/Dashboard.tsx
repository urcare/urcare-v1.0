
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  Activity, 
  Stethoscope, 
  TrendingUp, 
  Clock,
  UserPlus,
  AlertCircle 
} from 'lucide-react';

const stats = [
  {
    title: "Total Patients",
    value: "1,247",
    change: "+12% from last month",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Today's Appointments",
    value: "34",
    change: "8 pending confirmations",
    icon: Calendar,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Active Consultations",
    value: "12",
    change: "6 in emergency",
    icon: Stethoscope,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Lab Results Pending",
    value: "28",
    change: "5 critical",
    icon: Activity,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
];

const recentActivities = [
  {
    id: 1,
    patient: "John Doe",
    action: "Emergency admission",
    time: "10 minutes ago",
    status: "critical",
  },
  {
    id: 2,
    patient: "Sarah Wilson",
    action: "Lab results available",
    time: "25 minutes ago",
    status: "normal",
  },
  {
    id: 3,
    patient: "Mike Johnson",
    action: "Appointment scheduled",
    time: "1 hour ago",
    status: "scheduled",
  },
  {
    id: 4,
    patient: "Emily Davis",
    action: "Prescription updated",
    time: "2 hours ago",
    status: "completed",
  },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Dr. Johnson. Here's what's happening at UrCare today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <UserPlus className="w-4 h-4" />
            New Patient
          </Button>
          <Button className="gap-2 medical-gradient text-white">
            <Calendar className="w-4 h-4" />
            Schedule Appointment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Latest patient activities and system updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'critical' ? 'bg-red-500' :
                      activity.status === 'normal' ? 'bg-green-500' :
                      activity.status === 'scheduled' ? 'bg-blue-500' :
                      'bg-gray-500'
                    }`} />
                    <div>
                      <p className="font-medium">{activity.patient}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Frequently used hospital functions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Users className="w-4 h-4" />
              View All Patients
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Calendar className="w-4 h-4" />
              Appointment Calendar
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Activity className="w-4 h-4" />
              Emergency Dashboard
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <TrendingUp className="w-4 h-4" />
              Hospital Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
