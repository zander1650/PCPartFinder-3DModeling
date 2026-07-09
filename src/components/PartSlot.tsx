'use client';

import { CATEGORY_LABELS, type Category, type Part } from '@/lib/types';
import { specSummary, usd } from '@/lib/describe';
import { useBuildStore } from '@/store/buildStore';

interface PartSlotProps {
  category: Category;
  part?: Part;
  onChoose: () => void;
}

export default function PartSlot({ category, part, onChoose }: PartSlotProps) {
  const removePart = useBuildStore((s) => s.removePart);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3">
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
          <button onClick={onChoose} className="text-xs text-sky-400 hover:underline">
            Swap
          </button>
          <button
            onClick={() => removePart(category)}
            aria-label={`Remove ${CATEGORY_LABELS[category]}`}
            className="text-xs text-slate-500 hover:text-red-400"
          >
            ✕
          </button>
        </>
      ) : (
        <button
          onClick={onChoose}
          className="flex-1 text-left text-sm text-sky-400 hover:text-sky-300"
        >
          + Choose a {CATEGORY_LABELS[category].toLowerCase()}
        </button>
      )}
    </div>
  );
}
