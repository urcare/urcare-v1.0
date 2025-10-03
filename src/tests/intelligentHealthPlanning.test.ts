/**
 * INTELLIGENT HEALTH PLANNING TEST SUITE
 *
 * Comprehensive tests for the intelligent health planning system
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AutomaticDailyScheduler } from "../services/automaticDailyScheduler";
import { HealthTrackingService } from "../services/healthTrackingService";
import { IntelligentHealthPlanningService } from "../services/intelligentHealthPlanningService";

// Mock Supabase client
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(() => ({ data: null, error: null })),
        order: vi.fn(() => ({
          limit: vi.fn(() => ({ data: [], error: null })),
        })),
      })),
      gte: vi.fn(() => ({
        lte: vi.fn(() => ({ data: [], error: null })),
      })),
    })),
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => ({ data: { id: "test-plan-id" }, error: null })),
      })),
    })),
    upsert: vi.fn(() => ({ data: null, error: null })),
    update: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
    rpc: vi.fn(() => ({ data: [], error: null })),
  })),
};

// Mock OpenAI API
const mockOpenAI = {
  fetch: vi.fn(() =>
    Promise.resolve({
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
    })
  ),
};

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

describe("Intelligent Health Planning System", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock environment variables
    vi.stubEnv("OPENAI_API_KEY", "test-api-key");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("Difficulty Options Generation", () => {
    it("should generate three difficulty options", async () => {
      // Mock the AI service call
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

      const result =
        await IntelligentHealthPlanningService.generateDifficultyOptions(
          mockProfile,
          "lose weight and build muscle"
        );

      expect(result).toHaveProperty("easy");
      expect(result).toHaveProperty("moderate");
      expect(result).toHaveProperty("hard");

      expect(result.easy.level).toBe("easy");
      expect(result.moderate.level).toBe("moderate");
      expect(result.hard.level).toBe("hard");

      expect(result.easy.intensity).toBeLessThan(result.moderate.intensity);
      expect(result.moderate.intensity).toBeLessThan(result.hard.intensity);
    });

    it("should handle AI service errors gracefully", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("API Error"));

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
  });

  describe("Weekly Plan Generation", () => {
    it("should generate unique weekly plans", async () => {
      global.fetch = vi.fn().mockResolvedValue({
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
                            title: "Wake Up",
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
                      },
                    ],
                    overallGoals: ["lose weight"],
                    progressTips: ["Stay consistent"],
                    mealVariations: {
                      breakfast: ["Oatmeal", "Eggs"],
                      lunch: ["Salad", "Soup"],
                      dinner: ["Chicken", "Fish"],
                      snacks: ["Nuts", "Fruit"],
                    },
                  }),
                },
              },
            ],
          }),
      });

      const result = await IntelligentHealthPlanningService.generateWeeklyPlan(
        mockProfile,
        "easy",
        "lose weight"
      );

      expect(result).toHaveProperty("days");
      expect(result.days).toHaveLength(1);
      expect(result.difficulty).toBe("easy");
      expect(result.overallGoals).toContain("lose weight");
      expect(result.mealVariations).toHaveProperty("breakfast");
    });

    it("should ensure meal variations are unique", async () => {
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
                      activities: [],
                      summary: {
                        totalActivities: 0,
                        totalDuration: 0,
                        calories: 2000,
                        protein: 150,
                        focusAreas: [],
                        difficulty: "easy",
                      },
                    })),
                    overallGoals: ["lose weight"],
                    progressTips: ["Stay consistent"],
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

      const result = await IntelligentHealthPlanningService.generateWeeklyPlan(
        mockProfile,
        "moderate",
        "lose weight"
      );

      expect(result.mealVariations.breakfast).toHaveLength(7);
      expect(result.mealVariations.lunch).toHaveLength(7);
      expect(result.mealVariations.dinner).toHaveLength(7);
      expect(result.mealVariations.snacks).toHaveLength(7);

      // Check for uniqueness
      expect(new Set(result.mealVariations.breakfast).size).toBe(7);
      expect(new Set(result.mealVariations.lunch).size).toBe(7);
      expect(new Set(result.mealVariations.dinner).size).toBe(7);
      expect(new Set(result.mealVariations.snacks).size).toBe(7);
    });
  });

  describe("Daily Schedule Generation", () => {
    it("should generate next day schedule", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    date: "2024-01-02",
                    dayOfWeek: "Tuesday",
                    activities: [
                      {
                        id: "wake_2",
                        type: "wake_up",
                        title: "Wake Up",
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

      const result =
        await IntelligentHealthPlanningService.generateNextDaySchedule(
          "test-user-id",
          "2024-01-01",
          75
        );

      expect(result).toHaveProperty("date");
      expect(result).toHaveProperty("activities");
      expect(result.activities).toHaveLength(1);
    });

    it("should adjust difficulty based on completion rate", () => {
      const adjustedEasy = IntelligentHealthPlanningService[
        "adjustDifficultyBasedOnCompletion"
      ]("easy", 95);
      const adjustedModerate = IntelligentHealthPlanningService[
        "adjustDifficultyBasedOnCompletion"
      ]("moderate", 30);
      const adjustedHard = IntelligentHealthPlanningService[
        "adjustDifficultyBasedOnCompletion"
      ]("hard", 40);

      expect(adjustedEasy).toBe("moderate"); // High completion should increase difficulty
      expect(adjustedModerate).toBe("easy"); // Low completion should decrease difficulty
      expect(adjustedHard).toBe("moderate"); // Low completion should decrease difficulty
    });
  });

  describe("Health Tracking", () => {
    it("should record health metrics", async () => {
      const metrics = {
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

      // Mock the upsert call
      const mockUpsert = vi.fn().mockResolvedValue({ data: null, error: null });
      mockSupabase.from.mockReturnValue({
        upsert: mockUpsert,
      });

      await HealthTrackingService.recordHealthMetrics("test-user-id", metrics);

      expect(mockUpsert).toHaveBeenCalledWith({
        user_id: "test-user-id",
        date: metrics.date,
        weight: metrics.weight,
        body_fat: metrics.bodyFat,
        muscle_mass: metrics.muscleMass,
        sleep_hours: metrics.sleepHours,
        sleep_quality: metrics.sleepQuality,
        energy_level: metrics.energyLevel,
        mood: metrics.mood,
        stress_level: metrics.stressLevel,
        water_intake: metrics.waterIntake,
        steps: metrics.steps,
        calories_burned: metrics.caloriesBurned,
        notes: undefined,
        updated_at: expect.any(String),
      });
    });

    it("should calculate health trends", async () => {
      const mockData = [
        { date: "2024-01-01", weight: 75, sleep_quality: 8, energy_level: 7 },
        { date: "2024-01-02", weight: 74.5, sleep_quality: 9, energy_level: 8 },
        { date: "2024-01-03", weight: 74, sleep_quality: 8, energy_level: 8 },
      ];

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnValue({
              lte: vi.fn().mockReturnValue({
                order: vi
                  .fn()
                  .mockResolvedValue({ data: mockData, error: null }),
              }),
            }),
          }),
        }),
      });

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

  describe("Automatic Daily Scheduler", () => {
    it("should check and generate next day schedule", async () => {
      const mockSchedule = {
        date: "2024-01-02",
        dayOfWeek: "Tuesday",
        activities: [],
        summary: {
          totalActivities: 0,
          totalDuration: 0,
          calories: 2000,
          protein: 150,
          focusAreas: [],
          difficulty: "easy",
        },
      };

      // Mock the database calls
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: null }), // No existing schedule
          }),
        }),
      });

      // Mock the next day generation
      vi.spyOn(
        IntelligentHealthPlanningService,
        "generateNextDaySchedule"
      ).mockResolvedValue(mockSchedule);

      const result = await AutomaticDailyScheduler.checkAndGenerateNextDay(
        "test-user-id"
      );

      expect(result).toEqual(mockSchedule);
    });

    it("should adjust difficulty based on completion", () => {
      const config = {
        autoGenerateNextDay: true,
        adjustDifficultyBasedOnCompletion: true,
        maxDifficultyAdjustment: 0.3,
        completionThresholdForIncrease: 85,
        completionThresholdForDecrease: 50,
      };

      const adjustedEasy = AutomaticDailyScheduler.adjustDifficulty(
        "easy",
        90,
        config
      );
      const adjustedModerate = AutomaticDailyScheduler.adjustDifficulty(
        "moderate",
        40,
        config
      );
      const adjustedHard = AutomaticDailyScheduler.adjustDifficulty(
        "hard",
        60,
        config
      );

      expect(adjustedEasy).toBe("moderate"); // High completion should increase
      expect(adjustedModerate).toBe("easy"); // Low completion should decrease
      expect(adjustedHard).toBe("hard"); // Medium completion should stay same
    });
  });

  describe("Plan Uniqueness", () => {
    it("should generate different plans for different users", async () => {
      const user1Profile = { ...mockProfile, id: "user1", name: "User 1" };
      const user2Profile = { ...mockProfile, id: "user2", name: "User 2" };

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

      const plan1 = await IntelligentHealthPlanningService.generateWeeklyPlan(
        user1Profile,
        "easy",
        "lose weight"
      );

      const plan2 = await IntelligentHealthPlanningService.generateWeeklyPlan(
        user2Profile,
        "easy",
        "build muscle"
      );

      expect(plan1.overallGoals).toContain("lose weight");
      expect(plan2.overallGoals).toContain("build muscle");
      expect(plan1.mealVariations.breakfast).not.toEqual(
        plan2.mealVariations.breakfast
      );
    });

    it("should generate different plans for different goals", async () => {
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

  describe("Error Handling", () => {
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
  });
});
