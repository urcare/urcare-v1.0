import { MobileNavigation } from "@/components/MobileNavigation";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import {
  Activity,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Dumbbell,
  Flame,
  Pause,
  Play,
  Target,
  Timer,
  Trophy,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface Exercise {
  id: string;
  name: string;
  description: string;
  instructions: string[];
  sets: number;
  reps: string;
  duration?: string;
  restTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  equipment: string[];
  muscleGroups: string[];
  muscleImpact: {
    primary: string[];
    secondary: string[];
    intensity: { [muscle: string]: number }; // 1-10 scale
  };
  image: string;
  videoUrl?: string;
  tips: string[];
  variations?: string[];
}

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: string;
  frequency: string;
  goals: string[];
  exercises: Exercise[];
  totalDuration: number;
  caloriesBurned: number;
  createdAt: string;
  isCustom: boolean;
}

interface MuscleGroup {
  name: string;
  color: string;
  intensity: number;
}

const Workout: React.FC = () => {
  const { user, profile } = useAuth();
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("all");
  const [showMuscleAnimation, setShowMuscleAnimation] = useState(false);

  // Sample muscle groups with colors
  const muscleGroups: MuscleGroup[] = [
    { name: "Chest", color: "bg-red-500", intensity: 0 },
    { name: "Back", color: "bg-blue-500", intensity: 0 },
    { name: "Shoulders", color: "bg-progress-fill", intensity: 0 },
    { name: "Biceps", color: "bg-yellow-500", intensity: 0 },
    { name: "Triceps", color: "bg-purple-500", intensity: 0 },
    { name: "Abs", color: "bg-pink-500", intensity: 0 },
    { name: "Legs", color: "bg-indigo-500", intensity: 0 },
    { name: "Glutes", color: "bg-orange-500", intensity: 0 },
  ];

  // Sample workout plans
  const samplePlans: WorkoutPlan[] = [
    {
      id: "1",
      name: "AI Custom Strength Plan",
      description:
        "Personalized strength training based on your fitness level and goals",
      duration: "45 minutes",
      difficulty: "Intermediate",
      frequency: "3x per week",
      goals: ["Build Muscle", "Increase Strength", "Improve Endurance"],
      exercises: [
        {
          id: "ex1",
          name: "Push-ups",
          description:
            "Classic bodyweight exercise for chest, shoulders, and triceps",
          instructions: [
            "Start in a plank position with hands slightly wider than shoulders",
            "Lower your body until chest nearly touches the floor",
            "Push back up to starting position",
            "Keep core tight throughout the movement",
          ],
          sets: 3,
          reps: "8-12",
          restTime: "60 seconds",
          difficulty: "Beginner",
          equipment: ["Bodyweight"],
          muscleGroups: ["Chest", "Shoulders", "Triceps"],
          muscleImpact: {
            primary: ["Chest", "Triceps"],
            secondary: ["Shoulders", "Core"],
            intensity: { Chest: 9, Triceps: 8, Shoulders: 6, Core: 5 },
          },
          image:
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          tips: [
            "Keep your body in a straight line",
            "Don't let your hips sag or pike up",
            "Breathe out as you push up",
          ],
        },
        {
          id: "ex2",
          name: "Squats",
          description:
            "Fundamental lower body exercise targeting legs and glutes",
          instructions: [
            "Stand with feet shoulder-width apart",
            "Lower your body as if sitting back into a chair",
            "Keep knees behind toes and chest up",
            "Return to starting position",
          ],
          sets: 3,
          reps: "12-15",
          restTime: "90 seconds",
          difficulty: "Beginner",
          equipment: ["Bodyweight"],
          muscleGroups: ["Legs", "Glutes"],
          muscleImpact: {
            primary: ["Legs", "Glutes"],
            secondary: ["Core"],
            intensity: { Legs: 9, Glutes: 8, Core: 4 },
          },
          image:
            "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=300&fit=crop",
          tips: [
            "Keep weight on your heels",
            "Don't let knees cave inward",
            "Go as low as comfortable",
          ],
        },
        {
          id: "ex3",
          name: "Plank",
          description: "Isometric core strengthening exercise",
          instructions: [
            "Start in a push-up position",
            "Lower to forearms, keeping body straight",
            "Hold position while engaging core",
            "Breathe normally throughout",
          ],
          sets: 3,
          reps: "30-60 seconds",
          restTime: "60 seconds",
          difficulty: "Beginner",
          equipment: ["Bodyweight"],
          muscleGroups: ["Core", "Shoulders"],
          muscleImpact: {
            primary: ["Core"],
            secondary: ["Shoulders", "Back"],
            intensity: { Core: 9, Shoulders: 6, Back: 4 },
          },
          image:
            "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
          tips: [
            "Keep hips level with shoulders",
            "Engage your core muscles",
            "Don't hold your breath",
          ],
        },
      ],
      totalDuration: 45,
      caloriesBurned: 300,
      createdAt: new Date().toISOString(),
      isCustom: true,
    },
  ];

  useEffect(() => {
    loadWorkoutPlans();
  }, [user]);

  const loadWorkoutPlans = async () => {
    try {
      // Only show loading if we don't have plans yet
      if (workoutPlans.length === 0) {
        setLoading(true);
      }
      // Simulate API call - in real app, this would fetch from backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setWorkoutPlans(samplePlans);
      if (samplePlans.length > 0) {
        setSelectedPlan(samplePlans[0]);
      }
    } catch (error) {
      console.error("Error loading workout plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateCustomPlan = async () => {
    // This would call an AI service to generate a custom plan
    console.log("Generating custom AI workout plan...");
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  const startWorkout = () => {
    if (selectedPlan && selectedPlan.exercises.length > 0) {
      setCurrentExercise(selectedPlan.exercises[0]);
      setIsWorkoutActive(true);
      setCurrentSet(1);
      setCompletedExercises([]);
    }
  };

  const nextExercise = () => {
    if (!selectedPlan || !currentExercise) return;

    const currentIndex = selectedPlan.exercises.findIndex(
      (ex) => ex.id === currentExercise.id
    );
    if (currentIndex < selectedPlan.exercises.length - 1) {
      setCurrentExercise(selectedPlan.exercises[currentIndex + 1]);
      setCurrentSet(1);
    } else {
      // Workout complete
      setIsWorkoutActive(false);
      setCurrentExercise(null);
    }
  };

  const completeSet = () => {
    if (!currentExercise) return;

    if (currentSet < currentExercise.sets) {
      setCurrentSet(currentSet + 1);
    } else {
      setCompletedExercises([...completedExercises, currentExercise.id]);
      nextExercise();
    }
  };

  const updateMuscleIntensity = (exercise: Exercise) => {
    const updatedMuscles = muscleGroups.map((muscle) => ({
      ...muscle,
      intensity: exercise.muscleImpact.intensity[muscle.name] || 0,
    }));
    return updatedMuscles;
  };

  if (loading) {
    return (
      <ThemeWrapper>
        <MobileNavigation>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your workout plans...</p>
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
          <div className="bg-gradient-to-br from-blue-600 to-purple-800 rounded-b-3xl px-6 py-8 text-white">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Your Workout Hub</h1>
              <p className="text-blue-100 mb-6">
                AI-powered custom workout plans tailored to your fitness goals
              </p>
              <Button
                onClick={generateCustomPlan}
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-full"
              >
                <Zap className="w-5 h-5 mr-2" />
                Generate AI Plan
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="px-4">
            <div className="grid grid-cols-3 gap-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-600">320</p>
                  <p className="text-sm text-gray-600">Calories</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <Timer className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">45m</p>
                  <p className="text-sm text-gray-600">Duration</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-600">3</p>
                  <p className="text-sm text-gray-600">Streak</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Workout Plans */}
          <div className="px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Your Workout Plans
            </h2>
            <div className="space-y-4">
              {workoutPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`border-0 shadow-sm cursor-pointer transition-all ${
                    selectedPlan?.id === plan.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=200&fit=crop"
                      alt={plan.name}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-gray-700">
                        {plan.difficulty}
                      </Badge>
                    </div>
                    {plan.isCustom && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-blue-500 text-white">
                          <Zap className="w-3 h-3 mr-1" />
                          AI Generated
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {plan.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {plan.description}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {plan.duration}
                      </span>
                      <span className="flex items-center">
                        <Flame className="w-4 h-4 mr-1" />
                        {plan.caloriesBurned} cal
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {plan.frequency}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {plan.goals.map((goal) => (
                        <Badge
                          key={goal}
                          variant="secondary"
                          className="text-xs"
                        >
                          {goal}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlan(plan);
                        startWorkout();
                      }}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Workout
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Active Workout Modal */}
          {isWorkoutActive && currentExercise && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Activity className="w-5 h-5" />
                    {currentExercise.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {currentExercise.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Exercise Image */}
                  <div className="relative">
                    <img
                      src={currentExercise.image}
                      alt={currentExercise.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2"
                      onClick={() =>
                        setShowMuscleAnimation(!showMuscleAnimation)
                      }
                    >
                      <Target className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Muscle Impact Visualization */}
                  {showMuscleAnimation && (
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Muscle Impact</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {updateMuscleIntensity(currentExercise).map(
                          (muscle) => (
                            <div key={muscle.name} className="text-center">
                              <div
                                className={`w-8 h-8 rounded-full mx-auto mb-1 ${
                                  muscle.color
                                } ${
                                  muscle.intensity > 0
                                    ? "animate-pulse"
                                    : "opacity-30"
                                }`}
                                style={{
                                  opacity:
                                    muscle.intensity > 0
                                      ? muscle.intensity / 10
                                      : 0.3,
                                  transform:
                                    muscle.intensity > 0
                                      ? `scale(${1 + muscle.intensity / 20})`
                                      : "scale(1)",
                                }}
                              />
                              <p className="text-xs text-gray-600">
                                {muscle.name}
                              </p>
                              <p className="text-xs font-semibold">
                                {muscle.intensity}/10
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Set Progress */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Set {currentSet} of {currentExercise.sets}
                    </p>
                    <Progress
                      value={(currentSet / currentExercise.sets) * 100}
                      className="mt-2"
                    />
                  </div>

                  {/* Exercise Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold">Reps/Duration</p>
                      <p className="text-gray-600">{currentExercise.reps}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Rest Time</p>
                      <p className="text-gray-600">
                        {currentExercise.restTime}
                      </p>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div>
                    <h4 className="font-semibold mb-2">Instructions</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                      {currentExercise.instructions.map(
                        (instruction, index) => (
                          <li key={index}>{instruction}</li>
                        )
                      )}
                    </ol>
                  </div>

                  {/* Tips */}
                  <div>
                    <h4 className="font-semibold mb-2">Tips</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      {currentExercise.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsWorkoutActive(false)}
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                    <Button
                      className="flex-1 bg-accent hover:bg-accent/90 text-foreground"
                      onClick={completeSet}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete Set
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Exercise Library */}
          <div className="px-4 pb-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Exercise Library
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Dumbbell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="font-medium">
                    Browse exercises by muscle group
                  </p>
                  <p className="text-sm">
                    Tap to see detailed instructions and muscle impact
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </MobileNavigation>
    </ThemeWrapper>
  );
};

export default Workout;
