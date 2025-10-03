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
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";

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
  const location = useLocation();
  const { user, profile, loading, isInitialized } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [forceShow, setForceShow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Force show content after 3 seconds to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (user && profile) {
        console.log("HealthAssessment: Force showing content after timeout");
        setForceShow(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [user, profile]);

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoRotating || healthMetrics.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % healthMetrics.length
      );
    }, 2000); // Rotate every 2 seconds

    return () => clearInterval(interval);
  }, [isAutoRotating, healthMetrics.length]);

  // Navigation functions (removed - auto-rotation only)

  // Debug logging
  console.log("HealthAssessment: Auth state", {
    isInitialized,
    loading,
    profile: !!profile,
    user: !!user,
  });

  // Redirect if not authenticated or profile not loaded
  useEffect(() => {
    if (!profile) {
      navigate("/onboarding");
      return;
    }
    if (!profile.onboarding_completed) {
      toast.error("Please complete your onboarding first.");
      navigate("/onboarding");
      return;
    }
  }, [profile, navigate]);

  // Generate health metrics based on the image data
  const generateHealthMetrics = (profile: any): HealthMetric[] => {
    const metrics: HealthMetric[] = [];

    // Stress Score (from image: "50+ stress score" with red X)
    metrics.push({
      id: "stress_score",
      title: "Stress Score",
      value: "50+",
      status: "bad",
      icon: AlertTriangle,
      iconColor: "text-red-500",
    });

    // Alcohol (from image: "0.0 drinks" with red X)
    metrics.push({
      id: "alcohol",
      title: "Alcohol",
      value: "0.0 drinks",
      status: "bad",
      icon: Coffee,
      iconColor: "text-red-500",
    });

    // Caffeine (from image: "95 mg" with green checkmark)
    metrics.push({
      id: "caffeine",
      title: "Caffeine",
      value: "95 mg",
      status: "good",
      icon: Coffee,
      iconColor: "text-green-500",
    });

    // Hydration (from image: "64.0 fl oz" with green checkmark)
    metrics.push({
      id: "hydration",
      title: "Hydration",
      value: "64.0 fl oz",
      status: "good",
      icon: Droplets,
      iconColor: "text-green-500",
    });

    // Steps (from image: "10,000+ steps" with green checkmark)
    metrics.push({
      id: "steps",
      title: "Steps",
      value: "10,000+",
      status: "good",
      icon: Activity,
      iconColor: "text-green-500",
    });

    // Nutrition Score (from image: "67+ nutrition score" with green checkmark)
    metrics.push({
      id: "nutrition_score",
      title: "Nutrition Score",
      value: "67+",
      status: "good",
      icon: Apple,
      iconColor: "text-green-500",
    });

    // Late Meal (from image: "Late meal" with red X)
    metrics.push({
      id: "late_meal",
      title: "Late Meal",
      value: "Yes",
      status: "bad",
      icon: Clock,
      iconColor: "text-red-500",
    });

    return metrics;
  };

  // Simulate analysis process
  useEffect(() => {
    if (profile && !isAnalyzing && !analysisComplete) {
      setIsAnalyzing(true);
      
      // Simulate analysis delay
      setTimeout(() => {
        const metrics = generateHealthMetrics(profile);
        setHealthMetrics(metrics);
        setIsAnalyzing(false);
        setAnalysisComplete(true);
      }, 2000);
    }
  }, [profile, isAnalyzing, analysisComplete]);

  const handleGetSolution = () => {
    navigate("/paywall");
  };

  // If analysis is complete, redirect to paywall
  useEffect(() => {
    if (analysisComplete) {
      const timer = setTimeout(() => {
        navigate("/paywall");
      }, 3000); // Wait 3 seconds to show the analysis, then redirect to paywall
      
      return () => clearTimeout(timer);
    }
  }, [analysisComplete, navigate]);


  // Show loading screen
  if ((!isInitialized || (!user && loading)) && !forceShow && !(user && profile)) {
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
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 text-center">Your Health Snapshot</h1>
        <p className="text-sm text-gray-600 mt-1 text-center">
          Based on your profile and responses
        </p>
      </div>

      {/* Wheel-like Carousel Container */}
      <div className="flex-1 flex items-start justify-center px-6 pt-8 pb-4 relative max-h-[500px]">
        {healthMetrics.length > 0 && (
          <div className="w-full max-w-sm relative h-[350px] flex flex-col items-center justify-center">
            {/* Create a wheel effect with exactly 5 cards visible */}
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

              // Calculate position relative to current index
              const relativeIndex = (index - currentIndex + healthMetrics.length) % healthMetrics.length;
              
              // Show exactly 5 cards: 2 above + 1 center + 2 below
              const isAbove2 = relativeIndex === healthMetrics.length - 2; // Second card above (coming next)
              const isAbove1 = relativeIndex === healthMetrics.length - 1; // First card above (coming next)
              const isCenter = relativeIndex === 0; // Center card (currently showing)
              const isBelow1 = relativeIndex === 1; // First card below (already done)
              const isBelow2 = relativeIndex === 2; // Second card below (already done)
              
              const isVisible = isAbove2 || isAbove1 || isCenter || isBelow1 || isBelow2;

              if (!isVisible) return null;

              // Calculate transform and opacity based on position
              let transform = "";
              let opacity = 0;
              let scale = 1;
              let zIndex = 1;

              if (isCenter) {
                // Center card - fully visible and prominent
                transform = "translateY(0)";
                opacity = 1;
                scale = 1;
                zIndex = 10;
              } else if (isAbove1) {
                // First card above - coming next
                transform = "translateY(-80px)";
                opacity = 0.6;
                scale = 0.85;
                zIndex = 8;
              } else if (isAbove2) {
                // Second card above - coming next
                transform = "translateY(-160px)";
                opacity = 0.3;
                scale = 0.7;
                zIndex = 6;
              } else if (isBelow1) {
                // First card below - already done
                transform = "translateY(80px)";
                opacity = 0.6;
                scale = 0.85;
                zIndex = 8;
              } else if (isBelow2) {
                // Second card below - already done
                transform = "translateY(160px)";
                opacity = 0.3;
                scale = 0.7;
                zIndex = 6;
              }

              return (
                <motion.div
                  key={`${metric.id}-${currentIndex}`}
                  className="absolute w-full"
                  style={{
                    transform,
                    opacity,
                    scale,
                    zIndex,
                  }}
                  initial={{ opacity: 0, scale: 0.8, y: 0 }}
                  animate={{ 
                    opacity, 
                    scale, 
                    y: transform.includes('translateY') ? 
                      parseInt(transform.match(/translateY\((-?\d+)px\)/)?.[1] || '0') : 0
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeInOut",
                    type: "spring",
                    stiffness: 80,
                    damping: 20,
                  }}
                >
                  <div
                    className={`flex items-center p-4 rounded-xl shadow-lg border ${
                      metric.status === "good"
                        ? "bg-green-50 border-green-200"
                        : metric.status === "warning"
                        ? "bg-orange-50 border-orange-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex-shrink-0 mr-3">
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
                      <h3 className="font-medium text-gray-900">{metric.title}</h3>
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
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      {statusIcon}
                    </div>
                  </div>
                </motion.div>
              );
            })}


          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
        <div className="text-left mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Build a better health timeline
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            The health issues identified above can lead to serious complications
            if left unaddressed. UrCare's proven system has helped thousands of
            users reverse these exact problems and achieve optimal health
            outcomes.
          </p>
        </div>


        <button
          onClick={handleGetSolution}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 flex items-center justify-center"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Get My Personalized Health Plan
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>

        <p className="text-center text-xs text-gray-500 mt-2">
          Join 50,000+ users who transformed their health with UrCare
        </p>
      </div>
    </div>
  );
};

export default HealthAssessment;