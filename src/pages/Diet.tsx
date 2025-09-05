import { MobileNavigation } from "@/components/MobileNavigation";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import {
  DailyNutrition,
  FoodEntry,
  nutritionTrackingService,
} from "@/services/nutritionTrackingService";
import { Plus, Search, Target, TrendingUp, Utensils } from "lucide-react";
import React, { useEffect, useState } from "react";

const Diet: React.FC = () => {
  const { user } = useAuth();
  const [dailyNutrition, setDailyNutrition] = useState<DailyNutrition | null>(
    null
  );
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<
    "breakfast" | "lunch" | "dinner" | "snack"
  >("breakfast");

  useEffect(() => {
    if (user) {
      loadNutritionData();
    }
  }, [user]);

  const loadNutritionData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];

      // Load daily nutrition summary
      const nutrition = await nutritionTrackingService.getDailyNutrition(
        user.id,
        today
      );
      setDailyNutrition(nutrition);

      // Load food entries for today
      const entries = await nutritionTrackingService.getFoodEntries(
        user.id,
        today
      );
      setFoodEntries(entries);
    } catch (error) {
      console.error("Error loading nutrition data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = () => {
    // TODO: Implement food addition functionality
    console.log("Add food clicked");
  };

  const handleSearchFood = () => {
    // TODO: Implement food search functionality
    console.log("Search food:", searchQuery);
  };

  if (loading) {
    return (
      <ThemeWrapper>
        <MobileNavigation>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading nutrition data...</p>
            </div>
          </div>
        </MobileNavigation>
      </ThemeWrapper>
    );
  }

  return (
    <ThemeWrapper>
      <MobileNavigation>
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Nutrition Tracker
            </h1>
            <p className="text-gray-600">
              Track your daily meals and nutrition goals
            </p>
          </div>

          {/* Daily Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Calories</p>
                    <p className="text-2xl font-bold text-green-600">
                      {dailyNutrition?.totalCalories || 0}
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Protein</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {dailyNutrition?.protein || 0}g
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Macros Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="w-5 h-5" />
                Daily Macros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Carbs</p>
                  <p className="text-lg font-semibold text-yellow-600">
                    {dailyNutrition?.carbs || 0}g
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Protein</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {dailyNutrition?.protein || 0}g
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Fat</p>
                  <p className="text-lg font-semibold text-purple-600">
                    {dailyNutrition?.fat || 0}g
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Food Section */}
          <Card>
            <CardHeader>
              <CardTitle>Add Food</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Search for food..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button onClick={handleSearchFood} variant="outline">
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="meal-type">Meal Type</Label>
                  <Select
                    value={selectedMeal}
                    onValueChange={(value: any) => setSelectedMeal(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleAddFood}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Food
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Food Entries */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Meals</CardTitle>
            </CardHeader>
            <CardContent>
              {foodEntries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Utensils className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No food entries yet today</p>
                  <p className="text-sm">Start by adding your first meal!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {foodEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{entry.foodName}</p>
                        <p className="text-sm text-gray-600">
                          {entry.quantity} {entry.unit} • {entry.mealType}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          {entry.totalCalories} cal
                        </p>
                        <p className="text-sm text-gray-600">
                          P: {entry.totalProtein}g • C: {entry.totalCarbs}g • F:{" "}
                          {entry.totalFat}g
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </MobileNavigation>
    </ThemeWrapper>
  );
};

export default Diet;
