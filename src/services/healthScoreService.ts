// Health Score Calculation Service using OpenAI
import { supabase } from '@/integrations/supabase/client';

interface HealthScoreRequest {
  userProfile: any;
  userInput?: string;
  uploadedFiles?: string[];
  voiceTranscript?: string;
}

interface HealthScoreResponse {
  success: boolean;
  healthScore?: number;
  analysis?: string;
  recommendations?: string[];
  error?: string;
}

export const calculateHealthScore = async (request: HealthScoreRequest): Promise<HealthScoreResponse> => {
  try {
    console.log('🔍 Calculating health score with data:', request);

    // Prepare the data for OpenAI
    const healthData = {
      userProfile: request.userProfile,
      userInput: request.userInput || '',
      uploadedFiles: request.uploadedFiles || [],
      voiceTranscript: request.voiceTranscript || '',
      timestamp: new Date().toISOString()
    };

    // Call the health score generation API
    const response = await fetch('/api/generate-health-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(healthData)
    });

    if (!response.ok) {
      throw new Error(`Health score API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Health score calculated:', result);

      return {
      success: true,
      healthScore: result.healthScore,
      analysis: result.analysis,
      recommendations: result.recommendations
    };

  } catch (error) {
    console.error('❌ Health score calculation error:', error);
        return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to calculate health score'
    };
  }
};

// Get user profile data for health score calculation
export const getUserProfileForHealthScore = async (userId: string) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
        .single();

    if (error) throw error;

    return {
      success: true,
      profile
    };
    } catch (error) {
    console.error('❌ Error fetching user profile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user profile'
    };
  }
};