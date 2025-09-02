import {
  HealthCharts,
  WeeklyActivityChart,
} from "@/components/health/HealthCharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Apple,
  Bell,
  BookOpen,
  Calendar,
  CreditCard,
  Dumbbell,
  Heart,
  Home,
  Menu,
  Settings,
  Target,
  TrendingUp,
  User,
  X,
  Brain,
  Zap,
  Droplets,
  Utensils,
  Clock,
  Map,
  Footprints,
  Flame,
  Target as TargetIcon,
  BarChart3,
  Play,
  Pause,
  Square,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AIHealthDashboard from "@/components/dashboard/AIHealthDashboard";
import { FitnessTracker } from "@/components/fitness/FitnessTracker";

interface HealthWidget {
  id: string;
  title: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  color: string;
  trend?: string;
  progress?: number;
}

interface NutritionIntake {
  type: string;
  current: number;
  target: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [isTracking, setIsTracking] = useState(false);

  // Real-time fitness data (would come from FitnessTrackingService)
  const [fitnessData, setFitnessData] = useState({
    steps: 8432,
    distance: 6.2,
    calories: 420,
    activeMinutes: 45,
    heartRate: 72,
    waterIntake: 1800,
    sleepHours: 7.5,
    stressLevel: 35,
  });

  // Health widgets data with real-time updates
  const healthWidgets: HealthWidget[] = [
    {
      id: "health-score",
      title: "Health Score",
      value: "85",
      unit: "/100",
      icon: <Activity className="h-6 w-6" />,
      color: "text-green-500",
      trend: "+5 this week",
      progress: 85,
    },
    {
      id: "calories",
      title: "Calories Burned",
      value: fitnessData.calories.toString(),
      unit: "kcal",
      icon: <Flame className="h-6 w-6" />,
      color: "text-orange-500",
      trend: "On track",
      progress: 70,
    },
    {
      id: "steps",
      title: "Steps Today",
      value: fitnessData.steps.toLocaleString(),
      unit: "steps",
      icon: <Footprints className="h-6 w-6" />,
      color: "text-purple-500",
      trend: "+12% vs yesterday",
      progress: 84,
    },
    {
      id: "heart-rate",
      title: "Heart Rate",
      value: fitnessData.heartRate.toString(),
      unit: "bpm",
      icon: <Heart className="h-6 w-6" />,
      color: "text-red-500",
      trend: "Resting",
      progress: 60,
    },
  ];

  // Nutrition intake tracking
  const nutritionIntakes: NutritionIntake[] = [
    {
      type: "Water",
      current: fitnessData.waterIntake,
      target: 2500,
      unit: "ml",
      icon: <Droplets className="h-5 w-5" />,
      color: "text-blue-500",
    },
    {
      type: "Calories",
      current: 1850,
      target: 2100,
      unit: "kcal",
      icon: <Utensils className="h-5 w-5" />,
      color: "text-green-500",
    },
    {
      type: "Protein",
      current: 85,
      target: 120,
      unit: "g",
      icon: <TargetIcon className="h-5 w-5" />,
      color: "text-purple-500",
    },
    {
      type: "Carbs",
      current: 220,
      target: 250,
      unit: "g",
      icon: <Apple className="h-5 w-5" />,
      color: "text-yellow-500",
    },
  ];

  // Chart data for health insights
  const chartData = [
    {
      label: "Sleep Quality",
      value: 85,
      unit: "%",
      trend: "up" as const,
      change: "+5%",
      color: "bg-indigo-500",
    },
    {
      label: "Water Intake",
      value: Math.round((fitnessData.waterIntake / 2500) * 100),
      unit: "%",
      trend: "down" as const,
      change: "-3%",
      color: "bg-blue-500",
    },
    {
      label: "Exercise Consistency",
      value: 92,
      unit: "%",
      trend: "up" as const,
      change: "+8%",
      color: "bg-green-500",
    },
    {
      label: "Stress Level",
      value: fitnessData.stressLevel,
      unit: "%",
      trend: "down" as const,
      change: "-12%",
      color: "bg-yellow-500",
    },
  ];

