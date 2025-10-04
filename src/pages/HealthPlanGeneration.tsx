import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { saveSelectedHealthPlan } from '@/services/healthPlanService';
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Flame, 
  Target, 
  Dumbbell,
  TrendingUp,
  Zap,
  Heart,
  Utensils,
  Moon,
  Droplets,
  Brain,
  Star,
  Calendar,
  Activity,
  ArrowRight,
  Play
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HealthPlan {
  id: string;
  title: string;
  description: string;
  duration?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  focusAreas?: string[];
  estimatedCalories?: number;
  equipment?: string[];
  benefits?: string[];
}

const difficultyColors = {
  Beginner: "bg-green-100 text-green-800 border-green-200",
  Intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Advanced: "bg-red-100 text-red-800 border-red-200"
};

const difficultyIcons = {
  Beginner: "🟢",
  Intermediate: "🟡", 
  Advanced: "🔴"
};

const getActivityIcon = (type: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    nutrition: <Utensils className="w-4 h-4" />,
    exercise: <Dumbbell className="w-4 h-4" />,
    sleep: <Moon className="w-4 h-4" />,
    hydration: <Droplets className="w-4 h-4" />,
    meditation: <Brain className="w-4 h-4" />,
    other: <Target className="w-4 h-4" />
  };
  return iconMap[type] || <Target className="w-4 h-4" />;
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const HealthPlanGeneration: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<HealthPlan | null>(null);

  useEffect(() => {
    if (location.state?.selectedPlan) {
      setSelectedPlan(location.state.selectedPlan);
    } else {
      // If no plan selected, redirect back to dashboard
      navigate('/dashboard');
    }
  }, [location.state, navigate]);

  const getDifficultyLabel = (difficulty: string) => {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  const getMetricIcon = (metric: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      calories: <Flame className="w-4 h-4" />,
      duration: <Clock className="w-4 h-4" />,
      focus: <Target className="w-4 h-4" />,
      equipment: <Dumbbell className="w-4 h-4" />,
      benefits: <Star className="w-4 h-4" />,
      difficulty: <Zap className="w-4 h-4" />
    };
    return iconMap[metric] || <Target className="w-4 h-4" />;
  };

  const getMetricLabel = (metric: string) => {
    const labelMap: { [key: string]: string } = {
      calories: "Calories per Session",
      duration: "Duration", 
      focus: "Focus Areas",
      equipment: "Equipment",
      benefits: "Key Benefits",
      difficulty: "Difficulty Level"
    };
    return labelMap[metric] || metric;
  };

  const handleStartPlan = async () => {
    if (!selectedPlan || !user) {
      toast.error("Please log in to start a plan");
      return;
    }

    try {
      // Save the selected plan
      const result = await saveSelectedHealthPlan(user.id, selectedPlan);
      
      if (result.success) {
        toast.success(`Plan "${selectedPlan.title}" saved and started!`);
        
        // Navigate back to dashboard with the plan saved
        navigate('/dashboard', { 
          state: { 
            planSaved: true,
            selectedPlan: selectedPlan,
            showTodaysSchedule: true
          } 
        });
      } else {
        toast.error("Failed to save plan. Please try again.");
      }
    } catch (error) {
      console.error("Error saving plan:", error);
      toast.error("Failed to save plan. Please try again.");
    }
  };

  const handleGoBack = () => {
    // Navigate back to dashboard with the generated plans preserved
    navigate('/dashboard', { 
      state: { 
        preserveHealthPlans: true,
        generatedPlans: location.state?.generatedPlans || []
      } 
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to continue</h2>
          <Button onClick={() => navigate('/')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No plan selected</h2>
          <Button onClick={handleGoBack}>Go Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header with Background Image */}
      <div
        className="px-6 pt-12 pb-16 relative"
        style={{
          backgroundImage: "url(/images/imgg.JPG)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "300px",
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="flex justify-between items-start relative z-10">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleGoBack}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                {selectedPlan.title}
              </h1>
                <p className="text-white text-sm">
                  {selectedPlan.duration || 'Not specified'} • {selectedPlan.difficulty || 'Not specified'} Level
                </p>
            </div>
          </div>
          <div className="text-white">
            <div className="flex items-center gap-1 text-emerald-400 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Selected Plan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-t-3xl relative z-10 min-h-screen -mt-8">
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        <div className="px-6">
          {/* Plan Details */}
          <h2 className="text-2xl font-bold text-black mb-4">
            Plan Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 -mx-6">
            <div className="rounded-2xl bg-white p-4">
              <h3 className="text-lg font-semibold text-black mb-2">Summary</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <div>
                  <strong>Name:</strong> {selectedPlan.title}
                </div>
                <div>
                  <strong>Description:</strong> {selectedPlan.description}
                </div>
                <div>
                  <strong>Duration:</strong> {selectedPlan.duration || 'Not specified'}
                </div>
                <div>
                  <strong>Difficulty:</strong> {selectedPlan.difficulty || 'Not specified'}
                </div>
                <div>
                  <strong>Calories per Session:</strong> {selectedPlan.estimatedCalories || 'Not specified'}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <h3 className="text-lg font-semibold text-black mb-2">
                Focus Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedPlan.focusAreas?.map((area, idx) => (
                  <Badge key={idx} variant="secondary" className="text-sm">
                    {area}
                  </Badge>
                )) || <span className="text-sm text-gray-500">No focus areas specified</span>}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <h3 className="text-lg font-semibold text-black mb-2">Equipment</h3>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                {selectedPlan.equipment?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                )) || <li className="text-gray-500">No equipment specified</li>}
              </ul>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <h3 className="text-lg font-semibold text-black mb-2">
                Key Benefits
              </h3>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                {selectedPlan.benefits?.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                )) || <li className="text-gray-500">No benefits specified</li>}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-black mb-2">
              Plan Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-700">
              <div>
                <strong>Duration</strong>
                <p className="mt-1">{selectedPlan.duration} program</p>
              </div>
              <div>
                <strong>Focus Areas</strong>
                <p className="mt-1">{selectedPlan.focusAreas?.length || 0} key areas</p>
              </div>
              <div>
                <strong>Equipment</strong>
                <p className="mt-1">{selectedPlan.equipment?.length || 0} items needed</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 pb-8">
            <Button 
              onClick={handleStartPlan}
              className="flex-1 bg-black hover:bg-gray-800 text-white py-3 rounded-lg"
            >
              <Play className="w-4 h-4 mr-2" />
              Start This Plan
            </Button>
            <Button 
              onClick={handleGoBack}
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg"
            >
              Choose Different Plan
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthPlanGeneration;