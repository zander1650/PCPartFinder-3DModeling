'use client';

import type { CompatibilityIssue } from '@/lib/compatibility';

interface CompatibilityPanelProps {
  issues: CompatibilityIssue[];
  watts: number;
}

export default function CompatibilityPanel({ issues, watts }: CompatibilityPanelProps) {
  return (
    <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Compatibility</span>
        {watts > 0 && <span className="text-xs text-slate-400">Est. draw ~{watts}W</span>}
      </div>
      {issues.length === 0 ? (
        <p className="text-sm text-emerald-400">✓ No issues found</p>
      ) : (
        issues.map((issue, i) => (
          <p
            key={i}
            className={`text-sm ${issue.severity === 'error' ? 'text-red-400' : 'text-amber-400'}`}
          >
            {issue.severity === 'error' ? '✕' : '⚠'} {issue.message}
          </p>
        ))
      )}
    </div>
  );
}
