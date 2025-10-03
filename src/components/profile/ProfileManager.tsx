/**
 * Profile Manager Component
 * Allows users to view and update their profile information
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ProfileUpdateData } from "@/services/userProfileService";
import { Heart, Loader2, Settings, Target, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export const ProfileManager: React.FC = () => {
  const {
    profile,
    isLoading,
    isSaving,
    updateProfile,
    profileCompleteness,
    healthScore,
    daysActive,
    error,
    clearError,
  } = useUserProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileUpdateData>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name,
        age: profile.age,
        date_of_birth: profile.date_of_birth,
        gender: profile.gender,
        unit_system: profile.unit_system,
        height_cm: profile.height_cm,
        weight_kg: profile.weight_kg,
        diet_type: profile.diet_type,
        blood_group: profile.blood_group,
        wake_up_time: profile.wake_up_time,
        sleep_time: profile.sleep_time,
        work_start: profile.work_start,
        work_end: profile.work_end,
        breakfast_time: profile.breakfast_time,
        lunch_time: profile.lunch_time,
        dinner_time: profile.dinner_time,
        workout_time: profile.workout_time,
        routine_flexibility: profile.routine_flexibility,
        workout_type: profile.workout_type,
        smoking: profile.smoking,
        drinking: profile.drinking,
        uses_wearable: profile.uses_wearable,
        wearable_type: profile.wearable_type,
        emergency_contact_name: profile.emergency_contact_name,
        emergency_contact_phone: profile.emergency_contact_phone,
        critical_conditions: profile.critical_conditions,
        preferences: profile.preferences,
      });
    }
  }, [profile]);

  const handleInputChange = (field: keyof ProfileUpdateData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.full_name) errors.full_name = "Full name is required";
    if (!formData.age || formData.age < 1) errors.age = "Valid age is required";
    if (!formData.gender) errors.gender = "Gender is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const success = await updateProfile(formData);
    if (success) {
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name,
        age: profile.age,
        date_of_birth: profile.date_of_birth,
        gender: profile.gender,
        unit_system: profile.unit_system,
        height_cm: profile.height_cm,
        weight_kg: profile.weight_kg,
        diet_type: profile.diet_type,
        blood_group: profile.blood_group,
        wake_up_time: profile.wake_up_time,
        sleep_time: profile.sleep_time,
        work_start: profile.work_start,
        work_end: profile.work_end,
        breakfast_time: profile.breakfast_time,
        lunch_time: profile.lunch_time,
        dinner_time: profile.dinner_time,
        workout_time: profile.workout_time,
        routine_flexibility: profile.routine_flexibility,
        workout_type: profile.workout_type,
        smoking: profile.smoking,
        drinking: profile.drinking,
        uses_wearable: profile.uses_wearable,
        wearable_type: profile.wearable_type,
        emergency_contact_name: profile.emergency_contact_name,
        emergency_contact_phone: profile.emergency_contact_phone,
        critical_conditions: profile.critical_conditions,
        preferences: profile.preferences,
      });
    }
    setIsEditing(false);
    setFormErrors({});
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            No profile found. Please complete onboarding first.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Profile Management
          </h1>
          <p className="text-gray-600">
            Manage your personal information and preferences
          </p>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>
      </div>

      {/* Profile Completeness */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Profile Completeness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Profile Completion</span>
              <span>{profileCompleteness}%</span>
            </div>
            <Progress value={profileCompleteness} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Health Score</p>
                <p className="text-2xl font-bold">{healthScore}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Days Active</p>
                <p className="text-2xl font-bold">{daysActive}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Profile Status</p>
                <Badge
                  variant={
                    profile.onboarding_completed ? "default" : "secondary"
                  }
                >
                  {profile.onboarding_completed ? "Complete" : "Incomplete"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Tabs */}
      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="health">Health Info</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={
                      isEditing
                        ? formData.full_name || ""
                        : profile.full_name || ""
                    }
                    onChange={(e) =>
                      handleInputChange("full_name", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                  {formErrors.full_name && (
                    <p className="text-sm text-red-500">
                      {formErrors.full_name}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={isEditing ? formData.age || "" : profile.age || ""}
                    onChange={(e) =>
                      handleInputChange("age", parseInt(e.target.value))
                    }
                    disabled={!isEditing}
                  />
                  {formErrors.age && (
                    <p className="text-sm text-red-500">{formErrors.age}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={
                      isEditing
                        ? formData.date_of_birth || ""
                        : profile.date_of_birth || ""
                    }
                    onChange={(e) =>
                      handleInputChange("date_of_birth", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={
                      isEditing ? formData.gender || "" : profile.gender || ""
                    }
                    onValueChange={(value) =>
                      handleInputChange("gender", value)
                    }
                    disabled={!isEditing}
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
                  {formErrors.gender && (
                    <p className="text-sm text-red-500">{formErrors.gender}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Health Information Tab */}
        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle>Health Information</CardTitle>
              <CardDescription>
                Your health status and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="diet_type">Diet Type</Label>
                  <Select
                    value={
                      isEditing
                        ? formData.diet_type || ""
                        : profile.diet_type || ""
                    }
                    onValueChange={(value) =>
                      handleInputChange("diet_type", value)
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select diet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="omnivore">Omnivore</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="keto">Keto</SelectItem>
                      <SelectItem value="paleo">Paleo</SelectItem>
                      <SelectItem value="mediterranean">
                        Mediterranean
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="blood_group">Blood Group</Label>
                  <Select
                    value={
                      isEditing
                        ? formData.blood_group || ""
                        : profile.blood_group || ""
                    }
                    onValueChange={(value) =>
                      handleInputChange("blood_group", value)
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
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
                <div>
                  <Label htmlFor="height_cm">Height (cm)</Label>
                  <Input
                    id="height_cm"
                    type="number"
                    value={
                      isEditing
                        ? formData.height_cm || ""
                        : profile.height_cm || ""
                    }
                    onChange={(e) =>
                      handleInputChange("height_cm", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="weight_kg">Weight (kg)</Label>
                  <Input
                    id="weight_kg"
                    type="number"
                    value={
                      isEditing
                        ? formData.weight_kg || ""
                        : profile.weight_kg || ""
                    }
                    onChange={(e) =>
                      handleInputChange("weight_kg", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Daily Schedule</CardTitle>
              <CardDescription>
                Your daily routine and meal times
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="wake_up_time">Wake Up Time</Label>
                  <Input
                    id="wake_up_time"
                    type="time"
                    value={
                      isEditing
                        ? formData.wake_up_time || ""
                        : profile.wake_up_time || ""
                    }
                    onChange={(e) =>
                      handleInputChange("wake_up_time", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="sleep_time">Sleep Time</Label>
                  <Input
                    id="sleep_time"
                    type="time"
                    value={
                      isEditing
                        ? formData.sleep_time || ""
                        : profile.sleep_time || ""
                    }
                    onChange={(e) =>
                      handleInputChange("sleep_time", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="work_start">Work Start Time</Label>
                  <Input
                    id="work_start"
                    type="time"
                    value={
                      isEditing
                        ? formData.work_start || ""
                        : profile.work_start || ""
                    }
                    onChange={(e) =>
                      handleInputChange("work_start", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="work_end">Work End Time</Label>
                  <Input
                    id="work_end"
                    type="time"
                    value={
                      isEditing
                        ? formData.work_end || ""
                        : profile.work_end || ""
                    }
                    onChange={(e) =>
                      handleInputChange("work_end", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="breakfast_time">Breakfast Time</Label>
                  <Input
                    id="breakfast_time"
                    type="time"
                    value={
                      isEditing
                        ? formData.breakfast_time || ""
                        : profile.breakfast_time || ""
                    }
                    onChange={(e) =>
                      handleInputChange("breakfast_time", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="lunch_time">Lunch Time</Label>
                  <Input
                    id="lunch_time"
                    type="time"
                    value={
                      isEditing
                        ? formData.lunch_time || ""
                        : profile.lunch_time || ""
                    }
                    onChange={(e) =>
                      handleInputChange("lunch_time", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="dinner_time">Dinner Time</Label>
                  <Input
                    id="dinner_time"
                    type="time"
                    value={
                      isEditing
                        ? formData.dinner_time || ""
                        : profile.dinner_time || ""
                    }
                    onChange={(e) =>
                      handleInputChange("dinner_time", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="workout_time">Workout Time</Label>
                  <Input
                    id="workout_time"
                    type="time"
                    value={
                      isEditing
                        ? formData.workout_time || ""
                        : profile.workout_time || ""
                    }
                    onChange={(e) =>
                      handleInputChange("workout_time", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Your personal preferences and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="routine_flexibility">
                    Routine Flexibility
                  </Label>
                  <Select
                    value={
                      isEditing
                        ? formData.routine_flexibility || ""
                        : profile.routine_flexibility || ""
                    }
                    onValueChange={(value) =>
                      handleInputChange("routine_flexibility", value)
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select flexibility level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="very-rigid">Very Rigid</SelectItem>
                      <SelectItem value="rigid">Rigid</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                      <SelectItem value="very-flexible">
                        Very Flexible
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="workout_type">Workout Type</Label>
                  <Select
                    value={
                      isEditing
                        ? formData.workout_type || ""
                        : profile.workout_type || ""
                    }
                    onValueChange={(value) =>
                      handleInputChange("workout_type", value)
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select workout type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cardio">Cardio</SelectItem>
                      <SelectItem value="strength">
                        Strength Training
                      </SelectItem>
                      <SelectItem value="yoga">Yoga</SelectItem>
                      <SelectItem value="pilates">Pilates</SelectItem>
                      <SelectItem value="swimming">Swimming</SelectItem>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="cycling">Cycling</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="smoking">Smoking Status</Label>
                  <Select
                    value={
                      isEditing ? formData.smoking || "" : profile.smoking || ""
                    }
                    onValueChange={(value) =>
                      handleInputChange("smoking", value)
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select smoking status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="former">Former Smoker</SelectItem>
                      <SelectItem value="current">Current Smoker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="drinking">Drinking Status</Label>
                  <Select
                    value={
                      isEditing
                        ? formData.drinking || ""
                        : profile.drinking || ""
                    }
                    onValueChange={(value) =>
                      handleInputChange("drinking", value)
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select drinking status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="occasionally">Occasionally</SelectItem>
                      <SelectItem value="regularly">Regularly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-red-700">{error}</p>
              <Button variant="outline" size="sm" onClick={clearError}>
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
