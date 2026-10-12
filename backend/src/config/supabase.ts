import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Create a single supabase admin client for interacting with the database
export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SECRET_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  }
);

// Minimal development-only connection verification
export async function verifyConnection() {
  try {
    // List users as an admin operation to verify the secret key is working
    const { error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1 });
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }
    console.log('✅ Supabase connected successfully');
    return true;
  } catch (err: any) {
    console.error('❌ Supabase connection error:', err.message);
    return false;
  }
}
