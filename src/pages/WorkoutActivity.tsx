import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  ArrowLeft,
  Clock,
  Target,
  Zap,
  Heart,
  Activity,
  Timer,
  SkipForward
} from "lucide-react";
import { toast } from "sonner";

interface WorkoutActivity {
  id: string;
  title: string;
  duration: string;
  type: string;
  time: string;
  icon?: string;
  isCoachPick?: boolean;
  description?: string;
  instructions?: string[];
  benefits?: string[];
}

const WorkoutActivityPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activity = location.state?.activity as WorkoutActivity;
  const activityId = location.state?.activityId;

  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Parse duration (e.g., "10-12 min" -> 12 minutes)
  const parseDuration = (duration: string): number => {
    const match = duration.match(/(\d+)-?(\d+)?/);
    if (match) {
      const max = match[2] ? parseInt(match[2]) : parseInt(match[1]);
      return max * 60; // Convert to seconds
    }
    return 600; // Default 10 minutes
  };

  useEffect(() => {
    if (activity) {
      const totalSeconds = parseDuration(activity.duration);
      setTimeLeft(totalSeconds);
    }
  }, [activity]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
    toast.success("Workout started! Let's go! 💪");
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);
    toast.info("Workout paused");
  };

  const handleResume = () => {
    setIsRunning(true);
    setIsPaused(false);
    toast.success("Workout resumed!");
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsCompleted(false);
    setCurrentStep(0);
    if (activity) {
      const totalSeconds = parseDuration(activity.duration);
      setTimeLeft(totalSeconds);
    }
    toast.info("Workout reset");
  };

  const handleComplete = () => {
    const timeSpent = parseDuration(activity.duration) - timeLeft;
    
    // Store completion data in localStorage
    const completionData = {
      activityId: activity.id,
      timeSpent,
      completedAt: new Date().toISOString(),
      activityTitle: activity.title
    };
    
    // Get existing completions or create new array
    const existingCompletions = JSON.parse(localStorage.getItem('workoutCompletions') || '[]');
    existingCompletions.push(completionData);
    localStorage.setItem('workoutCompletions', JSON.stringify(existingCompletions));
    
    toast.success("Great job! Workout completed! 🎉");
    navigate("/workout-dashboard");
  };

  const handleSkip = () => {
    toast.info("Activity skipped");
    navigate("/workout-dashboard");
  };

  const progress = activity ? ((parseDuration(activity.duration) - timeLeft) / parseDuration(activity.duration)) * 100 : 0;

  if (!activity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">No Activity Selected</h2>
          <Button onClick={() => navigate("/workout-dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/workout-dashboard")}
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="text-right">
            <div className="text-sm text-slate-500">Current Activity</div>
            <div className="text-lg font-semibold text-slate-800">{activity.type}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Activity Info & Timer */}
          <div className="space-y-6">
            {/* Activity Card */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-10 h-10 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  {activity.title}
                </CardTitle>
                <CardDescription className="text-slate-600 text-lg">
                  {activity.description}
                </CardDescription>
                {activity.isCoachPick && (
                  <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 text-sm px-3 py-1 rounded-full">
                    ⭐ Coach Pick
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <Clock className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                    <div className="text-sm text-slate-600">Duration</div>
                    <div className="font-bold text-slate-800">{activity.duration}</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <Target className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                    <div className="text-sm text-slate-600">Type</div>
                    <div className="font-bold text-slate-800">{activity.type}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timer Card */}
            <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center justify-center gap-2">
                  <Timer className="w-5 h-5 text-blue-600" />
                  Workout Timer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Timer Display */}
                <div className="text-center">
                  <div className="text-6xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
                    {formatTime(timeLeft)}
                  </div>
                  <Progress value={progress} className="w-full h-3 mb-4" />
                  <div className="text-sm text-slate-600">
                    {Math.round(progress)}% Complete
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex justify-center gap-3">
                  {!isRunning && !isCompleted && (
                    <Button
                      onClick={handleStart}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start Workout
                    </Button>
                  )}
                  
                  {isRunning && (
                    <Button
                      onClick={handlePause}
                      variant="outline"
                      className="border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3"
                    >
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </Button>
                  )}
                  
                  {isPaused && (
                    <Button
                      onClick={handleResume}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Resume
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-3"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>

                {/* Skip Button */}
                <div className="text-center">
                  <Button
                    onClick={handleSkip}
                    variant="ghost"
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <SkipForward className="w-4 h-4 mr-2" />
                    Skip Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Character Animation & Instructions */}
          <div className="space-y-6">
            {/* Character Animation Area */}
            <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  Workout Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {/* Character Animation Placeholder */}
                <div className="w-64 h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden">
                  <div className="text-8xl animate-bounce">
                    {activity.type === 'Warm-up' ? '🏃‍♂️' :
                     activity.type === 'Flexibility' ? '🧘‍♀️' :
                     activity.type === 'Light cardio' ? '🚶‍♂️' :
                     activity.type === 'Full body' ? '💪' :
                     activity.type === 'Recovery' ? '😌' : '🏃‍♂️'}
                  </div>
                  {isRunning && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  )}
                </div>
                
                <div className="text-lg font-semibold text-slate-800 mb-2">
                  {isRunning ? "Keep Going! 💪" : 
                   isPaused ? "Take a Break" :
                   isCompleted ? "Amazing Work! 🎉" : "Ready to Start?"}
                </div>
                <div className="text-slate-600">
                  {isRunning ? "Focus on your form and breathing" :
                   isPaused ? "Press resume when you're ready" :
                   isCompleted ? "You've completed this activity!" : "Click start when you're ready"}
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activity.instructions?.map((instruction, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="text-slate-700">{instruction}</div>
                    </div>
                  )) || (
                    <div className="text-slate-600 text-center py-4">
                      Follow your natural rhythm and listen to your body. 
                      Maintain good form throughout the exercise.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            {activity.benefits && (
              <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {activity.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-slate-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Completion Button */}
        {isCompleted && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
            <Button
              onClick={handleComplete}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 animate-pulse"
            >
              <CheckCircle className="w-6 h-6 mr-2" />
              Mark as Completed
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutActivityPage;
