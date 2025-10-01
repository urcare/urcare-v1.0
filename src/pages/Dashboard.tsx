import React from "react";
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
  ChevronDown
} from "lucide-react";

const Dashboard: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  
  const getFirstName = () => {
    if (profile?.full_name) {
      return profile.full_name.split(" ")[0];
    }
    return "Bhanu";
  };

  const handleLogout = async () => {
    try {
      // Use Supabase directly to avoid the window.location.href redirect
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Redirect to landing page
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      // Fallback: try the context signOut
      try {
        await signOut();
      } catch (fallbackError) {
        console.error("Fallback signOut failed:", fallbackError);
        navigate("/");
      }
    }
  };

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
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
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
                <span className="text-white text-2xl font-bold">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Input/Chat Section - White */}
        <div className="bg-white px-6 py-4 shadow-lg rounded-3xl mx-4 mt-4">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 mb-3 border border-white/30">
            <input 
              type="text" 
              placeholder="Set your health goals or ask for advice..."
              className="w-full bg-transparent text-gray-800 placeholder-gray-500 text-sm focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-gray-800 text-sm font-medium border border-white/30">
              <Paperclip className="w-4 h-4" />
              Attach
            </button>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                <Mic className="w-5 h-5 text-gray-800" />
              </button>
              <button className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <Send className="w-5 h-5 text-gray-800" />
              </button>
            </div>
          </div>
        </div>

        {/* Today's Schedule Section - White */}
        <div className="bg-white px-6 py-4 flex-1 shadow-lg rounded-3xl mx-4 mt-4">
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;