import { UserProfile } from "@/contexts/AuthContext";

// This service was used for AI health assistant integration
// AI functionality has been removed from the application

export class OnboardingToHealthProfileMapper {
  /**
   * Placeholder class - AI health assistant functionality removed
   */
  static mapToHealthProfile(profile: UserProfile): any {
    console.log("AI health assistant functionality has been removed");
    return null;
  }

  static validateProfileCompleteness(profile: any): {
    isValid: boolean;
    missingFields: string[];
  } {
    return { isValid: false, missingFields: [] };
  }
}
