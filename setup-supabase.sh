#!/bin/bash

# Supabase Local Setup Script
# Run this script to set up Supabase locally for development

set -e

echo "🚀 Setting up Supabase locally for MMA Glass Hub..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI is installed: $(supabase --version)"

# Initialize Supabase if not already done
if [ ! -f "supabase/config.toml" ]; then
    echo "📁 Initializing Supabase project..."
    supabase init
else
    echo "✅ Supabase project already initialized"
fi

# Start Supabase services
echo "🔄 Starting Supabase services..."
supabase start

# Apply database migrations
echo "🗄️ Applying database migrations..."
supabase db push

# Deploy edge functions
echo "⚡ Deploying edge functions locally..."
supabase functions serve youtube-rss --no-verify-jwt

# Get status and show credentials
echo ""
echo "📊 Supabase Status:"
supabase status

echo ""
echo "🎉 Setup complete! You can now:"
echo "1. Create a .env file with your local Supabase credentials"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:8080 to see the application"
echo ""
echo "📝 Don't forget to create your .env file with:"
echo "VITE_SUPABASE_URL=http://127.0.0.1:54321"
echo "VITE_SUPABASE_PUBLISHABLE_KEY=[your-anon-key-from-above]"
