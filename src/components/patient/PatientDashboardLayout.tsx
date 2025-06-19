
import React, { useState } from 'react';
import { PatientSidebar } from './PatientSidebar';
import { PatientHeader } from './PatientHeader';
import { DashboardHome } from './dashboard/DashboardHome';
import { HealthRecordsHub } from './health-records/HealthRecordsHub';
import { AppointmentManagement } from './appointments/AppointmentManagement';
import { MedicationHub } from './medications/MedicationHub';
import { WellnessHub } from './wellness/WellnessHub';
import { EmergencyDashboard } from './emergency/EmergencyDashboard';
import { CommunityHub } from './community/CommunityHub';
import { FamilyCareHub } from './family/FamilyCareHub';
import { PatientProfile } from './profile/PatientProfile';
import { FloatingActionButton } from './components/FloatingActionButton';

type DashboardSection = 
  | 'home' 
  | 'health-records' 
  | 'appointments' 
  | 'medications' 
  | 'wellness' 
  | 'emergency' 
  | 'community' 
  | 'family' 
  | 'profile';

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
      case 'medications':
        return <MedicationHub />;
      case 'wellness':
        return <WellnessHub />;
      case 'emergency':
        return <EmergencyDashboard />;
      case 'community':
        return <CommunityHub />;
      case 'family':
        return <FamilyCareHub />;
      case 'profile':
        return <PatientProfile />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
      <div className="lg:ml-280">
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
