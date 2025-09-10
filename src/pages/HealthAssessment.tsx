import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import {
  AlertTriangle,
  TrendingDown,
  Heart,
  Activity,
  Moon,
  Apple,
  Droplets,
  Clock,
  Target,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface HealthMetric {
  id: string;
  title: string;
  value: string;
  status: "good" | "bad";
  icon: React.ComponentType<any>;
  iconColor: string;
}

const HealthAssessment: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, loading, isInitialized } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);

  // Debug logging
  console.log("HealthAssessment: Auth state", { isInitialized, loading, profile: !!profile, user: !!user });

  // Redirect if not authenticated or profile not loaded
  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your health profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    navigate("/onboarding");
    return null;
  }

  if (!profile.onboarding_completed) {
    toast.error("Please complete your onboarding first.");
    navigate("/onboarding");
    return null;
  }

  // Generate health metrics based on profile
  const generateHealthMetrics = (profile: any): HealthMetric[] => {
    const height = profile.height || 170;
    const weight = profile.weight || 70;
    const bmi = weight / ((height / 100) ** 2);
    const age = profile.age || 30;
    
    const metrics: HealthMetric[] = [];

    // BMI Analysis
    if (bmi < 18.5) {
      metrics.push({
        id: "bmi",
        title: "BMI",
        value: `${bmi.toFixed(1)} (Underweight)`,
        status: "bad",
        icon: TrendingDown,
        iconColor: "text-red-500",
      });
    } else if (bmi > 25) {
      metrics.push({
        id: "bmi",
        title: "BMI",
        value: `${bmi.toFixed(1)} (${bmi > 30 ? 'Obese' : 'Overweight'})`,
        status: "bad",
        icon: AlertTriangle,
        iconColor: "text-red-600",
      });
    } else {
      metrics.push({
        id: "bmi",
        title: "BMI",
        value: `${bmi.toFixed(1)} (Healthy)`,
        status: "good",
        icon: CheckCircle,
        iconColor: "text-green-500",
      });
    }

    // Sleep Analysis
    if (profile.sleep_time && profile.wake_up_time) {
      const sleepHours = calculateSleepHours(profile.sleep_time, profile.wake_up_time);
      if (sleepHours < 7) {
        metrics.push({
          id: "sleep",
          title: "Sleep",
          value: `${sleepHours.toFixed(1)}h (Insufficient)`,
          status: "bad",
          icon: Moon,
          iconColor: "text-red-500",
        });
      } else if (sleepHours > 9) {
        metrics.push({
          id: "sleep",
          title: "Sleep",
          value: `${sleepHours.toFixed(1)}h (Excessive)`,
          status: "bad",
          icon: Moon,
          iconColor: "text-orange-500",
        });
      } else {
        metrics.push({
          id: "sleep",
          title: "Sleep",
          value: `${sleepHours.toFixed(1)}h (Optimal)`,
          status: "good",
          icon: Moon,
          iconColor: "text-green-500",
        });
      }
    } else {
      metrics.push({
        id: "sleep",
        title: "Sleep",
        value: "Irregular Schedule",
        status: "bad",
        icon: Moon,
        iconColor: "text-red-500",
      });
    }

    // Exercise Analysis
    if (!profile.workout_time || profile.workout_frequency === "none") {
      metrics.push({
        id: "exercise",
        title: "Exercise",
        value: "Sedentary Lifestyle",
        status: "bad",
        icon: Activity,
        iconColor: "text-red-600",
      });
    } else if (profile.workout_frequency === "1-2") {
      metrics.push({
        id: "exercise",
        title: "Exercise",
        value: "1-2x/week (Low)",
        status: "bad",
        icon: Activity,
        iconColor: "text-orange-500",
      });
    } else {
      metrics.push({
        id: "exercise",
        title: "Exercise",
        value: `${profile.workout_frequency}/week (Good)`,
        status: "good",
        icon: Activity,
        iconColor: "text-green-500",
      });
    }

    // Diet Analysis
    if (!profile.diet_type || profile.diet_type === "none") {
      metrics.push({
        id: "diet",
        title: "Diet",
        value: "No Plan",
        status: "bad",
        icon: Apple,
        iconColor: "text-red-500",
      });
    } else {
      metrics.push({
        id: "diet",
        title: "Diet",
        value: `${profile.diet_type} Plan`,
        status: "good",
        icon: Apple,
        iconColor: "text-green-500",
      });
    }

    // Hydration Analysis
    const waterIntake = profile.water_intake || 0;
    if (waterIntake < 6) {
      metrics.push({
      id: "hydration",
        title: "Hydration",
        value: `${waterIntake} glasses (Low)`,
        status: "bad",
      icon: Droplets,
        iconColor: "text-red-500",
      });
    } else {
      metrics.push({
        id: "hydration",
        title: "Hydration",
        value: `${waterIntake} glasses (Good)`,
        status: "good",
        icon: Droplets,
      iconColor: "text-green-500",
      });
    }

    return metrics;
  };

  const calculateSleepHours = (sleepTime: string, wakeTime: string): number => {
    const sleep = new Date(`2000-01-01T${sleepTime}`);
    const wake = new Date(`2000-01-01T${wakeTime}`);
    if (wake < sleep) {
      wake.setDate(wake.getDate() + 1);
    }
    return (wake.getTime() - sleep.getTime()) / (1000 * 60 * 60);
  };

  // Auto-rotate carousel
  useEffect(() => {
    if (analysisComplete && healthMetrics.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % healthMetrics.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [analysisComplete, healthMetrics.length]);

  const handleAnalyzeHealth = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const metrics = generateHealthMetrics(profile);
    setHealthMetrics(metrics);
    setAnalysisComplete(true);
    setIsAnalyzing(false);
    
    toast.error("Health analysis complete - Multiple issues detected!");
  };

  const handleGetSolution = () => {
    navigate("/paywall");
  };

  const getCardStyle = (index: number) => {
    const totalItems = healthMetrics.length;
    const distance = Math.min(
      Math.abs(index - currentIndex),
      Math.abs(index - currentIndex + totalItems),
      Math.abs(index - currentIndex - totalItems)
    );
    
    // Calculate position relative to center
    const relativeIndex = index - currentIndex;
    const adjustedIndex = relativeIndex < 0 ? relativeIndex + totalItems : relativeIndex;
    
    if (distance === 0) {
      // Main card (center) - fully visible
      return {
        transform: "translateY(0px) scale(1)",
        opacity: 1,
        zIndex: 10,
        height: "80px",
        marginBottom: "12px",
      };
    } else if (distance === 1) {
      // Adjacent cards - partially visible
      const offset = adjustedIndex === 1 ? 100 : -100;
      return {
        transform: `translateY(${offset}px) scale(0.85)`,
        opacity: 0.6,
        zIndex: 5,
        height: "70px",
        marginBottom: "10px",
      };
    } else if (distance === 2) {
      // Second level cards - more faded
      const offset = adjustedIndex === 2 ? 200 : -200;
      return {
        transform: `translateY(${offset}px) scale(0.7)`,
        opacity: 0.3,
        zIndex: 3,
        height: "60px",
        marginBottom: "8px",
      };
    } else {
      // Farthest cards - heavily cropped and faded
      const offset = adjustedIndex > 2 ? 300 : -300;
      return {
        transform: `translateY(${offset}px) scale(0.5)`,
        opacity: 0.1,
        zIndex: 1,
        height: "50px",
        marginBottom: "6px",
      };
    }
  };

  if (!analysisComplete) {
    return (
      <div className="h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Health Risk Assessment
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md">
            Our advanced algorithm will analyze your health data to identify critical issues that need immediate attention.
          </p>
          
          {!isAnalyzing ? (
            <button
              onClick={handleAnalyzeHealth}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Target className="w-5 h-5 mr-2" />
              Analyze My Health Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Analyzing your health profile...</p>
          </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex flex-col overflow-hidden">
      {/* Carousel Container - Perfectly centered */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="relative w-full max-w-sm mx-auto">
          {/* Health Metrics Vertical Roller */}
          <div className="relative h-80 overflow-hidden flex items-center justify-center">
            {healthMetrics.map((metric, index) => {
              const IconComponent = metric.icon;
              const style = getCardStyle(index);
              
    return (
                <div
                  key={metric.id}
                  className="absolute w-full transition-all duration-1000 ease-in-out"
                  style={style}
                >
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-4 flex items-center">
                    <div className="flex items-center w-full">
                      {/* Icon */}
                      <div className="flex-shrink-0 mr-4">
                        <IconComponent className={`w-6 h-6 ${metric.iconColor}`} />
            </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {metric.title}
                        </h3>
                        <p className={`text-lg font-bold ${
                          metric.status === 'good' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {metric.value}
                        </p>
                </div>
                      
                      {/* Status Icon */}
                      <div className="flex-shrink-0">
                        {metric.status === 'good' ? (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                        ) : (
                          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                            <XCircle className="w-4 h-4 text-white" />
                  </div>
                        )}
            </div>
                    </div>
                </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section - Fixed height */}
      <div className="px-6 pb-8 flex-shrink-0">
        {/* Main Message */}
        <div className="text-left mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Build a better health timeline
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            The health issues identified above can lead to serious complications if left unaddressed. 
            UrCare's proven system has helped thousands of users reverse these exact problems and achieve optimal health outcomes.
          </p>
        </div>

        {/* Call to Action */}
        <button
          onClick={handleGetSolution}
          className="w-full bg-black text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-800 transition-all duration-200 flex items-center justify-center"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Get My Personalized Health Plan
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>

        <p className="text-center text-sm text-gray-500 mt-3">
          Join 50,000+ users who transformed their health with UrCare
        </p>
        </div>
      </div>
    );
};

export default HealthAssessment;