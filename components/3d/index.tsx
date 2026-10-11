"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { use3DQuality, type Quality3D } from "@/hooks/use-3d-quality";
import { cn } from "@/lib/utils";
import { SceneFallback } from "./SceneFallback";
import type { SceneShape } from "@/lib/content/types";

/*
 * Code-split entry points for every WebGL scene. Three.js and R3F are only
 * downloaded when a scene is about to enter the viewport on a device that
 * should render it; otherwise the 2D fallback is all that ships.
 */
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });
const SubsidiaryScene = dynamic(() => import("./SubsidiaryScene"), { ssr: false });

type GateProps = {
  className?: string;
  color?: string;
  children: (quality: Exclude<Quality3D, "off">, active: boolean) => React.ReactNode;
};

function SceneGate({ className, color, children }: GateProps) {
  const ref = useRef<HTMLDivElement>(null);
  const quality = use3DQuality();
  // Load a little before the scene scrolls in; pause rendering once it leaves.
  const near = useInView(ref, { once: true, margin: "200px" });
  const visible = useInView(ref, { margin: "50px" });
  const render = quality && quality !== "off" && near;

  return (
    <div ref={ref} className={cn("absolute inset-0", className)}>
      <SceneFallback color={color} className={cn("transition-opacity duration-1000", render && "opacity-0")} />
      {render && (
        <div className="absolute inset-0 animate-[fade-in_1.2s_ease-out_both]">{children(quality, visible)}</div>
      )}
    </div>
  );
}

export function HeroCanvas({ colors, className }: { colors: string[]; className?: string }) {
  return (
    <SceneGate className={className}>
      {(quality, active) => <HeroScene quality={quality} colors={colors} active={active} />}
    </SceneGate>
  );
}

export function SubsidiaryCanvas({
  shape,
  color,
  className,
}: {
  shape: SceneShape;
  color: string;
  className?: string;
}) {
  return (
    <SceneGate className={className} color={color}>
      {(quality, active) => <SubsidiaryScene quality={quality} shape={shape} color={color} active={active} />}
    </SceneGate>
  );
}
