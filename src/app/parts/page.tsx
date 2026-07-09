'use client';

import { useEffect, useState } from 'react';
import { CATEGORIES, CATEGORY_LABELS, type Category, type Part } from '@/lib/types';
import { getParts } from '@/lib/catalog';
import { specSummary, usd } from '@/lib/describe';
import { useBuildStore } from '@/store/buildStore';

export default function PartsPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [category, setCategory] = useState<Category>('cpu');
  const [addedId, setAddedId] = useState<string | null>(null);
  const setPart = useBuildStore((s) => s.setPart);

  useEffect(() => {
    getParts().then(setParts);
  }, []);

  const rows = parts
    .filter((p) => p.category === category)
    .sort((a, b) => a.price - b.price);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Browse Parts</h1>

      <div className="mt-5 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              category === c
                ? 'bg-sky-500 text-white'
                : 'border border-slate-700 text-slate-300 hover:border-slate-500'
            }`}
          >
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-2">
        {rows.map((part) => (
          <div
            key={part.id}
            className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">
                {part.brand} {part.name}
              </div>
              <div className="truncate text-xs text-slate-400">{specSummary(part)}</div>
            </div>
            <div className="text-sm font-semibold">{usd.format(part.price)}</div>
            <button
              onClick={() => {
                setPart(part.category, part);
                setAddedId(part.id);
                setTimeout(() => setAddedId(null), 1500);
              }}
              className="w-28 rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
            >
              {addedId === part.id ? 'Added ✓' : 'Add to build'}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
