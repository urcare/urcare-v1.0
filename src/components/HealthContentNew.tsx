import { HealthInputBar } from "@/components/HealthInputBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useStickyBottomScroll } from "@/hooks/useStickyBottomScroll";
import { supabase } from "@/integrations/supabase/client";
import { EnhancedPlanNamingService } from "@/services/enhancedPlanNamingService";
import {
  Brain,
  CheckCircle2,
  Droplets,
  Dumbbell,
  Flame,
  Footprints,
  Moon,
  Sun,
  Utensils,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Type definitions for dynamic content
interface DynamicContentItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  time: string;
  isHighlighted: boolean;
  completed?: boolean;
  action?: string;
  type?: string;
  // Added for generated plan options
  difficulty?: "Easy" | "Moderate" | "Hard";
  duration?: string;
  planData?: unknown;
}

interface HealthGoal {
  id: string;
  goal_type: string;
  title: string;
  description?: string;
  status: string;
}

interface HealthPlanActivity {
  id?: string;
  title: string;
  description: string;
  type: string;
  startTime?: string;
  completed?: boolean;
  duration?: number;
  instructions?: string[];
  tips?: string[];
  benefits?: string[];
  nutritionalDetails?: string;
  workoutDetails?: string;
  scientificEvidence?: string;
  priority?: string;
  category?: string;
}

interface HealthPlan {
  id: string;
  day_1_plan?: {
    activities?: HealthPlanActivity[];
  };
}

