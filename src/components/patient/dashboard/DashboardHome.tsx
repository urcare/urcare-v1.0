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
  MessageSquare,
  Building2,
  DollarSign,
  FlaskConical,
  UserPlus,
  BarChart3,
  Microscope,
  Truck,
  Settings,
  CreditCard,
  Headphones,
  Baby,
  UserCheck,
  Briefcase,
  Database,
  Globe,
  Smartphone,
  AlertTriangle,
  Zap
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

  const handleWardManagement = () => {
    navigate('/ward');
  };

  const handleBilling = () => {
    navigate('/billing');
  };

  const handleLIMS = () => {
    navigate('/lims');
  };

  const handleCommunity = () => {
    navigate('/community');
  };

  const handleHRManagement = () => {
    navigate('/hr-management');
  };

  const handleAnalytics = () => {
    navigate('/hospital-analytics');
  };

  const handlePathology = () => {
    navigate('/pathology');
  };

  const handleInsurance = () => {
    navigate('/insurance');
  };

  const handleMentalHealth = () => {
    navigate('/mental-health');
  };

  const handleAIDiagnostics = () => {
    navigate('/advanced-ai-diagnostics');
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

      {/* Primary Quick Actions */}
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

      {/* Healthcare System Quick Access */}
      <Card className="border-blue-100 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-400">
            <Building2 className="w-5 h-5" />
            Healthcare System Access
          </CardTitle>
          <CardDescription>Quick access to hospital departments and services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <Button
              onClick={handleWardManagement}
              variant="outline"
              className="h-20 flex-col gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400"
            >
              <Building2 className="w-5 h-5" />
              <span className="text-xs">Ward Management</span>
            </Button>

            <Button
              onClick={handleBilling}
              variant="outline"
              className="h-20 flex-col gap-1 border-green-200 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400"
            >
              <DollarSign className="w-5 h-5" />
              <span className="text-xs">Billing</span>
            </Button>

            <Button
              onClick={handleLIMS}
              variant="outline"
              className="h-20 flex-col gap-1 border-cyan-200 text-cyan-700 hover:bg-cyan-50 dark:border-cyan-700 dark:text-cyan-400"
            >
              <FlaskConical className="w-5 h-5" />
              <span className="text-xs">Lab (LIMS)</span>
            </Button>

            <Button
              onClick={handlePathology}
              variant="outline"
              className="h-20 flex-col gap-1 border-pink-200 text-pink-700 hover:bg-pink-50 dark:border-pink-700 dark:text-pink-400"
            >
              <Microscope className="w-5 h-5" />
              <span className="text-xs">Pathology</span>
            </Button>

            <Button
              onClick={handleCommunity}
              variant="outline"
              className="h-20 flex-col gap-1 border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400"
            >
              <Users className="w-5 h-5" />
              <span className="text-xs">Community</span>
            </Button>

            <Button
              onClick={handleHRManagement}
              variant="outline"
              className="h-20 flex-col gap-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-400"
            >
              <UserPlus className="w-5 h-5" />
              <span className="text-xs">HR Management</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Specialized Services */}
      <Card className="border-purple-100 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-400">
            <Brain className="w-5 h-5" />
            AI & Specialized Services
          </CardTitle>
          <CardDescription>Advanced AI diagnostics and specialized healthcare services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <Button
              onClick={handleAIDiagnostics}
              variant="outline"
              className="h-20 flex-col gap-1 border-violet-200 text-violet-700 hover:bg-violet-50 dark:border-violet-700 dark:text-violet-400"
            >
              <Brain className="w-5 h-5" />
              <span className="text-xs">AI Diagnostics</span>
            </Button>

            <Button
              onClick={handleMentalHealth}
              variant="outline"
              className="h-20 flex-col gap-1 border-teal-200 text-teal-700 hover:bg-teal-50 dark:border-teal-700 dark:text-teal-400"
            >
              <Headphones className="w-5 h-5" />
              <span className="text-xs">Mental Health</span>
            </Button>

            <Button
              onClick={handleAnalytics}
              variant="outline"
              className="h-20 flex-col gap-1 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs">Analytics</span>
            </Button>

            <Button
              onClick={() => navigate('/pediatric-care')}
              variant="outline"
              className="h-20 flex-col gap-1 border-yellow-200 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-400"
            >
              <Baby className="w-5 h-5" />
              <span className="text-xs">Pediatric Care</span>
            </Button>

            <Button
              onClick={() => navigate('/geriatric-care')}
              variant="outline"
              className="h-20 flex-col gap-1 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400"
            >
              <UserCheck className="w-5 h-5" />
              <span className="text-xs">Geriatric Care</span>
            </Button>
          </div>
        </CardContent>
      </Card>

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
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => navigate('/communication-systems')}
              >
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
              <Button 
                size="sm" 
                variant="ghost"
                onClick={handleTeleconsult}
              >
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

        {/* System Management */}
        <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-500" />
              System Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div 
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={handleInsurance}
            >
              <CreditCard className="w-4 h-4 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Insurance & Claims</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Manage insurance verification</p>
              </div>
            </div>
            <div 
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => navigate('/tpa')}
            >
              <Briefcase className="w-4 h-4 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">TPA Management</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Third-party administration</p>
              </div>
            </div>
            <div 
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => navigate('/bio-waste-management')}
            >
              <Truck className="w-4 h-4 text-red-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Bio Waste Management</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Waste tracking & disposal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-500" />
            Recent Activity & Quick Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white">Recent Activities</h4>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Medication taken</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Lisinopril 10mg - 8:00 AM</p>
                </div>
              </div>
              <div 
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={handleLIMS}
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
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white">Advanced Features</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => navigate('/advanced-research-tools')}
                  variant="outline"
                  size="sm"
                  className="h-16 flex-col gap-1"
                >
                  <Database className="w-4 h-4" />
                  <span className="text-xs">Research Tools</span>
                </Button>
                <Button
                  onClick={() => navigate('/public-health-integration')}
                  variant="outline"
                  size="sm"
                  className="h-16 flex-col gap-1"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-xs">Public Health</span>
                </Button>
                <Button
                  onClick={() => navigate('/mobile-optimization')}
                  variant="outline"
                  size="sm"
                  className="h-16 flex-col gap-1"
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="text-xs">Mobile App</span>
                </Button>
                <Button
                  onClick={() => navigate('/emergency-medicine')}
                  variant="outline"
                  size="sm"
                  className="h-16 flex-col gap-1"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs">Emergency Medicine</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
