
import React, { useState } from 'react';
import { PatientSidebar } from './PatientSidebar';
import { PatientHeader } from './PatientHeader';
import { DashboardHome } from './dashboard/DashboardHome';
import { HealthRecordsHub } from './health-records/HealthRecordsHub';
import { AppointmentManagement } from './appointments/AppointmentManagement';
import { MedicationHub } from './medications/MedicationHub';
import { WellnessHub } from './wellness/WellnessHub';
import { EmergencyDashboard } from '../emergency/EmergencyDashboard';
import { CommunityHub } from './community/CommunityHub';
import { FamilyCareHub } from './family/FamilyCareHub';
import { PatientProfile } from './profile/PatientProfile';
import { FloatingActionButton } from './components/FloatingActionButton';

type DashboardSection = 
  | 'home' 
  | 'health-records' 
  | 'appointments' 
  | 'teleconsult'
  | 'medications' 
  | 'wellness' 
  | 'emergency' 
  | 'community' 
  | 'family' 
  | 'profile';

// Placeholder components for missing sections
const TeleconsultHub = () => (
  <div className="p-6 text-center">
    <h2 className="text-2xl font-bold mb-4">Teleconsultation Hub</h2>
    <p className="text-gray-600">Video consultation features coming soon...</p>
  </div>
);

export const PatientDashboardLayout = () => {
  const [activeSection, setActiveSection] = useState<DashboardSection>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <DashboardHome />;
      case 'health-records':
        return <HealthRecordsHub />;
      case 'appointments':
        return <AppointmentManagement />;
      case 'teleconsult':
        return <TeleconsultHub />;
      case 'medications':
        return <MedicationHub />;
      case 'wellness':
        return <WellnessHub />;
      case 'emergency':
        return <EmergencyDashboard />;
      case 'community':
        return <CommunityHub />;
      case 'family':
        return <Famil***areHub />;
      case 'profile':
        return <PatientProfile />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <PatientSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="lg:ml-80">
        <PatientHeader
          activeSection={activeSection}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
};
