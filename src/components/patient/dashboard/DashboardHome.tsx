
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Brain, 
  Heart, 
  Calendar, 
  Pill, 
  Camera, 
  Shield, 
  TrendingUp, 
  Bell,
  Activity,
  Stethoscope,
  Users,
  Clock,
  Video,
  Plus,
  FileText,
  Phone,
  MessageSquare
} from 'lucide-react';

export const DashboardHome = () => {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate('/appointments');
  };

  const handleTeleconsult = () => {
    navigate('/telemedicine');
  };

  const handleEmergency = () => {
    navigate('/emergency');
  };

  const handleUploadRecords = () => {
    navigate('/documents');
  };

  const handleReschedule = () => {
    navigate('/appointments');
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  const handleViewSettings = () => {
    navigate('/settings');
  };

  const handleViewWellness = () => {
    navigate('/wellness');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-4 border-white dark:border-gray-700 shadow-lg">
            <AvatarImage src="/placeholder-avatar.jpg" alt="Patient" />
            <AvatarFallback className="bg-blue-500 text-white text-lg font-semibold">
              DR
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, Dr. Sarah!</h2>
            <p className="text-gray-600 dark:text-gray-400">How are you feeling today? Let's check your health status.</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">85</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Health Score</div>
          </div>
        </div>
      </div>

      {/* Next Appointment Card */}
      <Card className="border-green-100 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-400">
            <Calendar className="w-5 h-5" />
            Next Appointment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Dr. Michael Chen - Cardiology</p>
              <p className="text-gray-600 dark:text-gray-400">Tomorrow, 2:00 PM</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Virtual Consultation</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="border-green-200 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950/50"
                onClick={handleReschedule}
              >
                Reschedule
              </Button>
              <Button 
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleTeleconsult}
              >
                <Video className="w-4 h-4 mr-2" />
                Join Call
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          onClick={handleBookAppointment}
          className="h-24 flex-col gap-2 bg-blue-500 hover:bg-blue-600 text-white shadow-md"
        >
          <Calendar className="w-6 h-6" />
          <span className="text-sm font-medium">Book Appointment</span>
        </Button>

        <Button
          onClick={handleTeleconsult}
          className="h-24 flex-col gap-2 bg-green-500 hover:bg-green-600 text-white shadow-md"
        >
          <Video className="w-6 h-6" />
          <span className="text-sm font-medium">Start Teleconsult</span>
        </Button>

        <Button
          onClick={handleUploadRecords}
          variant="outline"
          className="h-24 flex-col gap-2 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-950/30"
        >
          <FileText className="w-6 h-6" />
          <span className="text-sm font-medium">Upload Records</span>
        </Button>

        <Button
          onClick={handleEmergency}
          variant="outline"
          className="h-24 flex-col gap-2 border-2 border-red-200 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
        >
          <Shield className="w-6 h-6" />
          <span className="text-sm font-medium">Emergency SOS</span>
        </Button>
      </div>

      {/* Dashboard Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* My Doctors */}
        <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-500" />
              My Doctors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-blue-500 text-white">MC</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Dr. Michael Chen</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Cardiology</p>
              </div>
              <Button size="sm" variant="ghost">
                <MessageSquare className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-green-500 text-white">SJ</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Dr. Sarah Johnson</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">General Medicine</p>
              </div>
              <Button size="sm" variant="ghost">
                <Phone className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Health Summary */}
        <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              Health Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div 
              className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors"
              onClick={handleViewWellness}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Sleep Quality</span>
              </div>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Good (7.5h)</span>
            </div>
            <div 
              className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg cursor-pointer hover:bg-green-100 dark:hover:bg-green-950/50 transition-colors"
              onClick={() => navigate('/pharmacy')}
            >
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Medications</span>
              </div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">2 Active</span>
            </div>
            <div 
              className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-950/50 transition-colors"
              onClick={handleViewWellness}
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Heart Rate</span>
              </div>
              <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">72 BPM</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Medication taken</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Lisinopril 10mg - 8:00 AM</p>
              </div>
            </div>
            <div 
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={handleUploadRecords}
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Blood pressure logged</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">120/80 mmHg - Yesterday</p>
              </div>
            </div>
            <div 
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={handleUploadRecords}
            >
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Lab results uploaded</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Blood work - 2 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
