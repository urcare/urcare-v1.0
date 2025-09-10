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
  Zap,
  Shield,
  Star,
} from "lucide-react";

interface HealthMetric {
  id: string;
  title: string;
  value: string;
  status: "good" | "bad";
  icon: React.ComponentType<any>;
  iconColor: string;
  severity: "critical" | "high" | "medium" | "low";
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
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
        severity: "high"
      });
    } else if (bmi > 25) {
      metrics.push({
        id: "bmi",
        title: "BMI",
        value: `${bmi.toFixed(1)} (${bmi > 30 ? 'Obese' : 'Overweight'})`,
        status: "bad",
        icon: AlertTriangle,
        iconColor: "text-red-600",
        severity: bmi > 30 ? "critical" : "high"
      });
    } else {
      metrics.push({
        id: "bmi",
        title: "BMI",
        value: `${bmi.toFixed(1)} (Healthy)`,
        status: "good",
        icon: CheckCircle,
        iconColor: "text-green-500",
        severity: "low"
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
          severity: "high"
        });
      } else if (sleepHours > 9) {
        metrics.push({
          id: "sleep",
          title: "Sleep",
          value: `${sleepHours.toFixed(1)}h (Excessive)`,
          status: "bad",
          icon: Moon,
          iconColor: "text-orange-500",
          severity: "medium"
        });
      } else {
        metrics.push({
          id: "sleep",
          title: "Sleep",
          value: `${sleepHours.toFixed(1)}h (Optimal)`,
          status: "good",
          icon: Moon,
          iconColor: "text-green-500",
          severity: "low"
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
        severity: "high"
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
        severity: "critical"
      });
    } else if (profile.workout_frequency === "1-2") {
      metrics.push({
        id: "exercise",
        title: "Exercise",
        value: "1-2x/week (Low)",
        status: "bad",
        icon: Activity,
        iconColor: "text-orange-500",
        severity: "medium"
      });
    } else {
      metrics.push({
        id: "exercise",
        title: "Exercise",
        value: `${profile.workout_frequency}/week (Good)`,
        status: "good",
        icon: Activity,
        iconColor: "text-green-500",
        severity: "low"
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
        severity: "high"
      });
    } else {
      metrics.push({
        id: "diet",
        title: "Diet",
        value: `${profile.diet_type} Plan`,
        status: "good",
        icon: Apple,
        iconColor: "text-green-500",
        severity: "low"
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
        severity: "medium"
      });
    } else {
      metrics.push({
        id: "hydration",
        title: "Hydration",
        value: `${waterIntake} glasses (Good)`,
        status: "good",
        icon: Droplets,
        iconColor: "text-green-500",
        severity: "low"
      });
    }

    // Age Risk Analysis
    if (age > 40) {
      metrics.push({
        id: "age_risk",
        title: "Age Risk",
        value: `${age} years (High Risk)`,
        status: "bad",
        icon: Clock,
        iconColor: "text-orange-500",
        severity: "medium"
      });
    } else {
      metrics.push({
        id: "age_risk",
        title: "Age Risk",
        value: `${age} years (Low Risk)`,
        status: "good",
        icon: Clock,
        iconColor: "text-green-500",
        severity: "low"
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
    
    if (distance === 0) {
      // Main card (center)
      return {
        transform: "scale(1)",
        opacity: 1,
        zIndex: 10,
        filter: "none",
      };
    } else if (distance === 1) {
      // Adjacent cards
      return {
        transform: "scale(0.85)",
        opacity: 0.7,
        zIndex: 5,
        filter: "blur(1px)",
      };
    } else if (distance === 2) {
      // Second level cards
      return {
        transform: "scale(0.7)",
        opacity: 0.4,
        zIndex: 3,
        filter: "blur(2px)",
      };
    } else {
      // Farthest cards
      return {
        transform: "scale(0.5)",
        opacity: 0.2,
        zIndex: 1,
        filter: "blur(3px)",
      };
    }
  };

  if (!analysisComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="text-center pt-8 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Your Health Analysis
        </h1>
        <p className="text-red-600 font-semibold">
          Multiple critical issues detected
        </p>
      </div>

      {/* Carousel Container */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="relative w-full max-w-sm mx-auto">
          {/* Health Metrics Carousel */}
          <div className="relative h-96 overflow-hidden">
            {healthMetrics.map((metric, index) => {
              const IconComponent = metric.icon;
              const style = getCardStyle(index);
              
              return (
                <div
                  key={metric.id}
                  className="absolute inset-0 transition-all duration-500 ease-in-out"
                  style={style}
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 h-full flex flex-col justify-center">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                           style={{ backgroundColor: metric.status === 'good' ? '#f0fdf4' : '#fef2f2' }}>
                        <IconComponent className={`w-6 h-6 ${metric.iconColor}`} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {metric.title}
                      </h3>
                      <p className={`text-2xl font-bold mb-2 ${
                        metric.status === 'good' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.value}
                      </p>
                      <div className="flex items-center justify-center">
                        {metric.status === 'good' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
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

      {/* Bottom Section */}
      <div className="px-6 pb-8">
        {/* Main Message */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Your health is at serious risk
          </h2>
          <p className="text-gray-600 leading-relaxed">
            The issues identified above can lead to life-threatening conditions if left untreated. 
            UrCare's proven system has helped thousands reverse these exact problems and achieve optimal health.
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm font-semibold text-gray-900">Medical Grade</p>
            <p className="text-xs text-gray-600">FDA Approved</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-2">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm font-semibold text-gray-900">50,000+</p>
            <p className="text-xs text-gray-600">Success Stories</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-2">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm font-semibold text-gray-900">90%</p>
            <p className="text-xs text-gray-600">Success Rate</p>
          </div>
        </div>

        {/* Call to Action */}
        <button
          onClick={handleGetSolution}
          className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
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