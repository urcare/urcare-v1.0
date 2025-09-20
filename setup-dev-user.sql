-- Setup development user for testing
-- Run this in Supabase SQL Editor

-- Insert development user into auth.users (if not exists)
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  'dev-user-123',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'dev@urcare.local',
  crypt('devpassword', gen_salt('bf')),
  NOW(),
  NULL,
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Development User", "avatar_url": null}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Insert development user profile
INSERT INTO user_profiles (
  id,
  full_name,
  email,
  age,
  gender,
  height_cm,
  weight_kg,
  activity_level,
  health_goals,
  dietary_preferences,
  allergies,
  medical_conditions,
  medications,
  onboarding_completed,
  status,
  subscription_status,
  subscription_plan,
  created_at,
  updated_at
) VALUES (
  'dev-user-123',
  'Development User',
  'dev@urcare.local',
  25,
  'other',
  170,
  70,
  'moderate',
  ARRAY['weight_loss', 'muscle_gain'],
  ARRAY['balanced'],
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  true,
  'active',
  'active',
  'premium',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  updated_at = NOW();

-- Create a sample comprehensive health plan for development user
INSERT INTO comprehensive_health_plans (
  id,
  user_id,
  plan_name,
  plan_type,
  primary_goal,
  secondary_goals,
  start_date,
  target_end_date,
  duration_weeks,
  plan_data,
  weekly_milestones,
  monthly_assessments,
  status,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'dev-user-123',
  'Development Health Plan',
  'health_transformation',
  'Build muscle and lose weight',
  ARRAY['Improve nutrition', 'Increase physical activity', 'Better sleep'],
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '16 weeks',
  16,
  '{
    "overview": {
      "description": "A comprehensive 16-week plan for muscle building and weight loss",
      "expected_outcomes": ["Increased muscle mass", "Enhanced strength", "Improved body composition"],
      "key_principles": ["Gradual progression", "Sustainable practices", "Evidence-based approaches"]
    },
    "weekly_structure": {},
    "daily_templates": {
      "weekday": {
        "morning_routine": [],
        "meals": [],
        "workouts": [],
        "evening_routine": [],
        "wellness_activities": []
      },
      "weekend": {
        "morning_routine": [],
        "meals": [],
        "workouts": [],
        "evening_routine": [],
        "wellness_activities": []
      }
    }
  }'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  'active',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Verify the setup
SELECT 'Development user setup complete' as status;
SELECT id, full_name, email, onboarding_completed FROM user_profiles WHERE id = 'dev-user-123';
SELECT id, plan_name, plan_type, status FROM comprehensive_health_plans WHERE user_id = 'dev-user-123';
