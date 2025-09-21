import { HealthInputBar } from "@/components/HealthInputBar";
import { useAuth } from "@/contexts/AuthContext";
import { healthPlanSearchService } from "@/services/healthPlanSearchService";
import { toast } from "sonner";

export const HealthContentNew = () => {
  const { user, profile } = useAuth();

  const getFirstName = () => {
    if (profile?.full_name) {
      return profile.full_name.split(" ")[0];
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
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

      const result = await healthPlanSearchService.generateHealthPlanFromQuery(
        {
          query: goal,
          userProfile: profile,
          maxTokens: 4000,
          includeFileContext: false,
          fileContent: "",
        },
        user.id
      );

      if (result.success) {
        toast.success("Health plan generated successfully!", {
          id: "plan-generation",
        });
        // Optionally navigate to the health plan page or show the plan
        // You can add navigation logic here if needed
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
  return (
    <>
      {/* Header with User Info - Edge to Edge White */}
      <div className="bg-white px-4 py-3 rounded-b-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-black">
                Hi {getFirstName()}
              </h2>
            </div>
          </div>
          <div className="relative">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <img
                src="/icons/notification.png"
                alt="notification"
                className="w-5 h-5"
              />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Content - Dark Background Edge to Edge */}
      <div className="bg-gray-900 min-h-screen overflow-y-auto scrollbar-hide">
        {/* Achievement Card - Lime Green with margin */}
        <div className="px-2 pt-2">
          <div className="bg-lime-400 rounded-2xl p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-lime-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-black font-medium">Great Job!</p>
                  <p className="text-black font-medium">You have completed</p>
                  <p className="text-black font-medium">
                    the tasks this month.
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-6xl font-bold text-black">31</div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Goal Input Bar */}
        <div className="px-2 py-2">
          <HealthInputBar onPlanGenerate={handlePlanGenerate} />
        </div>

        {/* Upcoming Tasks Section */}
        <div className="px-4 space-y-4 pb-24">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-xl font-semibold">Upcoming Tasks</h2>
            <button className="text-white">
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
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Task Cards */}
          <div className="space-y-3">
            {/* First Task Card - Black */}
            <div className="bg-black rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">D</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Design review</h3>
                    <p className="text-gray-400 text-sm">20 subtask</p>
                  </div>
                </div>
                <div className="text-right">
                  <svg
                    className="w-6 h-6 text-white mb-1"
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
                  <p className="text-gray-400 text-sm">01.07.2023</p>
                </div>
              </div>
            </div>

            {/* Second Task Card - White */}
            <div className="bg-white rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-800 font-bold text-lg">F</span>
                  </div>
                  <div>
                    <h3 className="text-gray-800 font-medium">
                      Finish the Work
                    </h3>
                    <p className="text-gray-600 text-sm">08 subtask</p>
                  </div>
                </div>
                <div className="text-right">
                  <svg
                    className="w-6 h-6 text-gray-800 mb-1"
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
                  <p className="text-gray-600 text-sm">02.07.2023</p>
                </div>
              </div>
            </div>

            {/* Third Task Card - White */}
            <div className="bg-white rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-800 font-bold text-lg">C</span>
                  </div>
                  <div>
                    <h3 className="text-gray-800 font-medium">
                      Client Meeting
                    </h3>
                    <p className="text-gray-600 text-sm">12 subtask</p>
                  </div>
                </div>
                <div className="text-right">
                  <svg
                    className="w-6 h-6 text-gray-800 mb-1"
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
                  <p className="text-gray-600 text-sm">04.07.2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
