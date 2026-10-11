"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Quality3D } from "@/hooks/use-3d-quality";

export type SceneProps = { quality: Exclude<Quality3D, "off"> };

/** Deterministic PRNG so procedural geometry is identical on every load. */
export function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Pointer position normalised to [-1, 1], tracked on the window so overlays don't block it. */
function useWindowPointer() {
  const pointer = useRef(new THREE.Vector2());
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return pointer;
}

/** Group that eases its rotation toward the pointer, so the scene "looks" at the mouse. */
export function PointerRig({
  children,
  strength = 0.35,
  autoRotate = 0,
}: {
  children: React.ReactNode;
  strength?: number;
  /** Constant spin around Y in radians per second. */
  autoRotate?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const pointer = useWindowPointer();

  useFrame((_, delta) => {
    if (!group.current) return;
    const p = pointer.current;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, p.x * strength, 3, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -p.y * strength * 0.5, 3, delta);
    if (spin.current) spin.current.rotation.y += autoRotate * delta;
  });

  return (
    <group ref={group}>
      <group ref={spin}>{children}</group>
    </group>
  );
}

export const DPR = { lite: [1, 1.5] as [number, number], full: [1, 2] as [number, number] };
