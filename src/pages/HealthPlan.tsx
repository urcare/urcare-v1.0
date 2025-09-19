import { HealthContentNew } from "@/components/HealthContentNew";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, Calendar } from "lucide-react";
import React from "react";

const HealthPlan: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please log in to access your personalized health plans.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2 mb-4">
            <Calendar className="h-8 w-8" />
            Comprehensive Health Plans
          </h1>
          <p className="text-gray-600">
            Create realistic, evidence-based health plans with proper duration
            tracking
          </p>
        </div>

        {/* New Comprehensive Health Plan System */}
        <HealthContentNew />

        {/* Test Link */}
        <div className="mt-8 text-center">
          <a
            href="/test-comprehensive-health-plan"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🧪 Test Comprehensive Health Plan System
          </a>
        </div>
      </div>
    </div>
  );
};

export default HealthPlan;
