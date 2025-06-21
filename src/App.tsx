import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import AIDiagnostics from './pages/AIDiagnostics';
import ClinicalDecisionSupport from './pages/ClinicalDecisionSupport';
import MentalHealth from './pages/MentalHealth';
import GeriatricCare from './pages/GeriatricCare';
import LIMS from './pages/LIMS';
import ClinicalAnalytics from './pages/ClinicalAnalytics';
import PerformanceMonitoring from './pages/PerformanceMonitoring';
import Analytics from './pages/Analytics';

function App() {
  const isAuthenticated = localStorage.getItem('token');

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return <>{children}</>;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-diagnostics"
          element={
            <ProtectedRoute>
              <AIDiagnostics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clinical-decision-support"
          element={
            <ProtectedRoute>
              <ClinicalDecisionSupport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mental-health"
          element={
            <ProtectedRoute>
              <MentalHealth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/geriatric-care"
          element={
            <ProtectedRoute>
              <GeriatricCare />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lims"
          element={
            <ProtectedRoute>
              <LIMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clinical-analytics"
          element={
            <ProtectedRoute>
              <ClinicalAnalytics />
            </ProtectedRoute>
          }
        />
        
        {/* Phase 9: Performance Monitoring and Analytics */}
        <Route 
          path="/performance-monitoring" 
          element={
            <ProtectedRoute>
              <PerformanceMonitoring />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
