export type FormFactor = 'ATX' | 'mATX' | 'ITX';
export type RamType = 'DDR4' | 'DDR5';

export interface CpuSpecs {
  socket: string;
  cores: number;
  boostClockGHz: number;
  tdpW: number;
  integratedGraphics: boolean;
}

export interface CoolerSpecs {
  sockets: string[];
  type: 'air' | 'aio';
  /** Air: tower height checked against case clearance. AIO: pump height (not checked). */
  heightMm: number;
  radiatorMm?: number;
  fanCount: number;
}

export interface MotherboardSpecs {
  socket: string;
  formFactor: FormFactor;
  ramType: RamType;
  ramSlots: number;
  maxRamGb: number;
}

export interface RamSpecs {
  type: RamType;
  capacityGb: number;
  sticks: number;
  speedMhz: number;
  rgb: boolean;
}

export interface GpuSpecs {
  lengthMm: number;
  tdpW: number;
  vramGb: number;
  fanCount: number;
  rgb: boolean;
}

export interface StorageSpecs {
  type: 'NVMe' | 'SATA SSD' | 'HDD';
  capacityGb: number;
}

export interface PsuSpecs {
  wattage: number;
  efficiency: string;
  modular: 'full' | 'semi' | 'no';
}

export interface CaseSpecs {
  formFactors: FormFactor[];
  maxGpuLengthMm: number;
  maxCoolerHeightMm: number;
  includedFans: number;
  rgb: boolean;
}

export interface SpecMap {
  cpu: CpuSpecs;
  cooler: CoolerSpecs;
  motherboard: MotherboardSpecs;
  ram: RamSpecs;
  gpu: GpuSpecs;
  storage: StorageSpecs;
  psu: PsuSpecs;
  case: CaseSpecs;
}

export type Category = keyof SpecMap;

export interface PartItem<C extends Category = Category> {
  id: string;
  category: C;
  name: string;
  brand: string;
  /** Placeholder MSRP in USD until live retailer pricing is wired up. */
  price: number;
  /** 1 (entry) – 5 (flagship); used by the budget recommender. */
  tier: number;
  specs: SpecMap[C];
}

/** Discriminated union over all categories — narrowing on `category` narrows `specs`. */
export type Part = { [C in Category]: PartItem<C> }[Category];

export type PartOf<C extends Category> = PartItem<C>;

export type Build = { [C in Category]?: PartItem<C> };

export function partsInCategory<C extends Category>(parts: Part[], category: C): PartItem<C>[] {
  return (parts as PartItem[]).filter((p): p is PartItem<C> => p.category === category);
}

/** Immutable slot update. TS can't verify writes through a generic key on an optional mapped type, hence the cast. */
export function setBuildPart<C extends Category>(build: Build, category: C, part: PartItem<C>): Build {
  return { ...build, [category]: part } as Build;
}

export const CATEGORIES: Category[] = [
  'cpu',
  'cooler',
  'motherboard',
  'ram',
  'gpu',
  'storage',
  'psu',
  'case',
];

export const CATEGORY_LABELS: Record<Category, string> = {
  cpu: 'CPU',
  cooler: 'CPU Cooler',
  motherboard: 'Motherboard',
  ram: 'Memory',
  gpu: 'Graphics Card',
  storage: 'Storage',
  psu: 'Power Supply',
  case: 'Case',
};
