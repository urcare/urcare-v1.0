// Simple script to grant annual subscription access
// Run this with: node grant_access.js

const { execSync } = require("child_process");

console.log("🚀 Granting annual subscription access...");

try {
  // Execute the SQL directly using psql if available, or provide instructions
  console.log(`
📋 To grant your annual subscription access, please run this SQL in your Supabase Dashboard:

1. Go to: https://supabase.com/dashboard/project/lvnkpserdydhnqbigfbz/sql
2. Run this SQL:

INSERT INTO subscriptions (
    user_id,
    plan_id,
    status,
    billing_cycle,
    current_period_start,
    current_period_end,
    cancel_at_period_end,
    metadata
) VALUES 
(
    '5965e3d6-f3db-470d-b930-5f3e16ec41ef', -- Sarthak Sharma
    (SELECT id FROM subscription_plans WHERE slug = 'family' LIMIT 1),
    'active',
    'annual',
    NOW(),
    NOW() + INTERVAL '1 year',
    false,
    '{"granted_by": "admin", "grant_type": "manual", "notes": "Yearly subscription granted manually"}'
);

-- Verify it was created
SELECT 
    s.id,
    s.user_id,
    s.status,
    s.billing_cycle,
    s.current_period_start,
    s.current_period_end,
    sp.name as plan_name
FROM subscriptions s
JOIN subscription_plans sp ON s.plan_id = sp.id
WHERE s.user_id = '5965e3d6-f3db-470d-b930-5f3e16ec41ef';

3. After running this SQL, your dashboard access should work immediately!
`);

  console.log(
    "✅ Instructions provided above. The database functions have been fixed."
  );
  console.log(
    "🎯 Once you run the SQL, you should be able to access the dashboard!"
  );
} catch (error) {
  console.error("Error:", error.message);
}
