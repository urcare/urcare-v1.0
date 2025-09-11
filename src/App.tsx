import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useDevAuth } from "./hooks/useDevAuth";
// AI Health Assistant Demo removed
import Dashboard from "./pages/Dashboard";
import Diet from "./pages/Diet";
import EnhancedPlanner from "./pages/EnhancedPlanner";
import HealthAssessment from "./pages/HealthAssessment";
import HealthPlan from "./pages/HealthPlan";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import Paywall from "./pages/Paywall";
import Subscription from "./pages/Subscription";
import Workout from "./pages/Workout";

import { DevPanel } from "./components/DevPanel";
import { DevRedirectHandler } from "./components/DevRedirectHandler";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { AuthCallback } from "./components/auth/AuthCallback";

// Enhanced ProtectedRoute with subscription checks
const ProtectedRoute = ({
  children,
  requireOnboardingComplete = false,
  requireSubscription = false,
}: {
  children: React.ReactNode;
  requireOnboardingComplete?: boolean;
  requireSubscription?: boolean;
}) => {
  const devAuth = useDevAuth();
  const { user, profile, loading, isInitialized } = devAuth;
  const location = useLocation();
  const [subscriptionLoading, setSubscriptionLoading] = React.useState(false);
  const [hasValidSubscription, setHasValidSubscription] = React.useState<
    boolean | null
  >(null);

  // Check subscription status when required
  React.useEffect(() => {
    if (requireSubscription && profile && profile.onboarding_completed) {
      setSubscriptionLoading(true);
      checkSubscriptionStatus(profile)
        .then(setHasValidSubscription)
        .catch(() => setHasValidSubscription(false))
        .finally(() => setSubscriptionLoading(false));
    }
  }, [requireSubscription, profile]);

  // Debug logging for ProtectedRoute (reduced frequency)
  const debugRef = React.useRef<string>("");
  const currentDebug = `${isInitialized}-${loading}-${!!user}-${!!profile}-${
    profile?.onboarding_completed
  }`;
  if (debugRef.current !== currentDebug) {
    console.log("ProtectedRoute: Auth state", {
      isInitialized,
      loading,
      user: !!user,
      profile: !!profile,
      profileOnboardingCompleted: profile?.onboarding_completed,
      requireOnboardingComplete,
      requireSubscription,
      subscriptionLoading,
      hasValidSubscription,
      pathname: location.pathname,
    });
    debugRef.current = currentDebug;
  }

  if (
    !isInitialized ||
    loading ||
    (requireSubscription && subscriptionLoading)
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          <p className="text-sm text-gray-500 mt-2">
            {!isInitialized
              ? "Initializing..."
              : loading
              ? "Loading..."
              : "Checking subscription..."}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!profile) {
    return null; // or a loading spinner
  }

  // Handle onboarding flow - only redirect if not already on onboarding page
  if (
    requireOnboardingComplete &&
    !profile.onboarding_completed &&
    location.pathname !== "/onboarding"
  ) {
    console.log(
      "ProtectedRoute: User onboarding not completed, redirecting to onboarding"
    );
    return <Navigate to="/onboarding" replace />;
  }

  // Track if we've already processed a redirect for this user to prevent loops
  const redirectProcessed = React.useRef<string | null>(null);
  const currentUserKey = `${user?.id}_${profile?.onboarding_completed}_${location.pathname}`;
  
  // Only redirect from onboarding if user is actually on onboarding page and has completed it
  if (
    !requireOnboardingComplete &&
    profile.onboarding_completed &&
    location.pathname === "/onboarding" &&
    redirectProcessed.current !== currentUserKey
  ) {
    console.log(
      "ProtectedRoute: User completed onboarding, checking subscription status for redirect"
    );
    
    redirectProcessed.current = currentUserKey;

    // Check subscription status to determine where to redirect
    const checkSubscriptionAndRedirect = async () => {
      try {
        const { subscriptionService } = await import(
          "./services/subscriptionService"
        );
        const { isTrialBypassEnabled } = await import("./config/subscription");

        // Check if trial bypass is enabled (for development/testing)
        if (isTrialBypassEnabled()) {
          console.log(
            "ProtectedRoute: Trial bypass enabled, redirecting to dashboard"
          );
          window.location.replace("/dashboard");
          return;
        }

        // Check actual subscription status
        const subscriptionStatus =
          await subscriptionService.getSubscriptionStatus(profile.id);
        const hasAccess =
          subscriptionStatus.isActive || subscriptionStatus.isTrial;

        if (hasAccess) {
          console.log(
            "ProtectedRoute: User has active subscription or trial, redirecting to dashboard"
          );
          window.location.replace("/dashboard");
        } else {
          console.log(
            "ProtectedRoute: User no subscription, redirecting to paywall"
          );
          window.location.replace("/paywall");
        }
      } catch (subscriptionError) {
        console.error(
          "ProtectedRoute: Error checking subscription status:",
          subscriptionError
        );
        // Fallback: redirect to paywall
        console.log(
          "ProtectedRoute: Subscription check failed, redirecting to paywall"
        );
        window.location.replace("/paywall");
      }
    };

    checkSubscriptionAndRedirect();

    // Show loading state while checking subscription
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
        </div>
      </div>
    );
  }
  
  // Reset redirect tracking when user changes or path changes significantly
  React.useEffect(() => {
    if (location.pathname !== "/onboarding") {
      redirectProcessed.current = null;
    }
  }, [location.pathname]);

  // Handle subscription flow for dashboard and other protected features
  if (requireSubscription) {
    // Check if user has completed onboarding first
    if (!profile.onboarding_completed && location.pathname !== "/onboarding") {
      console.log(
        "ProtectedRoute: User onboarding not completed, redirecting to onboarding"
      );
      return <Navigate to="/onboarding" replace />;
    }

    // If subscription check is complete and user doesn't have valid subscription
    if (hasValidSubscription === false && location.pathname !== "/paywall") {
      console.log(
        "ProtectedRoute: User has no valid subscription, redirecting to paywall"
      );
      return <Navigate to="/paywall" replace />;
    }

    // If subscription check is still loading, show loading state
    if (hasValidSubscription === null) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Checking subscription...
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

// Helper function to check subscription status
// This integrates with the actual subscription service
const checkSubscriptionStatus = async (profile: any): Promise<boolean> => {
  try {
    // Import subscription service and config dynamically to avoid circular dependencies
    const { subscriptionService } = await import(
      "./services/subscriptionService"
    );
    const { isTrialBypassEnabled } = await import("./config/subscription");

    // For trial period, we'll allow access even without subscription
    // This is the bypass mechanism you requested for the trial period
    if (isTrialBypassEnabled()) {
      console.log(
        "Trial bypass enabled - allowing access without subscription"
      );
      return true;
    }

    // Check if user has an active subscription (including trial)
    const subscriptionStatus = await subscriptionService.getSubscriptionStatus(
      profile.id
    );
    console.log("Subscription status check:", subscriptionStatus);

    // Allow access if user has active subscription OR is in trial period
    const hasAccess = subscriptionStatus.isActive || subscriptionStatus.isTrial;
    console.log("User has access:", hasAccess);

    return hasAccess;
  } catch (error) {
    console.error("Error checking subscription status:", error);
    // In case of error, allow access for now (fail open)
    // In production, you might want to fail closed
    return true;
  }
};

// Component to handle initial routing for authenticated users
const InitialRouteHandler = () => {
  const devAuth = useDevAuth();
  const { user, profile, loading, isInitialized } = devAuth;
  const location = useLocation();

  // Track processed redirects to prevent loops
  const processedRedirect = React.useRef(false);

  React.useEffect(() => {
    console.log("InitialRouteHandler: Effect triggered", {
      isInitialized,
      loading,
      user: !!user,
      profile: !!profile,
      profileOnboardingCompleted: profile?.onboarding_completed,
      pathname: location.pathname,
      processedRedirect: processedRedirect.current,
    });

    // Only handle redirects from the landing page, not from other pages, and only once
    if (
      isInitialized &&
      !loading &&
      user &&
      profile &&
      location.pathname === "/" &&
      !processedRedirect.current
    ) {
      processedRedirect.current = true;
      console.log(
        "InitialRouteHandler: User on landing page, checking onboarding status"
      );
      if (!profile.onboarding_completed) {
        // First time user - redirect to onboarding
        console.log("InitialRouteHandler: Redirecting to onboarding");
        window.location.replace("/onboarding");
      } else {
        // Returning user - check subscription status and redirect appropriately
        const checkSubscriptionAndRedirect = async () => {
          try {
            const { subscriptionService } = await import(
              "./services/subscriptionService"
            );
            const { isTrialBypassEnabled } = await import(
              "./config/subscription"
            );

            // Check if trial bypass is enabled (for development/testing)
            if (isTrialBypassEnabled()) {
              console.log(
                "InitialRouteHandler: Trial bypass enabled, redirecting to dashboard"
              );
              setTimeout(() => window.location.replace("/dashboard"), 100);
              return;
            }

            // Check actual subscription status
            const subscriptionStatus =
              await subscriptionService.getSubscriptionStatus(user.id);
            const hasAccess =
              subscriptionStatus.isActive || subscriptionStatus.isTrial;

            if (hasAccess) {
              console.log(
                "InitialRouteHandler: User has active subscription or trial, redirecting to dashboard"
              );
              setTimeout(() => window.location.replace("/dashboard"), 100);
            } else {
              console.log(
                "InitialRouteHandler: User no subscription, redirecting to health assessment"
              );
              setTimeout(() => window.location.replace("/health-assessment"), 100);
            }
          } catch (subscriptionError) {
            console.error(
              "InitialRouteHandler: Error checking subscription status:",
              subscriptionError
            );
            // Fallback: redirect to health assessment
            console.log(
              "InitialRouteHandler: Subscription check failed, redirecting to health assessment"
            );
            setTimeout(() => window.location.replace("/health-assessment"), 100);
          }
        };

        checkSubscriptionAndRedirect();
      }
    }

    // Reset the flag when user changes or navigates away from landing
    if (location.pathname !== "/" || !user) {
      processedRedirect.current = false;
    }
  }, [isInitialized, loading, user, profile, location.pathname]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <DevRedirectHandler />
        <DevPanel />
        <InitialRouteHandler />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<AuthCallback />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected Routes */}
          <Route
            path="/welcome-screen"
            element={
              <ProtectedRoute>
                <WelcomeScreen />
              </ProtectedRoute>
            }
          />

          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />

          <Route
            path="/health-assessment"
            element={
              <ProtectedRoute requireOnboardingComplete={true}>
                <HealthAssessment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/paywall"
            element={
              <ProtectedRoute requireOnboardingComplete={true}>
                <Paywall />
              </ProtectedRoute>
            }
          />

          <Route
            path="/subscription"
            element={
              <ProtectedRoute requireOnboardingComplete={true}>
                <Subscription />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                requireOnboardingComplete={true}
                requireSubscription={true}
              >
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/health-plan"
            element={
              <ProtectedRoute
                requireOnboardingComplete={true}
                requireSubscription={true}
              >
                <HealthPlan />
              </ProtectedRoute>
            }
          />

          <Route
            path="/diet"
            element={
              <ProtectedRoute
                requireOnboardingComplete={true}
                requireSubscription={true}
              >
                <Diet />
              </ProtectedRoute>
            }
          />

          <Route
            path="/workout"
            element={
              <ProtectedRoute
                requireOnboardingComplete={true}
                requireSubscription={true}
              >
                <Workout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/planner"
            element={
              <ProtectedRoute
                requireOnboardingComplete={true}
                requireSubscription={true}
              >
                <EnhancedPlanner />
              </ProtectedRoute>
            }
          />

          {/* AI Health Assistant Demo Route removed */}

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
