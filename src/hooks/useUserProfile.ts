/**
 * User Profile Hook
 * Provides easy access to user profile operations
 */

import { UserProfile, useAuth } from "@/contexts/AuthContext";
import {
  OnboardingData,
  ProfileUpdateData,
  userProfileService,
} from "@/services/userProfileService";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export interface UseUserProfileReturn {
  // Data
  profile: UserProfile | null;
  isLoading: boolean;
  isSaving: boolean;

  // Profile operations
  saveOnboardingData: (data: OnboardingData) => Promise<boolean>;
  updateProfile: (updates: ProfileUpdateData) => Promise<boolean>;
  refreshProfile: () => Promise<void>;

  // Status checks
  hasCompletedOnboarding: boolean;
  profileCompleteness: number;

  // Statistics
  healthScore: number;
  daysActive: number;

  // Error handling
  error: string | null;
  clearError: () => void;
}

export const useUserProfile = (): UseUserProfileReturn => {
  const { user, profile: authProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(authProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const [healthScore, setHealthScore] = useState(0);
  const [daysActive, setDaysActive] = useState(0);

  // Load profile data
  const loadProfile = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const profileData = await userProfileService.getUserProfile(user.id);
      setProfile(profileData);

      if (profileData) {
        setHasCompletedOnboarding(profileData.onboarding_completed);
      }

      // Load statistics
      const stats = await userProfileService.getUserProfileStats(user.id);
      setProfileCompleteness(stats.profileCompleteness);
      setHealthScore(stats.healthScore);
      setDaysActive(stats.daysActive);
    } catch (err) {
      console.error("Error loading profile:", err);
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Save onboarding data
  const saveOnboardingData = useCallback(
    async (data: OnboardingData): Promise<boolean> => {
      if (!user?.id) {
        setError("User not authenticated");
        return false;
      }

      setIsSaving(true);
      setError(null);

      try {
        const result = await userProfileService.saveOnboardingData(
          user.id,
          data
        );

        if (result.success) {
          await loadProfile(); // Refresh profile data
          toast.success("Profile saved successfully!");
          return true;
        } else {
          setError(result.error || "Failed to save profile");
          toast.error("Failed to save profile", {
            description: result.error || "Please try again",
          });
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to save profile";
        setError(errorMessage);
        toast.error("Failed to save profile", {
          description: errorMessage,
        });
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [user?.id, loadProfile]
  );

  // Update profile
  const updateProfile = useCallback(
    async (updates: ProfileUpdateData): Promise<boolean> => {
      if (!user?.id) {
        setError("User not authenticated");
        return false;
      }

      setIsSaving(true);
      setError(null);

      try {
        const result = await userProfileService.updateUserProfile(
          user.id,
          updates
        );

        if (result.success) {
          await loadProfile(); // Refresh profile data
          toast.success("Profile updated successfully!");
          return true;
        } else {
          setError(result.error || "Failed to update profile");
          toast.error("Failed to update profile", {
            description: result.error || "Please try again",
          });
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update profile";
        setError(errorMessage);
        toast.error("Failed to update profile", {
          description: errorMessage,
        });
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [user?.id, loadProfile]
  );

  // Refresh profile
  const refreshProfile = useCallback(async () => {
    await loadProfile();
  }, [loadProfile]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load profile on mount and when user changes
  useEffect(() => {
    if (user?.id) {
      loadProfile();
    } else {
      setProfile(null);
      setHasCompletedOnboarding(false);
      setProfileCompleteness(0);
      setHealthScore(0);
      setDaysActive(0);
    }
  }, [user?.id, loadProfile]);

  // Update local state when auth profile changes
  useEffect(() => {
    if (authProfile) {
      setProfile(authProfile);
      setHasCompletedOnboarding(authProfile.onboarding_completed);
    }
  }, [authProfile]);

  return {
    // Data
    profile,
    isLoading,
    isSaving,

    // Profile operations
    saveOnboardingData,
    updateProfile,
    refreshProfile,

    // Status checks
    hasCompletedOnboarding,
    profileCompleteness,

    // Statistics
    healthScore,
    daysActive,

    // Error handling
    error,
    clearError,
  };
};
