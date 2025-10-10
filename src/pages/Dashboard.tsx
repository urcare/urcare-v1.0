import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Bell, Mic, Paperclip, Activity } from "lucide-react";
import { toast } from "sonner";
import TodaySchedule from "@/components/TodaySchedule";
import FloatingChat from "@/components/FloatingChat";
import ErrorBoundary from "@/components/ErrorBoundary";
import { getOrCalculateHealthAnalysis } from "@/services/healthScoreService";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState<any>(null);
  const [healthScore, setHealthScore] = useState<number>(75);
  const [healthLoading, setHealthLoading] = useState(false);

  // Fetch health data
  const fetchHealthData = async (userId: string) => {
    try {
      setHealthLoading(true);
      console.log('🔍 Fetching health data for user:', userId);
      
      const result = await getOrCalculateHealthAnalysis(userId);
      
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
      }
    } catch (error) {
      console.error('❌ Error fetching health data:', error);
    } finally {
      setHealthLoading(false);
    }
  };

  // Check authentication and load data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log("No user detected - redirecting to landing page");
          navigate("/", { replace: true });
          return;
        }
        
        setUser(session.user);

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
        } else {
          setProfile(profileData);
        }

        // Fetch onboarding profile data
        const { data: onboardingData, error: onboardingError } = await supabase
          .from('onboarding_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (onboardingError) {
          console.error("Error fetching onboarding profile:", onboardingError);
        } else {
          console.log("✅ Onboarding profile loaded:", onboardingData);
          if (onboardingData) {
            localStorage.setItem('onboardingProfile', JSON.stringify(onboardingData));
          }
        }

        // Fetch health data
        if (session.user.id) {
          await fetchHealthData(session.user.id);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleGenerateHealthPlan = async () => {
    if (!user?.id) {
      toast.error("Please log in to generate health plans");
      return;
    }

    try {
      toast.loading("Generating your personalized health plan...", { id: "health-plan" });
      
      navigate("/health-plan-generation", { 
        state: { 
          userProfile: profile,
          healthScore: healthScore,
          healthData: healthData
        } 
      });
      
      toast.dismiss("health-plan");
    } catch (error) {
      console.error("Error generating health plan:", error);
      toast.error("Failed to generate health plan. Please try again.");
      toast.dismiss("health-plan");
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
                    <h3 className="text-xs font-medium mb-1 text-white/80">
                      YOUR PLAN
                    </h3>
                    <p className="text-sm font-semibold text-white truncate">
                      Generate Your Plan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Input Section */}
          <div className="max-w-md mx-auto px-4 sm:px-6 mt-3">
            <div className="backdrop-blur-md rounded-3xl p-2 shadow-lg border-2 bg-white/90 border-gray-300/60">
              <textarea 
                placeholder="Set your health goals or ask for advice..."
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
                    disabled={healthLoading}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    style={{ backgroundColor: '#008000' }}
                    title="Generate AI Health Plan"
                  >
                    {healthLoading ? (
                      <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Activity className="w-4 h-4 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-md mx-auto px-4 sm:px-6 mt-2">
            <div className="py-3 flex-1 shadow-lg rounded-3xl bg-white">
              <TodaySchedule profile={profile} />
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