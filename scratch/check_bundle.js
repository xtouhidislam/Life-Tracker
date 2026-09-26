async function check() {
  const html = await (await fetch('https://life-tracker-eta-eosin.vercel.app/today')).text();
  const matches = html.matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g);
  const scripts = [...matches].map(m => m[1]);
  console.log('Total scripts:', scripts.length);
  for (const s of scripts) {
    const text = await (await fetch('https://life-tracker-eta-eosin.vercel.app' + s)).text();
    if (text.includes('lxjbebqwklmvmdmhiard.supabase.co')) {
      console.log('FOUND REAL SUPABASE URL in:', s);
    }
    if (text.includes('placeholder.supabase.co')) {
      console.log('FOUND PLACEHOLDER in:', s);
    }
  }
}
check();
