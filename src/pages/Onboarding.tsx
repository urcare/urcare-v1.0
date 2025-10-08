import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { onboardingService, type OnboardingData } from "@/services/onboardingService";
import { SerialOnboarding } from "@/components/onboarding/SerialOnboarding";
import { AuthOptions } from "@/components/auth/AuthOptions";
import { toast } from "sonner";

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, refreshProfile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      console.log("No user detected - redirecting to landing page");
      navigate("/", { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Check if onboarding already completed
  useEffect(() => {
    if (profile?.onboarding_completed) {
      console.log("Onboarding already completed - redirecting to dashboard");
      navigate("/dashboard", { replace: true });
    }
  }, [profile, navigate]);

  const handleOnboardingComplete = async (data: OnboardingData) => {
    if (!user) {
      toast.error("User not found. Please log in again.");
      navigate("/", { replace: true });
      return;
    }

    setLoading(true);

    try {
      console.log("Completing onboarding with data:", data);
      
      // Save onboarding data with authenticated user
      const result = await onboardingService.saveOnboardingData(user, data);
      
      if (result.success) {
        toast.success("Onboarding completed successfully!");
        
        // Refresh profile to update the context (with timeout handling)
        try {
          await refreshProfile();
        } catch (error) {
          console.warn("Profile refresh failed, but onboarding was successful:", error);
          // Continue with navigation even if profile refresh fails
        }
        
        // Redirect to health assessment after a short delay
        setTimeout(() => {
          navigate("/health-assessment", { replace: true });
        }, 1000);
      } else {
        console.error("Onboarding save failed:", result.error);
        toast.error("Failed to save onboarding data", {
          description: result.error || "Please try again."
        });
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

  // Show loading while auth is being checked or data is being saved
  if (authLoading || loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-app-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-logo-text border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">
            {authLoading ? "Checking authentication..." : "Saving your data and updating profile..."}
          </p>
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
