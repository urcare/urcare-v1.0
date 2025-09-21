import { HealthInputBar } from "@/components/HealthInputBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
      {/* Header with User Info - White Container Stretched to Edges */}
      <div className="bg-white px-6 py-4 rounded-b-[3rem] shadow-lg w-full">
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

      {/* Main Content - Dark Background Edge to Edge */}
      <div className="bg-gray-900 h-screen overflow-hidden">
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

        {/* Upcoming Tasks Section - White Card */}
        <div className="py-4 flex-1 overflow-hidden">
          <div className="bg-white rounded-[3rem] p-4 shadow-lg h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-black">Upcoming Tasks</h2>
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

            {/* Task Cards - Scrollable */}
            <div className="space-y-4 overflow-y-auto flex-1 scrollbar-hide">
              {/* First Task Card - Black (Highlighted) */}
              <div className="bg-black rounded-[3rem] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                      <span className="text-white font-bold text-xl">B</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xl">
                        Design review
                      </h3>
                      <p className="text-gray-300 text-base">20 subtask</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <svg
                      className="w-8 h-8 text-white mb-2"
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
                    <p className="text-gray-300 text-base">01.07.2023</p>
                  </div>
                </div>
              </div>

              {/* Second Task Card - Light Gray */}
              <div className="bg-white rounded-[3rem] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center border-2 border-green-500">
                      <span className="text-white font-bold text-xl">F</span>
                    </div>
                    <div>
                      <h3 className="text-black font-bold text-xl">
                        Finish the Work
                      </h3>
                      <p className="text-gray-600 text-base">08 subtask</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <svg
                      className="w-8 h-8 text-black mb-2"
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
                    <p className="text-gray-600 text-base">02.07.2023</p>
                  </div>
                </div>
              </div>

              {/* Third Task Card - Light Gray */}
              <div className="bg-white rounded-[3rem] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center border-2 border-green-500">
                      <span className="text-white font-bold text-xl">C</span>
                    </div>
                    <div>
                      <h3 className="text-black font-bold text-xl">
                        Client Meeting
                      </h3>
                      <p className="text-gray-600 text-base">12 subtask</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <svg
                      className="w-8 h-8 text-black mb-2"
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
                    <p className="text-gray-600 text-base">04.07.2023</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
