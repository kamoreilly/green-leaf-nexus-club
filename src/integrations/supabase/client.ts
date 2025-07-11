// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://soanpfpidycptvnzuoqr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvYW5wZnBpZHljcHR2bnp1b3FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjIzOTMsImV4cCI6MjA2NzIzODM5M30.AsQsurBjXrcZYcg1Vl0jPbljR0YzVP9XPxO0cPQ21oQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});