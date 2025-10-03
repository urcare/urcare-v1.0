import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { UserSubscription } from "@/types/subscription";
import { useEffect, useState } from "react";

export const useSubscription = () => {
  const { profile } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  useEffect(() => {
    if (profile?.id) {
      fetchSubscription();
    } else {
      setLoading(false);
    }
  }, [profile?.id]);

  const fetchSubscription = async () => {
    if (!profile?.id) return;

    try {
      setLoading(true);

      // Check if user has active subscription using the database function
      const { data: hasActive, error: hasActiveError } = await supabase.rpc(
        "has_active_subscription",
        { p_user_id: profile.id }
      );

      if (hasActiveError) {
        console.error("Error checking subscription status:", hasActiveError);
        return;
      }

      setHasActiveSubscription(hasActive || false);

      if (hasActive) {
        // Get subscription details
        const { data: subscriptionData, error: subscriptionError } =
          await supabase.rpc("get_user_subscription", {
            p_user_id: profile.id,
          });

        if (subscriptionError) {
          console.error(
            "Error fetching subscription details:",
            subscriptionError
          );
          return;
        }

        if (subscriptionData && subscriptionData.length > 0) {
          setSubscription(subscriptionData[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const canAccessFeature = async (featureName: string): Promise<boolean> => {
    if (!profile?.id) return false;

    try {
      const { data, error } = await supabase.rpc("can_access_feature", {
        p_user_id: profile.id,
        p_feature_name: featureName,
      });

      if (error) {
        console.error("Error checking feature access:", error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error("Error checking feature access:", error);
      return false;
    }
  };

  const updateUsage = async (
    featureName: string,
    increment: number = 1
  ): Promise<boolean> => {
    if (!profile?.id) return false;

    try {
      const { data, error } = await supabase.rpc("update_subscription_usage", {
        p_user_id: profile.id,
        p_feature_name: featureName,
        p_increment: increment,
      });

      if (error) {
        console.error("Error updating usage:", error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error("Error updating usage:", error);
      return false;
    }
  };

  const getDaysUntilExpiry = (): number => {
    if (!subscription) return 0;

    const now = new Date();
    const expiryDate = new Date(subscription.current_period_end);
    const daysUntilExpiry = Math.ceil(
      (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return Math.max(0, daysUntilExpiry);
  };

  const isExpiringSoon = (days: number = 7): boolean => {
    const daysUntilExpiry = getDaysUntilExpiry();
    return daysUntilExpiry <= days && daysUntilExpiry > 0;
  };

  const isTrial = (): boolean => {
    return subscription?.status === "trialing";
  };

  const getPlanLevel = (): number => {
    if (!subscription) return 0;

    const planLevels: Record<string, number> = {
      basic: 1,
      family: 2,
      elite: 3,
    };

    return planLevels[subscription.plan_slug] || 0;
  };

  return {
    subscription,
    loading,
    hasActiveSubscription,
    canAccessFeature,
    updateUsage,
    getDaysUntilExpiry,
    isExpiringSoon,
    isTrial,
    getPlanLevel,
    refetch: fetchSubscription,
  };
};
