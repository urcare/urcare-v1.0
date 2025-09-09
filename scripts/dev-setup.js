#!/usr/bin/env node

/**
 * Development Setup Script
 * Helps set up the development environment with fallbacks
 */

const fs = require("fs");
const path = require("path");

console.log("🚀 Setting up UrCare Development Environment...\n");

// Check if we're in the right directory
const packageJsonPath = path.join(process.cwd(), "package.json");
if (!fs.existsSync(packageJsonPath)) {
  console.error("❌ Please run this script from the project root directory");
  process.exit(1);
}

// Create .env.local if it doesn't exist
const envLocalPath = path.join(process.cwd(), ".env.local");
if (!fs.existsSync(envLocalPath)) {
  console.log("📝 Creating .env.local with development fallbacks...");

  const envContent = `# Development Environment Variables
# These are fallback values for local development

# Supabase (fallback values provided)
VITE_SUPABASE_URL=https://lvnkpserdydhnqbigfbz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzY5NjYsImV4cCI6MjA2ODkxMjk2Nn0.Y2NfbA7K9efpFHB6FFmCtgti3udX5wbOoQVkDndtkBc

# Development redirect URLs
VITE_SUPABASE_REDIRECT_URL=http://localhost:8080/auth/callback

# OpenAI (optional - mock data fallback available)
# VITE_OPENAI_API_KEY=your_openai_api_key_here

# Razorpay (optional)
# VITE_RAZORPAY_KEY_ID=your_razorpay_key_here

# Development mode
NODE_ENV=development
VITE_DEV_MODE=true
`;

  fs.writeFileSync(envLocalPath, envContent);
  console.log("✅ Created .env.local with development fallbacks");
} else {
  console.log("✅ .env.local already exists");
}

// Check if node_modules exists
const nodeModulesPath = path.join(process.cwd(), "node_modules");
if (!fs.existsSync(nodeModulesPath)) {
  console.log("📦 Installing dependencies...");
  console.log("   Run: npm install");
} else {
  console.log("✅ Dependencies are installed");
}

// Development instructions
console.log("\n🎯 Development Setup Complete!\n");
console.log("📋 Next Steps:");
console.log("   1. Run: npm install (if not already done)");
console.log("   2. Run: npm run dev");
console.log("   3. Open: http://localhost:8080");
console.log("\n🔧 Development Features:");
console.log("   • Auto-login with development user");
console.log("   • Real-time notifications for code changes");
console.log("   • Development panel (top-right corner)");
console.log("   • Hot module replacement");
console.log("   • Fallback authentication");
console.log("\n💡 Tips:");
console.log("   • The Dev Panel shows real-time updates");
console.log("   • Changes to code will trigger notifications");
console.log("   • Development user is automatically signed in");
console.log("   • All Supabase features work with fallback data");
console.log("\n🚀 Happy coding!");
