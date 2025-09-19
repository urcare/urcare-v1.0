import { useAuth } from "@/contexts/AuthContext";
import {
  Activity,
  AlertCircle,
  Award,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Heart,
  Moon,
  Sun,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface HealthPlan {
  summary: string;
  confidence: number;
  evidenceBase: string;
  biometricTargets?: {
    glucoseVariability?: string;
    hrv?: string;
    sleepEfficiency?: string;
    recoveryScore?: string;
  };
  morningProtocol?: {
    circadianActivation?: string[];
    hydration?: string;
    breakfast?: {
      foods: string[];
      macros: string;
      eatingOrder: string[];
      postMeal: string;
    };
  };
  trainingBlock?: {
    type: string;
    duration: string;
    exercises: Array<{
      name: string;
      sets: number;
      reps: string;
      rpe: number;
      tempo: string;
      rest: string;
      cues: string[];
    }>;
    postWorkout: string;
  };
  nutritionPlan?: {
    lunch?: {
      time: string;
      preMeal: string;
      foods: string[];
      eatingOrder: string[];
      postMeal: string;
      expectedGlucose: string;
    };
    dinner?: {
      time: string;
      theme: string;
      foods: string[];
      supplements: string[];
    };
  };
  sleepOptimization?: {
    windDown: string;
    relaxation: string;
    sleepSanctuary: string;
    bedtime: string;
    targetWake: string;
  };
  adaptiveAdjustments?: {
    lowEnergy: string;
    unexpectedDinner: string;
    glucoseHigh: string;
    poorSleep: string;
  };
  evidenceSupport?: string[];
  warnings?: string[];
  nextSteps?: string[];
}

export const HealthPlanDisplay: React.FC = () => {
  const { user, profile } = useAuth();
  const [healthPlan, setHealthPlan] = useState<HealthPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration - replace with actual API call
  useEffect(() => {
    // Simulate loading a health plan
    const mockPlan: HealthPlan = {
      summary:
        "Comprehensive health optimization plan focusing on metabolic health, strength training, and circadian optimization for sustainable weight loss and energy improvement.",
      confidence: 94,
      evidenceBase:
        "Based on 127 peer-reviewed studies and 45 days of personal data",
      biometricTargets: {
        glucoseVariability: "<15 mg/dL",
        hrv: ">55 ms",
        sleepEfficiency: ">85%",
        recoveryScore: ">80%",
      },
      morningProtocol: {
        circadianActivation: [
          "Sunrise simulation 10,000 lux × 15 min",
          "Cold shower finish 30s at 50°F",
        ],
        hydration: "500ml filtered water + 1/4 tsp Celtic sea salt + 1/2 lemon",
        breakfast: {
          foods: [
            "Greek yogurt 200g",
            "Blueberries 100g",
            "Walnuts 30g",
            "Ground flax 15g",
          ],
          macros: "P:38g | C:28g | F:22g | Fiber:9g",
          eatingOrder: [
            "Protein/fat first (3 min)",
            "Add berries/carbs (2 min)",
            "Chew thoroughly 20-30x per bite",
          ],
          postMeal: "5 min gentle walk",
        },
      },
      trainingBlock: {
        type: "Lower Body Power + Hypertrophy",
        duration: "60 minutes",
        exercises: [
          {
            name: "Barbell Back Squat",
            sets: 4,
            reps: "6-8",
            rpe: 8,
            tempo: "3-0-1-0",
            rest: "3 min",
            cues: ["Root feet, chest proud"],
          },
          {
            name: "Romanian Deadlift",
            sets: 4,
            reps: "8",
            rpe: 7,
            tempo: "3-1-1-0",
            rest: "2.5 min",
            cues: ["Paint legs with bar"],
          },
        ],
        postWorkout:
          "Whey isolate 30g + White rice 60g + Pineapple 100g within 30 min",
      },
      nutritionPlan: {
        lunch: {
          time: "1:30 PM",
          preMeal: "Apple cider vinegar 15ml in 200ml water + 5 min walk",
          foods: [
            "Mixed greens 3 cups",
            "Grilled salmon 150g",
            "Sweet potato 150g",
            "Avocado 80g",
          ],
          eatingOrder: ["Vegetables first", "Protein second", "Carbs last"],
          postMeal: "12-minute walk (target 1,200 steps)",
          expectedGlucose: "Peak <125 mg/dL @ 45 min",
        },
        dinner: {
          time: "6:30 PM",
          theme: "Recovery + Sleep Preparation",
          foods: [
            "Grass-fed beef 120g",
            "Roasted vegetables 300g",
            "Quinoa 100g",
            "Sauerkraut 50g",
          ],
          supplements: [
            "Magnesium Glycinate 400mg",
            "Zinc Picolinate 15mg",
            "Vitamin D3/K2 3000 IU/100mcg",
          ],
        },
      },
      sleepOptimization: {
        windDown: "8:30 PM digital sunset, dim lights <40 lux",
        relaxation:
          "Warm shower 40°C × 10 min, 4-7-8 breathing × 6 cycles, gratitude journal",
        sleepSanctuary: "Room temp 65-68°F, blackout curtains, white noise",
        bedtime: "10:00 PM",
        targetWake: "5:30 AM (7.5 hours)",
      },
      adaptiveAdjustments: {
        lowEnergy:
          "Reduce training volume 30%, add 10g MCT oil to breakfast, 20-min power nap at 2 PM",
        unexpectedDinner:
          "Send photo for instant analysis, pre-meal fiber supplement + ACV, focus protein + vegetables first",
        glucoseHigh:
          "15-min walk immediately, next meal double vegetables, add 500mg berberine with dinner",
        poorSleep:
          "Cancel HIIT do yoga instead, extra 200mg magnesium, bed 30 minutes earlier",
      },
      evidenceSupport: [
        "Nature Medicine (2023): Time-restricted eating and metabolic health",
        "NEJM (2024): Resistance training for insulin sensitivity",
        "Cell Metabolism (2023): Circadian rhythm optimization",
      ],
      warnings: [
        "Not medical advice—consult your doctor",
        "Monitor glucose if diabetic",
        "Stop if experiencing pain",
      ],
      nextSteps: [
        "Confirm plan",
        "Set reminders",
        "Track progress",
        "Check in daily",
      ],
    };

    setHealthPlan(mockPlan);
  }, []);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const isExpanded = (sectionId: string) => expandedSections.has(sectionId);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading your health plan...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-2xl p-6 shadow-lg border border-red-200">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">Error generating health plan</span>
        </div>
        <p className="text-red-500 mt-2">{error}</p>
      </div>
    );
  }

  if (!healthPlan) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Plan Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                Your Personalized Health Plan
              </h2>
              <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                {healthPlan.confidence}% Confidence
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-3">{healthPlan.summary}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>{healthPlan.evidenceBase}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Biometric Targets */}
      {healthPlan.biometricTargets && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection("biometric-targets")}
          >
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Today's Biometric Targets
              </h3>
            </div>
            {isExpanded("biometric-targets") ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>

          {isExpanded("biometric-targets") && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {Object.entries(healthPlan.biometricTargets).map(
                ([key, value]) => (
                  <div key={key} className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </div>
                    <div className="text-lg font-semibold text-gray-800 mt-1">
                      {value}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}

      {/* Morning Protocol */}
      {healthPlan.morningProtocol && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection("morning-protocol")}
          >
            <div className="flex items-center space-x-2">
              <Sun className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Morning Optimization Protocol
              </h3>
            </div>
            {isExpanded("morning-protocol") ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>

          {isExpanded("morning-protocol") && (
            <div className="mt-4 space-y-4">
              {/* Circadian Activation */}
              <div className="bg-yellow-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-800 mb-2">
                  Circadian Activation
                </h4>
                <ul className="space-y-1">
                  {healthPlan.morningProtocol.circadianActivation?.map(
                    (item, index) => (
                      <li
                        key={index}
                        className="flex items-center space-x-2 text-sm text-gray-600"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{item}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Hydration */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-800 mb-2">
                  Hydration Protocol
                </h4>
                <p className="text-sm text-gray-600">
                  {healthPlan.morningProtocol.hydration}
                </p>
              </div>

              {/* Breakfast */}
              {healthPlan.morningProtocol.breakfast && (
                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Metabolic Breakfast
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Foods:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {healthPlan.morningProtocol.breakfast.foods.map(
                          (food, index) => (
                            <span
                              key={index}
                              className="bg-white text-xs px-2 py-1 rounded-full text-gray-600"
                            >
                              {food}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Macros:
                      </span>
                      <span className="text-sm text-gray-600 ml-2">
                        {healthPlan.morningProtocol.breakfast.macros}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Eating Order:
                      </span>
                      <ul className="mt-1 space-y-1">
                        {healthPlan.morningProtocol.breakfast.eatingOrder.map(
                          (step, index) => (
                            <li
                              key={index}
                              className="text-xs text-gray-600 flex items-center space-x-1"
                            >
                              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                              <span>{step}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Post-Meal:
                      </span>
                      <span className="text-sm text-gray-600 ml-2">
                        {healthPlan.morningProtocol.breakfast.postMeal}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Training Block */}
      {healthPlan.trainingBlock && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection("training-block")}
          >
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Precision Training Block
              </h3>
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                {healthPlan.trainingBlock.duration}
              </span>
            </div>
            {isExpanded("training-block") ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>

          {isExpanded("training-block") && (
            <div className="mt-4 space-y-4">
              <div className="bg-red-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-800 mb-3">
                  {healthPlan.trainingBlock.type}
                </h4>

                <div className="space-y-4">
                  {healthPlan.trainingBlock.exercises.map((exercise, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-4 border border-red-100"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-800">
                          {exercise.name}
                        </h5>
                        <div className="flex items-center space-x-2">
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                            RPE {exercise.rpe}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Sets:</span>
                          <span className="font-medium ml-1">
                            {exercise.sets}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Reps:</span>
                          <span className="font-medium ml-1">
                            {exercise.reps}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Tempo:</span>
                          <span className="font-medium ml-1">
                            {exercise.tempo}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Rest:</span>
                          <span className="font-medium ml-1">
                            {exercise.rest}
                          </span>
                        </div>
                      </div>

                      {exercise.cues.length > 0 && (
                        <div className="mt-3">
                          <span className="text-gray-600 text-sm">Cues:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {exercise.cues.map((cue, cueIndex) => (
                              <span
                                key={cueIndex}
                                className="bg-gray-100 text-xs px-2 py-1 rounded-full text-gray-600"
                              >
                                {cue}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 bg-green-50 rounded-lg p-3">
                  <h5 className="font-medium text-gray-800 mb-1">
                    Post-Workout Nutrition
                  </h5>
                  <p className="text-sm text-gray-600">
                    {healthPlan.trainingBlock.postWorkout}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Nutrition Plan */}
      {healthPlan.nutritionPlan && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection("nutrition-plan")}
          >
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Metabolic Meal Engineering
              </h3>
            </div>
            {isExpanded("nutrition-plan") ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>

          {isExpanded("nutrition-plan") && (
            <div className="mt-4 space-y-4">
              {/* Lunch */}
              {healthPlan.nutritionPlan.lunch && (
                <div className="bg-orange-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-800">
                      Lunch ({healthPlan.nutritionPlan.lunch.time})
                    </h4>
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                      Glucose Optimized
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Pre-Meal:
                      </span>
                      <p className="text-sm text-gray-600 mt-1">
                        {healthPlan.nutritionPlan.lunch.preMeal}
                      </p>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Foods:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {healthPlan.nutritionPlan.lunch.foods.map(
                          (food, index) => (
                            <span
                              key={index}
                              className="bg-white text-xs px-2 py-1 rounded-full text-gray-600"
                            >
                              {food}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Eating Order:
                      </span>
                      <ul className="mt-1 space-y-1">
                        {healthPlan.nutritionPlan.lunch.eatingOrder.map(
                          (step, index) => (
                            <li
                              key={index}
                              className="text-xs text-gray-600 flex items-center space-x-1"
                            >
                              <span className="w-1 h-1 bg-orange-400 rounded-full"></span>
                              <span>{step}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Post-Meal:
                      </span>
                      <p className="text-sm text-gray-600 mt-1">
                        {healthPlan.nutritionPlan.lunch.postMeal}
                      </p>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Expected Glucose:
                      </span>
                      <p className="text-sm text-gray-600 mt-1">
                        {healthPlan.nutritionPlan.lunch.expectedGlucose}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Dinner */}
              {healthPlan.nutritionPlan.dinner && (
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-800">
                      Dinner ({healthPlan.nutritionPlan.dinner.time})
                    </h4>
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      {healthPlan.nutritionPlan.dinner.theme}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Foods:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {healthPlan.nutritionPlan.dinner.foods.map(
                          (food, index) => (
                            <span
                              key={index}
                              className="bg-white text-xs px-2 py-1 rounded-full text-gray-600"
                            >
                              {food}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Supplements:
                      </span>
                      <ul className="mt-1 space-y-1">
                        {healthPlan.nutritionPlan.dinner.supplements.map(
                          (supplement, index) => (
                            <li
                              key={index}
                              className="text-xs text-gray-600 flex items-center space-x-1"
                            >
                              <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                              <span>{supplement}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Sleep Optimization */}
      {healthPlan.sleepOptimization && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection("sleep-optimization")}
          >
            <div className="flex items-center space-x-2">
              <Moon className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Sleep Optimization Protocol
              </h3>
            </div>
            {isExpanded("sleep-optimization") ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>

          {isExpanded("sleep-optimization") && (
            <div className="mt-4 space-y-4">
              <div className="bg-indigo-50 rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">
                      Wind-Down Sequence
                    </h4>
                    <p className="text-sm text-gray-600">
                      {healthPlan.sleepOptimization.windDown}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">
                      Relaxation Protocol
                    </h4>
                    <p className="text-sm text-gray-600">
                      {healthPlan.sleepOptimization.relaxation}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">
                      Sleep Sanctuary
                    </h4>
                    <p className="text-sm text-gray-600">
                      {healthPlan.sleepOptimization.sleepSanctuary}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">
                      Sleep Schedule
                    </h4>
                    <div className="text-sm text-gray-600">
                      <div>Bedtime: {healthPlan.sleepOptimization.bedtime}</div>
                      <div>Wake: {healthPlan.sleepOptimization.targetWake}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Adaptive Adjustments */}
      {healthPlan.adaptiveAdjustments && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection("adaptive-adjustments")}
          >
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-pink-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Adaptive Adjustments
              </h3>
            </div>
            {isExpanded("adaptive-adjustments") ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>

          {isExpanded("adaptive-adjustments") && (
            <div className="mt-4 space-y-3">
              {Object.entries(healthPlan.adaptiveAdjustments).map(
                ([key, value]) => (
                  <div key={key} className="bg-pink-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-800 mb-1 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </h4>
                    <p className="text-sm text-gray-600">{value}</p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}

      {/* Evidence Support */}
      {healthPlan.evidenceSupport && healthPlan.evidenceSupport.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection("evidence-support")}
          >
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Evidence Support
              </h3>
            </div>
            {isExpanded("evidence-support") ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>

          {isExpanded("evidence-support") && (
            <div className="mt-4 space-y-2">
              {healthPlan.evidenceSupport.map((study, index) => (
                <div key={index} className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">{study}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Warnings */}
      {healthPlan.warnings && healthPlan.warnings.length > 0 && (
        <div className="bg-yellow-50 rounded-2xl p-6 shadow-lg border border-yellow-200">
          <div className="flex items-center space-x-2 mb-3">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Important Warnings
            </h3>
          </div>
          <div className="space-y-2">
            {healthPlan.warnings.map((warning, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="w-1 h-1 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                <p className="text-sm text-gray-600">{warning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      {healthPlan.nextSteps && healthPlan.nextSteps.length > 0 && (
        <div className="bg-green-50 rounded-2xl p-6 shadow-lg border border-green-200">
          <div className="flex items-center space-x-2 mb-3">
            <Award className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">Next Steps</h3>
          </div>
          <div className="space-y-2">
            {healthPlan.nextSteps.map((step, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <p className="text-sm text-gray-600">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
