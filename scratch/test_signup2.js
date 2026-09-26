const { createClient } = require('@supabase/supabase-js');

const url = 'https://lxjbebqwklmvmdmhiard.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4amJlYnF3a2xtdm1kbWhpYXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzOTk0ODcsImV4cCI6MjEwNTk3NTQ4N30.v7IJR74j68LgWbT4E50v2dN0FpLfKsvh8HK940bhgK4';

const supabase = createClient(url, anonKey);

async function testSignupAndInsert() {
  const testEmail = `touhid_test_${Date.now()}@gmail.com`;
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: 'Password123!',
  });
  console.log('SignUp result:', {
    userId: signUpData?.user?.id,
    hasSession: !!signUpData?.session,
    error: signUpError?.message || null,
  });

  // Check if profile and user_stats were created by trigger
  if (signUpData?.user?.id) {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', signUpData.user.id);
    console.log('Profile created by trigger?:', profile);
  }
}

testSignupAndInsert();
