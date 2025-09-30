import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Target, 
  TrendingUp, 
  Clock, 
  Zap, 
  Heart, 
  BarChart3,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Calendar,
  Award
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
  completed?: boolean;
  timeSpent?: number;
}

interface DaySummary {
  totalTime: string;
  focus: string;
  readiness: string;
  readinessColor: string;
}

interface CheckDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: WorkoutActivity[];
  daySummary: DaySummary;
  completedActivities: number;
  totalActivities: number;
  energyLevel: number;
  recommendations: string[];
  missingActivities: string[];
  weeklyProgress?: any[];
}

export const CheckDashboardModal: React.FC<CheckDashboardModalProps> = ({
  isOpen,
  onClose,
  activities,
  daySummary,
  completedActivities,
  totalActivities,
  energyLevel,
  recommendations,
  missingActivities,
  weeklyProgress = []
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getDayName = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[currentTime.getDay()];
  };

  const getEnergyLevelColor = (level: number) => {
    if (level >= 4) return "text-green-600";
    if (level >= 3) return "text-amber-600";
    if (level >= 2) return "text-orange-600";
    return "text-red-600";
  };

  const getEnergyLevelLabel = (level: number) => {
    if (level >= 4) return "High Energy";
    if (level >= 3) return "Good Energy";
    if (level >= 2) return "Moderate Energy";
    return "Low Energy";
  };

  const progressPercentage = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 border-0 shadow-2xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            {activities.length > 0 ? `${activities[0]?.time || getDayName()}'s Workout Plan` : 'Check Dashboard'}
          </DialogTitle>
          <DialogDescription className="text-slate-600 text-lg">
            Your personalized health insights and recommendations for {getDayName()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Current Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Progress Card */}
            <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Today's Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-800 mb-2">
                    {completedActivities}/{totalActivities}
                  </div>
                  <div className="text-sm text-slate-600 mb-3">Activities Completed</div>
                  <Progress value={progressPercentage} className="w-full h-3" />
                  <div className="text-sm text-slate-600 mt-2">
                    {Math.round(progressPercentage)}% Complete
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Energy Level Card */}
            <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  Energy Level
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${getEnergyLevelColor(energyLevel)}`}>
                    {energyLevel}/5
                  </div>
                  <div className="text-sm text-slate-600 mb-3">{getEnergyLevelLabel(energyLevel)}</div>
                  <div className="flex justify-center">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full mx-1 ${
                          i < energyLevel ? 'bg-yellow-500' : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time Card */}
            <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  Total Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-800 mb-2">
                    {daySummary.totalTime}
                  </div>
                  <div className="text-sm text-slate-600">Workout Time</div>
                  <div className="text-xs text-slate-500 mt-2">
                    Focus: {daySummary.focus}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activities Status */}
          <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Activities Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 ${
                      activity.completed
                        ? 'bg-green-50 border-green-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.completed ? 'bg-green-100' : 'bg-slate-100'
                      }`}>
                        {activity.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <div className="w-3 h-3 bg-slate-400 rounded-full" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{activity.title}</div>
                        <div className="text-sm text-slate-600">
                          {activity.time} • {activity.duration}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {activity.completed && (
                        <Badge className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      )}
                      {activity.isCoachPick && (
                        <Badge className="bg-amber-100 text-amber-800">
                          ⭐ Coach Pick
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="text-slate-700">{recommendation}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Missing Activities */}
          {missingActivities.length > 0 && (
            <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  What You're Missing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {missingActivities.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="text-slate-700">{item}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Weekly Progress Chart */}
          <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyProgress.length > 0 ? (
                  <div className="space-y-3">
                    {weeklyProgress.map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                            {day.day}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-700">
                              {day.completedCount}/{day.totalCount} activities
                            </div>
                            <div className="text-xs text-slate-500">
                              {day.completionRate.toFixed(0)}% complete
                            </div>
                          </div>
                        </div>
                        <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                            style={{ width: `${day.completionRate}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-32 bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-500 text-sm">No progress data available</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              toast.success("Keep up the great work! 💪");
              onClose();
            }}
            className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-6"
          >
            <Award className="w-4 h-4 mr-2" />
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

