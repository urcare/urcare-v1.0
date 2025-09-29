import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, Zap, Smile, Frown, Meh } from "lucide-react";
import { toast } from "sonner";

interface RPELoggingModalProps {
  isOpen: boolean;
  onClose: () => void;
  workoutTitle: string;
  onSave: (rpeData: RPEData) => void;
}

interface RPEData {
  rating: number;
  notes: string;
  energyLevel: number;
  difficulty: number;
  enjoyment: number;
}

const rpeScale = [
  { value: 1, label: "Very Easy", description: "No effort, like walking", color: "bg-blue-100 text-blue-800" },
  { value: 2, label: "Easy", description: "Light effort, comfortable", color: "bg-blue-200 text-blue-900" },
  { value: 3, label: "Moderate", description: "Noticeable effort, still comfortable", color: "bg-amber-100 text-amber-800" },
  { value: 4, label: "Somewhat Hard", description: "Getting harder, but sustainable", color: "bg-amber-200 text-amber-900" },
  { value: 5, label: "Hard", description: "Difficult, breathing heavily", color: "bg-orange-100 text-orange-800" },
  { value: 6, label: "Very Hard", description: "Very difficult, pushing limits", color: "bg-orange-200 text-orange-900" },
  { value: 7, label: "Extremely Hard", description: "Maximum effort, unsustainable", color: "bg-red-100 text-red-800" },
  { value: 8, label: "Maximal", description: "All-out effort, can't continue", color: "bg-red-200 text-red-900" },
  { value: 9, label: "Peak", description: "Absolute maximum", color: "bg-red-300 text-red-900" },
  { value: 10, label: "Maximum", description: "Cannot be exceeded", color: "bg-red-400 text-red-900" },
];

const energyLevels = [
  { value: 1, label: "Very Low", icon: <Frown className="w-5 h-5" />, color: "bg-red-100 text-red-800" },
  { value: 2, label: "Low", icon: <Meh className="w-5 h-5" />, color: "bg-orange-100 text-orange-800" },
  { value: 3, label: "Moderate", icon: <Meh className="w-5 h-5" />, color: "bg-amber-100 text-amber-800" },
  { value: 4, label: "Good", icon: <Smile className="w-5 h-5" />, color: "bg-blue-100 text-blue-800" },
  { value: 5, label: "Excellent", icon: <Zap className="w-5 h-5" />, color: "bg-indigo-100 text-indigo-800" },
];

const difficultyLevels = [
  { value: 1, label: "Very Easy", color: "bg-blue-100 text-blue-800" },
  { value: 2, label: "Easy", color: "bg-blue-200 text-blue-900" },
  { value: 3, label: "Moderate", color: "bg-amber-100 text-amber-800" },
  { value: 4, label: "Hard", color: "bg-orange-100 text-orange-800" },
  { value: 5, label: "Very Hard", color: "bg-red-100 text-red-800" },
];

const enjoymentLevels = [
  { value: 1, label: "Hated it", icon: <Frown className="w-5 h-5" />, color: "bg-red-100 text-red-800" },
  { value: 2, label: "Disliked", icon: <Meh className="w-5 h-5" />, color: "bg-orange-100 text-orange-800" },
  { value: 3, label: "Neutral", icon: <Meh className="w-5 h-5" />, color: "bg-amber-100 text-amber-800" },
  { value: 4, label: "Liked", icon: <Smile className="w-5 h-5" />, color: "bg-blue-100 text-blue-800" },
  { value: 5, label: "Loved it", icon: <Heart className="w-5 h-5" />, color: "bg-indigo-100 text-indigo-800" },
];

export const RPELoggingModal: React.FC<RPELoggingModalProps> = ({
  isOpen,
  onClose,
  workoutTitle,
  onSave,
}) => {
  const [rpeData, setRpeData] = useState<RPEData>({
    rating: 5,
    notes: "",
    energyLevel: 3,
    difficulty: 3,
    enjoyment: 3,
  });

  const handleSave = () => {
    onSave(rpeData);
    toast.success("RPE logged successfully!");
    onClose();
  };

  const handleRatingChange = (rating: number) => {
    setRpeData({ ...rpeData, rating });
  };

  const handleEnergyChange = (energyLevel: number) => {
    setRpeData({ ...rpeData, energyLevel });
  };

  const handleDifficultyChange = (difficulty: number) => {
    setRpeData({ ...rpeData, difficulty });
  };

  const handleEnjoymentChange = (enjoyment: number) => {
    setRpeData({ ...rpeData, enjoyment });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 border-0 shadow-2xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Log Your Workout Experience
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Rate your perceived exertion for: <span className="font-semibold">{workoutTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* RPE Scale */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-slate-700">
              Rate of Perceived Exertion (RPE)
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {rpeScale.map((item) => (
                <button
                  key={item.value}
                  onClick={() => handleRatingChange(item.value)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    rpeData.rating === item.value
                      ? "border-slate-600 bg-slate-100 shadow-md"
                      : "border-slate-200 bg-white hover:border-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-lg">{item.value}</span>
                    <Badge className={item.color}>
                      {item.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Energy Level */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-slate-700">
              Energy Level Before Workout
            </Label>
            <div className="flex gap-3">
              {energyLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => handleEnergyChange(level.value)}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 ${
                    rpeData.energyLevel === level.value
                      ? "border-slate-600 bg-slate-100 shadow-md"
                      : "border-slate-200 bg-white hover:border-slate-400"
                  }`}
                >
                  <div className="mb-2">{level.icon}</div>
                  <span className="text-sm font-medium">{level.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Level */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-slate-700">
              How Difficult Was This Workout?
            </Label>
            <div className="flex gap-3">
              {difficultyLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => handleDifficultyChange(level.value)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    rpeData.difficulty === level.value
                      ? "border-slate-600 bg-slate-100 shadow-md"
                      : "border-slate-200 bg-white hover:border-slate-400"
                  }`}
                >
                  <Badge className={level.color}>
                    {level.label}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Enjoyment Level */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-slate-700">
              How Much Did You Enjoy This Workout?
            </Label>
            <div className="flex gap-3">
              {enjoymentLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => handleEnjoymentChange(level.value)}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 ${
                    rpeData.enjoyment === level.value
                      ? "border-slate-600 bg-slate-100 shadow-md"
                      : "border-slate-200 bg-white hover:border-slate-400"
                  }`}
                >
                  <div className="mb-2">{level.icon}</div>
                  <span className="text-sm font-medium">{level.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold text-slate-700">
              Additional Notes (Optional)
            </Label>
            <Textarea
              value={rpeData.notes}
              onChange={(e) => setRpeData({ ...rpeData, notes: e.target.value })}
              placeholder="How did you feel during the workout? Any specific observations or feedback?"
              className="min-h-[100px] bg-white border-slate-200 focus:border-slate-400 focus:ring-slate-400"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-6"
          >
            Save RPE Data
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

