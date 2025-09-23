import { HealthInputBar } from "@/components/HealthInputBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useHealthScore } from "@/hooks/useHealthScore";
import { useStickyBottomScroll } from "@/hooks/useStickyBottomScroll";
import { supabase } from "@/integrations/supabase/client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Type definitions for dynamic content
interface DynamicContentItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  time: string;
  isHighlighted: boolean;
  completed?: boolean;
  action?: string;
  type?: string;
}

interface HealthGoal {
  id: string;
  goal_type: string;
  title: string;
  description?: string;
  status: string;
}

interface HealthPlan {
  id: string;
  day_1_plan?: {
    activities?: Array<{
      id?: string;
      title: string;
      description: string;
      type: string;
      startTime?: string;
      completed?: boolean;
    }>;
  };
}

export const HealthContentNew = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const insightsCardRef = useRef<HTMLDivElement | null>(null);

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

  const getFirstName = () => {
    if (profile?.full_name) {
      return profile.full_name.split(" ")[0];
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

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

    try {
      toast.loading("Generating your personalized health plan...", {
        id: "plan-generation",
      });

      // Use the enhanced AI health coach plan generation instead
      const { data, error } = await supabase.functions.invoke(
        "generate-ai-health-coach-plan",
        {
          method: "POST",
          body: { goal: goal }, // Pass the user's goal
          headers: {
            Authorization: `Bearer ${
              (
                await supabase.auth.getSession()
              ).data.session?.access_token
            }`,
          },
        }
      );

      const result = {
        success: !error && data?.success,
        plan: data?.plan,
        error: error?.message || data?.error,
      };

      if (result.success) {
        toast.success(
          "Health plan generated successfully! Redirecting to your calendar...",
          {
            id: "plan-generation",
          }
        );

        // Navigate to calendar page to show the generated plan
        setTimeout(() => {
          navigate("/calendar", {
            state: {
              planData: result.plan,
              fromGeneration: true,
            },
          });
        }, 1500);
      } else {
        toast.error(result.error || "Failed to generate health plan", {
          id: "plan-generation",
        });
      }
    } catch (error) {
      console.error("Error generating health plan:", error);
      toast.error("An error occurred while generating your health plan", {
        id: "plan-generation",
      });
    }
  };

  // Content loading functions
  const loadPersonalizedTips = useCallback(async () => {
    const tips = [];

    // Age-specific hydration tip
    tips.push({
      id: "1",
      title: "Start Your Day with Hydration",
      description: `Based on your ${
        profile?.age || 30
      }-year-old profile, drink 16oz of water upon waking to kickstart metabolism`,
      icon: "💧",
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
      icon: "😴",
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
      icon: "💪",
      time: "This Week",
      isHighlighted: false,
    });

    // Condition-specific tips
    if (profile?.chronic_conditions && profile.chronic_conditions.length > 0) {
      tips.push({
        id: "4",
        title: "Manage Your Health Conditions",
        description: `Focus on anti-inflammatory foods for your ${profile.chronic_conditions[0]} management`,
        icon: "🩺",
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
        icon: "🥗",
        time: "Meal Times",
        isHighlighted: false,
      });
    }

    setDynamicContent(tips);
  }, [profile]);

  const loadHealthPlans = useCallback(async (goals: HealthGoal[]) => {
    const plans = [
      {
        id: "1",
        title: "Comprehensive Health Plan",
        description: "AI-generated plan based on your specific health goals",
        icon: "🎯",
        time: "4-12 weeks",
        isHighlighted: true,
        action: "generate_comprehensive",
      },
      {
        id: "2",
        title: "Quick Start 2-Day Plan",
        description: "Get started immediately with a focused 2-day health plan",
        icon: "⚡",
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
        title: "Weight Management Plan",
        description: "Sustainable weight loss through nutrition and exercise",
        icon: "⚖️",
        time: "8-16 weeks",
        isHighlighted: false,
        action: "generate_weight_loss",
      });
    }

    if (goalTypes.includes("fitness")) {
      plans.push({
        id: "4",
        title: "Fitness & Strength Plan",
        description: "Build muscle and improve cardiovascular health",
        icon: "🏋️",
        time: "12 weeks",
        isHighlighted: false,
        action: "generate_fitness",
      });
    }

    setDynamicContent(plans);
  }, []);

  const getActivityIcon = (type: string) => {
    const iconMap: { [key: string]: string } = {
      workout: "🏋️",
      meal: "🍽️",
      hydration: "💧",
      sleep: "😴",
      meditation: "🧘",
      walk: "🚶",
      morning: "🌅",
      default: "✅",
    };
    return iconMap[type] || iconMap["default"];
  };

  const loadUpcomingTasks = useCallback(async (activePlan: HealthPlan) => {
    const tasks = [];

    if (activePlan && activePlan.day_1_plan) {
      // Extract today's activities from the plan
      const todaysPlan = activePlan.day_1_plan;

      if (todaysPlan.activities) {
        todaysPlan.activities.forEach((activity, index: number) => {
          tasks.push({
            id: activity.id || `task-${index}`,
            title: activity.title,
            description: activity.description,
            icon: getActivityIcon(activity.type),
            time: activity.startTime || "Anytime",
            isHighlighted: index === 0,
            completed: activity.completed || false,
            type: activity.type,
          });
        });
      }
    }

    // Fallback tasks if no plan activities
    if (tasks.length === 0) {
      tasks.push(
        {
          id: "1",
          title: "Morning Routine",
          description: "30-min morning wellness routine",
          icon: "🌅",
          time: "07:00 AM",
          isHighlighted: true,
          completed: false,
        },
        {
          id: "2",
          title: "Healthy Breakfast",
          description: "Protein-rich meal with complex carbs",
          icon: "🍳",
          time: "08:00 AM",
          isHighlighted: false,
          completed: false,
        },
        {
          id: "3",
          title: "Midday Movement",
          description: "15-min walk or light exercise",
          icon: "🚶",
          time: "01:30 PM",
          isHighlighted: false,
          completed: false,
        }
      );
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
          const { ComprehensiveHealthPlanService } = await import(
            "@/services/comprehensiveHealthPlanService"
          );
          const comprehensiveService = new ComprehensiveHealthPlanService();
          await comprehensiveService.generateComprehensivePlan(
            "Improve overall health",
            profile
          );
          toast.success("Comprehensive health plan generated!");

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
            toast.success("Quick start plan generated!");
            // Refresh to show new tasks
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            throw new Error(data.error || "Failed to generate plan");
          }
        }
      } catch (error) {
        console.error("Error generating plan:", error);
        toast.error("Failed to generate plan");
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

  // State detection logic
  useEffect(() => {
    if (!user || !profile) return;

    const determineUserState = async () => {
      setLoading(true);
      try {
        // Check for active comprehensive health plans
        const { data: activePlans } = await supabase
          .from("comprehensive_health_plans")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active");

        // Check for active 2-day plans as fallback
        const { data: twoDayPlans } = await supabase
          .from("two_day_health_plans")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_active", true);

        // Check for user health goals
        const { data: goals } = await supabase
          .from("user_health_goals")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active");

        if (
          (activePlans && activePlans.length > 0) ||
          (twoDayPlans && twoDayPlans.length > 0)
        ) {
          setContentState("upcoming_tasks");
          setSectionTitle("Today's Schedule");
          await loadUpcomingTasks(activePlans?.[0] || twoDayPlans?.[0]);
        } else if (goals && goals.length > 0) {
          setContentState("plan_selection");
          setSectionTitle("Recommended Plans");
          await loadHealthPlans(goals);
        } else {
          setContentState("health_tips");
          setSectionTitle("Health Insights");
          await loadPersonalizedTips();
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
  }, [user, profile, loadPersonalizedTips, loadHealthPlans, loadUpcomingTasks]);

  const {
    cardRef: stickyRef,
    visibleItems,
    isSticky,
  } = useStickyBottomScroll();

  // Health score data
  const {
    healthData,
    loading: healthLoading,
    markActivityCompleted,
    getActivityIconData,
    getStreakBonusText,
    initializeHealthScore,
  } = useHealthScore();

  return (
    <div className="h-screen flex flex-col">
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
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
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
      <div className="flex-1 bg-teal-800 overflow-y-auto pt-24 px-4">
        {/* Health Dashboard Card - Teal with Health Score & Weekly View */}
        <div className="py-4">
          <div className="bg-teal-500 rounded-[3rem] p-8 w-full">
            <div className="flex items-center justify-between">
              {/* Left Section - Health Score */}
              <div className="flex flex-col items-center">
                <div className="text-white text-sm font-medium mb-3">
                  Health Score
                </div>

                {/* Circular Progress */}
                <div className="relative w-20 h-20 mb-3">
                  {healthLoading ? (
                    <div className="w-20 h-20 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <svg
                      className="w-20 h-20 transform -rotate-90"
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
                      <defs>
                        <linearGradient
                          id="gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#14B8A6" />
                          <stop offset="100%" stopColor="#F59E0B" />
                        </linearGradient>
                      </defs>
                    </svg>
                  )}

                  {/* Center Score */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {healthData?.score || 0}
                    </span>
                  </div>
                </div>

                {/* Streak Counter */}
                <div className="flex items-center gap-1">
                  <span className="text-xl">🔥</span>
                  <span className="text-white text-sm font-medium">
                    {healthData?.streak_days || 0} Days
                  </span>
                </div>
              </div>

              {/* Right Section - Weekly View */}
              <div className="flex-1 ml-8">
                <div className="text-white text-sm font-medium mb-3">
                  WEEKLY VIEW
                </div>

                {/* Activity Icons */}
                <div className="flex items-center gap-3 mb-3">
                  {/* Running Icon */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="relative w-8 h-8">
                      <svg
                        className="w-8 h-8 transform -rotate-90"
                        viewBox="0 0 32 32"
                      >
                        {/* Background Circle */}
                        <circle
                          cx="16"
                          cy="16"
                          r="12"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="3"
                          fill="none"
                        />
                        {/* Progress Circle */}
                        <circle
                          cx="16"
                          cy="16"
                          r="12"
                          stroke="#F59E0B"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 12}`}
                          strokeDashoffset={`${2 * Math.PI * 12 * (1 - 0.85)}`}
                          className="drop-shadow-lg"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-green-400 drop-shadow-lg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M13.5 5.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-3.5 2c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-3.5 2c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm7 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-3.5 2c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-xs text-white opacity-80">Run</div>
                  </div>

                  {/* Leaf Icon */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="relative w-8 h-8">
                      <svg
                        className="w-8 h-8 transform -rotate-90"
                        viewBox="0 0 32 32"
                      >
                        {/* Background Circle */}
                        <circle
                          cx="16"
                          cy="16"
                          r="12"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="3"
                          fill="none"
                        />
                        {/* Progress Circle */}
                        <circle
                          cx="16"
                          cy="16"
                          r="12"
                          stroke="#F59E0B"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 12}`}
                          strokeDashoffset={`${2 * Math.PI * 12 * (1 - 0.75)}`}
                          className="drop-shadow-lg"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-yellow-400 drop-shadow-lg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75S7 8 17 8z" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-xs text-white opacity-80">Leaf</div>
                  </div>

                  {/* Drop Icon */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="relative w-8 h-8">
                      <svg
                        className="w-8 h-8 transform -rotate-90"
                        viewBox="0 0 32 32"
                      >
                        {/* Background Circle */}
                        <circle
                          cx="16"
                          cy="16"
                          r="12"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="3"
                          fill="none"
                        />
                        {/* Progress Circle */}
                        <circle
                          cx="16"
                          cy="16"
                          r="12"
                          stroke="#F59E0B"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 12}`}
                          strokeDashoffset={`${2 * Math.PI * 12 * (1 - 0.8)}`}
                          className="drop-shadow-lg"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-green-400 drop-shadow-lg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-5.39C20.26 15.07 21 13.12 21 11c0-4.97-4.03-9-9-9zm-1 16l-4.5-4.5 1.41-1.41L11 15.17l6.09-6.09 1.41 1.41L11 18z" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-xs text-white opacity-80">Drop</div>
                  </div>

                  {/* Diet Icon */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="relative w-8 h-8">
                      <svg
                        className="w-8 h-8 transform -rotate-90"
                        viewBox="0 0 32 32"
                      >
                        {/* Background Circle */}
                        <circle
                          cx="16"
                          cy="16"
                          r="12"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="3"
                          fill="none"
                        />
                        {/* Progress Circle */}
                        <circle
                          cx="16"
                          cy="16"
                          r="12"
                          stroke="#F59E0B"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 12}`}
                          strokeDashoffset={`${2 * Math.PI * 12 * (1 - 1.0)}`}
                          className="drop-shadow-lg"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-green-400 drop-shadow-lg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-xs text-white opacity-80">Diet</div>
                  </div>

                  {/* Calories Icon */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="relative w-8 h-8">
                      <svg
                        className="w-8 h-8 transform -rotate-90"
                        viewBox="0 0 32 32"
                      >
                        {/* Background Circle */}
                        <circle
                          cx="16"
                          cy="16"
                          r="12"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="3"
                          fill="none"
                        />
                        {/* Progress Circle */}
                        <circle
                          cx="16"
                          cy="16"
                          r="12"
                          stroke="#F59E0B"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 12}`}
                          strokeDashoffset={`${2 * Math.PI * 12 * (1 - 0.3)}`}
                          className="drop-shadow-lg"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-gray-400 drop-shadow-lg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M13.5 5.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-3.5 2c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-3.5 2c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm7 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-3.5 2c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-xs text-white opacity-80">Cal</div>
                  </div>
                </div>

                {/* Score Boost */}
                <div className="flex items-center gap-1">
                  <span className="text-xl">🔥</span>
                  <span className="text-white text-sm font-medium">
                    {getStreakBonusText(healthData?.streak_bonus || 1.0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Goal Input Bar */}
        <div className="py-4">
          <HealthInputBar onPlanGenerate={handlePlanGenerate} />
        </div>

        {/* Dynamic Upcoming Tasks Section - White Card */}
        <div className="py-4">
          <div
            ref={stickyRef}
            className={`bg-white rounded-[3rem] p-4 shadow-lg flex flex-col ${
              isSticky ? "sticky-bottom" : ""
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-black">{sectionTitle}</h2>
              <button className="text-gray-600">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
              </button>
            </div>

            {/* Dynamic Content */}
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                </div>
              ) : (
                dynamicContent.slice(0, visibleItems).map((item, index) => {
                  const isExpanded = expandedItems.has(index);
                  const isNewItem = index >= 2;
                  return (
                    <div
                      key={item.id}
                      className={`rounded-[3rem] bg-white text-black hover:bg-gray-100 ${
                        item.completed ? "opacity-60" : ""
                      } ${isNewItem ? "fade-in-up" : ""}`}
                    >
                      {/* Header - Always visible */}
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer"
                        onClick={() => toggleItemExpansion(index)}
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 bg-teal-500 border-teal-500">
                            {item.icon}
                          </div>
                          <div>
                            <h3
                              className={`font-bold text-xl text-black ${
                                item.completed ? "line-through" : ""
                              }`}
                            >
                              {item.title}
                            </h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-600">{item.time}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleItemExpansion(index);
                            }}
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
                        </div>
                      </div>

                      {/* Expandable Content */}
                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-gray-200">
                          <div className="pt-4">
                            <div className="space-y-3 text-gray-700">
                              <p className="text-sm leading-relaxed">
                                {item.description}
                              </p>
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
  );
};
