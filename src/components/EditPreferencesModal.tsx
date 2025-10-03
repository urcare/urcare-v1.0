import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface UserPreferences {
  yogaLevel: string;
  equipment: string[];
  location: string;
  workoutIntensity: string;
  preferredTime: string;
  restDays: string[];
}

interface EditPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
}

const yogaLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const equipmentOptions = [
  "Mat",
  "Bands",
  "Dumbbells",
  "Kettlebell",
  "Resistance Bands",
  "Yoga Block",
  "Foam Roller",
  "Jump Rope",
  "Pull-up Bar",
  "None",
];

const locations = [
  { value: "home", label: "Home" },
  { value: "gym", label: "Gym" },
  { value: "outdoor", label: "Outdoor" },
  { value: "studio", label: "Studio" },
];

const intensityLevels = [
  { value: "light", label: "Light" },
  { value: "moderate", label: "Moderate" },
  { value: "intense", label: "Intense" },
  { value: "very-intense", label: "Very Intense" },
];

const timeSlots = [
  { value: "morning", label: "Morning (6-9 AM)" },
  { value: "late-morning", label: "Late Morning (9-12 PM)" },
  { value: "afternoon", label: "Afternoon (12-5 PM)" },
  { value: "evening", label: "Evening (5-8 PM)" },
  { value: "night", label: "Night (8-10 PM)" },
];

const restDaysOptions = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

export const EditPreferencesModal: React.FC<EditPreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSave,
}) => {
  const [formData, setFormData] = useState<UserPreferences>({
    yogaLevel: preferences.yogaLevel || 'Beginner',
    equipment: preferences.equipment || [],
    location: preferences.location || 'Home',
    workoutIntensity: preferences.workoutIntensity || 'Moderate',
    preferredTime: preferences.preferredTime || 'Morning',
    restDays: preferences.restDays || []
  });
  const [newEquipment, setNewEquipment] = useState("");

  const handleSave = () => {
    onSave(formData);
    toast.success("Preferences updated successfully!");
    onClose();
  };

  const handleEquipmentAdd = () => {
    if (newEquipment.trim() && !formData.equipment.includes(newEquipment.trim())) {
      setFormData({
        ...formData,
        equipment: [...formData.equipment, newEquipment.trim()],
      });
      setNewEquipment("");
    }
  };

  const handleEquipmentRemove = (equipment: string) => {
    setFormData({
      ...formData,
      equipment: formData.equipment.filter((item) => item !== equipment),
    });
  };

  const handleRestDayToggle = (day: string) => {
    setFormData({
      ...formData,
      restDays: formData.restDays.includes(day)
        ? formData.restDays.filter((d) => d !== day)
        : [...formData.restDays, day],
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 border-0 shadow-2xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Edit Workout Preferences
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Customize your workout experience to match your lifestyle and goals
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Yoga Level */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700">
              Yoga Level
            </Label>
            <Select
              value={formData.yogaLevel}
              onValueChange={(value) =>
                setFormData({ ...formData, yogaLevel: value })
              }
            >
              <SelectTrigger className="bg-white border-slate-200 focus:border-slate-400 focus:ring-slate-400">
                <SelectValue placeholder="Select yoga level" />
              </SelectTrigger>
              <SelectContent>
                {yogaLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Equipment */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700">
              Equipment
            </Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.equipment.map((equipment) => (
                <Badge
                  key={equipment}
                  variant="secondary"
                  className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {equipment}
                  <button
                    onClick={() => handleEquipmentRemove(equipment)}
                    className="ml-1 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Select
                value={newEquipment}
                onValueChange={setNewEquipment}
              >
                <SelectTrigger className="bg-white border-slate-200 focus:border-slate-400 focus:ring-slate-400">
                  <SelectValue placeholder="Add equipment" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentOptions
                    .filter((option) => !formData.equipment.includes(option))
                    .map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={handleEquipmentAdd}
                disabled={!newEquipment}
                className="bg-slate-600 hover:bg-slate-700 text-white px-4"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700">
              Preferred Location
            </Label>
            <Select
              value={formData.location}
              onValueChange={(value) =>
                setFormData({ ...formData, location: value })
              }
            >
              <SelectTrigger className="bg-white border-slate-200 focus:border-slate-400 focus:ring-slate-400">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.value} value={location.value}>
                    {location.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Workout Intensity */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700">
              Preferred Intensity
            </Label>
            <Select
              value={formData.workoutIntensity}
              onValueChange={(value) =>
                setFormData({ ...formData, workoutIntensity: value })
              }
            >
              <SelectTrigger className="bg-white border-slate-200 focus:border-slate-400 focus:ring-slate-400">
                <SelectValue placeholder="Select intensity" />
              </SelectTrigger>
              <SelectContent>
                {intensityLevels.map((intensity) => (
                  <SelectItem key={intensity.value} value={intensity.value}>
                    {intensity.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preferred Time */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700">
              Preferred Workout Time
            </Label>
            <Select
              value={formData.preferredTime}
              onValueChange={(value) =>
                setFormData({ ...formData, preferredTime: value })
              }
            >
              <SelectTrigger className="bg-white border-slate-200 focus:border-slate-400 focus:ring-slate-400">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time.value} value={time.value}>
                    {time.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rest Days */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700">
              Rest Days
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {restDaysOptions.map((day) => (
                <button
                  key={day.value}
                  onClick={() => handleRestDayToggle(day.value)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    formData.restDays.includes(day.value)
                      ? "bg-slate-600 text-white border-slate-600"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
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
            Save Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


