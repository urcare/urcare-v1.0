
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
  AlertCircle,
  CreditCard,
  Beaker,
  Pill,
  Clipboard
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function Dashboard() {
  const { profile } = useAuth();
  
  // Define role-specific stats and activities
  const roleSpecificConfig = {
    Doctor: {
      greeting: "Welcome, Doctor",
      stats: [
        {
          title: "Today's Appointments",
          value: "12",
          change: "3 pending confirmations",
          icon: Calendar,
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
        {
          title: "Patients Seen Today",
          value: "8",
          change: "+2 from yesterday",
          icon: Users,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        },
        {
          title: "Active Consultations",
          value: "3",
          change: "1 in emergency",
          icon: Stethoscope,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        },
        {
          title: "Prescriptions Written",
          value: "15",
          change: "5 awaiting pharmacy",
          icon: Pill,
          color: "text-orange-600",
          bgColor: "bg-orange-100",
        }
      ],
      activities: [
        {
          id: 1,
          patient: "John Doe",
          action: "Consultation scheduled",
          time: "10 minutes ago",
          status: "scheduled",
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
          action: "Follow-up appointment",
          time: "1 hour ago",
          status: "scheduled",
        },
        {
          id: 4,
          patient: "Emily Davis",
          action: "Prescription updated",
          time: "2 hours ago",
          status: "completed",
        }
      ]
    },
    Patient: {
      greeting: "Welcome to UrCare",
      stats: [
        {
          title: "Upcoming Appointments",
          value: "2",
          change: "Next: May 25, 2025",
          icon: Calendar,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        },
        {
          title: "Prescriptions",
          value: "3",
          change: "1 renewal needed",
          icon: Pill,
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
        {
          title: "Lab Tests",
          value: "1",
          change: "Results pending",
          icon: Beaker,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        },
        {
          title: "Billing",
          value: "$120",
          change: "Due in 15 days",
          icon: CreditCard,
          color: "text-orange-600",
          bgColor: "bg-orange-100",
        }
      ],
      activities: [
        {
          id: 1,
          patient: "You",
          action: "Appointment booked",
          time: "Yesterday",
          status: "scheduled",
        },
        {
          id: 2,
          patient: "You",
          action: "Prescription filled",
          time: "2 days ago",
          status: "completed",
        },
        {
          id: 3,
          patient: "You",
          action: "Lab test completed",
          time: "1 week ago",
          status: "completed",
        },
        {
          id: 4,
          patient: "You",
          action: "Payment processed",
          time: "1 week ago",
          status: "completed",
        }
      ]
    },
    Nurse: {
      greeting: "Welcome, Nurse",
      stats: [
        {
          title: "Patients Assigned",
          value: "8",
          change: "2 requiring attention",
          icon: Users,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        },
        {
          title: "Medications Due",
          value: "12",
          change: "Next in 30 minutes",
          icon: Pill,
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
        {
          title: "Vitals Recorded",
          value: "24",
          change: "+8 from yesterday",
          icon: Activity,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        },
        {
          title: "Tasks Pending",
          value: "5",
          change: "2 high priority",
          icon: Clipboard,
          color: "text-orange-600",
          bgColor: "bg-orange-100",
        }
      ],
      activities: []
    },
    Admin: {
      greeting: "Welcome, Administrator",
      stats: [
        {
          title: "Total Staff",
          value: "124",
          change: "+3 this month",
          icon: Users,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        },
        {
          title: "System Health",
          value: "98%",
          change: "All systems operational",
          icon: Activity,
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
        {
          title: "Daily Revenue",
          value: "$12,450",
          change: "+8% from yesterday",
          icon: TrendingUp,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        },
        {
          title: "Issues Reported",
          value: "3",
          change: "1 critical",
          icon: AlertCircle,
          color: "text-orange-600",
          bgColor: "bg-orange-100",
        }
      ],
      activities: []
    },
    Pharmacy: {
      greeting: "Welcome, Pharmacist",
      stats: [
        {
          title: "Prescriptions Pending",
          value: "18",
          change: "5 urgent",
          icon: Pill,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        },
        {
          title: "Dispensed Today",
          value: "42",
          change: "+12 from yesterday",
          icon: Clipboard,
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
        {
          title: "Inventory Alerts",
          value: "3",
          change: "Items running low",
          icon: AlertCircle,
          color: "text-orange-600",
          bgColor: "bg-orange-100",
        },
        {
          title: "Patient Queries",
          value: "7",
          change: "2 waiting response",
          icon: Users,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        }
      ],
      activities: []
    },
    Lab: {
      greeting: "Welcome, Lab Technician",
      stats: [
        {
          title: "Tests Pending",
          value: "15",
          change: "4 urgent",
          icon: Beaker,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        },
        {
          title: "Results Ready",
          value: "8",
          change: "Awaiting review",
          icon: Clipboard,
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
        {
          title: "Samples Collected",
          value: "23",
          change: "+10 today",
          icon: Activity,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        },
        {
          title: "Equipment Status",
          value: "OK",
          change: "All systems functional",
          icon: Stethoscope,
          color: "text-orange-600",
          bgColor: "bg-orange-100",
        }
      ],
      activities: []
    },
    Reception: {
      greeting: "Welcome, Receptionist",
      stats: [
        {
          title: "Today's Appointments",
          value: "34",
          change: "8 pending check-in",
          icon: Calendar,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        },
        {
          title: "Patients in Waiting Room",
          value: "12",
          change: "Average wait: 15 min",
          icon: Users,
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
        {
          title: "New Registrations",
          value: "7",
          change: "+3 from yesterday",
          icon: UserPlus,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        },
        {
          title: "Messages",
          value: "5",
          change: "2 urgent",
          icon: AlertCircle,
          color: "text-orange-600",
          bgColor: "bg-orange-100",
        }
      ],
      activities: []
    }
  };

  // Default config if role is not found
  const defaultConfig = {
    greeting: "Welcome to UrCare",
    stats: [
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
    ],
    activities: [
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
    ]
  };

  // Get config based on user role
  const config = profile?.role ? roleSpecificConfig[profile.role] || defaultConfig : defaultConfig;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-muted-foreground">
            {config.greeting}{profile?.full_name ? `, ${profile.full_name}` : ''}. Here's what's happening at UrCare today.
          </p>
        </div>
        <div className="flex gap-3">
          {(profile?.role === 'Doctor' || profile?.role === 'Admin' || profile?.role === 'Reception') && (
            <Button variant="outline" className="gap-2">
              <UserPlus className="w-4 h-4" />
              New Patient
            </Button>
          )}
          <Button className="gap-2 medical-gradient text-white">
            <Calendar className="w-4 h-4" />
            Schedule Appointment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {config.stats.map((stat, index) => (
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
            {config.activities && config.activities.length > 0 ? (
              <div className="space-y-4">
                {config.activities.map((activity) => (
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
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground">No recent activities found.</p>
              </div>
            )}
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
