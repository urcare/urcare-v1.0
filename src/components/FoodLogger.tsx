import { useAuth } from "@/contexts/AuthContext";
import { nutritionTrackingService } from "@/services/nutritionTrackingService";
import { Plus, Search } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface FoodLoggerProps {
  onFoodAdded?: () => void;
}

export const FoodLogger: React.FC<FoodLoggerProps> = ({ onFoodAdded }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<
    "breakfast" | "lunch" | "dinner" | "snack"
  >("breakfast");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const quickAddFoods = [
    {
      name: "Apple",
      calories: 95,
      protein: 0.5,
      carbs: 25,
      fat: 0.3,
      unit: "medium",
    },
    {
      name: "Banana",
      calories: 105,
      protein: 1.3,
      carbs: 27,
      fat: 0.4,
      unit: "medium",
    },
    {
      name: "Chicken Breast",
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      unit: "100g",
    },
    {
      name: "Brown Rice",
      calories: 111,
      protein: 2.6,
      carbs: 23,
      fat: 0.9,
      unit: "100g",
    },
    {
      name: "Greek Yogurt",
      calories: 59,
      protein: 10,
      carbs: 3.6,
      fat: 0.4,
      unit: "100g",
    },
    {
      name: "Almonds",
      calories: 161,
      protein: 6,
      carbs: 6,
      fat: 14,
      unit: "28g",
    },
  ];

  const handleQuickAdd = async (food: (typeof quickAddFoods)[0]) => {
    if (!user) return;

    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];

      await nutritionTrackingService.addFoodEntry({
        userId: user.id,
        date: today,
        mealType: selectedMeal,
        foodName: food.name,
        quantity: quantity,
        unit: food.unit,
        caloriesPerUnit: food.calories,
        proteinPerUnit: food.protein,
        carbsPerUnit: food.carbs,
        fatPerUnit: food.fat,
        fiberPerUnit: 0,
        sugarPerUnit: 0,
        sodiumPerUnit: 0,
      });

      toast.success(
        `Added ${quantity} ${food.unit} of ${food.name} to ${selectedMeal}`
      );
      setIsOpen(false);
      setQuantity(1);
      setSearchQuery("");
      onFoodAdded?.();
    } catch (error) {
      console.error("Error adding food:", error);
      toast.error("Failed to add food entry");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors z-50"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Log Food</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <span className="text-gray-500">×</span>
            </button>
          </div>

          {/* Meal Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meal
            </label>
            <div className="flex space-x-2">
              {(["breakfast", "lunch", "dinner", "snack"] as const).map(
                (meal) => (
                  <button
                    key={meal}
                    onClick={() => setSelectedMeal(meal)}
                    className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                      selectedMeal === meal
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {meal}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Quantity Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(0.1, parseFloat(e.target.value) || 1))
              }
              min="0.1"
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search foods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Quick Add Foods */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Add
            </h3>
            <div className="space-y-3">
              {quickAddFoods
                .filter(
                  (food) =>
                    searchQuery === "" ||
                    food.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((food, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{food.name}</h4>
                      <p className="text-sm text-gray-500">
                        {Math.round(food.calories * quantity)} cal,{" "}
                        {Math.round(food.protein * quantity)}g protein per{" "}
                        {quantity} {food.unit}
                      </p>
                    </div>
                    <button
                      onClick={() => handleQuickAdd(food)}
                      disabled={loading}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      {loading ? "Adding..." : "Add"}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
