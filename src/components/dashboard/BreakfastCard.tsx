import { ChevronDown, Edit, Plus, Sun } from "lucide-react";
import React from "react";

interface BreakfastCardProps {
  mealName?: string;
  calories?: number;
  proteins?: number;
  fats?: number;
  carbs?: number;
  rdc?: number;
  selectedDate?: string;
}

export const BreakfastCard: React.FC<BreakfastCardProps> = ({
  mealName = "Breakfast",
  calories = 350,
  proteins = 62.5,
  fats = 23.6,
  carbs = 45.7,
  rdc = 14,
  selectedDate = "Today",
}) => {
  return (
    <div className="bg-green-100 rounded-3xl p-6 shadow-lg">
      {/* Header with meal info and add button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-200 rounded-lg flex items-center justify-center">
            <Sun className="w-5 h-5 text-green-700" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{mealName}</h3>
            <p className="text-sm text-gray-600">{calories} calories</p>
          </div>
        </div>

        <button className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center hover:bg-green-300 transition-colors">
          <Plus className="w-5 h-5 text-green-700" />
        </button>
      </div>

      {/* Macronutrient breakdown */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-800">{proteins}</div>
          <div className="text-xs text-gray-600">Proteins</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-800">{fats}</div>
          <div className="text-xs text-gray-600">Fats</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-800">{carbs}</div>
          <div className="text-xs text-gray-600">Carbs</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-800">{rdc}%</div>
          <div className="text-xs text-gray-600">RDC</div>
        </div>
      </div>

      {/* Footer with date selector and edit button */}
      <div className="flex items-center justify-between">
        <button className="flex items-center gap-2 px-3 py-2 bg-green-200 rounded-lg hover:bg-green-300 transition-colors">
          <span className="text-sm font-medium text-gray-700">
            {selectedDate}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </button>

        <button className="w-8 h-8 bg-green-200 rounded-lg flex items-center justify-center hover:bg-green-300 transition-colors">
          <Edit className="w-4 h-4 text-gray-700" />
        </button>
      </div>
    </div>
  );
};