  const menuItems = [
    {
      id: "profile",
      label: "Profile",
      icon: <User className="h-5 w-5" />,
      action: () => navigate("/profile"),
    },
    {
      id: "subscription",
      label: "Subscription",
      icon: <CreditCard className="h-5 w-5" />,
      action: () => navigate("/subscription"),
    },
    {
      id: "health-plan",
      label: "Health Plan",
      icon: <Target className="h-5 w-5" />,
      action: () => navigate("/health-plan"),
    },
    {
      id: "ai-health",
      label: "AI Health Assistant",
      icon: <Brain className="h-5 w-5" />,
      action: () => setActiveTab("ai-health"),
    },
    {
      id: "progress",
      label: "Progress",
      icon: <TrendingUp className="h-5 w-5" />,
      action: () => navigate("/progress"),
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: <Calendar className="h-5 w-5" />,
      action: () => navigate("/calendar"),
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      action: () => navigate("/notifications"),
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      action: () => navigate("/settings"),
    },
    {
      id: "help",
      label: "Help & Support",
      icon: <BookOpen className="h-5 w-5" />,
      action: () => navigate("/help"),
    },
  ];

  const bottomTabs = [
    { id: "home", label: "Home", icon: <Home className="h-5 w-5" /> },
    { id: "health", label: "Health", icon: <Heart className="h-5 w-5" /> },
    { id: "fitness", label: "Fitness", icon: <Dumbbell className="h-5 w-5" /> },
    {
      id: "nutrition",
      label: "Nutrition",
      icon: <Apple className="h-5 w-5" />,
    },
    { id: "ai-health", label: "AI Health", icon: <Brain className="h-5 w-5" /> },
  ];

