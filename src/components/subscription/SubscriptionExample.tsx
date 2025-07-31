import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  FileText, 
  Utensils, 
  Users, 
  Crown,
  Activity,
  Zap
} from 'lucide-react';
import { useSubscription, useFeatureAccess, useFeatureUsage } from '@/hooks/useSubscription';
import { FeatureGuard } from './FeatureGuard';
import { SubscriptionManager } from './SubscriptionManager';
import { subscriptionService } from '@/services/subscriptionService';
import { useAuth } from '@/contexts/AuthContext';

export const SubscriptionExample: React.FC = () => {
  const { user } = useAuth();
  const { hasActiveSubscription, subscription, trackFeatureUsage } = useSubscription();
  
  // Feature access hooks
  const aiConsultations = useFeatureAccess('ai_consultations');
  const healthReports = useFeatureAccess('health_reports');
  const mealPlans = useFeatureAccess('meal_plans');
  const familyDashboard = useFeatureAccess('family_health_dashboard');
  
  // Usage tracking hooks
  const aiUsage = useFeatureUsage('ai_consultations');
  const reportsUsage = useFeatureUsage('health_reports');
  const mealUsage = useFeatureUsage('meal_plans');

  const [isLoading, setIsLoading] = useState(false);

  const handleUseFeature = async (featureName: string) => {
    setIsLoading(true);
    try {
      await trackFeatureUsage(featureName, 1);
      // Show success message or update UI
    } catch (error) {
      console.error('Error using feature:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSubscription = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const subscription = await subscriptionService.createSubscription(user.id, {
        planId: 'basic',
        billingCycle: 'monthly',
        trialDays: 7
      });
      
      if (subscription) {
        // Refresh subscription data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Subscription Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubscriptionManager 
          showUsageMetrics={true}
          showPlanDetails={true}
          showActions={true}
        />
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Test subscription features and usage tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!hasActiveSubscription ? (
              <Button 
                onClick={handleCreateSubscription}
                disabled={isLoading}
                className="w-full"
              >
                <Crown className="w-4 h-4 mr-2" />
                Start Free Trial
              </Button>
            ) : (
              <div className="space-y-3">
                <Button 
                  onClick={() => handleUseFeature('ai_consultations')}
                  disabled={!aiConsultations.canAccess || isLoading}
                  className="w-full"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Use AI Consultation
                </Button>
                
                <Button 
                  onClick={() => handleUseFeature('health_reports')}
                  disabled={!healthReports.canAccess || isLoading}
                  className="w-full"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Health Report
                </Button>
                
                <Button 
                  onClick={() => handleUseFeature('meal_plans')}
                  disabled={!mealPlans.canAccess || isLoading}
                  className="w-full"
                >
                  <Utensils className="w-4 h-4 mr-2" />
                  Create Meal Plan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Feature Usage Dashboard */}
      {hasActiveSubscription && (
        <Card>
          <CardHeader>
            <CardTitle>Feature Usage Dashboard</CardTitle>
            <CardDescription>
              Track your usage across different features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* AI Consultations */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-500" />
                  <h4 className="font-medium">AI Consultations</h4>
                  <Badge variant={aiConsultations.canAccess ? "default" : "secondary"}>
                    {aiConsultations.canAccess ? "Available" : "Limited"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Usage</span>
                    <span>{aiUsage.currentUsage} / {aiUsage.limit || '∞'}</span>
                  </div>
                  {aiUsage.limit && (
                    <Progress value={aiUsage.percentageUsed} className="h-2" />
                  )}
                  {aiUsage.isOverLimit && (
                    <p className="text-xs text-red-600">Usage limit exceeded</p>
                  )}
                </div>
              </div>

              {/* Health Reports */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-500" />
                  <h4 className="font-medium">Health Reports</h4>
                  <Badge variant={healthReports.canAccess ? "default" : "secondary"}>
                    {healthReports.canAccess ? "Available" : "Limited"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Usage</span>
                    <span>{reportsUsage.currentUsage} / {reportsUsage.limit || '∞'}</span>
                  </div>
                  {reportsUsage.limit && (
                    <Progress value={reportsUsage.percentageUsed} className="h-2" />
                  )}
                  {reportsUsage.isOverLimit && (
                    <p className="text-xs text-red-600">Usage limit exceeded</p>
                  )}
                </div>
              </div>

              {/* Meal Plans */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-orange-500" />
                  <h4 className="font-medium">Meal Plans</h4>
                  <Badge variant={mealPlans.canAccess ? "default" : "secondary"}>
                    {mealPlans.canAccess ? "Available" : "Limited"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Usage</span>
                    <span>{mealUsage.currentUsage} / {mealUsage.limit || '∞'}</span>
                  </div>
                  {mealUsage.limit && (
                    <Progress value={mealUsage.percentageUsed} className="h-2" />
                  )}
                  {mealUsage.isOverLimit && (
                    <p className="text-xs text-red-600">Usage limit exceeded</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Protected Features Demo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Consultations Feature */}
        <FeatureGuard featureName="ai_consultations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-500" />
                AI Health Consultations
              </CardTitle>
              <CardDescription>
                Get personalized health advice from our AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Ask questions about your health, get personalized recommendations, 
                  and track your wellness journey with AI-powered insights.
                </p>
                <Button 
                  onClick={() => handleUseFeature('ai_consultations')}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Start Consultation
                </Button>
              </div>
            </CardContent>
          </Card>
        </FeatureGuard>

        {/* Health Reports Feature */}
        <FeatureGuard featureName="health_reports">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-500" />
                Advanced Health Reports
              </CardTitle>
              <CardDescription>
                Detailed health analytics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Generate comprehensive health reports with detailed analytics, 
                  trends, and actionable recommendations for your wellness journey.
                </p>
                <Button 
                  onClick={() => handleUseFeature('health_reports')}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </FeatureGuard>

        {/* Family Dashboard Feature */}
        <FeatureGuard featureName="family_health_dashboard">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                Family Health Dashboard
              </CardTitle>
              <CardDescription>
                Manage health for your entire family
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Track health metrics for up to 5 family members, 
                  share insights, and coordinate wellness goals together.
                </p>
                <Button 
                  onClick={() => handleUseFeature('family_health_dashboard')}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Open Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </FeatureGuard>

        {/* Meal Plans Feature */}
        <FeatureGuard featureName="meal_plans">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-orange-500" />
                Personalized Meal Plans
              </CardTitle>
              <CardDescription>
                Custom meal plans for your health goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Get personalized meal plans tailored to your dietary preferences, 
                  health goals, and nutritional requirements.
                </p>
                <Button 
                  onClick={() => handleUseFeature('meal_plans')}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Utensils className="w-4 h-4 mr-2" />
                  Create Meal Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </FeatureGuard>
      </div>

      {/* Usage Statistics */}
      {hasActiveSubscription && (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Usage Statistics</CardTitle>
            <CardDescription>
              Track your feature usage across all plans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Brain className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{aiUsage.currentUsage}</div>
                <div className="text-sm text-gray-600">AI Consultations</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <FileText className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{reportsUsage.currentUsage}</div>
                <div className="text-sm text-gray-600">Health Reports</div>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Utensils className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">{mealUsage.currentUsage}</div>
                <div className="text-sm text-gray-600">Meal Plans</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">
                  {subscription?.plan_slug === 'family' ? '5' : subscription?.plan_slug === 'elite' ? '10' : '1'}
                </div>
                <div className="text-sm text-gray-600">Family Members</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubscriptionExample; 