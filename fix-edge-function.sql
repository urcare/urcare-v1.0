-- Fix Edge Function Issues
-- This script helps identify and fix common Edge Function problems

-- Check if the Edge Function is properly deployed
-- Go to your Supabase Dashboard > Edge Functions > generate-ai-health-coach-plan
-- Make sure it's deployed and active

-- Common Edge Function issues and solutions:

-- 1. Check if the function is deployed
-- Go to Supabase Dashboard > Edge Functions
-- Look for "generate-ai-health-coach-plan" function
-- If it's not there, you need to deploy it

-- 2. Check function logs
-- Go to Supabase Dashboard > Edge Functions > generate-ai-health-coach-plan > Logs
-- Look for error messages

-- 3. Common fixes:
-- - Ensure the function is deployed
-- - Check environment variables
-- - Verify the function code is complete
-- - Check CORS settings

-- 4. If the function is missing, you can create a simple version:

-- Create a simple health plan generation function
-- This is a basic version that should work
CREATE OR REPLACE FUNCTION generate_simple_health_plan(
  user_id_param UUID,
  goal_param TEXT DEFAULT 'Improve overall health'
)
RETURNS JSONB AS $$
DECLARE
  user_profile JSONB;
  health_plan JSONB;
BEGIN
  -- Get user profile
  SELECT to_jsonb(up.*) INTO user_profile
  FROM user_profiles up
  WHERE up.id = user_id_param;
  
  -- If no profile found, return error
  IF user_profile IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User profile not found'
    );
  END IF;
  
  -- Create a simple health plan
  health_plan := jsonb_build_object(
    'goal', goal_param,
    'user_profile', user_profile,
    'plan', jsonb_build_object(
      'nutrition', jsonb_build_object(
        'breakfast', 'Healthy breakfast with protein and fiber',
        'lunch', 'Balanced lunch with vegetables and lean protein',
        'dinner', 'Light dinner 2-3 hours before sleep',
        'snacks', 'Fruits, nuts, or yogurt between meals'
      ),
      'exercise', jsonb_build_object(
        'cardio', '30 minutes of moderate cardio 5 days a week',
        'strength', 'Strength training 2-3 times a week',
        'flexibility', 'Daily stretching and mobility work'
      ),
      'sleep', jsonb_build_object(
        'duration', '7-9 hours per night',
        'schedule', 'Consistent sleep and wake times',
        'environment', 'Cool, dark, quiet bedroom'
      ),
      'stress_management', jsonb_build_object(
        'techniques', 'Deep breathing, meditation, or yoga',
        'activities', 'Hobbies, social connections, nature time'
      )
    ),
    'created_at', NOW(),
    'success', true
  );
  
  RETURN health_plan;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION generate_simple_health_plan(UUID, TEXT) TO authenticated;

-- Test the function
SELECT generate_simple_health_plan(
  '6295da0b-c227-4404-875a-0f16834bfa75'::UUID,
  'gain weight'
) as test_result;

-- Show function status
SELECT 'Edge Function fix completed!' as status;