  useEffect(() => {
    if (!profile) {
      navigate("/onboarding");
    }
  }, [profile, navigate]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setFitnessData(prev => ({
        ...prev,
        steps: prev.steps + Math.floor(Math.random() * 10),
        calories: prev.calories + Math.floor(Math.random() * 5),
        activeMinutes: prev.activeMinutes + Math.floor(Math.random() * 2),
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuAction = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

  if (!profile) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const renderHomeTab = () => (
    <div className="space-y-6">
      {/* Health Score Overview */}
      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Your Health Score</h3>
              <p className="text-green-100 text-sm">
                Based on your recent activity
              </p>
            </div>
            <Activity className="h-8 w-8 text-green-200" />
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold mb-2">85</div>
            <div className="text-green-100 text-sm">Excellent</div>
            <div className="w-full bg-green-400/30 rounded-full h-2 mt-3">
              <div
                className="bg-white h-2 rounded-full"
                style={{ width: "85%" }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fitness Tracking Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-xl">
            <Activity className="h-6 w-6 text-blue-600" />
            <span>Fitness Tracking</span>
            <Badge variant={isTracking ? "default" : "secondary"} className="ml-auto">
              {isTracking ? "Active" : "Inactive"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Real-time Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {fitnessData.steps.toLocaleString()}
              </div>
              <div className="text-sm text-blue-700 font-medium">Steps</div>
              <div className="text-xs text-blue-600 mt-1">Goal: 10,000</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {fitnessData.distance.toFixed(1)}
              </div>
              <div className="text-sm text-green-700 font-medium">Km</div>
              <div className="text-xs text-green-600 mt-1">Today</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">
                {fitnessData.calories}
              </div>
              <div className="text-sm text-orange-700 font-medium">Calories</div>
              <div className="text-xs text-orange-600 mt-1">Burned</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {fitnessData.activeMinutes}
              </div>
              <div className="text-sm text-purple-700 font-medium">Minutes</div>
              <div className="text-xs text-purple-600 mt-1">Active</div>
            </div>
          </div>

          {/* Step Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Daily Steps Progress</span>
              <span className="text-sm text-gray-500">
                {fitnessData.steps.toLocaleString()} / 10,000
              </span>
            </div>
            <Progress value={(fitnessData.steps / 10000) * 100} className="h-3" />
            <div className="mt-2 text-xs text-gray-500">
              {fitnessData.steps >= 10000 ? 'Goal achieved! 🎉' : `${Math.round(100 - (fitnessData.steps / 10000) * 100)}% remaining`}
            </div>
          </div>

          {/* Tracking Controls */}
          <div className="flex space-x-3">
            {!isTracking ? (
              <Button
                onClick={() => setIsTracking(true)}
                className="flex-1 bg-green-500 hover:bg-green-600"
                size="lg"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Tracking
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => setIsTracking(false)}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
                <Button
                  onClick={() => setIsTracking(false)}
                  variant="destructive"
                  className="flex-1"
                  size="lg"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Nutrition & Intake Tracking */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl">
            <Utensils className="h-6 w-6 text-green-600" />
            <span>Nutrition & Intake</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nutritionIntakes.map((intake) => (
              <div key={intake.type} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg bg-white ${intake.color}`}>
                      {intake.icon}
                    </div>
                    <span className="font-medium text-gray-700">{intake.type}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {intake.current}/{intake.target} {intake.unit}
                  </span>
                </div>
                <Progress 
                  value={(intake.current / intake.target) * 100} 
                  className="h-2" 
                />
                <div className="mt-2 text-xs text-gray-500">
                  {Math.round((intake.current / intake.target) * 100)}% of daily goal
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Widgets Grid */}
      <div className="grid grid-cols-2 gap-4">
        {healthWidgets.map((widget) => (
          <Card
            key={widget.id}
            className="border-0 shadow-md hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-2 rounded-lg bg-gray-100 ${widget.color}`}
                >
                  {widget.icon}
                </div>
                <span className="text-xs text-gray-500">
                  {widget.trend}
                </span>
              </div>

              <div className="mb-1">
                <span className="text-2xl font-bold text-gray-800">
                  {widget.value}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  {widget.unit}
                </span>
              </div>

              <p className="text-sm text-gray-600">{widget.title}</p>
              
              {widget.progress && (
                <div className="mt-2">
                  <Progress value={widget.progress} className="h-1" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Health Insights Charts */}
      <HealthCharts data={chartData} />

      {/* Weekly Activity Chart */}
      <WeeklyActivityChart />

      {/* Quick Actions */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setActiveTab("ai-health")}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Health Assistant
            </Button>
            <Button
              onClick={() => navigate("/progress")}
              variant="outline"
              className="border-green-200 text-green-600 hover:bg-green-50"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFitnessTab = () => (
    <div className="space-y-6">
      <FitnessTracker />
    </div>
  );

  const renderNutritionTab = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl">
            <Apple className="h-6 w-6 text-green-600" />
            <span>Nutrition Dashboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Daily Nutrition Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Today's Intake</h3>
              {nutritionIntakes.map((intake) => (
                <div key={intake.type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-white ${intake.color}`}>
                      {intake.icon}
                    </div>
                    <span className="font-medium text-gray-700">{intake.type}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">
                      {intake.current} / {intake.target}
                    </div>
                    <div className="text-sm text-gray-500">{intake.unit}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Meal Planning */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Meal Planning</h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <div className="font-medium text-green-800">Breakfast</div>
                  <div className="text-sm text-green-600">Oats with fruits & nuts</div>
                  <div className="text-xs text-green-500 mt-1">8:00 AM • 350 kcal</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="font-medium text-blue-800">Lunch</div>
                  <div className="text-sm text-blue-600">Grilled chicken salad</div>
                  <div className="text-xs text-blue-500 mt-1">1:00 PM • 450 kcal</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <div className="font-medium text-purple-800">Dinner</div>
                  <div className="text-sm text-purple-600">Salmon with vegetables</div>
                  <div className="text-xs text-purple-500 mt-1">7:00 PM • 400 kcal</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAIHealthTab = () => (
    <AIHealthDashboard />
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "ai-health":
        return renderAIHealthTab();
      case "fitness":
        return renderFitnessTab();
      case "nutrition":
        return renderNutritionTab();
      case "home":
      default:
        return renderHomeTab();
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      {/* Header */}
      <div className="relative z-20 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors"
          >
            <Menu className="h-6 w-6 text-green-600" />
          </button>

          <div className="text-center">
            <h1 className="text-lg font-semibold text-gray-800">UrCare</h1>
            <p className="text-xs text-gray-500">
              Welcome back, {profile.full_name?.split(" ")[0]}
            </p>
          </div>

          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {profile.full_name?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Animated Menu Overlay */}
      <div
        className={`fixed inset-0 z-30 transition-opacity duration-300 ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={toggleMenu}
        />

        {/* Menu Panel */}
        <div
          className={`absolute left-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Menu Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Menu</h2>
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {profile.full_name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-white font-semibold">{profile.full_name}</p>
                <p className="text-green-100 text-sm">Premium Member</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuAction(item.action)}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-colors group"
              >
                <div className="text-green-600 group-hover:text-green-700">
                  {item.icon}
                </div>
                <span className="text-gray-700 font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="p-4">
          {renderTabContent()}
        </div>
      </div>

      {/* Glassy Bottom Menu */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <div className="bg-white/80 backdrop-blur-md border-t border-gray-200/50 mx-4 mb-4 rounded-2xl shadow-lg">
          <div className="flex items-center justify-around p-2">
            {bottomTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center space-y-1 p-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? "bg-green-500 text-white shadow-md"
                    : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                }`}
              >
                {tab.icon}
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
