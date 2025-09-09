import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { twoDayPlanService } from "@/services/twoDayPlanService";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Loader2,
  Sparkles,
  Target,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface PlanGeneratorProps {
  onPlanGenerated?: () => void;
  hasActivePlan?: boolean;
}

export const PlanGenerator: React.FC<PlanGeneratorProps> = ({
  onPlanGenerated,
  hasActivePlan = false,
}) => {
  const { profile } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = async () => {
    if (!profile) {
      toast.error("Please complete your profile first");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      await twoDayPlanService.generateTwoDayPlan({
        userProfile: profile,
      });

      toast.success("Your personalized 2-day health plan has been generated!", {
        description: "Start working on your goals today.",
      });

      onPlanGenerated?.();
    } catch (error: any) {
      console.error("Error generating plan:", error);
      const errorMessage =
        error.message || "Failed to generate your health plan";
      setError(errorMessage);
      toast.error("Plan Generation Failed", {
        description: errorMessage,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Check if user profile is complete enough for plan generation
  const isProfileIncomplete =
    !profile?.health_goals?.length || !profile?.age || !profile?.gender;

  if (hasActivePlan) {
    return (
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <CheckCircle2 className="h-12 w-12 text-blue-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Active Plan in Progress
          </h3>
          <p className="text-blue-700 mb-4">
            You currently have an active 2-day health plan. Complete it to
            automatically generate your next plan.
          </p>
          <Badge variant="outline" className="bg-white">
            Plan Active
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Generate Your Personalized Health Plan
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {isProfileIncomplete && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please complete your profile (health goals, age, gender) to
              generate a personalized plan.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>2-day personalized plan</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Target className="h-4 w-4" />
            <span>Based on your health goals and profile</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Sparkles className="h-4 w-4" />
            <span>AI-powered recommendations</span>
          </div>
        </div>

        {profile?.health_goals && profile.health_goals.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Your Health Goals:</p>
            <div className="flex flex-wrap gap-1">
              {profile.health_goals.map((goal, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {goal}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={handleGeneratePlan}
          disabled={isGenerating || isProfileIncomplete}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Your Plan...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate My 2-Day Plan
            </>
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Your plan will include personalized workouts, meals, and wellness
          activities based on your profile and goals.
        </p>
      </CardContent>
    </Card>
  );
};
