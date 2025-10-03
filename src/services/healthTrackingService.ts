/**
 * HEALTH TRACKING SERVICE
 *
 * Service for tracking health progress, scores, and analytics
 */

import { supabase } from "@/integrations/supabase/client";
import {
  HealthProgress,
  IntelligentHealthPlanningService,
} from "./intelligentHealthPlanningService";

export interface HealthMetrics {
  date: string;
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  heartRate?: number;
  sleepHours?: number;
  sleepQuality?: number; // 1-10 scale
  energyLevel?: number; // 1-10 scale
  mood?: number; // 1-10 scale
  stressLevel?: number; // 1-10 scale
  waterIntake?: number; // in ml
  steps?: number;
  caloriesBurned?: number;
  notes?: string;
}

export interface HealthTrends {
  period: string;
  weightTrend: number[]; // Array of weight values over time
  bodyFatTrend: number[];
  muscleMassTrend: number[];
  sleepTrend: number[];
  energyTrend: number[];
  moodTrend: number[];
  stressTrend: number[];
  activityTrend: number[]; // Completion rates over time
}

export interface HealthInsights {
  overallHealthScore: number;
  improvementAreas: string[];
  strengths: string[];
  recommendations: string[];
  riskFactors: string[];
  achievements: string[];
  nextGoals: string[];
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  totalActivities: number;
  completedActivities: number;
  completionRate: number;
  averageHealthScore: number;
  weightChange: number;
  bodyFatChange: number;
  muscleMassChange: number;
  sleepImprovement: number;
  energyImprovement: number;
  moodImprovement: number;
  stressReduction: number;
  topPerformingDays: string[];
  challengingDays: string[];
  insights: HealthInsights;
  recommendations: string[];
}

export class HealthTrackingService {
  /**
   * Record health metrics for a specific date
   */
  static async recordHealthMetrics(
    userId: string,
    metrics: HealthMetrics
  ): Promise<void> {
    console.log(`📊 Recording health metrics for ${metrics.date}...`);

    try {
      const { error } = await supabase.from("health_metrics").upsert({
        user_id: userId,
        date: metrics.date,
        weight: metrics.weight,
        body_fat: metrics.bodyFat,
        muscle_mass: metrics.muscleMass,
        blood_pressure_systolic: metrics.bloodPressure?.systolic,
        blood_pressure_diastolic: metrics.bloodPressure?.diastolic,
        heart_rate: metrics.heartRate,
        sleep_hours: metrics.sleepHours,
        sleep_quality: metrics.sleepQuality,
        energy_level: metrics.energyLevel,
        mood: metrics.mood,
        stress_level: metrics.stressLevel,
        water_intake: metrics.waterIntake,
        steps: metrics.steps,
        calories_burned: metrics.caloriesBurned,
        notes: metrics.notes,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw new Error(`Failed to record health metrics: ${error.message}`);
      }

      // Update health score based on new metrics
      await this.updateHealthScore(userId, metrics);

      console.log("✅ Health metrics recorded successfully");
    } catch (error) {
      console.error("Error recording health metrics:", error);
      throw error;
    }
  }

  /**
   * Get health metrics for a date range
   */
  static async getHealthMetrics(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<HealthMetrics[]> {
    console.log(`📈 Getting health metrics from ${startDate} to ${endDate}...`);

    try {
      const { data, error } = await supabase
        .from("health_metrics")
        .select("*")
        .eq("user_id", userId)
        .gte("date", startDate)
        .lte("date", endDate)
        .order("date");

      if (error) {
        throw new Error(`Failed to get health metrics: ${error.message}`);
      }

      return (data || []).map((metric) => ({
        date: metric.date,
        weight: metric.weight,
        bodyFat: metric.body_fat,
        muscleMass: metric.muscle_mass,
        bloodPressure:
          metric.blood_pressure_systolic && metric.blood_pressure_diastolic
            ? {
                systolic: metric.blood_pressure_systolic,
                diastolic: metric.blood_pressure_diastolic,
              }
            : undefined,
        heartRate: metric.heart_rate,
        sleepHours: metric.sleep_hours,
        sleepQuality: metric.sleep_quality,
        energyLevel: metric.energy_level,
        mood: metric.mood,
        stressLevel: metric.stress_level,
        waterIntake: metric.water_intake,
        steps: metric.steps,
        caloriesBurned: metric.calories_burned,
        notes: metric.notes,
      }));
    } catch (error) {
      console.error("Error getting health metrics:", error);
      return [];
    }
  }

  /**
   * Calculate health trends over time
   */
  static async getHealthTrends(
    userId: string,
    period: string = "30d"
  ): Promise<HealthTrends> {
    console.log(`📊 Calculating health trends for ${period}...`);

    try {
      const endDate = new Date();
      const startDate = new Date();

      switch (period) {
        case "7d":
          startDate.setDate(startDate.getDate() - 7);
          break;
        case "30d":
          startDate.setDate(startDate.getDate() - 30);
          break;
        case "90d":
          startDate.setDate(startDate.getDate() - 90);
          break;
        default:
          startDate.setDate(startDate.getDate() - 30);
      }

      const metrics = await this.getHealthMetrics(
        userId,
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0]
      );

      // Get activity completion rates
      const { data: activities } = await supabase
        .from("activity_completions")
        .select("created_at, completed")
        .eq("user_id", userId)
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());

      // Calculate daily completion rates
      const dailyCompletionRates = this.calculateDailyCompletionRates(
        activities || []
      );

      return {
        period,
        weightTrend: metrics.map((m) => m.weight || 0),
        bodyFatTrend: metrics.map((m) => m.bodyFat || 0),
        muscleMassTrend: metrics.map((m) => m.muscleMass || 0),
        sleepTrend: metrics.map((m) => m.sleepHours || 0),
        energyTrend: metrics.map((m) => m.energyLevel || 0),
        moodTrend: metrics.map((m) => m.mood || 0),
        stressTrend: metrics.map((m) => m.stressLevel || 0),
        activityTrend: dailyCompletionRates,
      };
    } catch (error) {
      console.error("Error calculating health trends:", error);
      return {
        period,
        weightTrend: [],
        bodyFatTrend: [],
        muscleMassTrend: [],
        sleepTrend: [],
        energyTrend: [],
        moodTrend: [],
        stressTrend: [],
        activityTrend: [],
      };
    }
  }

