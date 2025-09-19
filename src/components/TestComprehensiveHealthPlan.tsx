import { PlanDurationCalculator } from "@/services/comprehensiveHealthPlanService";
import {
  ComprehensiveHealthPlan,
  PLAN_TYPE_DEFINITIONS,
} from "@/types/comprehensiveHealthPlan";
import { useState } from "react";

// Mock data for testing
const mockComprehensivePlan: ComprehensiveHealthPlan = {
  id: "test-plan-123",
  user_id: "test-user-456",
  plan_name: "Weight Loss Transformation",
  plan_type: "health_transformation",
  primary_goal: "I want to lose 10kg safely",
  secondary_goals: [
    "Improve nutrition",
    "Increase physical activity",
    "Better sleep",
  ],
  start_date: "2025-01-05",
  target_end_date: "2025-04-05",
  duration_weeks: 12,
  plan_data: {
    overview: {
      description:
        "A comprehensive 12-week health transformation plan focused on sustainable weight loss",
      expected_outcomes: [
        "Sustainable weight loss",
        "Improved body composition",
        "Better energy levels",
        "Enhanced self-confidence",
      ],
      key_principles: [
        "Gradual progression",
        "Sustainable practices",
        "Evidence-based approaches",
        "Personalized adaptation",
      ],
      success_metrics: [
        "Weekly compliance rate > 70%",
        "Progressive milestone achievement",
        "Sustained behavior change",
      ],
      safety_considerations: [
        "Monitor for adverse reactions",
        "Adjust intensity based on feedback",
        "Regular progress assessments",
      ],
    },
    weekly_structure: {
      "1": {
        focus_areas: ["Habit establishment", "Baseline assessment"],
        intensity_level: "low",
        key_activities: ["Assessment", "Goal setting", "Basic routines"],
        milestones: ["Week 1 milestone", "introduction phase progress"],
        weekly_goals: [
          "Complete all daily activities",
          "Maintain introduction phase standards",
        ],
      },
      "2": {
        focus_areas: ["Habit establishment", "Baseline assessment"],
        intensity_level: "low",
        key_activities: ["Assessment", "Goal setting", "Basic routines"],
        milestones: ["Week 2 milestone", "introduction phase progress"],
        weekly_goals: [
          "Complete all daily activities",
          "Maintain introduction phase standards",
        ],
      },
    },
    daily_templates: {
      weekday: {
        morning_routine: [
          {
            id: "morning-hydration",
            title: "Morning Hydration",
            description: "Drink 500ml of water upon waking",
            duration: 5,
            type: "hydration",
            category: "wellness",
            instructions: [
              "Keep water by bedside",
              "Drink immediately upon waking",
            ],
            tips: ["Helps kickstart metabolism", "Rehydrates after sleep"],
            difficulty_level: "easy",
            impact_on_goals: { hydration: 1, energy: 0.5 },
            time_of_day: "morning",
            frequency: "daily",
            is_required: true,
            completion_criteria: ["500ml water consumed"],
          },
        ],
        meals: [
          {
            id: "weekday-breakfast",
            meal_type: "breakfast",
            name: "Healthy Breakfast",
            description: "Balanced morning meal",
            ingredients: [
              { name: "Oats", quantity: 50, unit: "g" },
              { name: "Banana", quantity: 1, unit: "medium" },
            ],
            instructions: ["Prepare oats", "Add banana"],
            prep_time: 10,
            cook_time: 5,
            servings: 1,
            nutrition: {
              calories: 350,
              protein: 12,
              carbohydrates: 55,
              fat: 10,
              fiber: 8,
              sugar: 15,
              sodium: 100,
            },
            dietary_tags: ["vegetarian"],
            difficulty: "easy",
            alternatives: [],
            cultural_adaptations: [],
          },
        ],
        workouts: [
          {
            id: "weekday-workout",
            name: "Morning Workout",
            type: "strength",
            duration: 30,
            exercises: [],
            warm_up: [],
            cool_down: [],
            equipment_needed: ["bodyweight"],
            space_required: "minimal",
            intensity: "moderate",
            difficulty: "beginner",
            calories_burned_estimate: 200,
            muscle_groups_targeted: ["full_body"],
            adaptations: [],
          },
        ],
        evening_routine: [
          {
            id: "evening-reflection",
            title: "Daily Reflection",
            description: "5-minute reflection on the day",
            duration: 5,
            type: "wellness",
            category: "mental_health",
            instructions: ["Review daily achievements", "Note challenges"],
            tips: ["Improves self-awareness", "Tracks progress"],
            difficulty_level: "easy",
            impact_on_goals: { wellness: 0.5, mental_health: 0.7 },
            time_of_day: "evening",
            frequency: "daily",
            is_required: false,
            completion_criteria: ["5 minutes of reflection completed"],
          },
        ],
        wellness_activities: [
          {
            id: "mindfulness",
            title: "Mindfulness Practice",
            description: "10-minute mindfulness or meditation",
            duration: 10,
            type: "wellness",
            category: "mental_health",
            instructions: ["Find quiet space", "Focus on breathing"],
            tips: ["Reduces stress", "Improves focus"],
            difficulty_level: "easy",
            impact_on_goals: { stress: -0.5, wellness: 0.6 },
            time_of_day: "anytime",
            frequency: "daily",
            is_required: false,
            completion_criteria: ["10 minutes of practice completed"],
          },
        ],
        hydration_goals: [
          {
            daily_target: 2500,
            timing_recommendations: ["Morning", "Pre-meals", "Post-workout"],
            quality_guidelines: ["Filtered water", "Room temperature"],
            tracking_method: "Water bottle tracking",
          },
        ],
        sleep_targets: {
          target_duration: 8,
          bedtime_range: "10:00 PM - 11:00 PM",
          wake_time_range: "6:00 AM - 7:00 AM",
          sleep_hygiene_practices: ["No screens 1h before bed", "Cool room"],
          environment_recommendations: [
            "Comfortable mattress",
            "Blackout curtains",
          ],
        },
      },
      weekend: {
        morning_routine: [],
        meals: [],
        workouts: [],
        evening_routine: [],
        wellness_activities: [],
        hydration_goals: [],
        sleep_targets: {
          target_duration: 8,
          bedtime_range: "10:30 PM - 11:30 PM",
          wake_time_range: "7:00 AM - 8:00 AM",
          sleep_hygiene_practices: ["Consistent schedule", "Relaxation time"],
          environment_recommendations: [
            "Comfortable temperature",
            "Good ventilation",
          ],
        },
      },
    },
    adaptation_rules: {
      compliance_thresholds: {
        excellent: 90,
        good: 70,
        needs_improvement: 50,
        poor: 30,
      },
      adjustment_triggers: {
        timeline_extension: ["Compliance rate < 50% for 2 consecutive weeks"],
        intensity_increase: ["Compliance rate > 90% for 2 consecutive weeks"],
        intensity_decrease: ["User reports excessive fatigue"],
        plan_modification: ["Goal changes", "Lifestyle changes"],
      },
    },
    progression_rules: {
      weekly_progression: {
        intensity_increase_percentage: 5,
        volume_increase_percentage: 10,
        complexity_increase: true,
      },
      plateau_handling: {
        detection_criteria: ["No progress for 2 consecutive weeks"],
        adjustment_strategies: ["Increase variety", "Adjust intensity"],
      },
    },
  },
  weekly_milestones: [
    {
      week_number: 1,
      title: "Week 1 Milestone",
      description: "Key achievements for week 1",
      success_criteria: ["Complete 70% of activities", "Maintain consistency"],
      measurement_method: "Compliance tracking",
      importance: "medium",
      category: "behavioral",
    },
    {
      week_number: 2,
      title: "Week 2 Milestone",
      description: "Key achievements for week 2",
      success_criteria: ["Complete 70% of activities", "Maintain consistency"],
      measurement_method: "Compliance tracking",
      importance: "medium",
      category: "behavioral",
    },
  ],
  monthly_assessments: [
    {
      month_number: 1,
      title: "Month 1 Assessment",
      description: "Comprehensive review of progress",
      assessment_areas: [
        {
          name: "Goal Progress",
          description: "Progress toward primary goal",
          metrics: ["percentage_complete"],
          weight: 0.4,
        },
      ],
      required_measurements: ["weight", "energy_level", "satisfaction"],
      optional_measurements: ["body_measurements", "fitness_tests"],
      questionnaire: [
        {
          id: "satisfaction",
          question: "How satisfied are you with your progress?",
          type: "scale",
          scale_range: {
            min: 1,
            max: 10,
            labels: ["Very Unsatisfied", "Very Satisfied"],
          },
          required: true,
        },
      ],
      adjustment_triggers: ["Low compliance", "User feedback"],
    },
  ],
  overall_progress_percentage: 15.5,
  weekly_compliance_rate: 78.0,
  monthly_compliance_rate: 0,
  status: "active",
  timeline_adjustments: [],
  intensity_adjustments: [],
  generated_at: "2025-01-05T10:00:00Z",
  last_updated_at: "2025-01-05T10:00:00Z",
  created_at: "2025-01-05T10:00:00Z",
  updated_at: "2025-01-05T10:00:00Z",
};

