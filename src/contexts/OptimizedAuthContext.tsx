import { devUtils, isDevelopment } from "@/config/development";
import { supabase } from "@/integrations/supabase/client";
import { devAuthService } from "@/services/devAuthService";
import type { User } from "@supabase/supabase-js";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import EmailSignupPopup from "@/components/EmailSignupPopup";

// Enhanced cache with onboarding status
const profileCache = new Map<
  string,
  { 
    profile: UserProfile; 
    timestamp: number;
    onboardingStatus: {
      completed: boolean;
      checked: boolean;
      lastChecked: number;
    };
  }
>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const ONBOARDING_CHECK_DURATION = 5 * 60 * 1000; // 5 minutes for onboarding status

export interface UserProfile {
  id: string;
  full_name: string | null;
  age: number | null;
  date_of_birth: string | null;
  gender: string | null;
  unit_system: string | null;
  height_feet: string | null;
  height_inches: string | null;
  height_cm: string | null;
  weight_lb: string | null;
  weight_kg: string | null;
  wake_up_time: string | null;
  sleep_time: string | null;
  work_start: string | null;
  work_end: string | null;
  chronic_conditions: string[] | null;
  takes_medications: string | null;
  medications: string[] | null;
  has_surgery: string | null;
  surgery_details: string[] | null;
  health_goals: string[] | null;
  diet_type: string | null;
  blood_group: string | null;
  breakfast_time: string | null;
  lunch_time: string | null;
  dinner_time: string | null;
  workout_time: string | null;
  routine_flexibility: string | null;
  workout_type: string | null;
  smoking: string | null;
  drinking: string | null;
  track_family: string | null;
  critical_conditions: string | null;
  has_health_reports: string | null;
  health_reports: string[] | null;
  referral_code: string | null;
  save_progress: string | null;
  status: string;
  preferences: Record<string, unknown> | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isInitialized: boolean;
  showAdminPopup: boolean;
  showEmailSignupPopup: boolean;
  emailAuthMode: 'signup' | 'signin';
  // Cached onboarding status - checked once and stored
  onboardingStatus: {
    completed: boolean;
    checked: boolean;
    lastChecked: number;
  };
  setShowAdminPopup: (show: boolean) => void;
  setShowEmailSignupPopup: (show: boolean) => void;
  setEmailAuthMode: (mode: 'signup' | 'signin') => void;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithEmail: () => Promise<void>;
  signInWithEmailVerification: (email: string, password: string, fullName: string, city: string) => Promise<User | undefined>;
  signOut: () => Promise<void>;
  clearAuthData: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  // Optimized onboarding check - uses cached status
  isOnboardingComplete: () => boolean;
  // Force refresh onboarding status (only when needed)
  refreshOnboardingStatus: () => Promise<void>;
  navigate: (path: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to create minimal profile
const createMinimalProfile = (user: User): UserProfile => ({
  id: user.id,
  full_name:
    user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
  onboarding_completed: false, // Default to false for new users
  status: "active",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  age: null,
  date_of_birth: null,
  gender: null,
  unit_system: null,
  height_feet: null,
  height_inches: null,
  height_cm: null,
  weight_lb: null,
  weight_kg: null,
  wake_up_time: null,
  sleep_time: null,
  work_start: null,
  work_end: null,
  chronic_conditions: null,
  takes_medications: null,
  medications: null,
  has_surgery: null,
  surgery_details: null,
  health_goals: null,
  diet_type: null,
  blood_group: null,
  breakfast_time: null,
  lunch_time: null,
  dinner_time: null,
  workout_time: null,
  routine_flexibility: null,
  uses_wearable: null,
  wearable_type: null,
  track_family: null,
  share_progress: null,
  emergency_contact_name: null,
  emergency_contact_phone: null,
  critical_conditions: null,
  has_health_reports: null,
  health_reports: null,
  referral_code: null,
  save_progress: null,
  preferences: null,
});

export const OptimizedAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showAdminPopup, setShowAdminPopup] = useState(false);
  const [showEmailSignupPopup, setShowEmailSignupPopup] = useState(false);
  const [emailAuthMode, setEmailAuthMode] = useState<'signup' | 'signin'>('signup');
  
  // Cached onboarding status - checked once and stored
  const [onboardingStatus, setOnboardingStatus] = useState({
    completed: false,
    checked: false,
    lastChecked: 0,
  });

  // Track if auth listener is initialized
  const authListenerRef = useRef<boolean>(false);
  const isInitializingRef = useRef<boolean>(false);

