import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Onboarding from '@/pages/Onboarding';
import ProfileManagement from '@/pages/ProfileManagement';
import Appointments from '@/pages/Appointments';
import Documents from '@/pages/Documents';
import HealthTwin from '@/pages/HealthTwin';
import Wellness from '@/pages/Wellness';
import EmotionalHealth from '@/pages/EmotionalHealth';
import Engagement from '@/pages/Engagement';
import IntelligentContent from '@/pages/IntelligentContent';
import Emergency from '@/pages/Emergency';
import Community from '@/pages/Community';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';
import PatientJourney from '@/pages/PatientJourney';
import Ward from '@/pages/Ward';
import Pharmacy from '@/pages/Pharmacy';
import Billing from '@/pages/Billing';
import Insurance from '@/pages/Insurance';
import HRManagement from '@/pages/HRManagement';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Layout><Outlet /></Layout>}>
                <Route index element={<Index />} />
                <Route path="auth" element={<Auth />} />
                <Route path="onboarding" element={<Onboarding />} />
                <Route path="profile" element={<ProfileManagement />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="patient-journey" element={<PatientJourney />} />
                <Route path="ward" element={<Ward />} />
                <Route path="pharmacy" element={<Pharmacy />} />
                <Route path="billing" element={<Billing />} />
                <Route path="insurance" element={<Insurance />} />
                <Route path="hr-management" element={<HRManagement />} />
                <Route path="documents" element={<Documents />} />
                <Route path="health-twin" element={<HealthTwin />} />
                <Route path="wellness" element={<Wellness />} />
                <Route path="emotional-health" element={<EmotionalHealth />} />
                <Route path="engagement" element={<Engagement />} />
                <Route path="content" element={<IntelligentContent />} />
                <Route path="emergency" element={<Emergency />} />
                <Route path="community" element={<Community />} />
                <Route path="unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <Toaster />
          </AuthProvider>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
