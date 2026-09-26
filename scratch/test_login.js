const { createClient } = require('@supabase/supabase-js');

const url = 'https://lxjbebqwklmvmdmhiard.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4amJlYnF3a2xtdm1kbWhpYXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzOTk0ODcsImV4cCI6MjEwNTk3NTQ4N30.v7IJR74j68LgWbT4E50v2dN0FpLfKsvh8HK940bhgK4';

const supabase = createClient(url, anonKey);

async function testAuth() {
  console.log('--- Testing Demo User Login ---');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'demo@lifequest.app',
    password: 'LifeQuest2026!'
  });
  console.log('Login result:', {
    user: data?.user?.id || null,
    error: error?.message || null
  });
}

testAuth();
