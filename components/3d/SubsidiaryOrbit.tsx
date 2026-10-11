"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";
import type { SceneShape } from "@/lib/content/types";
import { useUIStore } from "@/store/ui";
import { PointerRig, type SceneProps } from "./shared";

export type OrbitItem = { slug: string; name: string; color: string; shape: SceneShape };

type OrbitProps = SceneProps & {
  items: OrbitItem[];
  /** Section scroll progress (0–1); drives the orbit's rotation. */
  progress: MotionValue<number>;
  active?: boolean;
};

function NodeGeometry({ shape }: { shape: SceneShape }) {
  switch (shape) {
    case "towers":
      return <boxGeometry args={[0.55, 0.9, 0.55]} />;
    case "crystal":
      return <octahedronGeometry args={[0.6, 0]} />;
    case "grid":
      return <icosahedronGeometry args={[0.55, 0]} />;
    case "waves":
      return <torusGeometry args={[0.42, 0.16, 12, 32]} />;
    case "rings":
      return <torusKnotGeometry args={[0.34, 0.11, 64, 10]} />;
  }
}

function OrbitNode({ item, angle, radius }: { item: OrbitItem; angle: number; radius: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const activeSlug = useUIStore((s) => s.activeSubsidiary);
  const setActive = useUIStore((s) => s.setActiveSubsidiary);
  const setCursor = useUIStore((s) => s.setCursor);
  const highlighted = hovered || activeSlug === item.slug;

  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.4;
    mesh.current.rotation.y += delta * 0.6;
    const target = highlighted ? 1.35 : 1;
    mesh.current.scale.setScalar(THREE.MathUtils.damp(mesh.current.scale.x, target, 8, delta));
  });

  return (
    <group position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
      <mesh
        ref={mesh}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          setActive(item.slug);
          setCursor("label", "مشاهده");
        }}
        onPointerOut={() => {
          setHovered(false);
          setActive(null);
          setCursor("default");
        }}
        onClick={() => {
          setCursor("default");
          router.push(`/subsidiaries/${item.slug}`);
        }}
      >
        <NodeGeometry shape={item.shape} />
        <meshStandardMaterial
          color={item.color}
          emissive={item.color}
          emissiveIntensity={highlighted ? 0.9 : 0.25}
          metalness={0.5}
          roughness={0.3}
          flatShading
        />
      </mesh>
      <Html center position={[0, -1, 0]} distanceFactor={9} zIndexRange={[10, 0]} style={{ pointerEvents: "none" }}>
        <span
          className="whitespace-nowrap rounded-full border border-white/10 bg-black/50 px-3 py-1 text-sm font-medium text-white backdrop-blur transition-opacity"
          style={{ opacity: highlighted ? 1 : 0.65 }}
        >
          {item.name}
        </span>
      </Html>
    </group>
  );
}

function Orbit({ items, progress }: Pick<OrbitProps, "items" | "progress">) {
  const group = useRef<THREE.Group>(null);
  const radius = 3.2;

  useFrame((state, delta) => {
    if (!group.current) return;
    // Scroll drives one full turn across the section, plus a slow idle drift.
    const target = progress.get() * Math.PI * 2 + state.clock.elapsedTime * 0.05;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, target, 4, delta);
  });

  return (
    <group ref={group}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.01, 8, 128]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
      </mesh>
      {items.map((item, i) => (
        <OrbitNode key={item.slug} item={item} angle={(i / items.length) * Math.PI * 2} radius={radius} />
      ))}
    </group>
  );
}

/** The five subsidiaries orbiting the holding core; scroll rotates the orbit, nodes link to each page. */
export default function SubsidiaryOrbit({ quality, items, progress, active = true }: OrbitProps) {
  return (
    <Canvas
      dpr={quality === "full" ? [1, 1.75] : 1}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 3.6, 10], fov: 45 }}
      gl={{ antialias: quality === "full", alpha: true }}
      aria-hidden
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 5]} intensity={2} />
      <pointLight position={[0, 0, 0]} intensity={18} color="#e0b25b" />

      <PointerRig strength={0.15}>
        <mesh>
          <icosahedronGeometry args={[0.85, quality === "full" ? 1 : 0]} />
          <meshPhysicalMaterial color="#e8c27a" metalness={0.85} roughness={0.2} flatShading emissive="#3a2a0a" />
        </mesh>
        <Orbit items={items} progress={progress} />
      </PointerRig>
    </Canvas>
  );
}
