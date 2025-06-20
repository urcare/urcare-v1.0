
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PatientLandingPage } from '@/components/landing/PatientLandingPage';

// Lazy load components
const Dashboard = React.lazy(() => import('@/components/Dashboard').then(module => ({ default: module.Dashboard })));
const Auth = React.lazy(() => import('@/pages/Auth'));
const Onboarding = React.lazy(() => import('@/pages/Onboarding'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const Unauthorized = React.lazy(() => import('@/pages/Unauthorized'));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<PatientLandingPage />} />
                <Route path="/landing" element={<PatientLandingPage />} />
                <Route path="/auth" element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                    <Auth />
                  </Suspense>
                } />
                <Route path="/unauthorized" element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                    <Unauthorized />
                  </Suspense>
                } />

                {/* Onboarding route */}
                <Route path="/onboarding" element={
                  <ProtectedRoute>
                    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                      <Onboarding />
                    </Suspense>
                  </ProtectedRoute>
                } />

                {/* Protected routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Layout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                        <Dashboard />
                      </Suspense>
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* 404 route */}
                <Route path="*" element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                    <NotFound />
                  </Suspense>
                } />
              </Routes>
            </div>
            <Toaster />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
