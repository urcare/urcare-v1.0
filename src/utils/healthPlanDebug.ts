import { healthPlanService } from "@/services/healthPlanService";

export const debugHealthPlan = async () => {
  try {
    console.log("🐛 Starting health plan debug...");
    
    // Get all health plans
    const plans = await healthPlanService.getAllPlans();
    console.log("📋 All health plans:", plans);
    
    // Get current plan
    const currentPlan = await healthPlanService.getCurrentPlan();
    console.log("🎯 Current plan:", currentPlan);
    
    // Get user profile for debugging
    const profile = await healthPlanService.getUserProfile();
    console.log("👤 User profile:", profile);
    
    console.log("✅ Debug completed successfully");
  } catch (error) {
    console.error("❌ Debug failed:", error);
  }
};
