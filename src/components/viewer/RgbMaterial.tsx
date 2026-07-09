'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { MeshStandardMaterial } from 'three';

interface RgbMaterialProps {
  active: boolean;
  color?: string;
  /** Phase offset so neighbouring RGB parts don't cycle in lockstep. */
  offset?: number;
}

export default function RgbMaterial({ active, color = '#1e293b', offset = 0 }: RgbMaterialProps) {
  const ref = useRef<MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    if (active) {
      ref.current.emissive.setHSL((clock.elapsedTime * 0.12 + offset) % 1, 0.9, 0.55);
      ref.current.emissiveIntensity = 2;
    } else {
      ref.current.emissiveIntensity = 0;
    }
  });

  return <meshStandardMaterial ref={ref} color={color} toneMapped={false} />;
}
