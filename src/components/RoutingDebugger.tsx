import { useAuth } from "@/contexts/AuthContext";
import { simpleRoutingService } from "@/services/simpleRoutingService";
import { useEffect, useState } from "react";

export const RoutingDebugger: React.FC = () => {
  const { user, profile, loading, isInitialized } = useAuth();
  const [flowState, setFlowState] = useState<any>(null);
  const [correctRoute, setCorrectRoute] = useState<string>("");

  useEffect(() => {
    const debugRouting = async () => {
      if (user && profile && !loading && isInitialized) {
        try {
          const state = await simpleRoutingService.getUserFlowState(user, profile);
          const route = await simpleRoutingService.getCorrectRoute(user, profile);
          
          setFlowState(state);
          setCorrectRoute(route);
          
          console.log("🔍 Routing Debug Info:");
          console.log("- User ID:", user.id);
          console.log("- Onboarding Complete:", profile.onboarding_completed);
          console.log("- Flow State:", state);
          console.log("- Correct Route:", route);
        } catch (error) {
          console.error("Error debugging routing:", error);
        }
      }
    };

    debugRouting();
  }, [user, profile, loading, isInitialized]);

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">🔍 Routing Debug</h3>
      <div className="space-y-1">
        <div>User: {user ? "✅" : "❌"}</div>
        <div>Profile: {profile ? "✅" : "❌"}</div>
        <div>Onboarding: {profile?.onboarding_completed ? "✅" : "❌"}</div>
        <div>Loading: {loading ? "⏳" : "✅"}</div>
        <div>Initialized: {isInitialized ? "✅" : "❌"}</div>
        {flowState && (
          <>
            <div>Current Step: {flowState.currentStep}</div>
            <div>Has Subscription: {flowState.hasActiveSubscription ? "✅" : "❌"}</div>
            <div>Can Access Dashboard: {flowState.canAccessDashboard ? "✅" : "❌"}</div>
          </>
        )}
        <div className="font-bold text-green-400">Correct Route: {correctRoute}</div>
      </div>
    </div>
  );
};
