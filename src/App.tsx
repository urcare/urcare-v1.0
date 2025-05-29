
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
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
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="auth" element={<Auth />} />
                <Route path="onboarding" element={<Onboarding />} />
                <Route path="profile" element={<ProfileManagement />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="documents" element={<Documents />} />
                <Route path="health-twin" element={<HealthTwin />} />
                <Route path="wellness" element={<Wellness />} />
                <Route path="emotional-health" element={<EmotionalHealth />} />
                <Route path="engagement" element={<Engagement />} />
                <Route path="content" element={<IntelligentContent />} />
                <Route path="emergency" element={<Emergency />} />
                <Route path="unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <Toaster />
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
