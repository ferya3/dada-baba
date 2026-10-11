"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor, Sparkles } from "@react-three/drei";
import { useState } from "react";
import { City } from "./City";
import { Logo3D } from "./Logo3D";
import { DPR, PointerRig, type SceneProps } from "./shared";

/** Keeps the emblem clear of the (right-aligned, RTL) headline: left half on wide screens, above it on tall ones. */
function ResponsiveEmblem({ colors, full }: { colors: string[]; full: boolean }) {
  const { width, height } = useThree((s) => s.viewport);
  const wide = width / height > 1.1;
  return (
    <group position={wide ? [-width * 0.22, 0.6, 0] : [0, height * 0.3, -1]} scale={wide ? 1 : 0.6}>
      <Logo3D colors={colors} scale={full ? 1 : 0.85} />
    </group>
  );
}

type HeroSceneProps = SceneProps & { colors: string[]; active?: boolean };

/** Home hero: the holding emblem floating above an abstract, mouse-reactive skyline. */
export default function HeroScene({ quality, colors, active = true }: HeroSceneProps) {
  const full = quality === "full";
  const [dpr, setDpr] = useState(full ? 1.5 : 1);

  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 1.4, 9], fov: 42 }}
      gl={{ antialias: full, powerPreference: "high-performance", alpha: true }}
      aria-hidden
    >
      <PerformanceMonitor
        onIncline={() => setDpr((d) => Math.min(d + 0.25, DPR[quality][1]))}
        onDecline={() => setDpr(DPR[quality][0])}
      />
      <AdaptiveDpr pixelated />
      <fog attach="fog" args={["#11141c", 9, 22]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 4]} intensity={2.2} color="#ffe2b0" />
      <pointLight position={[-6, 2, -4]} intensity={30} color="#7c8cff" />
      <pointLight position={[0, 0.5, 2]} intensity={6} color="#e0b25b" />

      <PointerRig strength={0.4} autoRotate={0.04}>
        <ResponsiveEmblem colors={colors} full={full} />
        <City count={full ? 140 : 50} />
        {full && <Sparkles count={60} scale={[14, 6, 14]} size={2} speed={0.3} color="#ffe3a3" opacity={0.6} />}
      </PointerRig>
    </Canvas>
  );
}
