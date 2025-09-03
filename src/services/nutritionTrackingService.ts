import { supabase } from "@/integrations/supabase/client";

export interface FoodEntry {
  id?: string;
  userId: string;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  foodName: string;
  brand?: string;
  quantity: number;
  unit: string;
  caloriesPerUnit: number;
  proteinPerUnit: number;
  carbsPerUnit: number;
  fatPerUnit: number;
  fiberPerUnit?: number;
  sugarPerUnit?: number;
  sodiumPerUnit?: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  barcode?: string;
}

export interface DailyNutrition {
  id?: string;
  userId: string;
  date: string;
  totalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  mealBreakdown?: {
    breakfast: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
    lunch: { calories: number; protein: number; carbs: number; fat: number };
    dinner: { calories: number; protein: number; carbs: number; fat: number };
    snacks: { calories: number; protein: number; carbs: number; fat: number };
  };
}

export interface NutritionGoals {
  id?: string;
  userId: string;
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  sugarGrams: number;
  sodiumMg: number;
}

export interface FoodDatabaseItem {
  id?: string;
  name: string;
  brand?: string;
  category?: string;
  servingSize: number;
  servingUnit: string;
  caloriesPerServing: number;
  proteinPerServing: number;
  carbsPerServing: number;
  fatPerServing: number;
  fiberPerServing?: number;
  sugarPerServing?: number;
  sodiumPerServing?: number;
  barcode?: string;
  verified: boolean;
}

class NutritionTrackingService {
  /**
   * Add a food entry for a specific meal
   */
  async addFoodEntry(
    entry: Omit<
      FoodEntry,
      "id" | "totalCalories" | "totalProtein" | "totalCarbs" | "totalFat"
    >
  ): Promise<FoodEntry | null> {
    try {
      const { data, error } = await supabase
        .from("food_entries")
        .insert([
          {
            user_id: entry.userId,
            date: entry.date,
            meal_type: entry.mealType,
            food_name: entry.foodName,
            brand: entry.brand,
            quantity: entry.quantity,
            unit: entry.unit,
            calories_per_unit: entry.caloriesPerUnit,
            protein_per_unit: entry.proteinPerUnit,
            carbs_per_unit: entry.carbsPerUnit,
            fat_per_unit: entry.fatPerUnit,
            fiber_per_unit: entry.fiberPerUnit || 0,
            sugar_per_unit: entry.sugarPerUnit || 0,
            sodium_per_unit: entry.sodiumPerUnit || 0,
            barcode: entry.barcode,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return this.mapFoodEntryFromDb(data);
    } catch (error) {
      console.error("Error adding food entry:", error);
      return null;
    }
  }

  /**
   * Get daily nutrition summary for a user
   */
  async getDailyNutrition(
    userId: string,
    date: string
  ): Promise<DailyNutrition | null> {
    try {
      const { data, error } = await supabase
        .from("daily_nutrition")
        .select("*")
        .eq("user_id", userId)
        .eq("date", date)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (!data) {
        // Return empty nutrition data if no entries exist
        return {
          userId,
          date,
          totalCalories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          sugar: 0,
          sodium: 0,
        };
      }

      return this.mapDailyNutritionFromDb(data);
    } catch (error) {
      console.error("Error getting daily nutrition:", error);
      return null;
    }
  }

  /**
   * Get food entries for a specific day and meal
   */
  async getFoodEntries(
    userId: string,
    date: string,
    mealType?: string
  ): Promise<FoodEntry[]> {
    try {
      let query = supabase
        .from("food_entries")
        .select("*")
        .eq("user_id", userId)
        .eq("date", date)
        .order("created_at", { ascending: false });

      if (mealType) {
        query = query.eq("meal_type", mealType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data?.map(this.mapFoodEntryFromDb) || [];
    } catch (error) {
      console.error("Error getting food entries:", error);
      return [];
    }
  }

  /**
   * Update a food entry
   */
  async updateFoodEntry(
    id: string,
    updates: Partial<FoodEntry>
  ): Promise<FoodEntry | null> {
    try {
      const { data, error } = await supabase
        .from("food_entries")
        .update({
          quantity: updates.quantity,
          calories_per_unit: updates.caloriesPerUnit,
          protein_per_unit: updates.proteinPerUnit,
          carbs_per_unit: updates.carbsPerUnit,
          fat_per_unit: updates.fatPerUnit,
          fiber_per_unit: updates.fiberPerUnit,
          sugar_per_unit: updates.sugarPerUnit,
          sodium_per_unit: updates.sodiumPerUnit,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return this.mapFoodEntryFromDb(data);
    } catch (error) {
      console.error("Error updating food entry:", error);
      return null;
    }
  }

  /**
   * Delete a food entry
   */
  async deleteFoodEntry(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("food_entries")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting food entry:", error);
      return false;
    }
  }

  /**
   * Search food database
   */
  async searchFoodDatabase(
    query: string,
    limit: number = 20
  ): Promise<FoodDatabaseItem[]> {
    try {
      const { data, error } = await supabase
        .from("food_database")
        .select("*")
        .ilike("name", `%${query}%`)
        .order("verified", { ascending: false })
        .order("name")
        .limit(limit);

      if (error) throw error;
      return data?.map(this.mapFoodDatabaseItemFromDb) || [];
    } catch (error) {
      console.error("Error searching food database:", error);
      return [];
    }
  }

  /**
   * Get or create nutrition goals for a user
   */
  async getNutritionGoals(userId: string): Promise<NutritionGoals | null> {
    try {
      const { data, error } = await supabase
        .from("nutrition_goals")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (!data) {
        // Create default goals if none exist
        return await this.createDefaultNutritionGoals(userId);
      }

      return this.mapNutritionGoalsFromDb(data);
    } catch (error) {
      console.error("Error getting nutrition goals:", error);
      return null;
    }
  }

  /**
   * Update nutrition goals
   */
  async updateNutritionGoals(
    goals: NutritionGoals
  ): Promise<NutritionGoals | null> {
    try {
      const { data, error } = await supabase
        .from("nutrition_goals")
        .upsert({
          user_id: goals.userId,
          daily_calories: goals.dailyCalories,
          protein_grams: goals.proteinGrams,
          carbs_grams: goals.carbsGrams,
          fat_grams: goals.fatGrams,
          fiber_grams: goals.fiberGrams,
          sugar_grams: goals.sugarGrams,
          sodium_mg: goals.sodiumMg,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return this.mapNutritionGoalsFromDb(data);
    } catch (error) {
      console.error("Error updating nutrition goals:", error);
      return null;
    }
  }

  /**
   * Get nutrition summary for a date range
   */
  async getNutritionSummary(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<DailyNutrition[]> {
    try {
      const { data, error } = await supabase
        .from("daily_nutrition")
        .select("*")
        .eq("user_id", userId)
        .gte("date", startDate)
        .lte("date", endDate)
        .order("date", { ascending: false });

      if (error) throw error;
      return data?.map(this.mapDailyNutritionFromDb) || [];
    } catch (error) {
      console.error("Error getting nutrition summary:", error);
      return [];
    }
  }

  /**
   * Create default nutrition goals based on user profile
   */
  private async createDefaultNutritionGoals(
    userId: string
  ): Promise<NutritionGoals | null> {
    try {
      // Get user profile to calculate goals
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("weight_kg, height_cm, age, gender")
        .eq("id", userId)
        .single();

      let dailyCalories = 2000; // Default
      let proteinGrams = 150;
      let carbsGrams = 250;
      let fatGrams = 67;

      if (profile && profile.weight_kg && profile.height_cm && profile.age) {
        // Calculate BMR using Mifflin-St Jeor Equation
        let bmr: number;
        if (profile.gender === "male") {
          bmr =
            10 * parseFloat(profile.weight_kg) +
            6.25 * parseFloat(profile.height_cm) -
            5 * profile.age +
            5;
        } else {
          bmr =
            10 * parseFloat(profile.weight_kg) +
            6.25 * parseFloat(profile.height_cm) -
            5 * profile.age -
            161;
        }

        // Apply activity multiplier (assuming lightly active)
        dailyCalories = Math.round(bmr * 1.375);

        // Calculate macros
        proteinGrams = Math.round(parseFloat(profile.weight_kg) * 1.6);
        fatGrams = Math.round((dailyCalories * 0.25) / 9);
        carbsGrams = Math.round(
          (dailyCalories - proteinGrams * 4 - fatGrams * 9) / 4
        );
      }

      const goals: NutritionGoals = {
        userId,
        dailyCalories,
        proteinGrams,
        carbsGrams,
        fatGrams,
        fiberGrams: 25,
        sugarGrams: 50,
        sodiumMg: 2300,
      };

      return await this.updateNutritionGoals(goals);
    } catch (error) {
      console.error("Error creating default nutrition goals:", error);
      return null;
    }
  }

  // Mapping functions
  private mapFoodEntryFromDb(data: any): FoodEntry {
    return {
      id: data.id,
      userId: data.user_id,
      date: data.date,
      mealType: data.meal_type,
      foodName: data.food_name,
      brand: data.brand,
      quantity: data.quantity,
      unit: data.unit,
      caloriesPerUnit: data.calories_per_unit,
      proteinPerUnit: data.protein_per_unit,
      carbsPerUnit: data.carbs_per_unit,
      fatPerUnit: data.fat_per_unit,
      fiberPerUnit: data.fiber_per_unit,
      sugarPerUnit: data.sugar_per_unit,
      sodiumPerUnit: data.sodium_per_unit,
      totalCalories: data.total_calories,
      totalProtein: data.total_protein,
      totalCarbs: data.total_carbs,
      totalFat: data.total_fat,
      barcode: data.barcode,
    };
  }

  private mapDailyNutritionFromDb(data: any): DailyNutrition {
    return {
      id: data.id,
      userId: data.user_id,
      date: data.date,
      totalCalories: data.total_calories,
      protein: data.protein,
      carbs: data.carbs,
      fat: data.fat,
      fiber: data.fiber,
      sugar: data.sugar,
      sodium: data.sodium,
      mealBreakdown: data.meal_breakdown,
    };
  }

  private mapNutritionGoalsFromDb(data: any): NutritionGoals {
    return {
      id: data.id,
      userId: data.user_id,
      dailyCalories: data.daily_calories,
      proteinGrams: data.protein_grams,
      carbsGrams: data.carbs_grams,
      fatGrams: data.fat_grams,
      fiberGrams: data.fiber_grams,
      sugarGrams: data.sugar_grams,
      sodiumMg: data.sodium_mg,
    };
  }

  private mapFoodDatabaseItemFromDb(data: any): FoodDatabaseItem {
    return {
      id: data.id,
      name: data.name,
      brand: data.brand,
      category: data.category,
      servingSize: data.serving_size,
      servingUnit: data.serving_unit,
      caloriesPerServing: data.calories_per_serving,
      proteinPerServing: data.protein_per_serving,
      carbsPerServing: data.carbs_per_serving,
      fatPerServing: data.fat_per_serving,
      fiberPerServing: data.fiber_per_serving,
      sugarPerServing: data.sugar_per_serving,
      sodiumPerServing: data.sodium_per_serving,
      barcode: data.barcode,
      verified: data.verified,
    };
  }
}

export const nutritionTrackingService = new NutritionTrackingService();
