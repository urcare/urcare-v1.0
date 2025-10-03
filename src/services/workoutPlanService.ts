import { supabase } from "@/integrations/supabase/client";

export interface Exercise {
  id: string;
  name: string;
  description: string;
  instructions: string[];
  sets: number;
  reps: string;
  duration?: string;
  restTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  equipment: string[];
  muscleGroups: string[];
  muscleImpact: {
    primary: string[];
    secondary: string[];
    intensity: { [muscle: string]: number }; // 1-10 scale
  };
  image: string;
  videoUrl?: string;
  tips: string[];
  variations?: string[];
  category: "strength" | "cardio" | "flexibility" | "balance" | "sports";
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  frequency: string;
  goals: string[];
  exercises: Exercise[];
  totalDuration: number;
  caloriesBurned: number;
  createdAt: string;
  isCustom: boolean;
  aiGenerated: boolean;
  userPreferences?: {
    availableEquipment: string[];
    timePerSession: number;
    daysPerWeek: number;
    fitnessLevel: string;
    goals: string[];
    injuries?: string[];
    preferences?: string[];
  };
}

export interface UserFitnessProfile {
  id: string;
  userId: string;
  age: number;
  weight: number;
  height: number;
  gender: "male" | "female" | "other";
  fitnessLevel: "Beginner" | "Intermediate" | "Advanced";
  goals: string[];
  availableEquipment: string[];
  timePerSession: number;
  daysPerWeek: number;
  injuries?: string[];
  preferences?: string[];
  createdAt: string;
  updatedAt: string;
}

class WorkoutPlanService {
  private exerciseDatabase: Exercise[] = [];

  constructor() {
    this.initializeExerciseDatabase();
  }

  private initializeExerciseDatabase() {
    this.exerciseDatabase = [
      // Upper Body Exercises
      {
        id: "pushup",
        name: "Push-ups",
        description:
          "Classic bodyweight exercise for chest, shoulders, and triceps",
        instructions: [
          "Start in a plank position with hands slightly wider than shoulders",
          "Lower your body until chest nearly touches the floor",
          "Push back up to starting position",
          "Keep core tight throughout the movement",
        ],
        sets: 3,
        reps: "8-12",
        restTime: "60 seconds",
        difficulty: "Beginner",
        equipment: ["Bodyweight"],
        muscleGroups: ["Chest", "Shoulders", "Triceps"],
        muscleImpact: {
          primary: ["Chest", "Triceps"],
          secondary: ["Shoulders", "Core"],
          intensity: { Chest: 9, Triceps: 8, Shoulders: 6, Core: 5 },
        },
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        tips: [
          "Keep your body in a straight line",
          "Don't let your hips sag or pike up",
          "Breathe out as you push up",
        ],
        category: "strength",
      },
      {
        id: "pullup",
        name: "Pull-ups",
        description: "Upper body pulling exercise targeting back and biceps",
        instructions: [
          "Hang from a pull-up bar with hands shoulder-width apart",
          "Pull your body up until chin clears the bar",
          "Lower with control to starting position",
          "Engage your core throughout",
        ],
        sets: 3,
        reps: "5-10",
        restTime: "90 seconds",
        difficulty: "Intermediate",
        equipment: ["Pull-up Bar"],
        muscleGroups: ["Back", "Biceps"],
        muscleImpact: {
          primary: ["Back", "Biceps"],
          secondary: ["Shoulders", "Core"],
          intensity: { Back: 9, Biceps: 8, Shoulders: 6, Core: 4 },
        },
        image:
          "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=300&fit=crop",
        tips: [
          "Start with assisted pull-ups if needed",
          "Focus on pulling with your back, not just arms",
          "Keep your chest up",
        ],
        category: "strength",
      },
      // Lower Body Exercises
      {
        id: "squat",
        name: "Squats",
        description:
          "Fundamental lower body exercise targeting legs and glutes",
        instructions: [
          "Stand with feet shoulder-width apart",
          "Lower your body as if sitting back into a chair",
          "Keep knees behind toes and chest up",
          "Return to starting position",
        ],
        sets: 3,
        reps: "12-15",
        restTime: "90 seconds",
        difficulty: "Beginner",
        equipment: ["Bodyweight"],
        muscleGroups: ["Legs", "Glutes"],
        muscleImpact: {
          primary: ["Legs", "Glutes"],
          secondary: ["Core"],
          intensity: { Legs: 9, Glutes: 8, Core: 4 },
        },
        image:
          "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=300&fit=crop",
        tips: [
          "Keep weight on your heels",
          "Don't let knees cave inward",
          "Go as low as comfortable",
        ],
        category: "strength",
      },
      {
        id: "lunge",
        name: "Lunges",
        description: "Single-leg exercise for legs and glutes",
        instructions: [
          "Step forward with one leg, lowering hips",
          "Keep front knee over ankle",
          "Push back to starting position",
          "Alternate legs",
        ],
        sets: 3,
        reps: "10-12 each leg",
        restTime: "60 seconds",
        difficulty: "Beginner",
        equipment: ["Bodyweight"],
        muscleGroups: ["Legs", "Glutes"],
        muscleImpact: {
          primary: ["Legs", "Glutes"],
          secondary: ["Core"],
          intensity: { Legs: 8, Glutes: 7, Core: 3 },
        },
        image:
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
        tips: [
          "Keep your torso upright",
          "Don't let front knee go past toes",
          "Control the movement",
        ],
        category: "strength",
      },
      // Core Exercises
      {
        id: "plank",
        name: "Plank",
        description: "Isometric core strengthening exercise",
        instructions: [
          "Start in a push-up position",
          "Lower to forearms, keeping body straight",
          "Hold position while engaging core",
          "Breathe normally throughout",
        ],
        sets: 3,
        reps: "30-60 seconds",
        restTime: "60 seconds",
        difficulty: "Beginner",
        equipment: ["Bodyweight"],
        muscleGroups: ["Core", "Shoulders"],
        muscleImpact: {
          primary: ["Core"],
          secondary: ["Shoulders", "Back"],
          intensity: { Core: 9, Shoulders: 6, Back: 4 },
        },
        image:
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
        tips: [
          "Keep hips level with shoulders",
          "Engage your core muscles",
          "Don't hold your breath",
        ],
        category: "strength",
      },
      {
        id: "mountain_climbers",
        name: "Mountain Climbers",
        description: "Dynamic cardio and core exercise",
        instructions: [
          "Start in plank position",
          "Bring one knee toward chest",
          "Quickly switch legs",
          "Maintain plank position",
        ],
        sets: 3,
        reps: "20-30 seconds",
        restTime: "60 seconds",
        difficulty: "Intermediate",
        equipment: ["Bodyweight"],
        muscleGroups: ["Core", "Legs", "Shoulders"],
        muscleImpact: {
          primary: ["Core", "Legs"],
          secondary: ["Shoulders", "Cardio"],
          intensity: { Core: 8, Legs: 7, Shoulders: 5, Cardio: 8 },
        },
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        tips: [
          "Keep core tight",
          "Maintain steady rhythm",
          "Don't let hips rise",
        ],
        category: "cardio",
      },
    ];
  }

