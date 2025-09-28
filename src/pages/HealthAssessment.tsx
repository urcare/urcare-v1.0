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
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

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
  const { user, profile, loading, isInitialized } = useAuth();
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

  // Helper to check if array has meaningful data
  const hasValidArrayData = (arr: any): boolean => {
    if (!Array.isArray(arr)) return false;
    return arr.length > 0 && arr.some((item: any) => item && item !== "none" && item !== "");
  };

  // Helper to check if string has meaningful data
  const hasValidStringData = (str: any): boolean => {
    return str && str !== "" && str !== "none" && str !== "prefer_not_to_say";
  };

  // Generate health metrics based on ACTUAL profile data
  const generateHealthMetrics = (profile: any): HealthMetric[] => {
    const metrics: HealthMetric[] = [];
    const age = profile.age || 30;

    // === Existing Metrics ===

    // BMI Analysis
    const height = parseFloat(profile.height_cm) || 170;
    const weight = parseFloat(profile.weight_kg) || 70;
    const bmi = weight / (height / 100) ** 2;
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

    // Sleep Analysis
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
          status: "warning",
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

    // Exercise Analysis
    if (!profile.workout_time) {
      metrics.push({
        id: "exercise",
        title: "Exercise",
        value: "No Workout Time",
        status: "bad",
        icon: Activity,
        iconColor: "text-red-500",
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

    // Diet Analysis
    if (!hasValidStringData(profile.diet_type)) {
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

    // Chronic Conditions
    if (hasValidArrayData(profile.chronic_conditions)) {
      const conditions = profile.chronic_conditions.filter(
        (c: string) => c && c !== "none" && c !== ""
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
        iconColor: "text-red-500",
      });
    }

    // Age Risk
    if (age > 40) {
      metrics.push({
        id: "age_risk",
        title: "Age Risk",
        value: `${age} years (Higher Risk)`,
        status: "warning",
        icon: Clock,
        iconColor: "text-orange-500",
      });
    } else {
      metrics.push({
        id: "age_risk",
        title: "Age Risk",
        value: `${age} years (Lower Risk)`,
        status: "good",
        icon: Clock,
        iconColor: "text-green-500",
      });
    }

    // === NEW METRICS ===

    // Medications
    if (!hasValidArrayData(profile.medications)) {
      metrics.push({
        id: "medications",
        title: "Medications",
        value: "Not specified",
        status: "bad",
        icon: Pill,
        iconColor: "text-red-500",
      });
    } else {
      const meds = profile.medications.filter((m: string) => m && m !== "none");
      if (meds.length > 0) {
        metrics.push({
          id: "medications",
          title: "Medications",
          value: `${meds.length} medication(s)`,
          status: "warning",
          icon: Pill,
          iconColor: "text-orange-500",
        });
      } else {
        metrics.push({
          id: "medications",
          title: "Medications",
          value: "None reported",
          status: "good",
          icon: Pill,
          iconColor: "text-green-500",
        });
      }
    }

    // Allergies
    if (!hasValidArrayData(profile.allergies)) {
      metrics.push({
        id: "allergies",
        title: "Allergies",
        value: "Not specified",
        status: "bad",
        icon: Shield,
        iconColor: "text-red-500",
      });
    } else {
      const allergies = profile.allergies.filter((a: string) => a && a !== "none");
      if (allergies.length > 0) {
        metrics.push({
          id: "allergies",
          title: "Allergies",
          value: `${allergies.length} allergy(ies)`,
          status: "bad",
          icon: Shield,
          iconColor: "text-red-500",
        });
      } else {
        metrics.push({
          id: "allergies",
          title: "Allergies",
          value: "None reported",
          status: "good",
          icon: Shield,
          iconColor: "text-green-500",
        });
      }
    }

    // Family History
    if (!hasValidArrayData(profile.family_history)) {
      metrics.push({
        id: "family_history",
        title: "Family History",
        value: "Not specified",
        status: "bad",
        icon: Users,
        iconColor: "text-red-500",
      });
    } else {
      const history = profile.family_history.filter((f: string) => f && f !== "none");
      if (history.length > 0) {
        metrics.push({
          id: "family_history",
          title: "Family History",
          value: `${history.length} condition(s)`,
          status: "warning",
          icon: Users,
          iconColor: "text-orange-500",
        });
      } else {
        metrics.push({
          id: "family_history",
          title: "Family History",
          value: "No known history",
          status: "good",
          icon: Users,
          iconColor: "text-green-500",
        });
      }
    }

    // Lifestyle
    if (!hasValidStringData(profile.lifestyle)) {
      metrics.push({
        id: "lifestyle",
        title: "Lifestyle",
        value: "Not specified",
        status: "bad",
        icon: Zap,
        iconColor: "text-red-500",
      });
    } else {
      const lifestyle = profile.lifestyle.toLowerCase();
      if (lifestyle.includes("sedentary") || lifestyle.includes("inactive")) {
        metrics.push({
          id: "lifestyle",
          title: "Lifestyle",
          value: "Sedentary",
          status: "bad",
          icon: Zap,
          iconColor: "text-red-500",
        });
      } else {
        metrics.push({
          id: "lifestyle",
          title: "Lifestyle",
          value: "Active",
          status: "good",
          icon: Zap,
          iconColor: "text-green-500",
        });
      }
    }

    // Stress Levels
    if (!hasValidStringData(profile.stress_levels)) {
      metrics.push({
        id: "stress",
        title: "Stress Levels",
        value: "Not specified",
        status: "bad",
        icon: Brain,
        iconColor: "text-red-500",
      });
    } else {
      const stress = profile.stress_levels.toLowerCase();
      if (stress.includes("high") || stress.includes("severe")) {
        metrics.push({
          id: "stress",
          title: "Stress Levels",
          value: "High",
          status: "bad",
          icon: Brain,
          iconColor: "text-red-500",
        });
      } else if (stress.includes("moderate")) {
        metrics.push({
          id: "stress",
          title: "Stress Levels",
          value: "Moderate",
          status: "warning",
          icon: Brain,
          iconColor: "text-orange-500",
        });
      } else {
        metrics.push({
          id: "stress",
          title: "Stress Levels",
          value: "Low",
          status: "good",
          icon: Brain,
          iconColor: "text-green-500",
        });
      }
    }

    // Mental Health
    if (!hasValidStringData(profile.mental_health)) {
      metrics.push({
        id: "mental_health",
        title: "Mental Health",
        value: "Not specified",
        status: "bad",
        icon: Brain,
        iconColor: "text-red-500",
      });
    } else {
      const mental = profile.mental_health.toLowerCase();
      if (mental.includes("poor") || mental.includes("bad")) {
        metrics.push({
          id: "mental_health",
          title: "Mental Health",
          value: "Needs Attention",
          status: "bad",
          icon: Brain,
          iconColor: "text-red-500",
        });
      } else if (mental.includes("fair")) {
        metrics.push({
          id: "mental_health",
          title: "Mental Health",
          value: "Fair",
          status: "warning",
          icon: Brain,
          iconColor: "text-orange-500",
        });
      } else {
        metrics.push({
          id: "mental_health",
          title: "Mental Health",
          value: "Good",
          status: "good",
          icon: Brain,
          iconColor: "text-green-500",
        });
      }
    }

    // Hydration
    if (!hasValidStringData(profile.hydration_habits)) {
      metrics.push({
        id: "hydration",
        title: "Hydration",
        value: "Not specified",
        status: "bad",
        icon: Droplets,
        iconColor: "text-red-500",
      });
    } else {
      const hydration = profile.hydration_habits.toLowerCase();
      if (hydration.includes("low") || hydration.includes("poor")) {
        metrics.push({
          id: "hydration",
          title: "Hydration",
          value: "Inadequate",
          status: "bad",
          icon: Droplets,
          iconColor: "text-red-500",
        });
      } else if (hydration.includes("moderate")) {
        metrics.push({
          id: "hydration",
          title: "Hydration",
          value: "Moderate",
          status: "warning",
          icon: Droplets,
          iconColor: "text-orange-500",
        });
      } else {
        metrics.push({
          id: "hydration",
          title: "Hydration",
          value: "Good",
          status: "good",
          icon: Droplets,
          iconColor: "text-green-500",
        });
      }
    }

    // Smoking Status
    if (!hasValidStringData(profile.smoking_status)) {
      metrics.push({
        id: "smoking",
        title: "Smoking",
        value: "Not specified",
        status: "bad",
        icon: Coffee,
        iconColor: "text-red-500",
      });
    } else {
      const smoking = profile.smoking_status.toLowerCase();
      if (smoking.includes("yes") || smoking.includes("current")) {
        metrics.push({
          id: "smoking",
          title: "Smoking",
          value: "Current Smoker",
          status: "bad",
          icon: Coffee,
          iconColor: "text-red-500",
        });
      } else if (smoking.includes("former")) {
        metrics.push({
          id: "smoking",
          title: "Smoking",
          value: "Former Smoker",
          status: "warning",
          icon: Coffee,
          iconColor: "text-orange-500",
        });
      } else {
        metrics.push({
          id: "smoking",
          title: "Smoking",
          value: "Non-Smoker",
          status: "good",
          icon: Coffee,
          iconColor: "text-green-500",
        });
      }
    }

    // Alcohol Consumption
    if (!hasValidStringData(profile.alcohol_consumption)) {
      metrics.push({
        id: "alcohol",
        title: "Alcohol",
        value: "Not specified",
        status: "bad",
        icon: Coffee,
        iconColor: "text-red-500",
      });
    } else {
      const alcohol = profile.alcohol_consumption.toLowerCase();
      if (alcohol.includes("daily") || alcohol.includes("heavy")) {
        metrics.push({
          id: "alcohol",
          title: "Alcohol",
          value: "High Consumption",
          status: "bad",
          icon: Coffee,
          iconColor: "text-red-500",
        });
      } else if (alcohol.includes("moderate") || alcohol.includes("weekly")) {
        metrics.push({
          id: "alcohol",
          title: "Alcohol",
          value: "Moderate",
          status: "warning",
          icon: Coffee,
          iconColor: "text-orange-500",
        });
      } else {
        metrics.push({
          id: "alcohol",
          title: "Alcohol",
          value: "Low/None",
          status: "good",
          icon: Coffee,
          iconColor: "text-green-500",
        });
      }
    }

    // Occupation
    if (!hasValidStringData(profile.occupation)) {
      metrics.push({
        id: "occupation",
        title: "Occupation",
        value: "Not specified",
        status: "bad",
        icon: Briefcase,
        iconColor: "text-red-500",
      });
    } else {
      metrics.push({
        id: "occupation",
        title: "Occupation",
        value: profile.occupation,
        status: "good",
        icon: Briefcase,
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

  const handleAnalyzeHealth = async () => {
    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const metrics = generateHealthMetrics(profile);
    setHealthMetrics(metrics);
    setAnalysisComplete(true);
    setIsAnalyzing(false);
    toast.success("Health analysis complete!");
  };

  const handleGetSolution = () => {
    navigate("/paywall");
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
    <div className="h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Your Health Snapshot</h1>
        <p className="text-sm text-gray-600 mt-1">
          Based on your profile and responses
        </p>
      </div>

      {/* Metrics List */}
      <div className="px-6 pb-20 space-y-3">
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

          return (
            <div
              key={metric.id}
              className={`flex items-center p-4 rounded-xl shadow-sm border ${
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
          );
        })}
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