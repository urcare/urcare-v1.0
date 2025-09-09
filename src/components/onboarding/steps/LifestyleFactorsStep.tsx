import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Activity, Cigarette, Coffee, Heart, Moon, Wine } from "lucide-react";
import React from "react";

interface LifestyleFactorsStepProps {
  lifestyleFactors: LifestyleFactors;
  onUpdate: (factors: Partial<LifestyleFactors>) => void;
  error?: string;
}

interface LifestyleFactors {
  smokingStatus: "never" | "former" | "current";
  cigarettesPerDay?: number;
  alcoholConsumption: "none" | "light" | "moderate" | "heavy";
  drinksPerWeek?: number;
  exerciseFrequency: "none" | "light" | "moderate" | "active" | "very_active";
  sleepHours: number;
  stressLevel: "low" | "moderate" | "high";
  fitnessLevel: "beginner" | "intermediate" | "advanced";
}

const smokingOptions = [
  { value: "never", label: "Never smoked", description: "I have never smoked" },
  {
    value: "former",
    label: "Former smoker",
    description: "I used to smoke but quit",
  },
  {
    value: "current",
    label: "Current smoker",
    description: "I currently smoke",
  },
];

const alcoholOptions = [
  { value: "none", label: "No alcohol", description: "I don't drink alcohol" },
  {
    value: "light",
    label: "Light drinking",
    description: "1-3 drinks per week",
  },
  {
    value: "moderate",
    label: "Moderate drinking",
    description: "4-7 drinks per week",
  },
  {
    value: "heavy",
    label: "Heavy drinking",
    description: "8+ drinks per week",
  },
];

const exerciseOptions = [
  { value: "none", label: "Sedentary", description: "Little to no exercise" },
  {
    value: "light",
    label: "Light activity",
    description: "Light exercise 1-3 days/week",
  },
  {
    value: "moderate",
    label: "Moderate activity",
    description: "Moderate exercise 3-5 days/week",
  },
  {
    value: "active",
    label: "Active",
    description: "Heavy exercise 6-7 days/week",
  },
  {
    value: "very_active",
    label: "Very active",
    description: "Very heavy exercise, physical job",
  },
];

const stressOptions = [
  {
    value: "low",
    label: "Low stress",
    description: "I feel relaxed most of the time",
  },
  {
    value: "moderate",
    label: "Moderate stress",
    description: "I experience some stress regularly",
  },
  {
    value: "high",
    label: "High stress",
    description: "I feel stressed most of the time",
  },
];

const fitnessOptions = [
  {
    value: "beginner",
    label: "Beginner",
    description: "New to fitness or returning after a break",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Some experience with regular exercise",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "Experienced with various forms of exercise",
  },
];

const sleepHours = Array.from({ length: 12 }, (_, i) => i + 4); // 4 to 15 hours

export const LifestyleFactorsStep: React.FC<LifestyleFactorsStepProps> = ({
  lifestyleFactors,
  onUpdate,
  error,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">
          Tell us about your lifestyle
        </h3>
        <p className="text-gray-600 text-sm">
          This helps us create more accurate timelines and recommendations.
        </p>
      </div>

      {/* Smoking Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-md flex items-center gap-2">
            <Cigarette className="h-5 w-5 text-red-500" />
            Smoking Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {smokingOptions.map((option) => (
              <Card
                key={option.value}
                className={`cursor-pointer transition-all ${
                  lifestyleFactors.smokingStatus === option.value
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => onUpdate({ smokingStatus: option.value as any })}
              >
                <CardContent className="p-4">
                  <h4 className="font-medium">{option.label}</h4>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {lifestyleFactors.smokingStatus === "current" && (
            <div className="space-y-2">
              <Label>How many cigarettes do you smoke per day?</Label>
              <Select
                value={lifestyleFactors.cigarettesPerDay?.toString() || ""}
                onValueChange={(value) =>
                  onUpdate({ cigarettesPerDay: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select amount" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} cigarettes/day
                    </SelectItem>
                  ))}
                  <SelectItem value="21">20+ cigarettes/day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alcohol Consumption */}
      <Card>
        <CardHeader>
          <CardTitle className="text-md flex items-center gap-2">
            <Wine className="h-5 w-5 text-purple-500" />
            Alcohol Consumption
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {alcoholOptions.map((option) => (
              <Card
                key={option.value}
                className={`cursor-pointer transition-all ${
                  lifestyleFactors.alcoholConsumption === option.value
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  onUpdate({ alcoholConsumption: option.value as any })
                }
              >
                <CardContent className="p-4">
                  <h4 className="font-medium">{option.label}</h4>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {lifestyleFactors.alcoholConsumption !== "none" && (
            <div className="space-y-2">
              <Label>How many drinks do you have per week?</Label>
              <Select
                value={lifestyleFactors.drinksPerWeek?.toString() || ""}
                onValueChange={(value) =>
                  onUpdate({ drinksPerWeek: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select amount" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} drinks/week
                    </SelectItem>
                  ))}
                  <SelectItem value="21">20+ drinks/week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Exercise Frequency */}
      <Card>
        <CardHeader>
          <CardTitle className="text-md flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            Exercise Frequency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {exerciseOptions.map((option) => (
              <Card
                key={option.value}
                className={`cursor-pointer transition-all ${
                  lifestyleFactors.exerciseFrequency === option.value
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  onUpdate({ exerciseFrequency: option.value as any })
                }
              >
                <CardContent className="p-4">
                  <h4 className="font-medium">{option.label}</h4>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fitness Level */}
      <Card>
        <CardHeader>
          <CardTitle className="text-md flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Fitness Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {fitnessOptions.map((option) => (
              <Card
                key={option.value}
                className={`cursor-pointer transition-all ${
                  lifestyleFactors.fitnessLevel === option.value
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => onUpdate({ fitnessLevel: option.value as any })}
              >
                <CardContent className="p-4">
                  <h4 className="font-medium">{option.label}</h4>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sleep and Stress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-md flex items-center gap-2">
              <Moon className="h-5 w-5 text-blue-500" />
              Sleep Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={lifestyleFactors.sleepHours.toString()}
              onValueChange={(value) =>
                onUpdate({ sleepHours: parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sleepHours.map((hours) => (
                  <SelectItem key={hours} value={hours.toString()}>
                    {hours} hours per night
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-md flex items-center gap-2">
              <Coffee className="h-5 w-5 text-amber-500" />
              Stress Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stressOptions.map((option) => (
                <Card
                  key={option.value}
                  className={`cursor-pointer transition-all ${
                    lifestyleFactors.stressLevel === option.value
                      ? "ring-2 ring-primary bg-primary/5"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => onUpdate({ stressLevel: option.value as any })}
                >
                  <CardContent className="p-3">
                    <h5 className="font-medium text-sm">{option.label}</h5>
                    <p className="text-xs text-gray-600">
                      {option.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-md">Lifestyle Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              {
                smokingOptions.find(
                  (s) => s.value === lifestyleFactors.smokingStatus
                )?.label
              }
            </Badge>
            <Badge variant="outline">
              {
                alcoholOptions.find(
                  (a) => a.value === lifestyleFactors.alcoholConsumption
                )?.label
              }
            </Badge>
            <Badge variant="outline">
              {
                exerciseOptions.find(
                  (e) => e.value === lifestyleFactors.exerciseFrequency
                )?.label
              }
            </Badge>
            <Badge variant="outline">
              {lifestyleFactors.sleepHours} hours sleep
            </Badge>
            <Badge variant="outline">
              {
                stressOptions.find(
                  (s) => s.value === lifestyleFactors.stressLevel
                )?.label
              }
            </Badge>
            <Badge variant="outline">
              {
                fitnessOptions.find(
                  (f) => f.value === lifestyleFactors.fitnessLevel
                )?.label
              }
            </Badge>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="text-red-500 text-sm text-center mt-2">{error}</div>
      )}
    </div>
  );
};
