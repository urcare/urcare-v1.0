import { devUtils, isDevelopment } from "@/config/development";
import { supabase } from "@/integrations/supabase/client";
import { devAuthService } from "@/services/devAuthService";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

// Cache for user profiles to avoid repeated database calls
const profileCache = new Map<string, { profile: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Track ongoing operations to prevent duplicates
const ongoingOperations = new Map<string, Promise<any>>();

// Global flag to prevent multiple auth listeners
let authListenerInitialized = false;

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
  uses_wearable: string | null;
  wearable_type: string | null;
  track_family: string | null;
  share_progress: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  critical_conditions: string | null;
  has_health_reports: string | null;
  health_reports: string[] | null;
  referral_code: string | null;
  save_progress: string | null;
  status: string;
  preferences: any;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  isInitialized: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithEmail: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  isOnboardingComplete: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Track last processed event to prevent duplicates (moved to component level)
  const lastProcessedEvent = React.useRef<{
    event: string;
    userId?: string;
    timestamp: number;
  } | null>(null);

  // Optimized profile fetching with caching and deduplication
  const fetchUserProfile = useCallback(
    async (userId: string): Promise<UserProfile | null> => {
      const ongoingKey = `fetch_${userId}`;
      try {
        console.log("fetchUserProfile: Starting fetch for userId:", userId);

        // Check if there's an ongoing operation for this user
        if (ongoingOperations.has(ongoingKey)) {
          console.log("fetchUserProfile: Using ongoing operation");
          return await ongoingOperations.get(ongoingKey);
        }

        // Check cache first
        const cached = profileCache.get(userId);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          console.log("fetchUserProfile: Using cached profile");
          return cached.profile;
        }

        console.log("fetchUserProfile: Fetching from database...");

        // Create the operation promise
        const operation = (async () => {
          try {
            const { data, error } = await supabase
              .from("user_profiles")
              .select("*")
              .eq("id", userId)
              .single();

            if (error) {
              console.log("fetchUserProfile: Database error:", error);
              return null;
            }
            const result = data as UserProfile;
            console.log(
              "fetchUserProfile: Successfully fetched profile:",
              result
            );

            // Cache the result
            if (result) {
              profileCache.set(userId, {
                profile: result,
                timestamp: Date.now(),
              });
            }

            return result;
          } finally {
            // Clean up the ongoing operation
            ongoingOperations.delete(ongoingKey);
          }
        })();

        // Store the ongoing operation
        ongoingOperations.set(ongoingKey, operation);

        return await operation;
      } catch (error) {
        console.warn(
          "fetchUserProfile: Profile fetch failed, continuing without profile:",
          error
        );
        // Clean up the ongoing operation
        ongoingOperations.delete(ongoingKey);
        // Return null to allow app to continue
        return null;
      }
    },
    []
  );

  // Optimized profile creation with deduplication
  const ensureUserProfile = useCallback(async (user: any) => {
    if (!user) return;

    const ongoingKey = `ensure_${user.id}`;
    try {
      console.log("ensureUserProfile: Starting for userId:", user.id);

      // Check if there's an ongoing operation for this user
      if (ongoingOperations.has(ongoingKey)) {
        console.log("ensureUserProfile: Using ongoing operation");
        return await ongoingOperations.get(ongoingKey);
      }

      // Create the operation promise
      const operation = (async () => {
        try {
          const result = await supabase
            .from("user_profiles")
            .select("id")
            .eq("id", user.id)
            .single();

          console.log("ensureUserProfile: Profile check result:", result);

          if (result.error && result.error.code !== "PGRST116") {
            console.log("ensureUserProfile: Profile exists, returning");
            return;
          }

          if (!result.data) {
            console.log("ensureUserProfile: Creating new profile...");
            // Create minimal profile record
            const { error: insertError } = await supabase.from("user_profiles").insert([
              {
                id: user.id,
                full_name: user.user_metadata?.full_name || user.email,
                onboarding_completed: false,
                status: "active",
              },
            ]);

            if (!insertError) {
              console.log("ensureUserProfile: Profile created successfully");
              // Clear cache to force refresh
              profileCache.delete(user.id);
            } else {
              console.warn(
                "ensureUserProfile: Profile creation failed:",
                insertError
              );
            }
          }
        } finally {
          // Clean up the ongoing operation
          ongoingOperations.delete(ongoingKey);
        }
      })();

      // Store the ongoing operation
      ongoingOperations.set(ongoingKey, operation);

      return await operation;
    } catch (error) {
      console.warn("Profile ensure failed, continuing:", error);
      // Clean up the ongoing operation
      ongoingOperations.delete(ongoingKey);
      // Ignore errors and allow app to continue
    }
  }, []);

  // Initialize auth state with optimized loading
  useEffect(() => {
    let mounted = true;
    const initializeAuth = async () => {
      setLoading(true);
      try {
        // Get user without timeout to allow natural completion
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (mounted) {
          setUser(user);
          if (user) {
            // Set minimal profile first, then try to fetch real profile
            const minimalProfile = {
              id: user.id,
              full_name:
                user.user_metadata?.full_name ||
                user.email?.split("@")[0] ||
                "User",
              onboarding_completed: false,
              status: "active",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            } as UserProfile;
            setProfile(minimalProfile);

            // Try to fetch real profile in background
            try {
              await ensureUserProfile(user);
              const realProfile = await fetchUserProfile(user.id);
              if (realProfile) {
                setProfile(realProfile);
              }
            } catch (error) {
              console.warn(
                "Profile operations failed during initialization, keeping minimal profile:",
                error
              );
              // Keep the minimal profile that was already set
            }
          } else {
            setProfile(null);
          }
        }
      } catch (error) {
        console.warn(
          "Auth initialization failed, continuing with minimal state:",
          error
        );
        // Set minimal state to allow app to continue
        if (mounted) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setIsInitialized(true);
        }
      }
    };

    initializeAuth();

    // Optimized auth state listener with duplicate prevention
    if (!authListenerInitialized) {
      authListenerInitialized = true;
      const { data: listener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log("AuthContext: Auth state change", {
            event,
            userId: session?.user?.id,
          });
          if (!mounted) return;

          // Prevent duplicate processing of the same event for the same user
          const currentEvent = {
            event,
            userId: session?.user?.id,
            timestamp: Date.now(),
          };

          if (
            lastProcessedEvent.current &&
            lastProcessedEvent.current.event === event &&
            lastProcessedEvent.current.userId === currentEvent.userId &&
            currentEvent.timestamp - lastProcessedEvent.current.timestamp < 5000
          ) {
            // 5 second debounce
            console.log("AuthContext: Skipping duplicate event", currentEvent);
            return;
          }

          lastProcessedEvent.current = currentEvent;

          if (session?.user) {
            console.log(
              "AuthContext: User signed in, setting user and fetching profile"
            );
            setUser(session.user);

            // Only process profile operations for SIGNED_IN events or first INITIAL_SESSION
            const shouldProcessProfile =
              event === "SIGNED_IN" ||
              (event === "INITIAL_SESSION" &&
                (!user || user.id !== session.user.id));

            if (shouldProcessProfile) {
              // Run profile operations with better error handling
              try {
                console.log("AuthContext: Starting profile operations...");

                // Set a minimal profile immediately to prevent hanging
                const minimalProfile = {
                  id: session.user.id,
                  full_name:
                    session.user.user_metadata?.full_name ||
                    session.user.email?.split("@")[0] ||
                    "User",
                  onboarding_completed: false,
                  status: "active",
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                } as UserProfile;
                console.log(
                  "AuthContext: Setting minimal profile immediately:",
                  minimalProfile
                );
                setProfile(minimalProfile);

                // Try to ensure profile exists first, then fetch it
                try {
                  await ensureUserProfile(session.user);
                  const profileResult = await fetchUserProfile(session.user.id);

                  if (profileResult) {
                    console.log(
                      "AuthContext: Profile operations completed, updating with real profile:",
                      profileResult
                    );
                    setProfile(profileResult);
                  } else {
                    console.log(
                      "AuthContext: Profile operations completed, keeping minimal profile"
                    );
                  }
                } catch (profileError) {
                  console.warn(
                    "AuthContext: Profile operations failed, keeping minimal profile:",
                    profileError
                  );
                  // Keep the minimal profile that was already set
                }
              } catch (error) {
                console.warn(
                  "Profile operations failed in auth state change, keeping minimal profile:",
                  error
                );
                // Minimal profile is already set above, so we just continue
              }
            } else {
              console.log(
                "AuthContext: Skipping profile operations for event:",
                event
              );
            }

            // Ensure loading is false and initialized is true after successful auth
            console.log(
              "AuthContext: Setting loading=false, isInitialized=true"
            );
            setLoading(false);
            setIsInitialized(true);
          } else {
            console.log("AuthContext: User signed out, clearing state");
            setUser(null);
            setProfile(null);
            // Clear cache on logout
            profileCache.clear();
            // Clear ongoing operations
            ongoingOperations.clear();
            // Ensure loading is false and initialized is true after logout
            setLoading(false);
            setIsInitialized(true);
          }
        }
      );

      return () => {
        mounted = false;
        authListenerInitialized = false;
        listener?.subscription?.unsubscribe();
      };
    } else {
      return () => {
        mounted = false;
      };
    }
  }, [fetchUserProfile, ensureUserProfile, user]);

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.signUp({
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
      } catch (error: any) {
        console.error("Signup error:", error);
        toast.error("Signup failed", { description: error.message });
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success("Login successful!");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Login failed", { description: error.message });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    console.log("signInWithGoogle called");
    setLoading(true);
    try {
      if (isDevelopment()) {
        devUtils.log("Using development Google sign-in");
        await devAuthService.signInWithGoogle();
        return;
      }

      console.log("Calling supabase.auth.signInWithOAuth for Google");

      // Use a simpler approach that works better
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

      if (error) {
        console.error("OAuth error:", error);
        throw error;
      }

      console.log("OAuth initiated successfully:", data);

      // The redirect should happen automatically
      // If we get a URL, it means we need to redirect manually
      if (data?.url) {
        console.log("Redirecting to OAuth URL:", data.url);
        window.location.href = data.url;
      }
    } catch (error: any) {
      setLoading(false);
      console.error("Google sign-in failed:", error);
      toast.error("Google sign-in failed", {
        description: error.message || "Failed to initialize Google sign-in",
      });
      throw error;
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

      console.log("Calling supabase.auth.signInWithOAuth for Apple");

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

      if (error) {
        console.error("Apple OAuth error:", error);
        throw error;
      }

      console.log("Apple OAuth initiated successfully:", data);

      // The redirect should happen automatically
      // If we get a URL, it means we need to redirect manually
      if (data?.url) {
        console.log("Redirecting to Apple OAuth URL:", data.url);
        window.location.href = data.url;
      }
    } catch (error: any) {
      setLoading(false);
      console.error("Apple sign-in failed:", error);
      toast.error("Apple sign-in failed", {
        description: error.message || "Failed to initialize Apple sign-in",
      });
      throw error;
    }
  }, []);

  const signInWithEmail = useCallback(async () => {
    setLoading(true);
    try {
      // For now, we'll use a simple email/password form approach
      // This could be enhanced with a modal or separate page
      toast.info("Email sign-in feature coming soon!");
      // You can implement a modal or redirect to email sign-in page here
    } catch (error: any) {
      console.error("Email sign-in error:", error);
      toast.error("Email sign-in failed", {
        description: error.message || "Failed to initialize email sign-in",
      });
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
      // Clear cache on logout
      profileCache.clear();
      toast.success("Signed out successfully");

      // Immediately redirect to landing page
      window.location.href = "/";
    } catch (error: any) {
      console.error("Signout error:", error);
      toast.error("Signout failed", { description: error.message });
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
      const profile = await fetchUserProfile(user.id);
      setProfile(profile);
      console.log("AuthContext: Profile refreshed", { profile });
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
      } catch (error: any) {
        console.error("Profile update error:", error);
        toast.error("Profile update failed", {
          description:
            error.message || "An error occurred while updating your profile.",
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [user, refreshProfile]
  );

  const isOnboardingComplete = useCallback((): boolean => {
    if (!profile) {
      console.log("isOnboardingComplete: No profile found");
      return false;
    }
    return !!profile.onboarding_completed;
  }, [profile]);

  const value: AuthContextType = useMemo(
    () => ({
      user,
      profile,
      loading,
      isInitialized,
      signUp,
      signIn,
      signOut,
      updateProfile,
      refreshProfile,
      signInWithGoogle,
      signInWithApple,
      signInWithEmail,
      isOnboardingComplete,
    }),
    [
      user,
      profile,
      loading,
      isInitialized,
      signUp,
      signIn,
      signOut,
      updateProfile,
      refreshProfile,
      signInWithGoogle,
      signInWithApple,
      signInWithEmail,
      isOnboardingComplete,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
