import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Activity, 
  Target, 
  TrendingUp, 
  Clock, 
  Droplets, 
  Utensils, 
  Moon, 
  Sun,
  X,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
// Removed groqService import - now using server API

interface YourHealthPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: any;
  healthScore: number;
  selectedPlan?: any;
}

const YourHealthPopup: React.FC<YourHealthPopupProps> = ({
  isOpen,
  onClose,
  userProfile,
  healthScore,
  selectedPlan
}) => {
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userProfile) {
      loadHealthRecommendations();
    }
  }, [isOpen, userProfile, healthScore, selectedPlan]);

  const loadHealthRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/health-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile,
          userInput: `Health recommendations for ${selectedPlan?.title || 'general wellness'}`,
          uploadedFiles: [],
          voiceTranscript: ''
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.healthScore !== undefined) {
          // Transform the health score response into recommendations format
          setRecommendations({
            immediate: data.recommendations?.slice(0, 3) || [
              "Drink 8 glasses of water today",
              "Take a 10-minute walk",
              "Get 7-8 hours of sleep tonight"
            ],
            thisWeek: data.recommendations?.slice(3, 6) || [
              "Establish a consistent sleep schedule",
              "Increase daily water intake",
              "Add 30 minutes of exercise"
            ],
            thisMonth: data.recommendations?.slice(6, 9) || [
              "Complete a full health assessment",
              "Establish a workout routine",
              "Improve dietary habits"
            ],
            longTerm: "Achieve optimal health and wellness through consistent habits and lifestyle improvements",
            planTips: data.strengths?.slice(0, 3) || [
              "Follow your selected plan consistently",
              "Track your progress daily",
              "Adjust based on your results"
            ],
            warningSigns: data.improvements?.slice(0, 3) || [
              "Persistent fatigue or low energy",
              "Difficulty sleeping",
              "Unexplained weight changes"
            ],
            professionalHelp: "Consult a healthcare provider if you experience any warning signs or have concerns about your health"
          });
        } else {
          throw new Error('Invalid response format');
        }
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error loading health recommendations:', error);
      // Use fallback recommendations
      setRecommendations({
        immediate: [
          "Drink 8 glasses of water today",
          "Take a 10-minute walk",
          "Get 7-8 hours of sleep tonight"
        ],
        thisWeek: [
          "Establish a consistent sleep schedule",
          "Increase daily water intake",
          "Add 30 minutes of exercise"
        ],
        thisMonth: [
          "Complete a full health assessment",
          "Establish a workout routine",
          "Improve dietary habits"
        ],
        longTerm: "Achieve optimal health and wellness through consistent habits and lifestyle improvements",
        planTips: [
          "Follow your selected plan consistently",
          "Track your progress daily",
          "Adjust based on your results"
        ],
        warningSigns: [
          "Persistent fatigue or low energy",
          "Difficulty sleeping",
          "Unexplained weight changes"
        ],
        professionalHelp: "Consult a healthcare provider if you experience any warning signs or have concerns about your health"
      });
    } finally {
      setLoading(false);
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const getHealthScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">
                <Heart className="w-6 h-6 mr-2 text-red-500" />
                Your Health Overview
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Comprehensive health analysis and personalized recommendations
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Health Score Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Health Score</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadHealthRecommendations}
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getHealthScoreBgColor(healthScore)} mb-4`}>
                  <span className={`text-3xl font-bold ${getHealthScoreColor(healthScore)}`}>
                    {healthScore}
                  </span>
                </div>
                <h3 className={`text-lg font-semibold ${getHealthScoreColor(healthScore)}`}>
                  {getHealthScoreLabel(healthScore)}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Out of 100 points
                </p>
                <Progress value={healthScore} className="mt-4" />
              </div>
            </CardContent>
          </Card>

          {/* User Profile Data */}
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Activity className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="font-medium">Age:</span>
                    <span className="ml-2">{userProfile?.age || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Target className="w-4 h-4 mr-2 text-green-500" />
                    <span className="font-medium">Height:</span>
                    <span className="ml-2">{userProfile?.height_cm || 'Not specified'} cm</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 mr-2 text-purple-500" />
                    <span className="font-medium">Weight:</span>
                    <span className="ml-2">{userProfile?.weight_kg || 'Not specified'} kg</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Utensils className="w-4 h-4 mr-2 text-orange-500" />
                    <span className="font-medium">Diet:</span>
                    <span className="ml-2">{userProfile?.diet_type || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                    <span className="font-medium">Workout:</span>
                    <span className="ml-2">{userProfile?.workout_time || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Moon className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium">Sleep:</span>
                    <span className="ml-2">{userProfile?.sleep_time || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {userProfile?.health_goals && userProfile.health_goals.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-sm mb-2">Health Goals:</h4>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.health_goals.map((goal: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected Plan */}
          {selectedPlan && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Selected Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{selectedPlan.title}</h3>
                    <p className="text-sm text-gray-600">{selectedPlan.description}</p>
                  </div>
                  <Badge variant="outline">{selectedPlan.difficulty}</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Recommendations */}
          {recommendations && (
            <div className="space-y-4">
              {/* Immediate Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-green-600">
                    <Sun className="w-5 h-5 mr-2" />
                    Immediate Actions
                  </CardTitle>
                  <CardDescription>What you can do today</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recommendations.immediate?.map((action: string, index: number) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center text-sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                        {action}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* This Week's Focus */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-600">
                    <Clock className="w-5 h-5 mr-2" />
                    This Week's Focus
                  </CardTitle>
                  <CardDescription>Priorities for the next 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recommendations.thisWeek?.map((focus: string, index: number) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center text-sm"
                      >
                        <Target className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                        {focus}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* This Month's Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-600">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    This Month's Goals
                  </CardTitle>
                  <CardDescription>What to achieve in 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recommendations.thisMonth?.map((goal: string, index: number) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center text-sm"
                      >
                        <Activity className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" />
                        {goal}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Long-term Vision */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-indigo-600">
                    <Heart className="w-5 h-5 mr-2" />
                    Long-term Vision
                  </CardTitle>
                  <CardDescription>6-month health transformation</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 italic">
                    {recommendations.longTerm}
                  </p>
                </CardContent>
              </Card>

              {/* Warning Signs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-600">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Warning Signs to Watch For
                  </CardTitle>
                  <CardDescription>When to seek professional help</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recommendations.warningSigns?.map((sign: string, index: number) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center text-sm"
                      >
                        <AlertCircle className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
                        {sign}
                      </motion.li>
                    ))}
                  </ul>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <Info className="w-4 h-4 inline mr-1" />
                      <strong>Professional Help:</strong> {recommendations.professionalHelp}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default YourHealthPopup;
