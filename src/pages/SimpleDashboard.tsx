import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LogOut, User, Settings } from "lucide-react";

const SimpleDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [healthScore, setHealthScore] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [dynamicData, setDynamicData] = useState<any>(null);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log("No user detected - redirecting to landing page");
          navigate("/", { replace: true });
        } else {
          setUser(session.user);
          
          // Fetch user profile from database
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profileError) {
              console.error('Profile fetch error:', profileError);
            } else {
              console.log('✅ Profile data:', profileData);
              setProfile(profileData);
            }
          } catch (profileError) {
            console.error('Profile fetch error:', profileError);
          }
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

  // Load dynamic data
  useEffect(() => {
    const loadDynamicData = async () => {
      if (user) {
        try {
          // Simulate loading dynamic data
          const mockData = {
            healthScore: Math.floor(Math.random() * 40) + 60, // 60-100
            lastUpdated: new Date().toLocaleString(),
            activities: [
              { id: 1, name: 'Morning Walk', completed: true, time: '7:00 AM' },
              { id: 2, name: 'Meditation', completed: false, time: '8:00 AM' },
              { id: 3, name: 'Workout', completed: false, time: '6:00 PM' }
            ],
            recommendations: [
              'Drink more water',
              'Get 8 hours of sleep',
              'Take your medication'
            ]
          };
          
          setHealthScore(mockData.healthScore);
          setLastUpdated(mockData.lastUpdated);
          setDynamicData(mockData);
        } catch (error) {
          console.error('Error loading dynamic data:', error);
        }
      }
    };

    loadDynamicData();
    
    // Update data every 30 seconds
    const interval = setInterval(loadDynamicData, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleSignOut = async () => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase.auth.signOut();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Sign out error:", error);
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">UrCare Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500" />
                <div className="text-sm">
                  <div className="text-gray-700">{profile?.full_name || user?.email}</div>
                  <div className="text-gray-500 text-xs">{user?.email}</div>
                </div>
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="px-4 py-6 sm:px-0"
        >
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to your health dashboard!
              </h2>
              <p className="text-gray-600 mb-6">
                You've successfully completed the authentication and onboarding flow.
              </p>
              
              {/* Dynamic Health Score Card */}
              {dynamicData && (
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg text-white">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">Your Health Score</h3>
                      <span className="text-sm opacity-90">Updated: {lastUpdated}</span>
                    </div>
                    <div className="text-4xl font-bold mb-2">{healthScore}%</div>
                    <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                      <div 
                        className="bg-white rounded-full h-2 transition-all duration-500" 
                        style={{ width: `${healthScore}%` }}
                      ></div>
                    </div>
                    <p className="text-sm opacity-90">Based on your recent activities and health data</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Health Assessment</h3>
                  <p className="text-blue-700 text-sm">Complete your health profile to get personalized recommendations.</p>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Health Plans</h3>
                  <p className="text-green-700 text-sm">View and manage your personalized health plans.</p>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">Progress Tracking</h3>
                  <p className="text-purple-700 text-sm">Track your health journey and see your progress.</p>
                </div>
              </div>

              {/* Dynamic Activities Card */}
              {dynamicData && (
                <div className="mt-6">
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Activities</h3>
                    <div className="space-y-3">
                      {dynamicData.activities.map((activity: any) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${activity.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span className={`font-medium ${activity.completed ? 'text-green-700' : 'text-gray-700'}`}>
                              {activity.name}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Recommendations Card */}
              {dynamicData && (
                <div className="mt-6">
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Recommendations</h3>
                    <div className="space-y-2">
                      {dynamicData.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm text-yellow-800">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SimpleDashboard;
