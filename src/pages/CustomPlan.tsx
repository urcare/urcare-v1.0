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
  Heart,
  Moon,
  Sparkles,
  Target,
  TrendingUp,
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

  // Initial state - Show plan generation button
  if (step === "initial") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Your AI-Powered Health Plan
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Get a personalized health plan powered by AI, based on your
                profile data, goals, and preferences.
              </p>
            </div>

            {/* Profile Summary */}
            <Card className="mb-8 text-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Your Profile Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{profile.full_name || "User"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-medium">
                      {profile.age || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium capitalize">
                      {profile.gender || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">BMI</p>
                    <p className="font-medium">
                      {profile.height_cm && profile.weight_kg
                        ? (
                            Number(profile.weight_kg) /
                            (Number(profile.height_cm) / 100) ** 2
                          ).toFixed(1)
                        : "Calculate after generation"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What You'll Get */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                What You'll Get
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Apple className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Nutrition Plan</h3>
                    <p className="text-sm text-gray-600">
                      Personalized calorie targets and meal recommendations
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Activity className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Fitness Plan</h3>
                    <p className="text-sm text-gray-600">
                      Custom workout routines and exercise schedules
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Moon className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Lifestyle Tips</h3>
                    <p className="text-sm text-gray-600">
                      Sleep, stress management, and wellness advice
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGeneratePlan}
              size="lg"
              className="w-full md:w-auto px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate AI Health Plan
            </Button>

            <p className="text-sm text-gray-500 mt-4">
              This will take just a few seconds to create your personalized plan
            </p>
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
                onClick={() => navigate("/dashboard")}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Go to Dashboard
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
