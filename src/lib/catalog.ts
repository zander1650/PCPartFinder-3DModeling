import type { Part } from './types';
import { getSupabase } from './supabase';
import rawParts from '@/data/parts.json';

const sampleParts = rawParts as unknown as Part[];

/**
 * Loads the parts catalog from Supabase when configured, otherwise falls back
 * to the bundled sample data.
 */
export async function getParts(): Promise<Part[]> {
  const supabase = getSupabase();
  if (!supabase) return sampleParts;

  const { data, error } = await supabase.from('parts').select('*');
  if (error || !data || data.length === 0) return sampleParts;

  return data.map((row) => ({
    id: row.id,
    category: row.category,
    name: row.name,
    brand: row.brand,
    price: Number(row.price),
    tier: row.tier,
    specs: row.specs,
  })) as Part[];
}
