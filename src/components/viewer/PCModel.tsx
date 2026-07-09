'use client';

import { Edges } from '@react-three/drei';
import { useBuildStore } from '@/store/buildStore';
import type {
  CaseSpecs,
  CoolerSpecs,
  FormFactor,
  GpuSpecs,
  MotherboardSpecs,
  RamSpecs,
  StorageSpecs,
} from '@/lib/types';
import Fan from './Fan';
import RgbMaterial from './RgbMaterial';

/** X plane (in meters) that motherboard-mounted components sit on. */
const SURFACE = -0.09;

const MOBO_SIZES: Record<FormFactor, [number, number]> = {
  ATX: [0.305, 0.244],
  mATX: [0.244, 0.244],
  ITX: [0.17, 0.17],
};

export default function PCModel() {
  const build = useBuildStore((s) => s.build);
  const on = useBuildStore((s) => s.powered);

  return (
    <group position={[0, 0.01, 0]}>
      <CaseShell specs={build.case?.specs} on={on} />
      {build.motherboard && <Motherboard specs={build.motherboard.specs} />}
      {build.cpu && (
        <mesh position={[SURFACE + 0.004, 0.16, 0]}>
          <boxGeometry args={[0.008, 0.042, 0.042]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
        </mesh>
      )}
      {build.cooler && <Cooler specs={build.cooler.specs} on={on} />}
      {build.ram && <RamSticks specs={build.ram.specs} on={on} />}
      {build.gpu && <Gpu specs={build.gpu.specs} on={on} />}
      {build.storage && <StorageDrive specs={build.storage.specs} />}
      {build.psu && <Psu />}
    </group>
  );
}

function CaseShell({ specs, on }: { specs?: CaseSpecs; on: boolean }) {
  const fanCount = Math.min(specs?.includedFans ?? 0, 3);
  const rgb = specs?.rgb ?? false;

  return (
    <group>
      {/* glass shell */}
      <mesh>
        <boxGeometry args={[0.22, 0.46, 0.44]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.07} depthWrite={false} />
        <Edges color="#475569" />
      </mesh>
      {/* floor */}
      <mesh position={[0, -0.227, 0]}>
        <boxGeometry args={[0.22, 0.012, 0.44]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* motherboard tray */}
      <mesh position={[-0.104, 0.03, 0]}>
        <boxGeometry args={[0.008, 0.39, 0.44]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      {/* front intake fans */}
      {Array.from({ length: fanCount }, (_, i) => (
        <Fan
          key={i}
          position={[-0.02, 0.15 - i * 0.115, 0.207]}
          radius={0.054}
          spinning={on}
          rgb={rgb}
          rgbOffset={i * 0.07}
        />
      ))}
      {/* power LED */}
      <mesh position={[0.05, 0.233, 0.16]}>
        <sphereGeometry args={[0.006, 12, 12]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={on ? 3 : 0}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Motherboard({ specs }: { specs: MotherboardSpecs }) {
  const [height, depth] = MOBO_SIZES[specs.formFactor];
  const y = specs.formFactor === 'ITX' ? 0.1 : 0.07;

  return (
    <group position={[-0.094, y, 0.02]}>
      <mesh>
        <boxGeometry args={[0.006, height, depth]} />
        <meshStandardMaterial color="#0b1220" roughness={0.6} />
      </mesh>
      {/* VRM heatsink hint */}
      <mesh position={[0.008, height / 2 - 0.03, -depth / 2 + 0.03]}>
        <boxGeometry args={[0.014, 0.04, 0.05]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Cooler({ specs, on }: { specs: CoolerSpecs; on: boolean }) {
  if (specs.type === 'air') {
    const h = specs.heightMm / 1000;
    return (
      <group>
        <mesh position={[SURFACE + h * 0.4, 0.16, 0]}>
          <boxGeometry args={[h * 0.8, 0.1, 0.062]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.35} />
        </mesh>
        <Fan
          position={[SURFACE + h * 0.8 + 0.008, 0.16, 0]}
          rotation={[0, Math.PI / 2, 0]}
          radius={0.048}
          spinning={on}
        />
      </group>
    );
  }

  const radLength = (specs.radiatorMm ?? 240) / 1000;
  const fanCount = Math.max(1, Math.round((specs.radiatorMm ?? 240) / 120));
  return (
    <group>
      {/* pump block on the CPU */}
      <mesh position={[SURFACE + 0.015, 0.16, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.028, 0.028, 0.03, 24]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[SURFACE + 0.032, 0.16, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.02, 0.005, 8, 24]} />
        <RgbMaterial active={on} offset={0.5} />
      </mesh>
      {/* top-mounted radiator */}
      <mesh position={[-0.02, 0.205, 0]}>
        <boxGeometry args={[0.122, 0.028, radLength]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {Array.from({ length: fanCount }, (_, i) => (
        <Fan
          key={i}
          position={[-0.02, 0.185, -radLength / 2 + 0.06 + i * 0.12]}
          rotation={[Math.PI / 2, 0, 0]}
          radius={0.052}
          spinning={on}
        />
      ))}
    </group>
  );
}

function RamSticks({ specs, on }: { specs: RamSpecs; on: boolean }) {
  return (
    <group>
      {Array.from({ length: specs.sticks }, (_, i) => (
        <group key={i} position={[0, 0.12, 0.055 + i * 0.014]}>
          <mesh position={[SURFACE + 0.0225, 0, 0]}>
            <boxGeometry args={[0.045, 0.133, 0.007]} />
            <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.4} />
          </mesh>
          {specs.rgb && (
            <mesh position={[SURFACE + 0.047, 0, 0]}>
              <boxGeometry args={[0.005, 0.133, 0.008]} />
              <RgbMaterial active={on} offset={i * 0.08} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

function Gpu({ specs, on }: { specs: GpuSpecs; on: boolean }) {
  const length = Math.min(specs.lengthMm, 320) / 1000;
  const x = SURFACE + 0.03;
  const zStart = -0.115;
  const fanRadius = Math.min(0.042, (length / specs.fanCount) * 0.42);

  return (
    <group>
      <mesh position={[x, 0.02, zStart + length / 2]}>
        <boxGeometry args={[0.045, 0.115, length]} />
        <meshStandardMaterial color="#111827" metalness={0.6} roughness={0.4} />
      </mesh>
      {specs.rgb && (
        <mesh position={[x, 0.079, zStart + length / 2]}>
          <boxGeometry args={[0.04, 0.004, length * 0.8]} />
          <RgbMaterial active={on} offset={0.3} />
        </mesh>
      )}
      {Array.from({ length: specs.fanCount }, (_, i) => (
        <Fan
          key={i}
          position={[x, -0.04, zStart + ((i + 0.5) * length) / specs.fanCount]}
          rotation={[Math.PI / 2, 0, 0]}
          radius={fanRadius}
          spinning={on}
        />
      ))}
    </group>
  );
}

function StorageDrive({ specs }: { specs: StorageSpecs }) {
  if (specs.type === 'NVMe') {
    return (
      <mesh position={[SURFACE + 0.004, 0.03, 0.09]}>
        <boxGeometry args={[0.006, 0.023, 0.08]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    );
  }
  return (
    <mesh position={[0.02, -0.2, 0.14]}>
      <boxGeometry args={[0.101, specs.type === 'HDD' ? 0.026 : 0.009, 0.147]} />
      <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
    </mesh>
  );
}

function Psu() {
  return (
    <mesh position={[-0.01, -0.176, -0.13]}>
      <boxGeometry args={[0.15, 0.086, 0.16]} />
      <meshStandardMaterial color="#0f172a" metalness={0.4} roughness={0.5} />
    </mesh>
  );
}
