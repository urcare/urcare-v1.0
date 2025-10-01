import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, Clock, Flame, Target, Dumbbell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HealthPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  focusAreas: string[];
  estimatedCalories: number;
  equipment: string[];
  benefits: string[];
}

const HealthPlanGeneration: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<HealthPlan | null>(null);

  useEffect(() => {
    if (location.state?.selectedPlan) {
      setSelectedPlan(location.state.selectedPlan);
    } else {
      // If no plan selected, redirect back to dashboard
      navigate('/dashboard');
    }
  }, [location.state, navigate]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartPlan = () => {
    if (selectedPlan) {
      toast.success(`Starting ${selectedPlan.title}!`);
      navigate('/workout-dashboard', { state: { selectedPlan } });
    }
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to continue</h2>
          <Button onClick={() => navigate('/')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No plan selected</h2>
          <Button onClick={handleGoBack}>Go Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={handleGoBack} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Health Plan Details</h1>
          <div className="w-24"></div> {/* Spacer */}
        </div>

        {/* Plan Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl font-bold text-gray-900">
                {selectedPlan.title}
              </CardTitle>
              <Badge className={getDifficultyColor(selectedPlan.difficulty)}>
                {selectedPlan.difficulty}
              </Badge>
            </div>
            <p className="text-gray-600 text-lg mt-2">
              {selectedPlan.description}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Plan Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <Clock className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedPlan.duration}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
                <Flame className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Calories per Session</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedPlan.estimatedCalories}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                <Target className="w-6 h-6 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Focus Areas</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedPlan.focusAreas.length}</p>
                </div>
              </div>
            </div>

            {/* Focus Areas */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Focus Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedPlan.focusAreas.map((area, idx) => (
                  <Badge key={idx} variant="secondary" className="px-3 py-1">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Equipment Needed */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Dumbbell className="w-5 h-5 mr-2" />
                Equipment Needed
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedPlan.equipment.map((item, idx) => (
                  <Badge key={idx} variant="outline" className="px-3 py-1">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Key Benefits
              </h3>
              <ul className="space-y-2">
                {selectedPlan.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <Button
                onClick={handleStartPlan}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Start This Plan
              </Button>
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg transition-all duration-300"
              >
                Choose Different Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthPlanGeneration;