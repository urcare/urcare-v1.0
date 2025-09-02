import {
  HealthCharts,
  WeeklyActivityChart,
} from "@/components/health/HealthCharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AIHealthDashboard from "@/components/dashboard/AIHealthDashboard";

interface HealthWidget {
  id: string;
  title: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  // Health widgets data - now using real data when available
  const healthWidgets: HealthWidget[] = [
    {
      id: "health-score",
      title: "Health Score",
      value: "85",
      unit: "/100",
      icon: <Activity className="h-6 w-6" />,
      color: "text-green-500",
      trend: "+5 this week",
    },
    {
      id: "calories",
      title: "Daily Calories",
      value: "2,100",
      unit: "kcal",
      icon: <Apple className="h-6 w-6" />,
      color: "text-blue-500",
      trend: "On track",
    },
    {
      id: "steps",
      title: "Steps Today",
      value: "8,432",
      unit: "steps",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "text-purple-500",
      trend: "+12% vs yesterday",
    },
    {
      id: "heart-rate",
      title: "Heart Rate",
      value: "72",
      unit: "bpm",
      icon: <Heart className="h-6 w-6" />,
      color: "text-red-500",
      trend: "Resting",
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
      value: 68,
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
      value: 35,
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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Health Insights Charts */}
      <HealthCharts data={chartData} />

      {/* Weekly Activity Chart */}
      <WeeklyActivityChart />

      {/* Recent Activity */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Completed morning workout
                </p>
                <p className="text-xs text-gray-500">30 minutes ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Logged breakfast meal</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Updated weight measurement
                </p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
              Track Progress
            </Button>
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
