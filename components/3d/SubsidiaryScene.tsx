"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import type { SceneShape } from "@/lib/content/types";
import { City } from "./City";
import { PointerRig, type SceneProps } from "./shared";

type SubsidiarySceneProps = SceneProps & { shape: SceneShape; color: string; active?: boolean };

/* Each subsidiary gets its own procedural form — no model downloads at all. */

function Towers({ color, lite }: { color: string; lite: boolean }) {
  return (
    <group position={[0, 0.6, 0]} scale={0.8}>
      <City count={lite ? 45 : 110} radius={5} color={color} seed={11} />
    </group>
  );
}

function Crystal({ color, lite }: { color: string; lite: boolean }) {
  return (
    <Float speed={2} rotationIntensity={1.2} floatIntensity={1.4}>
      <mesh scale={1.5}>
        <icosahedronGeometry args={[1, lite ? 4 : 16]} />
        <MeshDistortMaterial color={color} distort={0.35} speed={2} metalness={0.4} roughness={0.15} />
      </mesh>
      <mesh scale={2.2}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.15} />
      </mesh>
    </Float>
  );
}

/** A field of instanced cubes rippling like live data. */
function DataGrid({ color, lite }: { color: string; lite: boolean }) {
  const size = lite ? 16 : 28;
  const count = size * size;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    const m = mesh.current;
    if (!m) return;
    const t = clock.elapsedTime;
    let i = 0;
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        const px = (x - size / 2) * 0.32;
        const pz = (z - size / 2) * 0.32;
        const d = Math.hypot(px, pz);
        const h = (Math.sin(d * 1.6 - t * 1.8) + 1) * 0.5;
        dummy.position.set(px, h * 0.8 - 1, pz);
        dummy.scale.set(0.2, 0.15 + h * 1.4, 0.2);
        dummy.updateMatrix();
        m.setMatrixAt(i++, dummy.matrix);
      }
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} rotation={[0.35, Math.PI / 4, 0]}>
      <boxGeometry />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} metalness={0.3} roughness={0.4} />
    </instancedMesh>
  );
}

/** Wireframe sea surface — trade routes and logistics. */
function Waves({ color, lite }: { color: string; lite: boolean }) {
  const geometry = useRef<THREE.PlaneGeometry>(null);
  const base = useRef<Float32Array | null>(null);
  const segments = lite ? 40 : 90;

  useLayoutEffect(() => {
    const pos = geometry.current?.attributes.position;
    if (pos) base.current = Float32Array.from(pos.array as Float32Array);
  }, [segments]);

  useFrame(({ clock }) => {
    const g = geometry.current;
    if (!g || !base.current) return;
    const pos = g.attributes.position as THREE.BufferAttribute;
    const t = clock.elapsedTime;
    for (let i = 0; i < pos.count; i++) {
      const x = base.current[i * 3];
      const y = base.current[i * 3 + 1];
      pos.setZ(i, Math.sin(x * 0.8 + t) * 0.35 + Math.cos(y * 0.6 + t * 0.8) * 0.35);
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh rotation={[-Math.PI / 2.4, 0, 0]} position={[0, -1, 0]}>
      <planeGeometry ref={geometry} args={[16, 16, segments, segments]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.55} />
    </mesh>
  );
}

/** Concentric rings turning at different speeds — compounding growth. */
function Rings({ color, lite }: { color: string; lite: boolean }) {
  const group = useRef<THREE.Group>(null);
  const rings = lite ? 4 : 7;

  useFrame((_, delta) => {
    group.current?.children.forEach((ring, i) => {
      ring.rotation.x += delta * (0.15 + i * 0.06) * (i % 2 ? 1 : -1);
      ring.rotation.y += delta * (0.1 + i * 0.04);
    });
  });

  return (
    <group ref={group}>
      {Array.from({ length: rings }, (_, i) => (
        <mesh key={i}>
          <torusGeometry args={[0.8 + i * 0.42, 0.03 + (rings - i) * 0.006, 12, lite ? 64 : 160]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            metalness={0.7}
            roughness={0.25}
            transparent
            opacity={1 - i * 0.09}
          />
        </mesh>
      ))}
    </group>
  );
}

const shapes = { towers: Towers, crystal: Crystal, grid: DataGrid, waves: Waves, rings: Rings };

export default function SubsidiaryScene({ quality, shape, color, active = true }: SubsidiarySceneProps) {
  const Shape = shapes[shape];
  const lite = quality === "lite";

  return (
    <Canvas
      dpr={lite ? 1 : [1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 1.2, 8], fov: 45 }}
      gl={{ antialias: !lite, alpha: true }}
      aria-hidden
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} />
      <pointLight position={[-5, 1, -3]} intensity={25} color={color} />
      <PointerRig strength={0.35} autoRotate={shape === "towers" ? 0.06 : 0}>
        <Shape color={color} lite={lite} />
      </PointerRig>
    </Canvas>
  );
}
