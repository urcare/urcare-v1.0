import {
  Activity,
  AlertTriangle,
  Apple,
  ArrowRight,
  CheckCircle,
  Clock,
  Heart,
  Moon,
  Target,
  TrendingDown,
  XCircle,
  Pill,
  Shield,
  Users,
  Brain,
  Droplets,
  Coffee,
  Briefcase,
  Utensils,
  Zap,
  Plus,
  Minus,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { authUtils } from "@/utils/authUtils_simple";

interface HealthMetric {
  id: string;
  title: string;
  value: string;
  status: "good" | "warning" | "bad";
  icon: React.ComponentType<any>;
  iconColor: string;
}

const HealthAssessment: React.FC = () => {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(false);

  // Start analysis immediately
  useEffect(() => {
    if (!isAnalyzing && !analysisComplete) {
      setIsAnalyzing(true);
      
      // Simulate analysis delay
      setTimeout(() => {
        // TODO: Replace with actual profile data from onboarding
        // For now, using sample data to demonstrate dynamic analysis
        const sampleProfile = {
          smoking: 'Daily',
          drinking: 'Regular',
          sleepTime: '01:00',
          wakeUpTime: '06:00',
          workoutType: 'None',
          workStart: '08:00',
          workEnd: '20:00',
          chronicConditions: ['Diabetes', 'Hypertension']
        };
        
                        const metrics = generateHealthMetrics(sampleProfile);
                        setHealthMetrics(metrics);
                        setIsAnalyzing(false);
                        setAnalysisComplete(true);
                        
                        // Start auto-rotation after analysis
                        setTimeout(() => {
                          setIsAutoRotating(true);
                        }, 1000);
                      }, 2000);
    }
  }, [isAnalyzing, analysisComplete]);

  // Auto-rotation effect
  useEffect(() => {
    if (isAutoRotating && healthMetrics.length > 0) {
    const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % healthMetrics.length);
      }, 3000); // Rotate every 3 seconds

    return () => clearInterval(interval);
    }
  }, [isAutoRotating, healthMetrics.length]);

  // Generate health metrics based on actual user onboarding data
  const generateHealthMetrics = (profile: any): HealthMetric[] => {
    const metrics: HealthMetric[] = [];

    // Analyze smoking status
    if (profile?.smoking && profile.smoking !== 'Never' && profile.smoking !== 'Quit') {
    metrics.push({
        id: "smoking",
        title: "Smoking",
        value: profile.smoking,
      status: "bad",
      icon: AlertTriangle,
      iconColor: "text-red-500",
    });
    }

    // Analyze drinking status
    if (profile?.drinking && profile.drinking !== 'Never' && profile.drinking !== 'Occasionally') {
    metrics.push({
        id: "drinking",
      title: "Alcohol",
        value: profile.drinking,
      status: "bad",
      icon: Coffee,
      iconColor: "text-red-500",
    });
    }

    // Analyze sleep duration
    if (profile?.sleepTime && profile?.wakeUpTime) {
      const sleepDuration = calculateSleepDuration(profile.sleepTime, profile.wakeUpTime);
      if (sleepDuration < 7) {
    metrics.push({
          id: "sleep",
          title: "Sleep",
          value: `${sleepDuration} hours`,
          status: "bad",
          icon: Clock,
          iconColor: "text-red-500",
        });
      }
    }

    // Analyze exercise frequency
    if (profile?.workoutType && (profile.workoutType === 'None' || profile.workoutType === 'Rarely')) {
    metrics.push({
        id: "exercise",
        title: "Exercise",
        value: profile.workoutType,
        status: "bad",
        icon: Activity,
        iconColor: "text-red-500",
      });
    }

    // Analyze work stress (long hours)
    if (profile?.workStart && profile?.workEnd) {
      const workHours = calculateWorkHours(profile.workStart, profile.workEnd);
      if (workHours > 10) {
    metrics.push({
          id: "stress",
          title: "Work Stress",
          value: `${workHours}h workday`,
          status: "bad",
          icon: AlertTriangle,
          iconColor: "text-red-500",
        });
      }
    }

    // Analyze chronic conditions
    if (profile?.chronicConditions && profile.chronicConditions.length > 0) {
    metrics.push({
        id: "conditions",
        title: "Health Conditions",
        value: `${profile.chronicConditions.length} conditions`,
        status: "bad",
        icon: AlertTriangle,
        iconColor: "text-red-500",
      });
    }

    // If no issues found, show a general health concern
    if (metrics.length === 0) {
    metrics.push({
        id: "general",
        title: "Health Assessment",
        value: "Needs attention",
      status: "bad",
        icon: AlertTriangle,
      iconColor: "text-red-500",
    });
    }

    return metrics;
  };

  // Helper function to calculate sleep duration
  const calculateSleepDuration = (sleepTime: string, wakeUpTime: string): number => {
    try {
      const sleep = new Date(`2000-01-01 ${sleepTime}`);
      const wake = new Date(`2000-01-01 ${wakeUpTime}`);
      
      let duration = (wake.getTime() - sleep.getTime()) / (1000 * 60 * 60);
      
      // Handle overnight sleep (sleep after midnight)
      if (duration < 0) {
        duration += 24;
      }
      
      return Math.round(duration);
    } catch {
      return 8; // Default if parsing fails
    }
  };

  // Helper function to calculate work hours
  const calculateWorkHours = (workStart: string, workEnd: string): number => {
    try {
      const start = new Date(`2000-01-01 ${workStart}`);
      const end = new Date(`2000-01-01 ${workEnd}`);
      
      let hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      
      // Handle overnight work
      if (hours < 0) {
        hours += 24;
      }
      
      return Math.round(hours);
    } catch {
      return 8; // Default if parsing fails
    }
  };

  const handleGetSolution = async () => {
    try {
      // Get current user
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Mark health assessment as completed
        await authUtils.markHealthAssessmentCompleted(session.user.id);
        console.log("✅ Health assessment marked as completed");
      }
    } catch (error) {
      console.error("❌ Error marking health assessment completed:", error);
    }
    
    // Navigate to paywall
    navigate("/paywall");
  };

  // Show analysis in progress
  if (isAnalyzing) {
    return (
      <div className="h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Analyzing Your Health Data
          </h2>
          <p className="text-gray-600">
            Please wait while we process your information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex flex-col">
      {/* Header */}
      <div className="px-6 pt-4 pb-2">
        <h1 className="text-xl font-bold text-gray-900 text-center">Build a better health timeline</h1>
      </div>

      {/* 3D Wheel Health Metrics Display */}
      <div className="flex-1 flex items-center justify-center px-6 py-4 relative overflow-hidden">
        {healthMetrics.length > 0 && (
          <div className="relative w-full max-w-sm h-96 flex flex-col items-center justify-center">
            {healthMetrics.map((metric, index) => {
              const IconComponent = metric.icon;
              const statusIcon =
                metric.status === "good" ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : metric.status === "warning" ? (
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                );

              // Calculate position and effects for 3D wheel with rotation
              const totalCards = healthMetrics.length;
              const centerIndex = Math.floor(totalCards / 2);
              
              // Calculate rotated index based on current rotation
              const rotatedIndex = (index - currentIndex + totalCards) % totalCards;
              const distanceFromCenter = Math.abs(rotatedIndex - centerIndex);
              
              // Calculate scale (1.0 at center, smaller as distance increases)
              const scale = 1 - (distanceFromCenter * 0.15);
              
              // Calculate opacity (1.0 at center, more transparent as distance increases)
              const opacity = 1 - (distanceFromCenter * 0.3);
              
              // Calculate Y offset for 3D effect with rotation
              const yOffset = (rotatedIndex - centerIndex) * 60;
              
              // Calculate Z-index (center cards on top)
              const zIndex = totalCards - distanceFromCenter;
              
              // Calculate rotation for 3D perspective with clockwise rotation
              const rotation = (rotatedIndex - centerIndex) * 8;
              
              // Add smooth transition for rotation
              const transitionDuration = isAutoRotating ? 1000 : 500;

              return (
                <div
                  key={metric.id}
                  className="absolute w-full transition-all ease-out"
                  style={{
                    transform: `translateY(${yOffset}px) scale(${scale}) rotateX(${rotation}deg)`,
                    opacity: opacity,
                    zIndex: zIndex,
                    transitionDuration: `${transitionDuration}ms`,
                  }}
                >
                  <div className="flex items-center p-4 bg-white rounded-xl shadow-lg border border-gray-100 mx-2">
                    <div className="flex-shrink-0 mr-4">
                      <IconComponent
                        className={`w-5 h-5 ${
                          metric.status === "good"
                            ? "text-green-600"
                            : metric.status === "warning"
                            ? "text-orange-600"
                            : "text-red-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-base">{metric.title}</h3>
                      {metric.value && (
                      <p
                        className={`text-sm ${
                          metric.status === "good"
                            ? "text-green-700"
                            : metric.status === "warning"
                            ? "text-orange-700"
                            : "text-red-700"
                        }`}
                      >
                        {metric.value}
                      </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      {statusIcon}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="px-6 py-4">
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            Your health needs attention. Join 50,000+ users who've improved their health with our personalized plans. Get yours today.
          </p>
        </div>

        <button
          onClick={handleGetSolution}
          className="w-full text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-200"
          style={{ backgroundColor: '#008000' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#006600'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#008000'}
        >
          Start your transformation
        </button>
      </div>
    </div>
  );
};

export default HealthAssessment;