  // SINGLE ONBOARDING CHECK - Called only once during auth
  const checkOnboardingStatus = useCallback(async (userId: string): Promise<boolean> => {
    try {
      // Check cache first
      const cached = profileCache.get(userId);
      if (cached && 
          cached.onboardingStatus.checked && 
          Date.now() - cached.onboardingStatus.lastChecked < ONBOARDING_CHECK_DURATION) {
        console.log("🎯 Using cached onboarding status:", cached.onboardingStatus.completed);
        return cached.onboardingStatus.completed;
      }

      console.log("🎯 Checking onboarding status for user:", userId);
      
      // Single database call to check onboarding status
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select("onboarding_completed")
        .eq("id", userId)
        .single();

      let isCompleted = false;

      if (profileData) {
        isCompleted = profileData.onboarding_completed || false;
        console.log("🎯 Onboarding status from user_profiles:", isCompleted);
      } else if (profileError && profileError.code === "PGRST116") {
        // Profile doesn't exist, check onboarding_profiles
        console.log("🎯 Profile not found, checking onboarding_profiles");
        const { data: onboardingData, error: onboardingError } = await supabase
          .from('onboarding_profiles')
          .select('onboarding_completed')
          .eq('user_id', userId)
          .single();

        if (onboardingData) {
          isCompleted = onboardingData.onboarding_completed || false;
          console.log("🎯 Onboarding status from onboarding_profiles:", isCompleted);
        } else {
          console.log("🎯 No onboarding data found, defaulting to false");
          isCompleted = false;
        }
      }

      // Update cache with onboarding status
      const existingCache = profileCache.get(userId);
      if (existingCache) {
        existingCache.onboardingStatus = {
          completed: isCompleted,
          checked: true,
          lastChecked: Date.now(),
        };
        profileCache.set(userId, existingCache);
      }

      // Update state
      setOnboardingStatus({
        completed: isCompleted,
        checked: true,
        lastChecked: Date.now(),
      });

      console.log("🎯 Final onboarding status:", isCompleted);
      return isCompleted;

    } catch (error) {
      console.error("🎯 Error checking onboarding status:", error);
      return false;
    }
  }, []);

