import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Debug environment variables
console.log('Supabase Environment Check:', {
  SUPABASE_URL: SUPABASE_URL ? 'Set' : 'Missing',
  SUPABASE_ANON_KEY: SUPABASE_ANON_KEY ? 'Set' : 'Missing',
  hasUrl: !!SUPABASE_URL,
  hasKey: !!SUPABASE_ANON_KEY
});

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Supabase environment variables are missing!');
  console.error('Please create a .env file with:');
  console.error('VITE_SUPABASE_URL=your_supabase_url');
  console.error('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); 