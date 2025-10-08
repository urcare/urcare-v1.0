// Health Service Adapter for Backward Compatibility
// Routes calls to unified health analysis service while maintaining old interfaces
import { unifiedHealthAnalysisService } from '../unifiedHealthAnalysisService';

// Re-export all functions from unified service with deprecation warnings
export const calculateHealthScore = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] calculateHealthScore is deprecated. Use unifiedHealthAnalysisService.calculateHealthScore instead.');
  return unifiedHealthAnalysisService.calculateHealthScore(...args);
};

export const getUserProfileForHealthScore = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] getUserProfileForHealthScore is deprecated. Use unifiedHealthAnalysisService.getUserProfileForHealthScore instead.');
  return unifiedHealthAnalysisService.getUserProfileForHealthScore(...args);
};

export const checkHealthAnalysisExist = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] checkHealthAnalysisExist is deprecated. Use unifiedHealthAnalysisService.checkHealthAnalysisExist instead.');
  return unifiedHealthAnalysisService.checkHealthAnalysisExist(...args);
};

export const fetchHealthAnalysis = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] fetchHealthAnalysis is deprecated. Use unifiedHealthAnalysisService.fetchHealthAnalysis instead.');
  return unifiedHealthAnalysisService.fetchHealthAnalysis(...args);
};

export const saveHealthAnalysis = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] saveHealthAnalysis is deprecated. Use unifiedHealthAnalysisService.saveHealthAnalysis instead.');
  return unifiedHealthAnalysisService.saveHealthAnalysis(...args);
};

export const getOrCalculateHealthAnalysis = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] getOrCalculateHealthAnalysis is deprecated. Use unifiedHealthAnalysisService.getOrCalculateHealthAnalysis instead.');
  return unifiedHealthAnalysisService.getOrCalculateHealthAnalysis(...args);
};

// Export the unified service for direct access
export { unifiedHealthAnalysisService };
