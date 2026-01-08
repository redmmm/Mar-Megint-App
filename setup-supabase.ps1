# Supabase Local Setup Script for Windows
# Run this script to set up Supabase locally for development

Write-Host "🚀 Setting up Supabase locally for MMA Glass Hub..." -ForegroundColor Green

# Check if Supabase CLI is installed
try {
    $supabaseVersion = supabase --version 2>$null
    Write-Host "✅ Supabase CLI is installed: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

# Initialize Supabase if not already done
if (!(Test-Path "supabase\config.toml")) {
    Write-Host "📁 Initializing Supabase project..." -ForegroundColor Blue
    supabase init
} else {
    Write-Host "✅ Supabase project already initialized" -ForegroundColor Green
}

# Start Supabase services
Write-Host "🔄 Starting Supabase services..." -ForegroundColor Blue
supabase start

# Apply database migrations
Write-Host "🗄️ Applying database migrations..." -ForegroundColor Blue
supabase db push

# Deploy edge functions
Write-Host "⚡ Deploying edge functions locally..." -ForegroundColor Blue
supabase functions serve youtube-rss --no-verify-jwt

# Get status and show credentials
Write-Host "`n📊 Supabase Status:" -ForegroundColor Cyan
supabase status

Write-Host "`n🎉 Setup complete! You can now:" -ForegroundColor Green
Write-Host "1. Create a .env file with your local Supabase credentials" -ForegroundColor White
Write-Host "2. Run 'npm run dev' to start the development server" -ForegroundColor White
Write-Host "3. Visit http://localhost:8080 to see the application" -ForegroundColor White

Write-Host "`n📝 Don't forget to create your .env file with:" -ForegroundColor Yellow
Write-Host "VITE_SUPABASE_URL=http://127.0.0.1:54321" -ForegroundColor White
Write-Host "VITE_SUPABASE_PUBLISHABLE_KEY=[your-anon-key-from-above]" -ForegroundColor White
