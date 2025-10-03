import React from "react";

interface HealthGoalsStepProps {
  selected: string[];
  onToggle: (goal: string) => void;
  error?: string;
}

const healthGoals = [
  // Category 1 – Lifestyle Disorder Reversal
  {
    id: "reverse_type2_diabetes",
    title: "Reverse Type 2 Diabetes",
    description: "Lower sugar, reduce meds, reclaim energy",
    category: "Lifestyle Disorder Reversal",
  },
  {
    id: "control_high_blood_pressure",
    title: "Control High Blood Pressure",
    description: "Steady BP, reduce risks",
    category: "Lifestyle Disorder Reversal",
  },
  {
    id: "improve_cholesterol_heart_health",
    title: "Improve Cholesterol & Heart Health",
    description: "Protect your heart, live longer",
    category: "Lifestyle Disorder Reversal",
  },
  {
    id: "lose_weight_sustainably",
    title: "Lose Weight Sustainably",
    description: "No crash diets, just lasting change",
    category: "Lifestyle Disorder Reversal",
  },

  // Category 2 – Daily Life Transformation
  {
    id: "boost_energy_vitality",
    title: "Boost Energy & Vitality",
    description: "Wake up fresh, feel active daily",
    category: "Daily Life Transformation",
  },
  {
    id: "better_sleep_recovery",
    title: "Better Sleep & Recovery",
    description: "Fall asleep faster, wake refreshed",
    category: "Daily Life Transformation",
  },
  {
    id: "reduce_stress_anxiety",
    title: "Reduce Stress & Anxiety",
    description: "Calm mind, sharper focus",
    category: "Daily Life Transformation",
  },

  // Category 3 – Longevity & Prevention
  {
    id: "stay_med_free_for_life",
    title: "Stay Med-Free for Life",
    description: "Break dependency, regain freedom",
    category: "Longevity & Prevention",
  },
  {
    id: "healthy_aging_longevity",
    title: "Healthy Aging & Longevity",
    description: "Add years of quality living",
    category: "Longevity & Prevention",
  },
  {
    id: "stronger_immunity",
    title: "Stronger Immunity",
    description: "Get sick less, recover faster",
    category: "Longevity & Prevention",
  },

  // Category 4 – Tracking & Guidance
  {
    id: "track_all_health_in_one_place",
    title: "Track All My Health in One Place",
    description: "Sugar, BP, weight, sleep, fitness—all connected",
    category: "Tracking & Guidance",
  },
  {
    id: "step_by_step_coaching",
    title: "Step-by-Step Coaching",
    description: "Clear actions daily, no guesswork",
    category: "Tracking & Guidance",
  },
];

export const HealthGoalsStep: React.FC<HealthGoalsStepProps> = ({
  selected,
  onToggle,
  error,
}) => {
  // Group goals by category
  const groupedGoals = healthGoals.reduce((acc, goal) => {
    if (!acc[goal.category]) {
      acc[goal.category] = [];
    }
    acc[goal.category].push(goal);
    return acc;
  }, {} as Record<string, typeof healthGoals>);

  return (
    <div className="space-y-6">
      {/* Main Header */}
      <div className="text-center space-y-2">
        <p className="text-gray-600 text-sm">
          Choose all that apply — your Health Twin adapts to your goals.
        </p>
      </div>

      {/* Goals organized by category */}
      <div className="space-y-6">
        {Object.entries(groupedGoals).map(([category, goals]) => (
          <div key={category} className="space-y-3">
            {/* Category Header */}
            <div className="flex items-center space-x-2">
              <div className="flex-1 h-px bg-gray-200"></div>
              <h3 className="text-sm font-semibold text-gray-700 px-3">
                {category}
              </h3>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Goals in this category */}
            <div className="grid grid-cols-1 gap-3">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => onToggle(goal.id)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                    selected.includes(goal.id)
                      ? "border-gray-900 bg-gray-900 text-white shadow-lg scale-105"
                      : "border-gray-200 bg-white text-gray-700 hover:border-primary/30 hover:bg-primary/5"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="font-medium text-sm block">
                      {goal.title}
                    </span>
                    <span className="text-xs opacity-75">
                      {goal.description}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center mt-2">{error}</div>
      )}
    </div>
  );
};