  // Fetch user profile with caching and timeout
  const fetchUserProfile = useCallback(
    async (userId: string): Promise<UserProfile | null> => {
      try {
        // Check cache first
        const cached = profileCache.get(userId);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          return cached.profile;
        }

        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Profile fetch timeout')), 8000)
        );

        const profilePromise = supabase
          .from("user_profiles")
          .select("*")
          .eq("id", userId)
          .order("onboarding_completed", { ascending: false })
          .order("updated_at", { ascending: false })
          .limit(1);

        const { data, error } = await Promise.race([profilePromise, timeoutPromise]) as any;

        if (error) {
          console.warn("Profile fetch error:", error);
          return null;
        }

        // Get the first (most recent) profile from the array
        const result = data && data.length > 0 ? data[0] as UserProfile : null;

        // Cache the result
        if (result) {
          profileCache.set(userId, {
            profile: result,
            timestamp: Date.now(),
            onboardingStatus: {
              completed: result.onboarding_completed,
              checked: true,
              lastChecked: Date.now(),
            },
          });
        }

        return result;
      } catch (error) {
        if (error instanceof Error && error.message === 'Profile fetch timeout') {
          console.warn("Profile fetch timed out after 8 seconds:", error);
        } else {
          console.warn("Profile fetch failed:", error);
        }
        return null;
      }
    },
    []
  );

  // Handle user authentication - SINGLE ONBOARDING CHECK HERE
  const handleUserAuth = useCallback(
    async (user: User | null) => {
      if (!user) {
        setUser(null);
        setProfile(null);
        setOnboardingStatus({ completed: false, checked: false, lastChecked: 0 });
        profileCache.clear();
        return;
      }

      setUser(user);

      try {
        console.log("🎯 Starting user authentication for:", user.id);
        
        // SINGLE ONBOARDING CHECK - Only check once during auth
        const isOnboardingCompleted = await checkOnboardingStatus(user.id);
        
        // Fetch profile
        const userProfile = await fetchUserProfile(user.id);

        if (userProfile) {
          // Update profile with correct onboarding status
          userProfile.onboarding_completed = isOnboardingCompleted;
          setProfile(userProfile);
        } else {
          // Create minimal profile with correct onboarding status
          const minimalProfile = createMinimalProfile(user);
          minimalProfile.onboarding_completed = isOnboardingCompleted;
          setProfile(minimalProfile);
        }

        console.log("🎯 Authentication complete. Onboarding completed:", isOnboardingCompleted);

      } catch (error) {
        console.error("❌ Auth initialization failed:", error);
        
        // Fallback: create minimal profile with onboarding status
        const minimalProfile = createMinimalProfile(user);
        minimalProfile.onboarding_completed = false;
        setProfile(minimalProfile);
        setOnboardingStatus({ completed: false, checked: true, lastChecked: Date.now() });
      }
    },
    [fetchUserProfile, checkOnboardingStatus]
  );

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      if (isInitializingRef.current) return;
      isInitializingRef.current = true;
      
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        // Handle auth errors
        if (
          error &&
          (error.message?.includes("403") ||
            error.message?.includes("401") ||
            error.message?.includes("Forbidden"))
        ) {
          console.warn("Auth session expired, clearing session");
          await supabase.auth.signOut();
          if (mounted) {
            setUser(null);
            setProfile(null);
            setOnboardingStatus({ completed: false, checked: false, lastChecked: 0 });
            profileCache.clear();
          }
          return;
        }

        if (mounted) {
          await handleUserAuth(user);
        }
      } catch (error) {
        console.error("❌ Auth initialization failed:", error);
      } finally {
        if (mounted) {
          setLoading(false);
          setIsInitialized(true);
          isInitializingRef.current = false;
        }
      }
    };

    // Set up auth state listener
    if (!authListenerRef.current) {
      authListenerRef.current = true;

      const {
        data: { subscription: authSubscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;

        if (isInitializingRef.current) {
          return;
        }

        if (event === "SIGNED_IN") {
          await handleUserAuth(session?.user || null);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
          setOnboardingStatus({ completed: false, checked: false, lastChecked: 0 });
          profileCache.clear();
        }
      });

      // Initialize auth after setting up listener
      initializeAuth();

      return () => {
        mounted = false;
        authListenerRef.current = false;
        isInitializingRef.current = false;
        if (authSubscription) {
          authSubscription.unsubscribe();
        }
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  // Optimized onboarding check - uses cached status
  const isOnboardingComplete = useCallback((): boolean => {
    // Use cached onboarding status instead of profile
    if (onboardingStatus.checked) {
      return onboardingStatus.completed;
    }
    
    // Fallback to profile if cache not available
    return profile?.onboarding_completed ?? false;
  }, [onboardingStatus, profile]);

  // Force refresh onboarding status (only when needed)
  const refreshOnboardingStatus = useCallback(async () => {
    if (!user) return;
    
    console.log("🔄 Force refreshing onboarding status");
    await checkOnboardingStatus(user.id);
  }, [user, checkOnboardingStatus]);

  // Rest of the methods remain the same...
  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      setLoading(true);
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });

        if (error) throw error;

        toast.success(
          "Signup successful! Please check your email to confirm your account."
        );
      } catch (error) {
        console.error("Signup error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Signup failed";
        toast.error("Signup failed", { description: errorMessage });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Login successful!");
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      toast.error("Login failed", { description: errorMessage });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setProfile(null);
      setOnboardingStatus({ completed: false, checked: false, lastChecked: 0 });
      profileCache.clear();
      
      localStorage.removeItem('sb-lvnkpserdydhnqbigfbz-auth-token');
      sessionStorage.clear();
      
      toast.success("Signed out successfully");
      window.location.href = "/";
    } catch (error) {
      console.error("Signout error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Signout failed";
      toast.error("Signout failed", { description: errorMessage });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAuthData = useCallback(async () => {
    try {
      console.log("🧹 Clearing all authentication data...");
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setOnboardingStatus({ completed: false, checked: false, lastChecked: 0 });
      profileCache.clear();
      
      localStorage.removeItem('sb-lvnkpserdydhnqbigfbz-auth-token');
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
      console.log("✅ All authentication data cleared");
    } catch (error) {
      console.error("❌ Error clearing auth data:", error);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      profileCache.delete(user.id);
      const userProfile = await fetchUserProfile(user.id);
      setProfile(userProfile);
    } catch (error) {
      console.error("Error refreshing profile:", error);
    } finally {
      setLoading(false);
    }
  }, [user, fetchUserProfile]);

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>): Promise<void> => {
      if (!user) throw new Error("No user logged in");

      setLoading(true);
      try {
        const { error } = await supabase
          .from("user_profiles")
          .update(updates)
          .eq("id", user.id);

        if (error) throw error;

        profileCache.delete(user.id);
        await refreshProfile();
        toast.success("Profile updated successfully!");
      } catch (error) {
        console.error("Profile update error:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An error occurred while updating your profile.";
        toast.error("Profile update failed", { description: errorMessage });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [user, refreshProfile]
  );

  const navigate = useCallback((path: string) => {
    window.location.href = path;
  }, []);

  const value: AuthContextType = useMemo(
    () => ({
      user,
      profile,
      loading,
      isInitialized,
      showAdminPopup,
      showEmailSignupPopup,
      emailAuthMode,
      onboardingStatus,
      setShowAdminPopup,
      setShowEmailSignupPopup,
      setEmailAuthMode,
      setUser,
      setProfile,
      signUp,
      signIn,
      signOut,
      updateProfile,
      refreshProfile,
      isOnboardingComplete,
      refreshOnboardingStatus,
      navigate,
    }),
    [
      user,
      profile,
      loading,
      isInitialized,
      showAdminPopup,
      showEmailSignupPopup,
      emailAuthMode,
      onboardingStatus,
      setShowAdminPopup,
      setShowEmailSignupPopup,
      setEmailAuthMode,
      setUser,
      setProfile,
      signUp,
      signIn,
      signOut,
      updateProfile,
      refreshProfile,
      isOnboardingComplete,
      refreshOnboardingStatus,
      navigate,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <EmailSignupPopup
        key={emailAuthMode}
        isOpen={showEmailSignupPopup}
        onClose={() => setShowEmailSignupPopup(false)}
        onSuccess={(userData) => {
          setShowEmailSignupPopup(false);
        }}
        onNavigate={navigate}
        initialMode={emailAuthMode}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