  /**
   * Generate health insights and recommendations
   */
  static async generateHealthInsights(userId: string): Promise<HealthInsights> {
    console.log("🧠 Generating health insights...");

    try {
      // Get recent health progress
      const healthProgress =
        await IntelligentHealthPlanningService.getUserHealthProgress(userId);

      // Get recent health metrics
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const recentMetrics = await this.getHealthMetrics(
        userId,
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0]
      );

      // Calculate overall health score
      const overallHealthScore = this.calculateOverallHealthScore(
        healthProgress,
        recentMetrics
      );

      // Analyze trends and generate insights
      const insights = this.analyzeHealthData(healthProgress, recentMetrics);

      return {
        overallHealthScore,
        improvementAreas: insights.improvementAreas,
        strengths: insights.strengths,
        recommendations: insights.recommendations,
        riskFactors: insights.riskFactors,
        achievements: insights.achievements,
        nextGoals: insights.nextGoals,
      };
    } catch (error) {
      console.error("Error generating health insights:", error);
      return {
        overallHealthScore: 0,
        improvementAreas: [],
        strengths: [],
        recommendations: [],
        riskFactors: [],
        achievements: [],
        nextGoals: [],
      };
    }
  }

  /**
   * Generate weekly health report
   */
  static async generateWeeklyReport(
    userId: string,
    weekStart: string
  ): Promise<WeeklyReport> {
    console.log(
      `📋 Generating weekly report for week starting ${weekStart}...`
    );

    try {
      const weekStartDate = new Date(weekStart);
      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekEndDate.getDate() + 6);

      const weekEnd = weekEndDate.toISOString().split("T")[0];

      // Get health metrics for the week
      const weekMetrics = await this.getHealthMetrics(
        userId,
        weekStart,
        weekEnd
      );

      // Get activity completions for the week
      const { data: activities } = await supabase
        .from("activity_completions")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", `${weekStart}T00:00:00`)
        .lte("created_at", `${weekEnd}T23:59:59`);

      const totalActivities = activities?.length || 0;
      const completedActivities =
        activities?.filter((a) => a.completed).length || 0;
      const completionRate =
        totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

      // Calculate changes from previous week
      const previousWeekStart = new Date(weekStartDate);
      previousWeekStart.setDate(previousWeekStart.getDate() - 7);
      const previousWeekEnd = new Date(previousWeekStart);
      previousWeekEnd.setDate(previousWeekEnd.getDate() + 6);

      const previousWeekMetrics = await this.getHealthMetrics(
        userId,
        previousWeekStart.toISOString().split("T")[0],
        previousWeekEnd.toISOString().split("T")[0]
      );

      const changes = this.calculateWeeklyChanges(
        weekMetrics,
        previousWeekMetrics
      );

      // Generate insights
      const insights = await this.generateHealthInsights(userId);

      // Get top performing and challenging days
      const dailyPerformance = this.calculateDailyPerformance(activities || []);
      const topPerformingDays = dailyPerformance
        .filter((d) => d.completionRate >= 80)
        .map((d) => d.date);
      const challengingDays = dailyPerformance
        .filter((d) => d.completionRate < 50)
        .map((d) => d.date);

      return {
        weekStart,
        weekEnd,
        totalActivities,
        completedActivities,
        completionRate,
        averageHealthScore: insights.overallHealthScore,
        weightChange: changes.weightChange,
        bodyFatChange: changes.bodyFatChange,
        muscleMassChange: changes.muscleMassChange,
        sleepImprovement: changes.sleepImprovement,
        energyImprovement: changes.energyImprovement,
        moodImprovement: changes.moodImprovement,
        stressReduction: changes.stressReduction,
        topPerformingDays,
        challengingDays,
        insights,
        recommendations: insights.recommendations,
      };
    } catch (error) {
      console.error("Error generating weekly report:", error);
      throw error;
    }
  }

  /**
   * Update health score based on metrics and activities
   */
  private static async updateHealthScore(
    userId: string,
    metrics: HealthMetrics
  ): Promise<void> {
    try {
      // Get current health score
      const { data: currentScore } = await supabase
        .from("health_scores")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      // Calculate new health score based on metrics
      const newScore = this.calculateHealthScoreFromMetrics(
        metrics,
        currentScore?.score || 0
      );

      // Update health score
      const { error } = await supabase.from("health_scores").upsert({
        user_id: userId,
        score: newScore,
        last_updated: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error updating health score:", error);
      }
    } catch (error) {
      console.error("Error updating health score:", error);
    }
  }

  /**
   * Calculate health score from metrics
   */
  private static calculateHealthScoreFromMetrics(
    metrics: HealthMetrics,
    currentScore: number
  ): number {
    let score = currentScore;
    let factors = 0;

    // Weight management (if tracking weight)
    if (metrics.weight) {
      // This would be more sophisticated in practice
      score += 5;
      factors++;
    }

    // Sleep quality
    if (metrics.sleepQuality && metrics.sleepQuality >= 7) {
      score += 10;
      factors++;
    } else if (metrics.sleepQuality && metrics.sleepQuality >= 5) {
      score += 5;
      factors++;
    }

    // Energy level
    if (metrics.energyLevel && metrics.energyLevel >= 7) {
      score += 10;
      factors++;
    } else if (metrics.energyLevel && metrics.energyLevel >= 5) {
      score += 5;
      factors++;
    }

    // Mood
    if (metrics.mood && metrics.mood >= 7) {
      score += 10;
      factors++;
    } else if (metrics.mood && metrics.mood >= 5) {
      score += 5;
      factors++;
    }

    // Stress level (inverse)
    if (metrics.stressLevel && metrics.stressLevel <= 3) {
      score += 10;
      factors++;
    } else if (metrics.stressLevel && metrics.stressLevel <= 5) {
      score += 5;
      factors++;
    }

    // Water intake
    if (metrics.waterIntake && metrics.waterIntake >= 2000) {
      score += 5;
      factors++;
    }

    // Steps
    if (metrics.steps && metrics.steps >= 10000) {
      score += 5;
      factors++;
    }

    // Average the score if we have factors
    if (factors > 0) {
      score = Math.min(100, Math.max(0, score));
    }

    return score;
  }

  /**
   * Calculate overall health score
   */
  private static calculateOverallHealthScore(
    healthProgress: HealthProgress,
    recentMetrics: HealthMetrics[]
  ): number {
    let score = healthProgress.healthScore;

    // Adjust based on recent metrics
    if (recentMetrics.length > 0) {
      const avgSleepQuality =
        recentMetrics
          .filter((m) => m.sleepQuality)
          .reduce((sum, m) => sum + (m.sleepQuality || 0), 0) /
        recentMetrics.length;

      const avgEnergyLevel =
        recentMetrics
          .filter((m) => m.energyLevel)
          .reduce((sum, m) => sum + (m.energyLevel || 0), 0) /
        recentMetrics.length;

      const avgMood =
        recentMetrics
          .filter((m) => m.mood)
          .reduce((sum, m) => sum + (m.mood || 0), 0) / recentMetrics.length;

      // Bonus for good metrics
      if (avgSleepQuality >= 7) score += 5;
      if (avgEnergyLevel >= 7) score += 5;
      if (avgMood >= 7) score += 5;
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Analyze health data and generate insights
   */
  private static analyzeHealthData(
    healthProgress: HealthProgress,
    recentMetrics: HealthMetrics[]
  ): {
    improvementAreas: string[];
    strengths: string[];
    recommendations: string[];
    riskFactors: string[];
    achievements: string[];
    nextGoals: string[];
  } {
    const insights = {
      improvementAreas: [] as string[],
      strengths: [] as string[],
      recommendations: [] as string[],
      riskFactors: [] as string[],
      achievements: [] as string[],
      nextGoals: [] as string[],
    };

    // Analyze completion rate
    if (healthProgress.averageCompletion < 50) {
      insights.improvementAreas.push("Activity completion rate");
      insights.recommendations.push(
        "Focus on completing at least 70% of daily activities"
      );
    } else if (healthProgress.averageCompletion >= 80) {
      insights.strengths.push("High activity completion rate");
      insights.achievements.push("Consistent daily activity completion");
    }

    // Analyze streak
    if (healthProgress.currentStreak >= 7) {
      insights.strengths.push("Strong consistency streak");
      insights.achievements.push(`${healthProgress.currentStreak} day streak`);
    } else if (healthProgress.currentStreak < 3) {
      insights.improvementAreas.push("Consistency");
      insights.recommendations.push(
        "Build a daily routine to improve consistency"
      );
    }

    // Analyze recent metrics
    if (recentMetrics.length > 0) {
      const avgSleepQuality =
        recentMetrics
          .filter((m) => m.sleepQuality)
          .reduce((sum, m) => sum + (m.sleepQuality || 0), 0) /
        recentMetrics.length;

      if (avgSleepQuality < 5) {
        insights.improvementAreas.push("Sleep quality");
        insights.recommendations.push(
          "Improve sleep hygiene and aim for 7-9 hours of quality sleep"
        );
      } else if (avgSleepQuality >= 8) {
        insights.strengths.push("Excellent sleep quality");
      }

      const avgEnergyLevel =
        recentMetrics
          .filter((m) => m.energyLevel)
          .reduce((sum, m) => sum + (m.energyLevel || 0), 0) /
        recentMetrics.length;

      if (avgEnergyLevel < 5) {
        insights.improvementAreas.push("Energy levels");
        insights.recommendations.push(
          "Focus on nutrition and regular exercise to boost energy"
        );
      } else if (avgEnergyLevel >= 8) {
        insights.strengths.push("High energy levels");
      }
    }

    // Generate next goals
    if (healthProgress.averageCompletion >= 80) {
      insights.nextGoals.push("Increase workout intensity");
      insights.nextGoals.push("Add advanced nutrition tracking");
    } else {
      insights.nextGoals.push("Improve daily consistency");
      insights.nextGoals.push("Build sustainable habits");
    }

    return insights;
  }

  /**
   * Calculate daily completion rates
   */
  private static calculateDailyCompletionRates(activities: any[]): number[] {
    const dailyRates: { [date: string]: { total: number; completed: number } } =
      {};

    activities.forEach((activity) => {
      const date = activity.created_at.split("T")[0];
      if (!dailyRates[date]) {
        dailyRates[date] = { total: 0, completed: 0 };
      }
      dailyRates[date].total++;
      if (activity.completed) {
        dailyRates[date].completed++;
      }
    });

    return Object.values(dailyRates).map((day) =>
      day.total > 0 ? (day.completed / day.total) * 100 : 0
    );
  }

  /**
   * Calculate weekly changes
   */
  private static calculateWeeklyChanges(
    currentWeek: HealthMetrics[],
    previousWeek: HealthMetrics[]
  ): {
    weightChange: number;
    bodyFatChange: number;
    muscleMassChange: number;
    sleepImprovement: number;
    energyImprovement: number;
    moodImprovement: number;
    stressReduction: number;
  } {
    const getAverage = (
      metrics: HealthMetrics[],
      field: keyof HealthMetrics
    ): number => {
      const values = metrics
        .filter((m) => m[field])
        .map((m) => m[field] as number);
      return values.length > 0
        ? values.reduce((sum, val) => sum + val, 0) / values.length
        : 0;
    };

    const currentWeight = getAverage(currentWeek, "weight");
    const previousWeight = getAverage(previousWeek, "weight");
    const currentBodyFat = getAverage(currentWeek, "bodyFat");
    const previousBodyFat = getAverage(previousWeek, "bodyFat");
    const currentMuscleMass = getAverage(currentWeek, "muscleMass");
    const previousMuscleMass = getAverage(previousWeek, "muscleMass");
    const currentSleep = getAverage(currentWeek, "sleepHours");
    const previousSleep = getAverage(previousWeek, "sleepHours");
    const currentEnergy = getAverage(currentWeek, "energyLevel");
    const previousEnergy = getAverage(previousWeek, "energyLevel");
    const currentMood = getAverage(currentWeek, "mood");
    const previousMood = getAverage(previousWeek, "mood");
    const currentStress = getAverage(currentWeek, "stressLevel");
    const previousStress = getAverage(previousWeek, "stressLevel");

    return {
      weightChange: currentWeight - previousWeight,
      bodyFatChange: currentBodyFat - previousBodyFat,
      muscleMassChange: currentMuscleMass - previousMuscleMass,
      sleepImprovement: currentSleep - previousSleep,
      energyImprovement: currentEnergy - previousEnergy,
      moodImprovement: currentMood - previousMood,
      stressReduction: previousStress - currentStress, // Higher reduction is better
    };
  }

  /**
   * Calculate daily performance
   */
  private static calculateDailyPerformance(
    activities: any[]
  ): Array<{ date: string; completionRate: number }> {
    const dailyPerformance: {
      [date: string]: { total: number; completed: number };
    } = {};

    activities.forEach((activity) => {
      const date = activity.created_at.split("T")[0];
      if (!dailyPerformance[date]) {
        dailyPerformance[date] = { total: 0, completed: 0 };
      }
      dailyPerformance[date].total++;
      if (activity.completed) {
        dailyPerformance[date].completed++;
      }
    });

    return Object.entries(dailyPerformance).map(([date, data]) => ({
      date,
      completionRate: data.total > 0 ? (data.completed / data.total) * 100 : 0,
    }));
  }
}

// ============================================================================
// EXPORT UTILITY FUNCTIONS
// ============================================================================

export const healthTrackingService = {
  recordHealthMetrics: HealthTrackingService.recordHealthMetrics,
  getHealthMetrics: HealthTrackingService.getHealthMetrics,
  getHealthTrends: HealthTrackingService.getHealthTrends,
  generateHealthInsights: HealthTrackingService.generateHealthInsights,
  generateWeeklyReport: HealthTrackingService.generateWeeklyReport,
};

export default HealthTrackingService;