  /**
   * Generate AI-powered custom workout plan based on user profile
   */
  async generateCustomWorkoutPlan(
    userId: string,
    userProfile: UserFitnessProfile
  ): Promise<WorkoutPlan | null> {
    try {
      // Simulate AI processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // AI Logic for plan generation
      const plan = this.createAIGeneratedPlan(userId, userProfile);

      // Save to database
      const savedPlan = await this.saveWorkoutPlan(plan);

      return savedPlan;
    } catch (error) {
      console.error("Error generating custom workout plan:", error);
      return null;
    }
  }

  private createAIGeneratedPlan(
    userId: string,
    profile: UserFitnessProfile
  ): WorkoutPlan {
    const exercises = this.selectExercisesForPlan(profile);
    const totalDuration = this.calculateTotalDuration(exercises);
    const caloriesBurned = this.estimateCaloriesBurned(profile, totalDuration);

    return {
      id: `plan_${Date.now()}`,
      userId,
      name: `AI Custom ${profile.goals[0] || "Fitness"} Plan`,
      description: `Personalized workout plan designed for ${profile.fitnessLevel.toLowerCase()} level focusing on ${profile.goals.join(
        ", "
      )}`,
      duration: `${totalDuration} minutes`,
      difficulty: profile.fitnessLevel,
      frequency: `${profile.daysPerWeek}x per week`,
      goals: profile.goals,
      exercises,
      totalDuration,
      caloriesBurned,
      createdAt: new Date().toISOString(),
      isCustom: true,
      aiGenerated: true,
      userPreferences: {
        availableEquipment: profile.availableEquipment,
        timePerSession: profile.timePerSession,
        daysPerWeek: profile.daysPerWeek,
        fitnessLevel: profile.fitnessLevel,
        goals: profile.goals,
        injuries: profile.injuries,
        preferences: profile.preferences,
      },
    };
  }

  private selectExercisesForPlan(profile: UserFitnessProfile): Exercise[] {
    let availableExercises = this.exerciseDatabase.filter((exercise) => {
      // Filter by available equipment
      const hasEquipment = exercise.equipment.every(
        (eq) => eq === "Bodyweight" || profile.availableEquipment.includes(eq)
      );

      // Filter by difficulty
      const matchesDifficulty = this.exerciseMatchesDifficulty(
        exercise,
        profile.fitnessLevel
      );

      // Filter by injuries (avoid exercises that might aggravate injuries)
      const safeForInjuries = this.exerciseIsSafeForInjuries(
        exercise,
        profile.injuries || []
      );

      return hasEquipment && matchesDifficulty && safeForInjuries;
    });

    // Prioritize exercises based on goals
    availableExercises = this.prioritizeExercisesByGoals(
      availableExercises,
      profile.goals
    );

    // Select appropriate number of exercises based on time
    const maxExercises = Math.floor(profile.timePerSession / 5); // ~5 minutes per exercise
    const selectedExercises = availableExercises.slice(
      0,
      Math.min(maxExercises, 8)
    );

    return selectedExercises;
  }

