import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || import.meta.env?.VITE_SUPABASE_ANON_KEY;
const email = process.env.VITE_DEMO_EMAIL || import.meta.env?.VITE_DEMO_EMAIL;
const password = process.env.VITE_DEMO_PASSWORD || import.meta.env?.VITE_DEMO_PASSWORD;

console.log('Supabase URL:', supabaseUrl);
console.log('Email:', email);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing credentials!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  try {
    // 1. Authenticate
    console.log('Signing in...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email || '',
      password: password || '',
    });

    if (authError) {
      console.error('Auth error:', authError.message);
      return;
    }

    console.log('Signed in successfully! User ID:', authData.user?.id);

    // 2. Query profiles
    console.log('Querying profiles table...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user?.id)
      .maybeSingle();

    if (profileError) {
      console.error('Profiles query error:', profileError.message);
      console.log('This likely means the profiles table does not exist or we need to create it.');
    } else {
      console.log('Profile found:', profileData ? 'Yes' : 'No (Profile table exists, but row not created yet)');
      if (profileData) {
        console.log('Role:', profileData.role);
        console.log('Streak:', profileData.streak);
        console.log('XP:', profileData.xp);
      }
    }
  } catch (err: any) {
    console.error('Unexpected error:', err.message || err);
  }
}

check();
