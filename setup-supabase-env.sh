#!/bin/bash

# Supabase Environment Variables Setup Script
# Run this script to set up environment variables for Supabase Edge Functions

echo "🔧 Setting up Supabase Environment Variables..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Set environment variables for Supabase Edge Functions
echo "📝 Setting environment variables..."

# You need to replace these with your actual API keys
supabase secrets set GROQ_API_KEY="your_actual_groq_api_key_here"
supabase secrets set GROQ_API_KEY_2="your_second_groq_api_key_here"
supabase secrets set OPENAI_API_KEY="your_openai_api_key_here"
supabase secrets set GEMINI_API_KEY="your_gemini_api_key_here"

echo "✅ Environment variables set successfully!"
echo ""
echo "🚀 Next steps:"
echo "1. Replace the placeholder API keys with your actual keys"
echo "2. Run: supabase functions deploy"
echo "3. Test your functions"