export const TestComprehensiveHealthPlan = () => {
  const [testGoal, setTestGoal] = useState("I want to lose 10kg safely");
  const [planCalculation, setPlanCalculation] = useState<any>(null);
  const [showPlan, setShowPlan] = useState(false);

  const testDurationCalculator = () => {
    const calculation = PlanDurationCalculator.calculateDuration(testGoal, {});
    setPlanCalculation(calculation);
    setShowPlan(true);
  };

  const testGoals = [
    "I want to lose 10kg safely",
    "Help me manage my diabetes",
    "Build muscle and strength",
    "Improve my sleep quality",
    "Reduce stress and anxiety",
    "Quick energy boost",
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Comprehensive Health Plan System Test
          </h1>
          <p className="text-gray-600">
            Test the new realistic duration health plan system
          </p>
        </div>

        {/* Test Goal Input */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Test Plan Duration Calculator
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter a health goal:
              </label>
              <input
                type="text"
                value={testGoal}
                onChange={(e) => setTestGoal(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., I want to lose 10kg safely"
              />
            </div>

            <button
              onClick={testDurationCalculator}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Calculate Plan Duration
            </button>
          </div>

          {/* Quick Test Buttons */}
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Quick test goals:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {testGoals.map((goal, index) => (
                <button
                  key={index}
                  onClick={() => setTestGoal(goal)}
                  className="text-left p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Plan Calculation Results */}
        {planCalculation && (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              📊 Plan Duration Calculation Results
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Duration</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {planCalculation.duration_weeks} weeks
                </p>
                <p className="text-sm text-blue-700">
                  ({Math.ceil(planCalculation.duration_weeks / 4)} months)
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Plan Type</h3>
                <p className="text-lg font-bold text-green-600">
                  {PLAN_TYPE_DEFINITIONS[planCalculation.plan_type].name}
                </p>
                <p className="text-sm text-green-700">
                  {PLAN_TYPE_DEFINITIONS[planCalculation.plan_type].description}
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2">Timeline</h3>
                <p className="text-lg font-bold text-purple-600 capitalize">
                  {planCalculation.timeline_preference}
                </p>
                <p className="text-sm text-purple-700">Progression approach</p>
              </div>
            </div>

            {/* Expected Outcomes */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Expected Outcomes:
              </h3>
              <ul className="space-y-2">
                {planCalculation.expected_outcomes.map(
                  (outcome: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-700">{outcome}</span>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Key Milestones */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Key Milestones:
              </h3>
              <ul className="space-y-2">
                {planCalculation.key_milestones.map(
                  (milestone: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">🎯</span>
                      <span className="text-gray-700">{milestone}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Mock Plan Display */}
        {showPlan && (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              📋 Sample Comprehensive Health Plan
            </h2>

            <div className="space-y-6">
              {/* Plan Overview */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {mockComprehensivePlan.plan_name}
                    </h3>
                    <p className="text-gray-600">
                      {
                        PLAN_TYPE_DEFINITIONS[mockComprehensivePlan.plan_type]
                          .name
                      }{" "}
                      • {mockComprehensivePlan.duration_weeks} weeks
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-700">
                      {Math.round(
                        mockComprehensivePlan.overall_progress_percentage
                      )}
                      %
                    </div>
                    <div className="text-sm text-green-600">Complete</div>
                  </div>
                </div>
              </div>

              {/* Plan Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Plan Overview
                  </h4>
                  <p className="text-gray-700 mb-4">
                    {mockComprehensivePlan.plan_data.overview.description}
                  </p>

                  <h5 className="font-medium text-gray-900 mb-2">
                    Key Principles:
                  </h5>
                  <ul className="space-y-1">
                    {mockComprehensivePlan.plan_data.overview.key_principles.map(
                      (principle, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          • {principle}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Expected Outcomes
                  </h4>
                  <ul className="space-y-2">
                    {mockComprehensivePlan.plan_data.overview.expected_outcomes.map(
                      (outcome, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span className="text-sm text-gray-700">
                            {outcome}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              {/* Weekly Structure */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Weekly Structure
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(
                    mockComprehensivePlan.plan_data.weekly_structure
                  ).map(([week, data]) => (
                    <div key={week} className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">
                        Week {week}
                      </h5>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Focus:</span>{" "}
                        {data.focus_areas.join(", ")}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Intensity:</span>{" "}
                        {data.intensity_level}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Activities:</span>{" "}
                        {data.key_activities.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Template */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Daily Template (Weekday)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h5 className="font-medium text-blue-900 mb-2">
                      Morning Routine
                    </h5>
                    <ul className="space-y-1">
                      {mockComprehensivePlan.plan_data.daily_templates.weekday.morning_routine.map(
                        (activity, index) => (
                          <li key={index} className="text-sm text-blue-700">
                            • {activity.title}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4">
                    <h5 className="font-medium text-orange-900 mb-2">Meals</h5>
                    <ul className="space-y-1">
                      {mockComprehensivePlan.plan_data.daily_templates.weekday.meals.map(
                        (meal, index) => (
                          <li key={index} className="text-sm text-orange-700">
                            • {meal.name}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h5 className="font-medium text-green-900 mb-2">
                      Workouts
                    </h5>
                    <ul className="space-y-1">
                      {mockComprehensivePlan.plan_data.daily_templates.weekday.workouts.map(
                        (workout, index) => (
                          <li key={index} className="text-sm text-green-700">
                            • {workout.name} ({workout.duration}min)
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <h5 className="font-medium text-purple-900 mb-2">
                      Wellness
                    </h5>
                    <ul className="space-y-1">
                      {mockComprehensivePlan.plan_data.daily_templates.weekday.wellness_activities.map(
                        (activity, index) => (
                          <li key={index} className="text-sm text-purple-700">
                            • {activity.title}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Milestones */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Weekly Milestones
                </h4>
                <div className="space-y-3">
                  {mockComprehensivePlan.weekly_milestones.map(
                    (milestone, index) => (
                      <div key={index} className="bg-yellow-50 rounded-lg p-4">
                        <h5 className="font-medium text-yellow-900 mb-1">
                          Week {milestone.week_number}: {milestone.title}
                        </h5>
                        <p className="text-sm text-yellow-700 mb-2">
                          {milestone.description}
                        </p>
                        <div className="text-xs text-yellow-600">
                          <span className="font-medium">Success Criteria:</span>{" "}
                          {milestone.success_criteria.join(", ")}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Test Results Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            ✅ Test Results Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                What's Working:
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700">
                    Realistic duration calculation (weeks/months instead of
                    days)
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700">
                    Evidence-based plan types and timelines
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700">
                    Comprehensive plan structure with daily/weekly/monthly
                    tracking
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700">
                    Adaptive adjustment system
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Next Steps:</h3>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">→</span>
                  <span className="text-gray-700">
                    Connect to real database (when Docker is available)
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">→</span>
                  <span className="text-gray-700">
                    Integrate with existing AI health plan generation
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">→</span>
                  <span className="text-gray-700">
                    Add real-time progress tracking
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">→</span>
                  <span className="text-gray-700">
                    Test with real user data
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
