'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import RgbMaterial from './RgbMaterial';

interface FanProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  radius?: number;
  spinning: boolean;
  rgb?: boolean;
  rgbOffset?: number;
}

const BLADE_COUNT = 5;

export default function Fan({
  position,
  rotation = [0, 0, 0],
  radius = 0.05,
  spinning,
  rgb = false,
  rgbOffset = 0,
}: FanProps) {
  const blades = useRef<Group>(null);
  const speed = useRef(0);

  useFrame((_, delta) => {
    // Ease toward the target speed so fans spin up and coast down.
    const target = spinning ? 22 : 0;
    speed.current += (target - speed.current) * Math.min(1, delta * 1.5);
    if (blades.current) blades.current.rotation.z -= speed.current * delta;
  });

  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <torusGeometry args={[radius, radius * 0.12, 8, 28]} />
        {rgb ? (
          <RgbMaterial active={spinning} offset={rgbOffset} />
        ) : (
          <meshStandardMaterial color="#1e293b" />
        )}
      </mesh>
      <group ref={blades}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[radius * 0.28, radius * 0.28, radius * 0.3, 16]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {Array.from({ length: BLADE_COUNT }, (_, i) => {
          const angle = (i / BLADE_COUNT) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * radius * 0.55, Math.sin(angle) * radius * 0.55, 0]}
              rotation={[0.5, 0, angle]}
            >
              <boxGeometry args={[radius * 0.72, radius * 0.3, radius * 0.06]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
