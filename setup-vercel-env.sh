#!/bin/bash

# Vercel Environment Variables Setup Script
# Run this script to set up environment variables for Vercel deployment

echo "🔧 Setting up Vercel Environment Variables..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Please install it first:"
    echo "npm install -g vercel"
    exit 1
fi

# Set environment variables for Vercel
echo "📝 Setting environment variables..."

# You need to replace these with your actual API keys
vercel env add GROQ_API_KEY
vercel env add GROQ_API_KEY_2
vercel env add OPENAI_API_KEY
vercel env add GEMINI_API_KEY

echo "✅ Environment variables set successfully!"
echo ""
echo "🚀 Next steps:"
echo "1. Replace the placeholder API keys with your actual keys"
echo "2. Run: vercel --prod"
echo "3. Test your deployment"
