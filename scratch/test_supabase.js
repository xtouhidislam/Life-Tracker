const { createClient } = require('@supabase/supabase-js');

const url = 'https://lxjbebqwklmvmdmhiard.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4amJlYnF3a2xtdm1kbWhpYXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzOTk0ODcsImV4cCI6MjEwNTk3NTQ4N30.v7IJR74j68LgWbT4E50v2dN0FpLfKsvh8HK940bhgK4';

const supabase = createClient(url, anonKey);

async function testSupabase() {
  console.log('--- Testing Supabase Connection ---');
  // 1. Check if auth responds
  const { data: session, error: authError } = await supabase.auth.getSession();
  console.log('getSession:', { session: !!session, error: authError?.message || null });

  // 2. Check public tables reading with anon key
  const tables = ['tasks', 'habits', 'expenses', 'profiles', 'user_stats'];
  for (const table of tables) {
    const { data, error, count } = await supabase.from(table).select('*', { count: 'exact' });
    console.log(`Table '${table}':`, { count, error: error?.message || null, sample: data?.slice(0, 1) });
  }
}

testSupabase();
