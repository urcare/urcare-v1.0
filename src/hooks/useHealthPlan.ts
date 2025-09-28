import { useState, useEffect } from 'react';
import { healthPlanService, HealthPlanRecord } from '@/services/healthPlanService';

export const useHealthPlan = () => {
  const [currentPlan, setCurrentPlan] = useState<HealthPlanRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCurrentPlan = async () => {
    try {
      setLoading(true);
      setError(null);
      const plan = await healthPlanService.getCurrentPlan();
      setCurrentPlan(plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load health plan');
      console.error('Error loading current plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateNewPlan = async () => {
    try {
      setLoading(true);
      setError(null);
      const newPlan = await healthPlanService.generateHealthPlan();
      if (newPlan) {
        setCurrentPlan(newPlan);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate health plan');
      console.error('Error generating health plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkAndGenerateNextPlan = async () => {
    try {
      setLoading(true);
      setError(null);
      const nextPlan = await healthPlanService.checkAndGenerateNextPlan();
      if (nextPlan) {
        setCurrentPlan(nextPlan);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate next plan');
      console.error('Error generating next plan:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentPlan();
  }, []);

  return {
    currentPlan,
    loading,
    error,
    loadCurrentPlan,
    generateNewPlan,
    checkAndGenerateNextPlan,
  };
};
