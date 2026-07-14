"use client";

import { Canvas } from "@react-three/fiber";
import { Particles } from "./Particles";

export default function ParticleScene({ active }: { active: boolean }) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6.5], fov: 45 }}
      frameloop={active ? "always" : "never"}
      style={{ pointerEvents: "none" }}
    >
      <Particles />
    </Canvas>
  );
}
