import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSafariMobileFix } from "./hooks/useSafariMobileFix";
import { AuthProvider } from "./contexts/AuthContext";
import RouteGuard from "./components/RouteGuard";
import { App as CapApp } from '@capacitor/app';
import { Browser } from '@capacitor/browser';

// Import commonly used pages directly to avoid loading screens
import Landing from "./pages/Landing";
import Welcome from "./pages/Welcome";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import AuthCallback from "./pages/AuthCallback";

// Keep less frequently used pages as lazy loaded
const HealthAssessment = React.lazy(() => import("./pages/HealthAssessment"));
const Paywall = React.lazy(() => import("./pages/Paywall"));
const PaymentSuccess = React.lazy(() => import("./pages/PaymentSuccess"));
const PaymentMonthly = React.lazy(() => import("./pages/PaymentMonthly"));
const PaymentAnnual = React.lazy(() => import("./pages/PaymentAnnual"));
const AdminPayments = React.lazy(() => import("./pages/AdminPayments"));
const Legal = React.lazy(() => import("./pages/Legal"));

function App() {
  useSafariMobileFix();

  useEffect(() => {
    // Handle deep links from OAuth redirects
    // Support both custom scheme (urcare://) and HTTPS scheme
    const handleAppUrlOpen = async ({ url }: { url: string }) => {
      console.log('🔗 App URL opened:', url);
      
      try {
        // Close browser if still open - this is critical for OAuth flow
        try {
          await Browser.close();
          console.log('✅ Browser closed successfully');
        } catch (e) {
          // Browser might already be closed, ignore error
          console.log('⚠️ Browser close attempt (might already be closed):', e);
        }

        // Small delay to ensure browser is fully closed
        await new Promise(resolve => setTimeout(resolve, 200));

        // Handle custom scheme: urcare://auth/callback?...
        if (url.includes('urcare://auth/callback') || url.includes('urcare://auth/callback?')) {
          // Parse custom scheme URL manually
          const callbackPart = url.split('urcare://auth/callback')[1] || '';
          const hashIndex = callbackPart.indexOf('#');
          const queryIndex = callbackPart.indexOf('?');
          
          // Extract hash and query params
          let hash = '';
          let search = '';
          
          if (hashIndex !== -1) {
            hash = callbackPart.substring(hashIndex);
          } else if (queryIndex !== -1) {
            search = callbackPart.substring(queryIndex);
          }
          
          // Build the callback URL with hash and query params
          let callbackUrl = '/auth/callback';
          if (hash) callbackUrl += hash;
          if (search && !hash) callbackUrl += search;
          
          console.log('🔗 Navigating to callback (custom scheme):', callbackUrl);
          window.location.href = callbackUrl;
          return;
        }

        // Handle HTTPS scheme: https://urrcare.vercel.app/auth/callback?...
        if (url.includes('https://urrcare.vercel.app/auth/callback') || 
            url.includes('urrcare.vercel.app/auth/callback')) {
          let hash = '';
          let search = '';
          
          try {
            const urlObj = new URL(url);
            hash = urlObj.hash;
            search = urlObj.search;
          } catch (e) {
            // If URL parsing fails, try manual extraction
            const hashMatch = url.match(/#[^?]*/);
            const queryMatch = url.match(/\?[^#]*/);
            if (hashMatch) hash = hashMatch[0];
            if (queryMatch) search = queryMatch[0];
          }
          
          let callbackUrl = '/auth/callback';
          if (hash) callbackUrl += hash;
          if (search) callbackUrl += search;
          
          console.log('🔗 Navigating to callback (HTTPS scheme):', callbackUrl);
          window.location.href = callbackUrl;
          return;
        }
      } catch (error) {
        console.error('Error handling app URL open:', error);
        // Fallback: try to navigate to callback anyway
        try {
          window.location.href = '/auth/callback';
        } catch (e) {
          console.error('Failed to navigate to callback:', e);
        }
      }
    };

    // Listen for app URL opens (deep links)
    CapApp.addListener('appUrlOpen', handleAppUrlOpen);
    
    // Also check if app was opened with a URL (for when app is already running)
    CapApp.getLaunchUrl().then(({ url }) => {
      if (url) {
        console.log('🔗 Launch URL detected:', url);
        handleAppUrlOpen({ url });
      }
    }).catch(() => {
      // No launch URL, that's fine
    });

    return () => {
      CapApp.removeAllListeners();
    };
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-app-bg">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-logo-text border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-text-secondary">Loading...</p>
            </div>
          </div>
        }>
          <Routes>
            {/* Public routes - no auth required */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/legal" element={<Legal />} />
            
            {/* Protected routes - auth required with routing logic */}
            <Route path="/onboarding" element={
              <RouteGuard>
                <Onboarding />
              </RouteGuard>
            } />
            <Route path="/health-assessment" element={
              <RouteGuard>
                <HealthAssessment />
              </RouteGuard>
            } />
            <Route path="/paywall" element={
              <RouteGuard>
                <Paywall />
              </RouteGuard>
            } />
            <Route path="/payment-success" element={
              <RouteGuard>
                <PaymentSuccess />
              </RouteGuard>
            } />
            <Route path="/payment/monthly" element={
              <RouteGuard requireAuth={false}>
                <PaymentMonthly />
              </RouteGuard>
            } />
            <Route path="/payment/annual" element={
              <RouteGuard requireAuth={false}>
                <PaymentAnnual />
              </RouteGuard>
            } />
            <Route path="/admin/payments" element={
              <RouteGuard>
                <AdminPayments />
              </RouteGuard>
            } />
            <Route path="/dashboard" element={
              <RouteGuard>
                <Dashboard />
              </RouteGuard>
            } />
            
            {/* Fallback to landing */}
            <Route path="*" element={<Landing />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;