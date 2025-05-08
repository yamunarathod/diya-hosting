import { createClient } from '@supabase/supabase-js'

// Replace 'YOUR_SUPABASE_URL' with your actual Supabase project URL
const supabaseUrl = 'https://bhddnfdnejdytdfmzlxj.supabase.co';
// Replace 'YOUR_SUPABASE_ANON_KEY' with your actual Supabase anon key
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZGRuZmRuZWpkeXRkZm16bHhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzOTY3MDcsImV4cCI6MjA2MDk3MjcwN30.PhFxnw44rR2uHZy0-VNe8yOCblFGoD84qt1WWiCTBAA';

// Create and export the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);