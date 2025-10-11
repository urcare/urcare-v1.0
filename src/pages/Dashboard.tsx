import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Bell, Mic, Paperclip, Activity } from "lucide-react";
import { toast } from "sonner";
import TodaySchedule from "@/components/TodaySchedule";
import FloatingChat from "@/components/FloatingChat";
import ErrorBoundary from "@/components/ErrorBoundary";
import { getOrCalculateHealthAnalysis } from "@/services/healthScoreService";
import { generateHealthPlans } from "@/services/healthPlanService";
import { generatePlanActivities, fetchDailyActivities } from "@/services/planActivitiesService";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState<any>(null);
  const [healthScore, setHealthScore] = useState<number>(75);
  const [healthLoading, setHealthLoading] = useState(false);
  const [userInput, setUserInput] = useState<string>('');
  const [planGenerating, setPlanGenerating] = useState(false);
  const [generatedPlans, setGeneratedPlans] = useState<any[]>([]);
  const [showPlans, setShowPlans] = useState(false);
  const [generatedActivities, setGeneratedActivities] = useState<any[]>([]);
  const [activitiesGenerating, setActivitiesGenerating] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [planSelectionLoading, setPlanSelectionLoading] = useState(false);
  const [currentPlanName, setCurrentPlanName] = useState<string>('Generate Your Protocol');
  const [isInitializing, setIsInitializing] = useState(false);

  // Debug activities state changes
  useEffect(() => {
    console.log("🎯 Activities state changed:", {
      length: generatedActivities?.length,
      activities: generatedActivities,
      hasActivities: generatedActivities && generatedActivities.length > 0
    });
  }, [generatedActivities]);


  // Fetch saved daily activities
  const fetchSavedActivities = useCallback(async (userId: string) => {
    try {
      console.log('🔍 Fetching saved daily activities for user:', userId);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Activities fetch timeout')), 15000)
      );
      
      const activitiesPromise = fetchDailyActivities(userId);
      const result = await Promise.race([activitiesPromise, timeoutPromise]) as any;
      
      if (result.success && result.data) {
        console.log('✅ Saved activities loaded:', result.data.schedule?.length);
        console.log('📊 Saved activities data:', result.data.schedule);
        const activities = result.data.schedule || [];
        setGeneratedActivities(activities);
        console.log('🎯 Activities state updated:', activities.length);
      } else {
        console.log('ℹ️ No saved activities found');
        setGeneratedActivities([]); // Ensure state is cleared
      }
    } catch (error) {
      console.error('❌ Error fetching saved activities:', error);
      setGeneratedActivities([]); // Ensure state is cleared on error
    }
  }, []);

  // Fetch current plan name from database
  const fetchCurrentPlanName = useCallback(async (userId: string) => {
    try {
      console.log('🔍 Fetching current plan name for user:', userId);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Plan name fetch timeout')), 10000)
      );
      
      const planPromise = supabase
        .from('health_plans')
        .select('plan_name')
        .eq('user_id', userId)
        .eq('status', 'selected')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      const { data, error } = await Promise.race([planPromise, timeoutPromise]) as any;
      
      if (error) {
        console.log('ℹ️ No plan found or error:', error.message);
        setCurrentPlanName('Generate Your Protocol');
      } else if (data && data.plan_name) {
        console.log('✅ Current plan name found:', data.plan_name);
        setCurrentPlanName(data.plan_name);
      } else {
        setCurrentPlanName('Generate Your Protocol');
      }
    } catch (error) {
      console.error('❌ Error fetching current plan name:', error);
      setCurrentPlanName('Generate Your Protocol');
    }
  }, []);

  // Fetch health data
  const fetchHealthData = useCallback(async (userId: string) => {
    try {
      setHealthLoading(true);
      console.log('🔍 Fetching health data for user:', userId);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Health data fetch timeout')), 20000)
      );
      
      const healthPromise = getOrCalculateHealthAnalysis(userId);
      const result = await Promise.race([healthPromise, timeoutPromise]) as any;
      
      if (result.success && result.data) {
        console.log('✅ Health data loaded:', result.data);
        setHealthData(result.data);
        setHealthScore(result.data.healthScore || 75);
        
        // Store in localStorage for other components
        localStorage.setItem('aiHealthData', JSON.stringify({
          healthScoreAnalysis: result.data.analysis,
          healthScoreRecommendations: result.data.recommendations,
          healthScore: result.data.healthScore,
          displayAnalysis: result.data.displayAnalysis
        }));
      } else {
        console.warn('⚠️ Failed to fetch health data:', result.error);
        // Set fallback health score
        setHealthScore(75);
      }
    } catch (error) {
      console.error('❌ Error fetching health data:', error);
      // Set fallback health score on error
      setHealthScore(75);
    } finally {
      setHealthLoading(false);
    }
  }, []);

  // Check authentication and load data
  useEffect(() => {
    const checkAuth = async () => {
      // Prevent multiple simultaneous initializations
      if (isInitializing) return;
      
      // Set a maximum loading time to prevent infinite loading
      const maxLoadingTime = setTimeout(() => {
        console.warn('⚠️ Dashboard loading timeout - forcing completion');
        setLoading(false);
        setIsInitializing(false);
      }, 10000); // 10 seconds max
      
      try {
        setIsInitializing(true);
        console.log('🔍 Starting dashboard initialization...');
        
        console.log('🔍 Getting user session...');
        
        let session = null;
        try {
          // Add timeout to getSession to prevent hanging
          const sessionTimeout = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Session fetch timeout')), 5000)
          );
          
          const sessionPromise = supabase.auth.getSession();
          const { data: { session: sessionData } } = await Promise.race([sessionPromise, sessionTimeout]) as any;
          session = sessionData;
          console.log('✅ User session loaded');
        } catch (error) {
          console.warn('⚠️ Session fetch failed, redirecting to landing page:', error.message);
          navigate("/", { replace: true });
          return;
        }
        
        if (!session?.user) {
          console.log("No user detected - redirecting to landing page");
          navigate("/", { replace: true });
          return;
        }

        setUser(session.user);

        // Fetch user profile with timeout (only if we have a user)
        if (session?.user) {
          try {
            const profilePromise = supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            const profileTimeout = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
            );
            
            const { data: profileData, error: profileError } = await Promise.race([
              profilePromise,
              profileTimeout
            ]) as any;

            if (profileError) {
              console.error("Error fetching profile:", profileError);
            } else {
              setProfile(profileData);
              console.log('✅ Profile loaded');
            }
          } catch (error) {
            console.error("Profile fetch error:", error);
          }
        }

        // Fetch onboarding profile data with timeout (only if we have a user)
        if (session?.user) {
          try {
            const onboardingPromise = supabase
              .from('onboarding_profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single();
            
            const onboardingTimeout = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Onboarding fetch timeout')), 10000)
            );
            
            const { data: onboardingData, error: onboardingError } = await Promise.race([
              onboardingPromise,
              onboardingTimeout
            ]) as any;

            if (onboardingError) {
              console.error("Error fetching onboarding profile:", onboardingError);
            } else {
              console.log("✅ Onboarding profile loaded:", onboardingData);
              if (onboardingData) {
                localStorage.setItem('onboardingProfile', JSON.stringify(onboardingData));
              }
            }
          } catch (error) {
            console.error("Onboarding fetch error:", error);
          }
        }

        // Fetch health data, saved activities, and current plan name with individual error handling
        if (session?.user?.id) {
          console.log('🔍 Starting health data fetch...');
          try {
            await fetchHealthData(session.user.id);
            console.log('✅ Health data loaded');
          } catch (error) {
            console.error('❌ Health data fetch failed:', error);
          }
          
          console.log('🔍 Starting activities fetch...');
          try {
            await fetchSavedActivities(session.user.id);
            console.log('✅ Activities loaded');
          } catch (error) {
            console.error('❌ Activities fetch failed:', error);
          }
          
          console.log('🔍 Starting plan name fetch...');
          try {
            await fetchCurrentPlanName(session.user.id);
            console.log('✅ Plan name loaded');
          } catch (error) {
            console.error('❌ Plan name fetch failed:', error);
          }
        }
        
        console.log('✅ Dashboard initialization completed');
      } catch (error) {
        console.error("Auth check error:", error);
        // Don't redirect on error, just show the dashboard with fallback data
        // Set fallback values to ensure dashboard loads
        setHealthScore(75);
        setCurrentPlanName('Generate Your Protocol');
        setGeneratedActivities([]);
      } finally {
        clearTimeout(maxLoadingTime);
        setLoading(false);
        setIsInitializing(false);
      }
    };
    
    checkAuth();
  }, [fetchHealthData, fetchSavedActivities, fetchCurrentPlanName]); // Include necessary dependencies

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Handle refresh without causing infinite loops
  const handleRefresh = useCallback(async () => {
    if (isInitializing || loading) return;
    
    try {
      setLoading(true);
      console.log('🔄 Refreshing dashboard data...');
      
      if (user?.id) {
        // Refresh data with individual error handling
        try {
          await fetchHealthData(user.id);
        } catch (error) {
          console.error('❌ Health data refresh failed:', error);
        }
        
        try {
          await fetchSavedActivities(user.id);
        } catch (error) {
          console.error('❌ Activities refresh failed:', error);
        }
        
        try {
          await fetchCurrentPlanName(user.id);
        } catch (error) {
          console.error('❌ Plan name refresh failed:', error);
        }
      }
      
      console.log('✅ Dashboard refresh completed');
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, isInitializing, loading, fetchHealthData, fetchSavedActivities, fetchCurrentPlanName]);

  // Update today's activities by copying yesterday's activities
  const updateTodaysActivities = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      console.log('🔄 Updating today\'s activities from yesterday\'s data...');
      
      // Get yesterday's date
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayDate = yesterday.toISOString().split('T')[0];
      
      // Get today's date
      const today = new Date().toISOString().split('T')[0];
      
      console.log('📅 Copying activities from', yesterdayDate, 'to', today);
      
      // Fetch yesterday's activities
      const { data: yesterdayActivities, error: fetchError } = await supabase.rpc('get_user_daily_activities', {
        p_user_id: user.id,
        p_activity_date: yesterdayDate
      });
      
      if (fetchError) {
        console.error('❌ Error fetching yesterday\'s activities:', fetchError);
        return;
      }
      
      if (!yesterdayActivities || yesterdayActivities.length === 0) {
        console.log('ℹ️ No activities found for yesterday');
        return;
      }
      
      console.log('📊 Found', yesterdayActivities.length, 'activities from yesterday');
      
      // Delete today's existing activities first
      const { error: deleteError } = await supabase
        .from('daily_activities')
        .delete()
        .eq('user_id', user.id)
        .eq('activity_date', today);
      
      if (deleteError) {
        console.error('❌ Error deleting today\'s activities:', deleteError);
        return;
      }
      
      console.log('🗑️ Deleted existing activities for today');
      
      // Copy yesterday's activities with today's date
      const activitiesToInsert = yesterdayActivities.map(activity => ({
        user_id: activity.user_id,
        plan_id: activity.plan_id,
        activity_date: today,
        activity_time: activity.activity_time,
        activity: activity.activity,
        duration: activity.duration,
        category: activity.category,
        food: activity.food,
        exercise: activity.exercise,
        instructions: activity.instructions,
        health_tip: activity.health_tip,
        is_completed: false, // Reset completion status
        completed_at: null,
        notes: null
      }));
      
      const { error: insertError } = await supabase
        .from('daily_activities')
        .insert(activitiesToInsert);
      
      if (insertError) {
        console.error('❌ Error inserting today\'s activities:', insertError);
        return;
      }
      
      console.log('✅ Successfully updated today\'s activities');
      
      // Refresh the activities display
      await fetchSavedActivities(user.id);
      
    } catch (error) {
      console.error('❌ Error updating today\'s activities:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, fetchSavedActivities]);

  // Handle window focus to refresh data when user returns to tab
  useEffect(() => {
    const handleWindowFocus = () => {
      if (user?.id && !isInitializing) {
        handleRefresh();
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    return () => window.removeEventListener('focus', handleWindowFocus);
  }, [user?.id, isInitializing, handleRefresh]);

  const handleSelectPlan = async (plan: any) => {
    if (!user?.id) {
      toast.error("Please log in to select a protocol");
      return;
    }

    try {
      setPlanSelectionLoading(true);
      setSelectedPlan(plan);
      
      // Update current protocol name
      setCurrentPlanName(plan.name || 'Selected Protocol');
      
      toast.loading("Creating your personalized schedule using our algorithm...", { id: "plan-activities" });
      
      // Generate daily protocol for the selected plan
      const result = await generatePlanActivities({
          selectedPlan: plan,
        userProfile: profile,
        primaryGoal: userInput.trim() || plan.name
      });
      
      if (result.success && result.data) {
        toast.success("Your personalized schedule is ready!", { id: "plan-activities" });
        
        console.log("🎯 Generated activities:", result.data.schedule?.length);
        console.log("🎯 Activities data structure:", result.data);
        
        // Store the generated protocol
        const activities = result.data.schedule || [];
        setGeneratedActivities(activities);
        console.log("🎯 Protocol stored in state:", activities.length);
        console.log("🎯 Protocol data:", activities);
        setShowPlans(false); // Hide plans view, show protocol
        
        // Clear the input
        setUserInput('');
      } else {
        console.error("❌ Protocol generation failed:", result.error);
        toast.error(result.error || "Failed to generate daily protocol", { id: "plan-activities" });
      }
      
    } catch (error) {
      console.error("Error generating protocol:", error);
      toast.error("Failed to generate protocol. Please try again.", { id: "plan-activities" });
    } finally {
      setPlanSelectionLoading(false);
    }
  };

  const handleGenerateHealthPlan = async () => {
    if (!user?.id) {
      toast.error("Please log in to generate health protocols");
          return;
    }

    if (!userInput.trim()) {
      toast.error("Please enter your health goal");
      return;
    }

    try {
      setPlanGenerating(true);
      toast.loading("Generating your personalized health protocol...", { id: "health-plan" });
      
      // Generate health plans using the service
      const result = await generateHealthPlans({
        userProfile: profile,
        primaryGoal: userInput.trim(),
        userInput: userInput.trim(),
        healthScore: healthScore,
        healthAnalysis: healthData
      });
      
      if (result.success && result.plans) {
        toast.success("Health protocols generated successfully!", { id: "health-plan" });
        
        console.log("🎯 Generated health plans:", result.plans.length);
        console.log("🎯 User context:", result.userContext);
        
        // Store the generated protocols and show them in the dashboard
        setGeneratedPlans(result.plans);
        setShowPlans(true);
        
        console.log("🎯 Protocols stored in state:", result.plans.length);
        console.log("🎯 Show protocols set to:", true);
        
        // Clear the input
        setUserInput('');
      } else {
        console.error("❌ Health protocol generation failed:", result.error);
        toast.error(result.error || "Failed to generate health protocols", { id: "health-plan" });
      }
      
    } catch (error) {
      console.error("Error generating health protocol:", error);
      toast.error("Failed to generate health protocol. Please try again.", { id: "health-plan" });
    } finally {
      setPlanGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
      <ErrorBoundary>
      <div className="min-h-screen" style={{ backgroundColor: '#008000' }}>
      <div className="max-w-md mx-auto pb-6">
          {/* Header Section */}
          <div className="rounded-b-[2rem] px-4 sm:px-6 py-4 shadow-lg bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-3 border-gray-200 shadow-md overflow-hidden bg-gradient-to-br from-[#88ba82] to-[#95c190] flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                          alt="Profile"
                          className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                        onLoad={() => console.log('Profile image loaded:', profile.avatar_url)}
                        onError={(e) => {
                          console.log('Profile image failed to load:', profile.avatar_url);
                          const target = e.currentTarget as HTMLElement;
                          const nextElement = target.nextElementSibling as HTMLElement;
                          target.style.display = 'none';
                          if (nextElement) {
                            nextElement.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg sm:text-xl" style={{ display: profile?.avatar_url ? 'none' : 'flex' }}>
                      {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              
              <div className="flex flex-col min-w-0 flex-1">
                  <h1 className="text-lg font-semibold text-gray-800 truncate">
                    Hi {profile?.full_name?.split(" ")[0] || 'User'}
                </h1>
                  <p className="text-sm text-gray-600">
                  Welcome back!
                </p>
              </div>
            </div>
              
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                  onClick={handleSignOut}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </button>
                <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

          {/* Health Score Section */}
        <div className="max-w-md mx-auto px-4 sm:px-6">
            <div className="backdrop-blur-md py-4 px-4 shadow-lg rounded-[2rem] mt-2 bg-white/20">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-shrink-0">
                <div>
                    <h2 className="text-sm font-medium mb-2 text-center text-white">
                    HEALTH SCORE
                  </h2>
                    <div className="w-14 h-14 sm:w-16 sm:h-16 border-2 rounded-full flex items-center justify-center border-white/50">
                      {healthLoading ? (
                        <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <span className="text-xl sm:text-2xl font-bold text-white">
                      {healthScore}
                    </span>
                      )}
                  </div>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="text-right">
                    <p className="text-sm font-semibold text-white truncate">
                      {currentPlanName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* Input Section - Hide when activities are generated */}
        {!(generatedActivities && generatedActivities.length > 0) && (
        <div className="max-w-md mx-auto px-4 sm:px-6 mt-3">
              <div className="backdrop-blur-md rounded-3xl p-2 shadow-lg border-2 bg-white/90 border-gray-300/60">
              <textarea 
                  placeholder="Set your health goals or ask for protocol advice..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none resize-none min-h-[40px] border-2 rounded-2xl px-3 py-2 mb-2 text-gray-800 placeholder-gray-500 border-gray-300/60 focus:border-gray-400"
              rows={2}
            />
            
            <div className="flex items-center justify-between gap-2 mt-2">
                  <button className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-medium border-2 bg-gray-100/80 border-gray-300/60 text-gray-700 hover:bg-gray-200">
                <Paperclip className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Attach</span>
              </button>
                  
              <div className="flex items-center gap-2">
                    <button className="w-8 h-8 rounded-full flex items-center justify-center border-2 bg-gray-100/80 border-gray-300/60 text-gray-700 hover:bg-gray-200">
                  <Mic className="w-4 h-4" />
                </button>
                <button 
                        onClick={handleGenerateHealthPlan}
                        disabled={healthLoading || planGenerating}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                        style={{ backgroundColor: '#008000' }}
                  title="Generate AI Health Protocol"
                >
                        {(healthLoading || planGenerating) ? (
                          <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Activity className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
          </div>
        )}

          {/* Main Content */}
        <div className="max-w-md mx-auto px-4 sm:px-6 mt-2">
            <div className="py-3 flex-1 shadow-lg rounded-3xl bg-white relative">
              {/* Plan Selection Loading Overlay */}
              {planSelectionLoading && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-3xl">
                  <div className="text-center">
                    <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Creating Your Schedule</h3>
                    <p className="text-gray-600 mb-4">Using our advanced algorithm to personalize your daily activities...</p>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">This may take 30-60 seconds</p>
                  </div>
                </div>
              )}
              
              <TodaySchedule 
                profile={profile} 
                generatedPlans={generatedPlans}
                showPlans={showPlans}
                onBackToInsights={() => setShowPlans(false)}
                generatedActivities={generatedActivities}
                activitiesGenerating={activitiesGenerating}
                selectedPlan={selectedPlan}
                onSelectPlan={handleSelectPlan}
                user={user}
              />
              {/* Debug info removed to fix linting */}
            </div>
        </div>

      {/* Floating Chat */}
      <FloatingChat />
        </div>
        </div>
      </ErrorBoundary>
  );
};

export default Dashboard;