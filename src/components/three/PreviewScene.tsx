"use client";

import { useRef } from "react";
import { Canvas, extend, useFrame, type ThreeElement } from "@react-three/fiber";
import { PreviewMaterial } from "./preview-material";

extend({ PreviewMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    previewMaterial: ThreeElement<typeof PreviewMaterial>;
  }
}

type Velocity = { x: number; y: number };

function PreviewPlane({ velocityRef }: { velocityRef: React.RefObject<Velocity> }) {
  const materialRef = useRef<InstanceType<typeof PreviewMaterial>>(null);

  useFrame((_state, delta) => {
    const material = materialRef.current;
    if (!material) return;
    material.uTime += delta;
    material.uVelocity.set(velocityRef.current.x, velocityRef.current.y);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 1.3, 32, 32]} />
      <previewMaterial ref={materialRef} />
    </mesh>
  );
}

export default function PreviewScene({ velocityRef }: { velocityRef: React.RefObject<Velocity> }) {
  return (
    <Canvas
      orthographic
      camera={{ zoom: 130, position: [0, 0, 10] }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "none" }}
    >
      <PreviewPlane velocityRef={velocityRef} />
    </Canvas>
  );
}
