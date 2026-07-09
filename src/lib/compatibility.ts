import type { Build } from './types';

export interface CompatibilityIssue {
  severity: 'error' | 'warning';
  message: string;
}

/** Rough system draw: CPU + GPU TDP plus ~100W for the board, drives and fans. */
export function estimatedWattage(build: Build): number {
  const cpu = build.cpu?.specs.tdpW ?? 0;
  const gpu = build.gpu?.specs.tdpW ?? 0;
  if (cpu === 0 && gpu === 0) return 0;
  return cpu + gpu + 100;
}

export function buildTotal(build: Build): number {
  return Object.values(build).reduce((sum, part) => sum + (part?.price ?? 0), 0);
}

export function checkCompatibility(build: Build): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];
  const { cpu, cooler, motherboard, ram, gpu, psu } = build;
  const pcCase = build.case;

  if (cpu && motherboard && cpu.specs.socket !== motherboard.specs.socket) {
    issues.push({
      severity: 'error',
      message: `${cpu.name} (${cpu.specs.socket}) does not fit the ${motherboard.name} (${motherboard.specs.socket}).`,
    });
  }

  if (cooler && cpu && !cooler.specs.sockets.includes(cpu.specs.socket)) {
    issues.push({
      severity: 'error',
      message: `${cooler.name} does not support the ${cpu.specs.socket} socket.`,
    });
  }

  if (ram && motherboard && ram.specs.type !== motherboard.specs.ramType) {
    issues.push({
      severity: 'error',
      message: `${ram.specs.type} memory does not fit the ${motherboard.name} (${motherboard.specs.ramType} only).`,
    });
  }

  if (ram && motherboard && ram.specs.sticks > motherboard.specs.ramSlots) {
    issues.push({
      severity: 'error',
      message: `${ram.specs.sticks} sticks will not fit — the ${motherboard.name} has ${motherboard.specs.ramSlots} slots.`,
    });
  }

  if (ram && motherboard && ram.specs.capacityGb > motherboard.specs.maxRamGb) {
    issues.push({
      severity: 'error',
      message: `${ram.specs.capacityGb}GB exceeds the ${motherboard.name}'s ${motherboard.specs.maxRamGb}GB maximum.`,
    });
  }

  if (motherboard && pcCase && !pcCase.specs.formFactors.includes(motherboard.specs.formFactor)) {
    issues.push({
      severity: 'error',
      message: `${motherboard.specs.formFactor} motherboards do not fit in the ${pcCase.name}.`,
    });
  }

  if (gpu && pcCase && gpu.specs.lengthMm > pcCase.specs.maxGpuLengthMm) {
    issues.push({
      severity: 'error',
      message: `${gpu.name} (${gpu.specs.lengthMm}mm) is too long for the ${pcCase.name} (max ${pcCase.specs.maxGpuLengthMm}mm).`,
    });
  }

  if (
    cooler &&
    pcCase &&
    cooler.specs.type === 'air' &&
    cooler.specs.heightMm > pcCase.specs.maxCoolerHeightMm
  ) {
    issues.push({
      severity: 'error',
      message: `${cooler.name} (${cooler.specs.heightMm}mm) is too tall for the ${pcCase.name} (max ${pcCase.specs.maxCoolerHeightMm}mm).`,
    });
  }

  const watts = estimatedWattage(build);
  if (psu && watts > 0) {
    if (psu.specs.wattage < watts) {
      issues.push({
        severity: 'error',
        message: `${psu.name} (${psu.specs.wattage}W) cannot power this build (~${watts}W estimated).`,
      });
    } else if (psu.specs.wattage < watts * 1.25) {
      issues.push({
        severity: 'warning',
        message: `${psu.name} (${psu.specs.wattage}W) leaves little headroom over the ~${watts}W estimate.`,
      });
    }
  }

  if (cpu && !gpu && !cpu.specs.integratedGraphics) {
    issues.push({
      severity: 'warning',
      message: `${cpu.name} has no integrated graphics — you will need a graphics card for display output.`,
    });
  }

  return issues;
}
