"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { seeded } from "./shared";

type CityProps = { count: number; radius?: number; color?: string; seed?: number };

/** A ring-shaped skyline of abstract towers, drawn as one instanced mesh (a single draw call). */
export function City({ count, radius = 7, color = "#2a3142", seed = 7 }: CityProps) {
  const mesh = useRef<THREE.InstancedMesh>(null);

  const towers = useMemo(() => {
    const rand = seeded(seed);
    return Array.from({ length: count }, () => {
      const angle = rand() * Math.PI * 2;
      const dist = 2.6 + rand() * radius;
      const h = 0.4 + Math.pow(rand(), 2.2) * 4.2 * (1 - (dist - 2.6) / (radius * 1.4));
      const w = 0.25 + rand() * 0.4;
      return { x: Math.cos(angle) * dist, z: Math.sin(angle) * dist, h, w, accent: rand() > 0.88 };
    });
  }, [count, radius, seed]);

  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const dummy = new THREE.Object3D();
    const base = new THREE.Color(color);
    const accent = new THREE.Color("#e0b25b");
    towers.forEach((t, i) => {
      dummy.position.set(t.x, t.h / 2 - 1.6, t.z);
      dummy.scale.set(t.w, t.h, t.w);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      m.setColorAt(i, t.accent ? accent : base);
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [towers, color]);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry />
      <meshStandardMaterial metalness={0.6} roughness={0.35} />
    </instancedMesh>
  );
}
