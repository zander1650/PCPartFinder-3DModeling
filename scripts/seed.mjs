// Seeds the Supabase `parts` table from the bundled sample catalog.
// Usage: node --env-file=.env.local scripts/seed.mjs
import { readFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    'Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY,\n' +
      'then run: node --env-file=.env.local scripts/seed.mjs',
  );
  process.exit(1);
}

const parts = JSON.parse(
  await readFile(new URL('../src/data/parts.json', import.meta.url), 'utf8'),
);

const supabase = createClient(url, serviceKey);
const { error } = await supabase.from('parts').upsert(parts);

if (error) {
  console.error('Seed failed:', error.message);
  process.exit(1);
}
console.log(`Seeded ${parts.length} parts.`);
