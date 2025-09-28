import { useSubscription } from "@/hooks/useSubscription";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaywallModal from "./PaywallModal";

interface FeatureGuardProps {
  children: React.ReactNode;
  featureName: string;
  fallback?: React.ReactNode;
  showPaywall?: boolean;
}

const FeatureGuard: React.FC<FeatureGuardProps> = ({
  children,
  featureName,
  fallback,
  showPaywall = true,
}) => {
  const navigate = useNavigate();
  const { hasActiveSubscription, canAccessFeature, loading } =
    useSubscription();
  const [canAccess, setCanAccess] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (loading) return;

      if (hasActiveSubscription) {
        const access = await canAccessFeature(featureName);
        setCanAccess(access);

        if (!access && showPaywall) {
          setShowModal(true);
        }
      } else {
        setCanAccess(false);
        if (showPaywall) {
          setShowModal(true);
        }
      }
    };

    checkAccess();
  }, [
    hasActiveSubscription,
    loading,
    featureName,
    canAccessFeature,
    showPaywall,
  ]);

  const handleUpgrade = () => {
    setShowModal(false);
    navigate("/subscription");
  };

  const handleClose = () => {
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (canAccess === false) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showPaywall) {
      return (
        <>
          {children}
          <PaywallModal
            isOpen={showModal}
            onClose={handleClose}
            onUpgrade={handleUpgrade}
            featureName={featureName}
            currentPlan={hasActiveSubscription ? "Premium" : "Free"}
          />
        </>
      );
    }

    return null;
  }

  return <>{children}</>;
};

export default FeatureGuard;
