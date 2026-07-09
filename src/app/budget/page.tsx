'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES, CATEGORY_LABELS, type Part } from '@/lib/types';
import { getParts } from '@/lib/catalog';
import { recommendBuild, type BuildGoal, type RecommendedBuild } from '@/lib/budget';
import { specSummary, usd } from '@/lib/describe';
import { useBuildStore } from '@/store/buildStore';

const GOALS: { id: BuildGoal; label: string; blurb: string }[] = [
  { id: 'gaming', label: 'Gaming', blurb: 'GPU-heavy for max FPS' },
  { id: 'productivity', label: 'Productivity', blurb: 'Cores and memory first' },
  { id: 'allround', label: 'All-round', blurb: 'Balanced value pick' },
];

export default function BudgetPage() {
  const router = useRouter();
  const loadBuild = useBuildStore((s) => s.loadBuild);

  const [parts, setParts] = useState<Part[]>([]);
  const [budget, setBudget] = useState(1500);
  const [goal, setGoal] = useState<BuildGoal>('gaming');
  const [result, setResult] = useState<RecommendedBuild | null>(null);

  useEffect(() => {
    getParts().then(setParts);
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Budget Builds</h1>
      <p className="mt-1 text-sm text-slate-400">
        Tell us your budget and what the PC is for — we&apos;ll pick a compatible build.
      </p>

      <div className="mt-6 space-y-5 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <div>
          <label htmlFor="budget" className="text-sm font-medium">
            Budget: <span className="text-sky-400">{usd.format(budget)}</span>
          </label>
          <input
            id="budget"
            type="range"
            min={600}
            max={4000}
            step={50}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="mt-2 w-full accent-sky-500"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {GOALS.map((g) => (
            <button
              key={g.id}
              onClick={() => setGoal(g.id)}
              className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                goal === g.id
                  ? 'border-sky-500 bg-sky-500/10'
                  : 'border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="text-sm font-medium">{g.label}</div>
              <div className="text-xs text-slate-400">{g.blurb}</div>
            </button>
          ))}
        </div>

        <button
          onClick={() => setResult(recommendBuild(parts, budget, goal))}
          disabled={parts.length === 0}
          className="w-full rounded-lg bg-sky-500 py-2.5 font-medium text-white hover:bg-sky-400 disabled:opacity-50"
        >
          Recommend a build
        </button>
      </div>

      {result && (
        <div className="mt-8">
          <div className="space-y-2">
            {CATEGORIES.map((category) => {
              const part = result.build[category];
              return (
                <div
                  key={category}
                  className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3"
                >
                  <div className="w-24 shrink-0 text-xs uppercase tracking-wide text-slate-400">
                    {CATEGORY_LABELS[category]}
                  </div>
                  {part ? (
                    <>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">
                          {part.brand} {part.name}
                        </div>
                        <div className="truncate text-xs text-slate-400">{specSummary(part)}</div>
                      </div>
                      <div className="text-sm font-semibold">{usd.format(part.price)}</div>
                    </>
                  ) : (
                    <div className="flex-1 text-sm text-slate-500">No suitable part found</div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">
            <div>
              <div className="text-lg font-semibold">{usd.format(result.total)}</div>
              {result.overBudget && (
                <div className="text-xs text-amber-400">
                  Slightly over budget — no cheaper compatible option in the catalog.
                </div>
              )}
            </div>
            <button
              onClick={() => {
                loadBuild(result.build);
                router.push('/builder');
              }}
              className="rounded-lg bg-sky-500 px-5 py-2.5 font-medium text-white hover:bg-sky-400"
            >
              Open in 3D Builder →
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
