// Real Supabase client for admin functionality
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Supabase configuration for admin features
const SUPABASE_URL = 'https://czryzqrxxfwthmzwpeah.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_7gjqAKcwUvchmm6MYJqWUg_ak9re_pg';

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});