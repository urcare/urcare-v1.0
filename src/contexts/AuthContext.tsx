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

// Simple cache for user profiles
const profileCache = new Map<
  string,
  { profile: UserProfile; timestamp: number }
>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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
  setShowAdminPopup: (show: boolean) => void;
  setShowEmailSignupPopup: (show: boolean) => void;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithEmail: () => Promise<void>;
  signInWithEmailVerification: (email: string, password: string, fullName: string, city: string) => Promise<User | undefined>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  isOnboardingComplete: () => boolean;
  navigate: (path: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to create minimal profile
const createMinimalProfile = (user: User): UserProfile => ({
  id: user.id,
  full_name:
    user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
  onboarding_completed: false,
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showAdminPopup, setShowAdminPopup] = useState(false);
  const [showEmailSignupPopup, setShowEmailSignupPopup] = useState(false);

  // Track if auth listener is initialized
  const authListenerRef = useRef<boolean>(false);

  // Fetch user profile with caching
  const fetchUserProfile = useCallback(
    async (userId: string): Promise<UserProfile | null> => {
      try {
        // Check cache first
        const cached = profileCache.get(userId);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          return cached.profile;
        }

        const { data, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          console.warn("Profile fetch error:", error);
          return null;
        }

        const result = data as UserProfile;

        // Cache the result
        if (result) {
          profileCache.set(userId, {
            profile: result,
            timestamp: Date.now(),
          });
        }

        return result;
      } catch (error) {
        console.warn("Profile fetch failed:", error);
        return null;
      }
    },
    []
  );

  // Ensure user profile exists
  const ensureUserProfile = useCallback(async (user: User): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      // If profile doesn't exist, create it
      if (error && error.code === "PGRST116") {
        const { error: insertError } = await supabase
          .from("user_profiles")
          .insert([
            {
              id: user.id,
              full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
              onboarding_completed: false,
              status: "active",
            },
          ]);

        if (insertError) {
          console.warn("Profile creation failed:", insertError);
        } else {
          // Clear cache to force refresh
          profileCache.delete(user.id);
        }
      }
    } catch (error) {
      console.warn("Profile ensure failed:", error);
    }
  }, []);

  // Handle user authentication
  const handleUserAuth = useCallback(
    async (user: User | null) => {
      if (!user) {
        setUser(null);
        setProfile(null);
        profileCache.clear();
        return;
      }

      setUser(user);

      try {
        // Add timeout protection to prevent hanging (increased to 20s for better reliability)
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Profile fetch timeout')), 20000)
        );
        
        const profilePromise = Promise.all([
          ensureUserProfile(user),
          fetchUserProfile(user.id)
        ]);

        const [, userProfile] = await Promise.race([profilePromise, timeoutPromise]) as [void, UserProfile | null];

        if (userProfile) {
          // Safety check to ensure we don't set an error object as profile
          if (typeof userProfile === 'object' && ('success' in userProfile || 'error' in userProfile)) {
            const minimalProfile = createMinimalProfile(user);
            setProfile(minimalProfile);
          } else {
            setProfile(userProfile);
          }
        } else {
          const minimalProfile = createMinimalProfile(user);
          setProfile(minimalProfile);
        }
      } catch (error) {
        // Log errors for debugging in production
        console.error("Profile operations failed:", error);
        // Don't fail silently - this was causing white screens
        const minimalProfile = createMinimalProfile(user);
        // Safety check to ensure we don't set an error object as profile
        if (typeof minimalProfile === 'object' && ('success' in minimalProfile || 'error' in minimalProfile)) {
          // Create a basic profile as fallback
          const basicProfile = {
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
            onboarding_completed: true,
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
            workout_type: null,
            smoking: null,
            drinking: null,
            track_family: null,
            critical_conditions: null,
            has_health_reports: null,
            health_reports: null,
            referral_code: null,
            save_progress: null,
            preferences: null,
          } as UserProfile;
          setProfile(basicProfile);
        } else {
          setProfile(minimalProfile);
        }
      }
    },
    [fetchUserProfile, ensureUserProfile]
  );

  // Initialize auth state
  useEffect(() => {
    let mounted = true;
    let isInitializing = true;

    const initializeAuth = async () => {
      try {
        // In production, always check authentication
        // Only skip auth checks in development for truly public routes
        const isDevelopment = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && 
                             import.meta.env.DEV;
        const isOAuthCallback = window.location.pathname.includes('/auth/callback') || window.location.search.includes('code=');
        const isPublicRoute = window.location.pathname === '/' || 
                             window.location.pathname === '/legal' ||
                             window.location.pathname === '/admin-login' ||
                             window.location.pathname === '/my-admin' ||
                             window.location.pathname === '/admin-dashboard' ||
                             window.location.pathname === '/email-auth' ||
                             window.location.pathname === '/email-signin' ||
                             window.location.pathname === '/email-verification' ||
                             window.location.pathname === '/tasks-demo';
        
        // Remove development mode bypass - always check authentication
        // This was causing users to be logged out on localhost

        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        // Handle 403/401 auth errors by clearing session
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
            profileCache.clear();
          }
          return;
        }

        if (mounted) {
          await handleUserAuth(user);
        }
      } catch (error) {
        console.error("❌ Auth initialization failed:", error);
        // Don't clear session on auth errors - this was causing white screens
        // Only clear session on specific auth errors
        if (error instanceof Error && (
          error.message.includes('403') ||
          error.message.includes('401') ||
          error.message.includes('Forbidden') ||
          error.message.includes('Invalid JWT')
        )) {
          await supabase.auth.signOut();
          if (mounted) {
            setUser(null);
            setProfile(null);
            profileCache.clear();
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setIsInitialized(true);
          isInitializing = false;
        }
      }
    };

    // Set up auth state listener first
    if (!authListenerRef.current) {
      authListenerRef.current = true;

      // Set up auth listener for production and protected routes in development
      let subscription: any = null;
      const isDevelopment = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && 
                           import.meta.env.DEV;
      const isOAuthCallback = window.location.pathname.includes('/auth/callback') || window.location.search.includes('code=');
      const isPublicRoute = window.location.pathname === '/' || 
                           window.location.pathname === '/legal' ||
                           window.location.pathname === '/admin-login' ||
                           window.location.pathname === '/my-admin' ||
                           window.location.pathname === '/admin-dashboard' ||
                           window.location.pathname === '/email-auth' ||
                           window.location.pathname === '/email-signin' ||
                           window.location.pathname === '/email-verification' ||
                           window.location.pathname === '/tasks-demo';
      
      // Always set up auth listener - removed development mode bypass
      const {
        data: { subscription: authSubscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;

        // Skip auth state changes during initialization to prevent duplicate calls
        if (isInitializing) {
          return;
        }

        if (event === "SIGNED_IN") {
          await handleUserAuth(session?.user || null);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
          profileCache.clear();
        }
      });
      subscription = authSubscription;

      // Initialize auth after setting up listener
      initializeAuth();

      return () => {
        mounted = false;
        authListenerRef.current = false;
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    }

    return () => {
      mounted = false;
    };
  }, []); // Remove handleUserAuth from dependencies to prevent re-initialization

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
        // User will be redirected after email confirmation
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
      // Allow test user for development
      const isTest = email === 'test@urcare.com' && password === 'test123';
      
      if (isTest) {
        // Create a mock user for testing
        const mockUser = {
          id: 'test-user-id',
          email: 'test@urcare.com',
          user_metadata: { full_name: 'Test User' }
        } as User;
        setUser(mockUser);
        toast.success("Test login successful!");
        // Auth state change will handle redirect
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Login successful!");
      // Auth state change will handle redirect
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

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    try {
      if (isDevelopment()) {
        devUtils.log("Using development Google sign-in");
        await devAuthService.signInWithGoogle();
        return;
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Google sign-in failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to initialize Google sign-in";
      toast.error("Google sign-in failed", { description: errorMessage });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithApple = useCallback(async () => {
    setLoading(true);
    try {
      if (isDevelopment()) {
        devUtils.log("Using development Apple sign-in");
        await devAuthService.signInWithApple();
        return;
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Apple sign-in failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to initialize Apple sign-in";
      toast.error("Apple sign-in failed", { description: errorMessage });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithEmail = useCallback(async () => {
    setLoading(true);
    try {
      // Show email signup popup instead of admin popup
      setShowEmailSignupPopup(true);
    } catch (error) {
      console.error("Email sign-in error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to initialize email sign-in";
      toast.error("Email sign-in failed", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithEmailVerification = useCallback(async (email: string, password: string, fullName: string, city: string) => {
    setLoading(true);
    try {
      // Create user with email and password
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            city: city
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from("user_profiles")
          .upsert([
            {
              id: authData.user.id,
              full_name: fullName,
              email: email,
              city: city,
              onboarding_completed: false,
              status: "active"
            }
          ]);

        if (profileError) {
          console.error("Profile creation error:", profileError);
        }

        setUser(authData.user);
        toast.success("Account created successfully!");
        // Auth state change will handle redirect
        return authData.user;
      }
    } catch (error) {
      console.error("Email verification sign-in error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create account";
      toast.error("Account creation failed", { description: errorMessage });
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
      profileCache.clear();
      toast.success("Signed out successfully");

      // Redirect to landing page
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

  const refreshProfile = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Clear cache to force refresh
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

        // Clear cache and refresh
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

  const isOnboardingComplete = useCallback((): boolean => {
    return profile?.onboarding_completed ?? false;
  }, [profile]);

  // Navigation function that uses window.location for routing
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
      setShowAdminPopup,
      setShowEmailSignupPopup,
      setUser,
      setProfile,
      signUp,
      signIn,
      signOut,
      updateProfile,
      refreshProfile,
      signInWithGoogle,
      signInWithApple,
      signInWithEmail,
      signInWithEmailVerification,
      isOnboardingComplete,
      navigate,
    }),
    [
      user,
      profile,
      loading,
      isInitialized,
      showAdminPopup,
      showEmailSignupPopup,
      setShowAdminPopup,
      setShowEmailSignupPopup,
      setUser,
      setProfile,
      signUp,
      signIn,
      signOut,
      updateProfile,
      refreshProfile,
      signInWithGoogle,
      signInWithApple,
      signInWithEmail,
      signInWithEmailVerification,
      isOnboardingComplete,
      navigate,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <EmailSignupPopup
        isOpen={showEmailSignupPopup}
        onClose={() => setShowEmailSignupPopup(false)}
        onSuccess={(userData) => {
          // Handle successful email signup
          setShowEmailSignupPopup(false);
          // You can add additional logic here to handle the user data
        }}
        onNavigate={navigate}
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
