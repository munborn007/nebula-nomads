'use client';

import { EffectComposer, Bloom } from '@react-three/postprocessing';

/** Bloom post-processing for cosmic glow. */
export default function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.6}
        luminanceSmoothing={0.9}
        mipmapBlur
        intensity={0.8}
        radius={0.85}
      />
    </EffectComposer>
  );
}
