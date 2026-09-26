const { createClient } = require('@supabase/supabase-js');

const url = 'https://lxjbebqwklmvmdmhiard.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4amJlYnF3a2xtdm1kbWhpYXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzOTk0ODcsImV4cCI6MjEwNTk3NTQ4N30.v7IJR74j68LgWbT4E50v2dN0FpLfKsvh8HK940bhgK4';

const supabase = createClient(url, anonKey);

async function testSignupAndInsert() {
  console.log('--- Testing Supabase Auth & Permissions ---');
  
  // Test signup with a random test user to see if email confirmation is required or if it succeeds
  const testEmail = `test_${Date.now()}@example.com`;
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: 'Password123!',
  });
  console.log('SignUp result:', {
    user: signUpData?.user?.id,
    session: !!signUpData?.session,
    identities: signUpData?.user?.identities?.length,
    error: signUpError?.message || null,
  });

  if (signUpData?.session) {
    console.log('Session acquired immediately! Testing insert into tasks...');
    const { data: taskData, error: taskError } = await supabase.from('tasks').insert({
      user_id: signUpData.user.id,
      title: 'Test Verification Task',
      priority: 'high',
      difficulty: 'normal',
      xp_value: 10,
    }).select();
    console.log('Task insert result:', { task: taskData, error: taskError?.message || null });
  } else {
    console.log('No session returned on signup. Email confirmation is required by Supabase!');
  }
}

testSignupAndInsert();
