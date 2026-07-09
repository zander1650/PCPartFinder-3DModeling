'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import PCModel from './PCModel';

export default function PCViewer() {
  return (
    <Canvas camera={{ position: [0.62, 0.28, 0.72], fov: 40 }}>
      <color attach="background" args={['#050a15']} />
      <hemisphereLight args={['#cbd5e1', '#1e293b', 0.5]} />
      <directionalLight position={[2, 3, 2]} intensity={1.4} />
      <directionalLight position={[-2, 1, -1]} intensity={0.4} />
      <pointLight position={[0.5, 0.2, 0.6]} intensity={0.6} />
      <PCModel />
      <ContactShadows position={[0, -0.26, 0]} opacity={0.45} scale={1.6} blur={2.2} far={0.5} />
      <OrbitControls target={[0, 0, 0]} minDistance={0.35} maxDistance={2.2} enablePan={false} />
    </Canvas>
  );
}
