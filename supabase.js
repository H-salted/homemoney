import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xjpzxbqzecdkqjtswnhj.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcHp4YnF6ZWNka3FqdHN3bmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMTc3MjQsImV4cCI6MjA3Nzc5MzcyNH0.IMi53aS9t58hrDJj_R3Wmb6N89BT8O3XsGy2KeoCMrA';
const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };