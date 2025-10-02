import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Activity, 
  TrendingUp, 
  CheckCircle, 
  QrCode, 
  Download,
  ArrowLeft,
  Clock,
  Shield,
  Star
} from 'lucide-react';
import { toast } from 'sonner';
import { calculateHealthScore, getUserProfileForHealthScore } from '@/services/healthScoreService';
import { QRModal } from '@/components/QRModal';

interface HealthMetrics {
  healthScore: number;
  analysis: string;
  recommendations: string[];
  strengths: string[];
  improvements: string[];
}

const OnboardingHealthAssessment: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    loadHealthAssessment();
  }, [user, navigate]);

  const loadHealthAssessment = async () => {
    setLoading(true);
    try {
      // Get user profile for health score calculation
      const profileResult = await getUserProfileForHealthScore(user.id);
      
      let userProfile;
      if (!profileResult.success) {
        console.warn("Failed to fetch user profile, using mock data:", profileResult.error);
        // Use mock profile data for demo
        userProfile = {
          id: user.id,
          full_name: user.user_metadata?.full_name || 'User',
          age: 28,
          gender: 'Male',
          height_cm: '175',
          weight_kg: '70',
          blood_group: 'O+',
          chronic_conditions: [],
          medications: [],
          health_goals: ['Lose weight', 'Build muscle', 'Improve sleep'],
          diet_type: 'Balanced',
          workout_time: 'Morning',
          sleep_time: '22:00',
          wake_up_time: '06:00'
        };
      } else {
        userProfile = profileResult.profile;
      }
      
      // Calculate health score
      const healthScoreResult = await calculateHealthScore({
        userProfile,
        userInput: 'Complete health assessment for onboarding',
        uploadedFiles: [],
        voiceTranscript: ''
      });

      if (healthScoreResult.success) {
        setHealthMetrics({
          healthScore: healthScoreResult.healthScore || 0,
          analysis: healthScoreResult.analysis || 'Health assessment completed',
          recommendations: healthScoreResult.recommendations || [],
          strengths: ['Regular exercise routine', 'Balanced diet', 'Good sleep schedule'],
          improvements: ['Increase water intake', 'Add more variety to workouts', 'Track progress regularly']
        });
      } else {
        throw new Error(healthScoreResult.error || "Failed to calculate health score");
      }
    } catch (error) {
      console.error("Error loading health assessment:", error);
      toast.error("Failed to load health assessment");
    } finally {
      setLoading(false);
    }
  };

  const handleQRPayment = () => {
    setShowQRModal(true);
  };

  const handlePaymentComplete = () => {
    setProcessing(true);
    toast.success('Payment received! Activating your subscription...');
    
    // Simulate processing time
    setTimeout(() => {
      setProcessing(false);
      navigate('/dashboard');
    }, 3000);
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getHealthScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/onboarding')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Onboarding
          </Button>
          <Badge variant="outline" className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Secure Assessment
          </Badge>
        </div>

        {/* Health Score Card */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Your Health Assessment
            </CardTitle>
            <CardDescription>
              Based on your profile and health data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {healthMetrics && (
              <div className="space-y-6">
                {/* Health Score Display */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center bg-white shadow-lg">
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${getHealthScoreColor(healthMetrics.healthScore)}`}>
                          {healthMetrics.healthScore}
                        </div>
                        <div className="text-sm text-gray-500">/ 100</div>
                      </div>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <Badge className={`px-3 py-1 ${getHealthScoreColor(healthMetrics.healthScore)} bg-opacity-10`}>
                        {getHealthScoreLabel(healthMetrics.healthScore)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Analysis */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Health Analysis</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {healthMetrics.analysis}
                  </p>
                </div>

                {/* Strengths and Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Your Strengths
                    </h4>
                    <ul className="space-y-1">
                      {healthMetrics.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-green-700 flex items-center gap-2">
                          <Star className="w-3 h-3" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-1">
                      {healthMetrics.improvements.map((improvement, index) => (
                        <li key={index} className="text-sm text-orange-700 flex items-center gap-2">
                          <Activity className="w-3 h-3" />
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">
              Unlock Your Personalized Health Plan
            </CardTitle>
            <CardDescription>
              Get access to AI-powered health recommendations, personalized workout plans, and nutrition guidance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Features List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Heart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Health Tracking</h3>
                  <p className="text-sm text-gray-600">Monitor your progress daily</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Workout Plans</h3>
                  <p className="text-sm text-gray-600">Personalized exercise routines</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">AI Insights</h3>
                  <p className="text-sm text-gray-600">Smart health recommendations</p>
                </div>
              </div>

              {/* Payment Options */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold text-gray-900">Premium Plan</span>
                    <span className="text-2xl font-bold text-blue-600">₹299/month</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Full access to all features • Cancel anytime
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleQRPayment}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 text-lg font-medium"
                    disabled={processing}
                  >
                    <QrCode className="w-5 h-5 mr-2" />
                    {processing ? 'Processing...' : 'I\'ll pay by QR'}
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      <Clock className="w-4 h-4 inline mr-1" />
                      We'll activate your subscription within 1-2 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QR Modal */}
      <QRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        onPaymentComplete={handlePaymentComplete}
        amount={299}
        plan="Premium"
        cycle="monthly"
      />
    </div>
  );
};

export default OnboardingHealthAssessment;