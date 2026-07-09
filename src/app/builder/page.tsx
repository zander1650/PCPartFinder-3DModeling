'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { CATEGORIES, type Category, type Part } from '@/lib/types';
import { getParts } from '@/lib/catalog';
import { buildTotal, checkCompatibility, estimatedWattage } from '@/lib/compatibility';
import { usd } from '@/lib/describe';
import { useBuildStore } from '@/store/buildStore';
import PartSlot from '@/components/PartSlot';
import PartPicker from '@/components/PartPicker';
import CompatibilityPanel from '@/components/CompatibilityPanel';

const PCViewer = dynamic(() => import('@/components/viewer/PCViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-slate-500">
      Loading 3D viewer…
    </div>
  ),
});

export default function BuilderPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [picking, setPicking] = useState<Category | null>(null);

  const build = useBuildStore((s) => s.build);
  const powered = useBuildStore((s) => s.powered);
  const togglePower = useBuildStore((s) => s.togglePower);
  const clearBuild = useBuildStore((s) => s.clearBuild);

  useEffect(() => {
    getParts().then(setParts);
  }, []);

  const issues = useMemo(() => checkCompatibility(build), [build]);
  const total = buildTotal(build);
  const watts = estimatedWattage(build);
  const isEmpty = Object.keys(build).length === 0;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-6 lg:h-[calc(100vh-3.5rem)] lg:flex-row">
      <div className="shrink-0 space-y-3 overflow-y-auto pr-1 lg:w-[430px]">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Your Build</h1>
          <button onClick={clearBuild} className="text-sm text-slate-400 hover:text-red-400">
            Clear all
          </button>
        </div>
        {CATEGORIES.map((category) => (
          <PartSlot
            key={category}
            category={category}
            part={build[category]}
            onChoose={() => setPicking(category)}
          />
        ))}
        <CompatibilityPanel issues={issues} watts={watts} />
        <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-lg">
          <span>Total</span>
          <span className="font-semibold">{usd.format(total)}</span>
        </div>
      </div>

      <div className="relative min-h-[440px] flex-1 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
        <PCViewer />
        {isEmpty && (
          <div className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-400">
            Pick parts on the left to see them appear here
          </div>
        )}
        <button
          onClick={togglePower}
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-6 py-2.5 text-sm font-semibold transition-colors ${
            powered
              ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30 hover:bg-sky-400'
              : 'border border-slate-700 bg-slate-900/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          ⏻ {powered ? 'Power Off' : 'Power On'}
        </button>
      </div>

      {picking && (
        <PartPicker category={picking} parts={parts} onClose={() => setPicking(null)} />
      )}
    </div>
  );
}
