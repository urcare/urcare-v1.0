import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  Users, 
  Shield, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Activity,
  CreditCard,
  Settings,
  RefreshCw
} from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { subscriptionService } from '@/services/subscriptionService';
import { SubscriptionPlan } from '@/types/subscription';

interface SubscriptionManagerProps {
  showUsageMetrics?: boolean;
  showPlanDetails?: boolean;
  showActions?: boolean;
  className?: string;
}

export const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({
  showUsageMetrics = true,
  showPlanDetails = true,
  showActions = true,
  className = ''
}) => {
  const {
    hasActiveSubscription,
    subscription,
    subscriptionStatus,
    usageMetrics,
    isLoading,
    isCheckingSubscription,
    checkSubscription,
    canAccessFeature,
    trackFeatureUsage,
    refreshUsageMetrics,
    isTrialActive,
    daysUntilExpiry,
    isExpired,
    canRenew
  } = useSubscription();

  const [isUpdating, setIsUpdating] = useState(false);

  const getPlanIcon = (planSlug: string) => {
    switch (planSlug) {
      case 'basic':
        return <Shield className="w-5 h-5" />;
      case 'family':
        return <Users className="w-5 h-5" />;
      case 'elite':
        return <Crown className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const getStatusBadge = () => {
    if (!subscriptionStatus) return null;

    if (subscriptionStatus.isExpired) {
      return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" />Expired</Badge>;
    }

    if (subscriptionStatus.isTrial) {
      return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" />Trial</Badge>;
    }

    if (subscriptionStatus.isCanceled) {
      return <Badge variant="outline" className="gap-1"><XCircle className="w-3 h-3" />Canceled</Badge>;
    }

    return <Badge variant="default" className="gap-1"><CheckCircle className="w-3 h-3" />Active</Badge>;
  };

  const handleRefresh = async () => {
    await checkSubscription();
    await refreshUsageMetrics();
  };

  const handleTrackUsage = async (featureName: string) => {
    await trackFeatureUsage(featureName, 1);
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            Loading Subscription...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hasActiveSubscription) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            No Active Subscription
          </CardTitle>
          <CardDescription>
            Subscribe to unlock premium features and health insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              You currently don't have an active subscription. Subscribe to access:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                AI-powered health insights
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Personalized meal plans
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Advanced health tracking
              </li>
            </ul>
            {showActions && (
              <Button className="w-full" onClick={() => window.location.href = '/paywall'}>
                <Crown className="w-4 h-4 mr-2" />
                View Plans
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {subscription && getPlanIcon(subscription.plan_slug)}
            <CardTitle>{subscription?.plan_name} Plan</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isCheckingSubscription}
            >
              <RefreshCw className={`w-4 h-4 ${isCheckingSubscription ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        <CardDescription>
          {isTrialActive ? 'Trial period active' : `${subscription?.billing_cycle} billing`}
          {daysUntilExpiry > 0 && ` • ${daysUntilExpiry} days remaining`}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Subscription Status */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Subscription Status</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Status:</span>
              <div className="font-medium">{subscriptionStatus?.isActive ? 'Active' : 'Inactive'}</div>
            </div>
            <div>
              <span className="text-gray-600">Billing Cycle:</span>
              <div className="font-medium capitalize">{subscription?.billing_cycle}</div>
            </div>
            <div>
              <span className="text-gray-600">Days Remaining:</span>
              <div className="font-medium">{daysUntilExpiry}</div>
            </div>
            <div>
              <span className="text-gray-600">Trial:</span>
              <div className="font-medium">{isTrialActive ? 'Active' : 'Inactive'}</div>
            </div>
          </div>
        </div>

        {/* Plan Features */}
        {showPlanDetails && subscription && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Plan Features</h4>
            <div className="grid grid-cols-1 gap-2">
              {subscription.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                  {canAccessFeature(feature) && (
                    <Badge variant="outline" size="sm">Available</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Usage Metrics */}
        {showUsageMetrics && usageMetrics.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Usage This Month</h4>
            <div className="space-y-3">
              {usageMetrics.map((metric) => (
                <div key={metric.featureName} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="capitalize">{metric.featureName.replace('_', ' ')}</span>
                    <span className="text-gray-600">
                      {metric.currentUsage}
                      {metric.limit && ` / ${metric.limit}`}
                    </span>
                  </div>
                  {metric.limit && (
                    <Progress 
                      value={metric.percentageUsed} 
                      className="h-2"
                      variant={metric.isOverLimit ? "destructive" : "default"}
                    />
                  )}
                  {metric.isOverLimit && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Usage limit exceeded
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = '/subscription/settings'}
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage Subscription
            </Button>
            {canRenew && (
              <Button 
                variant="default" 
                className="w-full"
                onClick={() => window.location.href = '/paywall'}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Renew Subscription
              </Button>
            )}
          </div>
        )}

        {/* Trial Warning */}
        {isTrialActive && daysUntilExpiry <= 7 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Trial ending soon</span>
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              Your trial ends in {daysUntilExpiry} days. Upgrade to continue using premium features.
            </p>
          </div>
        )}

        {/* Expired Warning */}
        {isExpired && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-800">
              <XCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Subscription expired</span>
            </div>
            <p className="text-xs text-red-700 mt-1">
              Your subscription has expired. Renew to restore access to premium features.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionManager; 