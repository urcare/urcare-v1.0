
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoConsultationInterface } from './VideoConsultationInterface';
import { RemoteMonitoringDashboard } from './RemoteMonitoringDashboard';
import { DigitalPrescriptionInterface } from './DigitalPrescriptionInterface';
import { RemoteDiagnosticTools } from './RemoteDiagnosticTools';
import { PatientEducationLibrary } from './PatientEducationLibrary';
import { TelehealthSchedulingInterface } from './TelehealthSchedulingInterface';
import { 
  Video,
  Activity,
  Pill,
  Stethoscope,
  BookOpen,
  Calendar,
  Users,
  Clock,
  TrendingUp,
  Shield
} from 'lucide-react';

export const TelemedicineDashboard = () => {
  const [activeTab, setActiveTab] = useState('video');
  const [telehealthMetrics, setTelehealthMetrics] = useState({
    activeConsultations: 12,
    todayAppointments: 48,
    remotePatients: 327,
    prescriptionsSent: 89,
    deviceConnections: 156,
    educationViews: 2341,
    patientSatisfaction: 96.7,
    systemUptime: 99.9
  });

  const telehealthTabs = [
    {
      id: 'video',
      title: 'Video Consultation',
      icon: Video,
      component: VideoConsultationInterface,
      description: 'HD video/audio consultations with virtual waiting rooms'
    },
    {
      id: 'monitoring',
      title: 'Remote Monitoring',
      icon: Activity,
      component: RemoteMonitoringDashboard,
      description: 'Real-time vital signs and chronic disease management'
    },
    {
      id: 'prescriptions',
      title: 'Digital Prescriptions',
      icon: Pill,
      component: DigitalPrescriptionInterface,
      description: 'E-prescribing with delivery tracking and adherence monitoring'
    },
    {
      id: 'diagnostics',
      title: 'Remote Diagnostics',
      icon: Stethoscope,
      component: RemoteDiagnosticTools,
      description: 'Medical device integration and clinical decision support'
    },
    {
      id: 'education',
      title: 'Patient Education',
      icon: BookOpen,
      component: PatientEducationLibrary,
      description: 'Interactive learning modules and progress tracking'
    },
    {
      id: 'scheduling',
      title: 'Telehealth Scheduling',
      icon: Calendar,
      component: TelehealthSchedulingInterface,
      description: 'Provider availability and automated appointment management'
    }
  ];

  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setTelehealthMetrics(prev => ({
        ...prev,
        activeConsultations: prev.activeConsultations + Math.floor(Math.random() * 3) - 1,
        educationViews: prev.educationViews + Math.floor(Math.random() * 10),
        patientSatisfaction: Math.min(100, prev.patientSatisfaction + (Math.random() - 0.5) * 0.1)
      }));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Video className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold">Telemedicine Platform</h1>
      </div>

      {/* Telemedicine Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{telehealthMetrics.activeConsultations}</div>
            <div className="text-sm text-gray-600">Active Calls</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{telehealthMetrics.todayAppointments}</div>
            <div className="text-sm text-gray-600">Today's Appointments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{telehealthMetrics.remotePatients}</div>
            <div className="text-sm text-gray-600">Remote Patients</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{telehealthMetrics.prescriptionsSent}</div>
            <div className="text-sm text-gray-600">Prescriptions Sent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-cyan-600">{telehealthMetrics.deviceConnections}</div>
            <div className="text-sm text-gray-600">Device Connections</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-indigo-600">{telehealthMetrics.educationViews}</div>
            <div className="text-sm text-gray-600">Education Views</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{telehealthMetrics.patientSatisfaction.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Satisfaction</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{telehealthMetrics.systemUptime.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">System Uptime</div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Status Alert */}
      {telehealthMetrics.systemUptime < 99 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Shield className="h-5 w-5" />
              Platform Performance Notice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-orange-700">
                <TrendingUp className="h-4 w-4" />
                <span>System performance monitoring in progress</span>
              </div>
              <div className="flex items-center gap-2 text-orange-700">
                <Users className="h-4 w-4" />
                <span>All consultations remain secure and HIPAA compliant</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Telemedicine Feature Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          {telehealthTabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {telehealthTabs.map((tab) => {
          const ComponentToRender = tab.component;
          return (
            <TabsContent key={tab.id} value={tab.id} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <tab.icon className="h-5 w-5" />
                    {tab.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{tab.description}</p>
                </CardHeader>
                <CardContent>
                  <ComponentToRender />
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};
