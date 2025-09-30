#!/bin/bash
# PhonePe Environment Variables Setup Script
# Run these commands if you have Supabase CLI installed

echo "Setting up PhonePe environment variables..."

# Set PhonePe credentials
supabase secrets set PHONEPE_MERCHANT_ID=M23XRS3XN3QMF
supabase secrets set PHONEPE_CLIENT_ID=SU2509291721337653559173
supabase secrets set PHONEPE_KEY_INDEX=1
supabase secrets set PHONEPE_API_KEY=713219fb-38d0-468d-8268-8b15955468b0
supabase secrets set PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
supabase secrets set FRONTEND_URL=http://localhost:8080

echo "Environment variables set successfully!"
echo "You can verify them in Supabase Dashboard > Edge Functions > Settings > Environment Variables"
