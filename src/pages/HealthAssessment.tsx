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
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

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
  console.log("HealthAssessment: Auth state", {
    isInitialized,
    loading,
    profile: !!profile,
    user: !!user,
  });

  // Redirect if not authenticated or profile not loaded
  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          {/* Animated Health Icon */}
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto relative">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-pulse"></div>
              {/* Middle rotating ring */}
              <div className="absolute inset-2 rounded-full border-4 border-green-400 border-t-transparent animate-spin"></div>
              {/* Inner heart icon */}
              <div className="absolute inset-4 flex items-center justify-center">
                <Heart className="w-8 h-8 text-green-600 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Content */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Health Risk Assessment
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Our advanced algorithm will analyze your health data to identify
            critical issues that need immediate attention.
          </p>

          {/* Animated Button */}
          <button className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center">
              <Activity className="w-5 h-5 mr-2 animate-pulse" />
              Analyze My Health Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </button>

          {/* Loading dots */}
          <div className="flex justify-center mt-6 space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
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

  // Generate health metrics based on ACTUAL profile data
  const generateHealthMetrics = (profile: any): HealthMetric[] => {
    // Debug logging to see what data we're getting
    console.log("HealthAssessment: Profile data received:", {
      height_cm: profile.height_cm,
      weight_kg: profile.weight_kg,
      age: profile.age,
      sleep_time: profile.sleep_time,
      wake_up_time: profile.wake_up_time,
      workout_time: profile.workout_time,
      diet_type: profile.diet_type,
      chronic_conditions: profile.chronic_conditions,
      preferences: profile.preferences,
    });

    const height = parseFloat(profile.height_cm) || 170;
    const weight = parseFloat(profile.weight_kg) || 70;
    const bmi = weight / (height / 100) ** 2;
    const age = profile.age || 30;

    const metrics: HealthMetric[] = [];

    // BMI Analysis (we have height and weight)
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
        value: `${bmi.toFixed(1)} (${bmi > 30 ? "Obese" : "Overweight"})`,
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

    // Sleep Analysis (we have sleep_time and wake_up_time)
    if (profile.sleep_time && profile.wake_up_time) {
      const sleepHours = calculateSleepHours(
        profile.sleep_time,
        profile.wake_up_time
      );
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
        value: "No Schedule Set",
        status: "bad",
        icon: Moon,
        iconColor: "text-red-500",
      });
    }

    // Exercise Analysis (we have workout_time)
    if (!profile.workout_time) {
      metrics.push({
        id: "exercise",
        title: "Exercise",
        value: "No Workout Time",
        status: "bad",
        icon: Activity,
        iconColor: "text-red-600",
      });
    } else {
      metrics.push({
        id: "exercise",
        title: "Exercise",
        value: `Scheduled at ${profile.workout_time}`,
        status: "good",
        icon: Activity,
        iconColor: "text-green-500",
      });
    }

    // Diet Analysis (we have diet_type)
    if (!profile.diet_type) {
      metrics.push({
        id: "diet",
        title: "Diet",
        value: "No Diet Plan",
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

    // Chronic Conditions Analysis (we have chronic_conditions)
    if (profile.chronic_conditions && profile.chronic_conditions.length > 0) {
      const conditions = profile.chronic_conditions.filter(
        (c: string) => c !== "none"
      );
      if (conditions.length > 0) {
        metrics.push({
          id: "conditions",
          title: "Health Conditions",
          value: `${conditions.length} condition(s)`,
          status: "bad",
          icon: AlertTriangle,
          iconColor: "text-red-600",
        });
      } else {
        metrics.push({
          id: "conditions",
          title: "Health Conditions",
          value: "No conditions",
          status: "good",
          icon: CheckCircle,
          iconColor: "text-green-500",
        });
      }
    } else {
      metrics.push({
        id: "conditions",
        title: "Health Conditions",
        value: "Not specified",
        status: "bad",
        icon: AlertTriangle,
        iconColor: "text-orange-500",
      });
    }

    // Age Risk Analysis (we have age)
    if (age > 40) {
      metrics.push({
        id: "age_risk",
        title: "Age Risk",
        value: `${age} years (High Risk)`,
        status: "bad",
        icon: Clock,
        iconColor: "text-orange-500",
      });
    } else {
      metrics.push({
        id: "age_risk",
        title: "Age Risk",
        value: `${age} years (Low Risk)`,
        status: "good",
        icon: Clock,
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
    await new Promise((resolve) => setTimeout(resolve, 2000));

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
    const adjustedIndex =
      relativeIndex < 0 ? relativeIndex + totalItems : relativeIndex;

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
      <div className="h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mb-6 mx-auto">
            <img src="/brand.png" alt="UrCare Logo" className="w-full h-full" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Health Risk Assessment
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md">
            Our advanced algorithm will analyze your health data to identify
            critical issues that need immediate attention.
          </p>

          {!isAnalyzing ? (
            <button
              onClick={handleAnalyzeHealth}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Target className="w-5 h-5 mr-2" />
              Analyze My Health Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Analyzing your health profile...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex flex-col overflow-hidden">
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
                        <IconComponent
                          className={`w-6 h-6 ${metric.iconColor}`}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {metric.title}
                        </h3>
                        <p
                          className={`text-lg font-bold ${
                            metric.status === "good"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {metric.value}
                        </p>
                      </div>

                      {/* Status Icon */}
                      <div className="flex-shrink-0">
                        {metric.status === "good" ? (
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
            The health issues identified above can lead to serious complications
            if left unaddressed. UrCare's proven system has helped thousands of
            users reverse these exact problems and achieve optimal health
            outcomes.
          </p>
        </div>

        {/* Call to Action */}
        <button
          onClick={handleGetSolution}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 flex items-center justify-center"
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
