# MMA Glass Hub

A modern, responsive YouTube channel hub for Hungarian content creators "Már megint?" and "Már megint játszunk?" built with React, TypeScript, and Supabase.

## 🚀 Features

- **Dual Channel Support**: Dedicated dashboards for both YouTube channels
- **RSS Integration**: Direct YouTube RSS feed integration (no API key required)
- **News Management**: Admin dashboard for content management
- **Glass Morphism UI**: Premium design with modern glass effects
- **Responsive Design**: Mobile-first approach with dark theme
- **Real-time Updates**: Automatic content refresh every 5 minutes
- **Authentication**: Secure admin access with Supabase Auth

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui + Tailwind CSS + Radix UI
- **Backend**: Supabase (Database + Auth + Edge Functions)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Build Tool**: Vite with SWC

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase CLI (for local development)
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <YOUR_GIT_URL>
cd m-r-megint-hub-main
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root. See [ENV-SETUP.md](./ENV-SETUP.md) for detailed instructions.

### 4. Set Up Supabase (Local Development)

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase in project
supabase init

# Start local Supabase services
supabase start

# Apply database migrations
supabase db push

# Deploy edge functions locally
supabase functions serve youtube-rss --no-verify-jwt
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## 📁 Project Structure

```
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   └── ...             # Custom components
│   ├── pages/              # Route components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── integrations/       # External services
├── supabase/
│   ├── functions/          # Edge Functions
│   └── migrations/         # Database schema
└── public/                 # Static assets
```

## 🗄️ Database Schema

The application uses a simple schema with news posts:

```sql
CREATE TABLE news_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  channel_tag TEXT NOT NULL
);
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run build:dev    # Development build
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```

### Netlify
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### Manual Deployment
Build the project and deploy the `dist/` folder to your hosting provider.

## 🔍 Development

### YouTube Integration
- Uses RSS feeds directly from YouTube (no API key required)
- Server-side parsing via Supabase Edge Functions
- 5-minute caching for performance
- Automatic fallback to mock data

### Admin Features
- Secure authentication via Supabase Auth
- CRUD operations for news posts
- Channel-specific content management

## 🤝 Contributing

1. Follow existing code style (ESLint + TypeScript)
2. Test with mock data when possible
3. Update documentation for architectural changes

## 📄 License

This project is private and proprietary.

## 🆘 Support

For technical issues:
- Check [Supabase Documentation](https://supabase.com/docs)
- Review [Vite Documentation](https://vitejs.dev/)
- Check [React Query Docs](https://tanstack.com/query/)
