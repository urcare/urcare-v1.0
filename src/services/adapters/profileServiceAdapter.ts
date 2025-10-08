// Profile Service Adapter for Backward Compatibility
// Routes calls to unified user profile service while maintaining old interfaces
import { unifiedUserProfileService } from '../unifiedUserProfileService';

// Re-export all functions from unified service with deprecation warnings
export const getUserProfile = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] getUserProfile is deprecated. Use unifiedUserProfileService.getUserProfile instead.');
  return unifiedUserProfileService.getUserProfile(...args);
};

export const upsertUserProfile = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] upsertUserProfile is deprecated. Use unifiedUserProfileService.upsertUserProfile instead.');
  return unifiedUserProfileService.upsertUserProfile(...args);
};

export const updateUserProfile = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] updateUserProfile is deprecated. Use unifiedUserProfileService.updateUserProfile instead.');
  return unifiedUserProfileService.updateUserProfile(...args);
};

export const deleteUserProfile = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] deleteUserProfile is deprecated. Use unifiedUserProfileService.deleteUserProfile instead.');
  return unifiedUserProfileService.deleteUserProfile(...args);
};

export const isOnboardingCompleted = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] isOnboardingCompleted is deprecated. Use unifiedUserProfileService.isOnboardingCompleted instead.');
  return unifiedUserProfileService.isOnboardingCompleted(...args);
};

export const getOnboardingProgress = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] getOnboardingProgress is deprecated. Use unifiedUserProfileService.getOnboardingProgress instead.');
  return unifiedUserProfileService.getOnboardingProgress(...args);
};

export const updateOnboardingProgress = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] updateOnboardingProgress is deprecated. Use unifiedUserProfileService.updateOnboardingProgress instead.');
  return unifiedUserProfileService.updateOnboardingProgress(...args);
};

export const completeOnboarding = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] completeOnboarding is deprecated. Use unifiedUserProfileService.completeOnboarding instead.');
  return unifiedUserProfileService.completeOnboarding(...args);
};

export const getHealthGoals = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] getHealthGoals is deprecated. Use unifiedUserProfileService.getHealthGoals instead.');
  return unifiedUserProfileService.getHealthGoals(...args);
};

export const updateHealthGoals = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] updateHealthGoals is deprecated. Use unifiedUserProfileService.updateHealthGoals instead.');
  return unifiedUserProfileService.updateHealthGoals(...args);
};

export const getPhysicalMeasurements = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] getPhysicalMeasurements is deprecated. Use unifiedUserProfileService.getPhysicalMeasurements instead.');
  return unifiedUserProfileService.getPhysicalMeasurements(...args);
};

export const updatePhysicalMeasurements = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] updatePhysicalMeasurements is deprecated. Use unifiedUserProfileService.updatePhysicalMeasurements instead.');
  return unifiedUserProfileService.updatePhysicalMeasurements(...args);
};

export const getDailySchedule = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] getDailySchedule is deprecated. Use unifiedUserProfileService.getDailySchedule instead.');
  return unifiedUserProfileService.getDailySchedule(...args);
};

export const updateDailySchedule = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] updateDailySchedule is deprecated. Use unifiedUserProfileService.updateDailySchedule instead.');
  return unifiedUserProfileService.updateDailySchedule(...args);
};

export const getHealthConditions = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] getHealthConditions is deprecated. Use unifiedUserProfileService.getHealthConditions instead.');
  return unifiedUserProfileService.getHealthConditions(...args);
};

export const updateHealthConditions = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] updateHealthConditions is deprecated. Use unifiedUserProfileService.updateHealthConditions instead.');
  return unifiedUserProfileService.updateHealthConditions(...args);
};

export const getLocationInfo = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] getLocationInfo is deprecated. Use unifiedUserProfileService.getLocationInfo instead.');
  return unifiedUserProfileService.getLocationInfo(...args);
};

export const updateLocationInfo = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] updateLocationInfo is deprecated. Use unifiedUserProfileService.updateLocationInfo instead.');
  return unifiedUserProfileService.updateLocationInfo(...args);
};

// Export the unified service for direct access
export { unifiedUserProfileService };
