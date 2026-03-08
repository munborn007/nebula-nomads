'use client';

import { Billboard, Html } from '@react-three/drei';
import type { ReactNode } from 'react';
import type { Vector3 } from '@react-three/fiber';

type Props = {
  children: ReactNode;
  position?: [number, number, number] | Vector3;
};

/** Floating holographic panel — Billboard + Html for immersive 3D UI. */
export default function HoloPanel({ children, position = [0, 0, 0] }: Props) {
  return (
    <Billboard position={position} follow>
      <Html center transform occlude>
        <div className="bg-black/60 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-6 shadow-2xl shadow-cyan-900/50 min-w-[200px] max-w-[320px]">
          {children}
        </div>
      </Html>
    </Billboard>
  );
}
