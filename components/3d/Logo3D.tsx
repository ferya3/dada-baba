"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Detailed, Float } from "@react-three/drei";
import * as THREE from "three";

type Logo3DProps = {
  /** Satellite colours — one per subsidiary. */
  colors: string[];
  scale?: number;
};

function Emblem({ colors, detail }: { colors: string[]; detail: "high" | "low" }) {
  const satellites = useRef<THREE.Group>(null);
  const high = detail === "high";

  useFrame((_, delta) => {
    if (satellites.current) satellites.current.rotation.z += delta * 0.35;
  });

  return (
    <group>
      {/* Core: the holding */}
      <mesh>
        <icosahedronGeometry args={[0.9, high ? 1 : 0]} />
        <meshPhysicalMaterial
          color="#e8c27a"
          metalness={0.85}
          roughness={0.22}
          clearcoat={high ? 1 : 0}
          flatShading
          emissive="#3a2a0a"
        />
      </mesh>
      <mesh scale={1.04}>
        <icosahedronGeometry args={[0.9, high ? 1 : 0]} />
        <meshBasicMaterial color="#ffe3a3" wireframe transparent opacity={0.18} />
      </mesh>

      {/* Orbit ring + the five subsidiaries */}
      <group rotation={[Math.PI / 2.6, 0, 0]}>
        <mesh>
          <torusGeometry args={[1.9, 0.012, 8, high ? 160 : 48]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
        </mesh>
        <group ref={satellites}>
          {colors.map((color, i) => {
            const a = (i / colors.length) * Math.PI * 2;
            return (
              <mesh key={color + i} position={[Math.cos(a) * 1.9, Math.sin(a) * 1.9, 0]}>
                <sphereGeometry args={[0.16, high ? 32 : 12, high ? 32 : 12]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} toneMapped={false} />
              </mesh>
            );
          })}
        </group>
      </group>
    </group>
  );
}

/** Abstract holding emblem: a faceted core orbited by five glowing subsidiaries. Uses LOD by distance. */
export function Logo3D({ colors, scale = 1 }: Logo3DProps) {
  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
      <Detailed distances={[0, 14]} scale={scale}>
        <Emblem colors={colors} detail="high" />
        <Emblem colors={colors} detail="low" />
      </Detailed>
    </Float>
  );
}