  private exerciseMatchesDifficulty(
    exercise: Exercise,
    userLevel: string
  ): boolean {
    const difficultyLevels = { Beginner: 1, Intermediate: 2, Advanced: 3 };
    const exerciseLevel = difficultyLevels[exercise.difficulty];
    const userLevelNum =
      difficultyLevels[userLevel as keyof typeof difficultyLevels];

    // Allow exercises at user level or one level below
    return exerciseLevel <= userLevelNum;
  }

  private exerciseIsSafeForInjuries(
    exercise: Exercise,
    injuries: string[]
  ): boolean {
    if (!injuries || injuries.length === 0) return true;

    // Simple injury avoidance logic
    const injuryAvoidance: { [key: string]: string[] } = {
      knee: ["squat", "lunge", "mountain_climbers"],
      shoulder: ["pushup", "pullup"],
      back: ["deadlift", "bent_over_row"],
      wrist: ["pushup", "plank"],
    };

    for (const injury of injuries) {
      const avoidExercises = injuryAvoidance[injury.toLowerCase()] || [];
      if (avoidExercises.some((ex) => exercise.id.includes(ex))) {
        return false;
      }
    }

    return true;
  }

  private prioritizeExercisesByGoals(
    exercises: Exercise[],
    goals: string[]
  ): Exercise[] {
    const goalPriorities: { [key: string]: string[] } = {
      "Build Muscle": ["strength"],
      "Lose Weight": ["cardio", "strength"],
      "Improve Endurance": ["cardio"],
      "Increase Strength": ["strength"],
      "Improve Flexibility": ["flexibility"],
      "General Fitness": ["strength", "cardio"],
    };

    return exercises.sort((a, b) => {
      let aScore = 0;
      let bScore = 0;

      for (const goal of goals) {
        const categories = goalPriorities[goal] || [];
        if (categories.includes(a.category)) aScore += 2;
        if (categories.includes(b.category)) bScore += 2;
      }

      return bScore - aScore;
    });
  }

  private calculateTotalDuration(exercises: Exercise[]): number {
    return exercises.reduce((total, exercise) => {
      const exerciseTime = exercise.sets * 2; // ~2 minutes per set including rest
      return total + exerciseTime;
    }, 0);
  }

  private estimateCaloriesBurned(
    profile: UserFitnessProfile,
    duration: number
  ): number {
    // Simple calorie estimation based on weight, gender, and duration
    const baseCalories = profile.gender === "male" ? 1.2 : 1.0;
    const weightFactor = profile.weight / 70; // Normalize to 70kg
    return Math.round(duration * baseCalories * weightFactor * 8); // ~8 calories per minute
  }

  /**
   * Save workout plan to database
   */
  async saveWorkoutPlan(plan: WorkoutPlan): Promise<WorkoutPlan> {
    try {
      const { data, error } = await supabase
        .from("workout_plans")
        .insert([
          {
            user_id: plan.userId,
            name: plan.name,
            description: plan.description,
            duration: plan.duration,
            difficulty: plan.difficulty,
            frequency: plan.frequency,
            goals: plan.goals,
            exercises: plan.exercises,
            total_duration: plan.totalDuration,
            calories_burned: plan.caloriesBurned,
            is_custom: plan.isCustom,
            ai_generated: plan.aiGenerated,
            user_preferences: plan.userPreferences,
            created_at: plan.createdAt,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return {
        ...plan,
        id: data.id,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error("Error saving workout plan:", error);
      throw error;
    }
  }

  /**
   * Get user's workout plans
   */
  async getUserWorkoutPlans(userId: string): Promise<WorkoutPlan[]> {
    try {
      const { data, error } = await supabase
        .from("workout_plans")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data?.map(this.mapWorkoutPlanFromDb) || [];
    } catch (error) {
      console.error("Error getting user workout plans:", error);
      return [];
    }
  }

  /**
   * Get exercise by ID
   */
  getExerciseById(id: string): Exercise | undefined {
    return this.exerciseDatabase.find((exercise) => exercise.id === id);
  }

  /**
   * Search exercises by muscle group
   */
  getExercisesByMuscleGroup(muscleGroup: string): Exercise[] {
    return this.exerciseDatabase.filter((exercise) =>
      exercise.muscleGroups.some((muscle) =>
        muscle.toLowerCase().includes(muscleGroup.toLowerCase())
      )
    );
  }

  /**
   * Get all available exercises
   */
  getAllExercises(): Exercise[] {
    return this.exerciseDatabase;
  }

  private mapWorkoutPlanFromDb(data: any): WorkoutPlan {
    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      description: data.description,
      duration: data.duration,
      difficulty: data.difficulty,
      frequency: data.frequency,
      goals: data.goals,
      exercises: data.exercises,
      totalDuration: data.total_duration,
      caloriesBurned: data.calories_burned,
      createdAt: data.created_at,
      isCustom: data.is_custom,
      aiGenerated: data.ai_generated,
      userPreferences: data.user_preferences,
    };
  }
}

export const workoutPlanService = new WorkoutPlanService();

