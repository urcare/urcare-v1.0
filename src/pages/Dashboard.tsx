import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { calculateHealthScore, getUserProfileForHealthScore } from "@/services/healthScoreService";
import { generateHealthPlans, saveSelectedHealthPlan } from "@/services/healthPlanService";
import AIProcessingPopup from "@/components/AIProcessingPopup";
import HealthPlansDisplay from "@/components/HealthPlansDisplay";

interface HealthPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  focusAreas: string[];
  estimatedCalories: number;
  equipment: string[];
  benefits: string[];
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

  const handleLogout = async () => {
    console.log("Logout button clicked");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Supabase signOut error:", error);
        throw error;
      }
      
      console.log("Supabase signOut successful, redirecting...");
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
      window.location.href = "/";
    }
  };

  const handleSendMessage = async () => {
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

    try {
      // Get user profile for health score calculation
      const profileResult = await getUserProfileForHealthScore(user.id);
      if (!profileResult.success) {
        throw new Error(profileResult.error || "Failed to fetch user profile");
      }

      // Calculate health score
      const healthScoreResult = await calculateHealthScore({
        userProfile: profileResult.profile,
        userInput: userInput.trim(),
        uploadedFiles: uploadedFiles.map(file => ({
          name: file.name,
          content: file.content
        })),
        voiceTranscript: transcript.trim()
      });

      if (!healthScoreResult.success) {
        throw new Error(healthScoreResult.error || "Failed to calculate health score");
      }

      // Update health score
      setHealthScore(healthScoreResult.healthScore || 0);

      // Generate health plans
      const plansResult = await generateHealthPlans({
        userProfile: profileResult.profile,
        healthScore: healthScoreResult.healthScore || 0,
        analysis: healthScoreResult.analysis || '',
        recommendations: healthScoreResult.recommendations || [],
        userInput: userInput.trim(),
        uploadedFiles: uploadedFiles.map(file => ({
          name: file.name,
          content: file.content
        })),
        voiceTranscript: transcript.trim()
      });

      if (!plansResult.success) {
        throw new Error(plansResult.error || "Failed to generate health plans");
      }

      // Show health plans
      setHealthPlans(plansResult.plans || []);
      setShowHealthPlans(true);

      // Clear input
      setUserInput('');
      clearAllFiles();
      clearTranscript();

      toast.success("Health analysis completed! Choose your personalized plan.");

    } catch (error) {
      console.error("Error processing health request:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process request");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectPlan = async (plan: HealthPlan) => {
    if (!user) {
      toast.error("Please log in to select a plan");
      return;
    }

    try {
      const result = await saveSelectedHealthPlan(user.id, plan);
      if (result.success) {
        toast.success(`Selected plan: ${plan.title}`);
        navigate('/workout-dashboard');
      } else {
        throw new Error(result.error || "Failed to save selected plan");
      }
    } catch (error) {
      console.error("Error selecting plan:", error);
      toast.error(error instanceof Error ? error.message : "Failed to select plan");
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

  return (
    <div className="bg-gradient-to-br from-green-800 to-green-900 min-h-screen">
      <div className="max-w-md mx-auto bg-gradient-to-br from-green-800 to-green-900 min-h-screen">
        {/* Header Section - White with Rounded Bottom */}
        <div className="bg-white rounded-b-[2rem] px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={
                  user?.user_metadata?.avatar_url ||
                  user?.user_metadata?.picture ||
                  user?.user_metadata?.full_name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata.full_name)}&background=random&color=fff&size=128` :
                  "/icons/profile.png"
                } 
                alt="Profile" 
                className="w-12 h-12 rounded-full border-2 border-gray-300 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/icons/profile.png";
                }}
              />
              <div>
                <h1 className="text-gray-800 text-lg font-medium">Hi {getFirstName()}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleLogout}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <LogOut className="w-5 h-5 text-red-600" />
              </button>
              <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Health Score Section - Transparent Blur */}
        <div className="bg-white/20 backdrop-blur-md px-6 py-6 shadow-lg rounded-[2rem] mx-4 mt-4">
          <div className="flex items-center justify-center">
            <div>
              <h2 className="text-white text-sm font-medium mb-2 text-center">HEALTH SCORE</h2>
              <div className="w-16 h-16 border-2 border-white/50 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">{healthScore}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Input/Chat Section - White */}
        <div className="bg-white px-6 py-4 shadow-lg rounded-3xl mx-4 mt-4">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 mb-3 border border-white/30">
            <textarea 
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Set your health goals or ask for advice..."
              className="w-full bg-transparent text-gray-800 placeholder-gray-500 text-sm focus:outline-none resize-none min-h-[60px]"
              rows={3}
            />
            
            {/* Voice transcript display */}
            {transcript && (
              <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700">
                  <strong>Voice:</strong> {transcript}
                </p>
              </div>
            )}

            {/* Uploaded files display */}
            {uploadedFiles.length > 0 && (
              <div className="mt-2 space-y-1">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">({getFileSize(file.size)})</span>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <button 
              onClick={openFileDialog}
              className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-gray-800 text-sm font-medium border border-white/30 hover:bg-white transition-colors"
            >
              <Paperclip className="w-4 h-4" />
              Attach
            </button>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleVoiceToggle}
                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                  isRecording 
                    ? 'bg-red-500 text-white border-red-500' 
                    : 'bg-white/90 backdrop-blur-md border-white/30 text-gray-800 hover:bg-white'
                }`}
                disabled={!isVoiceSupported}
                title={!isVoiceSupported ? "Voice recording not supported" : isRecording ? "Stop recording" : "Start recording"}
              >
                <Mic className="w-5 h-5" />
              </button>
              <button 
                onClick={handleSendMessage}
                disabled={isProcessing || (!userInput.trim() && uploadedFiles.length === 0 && !transcript.trim())}
                className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5 text-gray-800" />
              </button>
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

        {/* Health Plans or Today's Schedule Section */}
        <div className="bg-white px-6 py-4 flex-1 shadow-lg rounded-3xl mx-4 mt-4">
          {showHealthPlans ? (
            <HealthPlansDisplay 
              plans={healthPlans} 
              onSelectPlan={handleSelectPlan}
            />
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-yellow-500 text-lg font-medium">Today's Schedule</h2>
                <Settings className="w-5 h-5 text-yellow-500" />
              </div>
              
              <div className="space-y-3">
                {/* Morning Wake-up Routine */}
                <div className="bg-gray-100 rounded-[2rem] px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-yellow-400">
                      <Calendar className="w-4 h-4 text-gray-800" />
                    </div>
                    <div>
                      <p className="text-gray-800 text-sm font-medium">Morning Wake-up Routine</p>
                      <p className="text-gray-600 text-xs">08:30:00</p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </div>

                {/* Healthy Breakfast */}
                <div className="bg-gray-100 rounded-[2rem] px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-yellow-400">
                      <img src="/icons/diet.png" alt="Diet" className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-gray-800 text-sm font-medium">Healthy Breakfast</p>
                      <p className="text-gray-600 text-xs">09:00</p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </div>

                {/* Focused Work Session */}
                <div className="bg-gray-100 rounded-[2rem] px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-yellow-400">
                      <CheckCircle className="w-4 h-4 text-gray-800" />
                    </div>
                    <div>
                      <p className="text-gray-800 text-sm font-medium">Focused Work Session</p>
                      <p className="text-gray-600 text-xs">09:45</p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

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
    </div>
  );
};

export default Dashboard;