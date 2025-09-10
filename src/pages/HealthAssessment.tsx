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

interface HealthIssue {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  impact: string;
  icon: React.ComponentType<any>;
  iconColor: string;
  iconBg: string;
}

interface HealthScore {
  overall: number;
  nutrition: number;
  fitness: number;
  sleep: number;
  lifestyle: number;
}

const HealthAssessment: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, loading, isInitialized } = useAuth();
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
  const [healthIssues, setHealthIssues] = useState<HealthIssue[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

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

  // Health analysis algorithm
  const analyzeHealthProfile = (profile: any): { score: HealthScore; issues: HealthIssue[] } => {
    const issues: HealthIssue[] = [];
    let nutritionScore = 100;
    let fitnessScore = 100;
    let sleepScore = 100;
    let lifestyleScore = 100;

    // Analyze BMI
    const height = profile.height || 170; // cm
    const weight = profile.weight || 70; // kg
    const bmi = weight / ((height / 100) ** 2);
    
    if (bmi < 18.5) {
      issues.push({
        id: "underweight",
        title: "Underweight BMI",
        severity: "high",
        description: `Your BMI is ${bmi.toFixed(1)}, which is below the healthy range (18.5-24.9)`,
        impact: "Increased risk of nutrient deficiencies, weakened immune system, and bone health issues",
        icon: TrendingDown,
        iconColor: "text-red-500",
        iconBg: "bg-red-50",
      });
      nutritionScore -= 30;
    } else if (bmi > 25) {
      issues.push({
        id: "overweight",
        title: bmi > 30 ? "Obesity Risk" : "Overweight BMI",
        severity: bmi > 30 ? "critical" : "high",
        description: `Your BMI is ${bmi.toFixed(1)}, which is ${bmi > 30 ? 'in the obesity range' : 'above the healthy range'}`,
        impact: "Increased risk of diabetes, heart disease, high blood pressure, and joint problems",
        icon: AlertTriangle,
        iconColor: "text-red-600",
        iconBg: "bg-red-100",
      });
      nutritionScore -= bmi > 30 ? 40 : 25;
      fitnessScore -= bmi > 30 ? 35 : 20;
    }

    // Analyze age-related risks
    const age = profile.age || 30;
    if (age > 40) {
      issues.push({
        id: "age_risk",
        title: "Age-Related Health Risks",
        severity: "medium",
        description: `At ${age} years old, your metabolism is slowing down and health risks are increasing`,
        impact: "Higher risk of chronic diseases, slower recovery, and decreased muscle mass",
        icon: Clock,
        iconColor: "text-orange-500",
        iconBg: "bg-orange-50",
      });
      lifestyleScore -= 15;
    }

    // Analyze sleep patterns
    if (profile.sleep_time && profile.wake_up_time) {
      const sleepHours = calculateSleepHours(profile.sleep_time, profile.wake_up_time);
      if (sleepHours < 7) {
        issues.push({
          id: "insufficient_sleep",
          title: "Insufficient Sleep",
          severity: "high",
          description: `You're only getting ${sleepHours} hours of sleep per night`,
          impact: "Impaired cognitive function, weakened immune system, increased stress, and weight gain",
          icon: Moon,
          iconColor: "text-purple-500",
          iconBg: "bg-purple-50",
        });
        sleepScore -= 30;
      } else if (sleepHours > 9) {
        issues.push({
          id: "excessive_sleep",
          title: "Excessive Sleep",
          severity: "medium",
          description: `You're sleeping ${sleepHours} hours per night, which may indicate underlying health issues`,
          impact: "Potential depression, sleep apnea, or other health conditions",
          icon: Moon,
          iconColor: "text-blue-500",
          iconBg: "bg-blue-50",
        });
        sleepScore -= 15;
      }
    } else {
      issues.push({
        id: "irregular_sleep",
        title: "Irregular Sleep Schedule",
        severity: "medium",
        description: "No consistent sleep schedule detected",
        impact: "Disrupted circadian rhythm, poor sleep quality, and increased health risks",
        icon: Moon,
        iconColor: "text-yellow-500",
        iconBg: "bg-yellow-50",
      });
      sleepScore -= 20;
    }

    // Analyze diet
    if (!profile.diet_type || profile.diet_type === "none") {
      issues.push({
        id: "no_diet_plan",
        title: "No Dietary Plan",
        severity: "high",
        description: "You don't have a structured dietary approach",
        impact: "Uncontrolled eating patterns, potential nutrient deficiencies, and weight management issues",
        icon: Apple,
        iconColor: "text-green-500",
        iconBg: "bg-green-50",
      });
      nutritionScore -= 25;
    }

    // Analyze exercise
    if (!profile.workout_time || profile.workout_frequency === "none") {
      issues.push({
        id: "sedentary_lifestyle",
        title: "Sedentary Lifestyle",
        severity: "critical",
        description: "No regular exercise routine detected",
        impact: "Muscle loss, bone density reduction, cardiovascular risks, and mental health decline",
        icon: Activity,
        iconColor: "text-red-600",
        iconBg: "bg-red-100",
      });
      fitnessScore -= 40;
    } else if (profile.workout_frequency === "1-2") {
      issues.push({
        id: "insufficient_exercise",
        title: "Insufficient Exercise",
        severity: "medium",
        description: "Only 1-2 workouts per week is below recommended levels",
        impact: "Suboptimal fitness gains, slower metabolism, and increased health risks",
        icon: Activity,
        iconColor: "text-orange-500",
        iconBg: "bg-orange-50",
      });
      fitnessScore -= 20;
    }

    // Analyze hydration
    if (!profile.water_intake || profile.water_intake < 6) {
      issues.push({
        id: "dehydration",
        title: "Insufficient Hydration",
        severity: "medium",
        description: `Only ${profile.water_intake || 0} glasses of water per day`,
        impact: "Decreased energy, poor skin health, impaired cognitive function, and kidney stress",
        icon: Droplets,
        iconColor: "text-blue-500",
        iconBg: "bg-blue-50",
      });
      lifestyleScore -= 15;
    }

    // Calculate overall score
    const overallScore = Math.round((nutritionScore + fitnessScore + sleepScore + lifestyleScore) / 4);

    return {
      score: {
        overall: overallScore,
        nutrition: nutritionScore,
        fitness: fitnessScore,
        sleep: sleepScore,
        lifestyle: lifestyleScore,
      },
      issues,
    };
  };

  const calculateSleepHours = (sleepTime: string, wakeTime: string): number => {
    const sleep = new Date(`2000-01-01T${sleepTime}`);
    const wake = new Date(`2000-01-01T${wakeTime}`);
    if (wake < sleep) {
      wake.setDate(wake.getDate() + 1);
    }
    return (wake.getTime() - sleep.getTime()) / (1000 * 60 * 60);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-600 bg-red-100";
      case "high": return "text-red-500 bg-red-50";
      case "medium": return "text-orange-500 bg-orange-50";
      case "low": return "text-yellow-500 bg-yellow-50";
      default: return "text-gray-500 bg-gray-50";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const handleAnalyzeHealth = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis time for better UX
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const analysis = analyzeHealthProfile(profile);
    setHealthScore(analysis.score);
    setHealthIssues(analysis.issues);
    setAnalysisComplete(true);
    setIsAnalyzing(false);
    
    toast.error("Health analysis complete - Multiple issues detected!");
  };

  const handleGetSolution = () => {
    navigate("/paywall");
  };

  if (!analysisComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Health Risk Assessment
              </h1>
              <p className="text-lg text-gray-600">
                Let's analyze your current health status and identify potential risks
              </p>
            </div>

            {/* Analysis Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-6">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Analyze Your Health?
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Our advanced algorithm will analyze your profile data including BMI, sleep patterns, 
                  exercise habits, and lifestyle choices to identify potential health risks and areas for improvement.
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
                    <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                  </div>
                )}
              </div>
            </div>

            {/* Warning */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-start">
                <AlertCircle className="w-6 h-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-2">Important Notice</h3>
                  <p className="text-red-700 text-sm">
                    This assessment is for educational purposes only and should not replace professional medical advice. 
                    If you have serious health concerns, please consult with a healthcare provider.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Health Assessment Results
            </h1>
            <p className="text-lg text-red-600 font-semibold">
              Multiple health risks detected - Action required
            </p>
          </div>

          {/* Health Score */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Health Score</h2>
              <div className={`text-6xl font-bold ${getScoreColor(healthScore!.overall)}`}>
                {healthScore!.overall}/100
              </div>
              <p className="text-gray-600 mt-2">
                {healthScore!.overall < 50 ? "Critical - Immediate action needed" :
                 healthScore!.overall < 70 ? "Poor - Significant improvements required" :
                 "Below average - Room for improvement"}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className={`text-2xl font-bold ${getScoreColor(healthScore!.nutrition)}`}>
                  {healthScore!.nutrition}
                </div>
                <div className="text-sm text-gray-600">Nutrition</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className={`text-2xl font-bold ${getScoreColor(healthScore!.fitness)}`}>
                  {healthScore!.fitness}
                </div>
                <div className="text-sm text-gray-600">Fitness</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className={`text-2xl font-bold ${getScoreColor(healthScore!.sleep)}`}>
                  {healthScore!.sleep}
                </div>
                <div className="text-sm text-gray-600">Sleep</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className={`text-2xl font-bold ${getScoreColor(healthScore!.lifestyle)}`}>
                  {healthScore!.lifestyle}
                </div>
                <div className="text-sm text-gray-600">Lifestyle</div>
              </div>
            </div>
          </div>

          {/* Health Issues */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Critical Health Issues Detected
            </h2>
            <div className="space-y-4">
              {healthIssues.map((issue) => {
                const IconComponent = issue.icon;
                return (
                  <div key={issue.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${issue.iconBg} mr-4 flex-shrink-0`}>
                        <IconComponent className={`w-6 h-6 ${issue.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 mr-3">{issue.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                            {issue.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{issue.description}</p>
                        <p className="text-sm text-red-600 font-medium">
                          <strong>Impact:</strong> {issue.impact}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl shadow-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Don't Wait - Your Health is at Risk</h2>
            <p className="text-lg mb-6 opacity-90">
              The issues identified above can lead to serious health problems if left unaddressed. 
              Our personalized health plan can help you reverse these risks and improve your health score.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetSolution}
                className="inline-flex items-center px-8 py-4 bg-white text-red-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Get My Personalized Health Plan
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
            <p className="text-sm mt-4 opacity-75">
              Join thousands of users who have improved their health with our proven system
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthAssessment;