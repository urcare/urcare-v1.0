/**
 * Updated Onboarding Component
 * Uses the new user profile service and database structure
 */

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserProfile } from "@/hooks/useUserProfile";
import { OnboardingData } from "@/services/userProfileService";
import { Loader2 } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<OnboardingStepProps>;
}

interface OnboardingStepProps {
  data: OnboardingData;
  updateData: (field: keyof OnboardingData, value: any) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
}

// Step 1: Basic Information
const BasicInfoStep: React.FC<OnboardingStepProps> = ({
  data,
  updateData,
  errors,
  onNext,
  isFirst,
  isLast,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Tell us about yourself</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={data.fullName}
              onChange={(e) => updateData("fullName", e.target.value)}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={data.age}
              onChange={(e) => updateData("age", parseInt(e.target.value))}
              placeholder="Enter your age"
            />
            {errors.age && <p className="text-sm text-red-500">{errors.age}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={data.dateOfBirth}
              onChange={(e) => updateData("dateOfBirth", e.target.value)}
            />
            {errors.dateOfBirth && (
              <p className="text-sm text-red-500">{errors.dateOfBirth}</p>
            )}
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={data.gender}
              onValueChange={(value) => updateData("gender", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">
                  Prefer not to say
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-sm text-red-500">{errors.gender}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={onNext}
            disabled={
              !data.fullName || !data.age || !data.dateOfBirth || !data.gender
            }
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Step 2: Physical Metrics
const PhysicalMetricsStep: React.FC<OnboardingStepProps> = ({
  data,
  updateData,
  errors,
  onNext,
  onPrevious,
  isFirst,
  isLast,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Physical Metrics</CardTitle>
        <CardDescription>
          Help us understand your physical measurements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="unitSystem">Unit System</Label>
          <Select
            value={data.unitSystem}
            onValueChange={(value) => updateData("unitSystem", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select unit system" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="metric">Metric (kg, cm)</SelectItem>
              <SelectItem value="imperial">Imperial (lb, ft)</SelectItem>
            </SelectContent>
          </Select>
          {errors.unitSystem && (
            <p className="text-sm text-red-500">{errors.unitSystem}</p>
          )}
        </div>

        {data.unitSystem === "imperial" ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="heightFeet">Height (Feet)</Label>
              <Input
                id="heightFeet"
                value={data.heightFeet || ""}
                onChange={(e) => updateData("heightFeet", e.target.value)}
                placeholder="5"
              />
            </div>
            <div>
              <Label htmlFor="heightInches">Height (Inches)</Label>
              <Input
                id="heightInches"
                value={data.heightInches || ""}
                onChange={(e) => updateData("heightInches", e.target.value)}
                placeholder="10"
              />
            </div>
            <div>
              <Label htmlFor="weightLb">Weight (Pounds)</Label>
              <Input
                id="weightLb"
                value={data.weightLb || ""}
                onChange={(e) => updateData("weightLb", e.target.value)}
                placeholder="150"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="heightCm">Height (cm)</Label>
              <Input
                id="heightCm"
                value={data.heightCm || ""}
                onChange={(e) => updateData("heightCm", e.target.value)}
                placeholder="175"
              />
            </div>
            <div>
              <Label htmlFor="weightKg">Weight (kg)</Label>
              <Input
                id="weightKg"
                value={data.weightKg || ""}
                onChange={(e) => updateData("weightKg", e.target.value)}
                placeholder="70"
              />
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious} disabled={isFirst}>
            Previous
          </Button>
          <Button onClick={onNext} disabled={!data.unitSystem}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Step 3: Health Information
const HealthInfoStep: React.FC<OnboardingStepProps> = ({
  data,
  updateData,
  errors,
  onNext,
  onPrevious,
  isFirst,
  isLast,
}) => {
  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    data.chronicConditions || []
  );
  const [selectedMedications, setSelectedMedications] = useState<string[]>(
    data.medications || []
  );

  const commonConditions = [
    "Diabetes",
    "Hypertension",
    "Heart Disease",
    "Asthma",
    "Arthritis",
    "Depression",
    "Anxiety",
    "High Cholesterol",
    "Thyroid Issues",
    "Sleep Apnea",
  ];

  const commonMedications = [
    "Metformin",
    "Lisinopril",
    "Atorvastatin",
    "Metoprolol",
    "Omeprazole",
    "Sertraline",
    "Albuterol",
    "Levothyroxine",
    "Amlodipine",
    "Losartan",
  ];

  const handleConditionToggle = (condition: string) => {
    const updated = selectedConditions.includes(condition)
      ? selectedConditions.filter((c) => c !== condition)
      : [...selectedConditions, condition];
    setSelectedConditions(updated);
    updateData("chronicConditions", updated);
  };

  const handleMedicationToggle = (medication: string) => {
    const updated = selectedMedications.includes(medication)
      ? selectedMedications.filter((m) => m !== medication)
      : [...selectedMedications, medication];
    setSelectedMedications(updated);
    updateData("medications", updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Information</CardTitle>
        <CardDescription>Help us understand your health status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Chronic Conditions (select all that apply)</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {commonConditions.map((condition) => (
              <div key={condition} className="flex items-center space-x-2">
                <Checkbox
                  id={condition}
                  checked={selectedConditions.includes(condition)}
                  onCheckedChange={() => handleConditionToggle(condition)}
                />
                <Label htmlFor={condition} className="text-sm">
                  {condition}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Current Medications (select all that apply)</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {commonMedications.map((medication) => (
              <div key={medication} className="flex items-center space-x-2">
                <Checkbox
                  id={medication}
                  checked={selectedMedications.includes(medication)}
                  onCheckedChange={() => handleMedicationToggle(medication)}
                />
                <Label htmlFor={medication} className="text-sm">
                  {medication}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="dietType">Diet Type</Label>
          <Select
            value={data.dietType}
            onValueChange={(value) => updateData("dietType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your diet type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="omnivore">Omnivore</SelectItem>
              <SelectItem value="vegetarian">Vegetarian</SelectItem>
              <SelectItem value="vegan">Vegan</SelectItem>
              <SelectItem value="keto">Keto</SelectItem>
              <SelectItem value="paleo">Paleo</SelectItem>
              <SelectItem value="mediterranean">Mediterranean</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="bloodGroup">Blood Group</Label>
          <Select
            value={data.bloodGroup}
            onValueChange={(value) => updateData("bloodGroup", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your blood group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
              <SelectItem value="unknown">Unknown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious} disabled={isFirst}>
            Previous
          </Button>
          <Button onClick={onNext}>Next</Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Step 4: Lifestyle & Schedule
const LifestyleStep: React.FC<OnboardingStepProps> = ({
  data,
  updateData,
  errors,
  onNext,
  onPrevious,
  isFirst,
  isLast,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lifestyle & Schedule</CardTitle>
        <CardDescription>Help us understand your daily routine</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="wakeUpTime">Wake Up Time</Label>
            <Input
              id="wakeUpTime"
              type="time"
              value={data.wakeUpTime}
              onChange={(e) => updateData("wakeUpTime", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="sleepTime">Sleep Time</Label>
            <Input
              id="sleepTime"
              type="time"
              value={data.sleepTime}
              onChange={(e) => updateData("sleepTime", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="workStart">Work Start Time</Label>
            <Input
              id="workStart"
              type="time"
              value={data.workStart}
              onChange={(e) => updateData("workStart", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="workEnd">Work End Time</Label>
            <Input
              id="workEnd"
              type="time"
              value={data.workEnd}
              onChange={(e) => updateData("workEnd", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="breakfastTime">Breakfast Time</Label>
            <Input
              id="breakfastTime"
              type="time"
              value={data.breakfastTime}
              onChange={(e) => updateData("breakfastTime", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="lunchTime">Lunch Time</Label>
            <Input
              id="lunchTime"
              type="time"
              value={data.lunchTime}
              onChange={(e) => updateData("lunchTime", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="dinnerTime">Dinner Time</Label>
            <Input
              id="dinnerTime"
              type="time"
              value={data.dinnerTime}
              onChange={(e) => updateData("dinnerTime", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="workoutTime">Preferred Workout Time</Label>
          <Input
            id="workoutTime"
            type="time"
            value={data.workoutTime}
            onChange={(e) => updateData("workoutTime", e.target.value)}
          />
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious} disabled={isFirst}>
            Previous
          </Button>
          <Button onClick={onNext}>Next</Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Step 5: Health Goals
const HealthGoalsStep: React.FC<OnboardingStepProps> = ({
  data,
  updateData,
  errors,
  onNext,
  onPrevious,
  isFirst,
  isLast,
}) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    data.healthGoals || []
  );

  const commonGoals = [
    "Weight Loss",
    "Weight Gain",
    "Muscle Building",
    "Better Sleep",
    "Stress Reduction",
    "Improved Energy",
    "Better Nutrition",
    "Cardiovascular Health",
    "Flexibility",
    "Mental Health",
  ];

  const handleGoalToggle = (goal: string) => {
    const updated = selectedGoals.includes(goal)
      ? selectedGoals.filter((g) => g !== goal)
      : [...selectedGoals, goal];
    setSelectedGoals(updated);
    updateData("healthGoals", updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Goals</CardTitle>
        <CardDescription>What would you like to achieve?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Select your health goals (choose all that apply)</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {commonGoals.map((goal) => (
              <div key={goal} className="flex items-center space-x-2">
                <Checkbox
                  id={goal}
                  checked={selectedGoals.includes(goal)}
                  onCheckedChange={() => handleGoalToggle(goal)}
                />
                <Label htmlFor={goal} className="text-sm">
                  {goal}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious} disabled={isFirst}>
            Previous
          </Button>
          <Button onClick={onNext} disabled={selectedGoals.length === 0}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Onboarding Component
export const UpdatedOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { saveOnboardingData, isSaving } = useUserProfile();

  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    fullName: "",
    age: 0,
    dateOfBirth: "",
    gender: "",
    unitSystem: "metric",
    heightFeet: "",
    heightInches: "",
    heightCm: "",
    weightLb: "",
    weightKg: "",
    wakeUpTime: "",
    sleepTime: "",
    workStart: "",
    workEnd: "",
    breakfastTime: "",
    lunchTime: "",
    dinnerTime: "",
    workoutTime: "",
    chronicConditions: [],
    takesMedications: "",
    medications: [],
    hasSurgery: "",
    surgeryDetails: [],
    healthGoals: [],
    dietType: "",
    bloodGroup: "",
    routineFlexibility: "",
    workoutType: "",
    smoking: "",
    drinking: "",
    usesWearable: "",
    wearableType: "",
    trackFamily: "",
    shareProgress: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    criticalConditions: "",
    hasHealthReports: "",
    healthReports: [],
    referralCode: "",
    saveProgress: "",
    preferences: {},
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps: OnboardingStep[] = [
    {
      id: "basic-info",
      title: "Basic Information",
      description: "Tell us about yourself",
      component: BasicInfoStep,
    },
    {
      id: "physical-metrics",
      title: "Physical Metrics",
      description: "Your measurements",
      component: PhysicalMetricsStep,
    },
    {
      id: "health-info",
      title: "Health Information",
      description: "Your health status",
      component: HealthInfoStep,
    },
    {
      id: "lifestyle",
      title: "Lifestyle & Schedule",
      description: "Your daily routine",
      component: LifestyleStep,
    },
    {
      id: "health-goals",
      title: "Health Goals",
      description: "What you want to achieve",
      component: HealthGoalsStep,
    },
  ];

  const updateData = useCallback(
    (field: keyof OnboardingData, value: any) => {
      setData((prev) => ({ ...prev, [field]: value }));
      // Clear error when user starts typing/selecting
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  const validateStep = (stepIndex: number): boolean => {
    const step = steps[stepIndex];
    const newErrors: Record<string, string> = {};

    // Basic validation for each step
    switch (step.id) {
      case "basic-info":
        if (!data.fullName) newErrors.fullName = "Full name is required";
        if (!data.age || data.age < 1) newErrors.age = "Valid age is required";
        if (!data.dateOfBirth)
          newErrors.dateOfBirth = "Date of birth is required";
        if (!data.gender) newErrors.gender = "Gender is required";
        break;
      case "physical-metrics":
        if (!data.unitSystem) newErrors.unitSystem = "Unit system is required";
        break;
      case "health-goals":
        if (data.healthGoals.length === 0)
          newErrors.healthGoals = "At least one health goal is required";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = useCallback(() => {
    if (validateStep(currentStep)) {
      if (currentStep === steps.length - 1) {
        // Last step - save data
        handleComplete();
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  }, [currentStep, data, validateStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  }, [currentStep]);

  const handleComplete = useCallback(async () => {
    const success = await saveOnboardingData(data);
    if (success) {
      navigate("/dashboard");
    }
  }, [data, saveOnboardingData, navigate]);

  const currentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {steps[currentStep].title}
          </h1>
          <p className="text-gray-600 mb-6">{steps[currentStep].description}</p>

          {React.createElement(currentStepComponent, {
            data,
            updateData,
            errors,
            onNext: handleNext,
            onPrevious: handlePrevious,
            isFirst: currentStep === 0,
            isLast: currentStep === steps.length - 1,
          })}
        </div>

        {/* Loading overlay */}
        {isSaving && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Saving your profile...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
