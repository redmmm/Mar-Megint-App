# MMA Glass Hub - Cursor Migration Guide

## Project Overview

This is a **Hungarian YouTube Channel Hub** application built for managing and displaying content from two YouTube channels:
- **"Már megint?"** (Main content channel)
- **"Már megint játszunk?"** (Gaming channel)

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (Database + Auth + Edge Functions)
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: React Router DOM
- **Build Tool**: Vite with SWC

### Key Features
- **Channel Dashboards**: Individual pages for each YouTube channel
- **Video Management**: Fetches videos via YouTube RSS feeds (no API key required)
- **News System**: Admin dashboard for managing news posts
- **Responsive Design**: Glass morphism UI with premium styling
- **Real-time Updates**: 5-minute refresh intervals for content
- **Authentication**: Supabase Auth for admin access

### Architecture
- **Frontend**: React SPA with component-based architecture
- **Backend Services**: Supabase Edge Functions for YouTube RSS parsing
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Data Fetching**: RSS-based YouTube integration (no YouTube API key needed)

---

## Migration from Lovable.dev

### Current Lovable Dependencies
1. **`lovable-tagger`** (devDependency): Component tagging for Lovable's development environment
2. **Lovable-specific README**: Contains Lovable branding and deployment instructions

### Migration Status: ✅ COMPLETED

All Lovable dependencies have been successfully removed and the project is ready for local development in Cursor.

### Migration Steps (Completed)

#### ✅ 1. Remove Lovable Dependencies
```bash
npm uninstall lovable-tagger
```

#### 2. Update Vite Configuration
Remove the `componentTagger` plugin from `vite.config.ts`:

```typescript
// Before
plugins: [react(), mode === "development" && componentTagger()].filter(Boolean)

// After
plugins: [react()]
```

#### 3. Environment Setup
Create a `.env` file in the project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Example:
# VITE_SUPABASE_URL=https://your-project-id.supabase.co
# VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 4. Set Up Local Supabase
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase in project
supabase init

# Start local Supabase services
supabase start
```

#### 5. Deploy Edge Functions Locally
```bash
# Link to your remote Supabase project (if you want to sync)
supabase link --project-ref your-project-id

# Deploy functions to local environment
supabase functions deploy youtube-rss --no-verify-jwt
```

#### 6. Database Setup
Apply the database migrations:
```bash
supabase db push
```

#### 7. Install Dependencies
```bash
npm install
```

#### 8. Start Development Server
```bash
npm run dev
```

---

## Project Structure

```
m-r-megint-hub-main/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── ChannelCard.tsx # Channel display cards
│   │   ├── VideoCard.tsx   # Video display cards
│   │   └── ...
│   ├── pages/              # Route components
│   │   ├── Index.tsx       # Landing page
│   │   ├── ChannelDashboard.tsx # Channel-specific pages
│   │   ├── AdminDashboard.tsx   # Admin interface
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── useYouTubeData.ts # YouTube data fetching
│   │   └── useNews.ts      # News data fetching
│   ├── lib/                # Utility functions
│   │   └── youtube.ts      # YouTube RSS integration
│   └── integrations/       # External service integrations
│       └── supabase/       # Supabase client & types
├── supabase/
│   ├── functions/          # Edge Functions
│   │   └── youtube-rss/   # YouTube RSS parser
│   ├── migrations/         # Database migrations
│   └── config.toml        # Supabase configuration
└── public/                 # Static assets
```

---

## Key Components & Features

### YouTube Integration
- **RSS-based**: No YouTube API key required
- **Edge Function**: Server-side RSS parsing for CORS compliance
- **Caching**: 5-minute in-memory cache for performance
- **Fallback**: Mock data when RSS feeds are unavailable

### Admin Dashboard
- **Authentication**: Supabase Auth integration
- **News Management**: CRUD operations for news posts
- **Channel Assignment**: News can be assigned to specific channels

### UI/UX Features
- **Glass Morphism**: Premium glass-like design effects
- **Responsive**: Mobile-first responsive design
- **Dark Theme**: Consistent dark theme implementation
- **Animations**: Smooth fade-in animations and transitions

---

## Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- Supabase CLI
- Git

### Quick Start
```bash
# 1. Clone and navigate
git clone <your-repo-url>
cd m-r-megint-hub-main

# 2. Install dependencies
npm install

# 3. Set up Supabase locally
supabase init
supabase start

# 4. Create environment file
cp .env.example .env  # Add your Supabase credentials

# 5. Apply database migrations
supabase db push

# 6. Deploy edge functions locally
supabase functions serve youtube-rss --no-verify-jwt

# 7. Start development server
npm run dev
```

### Available Scripts
```json
{
  "dev": "vite",           // Start development server
  "build": "vite build",   // Production build
  "preview": "vite preview", // Preview production build
  "lint": "eslint .",      // Run ESLint
  "build:dev": "vite build --mode development" // Development build
}
```

---

## Deployment Options

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Manual Build & Deploy
```bash
# Build for production
npm run build

# Deploy dist/ folder to your hosting provider
```

---

## Troubleshooting

### Common Issues

1. **Supabase Connection Issues**
   - Verify `.env` file has correct credentials
   - Check Supabase services are running: `supabase status`

2. **Edge Function Errors**
   - Ensure functions are deployed: `supabase functions list`
   - Check function logs: `supabase functions logs youtube-rss`

3. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run lint`

4. **YouTube RSS Not Working**
   - Verify channel IDs in `src/lib/youtube.ts`
   - Check Edge Function is responding
   - Fallback to mock data is automatic

### Performance Notes
- RSS feeds are cached for 5 minutes
- Video thumbnails are lazy-loaded
- React Query handles data fetching optimization

---

## Contributing

1. Follow the existing code style (ESLint + Prettier)
2. Use TypeScript for all new code
3. Test components with mock data
4. Update this migration guide if architecture changes

---

## Support

For issues specific to the migration process:
1. Check Supabase documentation: https://supabase.com/docs
2. Review Vite documentation: https://vitejs.dev/
3. Check React Query docs: https://tanstack.com/query/

---

---

## 🎉 Migration Complete!

Your MMA Glass Hub project has been successfully migrated from Lovable.dev to a local Cursor development environment. All Lovable-specific dependencies have been removed, and the project is now ready for local development.

### What Was Accomplished:
- ✅ Removed `lovable-tagger` dependency
- ✅ Updated Vite configuration
- ✅ Created comprehensive setup documentation
- ✅ Added automated setup scripts
- ✅ Verified build process works
- ✅ Updated README with local development instructions

### Ready to Start Developing:
1. Run the setup script for your platform
2. Create your `.env` file with Supabase credentials
3. Execute `npm run dev` to start development
4. Visit `http://localhost:8080` to see your application

### Files Created/Modified:
- `cursor-migration.md` - This comprehensive migration guide
- `ENV-SETUP.md` - Environment configuration instructions
- `README.md` - Updated with local development instructions
- `setup-supabase.sh` / `setup-supabase.ps1` - Automated setup scripts
- `package.json` - Removed Lovable dependencies
- `vite.config.ts` - Removed componentTagger plugin

The project maintains all its original functionality while being completely independent of Lovable.dev infrastructure.

---

*Migration completed on: January 4, 2026*  
*This migration guide was created for transitioning from Lovable.dev to local Cursor development environment.*
