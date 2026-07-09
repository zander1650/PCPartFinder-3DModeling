'use client';

import { useMemo } from 'react';
import { CATEGORY_LABELS, type Build, type Category, type Part } from '@/lib/types';
import { checkCompatibility } from '@/lib/compatibility';
import { specSummary, usd } from '@/lib/describe';
import { useBuildStore } from '@/store/buildStore';

interface PartPickerProps {
  category: Category;
  parts: Part[];
  onClose: () => void;
}

export default function PartPicker({ category, parts, onClose }: PartPickerProps) {
  const build = useBuildStore((s) => s.build);
  const setPart = useBuildStore((s) => s.setPart);

  const options = useMemo(
    () => parts.filter((p) => p.category === category).sort((a, b) => a.price - b.price),
    [parts, category],
  );

  // Issues already present without this slot filled — used so a candidate is
  // only flagged for the *new* errors it introduces.
  const { baseBuild, baseErrors } = useMemo(() => {
    const rest: Build = { ...build };
    delete rest[category];
    const errors = new Set(
      checkCompatibility(rest)
        .filter((i) => i.severity === 'error')
        .map((i) => i.message),
    );
    return { baseBuild: rest, baseErrors: errors };
  }, [build, category]);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60" onClick={onClose} />
      <div className="w-full max-w-xl overflow-y-auto border-l border-slate-800 bg-slate-950 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Choose a {CATEGORY_LABELS[category]}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            ✕ Close
          </button>
        </div>
        <div className="space-y-2">
          {options.map((part) => {
            const newErrors = checkCompatibility({ ...baseBuild, [category]: part } as Build)
              .filter((i) => i.severity === 'error' && !baseErrors.has(i.message))
              .map((i) => i.message);
            const incompatible = newErrors.length > 0;

            return (
              <div
                key={part.id}
                className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">
                      {part.brand} {part.name}
                    </span>
                    {incompatible && (
                      <span
                        title={newErrors.join('\n')}
                        className="shrink-0 rounded bg-red-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-red-400"
                      >
                        Incompatible
                      </span>
                    )}
                  </div>
                  <div className="truncate text-xs text-slate-400">{specSummary(part)}</div>
                  {incompatible && (
                    <div className="mt-1 text-xs text-red-400">{newErrors[0]}</div>
                  )}
                </div>
                <div className="text-sm font-semibold">{usd.format(part.price)}</div>
                <button
                  onClick={() => {
                    setPart(category, part);
                    onClose();
                  }}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                    incompatible
                      ? 'border border-red-500/40 text-red-400 hover:bg-red-500/10'
                      : 'bg-sky-500 text-white hover:bg-sky-400'
                  }`}
                >
                  {incompatible ? 'Add anyway' : 'Add'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
