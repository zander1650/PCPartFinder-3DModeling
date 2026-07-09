import type { Part } from './types';

export const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function gbLabel(gb: number): string {
  return gb >= 1000 ? `${gb / 1000}TB` : `${gb}GB`;
}

export function specSummary(part: Part): string {
  switch (part.category) {
    case 'cpu': {
      const s = part.specs;
      return `${s.cores} cores · ${s.socket} · up to ${s.boostClockGHz} GHz · ${s.tdpW}W`;
    }
    case 'cooler': {
      const s = part.specs;
      return s.type === 'aio'
        ? `${s.radiatorMm}mm AIO liquid cooler`
        : `Air tower · ${s.heightMm}mm tall`;
    }
    case 'motherboard': {
      const s = part.specs;
      return `${s.socket} · ${s.formFactor} · ${s.ramType} · ${s.ramSlots} DIMM slots`;
    }
    case 'ram': {
      const s = part.specs;
      return `${s.capacityGb}GB (${s.sticks}×${s.capacityGb / s.sticks}GB) ${s.type}-${s.speedMhz}${s.rgb ? ' · RGB' : ''}`;
    }
    case 'gpu': {
      const s = part.specs;
      return `${s.vramGb}GB VRAM · ${s.lengthMm}mm · ${s.tdpW}W${s.rgb ? ' · RGB' : ''}`;
    }
    case 'storage': {
      const s = part.specs;
      return `${gbLabel(s.capacityGb)} ${s.type}`;
    }
    case 'psu': {
      const s = part.specs;
      const modular = s.modular === 'full' ? 'fully modular' : s.modular === 'semi' ? 'semi-modular' : 'non-modular';
      return `${s.wattage}W · ${s.efficiency} · ${modular}`;
    }
    case 'case': {
      const s = part.specs;
      return `Up to ${s.formFactors[0]} · GPU ≤ ${s.maxGpuLengthMm}mm · ${s.includedFans} fans${s.rgb ? ' · RGB' : ''}`;
    }
  }
}
