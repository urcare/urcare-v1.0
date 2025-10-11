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
import {
  Clock,
  Flame,
  Heart,
  Leaf,
  Plus,
  Search,
  Utensils,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";

const Diet: React.FC = () => {
  const { user } = useAuth();
  const [dailyNutrition, setDailyNutrition] = useState<DailyNutrition | null>(
    null
  );
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<
    "breakfast" | "lunch" | "dinner" | "snack"
  >("breakfast");
  const [selectedDietCategory, setSelectedDietCategory] = useState("balanced");

  // Sample diet categories
  const dietCategories = [
    { id: "balanced", name: "Balanced", icon: Leaf },
    { id: "keto", name: "Keto", icon: Zap },
    { id: "vegan", name: "Vegan", icon: Heart },
    { id: "paleo", name: "Paleo", icon: Flame },
    { id: "mediterranean", name: "Mediterranean", icon: Utensils },
  ];

  // Sample meal plans with images
  const sampleMeals = [
    {
      id: 1,
      name: "Paleo Power Bowl",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
      calories: 450,
      carbs: 35,
      protein: 28,
      fat: 22,
      duration: "21 days",
      description: "Fresh vegetables with lean protein",
    },
    {
      id: 2,
      name: "Mediterranean Delight",
      image:
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
      calories: 380,
      carbs: 42,
      protein: 24,
      fat: 18,
      duration: "14 days",
      description: "Olive oil, fish, and fresh herbs",
    },
    {
      id: 3,
      name: "Vegan Buddha Bowl",
      image:
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop",
      calories: 420,
      carbs: 48,
      protein: 18,
      fat: 16,
      duration: "30 days",
      description: "Plant-based nutrition at its finest",
    },
  ];

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
          {/* Hero Header */}
          <div className="bg-card-bg rounded-b-3xl px-6 py-8 text-logo-text">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Find your plan</h1>
              <p className="text-green-100 mb-6">
                Simplify your nutrition decisions. With the test, we will create
                the best plan for you.
              </p>
              <Button className="bg-accent text-foreground hover:bg-accent/90 font-semibold px-8 py-3 rounded-full">
                Take the test
              </Button>
            </div>
          </div>

          {/* Diet Categories Navigation */}
          <div className="px-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex space-x-4 overflow-x-auto">
                {dietCategories.map((category) => {
                  const Icon = category.icon;
                  const isActive = selectedDietCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedDietCategory(category.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                        isActive
                          ? "bg-card-secondary/20 text-text-primary font-semibold"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Daily Summary Cards */}
          <div className="px-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Calories</p>
                      <p className="text-2xl font-bold text-green-600">
                        {dailyNutrition?.totalCalories || 0}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Flame className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Protein</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {dailyNutrition?.protein || 0}g
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Featured Meal Plans */}
          <div className="px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Recommended Plans
            </h2>
            <div className="space-y-4">
              {sampleMeals.map((meal) => (
                <Card
                  key={meal.id}
                  className="border-0 shadow-sm overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={meal.image}
                      alt={meal.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-sm font-semibold text-gray-700">
                        {meal.duration}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {meal.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {meal.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-700">
                          {meal.calories} kcal
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{meal.carbs} carbs</span>
                      <span>{meal.protein} protein</span>
                      <span>{meal.fat} fats</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Add Food */}
          <div className="px-4">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Quick Add Food
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Search for food..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-gray-200"
                    />
                  </div>
                  <Button
                    onClick={handleSearchFood}
                    variant="outline"
                    className="border-gray-200"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="meal-type" className="text-sm font-medium">
                      Meal Type
                    </Label>
                    <Select
                      value={selectedMeal}
                      onValueChange={(value: any) => setSelectedMeal(value)}
                    >
                      <SelectTrigger className="border-gray-200">
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
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Meals */}
          <div className="px-4 pb-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Today's Meals
                </CardTitle>
              </CardHeader>
              <CardContent>
                {foodEntries.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Utensils className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-medium">No food entries yet today</p>
                    <p className="text-sm">Start by adding your first meal!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {foodEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg"
                      >
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                          <Utensils className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {entry.foodName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {entry.quantity} {entry.unit} • {entry.mealType}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            {entry.totalCalories} cal
                          </p>
                          <p className="text-xs text-gray-500">
                            P: {entry.totalProtein}g • C: {entry.totalCarbs}g •
                            F: {entry.totalFat}g
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </MobileNavigation>
    </ThemeWrapper>
  );
};

export default Diet;
