import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { UserFlowHandler } from "@/components/UserFlowHandler";
import { 
  CheckCircle, 
  Calendar,
  Heart,
  Settings,
  LogOut,
  Bell,
  Mic,
  Send,
  Paperclip,
  ChevronDown,
  X,
  FileText,
  Trash2,
  Moon,
  Sun,
  Eye,
  Activity,
  Shield
} from "lucide-react";
import { toast } from "sonner";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { useDebounce } from "@/hooks/useDebounce";
import { throttle, performanceMonitor } from "@/utils/performance";
import LazyImage from "@/components/LazyImage";
import { calculateHealthScore, getUserProfileForHealthScore } from "@/services/healthScoreService";
import { generateHealthPlans, saveSelectedHealthPlan } from "@/services/healthPlanService";
import AIProcessingPopup from "@/components/AIProcessingPopup";
import HealthPlansVerticalList from "@/components/HealthPlansVerticalList";
import HealthPlansDisplay from "@/components/HealthPlansDisplay";
import YourHealthPopup from "@/components/YourHealthPopup";
import FloatingChat from "@/components/FloatingChat";

interface HealthPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  focusAreas?: string[];
  estimatedCalories?: number;
  equipment?: string[];
  benefits?: string[];
  activities?: {
    time: string;
    title: string;
    description: string;
    duration: string;
    category: string;
  }[];
}

