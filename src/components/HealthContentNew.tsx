import { HealthInputBar } from "@/components/HealthInputBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useCallback, useEffect, useState } from "react";
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

  // State management for dynamic content
  const [contentState, setContentState] = useState<
    "health_tips" | "plan_selection" | "upcoming_tasks"
  >("health_tips");
  const [dynamicContent, setDynamicContent] = useState<DynamicContentItem[]>(
    []
  );
  const [sectionTitle, setSectionTitle] = useState("Health Insights");
  const [loading, setLoading] = useState(false);
  const [visibleItems, setVisibleItems] = useState(3); // Show only top 3 items initially

  // Handle scroll to reveal more content from bottom
  const handleCardScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const scrollTop = target.scrollTop;

    // When user scrolls up (at top), reveal more items
    if (scrollTop <= 5 && visibleItems < dynamicContent.length) {
      setVisibleItems((prev) => Math.min(prev + 1, dynamicContent.length));
      // Scroll back to top to maintain position
      setTimeout(() => {
        target.scrollTop = 0;
      }, 50);
    }
  };

  // Reset visible items when content changes
  useEffect(() => {
    setVisibleItems(3);
  }, [dynamicContent]);

  const getFirstName = () => {
    if (profile?.full_name) {
      return profile.full_name.split(" ")[0];
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
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
      <div className="flex-1 bg-gray-900 overflow-y-auto pt-24 px-4">
        {/* Achievement Card - Lime Green with margin */}
        <div className="py-4">
          <div className="bg-lime-400 rounded-[3rem] p-8 w-full">
            <div className="flex items-center justify-between">
              {/* Left Section - Steps Streak */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-2 shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-black">142</div>
                  <div className="text-lg font-semibold text-black">
                    Days streak
                  </div>
                </div>
              </div>

              {/* Right Section - Step Progress and Weekly Tracker */}
              <div className="flex-1 ml-8">
                {/* Step Count */}
                <div className="text-xl font-bold text-black mb-2">0 / 100</div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-300 rounded-full h-3 mb-4">
                  <div
                    className="bg-white h-3 rounded-full"
                    style={{ width: "0%" }}
                  ></div>
                </div>

                {/* Weekly Completion Tracker */}
                <div className="flex items-center justify-between">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day, index) => (
                      <div key={day} className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                            index < 3 ? "bg-orange-500" : "bg-gray-300"
                          }`}
                        >
                          {index < 3 && (
                            <svg
                              className="w-4 h-4 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm font-medium text-black">
                          {day}
                        </span>
                      </div>
                    )
                  )}
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
            className="bg-white rounded-[3rem] p-4 shadow-lg flex flex-col sticky bottom-0 transition-all duration-300 ease-in-out"
            style={{
              minHeight: `${Math.max(400, visibleItems * 120 + 100)}px`,
            }}
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

            {/* Dynamic Content - Scrollable with reveal effect */}
            <div
              className="space-y-4 overflow-y-auto scrollbar-hide flex-1"
              onScroll={handleCardScroll}
            >
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                </div>
              ) : (
                dynamicContent.slice(0, visibleItems).map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => handleContentClick(item)}
                    className={`rounded-[3rem] p-4 cursor-pointer transition-all duration-500 transform ${
                      item.isHighlighted
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-gray-100"
                    } ${item.completed ? "opacity-60" : ""} ${
                      index >= visibleItems - 1 ? "animate-slide-up" : ""
                    }`}
                    style={{
                      animationDelay: index >= visibleItems - 1 ? "0.2s" : "0s",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 ${
                            item.isHighlighted
                              ? "bg-green-500 border-white"
                              : "bg-green-500 border-green-500"
                          }`}
                        >
                          {item.icon}
                        </div>
                        <div>
                          <h3
                            className={`font-bold text-xl mb-1 ${
                              item.isHighlighted ? "text-white" : "text-black"
                            } ${item.completed ? "line-through" : ""}`}
                          >
                            {item.title}
                          </h3>
                          <p
                            className={`text-sm ${
                              item.isHighlighted
                                ? "text-gray-300"
                                : "text-gray-600"
                            }`}
                          >
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <svg
                          className={`w-8 h-8 mb-2 ${
                            item.isHighlighted ? "text-white" : "text-black"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 17l9.2-9.2M17 17V7H7"
                          />
                        </svg>
                        <p
                          className={`text-sm ${
                            item.isHighlighted
                              ? "text-gray-300"
                              : "text-gray-600"
                          }`}
                        >
                          {item.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Show more content indicator */}
              {!loading && visibleItems < dynamicContent.length && (
                <div className="flex items-center justify-center py-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <svg
                      className="w-4 h-4 animate-bounce"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                    <span>Scroll up to expand card</span>
                    <svg
                      className="w-4 h-4 animate-bounce"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
