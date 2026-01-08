# Environment Setup Guide

## Required Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key_here
```

## How to Get Supabase Credentials

### Option 1: Use Existing Remote Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Go to **Settings > API**
4. Copy the **Project URL** and **anon/public key**

### Option 2: Use Local Supabase (Recommended for Development)
1. Install Supabase CLI: `npm install -g supabase`
2. Initialize Supabase: `supabase init`
3. Start local services: `supabase start`
4. Get credentials: `supabase status`

The local credentials will look like:
```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # Long JWT token
```

## Important Notes

- Never commit the `.env` file to version control
- The `.env` file is already in `.gitignore`
- For production deployment, set these as environment variables in your hosting platform
