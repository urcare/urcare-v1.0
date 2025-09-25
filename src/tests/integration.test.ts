/**
 * INTEGRATION TEST SUITE
 *
 * End-to-end tests for the intelligent health planning system
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AutomaticDailyScheduler } from "../services/automaticDailyScheduler";
import { HealthTrackingService } from "../services/healthTrackingService";
import { IntelligentHealthPlanningService } from "../services/intelligentHealthPlanningService";

// Mock user profile
const mockProfile = {
  id: "test-user-id",
  name: "Test User",
  age: 30,
  gender: "male",
  height: 180,
  weight: 75,
  health_conditions: [],
  medications: [],
  goals: ["lose weight", "build muscle"],
};

describe("Intelligent Health Planning Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("OPENAI_API_KEY", "test-api-key");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("Complete User Journey", () => {
    it("should complete full user journey from goal input to daily tracking", async () => {
      // Step 1: Generate difficulty options
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    easy: {
                      name: "Easy Plan",
                      description: "Perfect for beginners",
                      characteristics: ["30-45 min/day", "Basic exercises"],
                      estimatedTime: "30-45 minutes",
                      intensity: 3,
                      estimatedResults: ["Improved fitness"],
                      timeCommitment: "3-4 hours/week",
                      equipmentNeeded: ["Basic equipment"],
                      preparationSteps: ["Set up space"],
                      successMetrics: ["Consistent completion"],
                      warnings: ["Consult doctor"],
                      alternatives: ["Modify as needed"],
                    },
                    moderate: {
                      name: "Moderate Plan",
                      description: "Balanced approach",
                      characteristics: ["60-90 min/day", "Varied exercises"],
                      estimatedTime: "60-90 minutes",
                      intensity: 6,
                      estimatedResults: ["Significant gains"],
                      timeCommitment: "5-7 hours/week",
                      equipmentNeeded: ["Home gym equipment"],
                      preparationSteps: ["Set up gym"],
                      successMetrics: ["Progress tracking"],
                      warnings: ["Start gradually"],
                      alternatives: ["Adjust intensity"],
                    },
                    hard: {
                      name: "Hard Plan",
                      description: "Intensive program",
                      characteristics: ["90-120 min/day", "Complex exercises"],
                      estimatedTime: "90-120 minutes",
                      intensity: 9,
                      estimatedResults: ["Maximum gains"],
                      timeCommitment: "8-10 hours/week",
                      equipmentNeeded: ["Full gym equipment"],
                      preparationSteps: ["Set up full gym"],
                      successMetrics: ["Detailed tracking"],
                      warnings: ["High intensity"],
                      alternatives: ["Reduce intensity"],
                    },
                  }),
                },
              },
            ],
          }),
      });

      const difficultyOptions =
        await IntelligentHealthPlanningService.generateDifficultyOptions(
          mockProfile,
          "lose weight and build muscle"
        );

      expect(difficultyOptions).toHaveProperty("easy");
      expect(difficultyOptions).toHaveProperty("moderate");
      expect(difficultyOptions).toHaveProperty("hard");

      // Step 2: Generate weekly plan
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    days: Array.from({ length: 7 }, (_, i) => ({
                      date: `2024-01-0${i + 1}`,
                      dayOfWeek: [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                      ][i],
                      activities: [
                        {
                          id: `wake_${i + 1}`,
                          type: "wake_up",
                          title: `Wake Up Day ${i + 1}`,
                          description: "Start your day",
                          startTime: "06:00",
                          endTime: "06:15",
                          duration: 15,
                          priority: "high",
                          difficulty: "easy",
                          instructions: ["Set alarm", "Get up"],
                          tips: ["Drink water"],
                        },
                        {
                          id: `breakfast_${i + 1}`,
                          type: "breakfast",
                          title: `Breakfast Day ${i + 1}`,
                          description: "Nutritious morning meal",
                          startTime: "07:00",
                          endTime: "07:30",
                          duration: 30,
                          priority: "high",
                          difficulty: "easy",
                          instructions: ["Prepare meal", "Eat mindfully"],
                          tips: ["Include protein"],
                          nutritionDetails: {
                            calories: 400,
                            protein: 20,
                            carbs: 50,
                            fat: 15,
                            ingredients: ["Eggs", "Oatmeal", "Fruit"],
                            preparation: ["Cook eggs", "Prepare oatmeal"],
                            variations: ["Different fruits"],
                          },
                        },
                      ],
                      summary: {
                        totalActivities: 2,
                        totalDuration: 45,
                        calories: 2000,
                        protein: 150,
                        focusAreas: ["fitness", "nutrition"],
                        difficulty: "easy",
                      },
                    })),
                    overallGoals: ["lose weight", "build muscle"],
                    progressTips: ["Stay consistent", "Track progress"],
                    mealVariations: {
                      breakfast: [
                        "Oatmeal",
                        "Eggs",
                        "Smoothie",
                        "Pancakes",
                        "Cereal",
                        "Toast",
                        "Yogurt",
                      ],
                      lunch: [
                        "Salad",
                        "Soup",
                        "Sandwich",
                        "Pasta",
                        "Rice",
                        "Quinoa",
                        "Wrap",
                      ],
                      dinner: [
                        "Chicken",
                        "Fish",
                        "Beef",
                        "Vegetables",
                        "Pasta",
                        "Rice",
                        "Salad",
                      ],
                      snacks: [
                        "Nuts",
                        "Fruit",
                        "Yogurt",
                        "Crackers",
                        "Cheese",
                        "Berries",
                        "Trail Mix",
                      ],
                    },
                  }),
                },
              },
            ],
          }),
      });

      const weeklyPlan =
        await IntelligentHealthPlanningService.generateWeeklyPlan(
          mockProfile,
          "easy",
          "lose weight and build muscle"
        );

      expect(weeklyPlan).toHaveProperty("days");
      expect(weeklyPlan.days).toHaveLength(7);
      expect(weeklyPlan.difficulty).toBe("easy");
      expect(weeklyPlan.overallGoals).toContain("lose weight");
      expect(weeklyPlan.overallGoals).toContain("build muscle");

      // Verify meal variations are unique
      expect(new Set(weeklyPlan.mealVariations.breakfast).size).toBe(7);
      expect(new Set(weeklyPlan.mealVariations.lunch).size).toBe(7);
      expect(new Set(weeklyPlan.mealVariations.dinner).size).toBe(7);
      expect(new Set(weeklyPlan.mealVariations.snacks).size).toBe(7);

      // Step 3: Generate next day schedule
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    date: "2024-01-08",
                    dayOfWeek: "Monday",
                    activities: [
                      {
                        id: "wake_8",
                        type: "wake_up",
                        title: "Wake Up Day 8",
                        description: "Start your day",
                        startTime: "06:00",
                        endTime: "06:15",
                        duration: 15,
                        priority: "high",
                        difficulty: "easy",
                        instructions: ["Set alarm", "Get up"],
                        tips: ["Drink water"],
                      },
                    ],
                    summary: {
                      totalActivities: 1,
                      totalDuration: 15,
                      calories: 2000,
                      protein: 150,
                      focusAreas: ["fitness"],
                      difficulty: "easy",
                    },
                  }),
                },
              },
            ],
          }),
      });

      const nextDaySchedule =
        await IntelligentHealthPlanningService.generateNextDaySchedule(
          mockProfile.id,
          "2024-01-07",
          75
        );

      expect(nextDaySchedule).toHaveProperty("date");
      expect(nextDaySchedule).toHaveProperty("activities");
      expect(nextDaySchedule.activities).toHaveLength(1);

      // Step 4: Track activity completion
      const activityId = nextDaySchedule.activities[0].id;
      await IntelligentHealthPlanningService.trackActivityCompletion(
        mockProfile.id,
        activityId,
        true,
        "Completed successfully"
      );

      // Step 5: Record health metrics
      const healthMetrics = {
        date: "2024-01-08",
        weight: 74.5,
        bodyFat: 14.5,
        muscleMass: 60.5,
        sleepHours: 8,
        sleepQuality: 8,
        energyLevel: 7,
        mood: 8,
        stressLevel: 3,
        waterIntake: 2500,
        steps: 10000,
        caloriesBurned: 2000,
      };

      await HealthTrackingService.recordHealthMetrics(
        mockProfile.id,
        healthMetrics
      );

      // Step 6: Get health progress
      const healthProgress =
        await IntelligentHealthPlanningService.getUserHealthProgress(
          mockProfile.id
        );

      expect(healthProgress).toHaveProperty("totalPlans");
      expect(healthProgress).toHaveProperty("completedPlans");
      expect(healthProgress).toHaveProperty("currentStreak");
      expect(healthProgress).toHaveProperty("averageCompletion");
      expect(healthProgress).toHaveProperty("healthScore");

      // Step 7: Generate health insights
      const healthInsights = await HealthTrackingService.generateHealthInsights(
        mockProfile.id
      );

      expect(healthInsights).toHaveProperty("overallHealthScore");
      expect(healthInsights).toHaveProperty("improvementAreas");
      expect(healthInsights).toHaveProperty("strengths");
      expect(healthInsights).toHaveProperty("recommendations");
    });
  });

  describe("Plan Uniqueness Verification", () => {
    it("should generate unique plans for different users with same goals", async () => {
      const user1Profile = { ...mockProfile, id: "user1", name: "User 1" };
      const user2Profile = { ...mockProfile, id: "user2", name: "User 2" };

      // Mock different responses for each user
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              choices: [
                {
                  message: {
                    content: JSON.stringify({
                      days: [
                        {
                          date: "2024-01-01",
                          dayOfWeek: "Monday",
                          activities: [
                            {
                              id: "wake_1",
                              type: "wake_up",
                              title: "Wake Up User 1",
                              description: "Start your day",
                              startTime: "06:00",
                              endTime: "06:15",
                              duration: 15,
                              priority: "high",
                              difficulty: "easy",
                              instructions: ["Set alarm", "Get up"],
                              tips: ["Drink water"],
                            },
                          ],
                          summary: {
                            totalActivities: 1,
                            totalDuration: 15,
                            calories: 2000,
                            protein: 150,
                            focusAreas: [],
                            difficulty: "easy",
                          },
                        },
                      ],
                      overallGoals: ["lose weight"],
                      progressTips: ["Stay consistent"],
                      mealVariations: {
                        breakfast: ["Oatmeal"],
                        lunch: ["Salad"],
                        dinner: ["Chicken"],
                        snacks: ["Nuts"],
                      },
                    }),
                  },
                },
              ],
            }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              choices: [
                {
                  message: {
                    content: JSON.stringify({
                      days: [
                        {
                          date: "2024-01-01",
                          dayOfWeek: "Monday",
                          activities: [
                            {
                              id: "wake_2",
                              type: "wake_up",
                              title: "Wake Up User 2",
                              description: "Start your day",
                              startTime: "06:00",
                              endTime: "06:15",
                              duration: 15,
                              priority: "high",
                              difficulty: "easy",
                              instructions: ["Set alarm", "Get up"],
                              tips: ["Drink water"],
                            },
                          ],
                          summary: {
                            totalActivities: 1,
                            totalDuration: 15,
                            calories: 2000,
                            protein: 150,
                            focusAreas: [],
                            difficulty: "easy",
                          },
                        },
                      ],
                      overallGoals: ["lose weight"],
                      progressTips: ["Stay consistent"],
                      mealVariations: {
                        breakfast: ["Eggs"],
                        lunch: ["Soup"],
                        dinner: ["Fish"],
                        snacks: ["Fruit"],
                      },
                    }),
                  },
                },
              ],
            }),
        });

      const plan1 = await IntelligentHealthPlanningService.generateWeeklyPlan(
        user1Profile,
        "easy",
        "lose weight"
      );

      const plan2 = await IntelligentHealthPlanningService.generateWeeklyPlan(
        user2Profile,
        "easy",
        "lose weight"
      );

      // Plans should be different even with same goals
      expect(plan1.mealVariations.breakfast).not.toEqual(
        plan2.mealVariations.breakfast
      );
      expect(plan1.mealVariations.lunch).not.toEqual(
        plan2.mealVariations.lunch
      );
      expect(plan1.mealVariations.dinner).not.toEqual(
        plan2.mealVariations.dinner
      );
      expect(plan1.mealVariations.snacks).not.toEqual(
        plan2.mealVariations.snacks
      );
    });

    it("should generate different plans for same user with different goals", async () => {
      // Mock different responses for different goals
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              choices: [
                {
                  message: {
                    content: JSON.stringify({
                      days: [
                        {
                          date: "2024-01-01",
                          dayOfWeek: "Monday",
                          activities: [
                            {
                              id: "wake_1",
                              type: "wake_up",
                              title: "Wake Up - Weight Loss",
                              description: "Start your day",
                              startTime: "06:00",
                              endTime: "06:15",
                              duration: 15,
                              priority: "high",
                              difficulty: "easy",
                              instructions: ["Set alarm", "Get up"],
                              tips: ["Drink water"],
                            },
                          ],
                          summary: {
                            totalActivities: 1,
                            totalDuration: 15,
                            calories: 1500,
                            protein: 120,
                            focusAreas: [],
                            difficulty: "easy",
                          },
                        },
                      ],
                      overallGoals: ["lose weight"],
                      progressTips: ["Stay consistent"],
                      mealVariations: {
                        breakfast: ["Oatmeal"],
                        lunch: ["Salad"],
                        dinner: ["Chicken"],
                        snacks: ["Nuts"],
                      },
                    }),
                  },
                },
              ],
            }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              choices: [
                {
                  message: {
                    content: JSON.stringify({
                      days: [
                        {
                          date: "2024-01-01",
                          dayOfWeek: "Monday",
                          activities: [
                            {
                              id: "wake_2",
                              type: "wake_up",
                              title: "Wake Up - Muscle Building",
                              description: "Start your day",
                              startTime: "06:00",
                              endTime: "06:15",
                              duration: 15,
                              priority: "high",
                              difficulty: "easy",
                              instructions: ["Set alarm", "Get up"],
                              tips: ["Drink water"],
                            },
                          ],
                          summary: {
                            totalActivities: 1,
                            totalDuration: 15,
                            calories: 2500,
                            protein: 200,
                            focusAreas: [],
                            difficulty: "easy",
                          },
                        },
                      ],
                      overallGoals: ["build muscle"],
                      progressTips: ["Stay consistent"],
                      mealVariations: {
                        breakfast: ["Eggs"],
                        lunch: ["Soup"],
                        dinner: ["Fish"],
                        snacks: ["Fruit"],
                      },
                    }),
                  },
                },
              ],
            }),
        });

      const weightLossPlan =
        await IntelligentHealthPlanningService.generateWeeklyPlan(
          mockProfile,
          "easy",
          "lose weight"
        );

      const muscleBuildingPlan =
        await IntelligentHealthPlanningService.generateWeeklyPlan(
          mockProfile,
          "easy",
          "build muscle"
        );

      // Plans should be different for different goals
      expect(weightLossPlan.overallGoals).toContain("lose weight");
      expect(muscleBuildingPlan.overallGoals).toContain("build muscle");
      expect(weightLossPlan.days[0].summary.calories).toBeLessThan(
        muscleBuildingPlan.days[0].summary.calories
      );
      expect(weightLossPlan.days[0].summary.protein).toBeLessThan(
        muscleBuildingPlan.days[0].summary.protein
      );
    });
  });

  describe("Automatic Daily Progression", () => {
    it("should automatically generate next day schedule", async () => {
      // Mock the database calls
      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({ data: null, error: null }), // No existing schedule
            })),
          })),
        })),
      };

      // Mock the next day generation
      const mockNextDaySchedule = {
        date: "2024-01-02",
        dayOfWeek: "Tuesday",
        activities: [
          {
            id: "wake_2",
            type: "wake_up",
            title: "Wake Up Day 2",
            description: "Start your day",
            startTime: "06:00",
            endTime: "06:15",
            duration: 15,
            priority: "high",
            difficulty: "easy",
            instructions: ["Set alarm", "Get up"],
            tips: ["Drink water"],
          },
        ],
        summary: {
          totalActivities: 1,
          totalDuration: 15,
          calories: 2000,
          protein: 150,
          focusAreas: ["fitness"],
          difficulty: "easy",
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content: JSON.stringify(mockNextDaySchedule),
                },
              },
            ],
          }),
      });

      const result = await AutomaticDailyScheduler.checkAndGenerateNextDay(
        "test-user-id"
      );

      expect(result).toEqual(mockNextDaySchedule);
    });

    it("should adjust difficulty based on completion rate", () => {
      const config = {
        autoGenerateNextDay: true,
        adjustDifficultyBasedOnCompletion: true,
        maxDifficultyAdjustment: 0.3,
        completionThresholdForIncrease: 85,
        completionThresholdForDecrease: 50,
      };

      // Test different completion rates
      const highCompletion = AutomaticDailyScheduler.adjustDifficulty(
        "easy",
        90,
        config
      );
      const mediumCompletion = AutomaticDailyScheduler.adjustDifficulty(
        "moderate",
        60,
        config
      );
      const lowCompletion = AutomaticDailyScheduler.adjustDifficulty(
        "hard",
        30,
        config
      );

      expect(highCompletion).toBe("moderate"); // Should increase difficulty
      expect(mediumCompletion).toBe("moderate"); // Should stay same
      expect(lowCompletion).toBe("moderate"); // Should decrease difficulty
    });
  });

  describe("Health Tracking Integration", () => {
    it("should track health metrics and generate insights", async () => {
      const healthMetrics = {
        date: "2024-01-01",
        weight: 75,
        bodyFat: 15,
        muscleMass: 60,
        sleepHours: 8,
        sleepQuality: 8,
        energyLevel: 7,
        mood: 8,
        stressLevel: 3,
        waterIntake: 2500,
        steps: 10000,
        caloriesBurned: 2000,
      };

      // Mock the database calls
      const mockUpsert = vi.fn().mockResolvedValue({ data: null, error: null });
      const mockSupabase = {
        from: vi.fn(() => ({
          upsert: mockUpsert,
        })),
      };

      await HealthTrackingService.recordHealthMetrics(
        "test-user-id",
        healthMetrics
      );

      expect(mockUpsert).toHaveBeenCalledWith({
        user_id: "test-user-id",
        date: healthMetrics.date,
        weight: healthMetrics.weight,
        body_fat: healthMetrics.bodyFat,
        muscle_mass: healthMetrics.muscleMass,
        sleep_hours: healthMetrics.sleepHours,
        sleep_quality: healthMetrics.sleepQuality,
        energy_level: healthMetrics.energyLevel,
        mood: healthMetrics.mood,
        stress_level: healthMetrics.stressLevel,
        water_intake: healthMetrics.waterIntake,
        steps: healthMetrics.steps,
        calories_burned: healthMetrics.caloriesBurned,
        notes: undefined,
        updated_at: expect.any(String),
      });
    });

    it("should calculate health trends over time", async () => {
      const mockData = [
        { date: "2024-01-01", weight: 75, sleep_quality: 8, energy_level: 7 },
        { date: "2024-01-02", weight: 74.5, sleep_quality: 9, energy_level: 8 },
        { date: "2024-01-03", weight: 74, sleep_quality: 8, energy_level: 8 },
      ];

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              gte: vi.fn(() => ({
                lte: vi.fn(() => ({
                  order: vi
                    .fn()
                    .mockResolvedValue({ data: mockData, error: null }),
                })),
              })),
            })),
          })),
        })),
      };

      const trends = await HealthTrackingService.getHealthTrends(
        "test-user-id",
        "7d"
      );

      expect(trends).toHaveProperty("weightTrend");
      expect(trends).toHaveProperty("sleepTrend");
      expect(trends).toHaveProperty("energyTrend");
      expect(trends.weightTrend).toEqual([75, 74.5, 74]);
      expect(trends.sleepTrend).toEqual([8, 9, 8]);
      expect(trends.energyTrend).toEqual([7, 8, 8]);
    });
  });

  describe("Error Handling and Resilience", () => {
    it("should handle network errors gracefully", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

      const result =
        await IntelligentHealthPlanningService.generateDifficultyOptions(
          mockProfile,
          "lose weight"
        );

      // Should return fallback options
      expect(result).toHaveProperty("easy");
      expect(result).toHaveProperty("moderate");
      expect(result).toHaveProperty("hard");
    });

    it("should handle invalid AI responses", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content: "Invalid JSON response",
                },
              },
            ],
          }),
      });

      const result =
        await IntelligentHealthPlanningService.generateDifficultyOptions(
          mockProfile,
          "lose weight"
        );

      // Should return fallback options
      expect(result).toHaveProperty("easy");
      expect(result).toHaveProperty("moderate");
      expect(result).toHaveProperty("hard");
    });

    it("should handle database errors gracefully", async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi
                .fn()
                .mockResolvedValue({
                  data: null,
                  error: { message: "Database error" },
                }),
            })),
          })),
        })),
      };

      const result = await AutomaticDailyScheduler.checkAndGenerateNextDay(
        "test-user-id"
      );

      // Should return null when database error occurs
      expect(result).toBeNull();
    });
  });
});
