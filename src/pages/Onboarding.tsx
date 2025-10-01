import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { onboardingService, type OnboardingData } from "@/services/onboardingService";
import { SerialOnboarding } from "@/components/onboarding/SerialOnboarding";
import { AuthOptions } from "@/components/auth/AuthOptions";
import { toast } from "sonner";

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Check for admin mode (when coming from admin login)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const adminMode = urlParams.get('admin') === 'true';
    
    if (adminMode) {
      setIsAdminMode(true);
      setShowAuth(false);
    } else if (!user) {
      setShowAuth(true);
    } else {
      setShowAuth(false);
    }
  }, [user]);

  // Redirect if onboarding already completed
  useEffect(() => {
    if (profile?.onboarding_completed) {
      console.log("Onboarding already completed, redirecting to dashboard");
      navigate("/dashboard", { replace: true });
    }
  }, [profile, navigate]);

  const handleOnboardingComplete = async (data: OnboardingData) => {
    if (!isAdminMode && !user) {
      toast.error("User not found. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      console.log("Completing onboarding with data:", data);
      
      if (isAdminMode) {
        // For admin mode, just show success and redirect to dashboard
        toast.success("Onboarding completed successfully! (Admin Mode)");
        navigate("/dashboard", { replace: true });
      } else {
        // Normal flow - save onboarding data
        const result = await onboardingService.saveOnboardingData(user!, data);
        
        if (result.success) {
          toast.success("Onboarding completed successfully!");
          
          // Refresh profile to update the context
          await refreshProfile();
          
          // Navigate to dashboard
          navigate("/dashboard", { replace: true });
        } else {
          toast.error("Failed to save onboarding data", {
            description: result.error || "Please try again."
          });
        }
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast.error("Failed to complete onboarding", {
        description: error instanceof Error ? error.message : "Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  // Show auth popup if not authenticated
  if (showAuth) {
    return (
      <AuthOptions
        onboardingData={{}}
        onAuthSuccess={() => setShowAuth(false)}
      />
    );
  }

  // Show loading if checking auth state (but not in admin mode)
  if ((!isAdminMode && !user) || loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-app-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-logo-text border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Show onboarding form
    return (
        <SerialOnboarding
      onComplete={handleOnboardingComplete}
          onBack={() => navigate("/")}
        />
  );
};

export default Onboarding;
