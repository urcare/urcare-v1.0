import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lock, 
  Crown, 
  AlertTriangle, 
  CheckCircle,
  Users,
  Shield
} from 'lucide-react';
import { useFeatureAccess } from '@/hooks/useSubscription';

interface FeatureGuardProps {
  featureName: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
  className?: string;
}

interface FeatureInfo {
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  requiredPlan: string;
  planIcon: React.ComponentType<any>;
}

const getFeatureInfo = (featureName: string): FeatureInfo => {
  const featureMap: Record<string, FeatureInfo> = {
    'ai_consultations': {
      name: 'AI Health Consultations',
      description: 'Get personalized health advice from our AI-powered health assistant',
      icon: Crown,
      requiredPlan: 'Basic',
      planIcon: Shield
    },
    'health_reports': {
      name: 'Advanced Health Reports',
      description: 'Detailed health analytics and insights with actionable recommendations',
      icon: Crown,
      requiredPlan: 'Basic',
      planIcon: Shield
    },
    'meal_plans': {
      name: 'Personalized Meal Plans',
      description: 'Custom meal plans tailored to your health goals and dietary preferences',
      icon: Crown,
      requiredPlan: 'Basic',
      planIcon: Shield
    },
    'family_health_dashboard': {
      name: 'Family Health Dashboard',
      description: 'Manage health for your entire family with shared insights and tracking',
      icon: Users,
      requiredPlan: 'Family',
      planIcon: Users
    },
    'unlimited_consultations': {
      name: 'Unlimited Consultations',
      description: 'Access unlimited AI health consultations without any restrictions',
      icon: Crown,
      requiredPlan: 'Elite',
      planIcon: Crown
    },
    'personal_health_coach': {
      name: 'Personal Health Coach',
      description: 'One-on-one guidance from certified health and wellness coaches',
      icon: Crown,
      requiredPlan: 'Elite',
      planIcon: Crown
    }
  };

  return featureMap[featureName] || {
    name: featureName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: 'Premium feature requiring subscription',
    icon: Crown,
    requiredPlan: 'Basic',
    planIcon: Shield
  };
};

export const FeatureGuard: React.FC<FeatureGuardProps> = ({
  featureName,
  children,
  fallback,
  showUpgradePrompt = true,
  className = ''
}) => {
  const { canAccess, hasSubscription, isLoading } = useFeatureAccess(featureName);
  const featureInfo = getFeatureInfo(featureName);

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (canAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  return (
    <Card className={`border-dashed border-2 ${className}`}>
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <featureInfo.icon className="w-6 h-6 text-gray-400" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          <Lock className="w-5 h-5" />
          {featureInfo.name}
        </CardTitle>
        <CardDescription>
          {featureInfo.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Badge variant="outline" className="mb-2">
            <featureInfo.planIcon className="w-3 h-3 mr-1" />
            Requires {featureInfo.requiredPlan} Plan
          </Badge>
          
          {!hasSubscription ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Subscribe to unlock this premium feature and many more
              </p>
              <Button 
                className="w-full" 
                onClick={() => window.location.href = '/paywall'}
              >
                <Crown className="w-4 h-4 mr-2" />
                View Plans
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
                <span>Your current plan doesn't include this feature</span>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/paywall'}
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Plan
              </Button>
            </div>
          )}
        </div>

        {/* Feature Benefits */}
        <div className="space-y-2 text-sm">
          <h4 className="font-medium text-gray-900">What you'll get:</h4>
          <ul className="space-y-1 text-gray-600">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Access to {featureInfo.name}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              All {featureInfo.requiredPlan} plan features
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Priority customer support
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

// Higher-order component for protecting feature components
export const withFeatureGuard = <P extends object>(
  Component: React.ComponentType<P>,
  featureName: string,
  fallback?: React.ReactNode
) => {
  return (props: P) => (
    <FeatureGuard featureName={featureName} fallback={fallback}>
      <Component {...props} />
    </FeatureGuard>
  );
};

// Hook for conditional rendering based on feature access
export const useFeatureGuard = (featureName: string) => {
  const { canAccess, hasSubscription, isLoading } = useFeatureAccess(featureName);
  
  return {
    canAccess,
    hasSubscription,
    isLoading,
    showUpgradePrompt: !canAccess && !isLoading
  };
};

export default FeatureGuard; 