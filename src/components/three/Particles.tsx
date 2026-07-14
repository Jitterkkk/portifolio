"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { extend, useFrame, useThree, type ThreeElement } from "@react-three/fiber";
import { ParticleMaterial } from "./particle-material";

extend({ ParticleMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    particleMaterial: ThreeElement<typeof ParticleMaterial>;
  }
}

function createParticleGeometry(count: number) {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const tints = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3 + 0] = THREE.MathUtils.randFloatSpread(20);
    positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(11);
    positions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(8) - 1;
    sizes[i] = THREE.MathUtils.randFloat(0.5, 1.3);
    tints[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aTint", new THREE.BufferAttribute(tints, 1));
  return geometry;
}

export function Particles() {
  const materialRef = useRef<InstanceType<typeof ParticleMaterial>>(null);
  const { pointer, camera, gl } = useThree();

  const count = useMemo(
    () => (typeof window !== "undefined" && window.innerWidth < 768 ? 6000 : 20000),
    [],
  );
  const geometry = useMemo(() => createParticleGeometry(count), [count]);
  const pixelRatio = useMemo(() => Math.min(gl.getPixelRatio(), 2), [gl]);

  const mouseWorld = useMemo(() => new THREE.Vector3(9999, 9999, 0), []);
  const raycastVec = useMemo(() => new THREE.Vector3(), []);

  useFrame((_state, delta) => {
    const material = materialRef.current;
    if (!material) return;

    material.uTime += delta;

    raycastVec.set(pointer.x, pointer.y, 0.5).unproject(camera);
    const dir = raycastVec.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    mouseWorld.copy(camera.position).addScaledVector(dir, distance);

    material.uMouse3D = mouseWorld;
  });

  return (
    <points geometry={geometry}>
      <particleMaterial
        ref={materialRef}
        uPixelRatio={pixelRatio}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
