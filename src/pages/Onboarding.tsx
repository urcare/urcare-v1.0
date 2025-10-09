import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SerialOnboarding } from '@/components/onboarding/SerialOnboarding';
import { onboardingService } from '@/services/onboardingService';

const Onboarding = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Auth checks are now handled by RouteGuard

  const handleComplete = async (data: any) => {
    setLoading(true);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        console.log("💾 Saving onboarding data for user:", session.user.id);
        console.log("📊 Data being saved:", data);
        
        // Save onboarding data to database
        await onboardingService.saveOnboardingData(session.user.id, data);
        
        console.log("✅ Onboarding data saved successfully!");
        
        // Navigate to health assessment (next step in flow)
        navigate("/health-assessment", { replace: true });
      }
    } catch (error) {
      console.error("❌ Error saving onboarding data:", error);
      // Still navigate to health assessment even if save fails
      navigate("/health-assessment", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/welcome", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Saving your information...</p>
        </div>
      </div>
    );
  }

  return <SerialOnboarding onComplete={handleComplete} onBack={handleBack} />;
};

export default Onboarding;