export const HealthContentNew = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const insightsCardRef = useRef<HTMLDivElement | null>(null);
  // Local state for health plan
  const [currentPlan, setCurrentPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);

  // State management for dynamic content
  const [contentState, setContentState] = useState<
    "health_tips" | "plan_selection" | "upcoming_tasks"
  >("health_tips");
  const [dynamicContent, setDynamicContent] = useState<DynamicContentItem[]>(
    []
  );
  const [sectionTitle, setSectionTitle] = useState("Health Insights");
  const [loading, setLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set()); // Track which items are expanded
  const [scheduleMenuOpen, setScheduleMenuOpen] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [userGoals, setUserGoals] = useState<HealthGoal[]>([]);
  const [goalsLoading, setGoalsLoading] = useState(false);

  // Save health insights to database
  const saveHealthInsights = async (healthScore: number, analysis: string, recommendations: string[]) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('health_insights')
        .insert({
          user_id: user.id,
          health_score: healthScore,
          analysis: analysis,
          recommendations: recommendations
        });

      if (error) {
        console.error('Error saving health insights:', error);
      } else {
        console.log('Health insights saved successfully');
      }
    } catch (error) {
      console.error('Error saving health insights:', error);
    }
  };

  const getFirstName = () => {
    if (profile?.full_name) {
      return profile.full_name.split(" ")[0];
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  // Transform AI-generated health analysis into user-friendly format
  const transformHealthAnalysis = (analysis: string) => {
    // Remove AI-like language and make it more personal
    let transformed = analysis
      .replace(/The user's/g, 'Your')
      .replace(/The user/g, 'You')
      .replace(/user's/g, 'your')
      .replace(/user/g, 'you')
      .replace(/below-average health requiring attention/g, 'room for improvement in your health')
      .replace(/poor sleep habits/g, 'sleep patterns that could be optimized')
      .replace(/inadequate sleep duration/g, 'sleep duration that may need adjustment')
      .replace(/former smoking history/g, 'past smoking history')
      .replace(/negatively impacts/g, 'affects')
      .replace(/uncertain if/g, 'unclear whether')
      .replace(/essential nutritional requirements/g, 'all your nutritional needs')
      .replace(/unknown/g, 'not provided')
      .replace(/assessment challenging/g, 'complete picture difficult')
      .replace(/not provided/g, 'not specified');

    // Add encouraging tone
    if (transformed.includes('room for improvement')) {
      transformed = transformed.replace('room for improvement', 'opportunities to enhance your wellness');
    }

    // Break down long paragraphs into readable sections
    const sentences = transformed.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length > 3) {
      // Group sentences into logical sections
      const sections = [];
      let currentSection = '';
      
      sentences.forEach((sentence, index) => {
        const trimmed = sentence.trim();
        if (trimmed.length === 0) return;
        
        // Add period if missing
        const cleanSentence = trimmed.endsWith('.') ? trimmed : trimmed + '.';
        
        if (index < 2) {
          // First 2 sentences go together
          currentSection += cleanSentence + ' ';
        } else if (index === 2) {
          // Start new section
          if (currentSection.trim()) {
            sections.push(currentSection.trim());
          }
          currentSection = cleanSentence + ' ';
        } else {
          currentSection += cleanSentence + ' ';
        }
      });
      
      if (currentSection.trim()) {
        sections.push(currentSection.trim());
      }
      
      // Format as readable sections
      return sections.map((section, index) => 
        `**${index === 0 ? 'Health Overview' : index === 1 ? 'Key Areas' : 'Recommendations'}:** ${section}`
      ).join('\n\n');
    }

    return transformed;
  };

  // Transform AI recommendations into user-friendly format
  const transformRecommendation = (recommendation: string) => {
    // Remove AI-like language and make it more actionable
    let transformed = recommendation
      .replace(/Establish a consistent sleep schedule by/g, 'Create a regular sleep routine by')
      .replace(/Focus on/g, 'Prioritize')
      .replace(/Consider/g, 'Try')
      .replace(/It is recommended/g, 'We suggest')
      .replace(/should be/g, 'could be')
      .replace(/must be/g, 'should be')
      .replace(/need to/g, 'can')
      .replace(/require/g, 'benefit from')
      .replace(/essential/g, 'helpful')
      .replace(/critical/g, 'important');

    // Add encouraging tone
    if (transformed.startsWith('Create') || transformed.startsWith('Prioritize') || transformed.startsWith('Try')) {
      transformed = `💡 ${transformed}`;
    }

    return transformed;
  };

  const formatTime = (timeString: string) => {
    if (!timeString || timeString === "Anytime") return timeString;

    // Handle different time formats
    let time = timeString;

    // If it has seconds (HH:MM:SS), remove them
    if (time.includes(":") && time.split(":").length === 3) {
      time = time.split(":").slice(0, 2).join(":");
    }

    // Parse the time
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;

    return `${displayHour}:${minutes} ${ampm}`;
  };

  const fetchUserGoals = useCallback(async () => {
    if (!user) return;

    try {
      setGoalsLoading(true);
      const { data: goals, error } = await supabase
        .from("user_health_goals")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("priority", { ascending: true })
        .limit(3); // Show top 3 goals

      if (error) throw error;
      setUserGoals(goals || []);
    } catch (error) {
      console.error("Error fetching user goals:", error);
      setUserGoals([]);
    } finally {
      setGoalsLoading(false);
    }
  }, [user]);

  const toggleItemExpansion = (index: number) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };

  const handlePlanGenerate = async (goal: string) => {
    if (!user || !profile) {
      toast.error("Please log in to generate health plans");
      return;
    }

    // Redirect to health plan generation
    navigate("/health-plan-generation", {
      state: {
        goal: goal,
        fromHealthPlan: true,
      },
    });
  };

  // Content loading functions
  const loadPersonalizedTips = useCallback(async () => {
    const tips = [] as DynamicContentItem[];

    // Try to get AI-generated health data from Dashboard state or localStorage
    let aiHealthData = null;
    try {
      // Check if we have AI data in localStorage (passed from Dashboard)
      const storedHealthData = localStorage.getItem('aiHealthData');
      if (storedHealthData) {
        aiHealthData = JSON.parse(storedHealthData);
      }
    } catch (error) {
      console.warn('Failed to load AI health data:', error);
    }

    if (aiHealthData && aiHealthData.healthScoreAnalysis) {
      // Transform AI analysis into user-friendly format
      const userFriendlyAnalysis = transformHealthAnalysis(aiHealthData.healthScoreAnalysis);
      
      // Save insights to database
      if (aiHealthData.healthScore && aiHealthData.healthScoreRecommendations) {
        saveHealthInsights(
          aiHealthData.healthScore,
          userFriendlyAnalysis,
          aiHealthData.healthScoreRecommendations
        );
      }
      
      // Use AI-generated health analysis as the main insight
      tips.push({
        id: "1",
        title: "Your Health Overview",
        description: userFriendlyAnalysis,
        icon: <Brain className="w-6 h-6 text-logo-text" />,
        time: "Updated",
        isHighlighted: true,
      });

      // Add AI recommendations as individual tips
      if (aiHealthData.healthScoreRecommendations && aiHealthData.healthScoreRecommendations.length > 0) {
        aiHealthData.healthScoreRecommendations.slice(0, 3).forEach((recommendation: string, index: number) => {
          const userFriendlyRec = transformRecommendation(recommendation);
          tips.push({
            id: `ai-rec-${index + 2}`,
            title: `Action Step ${index + 1}`,
            description: userFriendlyRec,
            icon: <CheckCircle2 className="w-6 h-6 text-logo-text" />,
            time: "Priority",
            isHighlighted: false,
          });
        });
      }
    } else {
      // Fallback to generic tips if no AI data available
      // Age-specific hydration tip
      tips.push({
        id: "1",
        title: "Start Your Day with Hydration",
        description: `Based on your ${
          profile?.age || 30
        }-year-old profile, drink 16oz of water upon waking to kickstart metabolism`,
        icon: <Droplets className="w-6 h-6 text-logo-text" />,
        time: "Morning",
        isHighlighted: true,
      });

      // Schedule-based sleep tip
      tips.push({
        id: "2",
        title: "Optimize Your Sleep Schedule",
        description: `Your ideal bedtime is ${
          profile?.sleep_time || "10:00 PM"
        } for 7-8 hours of quality rest`,
        icon: <Moon className="w-6 h-6 text-logo-text" />,
        time: "Tonight",
        isHighlighted: false,
      });

      // Gender-specific exercise tip
      tips.push({
        id: "3",
        title: "Personalized Movement Plan",
        description: `${
          profile?.gender === "female" ? "Women benefit from" : "Men benefit from"
        } strength training 3x/week for bone health`,
        icon: <Dumbbell className="w-6 h-6 text-logo-text" />,
        time: "This Week",
        isHighlighted: false,
      });

      // Condition-specific tips
      if (profile?.chronic_conditions && profile.chronic_conditions.length > 0) {
        tips.push({
          id: "4",
          title: "Manage Your Health Conditions",
          description: `Focus on anti-inflammatory foods for your ${profile.chronic_conditions[0]} management`,
          icon: <CheckCircle2 className="w-6 h-6 text-logo-text" />,
          time: "Daily",
          isHighlighted: false,
        });
      }

      // Diet-specific tip
      if (profile?.diet_type) {
        tips.push({
          id: "5",
          title: `${profile.diet_type} Diet Optimization`,
          description: `Meal prep strategies specifically designed for your ${profile.diet_type.toLowerCase()} lifestyle`,
          icon: <Utensils className="w-6 h-6 text-logo-text" />,
          time: "Meal Times",
          isHighlighted: false,
        });
      }
    }

    setDynamicContent(tips);
  }, [profile]);

  const loadHealthPlans = useCallback(async (goals: HealthGoal[]) => {
    const plans: DynamicContentItem[] = [
      {
        id: "1",
        title: "Comprehensive Health Protocol",
        description: "AI-generated plan based on your specific health goals",
        icon: <Flame className="w-6 h-6 text-logo-text" />,
        time: "4-12 weeks",
        isHighlighted: true,
        action: "generate_comprehensive",
      },
      {
        id: "2",
        title: "Quick Start 2-Day Protocol",
        description:
          "Get started immediately with a focused 2-day health protocol",
        icon: <Flame className="w-6 h-6 text-logo-text" />,
        time: "2 days",
        isHighlighted: false,
        action: "generate_quick",
      },
    ];

    // Add goal-specific plans
    const goalTypes = goals.map((g) => g.goal_type);

    if (goalTypes.includes("weight_loss")) {
      plans.push({
        id: "3",
        title: "Weight Management Protocol",
        description:
          "Sustainable weight management through nutrition and exercise",
        icon: "⚖️",
        time: "8-16 weeks",
        isHighlighted: false,
        action: "generate_weight_loss",
      });
    }

    if (goalTypes.includes("fitness")) {
      plans.push({
        id: "4",
        title: "Fitness & Strength Protocol",
        description:
          "Build muscle and improve cardiovascular health through structured protocol",
        icon: "🏋️",
        time: "12 weeks",
        isHighlighted: false,
        action: "generate_fitness",
      });
    }

    setDynamicContent(plans);
  }, []);

  const getActivityIcon = (type: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      workout: <Dumbbell className="w-6 h-6 text-logo-text" />,
      meal: <Utensils className="w-6 h-6 text-logo-text" />,
      hydration: <Droplets className="w-6 h-6 text-logo-text" />,
      sleep: <Moon className="w-6 h-6 text-logo-text" />,
      meditation: <Brain className="w-6 h-6 text-logo-text" />,
      walk: <Footprints className="w-6 h-6 text-logo-text" />,
      morning: <Sun className="w-6 h-6 text-logo-text" />,
      default: <CheckCircle2 className="w-6 h-6 text-logo-text" />,
    };
    return iconMap[type] || iconMap["default"];
  };

  const loadUpcomingTasks = useCallback(async (activePlan: HealthPlan) => {
    const tasks: DynamicContentItem[] = [];

    if (activePlan && activePlan.day_1_plan) {
      // Extract today's activities from the plan
      const todaysPlan = activePlan.day_1_plan;

      if (todaysPlan.activities) {
        todaysPlan.activities.forEach((activity, index: number) => {
          // Create detailed description with all available information
          let detailedDescription = activity.description || "";

          // Add duration if available
          if (activity.duration) {
            detailedDescription += `\n⏱️ Duration: ${activity.duration} minutes`;
          }

          // Add instructions if available
          if (
            activity.instructions &&
            Array.isArray(activity.instructions) &&
            activity.instructions.length > 0
          ) {
            detailedDescription += `\n📋 Instructions:\n${activity.instructions
              .map((inst) => `• ${inst}`)
              .join("\n")}`;
          }

          // Add tips if available
          if (
            activity.tips &&
            Array.isArray(activity.tips) &&
            activity.tips.length > 0
          ) {
            detailedDescription += `\n💡 Tips:\n${activity.tips
              .map((tip) => `• ${tip}`)
              .join("\n")}`;
          }

          // Add benefits if available
          if (
            activity.benefits &&
            Array.isArray(activity.benefits) &&
            activity.benefits.length > 0
          ) {
            detailedDescription += `\n🎯 Benefits:\n${activity.benefits
              .map((benefit) => `• ${benefit}`)
              .join("\n")}`;
          }

          // Add nutritional details for meals
          if (activity.type === "meal" && activity.nutritionalDetails) {
            detailedDescription += `\n🍽️ Nutrition: ${activity.nutritionalDetails}`;
          }

          // Add workout details for exercises
          if (activity.type === "exercise" && activity.workoutDetails) {
            detailedDescription += `\n💪 Workout: ${activity.workoutDetails}`;
          }

          tasks.push({
            id: activity.id || `task-${index}`,
            title: activity.title,
            description: detailedDescription,
            icon: getActivityIcon(activity.type),
            time: formatTime(activity.startTime || "Anytime"),
            isHighlighted: index === 0,
            completed: activity.completed || false,
            type: activity.type,
            duration: activity.duration
              ? `${activity.duration} min`
              : undefined,
          });
        });
      }
    }

    // No fallback tasks - let the user know they need to generate a plan
    if (tasks.length === 0) {
      tasks.push({
        id: "no-plan",
        title: "No Active Health Plan",
        description:
          "Generate a personalized health plan to see your daily protocol",
        icon: <div className="w-6 h-6 text-logo-text">🎯</div>,
        time: "Generate Plan",
        isHighlighted: true,
        completed: false,
        action: "generate_plan",
      });
    }

    setDynamicContent(tasks);
  }, []);

  const handleContentClick = async (item: DynamicContentItem) => {
    if (contentState === "plan_selection") {
      // Handle plan generation
      setLoading(true);
      try {
        if (item.action === "generate_comprehensive") {
          // Use existing comprehensive health plan service
          const { comprehensiveHealthPlanService } = await import(
            "@/services/comprehensiveHealthPlanService"
          );
          await comprehensiveHealthPlanService.createPlan({
            plan_name: "Comprehensive Health Plan",
            primary_goal: "Improve overall health",
            duration_weeks: 12,
            difficulty: "Intermediate",
            plan_start_date: new Date().toISOString(),
            target_conditions: []
          });
          toast.success("Comprehensive health protocol generated!");

          // Refresh to show new tasks
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else if (item.action === "generate_quick") {
          // Use existing health plan service
          const { supabase } = await import("@/integrations/supabase/client");
          const { data, error } = await supabase.functions.invoke(
            "generate-ai-health-coach-plan",
            {
              method: "POST",
              body: {},
              headers: {
                Authorization: `Bearer ${
                  (
                    await supabase.auth.getSession()
                  ).data.session?.access_token
                }`,
              },
            }
          );

          if (error) {
            throw new Error(error.message);
          }

          if (data.success) {
            toast.success("Quick start protocol generated!");
            // Refresh to show new tasks
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            throw new Error(data.error || "Failed to generate protocol");
          }
        } else if (item.action === "view_plan_option" && item.planData) {
          // Navigate to calendar with the selected plan details
          navigate("/plan-details", {
            state: {
              planData: item.planData,
              fromGeneration: true,
              preview: true,
            },
          });
        }
      } catch (error) {
        console.error("Error generating protocol:", error);
        toast.error("Failed to generate protocol");
      } finally {
        setLoading(false);
      }
    } else if (contentState === "upcoming_tasks") {
      // Handle task completion
      const updatedContent = dynamicContent.map((task) =>
        task.id === item.id ? { ...task, completed: !task.completed } : task
      );
      setDynamicContent(updatedContent);
      toast.success(
        item.completed ? "Task marked incomplete" : "Task completed!"
      );
    }
  };

  // Schedule card menu handlers
  const handleScheduleEdit = async () => {
    try {
      setScheduleMenuOpen(false);
      navigate("/calendar", {
        state: { openEdit: true, preview: false },
      });
    } catch (e) {
      console.error("Failed to navigate for edit", e);
    }
  };

  const handleScheduleChange = async () => {
    try {
      setScheduleMenuOpen(false);
      // Show plan selection so user can pick another plan
      setContentState("plan_selection");
      setSectionTitle("Recommended Plans");
      // Attempt to load goals and show plan options
      try {
        if (!user) return;
        const { data: goals } = await supabase
          .from("user_health_goals")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active");
        const typedGoals = (goals || []) as unknown as HealthGoal[];
        await loadHealthPlans(typedGoals);
      } catch (e) {
        console.warn("Failed to load goals for change plan", e);
      }
    } catch (e) {
      console.error("Change plan failed", e);
    }
  };

  const handleScheduleRemove = async () => {
    try {
      setScheduleMenuOpen(false);
      if (!user) {
        toast.error("Please log in");
        return;
      }
      toast.loading("Removing your active protocol...", { id: "remove-plan" });
      // Delete active plan instead of update to avoid unique constraint conflicts
      const { error } = await supabase
        .from("two_day_health_plans")
        .delete()
        .eq("user_id", user.id)
        .eq("is_active", true);
      if (error) throw error;

      // Refresh the health plan state to reflect the removal
      setCurrentPlan(null);

      toast.success("Protocol removed", { id: "remove-plan" });
      // After removal, return to insights
      setContentState("health_tips");
      setSectionTitle("Health Insights");
      await loadPersonalizedTips();
    } catch (e) {
      console.error("Remove protocol failed", e);
      toast.error("Failed to remove protocol", { id: "remove-plan" });
    }
  };

  // State detection logic
  useEffect(() => {
    if (!user || !profile) return;

    const determineUserState = async () => {
      // Fetch user goals
      await fetchUserGoals();
      setLoading(true);
      try {
        // Check if we're coming from a saved plan
        if (location.state?.planSaved) {
          setContentState("upcoming_tasks");
          setSectionTitle("Your Health Protocol");
          // Load the most recent active plan
          const { data: activePlan } = await supabase
            .from("two_day_health_plans")
            .select("*")
            .eq("user_id", user.id)
            .eq("is_active", true)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          if (activePlan) {
            await loadUpcomingTasks(activePlan);
          }
          // Show success message
          toast.success(
            "Protocol saved successfully! Your protocol is now active."
          );
          return;
        }

        // Check if we should show insights
        if (location.state?.showInsights) {
          setContentState("health_tips");
          setSectionTitle("Health Insights");
          await loadPersonalizedTips();
          return;
        }
        // Check for active comprehensive health plans (only saved plans)
        const { data: activePlans } = await supabase
          .from("comprehensive_health_plans")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active");

        // Check for active 2-day plans as fallback (only saved plans)
        const { data: twoDayPlans } = await supabase
          .from("two_day_health_plans")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_active", true);

        // Only show plans if they are actually saved in the database
        if (
          (activePlans && activePlans.length > 0) ||
          (twoDayPlans && twoDayPlans.length > 0)
        ) {
          setContentState("upcoming_tasks");
          setSectionTitle("Today's Protocol");
          await loadUpcomingTasks(activePlans?.[0] || twoDayPlans?.[0]);
        } else {
          // No saved plans found - show health insights or plan selection
          // Check for user health goals to determine if we should show plan generation
          const { data: goals } = await supabase
            .from("user_health_goals")
            .select("*")
            .eq("user_id", user.id)
            .eq("status", "active");

          if (goals && goals.length > 0) {
            // User has goals but no saved plan - show plan selection
            setContentState("plan_selection");
            setSectionTitle("Recommended Plans");
            await loadHealthPlans(goals as unknown as HealthGoal[]);
          } else {
            // No goals and no saved plan - show health insights
            setContentState("health_tips");
            setSectionTitle("Health Insights");
            await loadPersonalizedTips();
          }
        }
      } catch (error) {
        console.error("Error determining user state:", error);
        setContentState("health_tips");
        setSectionTitle("Health Insights");
        await loadPersonalizedTips();
      } finally {
        setLoading(false);
      }
    };

    determineUserState();
  }, [
    user,
    profile,
    loadPersonalizedTips,
    loadHealthPlans,
    loadUpcomingTasks,
    location.state,
  ]);

  const {
    cardRef: stickyRef,
    visibleItems,
    isSticky,
  } = useStickyBottomScroll();

  // Health score data
  // Local state for health score
  const [healthData, setHealthData] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);

  return (
    <div className="h-screen flex flex-col relative">
      {/* Non-blocking Plan Generation Modal */}
      {generatingPlan && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 relative">
            {/* Close button */}
            <button
              onClick={() => setGeneratingPlan(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-blue-600 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Generating Your Health Protocol
              </h3>

              <p className="text-gray-600 mb-6">
                Creating a personalized protocol based on your goals and
                preferences... You can continue using the app while this runs in the background.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> You can close this popup and continue using the app. 
                  We'll notify you when your plan is ready!
                </p>
              </div>

              {/* Progress Steps */}
              <div className="space-y-3 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Analyzing your profile...</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span>Creating nutrition protocol...</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span>Building exercise routine...</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span>Finalizing your protocol...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Header with User Info - White Container */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white px-6 py-4 rounded-b-[3rem] shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 ring-2 ring-white/50 shadow-lg">
              <AvatarImage
                src={
                  user?.user_metadata?.avatar_url ||
                  user?.user_metadata?.picture ||
                  "/images/profile-placeholder.jpg"
                }
                alt={profile?.full_name || user?.email || "User"}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-bold">
                {(profile?.full_name || user?.email || "U")
                  .charAt(0)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-black">
                Hi {getFirstName()}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-12 h-12 bg-red-50 hover:bg-red-100 rounded-full flex items-center justify-center transition-colors duration-200 group"
              title="Logout"
            >
              <svg
                className="w-6 h-6 text-red-500 group-hover:text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>

            {/* Notification Icon */}
            <div className="relative">
              <div className="w-12 h-12 rounded-full flex items-center justify-center">
                <img
                  src="/icons/notification.png"
                  alt="notification"
                  className="w-6 h-6"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area - with top padding to account for fixed header */}
      <div className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-y-auto pt-24 px-4">
        {/* Health Dashboard Card - Modern Slate/Blue with Health Score & Weekly View */}
        <div className="py-4">
          <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-[3rem] p-8 w-full shadow-xl">
            <div className="flex flex-col">
              {/* Headers Row - HEALTH SCORE */}
              <div className="flex items-center gap-8 mb-3">
                <div className="text-white text-sm font-medium ml-2">
                  HEALTH SCORE
                </div>
              </div>

              {/* Icons Row - Health Score and Activity Icons */}
              <div className="flex items-center justify-between">
                {/* Health Score Icon */}
                <div className="relative w-16 h-16">
                  {healthLoading ? (
                    <div className="w-16 h-16 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <svg
                      className="w-16 h-16 transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      {/* Background Circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="8"
                        fill="none"
                      />
                      {/* Progress Circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#F59E0B"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${
                          2 *
                          Math.PI *
                          40 *
                          (1 - (healthData?.score || 0) / 100)
                        }`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                  )}

                  {/* Center Score */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">
                      {healthData?.score || 0}
                    </span>
                  </div>
                </div>

                {/* User Health Goals / Current Plan */}
                <div className="flex flex-col gap-2 mr-2 max-w-xs">
                  {planLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-white text-sm">
                        Loading plan...
                      </span>
                    </div>
                  ) : currentPlan ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                      <span className="text-white text-sm font-medium truncate">
                        {currentPlan.plan_data?.plan_name ||
                          currentPlan.plan_data?.title ||
                          (currentPlan as any)?.plan_name ||
                          "Active Health Plan"}
                      </span>
                    </div>
                  ) : goalsLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-white text-sm">
                        Loading goals...
                      </span>
                    </div>
                  ) : userGoals.length > 0 ? (
                    userGoals.map((goal, index) => (
                      <div key={goal.id} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                        <span className="text-white text-sm font-medium truncate">
                          {goal.title}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white/50 rounded-full flex-shrink-0"></div>
                      <span className="text-white/80 text-sm">
                        Set your health goals
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Row - Streak Counter and Score Boost */}
              <div className="flex items-center gap-6 mt-3 ml-2">
                {/* Streak Counter */}
                <div className="flex items-center gap-1">
                  <span className="text-xl">🔥</span>
                  <span className="text-white text-sm font-medium">
                    {healthData?.streak_days || 0} Days
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Goal Input Bar - Only show when no active plan */}
        {contentState !== "upcoming_tasks" && (
          <div className="py-4">
            <HealthInputBar onPlanGenerate={handlePlanGenerate} />
          </div>
        )}

        {/* Dynamic Upcoming Tasks Section - White Card */}
        <div className="py-4">
          <div
            ref={stickyRef}
            className={`bg-white rounded-[3rem] p-4 shadow-lg flex flex-col overflow-hidden ${
              isSticky ? "sticky-bottom" : ""
            }`}
            style={{ maxHeight: "75vh" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 relative flex-none">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-black">{sectionTitle}</h2>
              </div>
              <div className="relative">
                <button
                  onClick={() => setScheduleMenuOpen((v) => !v)}
                  className="text-gray-600 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
                  title="Settings"
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
                {contentState === "upcoming_tasks" && scheduleMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-20">
                    <button
                      onClick={handleScheduleEdit}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg"
                    >
                      Edit protocol
                    </button>
                    <button
                      onClick={handleScheduleChange}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Change protocol
                    </button>
                    <button
                      onClick={handleScheduleRemove}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-b-lg"
                    >
                      Remove protocol
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto pr-1">
              {/* Dynamic Content */}
              <div className="space-y-4">
                {loading ? (
                  <div className="space-y-3">
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-24 bg-gray-100 rounded-2xl animate-pulse"></div>
                    <div className="h-24 bg-gray-100 rounded-2xl animate-pulse"></div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <svg
                        className="w-4 h-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      <span>Loading...</span>
                    </div>
                  </div>
                ) : (
                  dynamicContent.map((item, index) => {
                    const isExpanded = expandedItems.has(index);
                    const isNewItem = index >= 2;
                    const isPlanOption = item.action === "view_plan_option";
                    return (
                      <div
                        key={item.id}
                        className={`rounded-[3rem] bg-card-secondary text-logo-text hover:bg-card-secondary/80 ${
                          item.completed ? "opacity-60" : ""
                        } ${isNewItem ? "fade-in-up" : ""}`}
                      >
                        {/* Header - Always visible */}
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 aspect-square rounded-full flex items-center justify-center text-2xl border-2 bg-card-bg border-border-accent">
                              {item.icon}
                            </div>
                            <div>
                              <h3
                                className={`font-bold text-xl text-logo-text ${
                                  item.completed ? "line-through" : ""
                                }`}
                              >
                                {item.title}
                              </h3>
                              {isPlanOption && (
                                <div className="text-sm text-text-secondary mt-1">
                                  <span className="mr-3">
                                    Duration: {item.duration}
                                  </span>
                                  <span>Difficulty: {item.difficulty}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {!isPlanOption && (
                              <div className="text-right">
                                <p className="text-sm text-text-secondary">
                                  {item.time}
                                </p>
                              </div>
                            )}
                            {isPlanOption ? (
                              <button
                                onClick={() => handleContentClick(item)}
                                className="px-4 py-2 bg-accent text-foreground rounded-full hover:bg-accent/90 transition-colors"
                              >
                                View protocol details
                              </button>
                            ) : (
                              <button
                                onClick={() => toggleItemExpansion(index)}
                                className="transition-transform duration-200 text-gray-600"
                              >
                                <svg
                                  className="w-6 h-6"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  style={{
                                    transform: isExpanded
                                      ? "rotate(180deg)"
                                      : "rotate(0deg)",
                                  }}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Expandable Content (not used for plan options) */}
                        {!isPlanOption && isExpanded && (
                          <div className="px-4 pb-4 border-t border-gray-200">
                            <div className="pt-4">
                              <div className="space-y-3 text-gray-700">
                                <div className="text-sm leading-relaxed whitespace-pre-line">
                                  {item.description.split('\n').map((line, index) => {
                                    if (line.startsWith('**') && line.includes(':**')) {
                                      const [boldPart, ...rest] = line.split(':**');
                                      const boldText = boldPart.replace('**', '');
                                      const normalText = rest.join(':**');
                                      return (
                                        <div key={index} className="mb-2">
                                          <span className="font-semibold text-gray-900">{boldText}:</span>
                                          <span className="text-gray-700">{normalText}</span>
                                        </div>
                                      );
                                    }
                                    return <div key={index} className="mb-1">{line}</div>;
                                  })}
                                </div>
                                {item.duration && (
                                  <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                                    <span className="text-blue-600 font-medium">
                                      ⏱️ Duration: {item.duration}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