const Dashboard: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [healthScore, setHealthScore] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showHealthPlans, setShowHealthPlans] = useState<boolean>(false);
  const [healthPlans, setHealthPlans] = useState<HealthPlan[]>([]);
  const [showFileManager, setShowFileManager] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState<boolean>(false);
  const [showYourHealthPopup, setShowYourHealthPopup] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<HealthPlan | null>(null);
  const [todaysActivities, setTodaysActivities] = useState<any[]>([]);

  // Debounced user input for better performance
  const debouncedUserInput = useDebounce(userInput, 300);

  // File upload hook
  const {
    uploadedFiles,
    isUploading,
    fileInputRef,
    openFileDialog,
    handleFileUpload,
    removeFile,
    clearAllFiles,
    getFileSize
  } = useFileUpload({
    acceptedTypes: ['.txt', '.pdf'],
    maxSize: 10,
    maxFiles: 5
  });

  // Voice recording hook
  const {
    isRecording,
    isSupported: isVoiceSupported,
    transcript,
    startRecording,
    stopRecording,
    clearTranscript
  } = useVoiceRecording();
  
  const getFirstName = () => {
    if (profile?.full_name) {
      return profile.full_name.split(" ")[0];
    }
    return "User";
  };

  // Debug: Log user data to see what we're getting from Google OAuth
  useEffect(() => {
    if (user) {
      console.log("🔍 DEBUG - Full user object:", user);
      console.log("🔍 DEBUG - User metadata:", user.user_metadata);
      console.log("🔍 DEBUG - App metadata:", user.app_metadata);
      console.log("🔍 DEBUG - All possible avatar fields:", {
        'user_metadata.avatar_url': user.user_metadata?.avatar_url,
        'user_metadata.picture': user.user_metadata?.picture,
        'user_metadata.photo_url': user.user_metadata?.photo_url,
        'user_metadata.avatar': user.user_metadata?.avatar,
        'user_metadata.image': user.user_metadata?.image,
        'user_metadata.profile_image': user.user_metadata?.profile_image,
        'app_metadata.avatar_url': user.app_metadata?.avatar_url,
        'app_metadata.picture': user.app_metadata?.picture,
        'app_metadata.photo_url': user.app_metadata?.photo_url,
        'app_metadata.avatar': user.app_metadata?.avatar,
        'app_metadata.image': user.app_metadata?.image,
        'app_metadata.profile_image': user.app_metadata?.profile_image,
      });
    }
  }, [user]);


  // Dark mode toggle
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Store preference in localStorage
    localStorage.setItem('darkMode', (!isDarkMode).toString());
  };

  // Load dark mode preference on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setIsDarkMode(savedDarkMode === 'true');
    }
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogout = async () => {
    console.log("Logout button clicked");
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      // Fallback redirect even if signOut fails
      window.location.href = "/";
    }
  };

  const handleSendMessage = throttle(async () => {
    if (!user) {
      toast.error("Please log in to use this feature");
      return;
    }

    if (!userInput.trim() && uploadedFiles.length === 0 && !transcript.trim()) {
      toast.error("Please enter a message, upload files, or record voice");
      return;
    }

    setIsProcessing(true);
    setShowHealthPlans(false);

    // Process in background to avoid UI blocking
    const processHealthAnalysis = async () => {
      try {
        performanceMonitor.startTiming('health-analysis');
        // Get user profile for health score calculation
        const profileResult = await getUserProfileForHealthScore(user.id);
        
        let userProfile;
        if (!profileResult.success) {
          console.warn("Failed to fetch user profile, using mock data:", profileResult.error);
          // Use mock profile data for admin or when profile fetch fails
          userProfile = {
            id: user.id,
            full_name: user.user_metadata?.full_name || 'User',
            age: 30,
            gender: 'Not specified',
            height_cm: '170',
            weight_kg: '70',
            blood_group: 'Not specified',
            chronic_conditions: [],
            medications: [],
            health_goals: ['General wellness'],
            diet_type: 'Balanced',
            workout_time: 'Morning',
            sleep_time: '22:00',
            wake_up_time: '06:00'
          };
        } else {
          userProfile = profileResult.profile;
        }
        
        // Send message to Groq AI for processing
        const groqResponse = await fetch('/api/groq/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userInput.trim(),
            userProfile,
            uploadedFiles: uploadedFiles.map(file => file.content),
            voiceTranscript: transcript.trim()
          })
        });

        if (!groqResponse.ok) {
          throw new Error('Failed to get AI response');
        }

        const groqData = await groqResponse.json();
        
        // Calculate health score from Groq response
        const healthScore = groqData.healthScore || 75; // Default score
        setHealthScore(healthScore);

        // Generate health plans from Groq response
        const plans = groqData.plans || [
          {
            id: 'plan-a',
            title: 'Plan A: Foundation Building',
            description: 'Focus on establishing healthy habits and routines',
            difficulty: 'Beginner',
            duration: '4 weeks',
            activities: [
              { time: '07:00', title: 'Morning Hydration', description: 'Drink 500ml water', duration: '5 minutes', category: 'Hydration' },
              { time: '07:30', title: 'Light Exercise', description: '15-minute walk or stretching', duration: '15 minutes', category: 'Exercise' },
              { time: '08:00', title: 'Healthy Breakfast', description: 'Balanced meal with protein', duration: '20 minutes', category: 'Meals' }
            ]
          },
          {
            id: 'plan-b',
            title: 'Plan B: Balanced Approach',
            description: 'Moderate intensity with focus on consistency',
            difficulty: 'Intermediate',
            duration: '6 weeks',
            activities: [
              { time: '06:30', title: 'Morning Routine', description: 'Hydration, meditation, light stretching', duration: '20 minutes', category: 'Wake up' },
              { time: '07:00', title: 'Workout Session', description: '30-minute cardio and strength training', duration: '30 minutes', category: 'Exercise' },
              { time: '08:00', title: 'Protein Breakfast', description: 'High-protein meal with complex carbs', duration: '25 minutes', category: 'Meals' }
            ]
          },
          {
            id: 'plan-c',
            title: 'Plan C: Advanced Optimization',
            description: 'High-intensity program for maximum results',
            difficulty: 'Advanced',
            duration: '8 weeks',
            activities: [
              { time: '05:30', title: 'Early Morning Routine', description: 'Cold shower, hydration, meditation', duration: '30 minutes', category: 'Wake up' },
              { time: '06:00', title: 'Intensive Workout', description: '45-minute HIIT or strength training', duration: '45 minutes', category: 'Exercise' },
              { time: '07:00', title: 'Post-Workout Nutrition', description: 'Protein smoothie with supplements', duration: '15 minutes', category: 'Meals' }
            ]
          }
        ];

        setHealthPlans(plans);
        setShowHealthPlans(true);

        // Clear input
        setUserInput('');
        clearAllFiles();
        clearTranscript();

        toast.success("AI analysis completed! Choose your personalized plan.");

      } catch (error) {
        console.error("Error processing health request:", error);
        toast.error(error instanceof Error ? error.message : "Failed to process request");
      } finally {
        performanceMonitor.endTiming('health-analysis');
        setIsProcessing(false);
      }
    };

    // Run in background
    processHealthAnalysis();
  }, 1000); // Throttle to max once per second

  const handleSelectPlan = async (plan: HealthPlan) => {
    if (!user) {
      toast.error("Please log in to select a plan");
      return;
    }

    try {
      setSelectedPlan(plan);
      const result = await saveSelectedHealthPlan(user.id, plan);
      if (result.success) {
        toast.success(`Selected plan: ${plan.title}`);
        
        // Update today's activities based on selected plan
        if (plan.activities && plan.activities.length > 0) {
          const activitiesWithTimestamps = plan.activities.map(activity => ({
            ...activity,
            id: Math.random().toString(36).substr(2, 9),
            completed: false,
            timestamp: new Date().toISOString()
          }));
          setTodaysActivities(activitiesWithTimestamps);
          
          // Save to localStorage for persistence
          localStorage.setItem('todaysActivities', JSON.stringify(activitiesWithTimestamps));
        }
        
        // Hide the health plans and show the updated Today's Schedule
        setShowHealthPlans(false);
        // Navigate to health plan generation page
        navigate('/health-plan-generation', { state: { selectedPlan: plan } });
      } else {
        throw new Error(result.error || "Failed to save selected plan");
      }
    } catch (error) {
      console.error("Error selecting plan:", error);
      toast.error(error instanceof Error ? error.message : "Failed to select plan");
    }
  };

  const handleViewPlanDetails = () => {
    if (selectedPlan) {
      navigate('/workout-dashboard', { state: { selectedPlan, viewOnly: true } });
    } else {
      toast.error("No plan selected");
    }
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Update user input with voice transcript
  useEffect(() => {
    if (transcript) {
      setUserInput(prev => prev + (prev ? ' ' : '') + transcript);
    }
  }, [transcript]);

  // Load today's activities from localStorage on mount
  useEffect(() => {
    const savedActivities = localStorage.getItem('todaysActivities');
    if (savedActivities) {
      try {
        setTodaysActivities(JSON.parse(savedActivities));
      } catch (error) {
        console.error('Failed to parse saved activities:', error);
      }
    }
  }, []);

  return (
    <UserFlowHandler>
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-[#88ba82] to-[#95c190]'
      }`}>
      <div className="max-w-md mx-auto min-h-screen">
        {/* Header Section - White with Rounded Bottom */}
        <div className={`rounded-b-[2rem] px-4 sm:px-6 py-4 shadow-lg transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LazyImage
                src={(() => {
                  const avatarUrl = 
                    user?.user_metadata?.avatar_url ||
                    user?.user_metadata?.picture ||
                    user?.user_metadata?.photo_url ||
                    user?.user_metadata?.avatar ||
                    user?.user_metadata?.image ||
                    user?.user_metadata?.profile_image ||
                    user?.app_metadata?.avatar_url ||
                    user?.app_metadata?.picture ||
                    user?.app_metadata?.photo_url ||
                    user?.app_metadata?.avatar ||
                    user?.app_metadata?.image ||
                    user?.app_metadata?.profile_image ||
                    (user?.user_metadata?.full_name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata.full_name)}&background=random&color=fff&size=128` : null) ||
                    "/icons/profile.png";
                  
                  console.log("🖼️ DEBUG - Final avatar URL being used:", avatarUrl);
                  return avatarUrl;
                })()}
                alt="Profile"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300 object-cover"
                onError={() => {
                  console.log("❌ DEBUG - Image failed to load, falling back to default");
                }}
              />
              <div>
                <h1 className={`text-lg font-medium transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Hi {getFirstName()}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={handleLogout}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </button>
              <button 
                onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Health Score Section - Transparent Blur */}
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className={`backdrop-blur-md py-6 px-4 shadow-lg rounded-[2rem] mt-2 transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/20' 
              : 'bg-white/20'
          }`}>
            <div className="flex items-center justify-between gap-4">
              {/* Health Score */}
              <div className="flex-shrink-0">
                <div>
                  <h2 className={`text-sm font-medium mb-2 text-center transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-white'
                  }`}>
                    HEALTH SCORE
                  </h2>
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 border-2 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    isDarkMode 
                      ? 'border-gray-400/50' 
                      : 'border-white/50'
                  }`}>
                    <span className={`text-xl sm:text-2xl font-bold transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-200' : 'text-white'
                    }`}>
                      {healthScore}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Selected Plan or Call-to-Action */}
              <div className="flex-1 min-w-0">
                <div className="text-right">
                  <h3 className={`text-xs font-medium mb-1 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-white/80'
                  }`}>
                    {selectedPlan ? 'SELECTED PLAN' : 'YOUR PLAN'}
                  </h3>
                  <p className={`text-sm font-semibold transition-colors duration-300 truncate ${
                    isDarkMode ? 'text-gray-100' : 'text-white'
                  }`}>
                    {selectedPlan ? selectedPlan.title : 'Generate Your Plan'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input/Chat Section */}
        <div className="max-w-sm mx-auto px-4 sm:px-6">
          <div className={`backdrop-blur-md rounded-3xl p-2 shadow-lg border-2 transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-700/90 border-gray-500/50' 
              : 'bg-white/90 border-gray-300/60'
          }`}>
            <textarea 
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Set your health goals or ask for advice..."
              className={`w-full bg-transparent text-sm focus:outline-none resize-none min-h-[40px] transition-colors duration-300 border-2 rounded-2xl px-3 py-2 mb-2 ${
                isDarkMode 
                  ? 'text-gray-200 placeholder-gray-400 border-gray-600/50 focus:border-gray-500' 
                  : 'text-gray-800 placeholder-gray-500 border-gray-300/60 focus:border-gray-400'
              }`}
              rows={2}
            />
            
            {/* Voice transcript display */}
            {transcript && (
              <div className={`mt-2 p-2 rounded-lg border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-blue-900/50 border-blue-700' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <p className={`text-xs transition-colors duration-300 ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-700'
                }`}>
                  <strong>Voice:</strong> {transcript}
                </p>
              </div>
            )}

            {/* Uploaded files display */}
            {uploadedFiles.length > 0 && (
              <div className="mt-2 space-y-1">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className={`flex items-center justify-between p-2 rounded-lg transition-colors duration-300 ${
                    isDarkMode ? 'bg-gray-600' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <FileText className={`w-4 h-4 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span className={`text-xs transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {file.name}
                      </span>
                      <span className={`text-xs transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        ({getFileSize(file.size)})
                      </span>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center justify-between gap-2 mt-2">
              <button 
                onClick={openFileDialog}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-medium border-2 transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-600/80 border-gray-500/50 text-gray-200 hover:bg-gray-500' 
                    : 'bg-gray-100/80 border-gray-300/60 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Attach</span>
              </button>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleVoiceToggle}
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                    isRecording 
                      ? 'bg-red-500 text-white border-red-500' 
                      : isDarkMode
                      ? 'bg-gray-600/80 border-gray-500/50 text-gray-200 hover:bg-gray-500'
                      : 'bg-gray-100/80 border-gray-300/60 text-gray-700 hover:bg-gray-200'
                  }`}
                  disabled={!isVoiceSupported}
                  title={!isVoiceSupported ? "Voice recording not supported" : isRecording ? "Stop recording" : "Start recording"}
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleSendMessage}
                  disabled={isProcessing || (!userInput.trim() && uploadedFiles.length === 0 && !transcript.trim())}
                  className="w-8 h-8 bg-gradient-to-r from-[#88ba82] to-[#95c190] rounded-full flex items-center justify-center hover:from-[#7aa875] hover:to-[#88ba82] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".txt,.pdf"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />
          </div>
        </div>

        {/* Today's Schedule or Health Plans Section */}
        <div className="max-w-md mx-auto px-4 sm:px-6">
          {showHealthPlans ? (
            <div className={`py-4 flex-1 shadow-lg rounded-3xl transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <HealthPlansDisplay
                plans={healthPlans}
                onSelectPlan={handleSelectPlan}
                selectedPlan={selectedPlan}
              />
            </div>
          ) : (
            <div className={`py-4 flex-1 shadow-lg rounded-3xl transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-medium transition-colors duration-300 ${
                  isDarkMode ? 'text-[#88ba82]' : 'text-yellow-500'
                }`}>
                  Today's Schedule
                </h2>
                <button
                  onClick={() => setShowYourHealthPopup(true)}
                  className="transition-colors duration-300 hover:opacity-80"
                >
                  <Settings className={`w-5 h-5 transition-colors duration-300 ${
                    isDarkMode ? 'text-[#88ba82]' : 'text-yellow-500'
                  }`} />
                </button>
              </div>
              
              <div className="space-y-3">
                {todaysActivities.length > 0 ? (
                  todaysActivities.map((activity, index) => (
                    <div 
                      key={activity.id || index}
                      className={`rounded-[2rem] px-4 py-3 flex items-center justify-between transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-600 border-[#88ba82]' 
                            : 'bg-white border-yellow-400'
                        }`}>
                          {activity.category === 'Exercise' ? (
                            <Activity className={`w-4 h-4 transition-colors duration-300 ${
                              isDarkMode ? 'text-gray-200' : 'text-gray-800'
                            }`} />
                          ) : activity.category === 'Meals' ? (
                            <img src="/icons/diet.png" alt="Diet" className="w-4 h-4" />
                          ) : (
                            <Calendar className={`w-4 h-4 transition-colors duration-300 ${
                              isDarkMode ? 'text-gray-200' : 'text-gray-800'
                            }`} />
                          )}
                        </div>
                        <div>
                          <p className={`text-sm font-medium transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-200' : 'text-gray-800'
                          }`}>
                            {activity.title}
                          </p>
                          <p className={`text-xs transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {activity.time} • {activity.duration}
                          </p>
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`} />
                    </div>
                  ))
                ) : (
                  // Default activities when no plan is selected
                  <>
                    <div className={`rounded-[2rem] px-4 py-3 flex items-center justify-between transition-colors duration-300 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-600 border-[#88ba82]' 
                            : 'bg-white border-yellow-400'
                        }`}>
                          <Calendar className={`w-4 h-4 transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-200' : 'text-gray-800'
                          }`} />
                        </div>
                        <div>
                          <p className={`text-sm font-medium transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-200' : 'text-gray-800'
                          }`}>
                            Morning Wake-up Routine
                          </p>
                          <p className={`text-xs transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            08:30:00
                          </p>
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`} />
                    </div>

                    <div className={`rounded-[2rem] px-4 py-3 flex items-center justify-between transition-colors duration-300 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-600 border-[#88ba82]' 
                            : 'bg-white border-yellow-400'
                        }`}>
                          <img src="/icons/diet.png" alt="Diet" className="w-4 h-4" />
                        </div>
                        <div>
                          <p className={`text-sm font-medium transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-200' : 'text-gray-800'
                          }`}>
                            Healthy Breakfast
                          </p>
                          <p className={`text-xs transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            09:00
                          </p>
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`} />
                    </div>

                    <div className={`rounded-[2rem] px-4 py-3 flex items-center justify-between transition-colors duration-300 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-600 border-[#88ba82]' 
                            : 'bg-white border-yellow-400'
                        }`}>
                          <CheckCircle className={`w-4 h-4 transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-200' : 'text-gray-800'
                          }`} />
                        </div>
                        <div>
                          <p className={`text-sm font-medium transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-200' : 'text-gray-800'
                          }`}>
                            Focused Work Session
                          </p>
                          <p className={`text-xs transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            09:45
                          </p>
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`} />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>


        {/* Notification Drawer */}
        {showNotificationDrawer && (
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowNotificationDrawer(false)}>
            <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Settings & Options
                  </h3>
                  <button
                    onClick={() => setShowNotificationDrawer(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Dark Mode Toggle */}
                  <div className={`flex items-center justify-between p-4 rounded-lg transition-colors duration-300 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <div className="flex items-center space-x-3">
                      {isDarkMode ? (
                        <Moon className="w-5 h-5 text-[#88ba82]" />
                      ) : (
                        <Sun className="w-5 h-5 text-yellow-500" />
                      )}
                      <span className={`font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                      </span>
                    </div>
                    <button
                      onClick={toggleDarkMode}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                        isDarkMode ? 'bg-[#88ba82]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                          isDarkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Admin Access */}
                  {user && user.email === 'admin@urcare.com' && (
                    <button
                      onClick={() => navigate('/my-admin')}
                      className={`w-full flex items-center space-x-3 p-4 rounded-lg transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <Shield className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      <span className={`font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        Admin Panel (Charts, Users, Payments, Chat)
                      </span>
                    </button>
                  )}

                  {/* View Plan Details */}
                  {selectedPlan && (
                    <button
                      onClick={handleViewPlanDetails}
                      className={`w-full flex items-center space-x-3 p-4 rounded-lg transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <Eye className="w-5 h-5 text-[#88ba82]" />
                      <span className={`font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        View Plan Details
                      </span>
                    </button>
                  )}

                  {/* Activity Overview */}
                  <button
                    onClick={() => navigate('/workout-dashboard')}
                    className={`w-full flex items-center space-x-3 p-4 rounded-lg transition-colors duration-300 ${
                      isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <Activity className="w-5 h-5 text-[#88ba82]" />
                    <span className={`font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      Activity Overview
                    </span>
                  </button>
            </div>
          </div>
        </div>
      </div>
        )}

      {/* AI Processing Popup */}
      <AIProcessingPopup
        isOpen={isProcessing}
        onComplete={(result) => {
          console.log("AI processing completed:", result);
        }}
        onError={(error) => {
          console.error("AI processing error:", error);
          toast.error("AI processing failed: " + error);
        }}
      />

      {/* Your Health Popup */}
      <YourHealthPopup
        isOpen={showYourHealthPopup}
        onClose={() => setShowYourHealthPopup(false)}
        userProfile={profile}
        healthScore={healthScore}
        selectedPlan={selectedPlan}
      />

      {/* Floating Chat */}
      <FloatingChat />
      </div>
    </UserFlowHandler>
  );
};

export default Dashboard;