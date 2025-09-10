import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  AlertCircle,
  Apple,
  ArrowRight,
  CheckCircle,
  Coffee,
  Droplets,
  Footprints,
  Heart,
  Moon,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import {
  HealthPlanReport,
  healthReportService,
} from "../services/healthReportService";

type PlanStep = "initial" | "generating" | "ready" | "error";

const CustomPlan: React.FC = () => {
  const navigate = useNavigate();
  const { profile, loading, isInitialized } = useAuth();
  const [step, setStep] = useState<PlanStep>("initial");
  const [report, setReport] = useState<HealthPlanReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Redirect if not authenticated or profile not loaded
  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
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

  // Handle plan generation
  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setStep("generating");

    try {
      // Simulate a brief loading period for better UX
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const planReport = await healthReportService.generateHealthPlan(profile);
      setReport(planReport);
      setStep("ready");
      toast.success("Your AI-powered health plan is ready!");
    } catch (error) {
      console.error("Error generating plan:", error);
      setStep("error");
      toast.error("Failed to generate health plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to get personalized habits based on profile
  const getPersonalizedHabits = () => {
    const habits = [];

    // Sleep habits based on profile
    if (profile?.sleep_time && profile?.wake_up_time) {
      habits.push({
        id: "sleep_schedule",
        name: "Consistent sleep schedule",
        icon: Moon,
        iconColor: "text-purple-500",
        iconBg: "bg-purple-50",
        status: "met",
        value: "8h 30m",
        description: "Based on your sleep preferences",
      });
    }

    // Diet habits based on diet type
    if (profile?.diet_type) {
      habits.push({
        id: "diet_compliance",
        name: `${profile.diet_type} diet`,
        icon: Apple,
        iconColor: "text-red-500",
        iconBg: "bg-red-50",
        status: "met",
        value: "85%",
        description: "Following your dietary preferences",
      });
    }

    // Exercise habits based on workout time
    if (profile?.workout_time) {
      habits.push({
        id: "exercise",
        name: "Daily exercise",
        icon: Activity,
        iconColor: "text-green-500",
        iconBg: "bg-green-50",
        status: "met",
        value: "45 min",
        description: `Scheduled for ${profile.workout_time}`,
      });
    }

    // Hydration (always show)
    habits.push({
      id: "hydration",
      name: "Hydration",
      icon: Droplets,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50",
      status: "met",
      value: "64.0 fl oz",
      description: "Daily water intake goal",
    });

    // Steps (always show)
    habits.push({
      id: "steps",
      name: "10,000+ steps",
      icon: Footprints,
      iconColor: "text-green-500",
      iconBg: "bg-green-50",
      status: "met",
      value: "12,450",
      description: "Daily activity goal",
    });

    // Caffeine based on profile
    habits.push({
      id: "caffeine",
      name: "Caffeine",
      icon: Coffee,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
      status: "met",
      value: "95 mg",
      description: "Within healthy limits",
    });

    // Stress management (always show)
    habits.push({
      id: "stress_management",
      name: "Stress management",
      icon: Heart,
      iconColor: "text-pink-500",
      iconBg: "bg-pink-50",
      status: "not_met",
      value: "High",
      description: "Focus on relaxation techniques",
    });

    return habits;
  };

  // Initial state - Show habit tracking design
  if (step === "initial") {
    const personalizedHabits = getPersonalizedHabits();

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            {/* Habit Tracking Cards */}
            <div className="space-y-3 mb-8">
              {personalizedHabits.map((habit) => {
                const IconComponent = habit.icon;
                const isMet = habit.status === "met";
                const isInactive = habit.status === "inactive";

                return (
                  <div
                    key={habit.id}
                    className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 ${
                      isInactive ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 ${habit.iconBg} rounded-full flex items-center justify-center`}
                        >
                          <IconComponent
                            className={`w-4 h-4 ${habit.iconColor}`}
                          />
                        </div>
                        <div>
                          <p
                            className={`text-sm font-medium ${
                              isInactive ? "text-gray-500" : "text-gray-900"
                            }`}
                          >
                            {habit.name}
                          </p>
                          {habit.value && (
                            <p
                              className={`text-xs ${
                                isMet ? "text-green-500" : "text-red-500"
                              }`}
                            >
                              {habit.value}
                            </p>
                          )}
                        </div>
                      </div>
                      {isMet ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <X
                          className={`w-5 h-5 ${
                            isInactive ? "text-gray-400" : "text-red-500"
                          }`}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Main Content */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Build a better health timeline
              </h1>
              <p className="text-gray-600 leading-relaxed">
                Your health journey shapes your future. UrCare helps you track
                the habits that move the needle, so you can build a healthier
                timeline for your life.
              </p>
            </div>

            {/* Continue Button */}
            <Button
              onClick={handleGeneratePlan}
              size="lg"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 text-lg font-medium rounded-xl"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Generating state
  if (step === "generating") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            AI is Creating Your Plan
          </h2>
          <p className="text-gray-600 mb-6">
            Our AI is analyzing your profile and generating personalized
            recommendations...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse"
              style={{ width: "70%" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Ready state - Show the generated plan
  if (step === "ready" && report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Your AI Health Plan is Ready!
              </h1>
              <p className="text-gray-600">{report.summary}</p>
            </div>

            {/* Health Score */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {report.structured.summary.healthScore}/100
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    Overall Health Score
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
                      style={{
                        width: `${report.structured.summary.healthScore}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-1">Daily Calories</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {report.structured.summary.calorieTarget}
                  </p>
                  <p className="text-sm text-gray-500">kcal target</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-1">BMI</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {report.structured.summary.bmi}
                  </p>
                  <p className="text-sm text-gray-500">Body Mass Index</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-1">Health Score</h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {report.structured.summary.healthScore}
                  </p>
                  <p className="text-sm text-gray-500">out of 100</p>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Key Recommendations
                </CardTitle>
                <CardDescription>
                  Personalized recommendations based on your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {report.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Plan */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Detailed Health Plan</CardTitle>
                <CardDescription>
                  Your comprehensive health and wellness guide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                    {report.detailedReport}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/paywall")}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Continue to Subscription
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={() => setStep("initial")}
                variant="outline"
                size="lg"
              >
                Generate New Plan
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (step === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't generate your health plan. Please try again.
          </p>
          <Button onClick={() => setStep("initial")} size="lg">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default CustomPlan;
