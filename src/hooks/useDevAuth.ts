import { DEV_CONFIG, devUtils, isDevelopment } from "@/config/development";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

export const useDevAuth = () => {
  const auth = useAuth();
  const [devMode, setDevMode] = useState(false);
  const [devUser, setDevUser] = useState<any>(null);
  const [devProfile, setDevProfile] = useState<any>(null);

  useEffect(() => {
    if (isDevelopment()) {
      setDevMode(true);
      devUtils.log("Development mode enabled");

      // Auto-login in development if no user is present
      if (!auth.user && DEV_CONFIG.SETTINGS.autoLogin) {
        devUtils.log("Auto-logging in development user");
        setDevUser(DEV_CONFIG.DEV_USER);
        setDevProfile(DEV_CONFIG.DEV_PROFILE);
      }
    }
  }, [auth.user]);

  // Development authentication methods
  const devSignIn = () => {
    if (isDevelopment()) {
      devUtils.log("Signing in development user");
      setDevUser(DEV_CONFIG.DEV_USER);
      setDevProfile(DEV_CONFIG.DEV_PROFILE);
    }
  };

  const devSignOut = () => {
    if (isDevelopment()) {
      devUtils.log("Signing out development user");
      setDevUser(null);
      setDevProfile(null);
    }
  };

  const devRefreshProfile = () => {
    if (isDevelopment()) {
      devUtils.log("Refreshing development profile");
      setDevProfile({
        ...DEV_CONFIG.DEV_PROFILE,
        updated_at: new Date().toISOString(),
      });
    }
  };

  // Return development overrides or real auth
  return {
    // Development mode info
    isDevMode: devMode,

    // User data (dev override or real)
    user: devUser || auth.user,
    profile: devProfile || auth.profile,

    // Auth state (dev override or real)
    loading: devMode ? false : auth.loading,
    isInitialized: devMode ? true : auth.isInitialized,

    // Auth methods (dev override or real)
    signIn: devMode ? devSignIn : auth.signIn,
    signOut: devMode ? devSignOut : auth.signOut,
    signUp: auth.signUp,
    signInWithGoogle: auth.signInWithGoogle,
    signInWithApple: auth.signInWithApple,
    signInWithEmail: auth.signInWithEmail,
    refreshProfile: devMode ? devRefreshProfile : auth.refreshProfile,
    isOnboardingComplete: () => {
      if (devMode) return true;
      return auth.isOnboardingComplete();
    },

    // Development utilities
    devUtils: {
      toggleDevMode: () => setDevMode(!devMode),
      resetDevUser: () => {
        setDevUser(DEV_CONFIG.DEV_USER);
        setDevProfile(DEV_CONFIG.DEV_PROFILE);
      },
      updateDevProfile: (updates: any) => {
        setDevProfile({
          ...devProfile,
          ...updates,
          updated_at: new Date().toISOString(),
        });
      },
    },
  };
};
