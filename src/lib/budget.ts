import { checkCompatibility, buildTotal } from './compatibility';
import { partsInCategory, setBuildPart, type Build, type Category, type Part, type PartOf } from './types';

export type BuildGoal = 'gaming' | 'productivity' | 'allround';

/** Share of the budget each category gets, per build goal. Each row sums to 1. */
const ALLOCATIONS: Record<BuildGoal, Record<Category, number>> = {
  gaming: {
    gpu: 0.38, cpu: 0.18, motherboard: 0.1, ram: 0.08,
    storage: 0.08, psu: 0.08, case: 0.07, cooler: 0.03,
  },
  productivity: {
    cpu: 0.28, gpu: 0.22, ram: 0.13, motherboard: 0.11,
    storage: 0.1, psu: 0.08, case: 0.05, cooler: 0.03,
  },
  allround: {
    gpu: 0.32, cpu: 0.2, motherboard: 0.11, ram: 0.09,
    storage: 0.09, psu: 0.08, case: 0.08, cooler: 0.03,
  },
};

/**
 * Categories are picked in dependency order so each pick can be validated
 * against what's already chosen (mobo against CPU, RAM against mobo, case
 * against GPU length, PSU against total draw...).
 */
const PICK_ORDER: Category[] = [
  'cpu', 'motherboard', 'ram', 'gpu', 'cooler', 'case', 'psu', 'storage',
];

function hasErrors(build: Build): boolean {
  return checkCompatibility(build).some((issue) => issue.severity === 'error');
}

function pickFor<C extends Category>(
  category: C,
  parts: Part[],
  build: Build,
  cap: number,
): PartOf<C> | undefined {
  const compatible = partsInCategory(parts, category)
    .filter((p) => !hasErrors(setBuildPart(build, category, p)));
  if (compatible.length === 0) return undefined;

  // Spend the allocation: best tier we can afford, most capable within that
  // tier. If nothing fits the cap, fall back to the cheapest compatible part.
  const affordable = compatible.filter((p) => p.price <= cap);
  const pool = affordable.length > 0
    ? affordable
    : [compatible.reduce((a, b) => (a.price <= b.price ? a : b))];
  pool.sort((a, b) => b.tier - a.tier || b.price - a.price);
  return pool[0];
}

export interface RecommendedBuild {
  build: Build;
  total: number;
  overBudget: boolean;
}

export function recommendBuild(parts: Part[], budget: number, goal: BuildGoal): RecommendedBuild {
  const alloc = ALLOCATIONS[goal];
  let build: Build = {};

  for (const category of PICK_ORDER) {
    const pick = pickFor(category, parts, build, budget * alloc[category]);
    if (pick) build = setBuildPart(build, category, pick);
  }

  const total = buildTotal(build);
  return { build, total, overBudget: total > budget };
}
