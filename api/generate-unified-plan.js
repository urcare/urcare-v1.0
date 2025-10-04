// Vercel API route for unified plan generation
// Integrates Groq for plan generation and Gemini for schedule creation

const unifiedPlanService = require('../src/services/unifiedPlanService');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { 
      userProfile, 
      healthScore, 
      healthAnalysis, 
      recommendations, 
      userInput,
      customizationPreferences 
    } = req.body;

    console.log('🚀 Generating unified plan for user:', userProfile?.full_name);

    // Validate required fields
    if (!userProfile || !healthScore || !healthAnalysis) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userProfile, healthScore, healthAnalysis'
      });
    }

    // Create plan generation request
    const planRequest = {
      user_profile: userProfile,
      health_score: healthScore,
      health_analysis: healthAnalysis,
      recommendations: recommendations || [],
      selected_plan_type: req.body.selectedPlanType,
      customization_preferences: customizationPreferences
    };

    // Generate complete plan using unified service
    const result = await unifiedPlanService.generateCompletePlan(planRequest);

    if (result.success) {
      console.log('✅ Successfully generated unified plan');
      res.status(200).json({
        success: true,
        data: result.data,
        processingTime: result.processingTime,
        provider: result.provider
      });
    } else {
      console.error('❌ Failed to generate unified plan:', result.error);
      res.status(500).json({
        success: false,
        error: result.error,
        processingTime: result.processingTime
      });
    }

  } catch (error) {
    console.error('❌ Unified plan generation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate unified plan', 
      details: error.message 
    });
  }
};
